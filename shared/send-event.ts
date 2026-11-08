/**
 * Queues `payload` with `sendBeacon`, falling back to a keepalive `fetch` when
 * the browser refuses it (e.g. over the beacon quota or size limit).
 */
export function sendEvent(endpoint: string, payload: unknown): void {
  const body = JSON.stringify(payload);

  const queued = navigator.sendBeacon(
    endpoint,
    new Blob([body], {type: 'application/json'}),
  );
  if (queued) return;

  fetch(endpoint, {
    body,
    headers: {'Content-Type': 'application/json'},
    keepalive: true,
    method: 'POST',
  }).catch(() => undefined);
}
