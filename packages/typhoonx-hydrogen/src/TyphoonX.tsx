import {flattenConnection, parseGid, useAnalytics} from '@shopify/hydrogen';
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
  event: 'add_to_cart' | 'page_view' | 'remove_from_cart' | 'view_cart' | 'view_item' | 'view_item_list';
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
    const clientId = getOrCreateClientId(cookieDomain);

    const referrerFor = (url: string): string => {
      if (currentUrlRef.current !== url) {
        previousUrlRef.current = currentUrlRef.current;
        currentUrlRef.current = url;
      }
      return previousUrlRef.current ?? document.referrer;
    };

    const send = (payload: TyphoonXEvent) => {
      if (!canTrack()) return;

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

    subscribe('cart_viewed', (data) => {
      const {cart} = data;
      if (!cart?.lines) {
        return;
      }
      const cartLines = flattenConnection(cart.lines);
      send({
        ...shared(data.url, data.shop?.currency),
        event: 'view_cart',
        items: cartLines.map((line) => ({
          item_brand: line.merchandise.product.vendor,
          item_id: parseGid(line.merchandise.product.id).id,
          item_name: line.merchandise.product.title,
          price: line.merchandise.price.amount,
          quantity: line.quantity,
        })),
        value: cart.cost.totalAmount.amount,
      });
    });

    subscribe('collection_viewed', (data) => {
      const {collection} = data;
      if (!collection.id) {
        return;
      }
      send({
        ...shared(data.url, data.shop?.currency),
        event: 'view_item_list',
        item_list_id: parseGid(collection.id).id,
        item_list_name: collection.handle,
      });
    });

    subscribe('page_viewed', (data) => {
      send({
        ...shared(data.url),
        event: 'page_view',
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

    subscribe('product_removed_from_cart', (data) => {
      const {currentLine, prevLine} = data;
      const quantity = (prevLine?.quantity ?? 0) - (currentLine?.quantity ?? 0);
      if (prevLine === undefined || quantity <= 0) {
        return;
      }
      send({
        ...shared(window.location.href, data.shop?.currency),
        event: 'remove_from_cart',
        items: [
          {
            item_brand: prevLine.merchandise.product.vendor,
            item_id: parseGid(prevLine.merchandise.product.id).id,
            item_name: prevLine.merchandise.product.title,
            price: prevLine.merchandise.price.amount,
            quantity,
          },
        ],
        value: String(
          Number(prevLine.cost.totalAmount.amount)
          - Number(currentLine?.cost.totalAmount.amount ?? 0),
        ),
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

    ready();
  }, [cookieDomain, merchantId, shopId, canTrack, ready, subscribe]);

  return null;
}
