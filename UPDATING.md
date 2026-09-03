# Updating the upstream version

## Determining the upstream version

This package vendors the Bitcoin Family Dashboard web application as a static
site in `bitcoinfamily/`. The application has no tagged upstream releases — it
is developed in the
[wahidsaleemi/bitcoin-family-dashboard](https://github.com/wahidsaleemi/bitcoin-family-dashboard)
repository (inspired by `btcframe/bitcoinfamily`, but substantially rewritten).
The packaged dashboard tracks the `master` branch of that repository.

To check whether the vendored copy is current:

```sh
gh release view -R wahidsaleemi/bitcoin-family-dashboard --json tagName -q .tagName
# or, for the latest commit:
gh api repos/wahidsaleemi/bitcoin-family-dashboard/commits/master --jq .sha
```

## Applying the bump

1. Sync `bitcoinfamily/` from the app repository (it is the Docker build context
   for the `bitcoin-family-dashboard` image — see `Dockerfile`):
   ```sh
   rsync -a --delete /path/to/bitcoin-family-dashboard/ bitcoinfamily/
   ```
   Keep the app's `index.html`, `assets/`, `images/`, `btc.png`, `favicon.png`,
   and `screenshot.png`. Do **not** copy packaging files (`startos/`, `Dockerfile`,
   `*.md` docs, etc.) into `bitcoinfamily/`.

2. If the app's behavior changed in a user-visible way, update `instructions.md`
   and `README.md` to match.

3. Bump the package version in `startos/versions/current.ts` following the
   [StartOS version rules](https://docs.start9.com/packaging/0.4.0.x/versions.html),
   add release notes in all five languages, and tag `v<version>_0` per the
   [Git Tag Conventions](https://docs.start9.com/packaging/0.4.0.x/versions.html#git-tag-conventions).
