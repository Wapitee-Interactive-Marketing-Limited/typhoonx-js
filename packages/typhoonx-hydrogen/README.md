# @wapitee/typhoonx-hydrogen

Hydrogen `useAnalytics` subscriber that sends TyphoonX storefront events.

This is not a Shopify Web Pixel. Place it in a Hydrogen storefront, inside `Analytics.Provider`.

## Install

```bash
pnpm add @wapitee/typhoonx-hydrogen
```

Peer dependencies: `react` ^18.3.1 and `@shopify/hydrogen` >=2025.5.1. Node.js 20 or later.

## Usage

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

The component renders `null`.

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

```ts
import type {TyphoonXProps} from '@wapitee/typhoonx-hydrogen';
```

### Events

| Hydrogen                | TyphoonX      |
| ----------------------- | ------------- |
| `page_viewed`           | `page_view`   |
| `product_viewed`        | `view_item`   |
| `product_added_to_cart` | `add_to_cart` |

Beacons go to `https://spell.typhoonx.io/api/v1/receive`. Checkout and purchase are out of scope.

Sends are gated by Hydrogen `canTrack()` (Customer Privacy). The anonymous visitor id lives in `__typhoon_client_id` (one year, `SameSite=Lax`, `Secure` on HTTPS).

## License

[MIT](./LICENSE) © Wapitee Interactive
