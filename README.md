<p align="center">
  <img src="icon.svg" alt="Bitcoin Family Dashboard Logo" width="21%">
</p>

# Bitcoin Family Dashboard on StartOS

> Everything not listed in this document should behave the same as upstream Bitcoin Family Dashboard.
> If a feature, setting, or behavior is not mentioned here, the upstream
> documentation is accurate and fully applicable — see the Documentation section of
> `instructions.md` for links.

## Overview

Bitcoin Family Dashboard is a fully client-side Bitcoin dashboard for tracking family BTC holdings, live prices, 24-hour changes, and historical performance. Originally built as a simple HTML dashboard, this package wraps it for StartOS with rich configuration via Actions & Config.

![Bitcoin Family Dashboard screenshot](screenshot.png)

### Key features

- **Live price** from your choice of source: **Coinbase Exchange**, **Binance**, **Bitstamp**, or a **Custom API**
- **Family members** — add, remove, and update members with BTC holdings and average cost basis
- **Custom avatars** — hover a member's avatar to upload a picture; auto center-crop to 150×150, resize, and JPEG-encode entirely in the browser
- **Three rotating charts** — 30-day, 1-year, and 10-year price history, rotating every 60 seconds with a log scale on the long view
- **Dark mode** — a pill toggle in the top-right (persisted in the browser), with a near-black chart theme
- **Pexels backgrounds** — optional rotating landscape photos (free API key required)
- **Watch-only wallets** — attach a Bitcoin output descriptor to a member; balances are pulled from your StartOS Bitcoin Core node when present, otherwise from the public mempool.space API

## Table of Contents

- [Overview](#overview)
- [Image and Container Runtime](#image-and-container-runtime)
- [Volume and Data Layout](#volume-and-data-layout)
- [File Models](#file-models)
- [Dependencies](#dependencies)
- [Network Access and Interfaces](#network-access-and-interfaces)
- [Installation and First-Run Flow](#installation-and-first-run-flow)
- [Actions](#actions)
- [Tasks](#tasks)
- [Health Checks](#health-checks)
- [Backups and Restore](#backups-and-restore)
- [Limitations and Differences](#limitations-and-differences)

## Image and Container Runtime

The service runs a custom image (built from the local `Dockerfile`, base `nginx:alpine`) serving the static dashboard from `bitcoinfamily/`. The web subcontainer runs two processes: **nginx** (serves the site, proxies outbound API calls so browsers never hit CORS or expose API keys) and the **wallet-helper** (a small Node process on internal port 8090 that derives watch-only wallet addresses and queries balances). The image entrypoint seeds a default `config.json` on first boot (Satoshi, 0.125 BTC @ $40k cost basis) via a `/docker-entrypoint.d` hook.

## Volume and Data Layout

| Volume | Mount | Purpose |
|--------|-------|---------|
| `main` | `/data` | Persistent `config.json` — dashboard configuration |

## File Models

- **`config.json`** (file model `store.json.ts` → `/data/config.json` on the `main` volume) — the single dashboard configuration file: family members (name, BTC amount, cost basis), price source, Pexels settings, and watch-only wallet bindings. Seeded on first install (via init) with a default Satoshi member and Coinbase as the price source. **Ownership:** written exclusively through the StartOS **Actions** menu; the package does not re-assert values on restart. A hand-edit to the file survives a restart but can be overwritten the next time an action writes it.

## Dependencies

- **Bitcoin Core** (`bitcoind`) — **optional**. When installed, its RPC bridge is used to fetch watch-only wallet balances (fast, private) via the mounted `.cookie`. When absent, the package falls back to public address APIs (mempool.space, blockstream.info, blockcypher.com, blockchain.info) with automatic failover. The dependency is optional and never blocks startup.

## Network Access and Interfaces

- **Web UI** — the dashboard, exposed as a `ui` interface on port 80.
- Outbound HTTP from the container: price APIs (Coinbase Exchange, Binance, Bitstamp, custom), Pexels API for backgrounds, and chart data providers.

## Installation and First-Run Flow

Install via **Sideload Service**. On first start the container seeds `config.json` with a default Satoshi member, then serves the dashboard. Configure members, price source, background rotation, and dark mode from the Actions menu.

## Actions

| Action | Purpose |
|--------|---------|
| **Add Family Member** | Add a member with name, BTC holdings, and average cost basis |
| **Remove Family Member** | Remove an existing member |
| **Update Family Member** | Change BTC holdings or cost basis |
| **Configure Price Source** | Pick Coinbase Exchange (default), Binance, Bitstamp, or a Custom API |
| **Configure Background** | Enable/disable rotating Pexels landscape backgrounds and set the API key |
| **Watch-Only Wallet** | Attach a Bitcoin output descriptor to a member; balances from Bitcoin Core or mempool.space |

## Tasks

None.

## Health Checks

- **Web Interface** (`web`) — verifies nginx is listening on port 80. A failure here means the dashboard itself is not being served.
- **Watch-only wallet scan** (`watch-scan`) — queries the internal wallet-helper (`127.0.0.1:8090/api/scan-status`) from inside the web subcontainer. Reports:
  - **loading** (animated indicator) while a watch-only balance scan is in progress — including the long first scan against rate-limited public APIs when no Bitcoin Core is installed;
  - **success** (green check) when the scan is idle (balance resolved or no watch-only wallets configured);
  - **failure** (red triangle) when the wallet-helper is unreachable or returns an invalid response.

  Requires the `web` daemon to be up. A `failure` immediately after install/restart usually means the helper is still starting — it clears on the next poll once the helper is listening.

## Backups and Restore

**Strategy:** the `main` volume is snapshotted wholesale (`sdk.Backups.ofVolumes('main')`). It holds `config.json` — family members, price source, Pexels settings, and watch-only wallet descriptors — so those are included in backups and restored on restore.

**Not backed up:** custom member avatars live in browser `localStorage` (per-device, client-side) and are intentionally not part of the StartOS volume — they are not captured in backups and are not restored. A restored instance has everything else (config, members, watch-only descriptors) and re-derives balances from the configured source on the next scan.

## Limitations and Differences

- Price source 24-hour change: Coinbase Exchange and Binance do not provide a 24h-change figure in their simple ticker responses, so the dashboard derives it from the spot price 24 hours ago. Bitstamp provides `percent_change_24` directly.
- Custom avatars are stored in browser `localStorage` (per-device), not in `config.json`, so they are not included in StartOS backups.

---

## Quick Reference for AI Consumers

```yaml
package_id: 'bitcoin-family-dashboard'
image:
  - bitcoin-family-dashboard (built from local Dockerfile — nginx:alpine base with custom entrypoint + templates)
architectures:
  - x86_64
  - aarch64
subcontainers:
  - web (nginx + wallet-helper, port 80)
volumes:
  - main (config.json)
file_models:
  - config.json
startos_managed_env_vars:
  - PRICE_UPSTREAM
  - PRICE_HOST
  - PEXELS_API_KEY
  - BITCOIND_RPC
dependencies:
  - bitcoind (optional — provides RPC + cookie for watch-only balances)
interfaces:
  - ui (port 80)
actions:
  - add-member
  - remove-member
  - update-member
  - configure-price-source
  - configure-background
  - configure-watch-only-wallet
tasks: []
health_checks:
  - web (port 80)
  - watch-scan (wallet-helper scan status)
```

---

## License

This project is licensed under the [Blue Oak Model License 1.0.0](LICENSE).
