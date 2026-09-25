import type {CookieSetOptions} from 'universal-cookie';
import CookieLib from 'universal-cookie';

const COOKIE = '__typhoon_client_id';
const MAX_AGE = 31_536_000; // 365 days

interface Cookies {
  get(name: string, options: {doNotParse: true}): string | undefined;
  set(name: string, value: string, options?: CookieSetOptions): void;
  remove(name: string, options?: CookieSetOptions): void;
}

// Runtime default export is the class.
const Cookies = CookieLib as unknown as new (
  cookies?: string | null,
  defaultSetOptions?: CookieSetOptions,
) => Cookies;

const cookies = new Cookies(null, {
  path: '/',
  sameSite: 'lax',
  maxAge: MAX_AGE,
});

/** Whether `__typhoon_client_id` is already set. */
export function hasClientId(): boolean {
  return cookies.get(COOKIE, {doNotParse: true}) !== undefined;
}

/** Existing `__typhoon_client_id`, or a new UUID cookie on the apex domain. */
export function getOrCreateClientId(cookieDomain?: string): string {
  const existing = cookies.get(COOKIE, {doNotParse: true});
  if (existing) {
    return existing;
  }

  const id = crypto.randomUUID();
  const domain = cookieDomain ?? apexCookieDomain(window.location.hostname);
  const secure = window.location.protocol === 'https:';
  cookies.set(COOKIE, id, domain ? {domain, secure} : {secure});
  return id;
}

function apexCookieDomain(hostname: string): string | undefined {
  const labels = hostname.split('.');
  const secure = window.location.protocol === 'https:';

  for (let n = 2; n <= labels.length; n += 1) {
    const domain = `.${labels.slice(-n).join('.')}`;
    const token = crypto.randomUUID();
    cookies.set('__typhoon_d', token, {domain, maxAge: 60, secure});
    const probe = cookies.get('__typhoon_d', {doNotParse: true});
    cookies.remove('__typhoon_d', {domain, secure});
    if (probe === token) {
      return domain;
    }
  }

  return undefined;
}
