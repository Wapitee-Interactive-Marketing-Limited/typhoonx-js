import CookieLib from 'universal-cookie';

// Runtime default export is the class.
const cookies = new (
  CookieLib as unknown as new () => {
    get(name: string, options: {doNotParse: true}): string | undefined;
  }
)();

export interface GoogleIds {
  ga_client_id?: string | undefined;
  ga_session_id?: string | undefined;
  gbraid?: string | undefined;
  gclid?: string | undefined;
  wbraid?: string | undefined;
}

/**
 * GA4 client and session IDs from `_ga` / `_ga_<ID>`, and Google Ads click IDs
 * from `_gcl_aw` falling back to `url`'s `gclid`, `gbraid` and `wbraid`.
 */
export function getGoogleIds(url: string, measurementId?: string): GoogleIds {
  const params = searchParams(url);
  const cookie = (name: string) => cookies.get(name, {doNotParse: true});
  const param = (name: string) => params?.get(name)?.match(/^.+$/)?.[0];

  return {
    ga_client_id: cookie('_ga')?.match(/^GA\d\.\d+\.(.+)$/)?.[1],
    ga_session_id: measurementId
      ? cookie(`_ga_${measurementId.replace(/^G-/, '')}`)?.match(
          /^GS\d\.\d+\.s?(\d+)/,
        )?.[1]
      : undefined,
    gbraid: param('gbraid'),
    gclid: cookie('_gcl_aw')?.match(/^GCL\.\d+\.(.+)$/)?.[1] ?? param('gclid'),
    wbraid: param('wbraid'),
  };
}

function searchParams(url: string): URLSearchParams | undefined {
  try {
    return new URL(url).searchParams;
  } catch {
    return undefined;
  }
}
