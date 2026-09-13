import {parseGid, useAnalytics} from '@shopify/hydrogen';
import {useEffect, useRef, useState} from 'react';

import {getOrCreateClientId} from './client-id.js';

export interface TyphoonXProps {
  merchantId: string;
  shopId: string;
  cookieDomain?: string;
}

const COLLECT_ENDPOINT = 'https://spell.typhoonx.io/api/v1/receive';

interface TyphoonXEvent {
  client_id: string;
  currency?: string;
  event: 'add_to_cart' | 'page_view' | 'view_item';
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
  shop_id: string;
  timestamp: string;
  user_agent: string;
  value?: string;
}

export default function TyphoonX(props: TyphoonXProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  return <TyphoonXClient {...props} />;
}

function TyphoonXClient({cookieDomain, merchantId, shopId}: TyphoonXProps) {
  const {canTrack, register, subscribe} = useAnalytics();
  const {ready} = register('TyphoonX');
  const currentUrlRef = useRef<string | null>(null);
  const previousUrlRef = useRef<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const clientId = getOrCreateClientId(cookieDomain);

    const referrerFor = (url: string): string => {
      if (currentUrlRef.current !== url) {
        previousUrlRef.current = currentUrlRef.current;
        currentUrlRef.current = url;
      }

      return previousUrlRef.current ?? document.referrer;
    };

    const send = (payload: TyphoonXEvent): void => {
      if (cancelled || !canTrack()) {
        return;
      }

      navigator.sendBeacon(
        COLLECT_ENDPOINT,
        new Blob([JSON.stringify(payload)], {type: 'application/json'}),
      );
    };

    const shared = (url: string, currency?: string) => ({
      client_id: clientId,
      merchant_id: merchantId,
      referrer: referrerFor(url),
      request_page_url: url,
      shop_id: shopId,
      timestamp: new Date().toISOString(),
      user_agent: window.navigator.userAgent,
      ...(currency === undefined ? {} : {currency}),
    });

    subscribe('page_viewed', (data) => {
      send({
        ...shared(data.url),
        event: 'page_view',
      });
    });

    subscribe('product_viewed', (data) => {
      const product = data.products[0];
      if (product === undefined) {
        return;
      }

      send({
        ...shared(data.url, data.shop?.currency),
        event: 'view_item',
        items: [
          {
            item_brand: product.vendor,
            item_id: parseGid(product.id).id,
            item_name: product.title,
            price: product.price,
            quantity: 1,
          },
        ],
        value: product.price,
      });
    });

    subscribe('product_added_to_cart', (data) => {
      const {currentLine} = data;
      if (currentLine === undefined) {
        return;
      }

      send({
        ...shared(window.location.href, data.shop?.currency),
        event: 'add_to_cart',
        items: [
          {
            item_brand: currentLine.merchandise.product.vendor,
            item_id: parseGid(currentLine.merchandise.product.id).id,
            item_name: currentLine.merchandise.product.title,
            price: currentLine.merchandise.price.amount,
            quantity: currentLine.quantity,
          },
        ],
        value: currentLine.cost.totalAmount.amount,
      });
    });

    ready();

    return () => {
      cancelled = true;
    };
  }, [canTrack, cookieDomain, merchantId, ready, shopId, subscribe]);

  return null;
}
