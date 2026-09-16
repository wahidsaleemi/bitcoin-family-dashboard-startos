import { rpcHostId, rpcPort } from 'bitcoin-core-startos/startos/utils'
import {
  configJson,
  FamilyMember,
  WatchOnlyWallet,
} from '../fileModels/config.json'
import { i18n } from '../i18n'
import { sdk } from '../sdk'

const { InputSpec, List, Value, Variants } = sdk

const inputSpec = InputSpec.of({
  members: Value.list(
    List.obj(
      {
        name: i18n('Family Members'),
        description: i18n(
          'Everyone shown on the dashboard. Each member has a display name, an average purchase price, and holdings that are either entered by hand or read from a watch-only wallet.',
        ),
        maxLength: 6,
      },
      {
        displayAs: '{{name}}',
        uniqueBy: 'name',
        spec: InputSpec.of({
          name: Value.text({
            name: i18n('Name'),
            description: i18n('The display name for this family member'),
            required: true,
            default: null,
          }),
          avgCost: Value.number({
            name: i18n('Average Cost Basis'),
            description: i18n('Average purchase price per BTC, in USD'),
            required: true,
            default: 0,
            min: 0,
            integer: false,
            units: 'USD',
          }),
          holdings: Value.union({
            name: i18n('Holdings'),
            description: i18n(
              'Enter the amount by hand, or attach a watch-only wallet and let the dashboard read the on-chain balance.',
            ),
            default: 'manual',
            variants: Variants.of({
              manual: {
                name: i18n('Entered manually'),
                spec: InputSpec.of({
                  btcAmount: Value.number({
                    name: i18n('BTC Amount'),
                    description: i18n('Total bitcoin held by this member'),
                    required: true,
                    default: 0,
                    min: 0,
                    max: 21000000,
                    integer: false,
                    units: 'BTC',
                  }),
                }),
              },
              watchOnly: {
                name: i18n('Watch-only wallet'),
                spec: InputSpec.of({
                  descriptor: Value.textarea({
                    name: i18n('Output Descriptor'),
                    description: i18n(
                      "The wallet's output descriptor, e.g. wpkh(xpub...) — also accepts pkh, sh(wpkh), tr, wsh(sortedmulti(...)), or a bare xpub. Only public keys; never paste a private key.",
                    ),
                    required: true,
                    default: null,
                    placeholder: 'wpkh(xpub...)',
                  }),
                  source: Value.select({
                    name: i18n('Balance Source'),
                    description: i18n(
                      'Bitcoin on this server is instant and private, and never falls back to a public API. Public address APIs are rate-limited, so a first scan can take hours.',
                    ),
                    default: 'bitcoind',
                    values: {
                      bitcoind: i18n('Bitcoin on this server'),
                      mempool: i18n('Public address APIs'),
                    },
                  }),
                }),
              },
            }),
          }),
        }),
      },
    ),
  ),
})

export const manageFamilyMembers = sdk.Action.withInput(
  'manage-family-members',
  {
    name: i18n('Manage Family Members'),
    description: i18n(
      'Add, remove, and edit the family members shown on the dashboard, including their holdings and watch-only wallets',
    ),
    warning: null,
    allowedStatuses: 'any',
    group: null,
    visibility: 'enabled',
  },
  inputSpec,
  async () => {
    const config = await configJson.read().once()
    const wallets = new Map(
      config?.watchOnlyWallets.map((w) => [w.memberName, w]) ?? [],
    )
    return {
      members: (config?.familyMembers ?? []).map((m) => {
        const wallet = wallets.get(m.name)
        return {
          name: m.name,
          avgCost: m.avgCost,
          holdings: wallet
            ? {
                selection: 'watchOnly' as const,
                value: { descriptor: wallet.descriptor, source: wallet.source },
              }
            : {
                selection: 'manual' as const,
                value: { btcAmount: m.btcAmount },
              },
        }
      }),
    }
  },
  async ({ effects, input }) => {
    const existing = new Map(
      (await configJson.read((c) => c.familyMembers).once())?.map((m) => [
        m.name,
        m,
      ]) ?? [],
    )
    const familyMembers: FamilyMember[] = []
    const watchOnlyWallets: WatchOnlyWallet[] = []
    for (const m of input.members) {
      const name = m.name.trim()
      if (!name) throw new Error(i18n('Every family member needs a name'))
      if (familyMembers.some((f) => f.name === name)) {
        throw new Error(i18n('Two family members cannot share a name'))
      }
      const member = {
        name,
        avatar: existing.get(name)?.avatar ?? '',
        btcAmount: existing.get(name)?.btcAmount ?? 0,
        avgCost: m.avgCost,
      }
      if (m.holdings.selection === 'manual') {
        member.btcAmount = m.holdings.value.btcAmount
      } else {
        const descriptor = m.holdings.value.descriptor.trim()
        if (!descriptor)
          throw new Error(
            i18n('A watch-only wallet needs an output descriptor'),
          )
        watchOnlyWallets.push({
          memberName: name,
          descriptor,
          source: m.holdings.value.source,
        })
      }
      familyMembers.push(member)
    }
    if (
      watchOnlyWallets.some((w) => w.source === 'bitcoind') &&
      !(await sdk.host
        .getBridgeAddress(effects, {
          packageId: 'bitcoind',
          hostId: rpcHostId,
          internalPort: rpcPort,
          ssl: false,
        })
        .once())
    ) {
      throw new Error(
        i18n(
          'Bitcoin is not installed on this server. Install it first, or choose Public address APIs as the balance source.',
        ),
      )
    }
    await configJson.merge(effects, { familyMembers, watchOnlyWallets })
  },
)
