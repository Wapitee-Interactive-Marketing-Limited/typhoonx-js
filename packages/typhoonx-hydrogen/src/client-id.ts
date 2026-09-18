/** Cookie name that stores the anonymous TyphoonX client identifier. */
const COOKIE = '__typhoon_client_id';

/** Cookie lifetime in seconds (365 days). */
const MAX_AGE = 31_536_000;

/**
 * Returns the TyphoonX client id from the `__typhoon_client_id` cookie, or
 * creates a new UUID when the cookie is missing.
 *
 * The cookie is scoped to `Path=/`, uses `SameSite=Lax`, and expires after
 * one year. When `cookieDomain` is set, that value is used as the cookie
 * `Domain`. Otherwise the Domain defaults to the highest domain the browser
 * will accept (e.g. `.example.com` for `www.example.com`) so the id is
 * shared across subdomains. An existing id is written again with that Domain;
 * a previous host-only cookie is expired (omit `Domain`) so only the apex
 * cookie remains. The `Secure` flag is added automatically on HTTPS pages.
 *
 * @remarks
 * This helper must run in the browser. It reads and writes `document.cookie`.
 *
 * @param cookieDomain - Optional cookie `Domain` attribute. Omit to use the
 * current hostname's apex domain.
 * @returns The existing or newly created client id.
 */
export function getOrCreateClientId(cookieDomain?: string): string {
  const prefix = `${COOKIE}=`;
  const existing = document.cookie
    .split(';')
    .map((part) => part.trim())
    .find((part) => part.startsWith(prefix))
    ?.slice(prefix.length);

  const id = existing ? decodeURIComponent(existing) : crypto.randomUUID();
  const domain = cookieDomain ?? apexCookieDomain(window.location.hostname);
  const https = window.location.protocol === 'https:';

  if (existing && domain) {
    const expire = [`${COOKIE}=`, 'Path=/', 'SameSite=Lax', 'Max-Age=0'];
    if (https) {
      expire.push('Secure');
    }
    document.cookie = expire.join('; ');
  }

  const segments = [
    `${COOKIE}=${id}`,
    'Path=/',
    'SameSite=Lax',
    `Max-Age=${String(MAX_AGE)}`,
  ];

  if (domain) {
    segments.push(`Domain=${domain}`);
  }

  if (https) {
    segments.push('Secure');
  }

  document.cookie = segments.join('; ');
  return id;
}

function apexCookieDomain(hostname: string): string | undefined {
  const labels = hostname.split('.');
  const secure = window.location.protocol === 'https:' ? '; Secure' : '';

  for (let n = 2; n <= labels.length; n += 1) {
    const domain = `.${labels.slice(-n).join('.')}`;
    const token = crypto.randomUUID();
    const suffix = `Path=/; SameSite=Lax; Domain=${domain}${secure}`;
    document.cookie = `__typhoon_d=${token}; ${suffix}; Max-Age=60`;
    const accepted = document.cookie.includes(`__typhoon_d=${token}`);
    document.cookie = `__typhoon_d=; ${suffix}; Max-Age=0`;
    if (accepted) {
      return domain;
    }
  }

  return undefined;
}
