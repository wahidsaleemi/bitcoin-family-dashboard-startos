import { configJson } from './fileModels/config.json'
import { sdk } from './sdk'

export const setDependencies = sdk.setupDependencies(async ({ effects }) => {
  const usesBitcoind = await configJson
    .read((c) => c.watchOnlyWallets.some((w) => w.source === 'bitcoind'))
    .const(effects)

  return usesBitcoind
    ? {
        bitcoind: {
          kind: 'running',
          versionRange: '>=28.4:14',
          healthChecks: ['bitcoind', 'sync-progress'],
        },
      }
    : {}
})
