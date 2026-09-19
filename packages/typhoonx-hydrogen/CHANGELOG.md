# @wapitee/typhoonx-hydrogen

## 0.5.0

### Minor Changes

- Send `search` when Hydrogen reports `search_viewed`.

## 0.4.6

### Patch Changes

- Do not cancel previous analytics handlers when the subscription effect re-runs, so Hydrogen events delivered during cleanup still reach `sendBeacon`.

## 0.4.5

### Patch Changes

- Ignore analytics callbacks from a previous effect after `canTrack` or config changes, so stale handlers cannot send.

## 0.4.4

### Patch Changes

- Re-run Hydrogen analytics subscriptions when `canTrack` or `ready` changes, so consent updates still reach `sendBeacon`.

## 0.4.3

### Patch Changes

- Subscribe to Hydrogen analytics events only once so handlers stay attached when `canTrack` or config changes.

## 0.4.2

### Patch Changes

- Manage the client id cookie with `universal-cookie`. Leave an existing `__typhoon_client_id` cookie unchanged on repeat visits.

## 0.4.1

### Patch Changes

- 05fa4c5: Default the client id cookie to the storefront apex domain (e.g. `.example.com`) so the id is shared across subdomains.

## 0.4.0

### Minor Changes

- 0a9e1c0: Send `view_item_list` when Hydrogen reports `collection_viewed`.

## 0.3.0

### Minor Changes

- 35366bd: Send `view_cart` when Hydrogen reports `cart_viewed`.

## 0.2.0

### Minor Changes

- a7d26ad: Send `remove_from_cart` when Hydrogen reports `product_removed_from_cart`.

## 0.1.0

### Minor Changes

- 67e6602: Initial Hydrogen Analytics subscriber for TyphoonX storefront events.
