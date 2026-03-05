// Copyright The OpenTelemetry Authors
// SPDX-License-Identifier: Apache-2.0
//
// Structured event tracking via Sentry SDK.
// - Breadcrumbs: every action → visible in error timelines
// - captureMessage: key funnel events → standalone events in Better Stack
// - Tags: enable filtering/grouping (event type, product, funnel stage)
// - Contexts: rich structured data for each event

import * as Sentry from '@sentry/nextjs';
import { Money } from '../protos/demo';

function fmtPrice(price?: Money): string {
  if (!price) return '';
  const cents = Math.round((price.nanos ?? 0) / 1e7);
  return `${price.currencyCode} ${price.units}.${String(cents).padStart(2, '0')}`;
}

function priceToNumber(price?: Money): number {
  if (!price) return 0;
  return (price.units || 0) + (price.nanos || 0) / 1e9;
}

type FunnelStage = 'browse' | 'product_view' | 'add_to_cart' | 'cart_view' | 'checkout_start' | 'order_placed' | 'order_failed';

function trackFunnelStage(stage: FunnelStage, data?: Record<string, unknown>) {
  Sentry.setTag('funnel_stage', stage);
  Sentry.captureMessage(`Funnel: ${stage}`, {
    level: 'info',
    tags: { event: stage, funnel: 'purchase' },
    extra: data,
  });
}

