# Bitcoin Family Dashboard (StartOS Package)

This directory holds supplementary files for the Bitcoin Family Dashboard
StartOS package.

## Contents

- The Docker build context for the dashboard image is `bitcoinfamily/` at the
  package root (see `Dockerfile`), not this directory.

## Upstream

The dashboard application is developed in
[wahidsaleemi/bitcoin-family-dashboard](https://github.com/wahidsaleemi/bitcoin-family-dashboard)
and vendored into `bitcoinfamily/` for packaging. See `UPDATING.md` for how to
refresh the vendored copy.
