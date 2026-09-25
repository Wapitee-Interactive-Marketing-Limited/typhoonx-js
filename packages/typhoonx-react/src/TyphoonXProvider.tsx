'use client';

import type {ReactNode} from 'react';
import {createContext, useContext, useMemo, useRef} from 'react';

import {recordFirstVisit} from './first-visit.js';
import type {PageHistory, TyphoonXConfig, TyphoonXTracker} from './tracker.js';
import {createTracker} from './tracker.js';

export interface TyphoonXProviderProps extends TyphoonXConfig {
  children?: ReactNode;
}

const TyphoonXContext = createContext<TyphoonXTracker | null>(null);

export function TyphoonXProvider({
  children,
  consent,
  cookieDomain,
  merchantId,
  shopId,
}: TyphoonXProviderProps) {
  const history = useRef<PageHistory>({previousUrl: null, url: null});

  const tracker = useMemo(() => {
    // Runs during render, before any child effect can create the client id.
    if (consent && typeof window !== 'undefined') {
      recordFirstVisit();
    }

    return createTracker(
      {
        consent,
        merchantId,
        shopId,
        ...(cookieDomain === undefined ? {} : {cookieDomain}),
      },
      history.current,
    );
  }, [consent, cookieDomain, merchantId, shopId]);

  return (
    <TyphoonXContext.Provider value={tracker}>
      {children}
    </TyphoonXContext.Provider>
  );
}

export function useTyphoonX(): TyphoonXTracker {
  const tracker = useContext(TyphoonXContext);

  if (tracker === null) {
    throw new Error(
      '[TyphoonX] useTyphoonX() must be called inside <TyphoonXProvider>.',
    );
  }

  return tracker;
}
