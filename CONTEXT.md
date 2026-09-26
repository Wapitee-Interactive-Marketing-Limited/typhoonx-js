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

**Meta Pixel IDs**:
The Meta Pixel browser ID (`_fbp` cookie, sent as `fbp`) and click ID (`_fbc` cookie, sent as `fbc`) attached to every TyphoonX Event when present. `fbc` falls back to the page URL's `fbclid` before the Pixel has written `_fbc`.
_Avoid_: Facebook cookies, Meta user id

**Google IDs**:
The GA4 client ID (`_ga` cookie, sent as `ga_client_id`), GA4 session ID (`_ga_<ID>` cookie for the configured measurement ID, sent as `ga_session_id`), and Google Ads click IDs (`gclid` from `_gcl_aw` or the page URL; `gbraid` and `wbraid` from the page URL) attached to every TyphoonX Event when present.
_Avoid_: Client ID (that is TyphoonX's own `__typhoon_client_id`), Google cookies

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
