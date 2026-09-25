import CookieLib from 'universal-cookie';

// Runtime default export is the class.
const cookies = new (
  CookieLib as unknown as new () => {
    get(name: string, options: {doNotParse: true}): string | undefined;
  }
)();

export interface MetaPixelIds {
  fbc?: string;
  fbp?: string;
}

/** Meta Pixel `_fbp` / `_fbc` cookies, with `_fbc` falling back to `url`'s `fbclid`. */
export function getMetaPixelIds(url: string): MetaPixelIds {
  const fbp = cookies.get('_fbp', {doNotParse: true});
  const fbc = cookies.get('_fbc', {doNotParse: true}) ?? fbcFromUrl(url);

  return {
    ...(fbc === undefined ? {} : {fbc}),
    ...(fbp === undefined ? {} : {fbp}),
  };
}

function fbcFromUrl(url: string): string | undefined {
  let fbclid: string | null;
  try {
    fbclid = new URL(url).searchParams.get('fbclid');
  } catch {
    return undefined;
  }

  // Meta specifies subdomain index 1 for an `_fbc` built outside the Pixel.
  return fbclid ? `fb.1.${String(Date.now())}.${fbclid}` : undefined;
}
