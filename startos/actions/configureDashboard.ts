import { configJson, defaultTitle } from '../fileModels/config.json'
import { i18n } from '../i18n'
import { sdk } from '../sdk'

const { InputSpec, Value, Variants } = sdk

const inputSpec = InputSpec.of({
  title: Value.text({
    name: i18n('Dashboard Title'),
    description: i18n('The heading shown at the top of the dashboard'),
    required: true,
    default: defaultTitle,
  }),
  priceSource: Value.union({
    name: i18n('Price Source'),
    description: i18n('Where the live BTC price comes from'),
    default: 'coinbase',
    variants: Variants.of({
      coinbase: { name: i18n('Coinbase Exchange'), spec: InputSpec.of({}) },
      binance: { name: i18n('Binance'), spec: InputSpec.of({}) },
      bitstamp: { name: i18n('Bitstamp'), spec: InputSpec.of({}) },
      custom: {
        name: i18n('Custom API'),
        spec: InputSpec.of({
          apiUrl: Value.text({
            name: i18n('API URL'),
            description: i18n(
              'An HTTPS endpoint returning JSON with either {"price": ..., "change24h": ...} or the CoinGecko shape {"bitcoin": {"usd": ..., "usd_24h_change": ...}}',
            ),
            required: true,
            default: null,
            placeholder: 'https://example.com/btc-price',
            patterns: [
              {
                regex: '^https?://.+',
                description: i18n('Must be an http:// or https:// URL'),
              },
            ],
          }),
        }),
      },
    }),
  }),
  pexelsEnabled: Value.toggle({
    name: i18n('Rotating Background Photos'),
    description: i18n(
      'Fetch a new landscape photo from Pexels every few minutes. Needs a free Pexels API key.',
    ),
    default: false,
  }),
  pexelsApiKey: Value.text({
    name: i18n('Pexels API Key'),
    description: i18n('Create a free key at https://www.pexels.com/api/'),
    required: false,
    default: null,
    masked: true,
  }),
})

export const configureDashboard = sdk.Action.withInput(
  'configure-dashboard',
  {
    name: i18n('Configure Dashboard'),
    description: i18n(
      'Set the dashboard title, the price source, and background photos',
    ),
    warning: null,
    allowedStatuses: 'any',
    group: null,
    visibility: 'enabled',
  },
  inputSpec,
  async () => {
    const config = await configJson.read().once()
    if (!config) return {}
    return {
      title: config.title,
      priceSource:
        config.priceSource.type === 'custom'
          ? {
              selection: 'custom' as const,
              value: { apiUrl: config.priceSource.apiUrl },
            }
          : { selection: config.priceSource.type, value: {} },
      pexelsEnabled: config.pexels.enabled,
      pexelsApiKey: config.pexels.apiKey || null,
    }
  },
  async ({ effects, input }) => {
    const apiKey = input.pexelsApiKey?.trim() ?? ''
    if (input.pexelsEnabled && !apiKey) {
      throw new Error(i18n('Background photos need a Pexels API key'))
    }
    const apiUrl =
      input.priceSource.selection === 'custom'
        ? input.priceSource.value.apiUrl.trim()
        : ''
    if (apiUrl) {
      try {
        new URL(apiUrl)
      } catch {
        throw new Error(i18n('The custom price API URL is not a valid URL'))
      }
    }
    await configJson.merge(effects, {
      title: input.title.trim() || defaultTitle,
      priceSource: { type: input.priceSource.selection, apiUrl },
      pexels: { enabled: input.pexelsEnabled, apiKey },
    })
  },
)
