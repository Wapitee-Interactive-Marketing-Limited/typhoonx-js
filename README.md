# TyphoonX JS

JavaScript packages that send TyphoonX storefront events from Shopify Hydrogen.

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

Also update `app/entry.server.tsx` to allow TyphoonX in the content security policy:

```javascript
const {nonce, header, NonceProvider} = createContentSecurityPolicy({
  shop: {
    checkoutDomain: context.env.PUBLIC_CHECKOUT_DOMAIN,
    storeDomain: context.env.PUBLIC_STORE_DOMAIN,
  },
  connectSrc: ['https://spell.typhoonx.io'], // add this line
});
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

## License

[MIT](./LICENSE) © Wapitee Interactive
