# @wapitee/typhoonx-react

## 0.2.0

### Minor Changes

- 280441f: Send GA4 `_ga` as `ga_client_id`, `_ga_<ID>` as `ga_session_id` when `measurementId` is set, and Google Ads `gclid` (from `_gcl_aw` or the page URL), `gbraid` and `wbraid` on every event.

## 0.1.0

### Minor Changes

- 6803349: Add `TyphoonXProvider` and `useTyphoonX()` for sending TyphoonX events by hand from React.
