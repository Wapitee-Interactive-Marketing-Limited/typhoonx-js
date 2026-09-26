# TyphoonX for React

[![npm package](https://img.shields.io/npm/v/@wapitee/typhoonx-react?style=flat-square)](https://www.npmjs.com/package/@wapitee/typhoonx-react)
[![MIT License](https://img.shields.io/badge/License-MIT-red.svg?style=flat-square)](https://opensource.org/licenses/MIT)

React context and hook for sending TyphoonX storefront events by hand.

## Install

```bash
npm install --save @wapitee/typhoonx-react
```

## Usage

Wrap the storefront in `<TyphoonXProvider>`:

```tsx
import {TyphoonXProvider} from '@wapitee/typhoonx-react';

export function App() {
  return (
    <TyphoonXProvider
      consent={hasAnalyticsConsent}
      merchantId="TPX-XXXXXX"
      shopId="123456789"
    >
      {/* storefront */}
    </TyphoonXProvider>
  );
}
```

Send events from any component inside the provider with `useTyphoonX()`. Calling it outside `<TyphoonXProvider>` throws.

```tsx
import {useTyphoonX} from '@wapitee/typhoonx-react';
import {useEffect} from 'react';

function ProductPage({product}: {product: Product}) {
  const typhoonx = useTyphoonX();

  useEffect(() => {
    typhoonx.pageView();
    typhoonx.viewItem({
      currency: 'USD',
      items: [
        {
          itemBrand: product.vendor,
          itemId: product.id,
          itemName: product.title,
          price: product.price,
          quantity: 1,
        },
      ],
      value: product.price,
    });
  }, [typhoonx, product]);

  return <AddToCartButton product={product} />;
}
```

If your site sets a Content-Security-Policy, add `https://spell.typhoonx.io` to `connect-src` so event collection is not blocked.

### Props

| Prop            | Type      | Required | Description                                                                                                                       |
| --------------- | --------- | -------- | --------------------------------------------------------------------------------------------------------------------------------- |
| `merchantId`    | `string`  | yes      | TyphoonX merchant ID (`TPX-…`)                                                                                                    |
| `shopId`        | `string`  | yes      | Shop ID                                                                                                                           |
| `consent`       | `boolean` | yes      | Whether the visitor allows data collection. While `false`, events are dropped and nothing is written to cookies or `localStorage` |
| `cookieDomain`  | `string`  | no       | Cookie `Domain` for a first-party client id. Defaults to the current hostname's apex domain (e.g. `.example.com`)                 |
| `measurementId` | `string`  | no       | GA4 measurement ID (`G-…`). Enables `ga_session_id`                                                                               |

### Events

| Method                                                | TyphoonX Event     |
| ----------------------------------------------------- | ------------------ |
| `pageView()`                                          | `page_view`        |
| `viewItem({currency?, items, value})`                 | `view_item`        |
| `viewItemList({currency?, itemListId, itemListName})` | `view_item_list`   |
| `addToCart({currency?, items, value})`                | `add_to_cart`      |
| `removeFromCart({currency?, items, value})`           | `remove_from_cart` |
| `viewCart({currency?, items, value})`                 | `view_cart`        |
| `search({searchTerm})`                                | `search`           |

Each item is `{itemBrand, itemId, itemName, price, quantity}`.

Identical calls on the same page within one task, such as effects re-run by React StrictMode, are sent once.

## License

[MIT](./LICENSE) © Wapitee Interactive
