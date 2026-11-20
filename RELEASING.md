# Releasing (for maintainers)

This file is not part of the npm package (see `.npmignore`).

## Steps

1. Start from a clean, up to date `main`: `git switch main && git pull`
2. Bump the version. This commits and creates the tag `vX.Y.Z`:

   ```sh
   npm version patch -m "NOJIRA: Releasing version %s"   # or: minor / major
   ```

3. Push the commit and the tag: `git push --follow-tags`
4. Create the GitHub Release for the tag: `gh release create vX.Y.Z --generate-notes`
   (or on the website: **Releases** → **Draft a new release** → choose the tag → **Publish release**)
5. Publish to npm: `npm run publish:npm` (interactive login and 2FA)

A version cannot be published twice, even after `npm unpublish`: always bump the version first.

## The publish workflow (not used yet)

`.github/workflows/publish.yml` is meant to publish to npm when a GitHub Release is published, with npm trusted publishing (OIDC) instead of a token. It has never run yet. Until it is set up and tested, step 5 is done by hand, and the workflow run started by the Release fails at its publish step (harmless).

Setup on npmjs.com → package **Settings** → **Trusted Publisher** → GitHub Actions: owner `inebhedj`, repository `ih-warp`, workflow filename `publish.yml`, no environment. Only **allow npm publish** is needed. The workflow checks that the release tag equals `v` + the `package.json` version.
