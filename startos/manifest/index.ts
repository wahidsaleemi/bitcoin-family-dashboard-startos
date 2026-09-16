import { setupManifest } from '@start9labs/start-sdk'
import { bitcoindDescription, long, short } from './i18n'

export const manifest = setupManifest({
  id: 'bitcoin-family-dashboard',
  title: 'Bitcoin Family Dashboard',
  license: 'BlueOak-1.0.0',
  packageRepo:
    'https://github.com/Start9-Community/bitcoin-family-dashboard-startos',
  upstreamRepo: 'https://github.com/wahidsaleemi/bitcoin-family-dashboard',
  marketingUrl: 'https://github.com/wahidsaleemi/bitcoin-family-dashboard',
  donationUrl: 'https://coinos.io/pay/wahid',
  description: { short, long },
  volumes: ['main'],
  images: {
    dashboard: {
      source: { dockerBuild: {} },
      arch: ['x86_64', 'aarch64'],
    },
  },
  dependencies: {
    bitcoind: {
      description: bitcoindDescription,
      optional: true,
      metadata: {
        title: 'Bitcoin',
        icon: 'https://raw.githubusercontent.com/Start9Labs/bitcoin-core-startos/refs/heads/31.x/dep-icon.svg',
      },
    },
  },
})
