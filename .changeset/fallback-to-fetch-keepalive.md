---
'@wapitee/typhoonx-react': patch
'@wapitee/typhoonx-hydrogen': patch
---

Fall back to a keepalive `fetch` when `navigator.sendBeacon` refuses an event, so oversized payloads are no longer dropped silently.
