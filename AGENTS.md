# AGENTS.md

This is a StartOS service-package repository — it builds a `.s9pk` for StartOS
from the vendored dashboard application.

## Repo layout

- `startos/` — the StartOS SDK package code (manifest, actions, daemons, health checks)
- `bitcoinfamily/` — the vendored dashboard web app (static site; the Docker build context)
- `Dockerfile`, `nginx-templates/`, `docker-entrypoint.d/`, `wallet-helper.mjs` — image build + runtime
- `instructions.md` — user-facing docs (packed into the .s9pk)
- `README.md` — technical reference; keep in step with `instructions.md` on every change

The packaged dashboard app is developed separately in
`wahidsaleemi/bitcoin-family-dashboard` (inspired by `btcframe/bitcoinfamily`).
It is vendored into `bitcoinfamily/` here; there are no upstream releases to
track — see `UPDATING.md`.

## Conventions

- Default branch is `master` (Start9 community convention). Work on a branch,
  open a PR to `master`.
- Release tags follow StartOS ExVer: `v<version>_<wrapper_rev>`, e.g. `v0.2.1_0`.
  The manifest version in `startos/versions/current.ts` must match
  (`0.2.1:0` ↔ tag `v0.2.1_0`).
- Do not bump the package version for local dev-box-only changes — only when a
  release is actually cut.
- CI (`.github/workflows/`) delegates to `Start9Labs/start-technologies` and only
  publishes once this repo lives in the Start9-Community org with secrets set.
- Fix defects you spot rather than filing issues. Keep `README.md` and
  `instructions.md` in sync with code changes.
