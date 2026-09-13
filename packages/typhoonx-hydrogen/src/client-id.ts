const COOKIE = '__typhoon_client_id';
const MAX_AGE = 31_536_000;

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
