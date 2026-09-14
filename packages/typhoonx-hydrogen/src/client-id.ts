/** Cookie name that stores the anonymous TyphoonX client identifier. */
const COOKIE = '__typhoon_client_id';

/** Cookie lifetime in seconds (365 days). */
const MAX_AGE = 31_536_000;

/**
 * Returns the TyphoonX client id from the `__typhoon_client_id` cookie, or
 * creates a new UUID and writes it when the cookie is missing.
 *
 * The cookie is scoped to `Path=/`, uses `SameSite=Lax`, and expires after
 * one year. When `cookieDomain` is set, that value is used as the cookie
 * `Domain` so the id can be shared across subdomains. The `Secure` flag is
 * added automatically on HTTPS pages.
 *
 * @remarks
 * This helper must run in the browser. It reads and writes `document.cookie`.
 *
 * @param cookieDomain - Optional cookie `Domain` attribute, typically the
 * storefront apex domain.
 * @returns The existing or newly created client id.
 */
export function getOrCreateClientId(cookieDomain?: string): string {
  const prefix = `${COOKIE}=`;
  const existing = document.cookie
    .split(';')
    .map((part) => part.trim())
    .find((part) => part.startsWith(prefix))
    ?.slice(prefix.length);

  if (existing) {
    return decodeURIComponent(existing);
  }

  const id = crypto.randomUUID();
  const segments = [
    `${COOKIE}=${id}`,
    'Path=/',
    'SameSite=Lax',
    `Max-Age=${String(MAX_AGE)}`,
  ];

  if (cookieDomain) {
    segments.push(`Domain=${cookieDomain}`);
  }

  if (window.location.protocol === 'https:') {
    segments.push('Secure');
  }

  document.cookie = segments.join('; ');
  return id;
}
