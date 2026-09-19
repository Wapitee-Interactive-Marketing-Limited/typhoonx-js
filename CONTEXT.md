# TyphoonX

TyphoonX is the storefront event stream that Hydrogen shoppers emit to the TyphoonX collect service.

## Language

**TyphoonX Event**:
A JSON payload sent to the Collect Endpoint, named in GA4 style (`page_view`, `view_item`, `view_item_list`, `add_to_cart`, `search`).
_Avoid_: Hydrogen Analytics Event names, page_viewed, product_viewed, collection_viewed, product_added_to_cart, search_viewed

**Hydrogen Analytics Event**:
A storefront analytics signal emitted by Shopify Hydrogen (`page_viewed`, `product_viewed`, `collection_viewed`, `product_added_to_cart`, `search_viewed`).
_Avoid_: Web Pixel, custom pixel, TyphoonX Event

**Client ID**:
An anonymous visitor identifier stored in the first-party `__typhoon_client_id` cookie.
_Avoid_: session id, user id, customer id

**Merchant ID**:
The TyphoonX account key that owns a collect stream, such as `TPX-...`.
_Avoid_: Shop ID, storefront id

**Shop ID**:
The Shopify shop's numeric identifier sent on every TyphoonX Event.
_Avoid_: Merchant ID, storefront id, GID

**Referrer**:
The storefront URL from the previous page in this visit, not necessarily `document.referrer`.

**Collect Endpoint**:
The TyphoonX receive URL `https://spell.typhoonx.io/api/v1/receive`.
_Avoid_: webhook, pixel endpoint

**Web Pixel**:
A future Shopify customer-events sandbox integration, outside this Hydrogen package.
_Avoid_: calling the Hydrogen subscriber a Web Pixel
