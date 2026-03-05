// Copyright The OpenTelemetry Authors
// SPDX-License-Identifier: Apache-2.0
//
// Thin wrapper around Sentry SDK for structured user-action tracking.
// All actions are recorded as breadcrumbs (visible in any error's timeline).
// Key conversion events also fire as captureMessage so they appear in
// Better Stack as standalone events.

import * as Sentry from '@sentry/nextjs';
import { Money } from '../protos/demo';

function fmtPrice(price?: Money): string {
  if (!price) return '';
  const cents = Math.round((price.nanos ?? 0) / 1e7);
  return `${price.currencyCode} ${price.units}.${String(cents).padStart(2, '0')}`;
}

const Analytics = {
  /** Call once on app init to attach a stable user ID to all Sentry events. */
  setUser(userId: string) {
    Sentry.setUser({ id: userId });
  },

  /** User navigated to a page. */
  pageViewed(pageName: string) {
    Sentry.addBreadcrumb({
      category: 'navigation',
      message: `Page: ${pageName}`,
      level: 'info',
    });
  },

  /** User clicked into a product card (going to detail page). */
  productViewed(productId: string, productName: string, price?: Money) {
    Sentry.addBreadcrumb({
      category: 'product',
      message: `Viewed product: ${productName}`,
      data: { productId, price: fmtPrice(price) },
      level: 'info',
    });
  },

  /** User added an item to the cart (either quick-add or from detail page). */
  addedToCart(productId: string, productName: string, quantity: number, price?: Money) {
    Sentry.addBreadcrumb({
      category: 'cart',
      message: `Added to cart: ${productName} ×${quantity}`,
      data: { productId, quantity, price: fmtPrice(price) },
      level: 'info',
    });
    Sentry.captureMessage(`Add to cart: ${productName}`, {
      level: 'info',
      tags: { event: 'add_to_cart', productId },
      extra: { productName, productId, quantity, price: fmtPrice(price) },
    });
  },

  /** User opened the cart page. */
  cartViewed(itemCount: number) {
    Sentry.addBreadcrumb({
      category: 'cart',
      message: `Cart viewed (${itemCount} item${itemCount !== 1 ? 's' : ''})`,
      data: { itemCount },
      level: 'info',
    });
  },

  /** User opened the cart dropdown in the header. */
  cartOpened() {
    Sentry.addBreadcrumb({
      category: 'cart',
      message: 'Cart dropdown opened',
      level: 'info',
    });
  },

  /** User submitted the checkout form (before the order is confirmed). */
  checkoutStarted(itemCount: number) {
    Sentry.addBreadcrumb({
      category: 'checkout',
      message: 'Checkout submitted',
      data: { itemCount },
      level: 'info',
    });
    Sentry.captureMessage('Checkout started', {
      level: 'info',
      tags: { event: 'checkout_started' },
      extra: { itemCount },
    });
  },

  /** Order successfully confirmed — the most important conversion event. */
  orderPlaced(orderId: string) {
    Sentry.addBreadcrumb({
      category: 'checkout',
      message: `Order placed: ${orderId}`,
      data: { orderId },
      level: 'info',
    });
    Sentry.captureMessage('Order placed', {
      level: 'info',
      tags: { event: 'order_placed', orderId },
      extra: { orderId },
    });
  },

  /** User changed the display currency. */
  currencyChanged(currency: string) {
    Sentry.addBreadcrumb({
      category: 'preferences',
      message: `Currency → ${currency}`,
      data: { currency },
      level: 'info',
    });
  },

  /** Cart was emptied. */
  cartEmptied() {
    Sentry.addBreadcrumb({
      category: 'cart',
      message: 'Cart emptied',
      level: 'info',
    });
  },
};

export default Analytics;
