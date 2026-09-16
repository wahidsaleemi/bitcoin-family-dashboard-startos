export const DEFAULT_LANG = 'en_US'

const dict = {
  // main.ts
  'Starting Bitcoin Family Dashboard!': 0,
  'Web Interface': 1,
  'The web interface is ready': 2,
  'The web interface is not ready': 3,
  'The wallet helper is ready': 4,
  'The wallet helper is not ready': 5,
  'Watch-Only Wallets': 6,
  'No watch-only wallets are configured': 7,
  'The wallet helper is not responding': 8,
  'Scanning for watch-only wallet balances. Public address APIs are rate-limited, so a first scan can take hours.': 9,
  'Watch-only wallet balances are up to date': 10,

  // interfaces.ts
  'Web UI': 11,
  'The Bitcoin Family Dashboard web interface': 12,

  // actions/manageFamilyMembers.ts
  'Family Members': 13,
  'Everyone shown on the dashboard. Each member has a display name, an average purchase price, and holdings that are either entered by hand or read from a watch-only wallet.': 14,
  Name: 15,
  'The display name for this family member': 16,
  'Average Cost Basis': 17,
  'Average purchase price per BTC, in USD': 18,
  Holdings: 19,
  'Enter the amount by hand, or attach a watch-only wallet and let the dashboard read the on-chain balance.': 20,
  'Entered manually': 21,
  'BTC Amount': 22,
  'Total bitcoin held by this member': 23,
  'Watch-only wallet': 24,
  'Output Descriptor': 25,
  "The wallet's output descriptor, e.g. wpkh(xpub...) — also accepts pkh, sh(wpkh), tr, wsh(sortedmulti(...)), or a bare xpub. Only public keys; never paste a private key.": 26,
  'Balance Source': 27,
  'Bitcoin on this server is instant and private, and never falls back to a public API. Public address APIs are rate-limited, so a first scan can take hours.': 28,
  'Bitcoin on this server': 29,
  'Public address APIs': 30,
  'Manage Family Members': 31,
  'Add, remove, and edit the family members shown on the dashboard, including their holdings and watch-only wallets': 32,
  'Every family member needs a name': 33,
  'Two family members cannot share a name': 34,
  'A watch-only wallet needs an output descriptor': 35,

  // actions/configureDashboard.ts
  'Dashboard Title': 36,
  'The heading shown at the top of the dashboard': 37,
  'Price Source': 38,
  'Where the live BTC price comes from': 39,
  'Coinbase Exchange': 40,
  Binance: 41,
  Bitstamp: 42,
  'Custom API': 43,
  'API URL': 44,
  'An HTTPS endpoint returning JSON with either {"price": ..., "change24h": ...} or the CoinGecko shape {"bitcoin": {"usd": ..., "usd_24h_change": ...}}': 45,
  'Must be an http:// or https:// URL': 46,
  'Rotating Background Photos': 47,
  'Fetch a new landscape photo from Pexels every few minutes. Needs a free Pexels API key.': 48,
  'Pexels API Key': 49,
  'Create a free key at https://www.pexels.com/api/': 50,
  'Configure Dashboard': 51,
  'Set the dashboard title, the price source, and background photos': 52,
  'Background photos need a Pexels API key': 53,
  'The custom price API URL is not a valid URL': 54,
  'A watch-only wallet reads its balance from Bitcoin, but Bitcoin is not installed': 55,
  'Bitcoin is rescanning the chain for ${member} (${progress}%)': 56,
  'Bitcoin is not installed on this server. Install it first, or choose Public address APIs as the balance source.': 57,
} as const

/**
 * Plumbing. DO NOT EDIT.
 */
export type I18nKey = keyof typeof dict
export type LangDict = Record<(typeof dict)[I18nKey], string>
export default dict