const Analytics = {
  setUser(userId: string) {
    Sentry.setUser({ id: userId });
    Sentry.setTag('session_user', userId);
  },

  // --- Page / Navigation ---

  pageViewed(pageName: string, referrer?: string) {
    Sentry.addBreadcrumb({
      category: 'navigation',
      message: `Page: ${pageName}`,
      data: { referrer: referrer || (typeof document !== 'undefined' ? document.referrer : '') },
      level: 'info',
    });
    Sentry.captureMessage(`Page viewed: ${pageName}`, {
      level: 'info',
      tags: { event: 'page_view', page: pageName },
    });
  },

  // --- Product Browsing ---

  productListViewed(count: number, currency: string) {
    Sentry.addBreadcrumb({
      category: 'browse',
      message: `Product list viewed (${count} products)`,
      data: { count, currency },
      level: 'info',
    });
    trackFunnelStage('browse', { productCount: count, currency });
  },

  productViewed(productId: string, productName: string, price?: Money) {
    Sentry.addBreadcrumb({
      category: 'product',
      message: `Viewed: ${productName}`,
      data: { productId, price: fmtPrice(price), priceNumeric: priceToNumber(price) },
      level: 'info',
    });
    trackFunnelStage('product_view', {
      productId,
      productName,
      price: fmtPrice(price),
      priceNumeric: priceToNumber(price),
    });
  },

  // --- Cart Actions ---

  addedToCart(productId: string, productName: string, quantity: number, price?: Money) {
    const priceNum = priceToNumber(price);
    const lineTotal = priceNum * quantity;
    Sentry.addBreadcrumb({
      category: 'cart',
      message: `Added: ${productName} x${quantity}`,
      data: { productId, quantity, price: fmtPrice(price), lineTotal },
      level: 'info',
    });
    trackFunnelStage('add_to_cart', {
      productId,
      productName,
      quantity,
      price: fmtPrice(price),
      priceNumeric: priceNum,
      lineTotal,
    });
  },

  removedFromCart(productId: string, productName: string, quantity: number) {
    Sentry.addBreadcrumb({
      category: 'cart',
      message: `Removed: ${productName} x${quantity}`,
      data: { productId, quantity },
      level: 'info',
    });
    Sentry.captureMessage(`Removed from cart: ${productName}`, {
      level: 'info',
      tags: { event: 'remove_from_cart', productId },
      extra: { productName, productId, quantity },
    });
  },

  cartViewed(itemCount: number, cartValue?: number, currency?: string) {
    Sentry.addBreadcrumb({
      category: 'cart',
      message: `Cart viewed (${itemCount} items)`,
      data: { itemCount, cartValue, currency },
      level: 'info',
    });
    trackFunnelStage('cart_view', { itemCount, cartValue, currency });
  },

  cartOpened(itemCount: number) {
    Sentry.addBreadcrumb({
      category: 'cart',
      message: `Cart dropdown opened (${itemCount} items)`,
      data: { itemCount },
      level: 'info',
    });
  },

  cartEmptied(itemCount?: number) {
    Sentry.addBreadcrumb({
      category: 'cart',
      message: 'Cart emptied',
      data: { itemCount },
      level: 'info',
    });
    Sentry.captureMessage('Cart emptied', {
      level: 'info',
      tags: { event: 'cart_emptied' },
      extra: { itemCount },
    });
  },

  quantityChanged(productId: string, productName: string, oldQty: number, newQty: number) {
    Sentry.addBreadcrumb({
      category: 'cart',
      message: `Qty changed: ${productName} ${oldQty} → ${newQty}`,
      data: { productId, oldQty, newQty },
      level: 'info',
    });
  },

  // --- Checkout Funnel ---

  checkoutStarted(itemCount: number, cartValue?: number, currency?: string) {
    Sentry.addBreadcrumb({
      category: 'checkout',
      message: `Checkout started (${itemCount} items)`,
      data: { itemCount, cartValue, currency },
      level: 'info',
    });
    trackFunnelStage('checkout_start', { itemCount, cartValue, currency });
  },

  checkoutFormInteraction(field: string) {
    Sentry.addBreadcrumb({
      category: 'checkout',
      message: `Form field: ${field}`,
      level: 'info',
    });
  },

  orderPlaced(orderId: string, itemCount: number, totalValue?: number, currency?: string) {
    Sentry.addBreadcrumb({
      category: 'checkout',
      message: `Order placed: ${orderId}`,
      data: { orderId, itemCount, totalValue, currency },
      level: 'info',
    });
    trackFunnelStage('order_placed', { orderId, itemCount, totalValue, currency });
  },

  orderFailed(error: string, itemCount: number, cartValue?: number) {
    Sentry.addBreadcrumb({
      category: 'checkout',
      message: `Order FAILED: ${error}`,
      data: { itemCount, cartValue },
      level: 'error',
    });
    trackFunnelStage('order_failed', { error, itemCount, cartValue });
    Sentry.captureException(new Error(`Order failed: ${error}`), {
      tags: { event: 'order_failed' },
      extra: { itemCount, cartValue },
    });
  },

  // --- Preferences ---

  currencyChanged(from: string, to: string) {
    Sentry.addBreadcrumb({
      category: 'preferences',
      message: `Currency: ${from} → ${to}`,
      data: { from, to },
      level: 'info',
    });
    Sentry.captureMessage(`Currency changed: ${from} → ${to}`, {
      level: 'info',
      tags: { event: 'currency_changed', currency_from: from, currency_to: to },
    });
  },

  // --- Recommendations ---

  recommendationClicked(productId: string, productName: string, source: string) {
    Sentry.addBreadcrumb({
      category: 'recommendation',
      message: `Clicked recommendation: ${productName}`,
      data: { productId, source },
      level: 'info',
    });
    Sentry.captureMessage(`Recommendation clicked: ${productName}`, {
      level: 'info',
      tags: { event: 'recommendation_click', productId, source },
    });
  },

  // --- Search / Filters ---

  searchPerformed(query: string, resultCount: number) {
    Sentry.addBreadcrumb({
      category: 'search',
      message: `Search: "${query}" → ${resultCount} results`,
      data: { query, resultCount },
      level: 'info',
    });
  },

  // --- Web Vitals ---

  webVital(name: string, value: number, rating: string) {
    Sentry.addBreadcrumb({
      category: 'web-vital',
      message: `${name}: ${Math.round(value)}ms (${rating})`,
      data: { name, value, rating },
      level: 'info',
    });
    Sentry.captureMessage(`Web Vital: ${name}`, {
      level: 'info',
      tags: {
        event: 'web_vital',
        vital_name: name,
        vital_rating: rating,
      },
      extra: { name, value, rating },
    });
  },

  // --- Error Tracking ---

  apiError(endpoint: string, status: number, message: string) {
    Sentry.addBreadcrumb({
      category: 'api',
      message: `API error: ${endpoint} → ${status}`,
      data: { endpoint, status, message },
      level: 'error',
    });
  },
};

export default Analytics;
