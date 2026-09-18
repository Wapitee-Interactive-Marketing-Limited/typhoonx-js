# TyphoonX for Shopify Hydrogen

[![npm package](https://img.shields.io/npm/v/@wapitee/typhoonx-hydrogen?style=flat-square)](https://www.npmjs.com/package/@wapitee/typhoonx-hydrogen)
[![MIT License](https://img.shields.io/badge/License-MIT-red.svg?style=flat-square)](https://opensource.org/licenses/MIT)

Hydrogen `useAnalytics` subscriber that sends TyphoonX storefront events.

## Install

```bash
npm install --save @wapitee/typhoonx-hydrogen
```

## Usage

```tsx
// app/root.tsx
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

If your Shopify Hydrogen project sets a Content-Security-Policy, add `https://spell.typhoonx.io` to `connect-src` so event collection is not blocked.

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

| Prop           | Type     | Required | Description                                                                                                       |
| -------------- | -------- | -------- | ----------------------------------------------------------------------------------------------------------------- |
| `merchantId`   | `string` | yes      | TyphoonX merchant ID (`TPX-…`)                                                                                    |
| `shopId`       | `string` | yes      | Shopify store ID                                                                                                  |
| `cookieDomain` | `string` | no       | Cookie `Domain` for a first-party client id. Defaults to the current hostname's apex domain (e.g. `.example.com`) |

## License

[MIT](./LICENSE) © Wapitee Interactive
