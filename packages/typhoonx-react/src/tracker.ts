import {getOrCreateClientId} from './client-id.js';
import {takeFirstVisit} from './first-visit.js';
import {getMetaPixelIds} from './meta-pixel.js';

const COLLECT_ENDPOINT = 'https://spell.typhoonx.io/api/v1/receive';

export interface TyphoonXConfig {
  /** Whether the visitor allows data collection. Nothing is sent or stored while `false`. */
  consent: boolean;
  cookieDomain?: string;
  merchantId: string;
  shopId: string;
}

export interface TyphoonXItem {
  itemBrand: string;
  itemId: string;
  itemName: string;
  price: number | string;
  quantity: number;
}

export interface TyphoonXItemsEvent {
  currency?: string;
  items: TyphoonXItem[];
  value: number | string;
}

export interface TyphoonXItemListEvent {
  currency?: string;
  itemListId: string;
  itemListName: string;
}

export interface TyphoonXSearchEvent {
  searchTerm: string;
}

export interface TyphoonXTracker {
  addToCart: (event: TyphoonXItemsEvent) => void;
  pageView: () => void;
  removeFromCart: (event: TyphoonXItemsEvent) => void;
  search: (event: TyphoonXSearchEvent) => void;
  viewCart: (event: TyphoonXItemsEvent) => void;
  viewItem: (event: TyphoonXItemsEvent) => void;
  viewItemList: (event: TyphoonXItemListEvent) => void;
}

/** Current and previous page URLs, kept across trackers so consent changes don't reset the referrer. */
export interface PageHistory {
  previousUrl: string | null;
  url: string | null;
}

interface TyphoonXEvent {
  client_id: string;
  currency?: string;
  event:
    | 'add_to_cart'
    | 'first_visit'
    | 'page_view'
    | 'remove_from_cart'
    | 'search'
    | 'view_cart'
    | 'view_item'
    | 'view_item_list';
  fbc?: string;
  fbp?: string;
  item_list_id?: string;
  item_list_name?: string;
  items?: {
    item_brand: string;
    item_id: string;
    item_name: string;
    price: string;
    quantity: number;
  }[];
  merchant_id: string;
  referrer: string;
  request_page_url: string;
  search_term?: string;
  shop_id: string;
  timestamp: string;
  user_agent: string;
  value?: string;
}

const ignore = () => undefined;

const NOOP_TRACKER: TyphoonXTracker = {
  addToCart: ignore,
  pageView: ignore,
  removeFromCart: ignore,
  search: ignore,
  viewCart: ignore,
  viewItem: ignore,
  viewItemList: ignore,
};

export function createTracker(
  {consent, cookieDomain, merchantId, shopId}: TyphoonXConfig,
  history: PageHistory,
): TyphoonXTracker {
  if (!consent) {
    return NOOP_TRACKER;
  }

  const referrerFor = (url: string): string => {
    if (history.url !== url) {
      history.previousUrl = history.url;
      history.url = url;
    }
    return history.previousUrl ?? document.referrer;
  };

  const send = (payload: TyphoonXEvent) => {
    navigator.sendBeacon(
      COLLECT_ENDPOINT,
      new Blob([JSON.stringify(payload)], {type: 'application/json'}),
    );
  };

  const shared = (currency?: string) => {
    const url = window.location.href;
    return {
      client_id: getOrCreateClientId(cookieDomain),
      merchant_id: merchantId,
      referrer: referrerFor(url),
      request_page_url: url,
      shop_id: shopId,
      timestamp: new Date().toISOString(),
      user_agent: window.navigator.userAgent,
      ...(currency === undefined ? {} : {currency}),
      ...getMetaPixelIds(url),
    };
  };

  const trackedThisTask = new Set<string>();

  // StrictMode re-runs effects synchronously, so identical calls within one task are the same event.
  const dedupe =
    <A extends unknown[]>(
      event: TyphoonXEvent['event'],
      track: (...args: A) => void,
    ) =>
    (...args: A) => {
      const key = JSON.stringify([event, window.location.href, args]);
      if (trackedThisTask.has(key)) return;

      trackedThisTask.add(key);
      queueMicrotask(() => trackedThisTask.delete(key));
      track(...args);
    };

  const itemsEvent = (
    event: 'add_to_cart' | 'remove_from_cart' | 'view_cart' | 'view_item',
  ) =>
    dedupe(event, ({currency, items, value}: TyphoonXItemsEvent) => {
      send({
        ...shared(currency),
        event,
        items: items.map((item) => ({
          item_brand: item.itemBrand,
          item_id: item.itemId,
          item_name: item.itemName,
          price: String(item.price),
          quantity: item.quantity,
        })),
        value: String(value),
      });
    });

  return {
    addToCart: itemsEvent('add_to_cart'),
    pageView: dedupe('page_view', () => {
      const payload = shared();
      send({...payload, event: 'page_view'});

      const firstVisit = takeFirstVisit();
      if (firstVisit === undefined) return;

      send({
        ...payload,
        event: 'first_visit',
        request_page_url: firstVisit.url,
        timestamp: firstVisit.time,
      });
    }),
    removeFromCart: itemsEvent('remove_from_cart'),
    search: dedupe('search', ({searchTerm}: TyphoonXSearchEvent) => {
      send({...shared(), event: 'search', search_term: searchTerm});
    }),
    viewCart: itemsEvent('view_cart'),
    viewItem: itemsEvent('view_item'),
    viewItemList: dedupe(
      'view_item_list',
      ({currency, itemListId, itemListName}: TyphoonXItemListEvent) => {
        send({
          ...shared(currency),
          event: 'view_item_list',
          item_list_id: itemListId,
          item_list_name: itemListName,
        });
      },
    ),
  };
}
