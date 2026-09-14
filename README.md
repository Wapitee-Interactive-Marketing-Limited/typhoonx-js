# TyphoonX JS

JavaScript packages that send TyphoonX storefront events from Shopify Hydrogen.

This repository is a pnpm monorepo. The publishable package lives in [`packages/typhoonx-hydrogen`](./packages/typhoonx-hydrogen).

## Packages

| Package                                                      | Description                                                     |
| ------------------------------------------------------------ | --------------------------------------------------------------- |
| [`@wapitee/typhoonx-hydrogen`](./packages/typhoonx-hydrogen) | Hydrogen `useAnalytics` subscriber that beacons TyphoonX events |

## `@wapitee/typhoonx-hydrogen`

Install the package in a Hydrogen storefront:

```bash
pnpm add @wapitee/typhoonx-hydrogen
```

Peer dependencies: `react` ^18.3.1 and `@shopify/hydrogen` >=2025.5.1.

Render the default export **inside** Hydrogen `Analytics.Provider`. The component renders nothing.

```tsx
import {Analytics} from '@shopify/hydrogen';
import TyphoonX from '@wapitee/typhoonx-hydrogen';

export function App() {
  return (
    <Analytics.Provider cart={cart} consent={consent} shop={shop}>
      <TyphoonX merchantId="TPX-XXXXXX" shopId="123456789" />
      {/* storefront */}
    </Analytics.Provider>
  );
}
```

### Props

| Prop           | Type     | Required | Description                                                                                                 |
| -------------- | -------- | -------- | ----------------------------------------------------------------------------------------------------------- |
| `merchantId`   | `string` | yes      | TyphoonX account key (`TPX-…`)                                                                              |
| `shopId`       | `string` | yes      | Shopify shop numeric id                                                                                     |
| `cookieDomain` | `string` | no       | Cookie `Domain` for a first-party client id. Omit for a host-only cookie (recommended on `*.myshopify.com`) |

### Events

Hydrogen analytics events map to TyphoonX events and are sent with `navigator.sendBeacon` to `https://spell.typhoonx.io/api/v1/receive`:

| Hydrogen                | TyphoonX      |
| ----------------------- | ------------- |
| `page_viewed`           | `page_view`   |
| `product_viewed`        | `view_item`   |
| `product_added_to_cart` | `add_to_cart` |

Checkout and purchase are not collected here; those belong on the Shopify checkout domain.

Payloads are gated by Hydrogen `canTrack()` (Customer Privacy). If analytics processing is not allowed, nothing is sent.

An anonymous client id is stored in the `__typhoon_client_id` cookie (`Max-Age` one year, `SameSite=Lax`, `Secure` on HTTPS).

## Develop

```bash
pnpm install
pnpm --filter @wapitee/typhoonx-hydrogen build
pnpm lint
```

Requires [pnpm](https://pnpm.io) 11 and Node.js 20 or later.

## Release

This repo versions and publishes with [Changesets](https://github.com/changesets/changesets).

1. After a user-facing change: `pnpm changeset`, then commit the file under `.changeset/`.
2. Merging to `main` opens or updates a **Version Packages** pull request.
3. Merging that PR publishes `@wapitee/typhoonx-hydrogen` from [`.github/workflows/release.yml`](./.github/workflows/release.yml).

Publishing uses [npm Trusted Publishing](https://docs.npmjs.com/trusted-publishers) (OIDC). There is no `NPM_TOKEN` secret.

On [npmjs.com](https://www.npmjs.com) for `@wapitee/typhoonx-hydrogen` (or the `wapitee` org), add a trusted publisher:

| Field             | Value                                   |
| ----------------- | --------------------------------------- |
| Provider          | GitHub Actions                          |
| Organization      | `Wapitee-Interactive-Marketing-Limited` |
| Repository        | `typhoonx-js`                           |
| Workflow filename | `release.yml`                           |
| Allowed actions   | `npm publish`                           |

In the GitHub repo, under **Settings → Actions → General**:

- Workflow permissions: **Read and write**
- Enable **Allow GitHub Actions to create and approve pull requests**

The first publish of a brand-new package name may require creating the empty package on npm (or a one-time granular token publish). After that, only this workflow can publish.

## License

[MIT](./LICENSE) © Wapitee Interactive
