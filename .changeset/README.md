# Changesets

This repo uses [Changesets](https://github.com/changesets/changesets) to version and publish `@wapitee/*` packages.

1. After a user-facing change, run `pnpm changeset` and commit the generated file under `.changeset/`.
2. Merging that file to `main` opens or updates a **Version Packages** pull request.
3. Merging the Version Packages PR publishes to npm from GitHub Actions.
