# AGENTS.md

This is a StartOS service-package repository — it builds a `.s9pk` for StartOS.

Develop it inside a StartOS packaging workspace created by `start-cli s9pk init-workspace`,
which provides the packaging guide and agent context one level up. If you're reading this in a
bare clone with no workspace, the full guide is at <https://docs.start9.com/packaging>.

**Start every task at the recipe index** — `../start-technologies/projects/start-sdk/docs/src/recipes.md`
(or <https://docs.start9.com/packaging/recipes.html>). It maps an intent ("prompt the user to create
admin credentials", "expose a web UI") to the constructs, the reference pages, and a named production
package to copy. Find the recipe before you read this package's neighbours: a package you reach by
grepping may be non-conformant, and the recipe outranks it.

Freshly scaffolded? Work the
[New Package Checklist](../start-technologies/projects/start-sdk/docs/src/new-package-checklist.md)
(or <https://docs.start9.com/packaging/new-package-checklist.html>) from top to bottom. It is a
guide page, not a file in this repo — read it, don't copy it in.

Keep `README.md` (technical reference for an AI support or administering agent) and
`instructions.md` (end-user docs) in sync with your changes.

**Bugs and feature requests are GitHub issues on this repo** — file them as you find them.
Don't record work in the repo instead: no `TODO.md`, no `NOTES.md`, no `PLAN.md`. What you
verified, tried, and decided belongs in the commit message and the PR body.

## This repo

- **The application is the `bitcoin-family-dashboard/` submodule and is never edited here.** Fixes to
  the page go to <https://github.com/wahidsaleemi/bitcoin-family-dashboard>; this repo moves the pin.
  `wallet-helper/` is this package's own code and is edited here.
- **`config.json` is served to the browser verbatim** (`location = /config.json` in
  `nginx-templates/default.conf.template`), so nothing that must stay private can go in it.
- **A bitcoind-backed balance imports the descriptor with `timestamp: 0`.** That is a full rescan
  on the user's node and the cost the README documents; don't "speed it up" with `'now'`, which
  silently drops every pre-existing coin.
