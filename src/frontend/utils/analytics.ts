// Copyright The OpenTelemetry Authors
// SPDX-License-Identifier: Apache-2.0
//
// Structured event tracking via Sentry SDK.
// - Breadcrumbs: every action → visible in error timelines
// - captureMessage: key funnel events → standalone events in Better Stack
// - Tags: enable filtering/grouping (event type, product, funnel stage)
// - Contexts: rich structured data (browser, memory, geo, UTMs) on every event

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

// --- Environment context collected once and enriched on every event ---

function getUtmParams(): Record<string, string> {
  if (typeof window === 'undefined') return {};
  const params = new URLSearchParams(window.location.search);
  const utms: Record<string, string> = {};
  for (const key of ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content']) {
    const val = params.get(key);
    if (val) utms[key] = val;
  }
  return utms;
}

function getBrowserContext(): Record<string, unknown> {
  if (typeof window === 'undefined') return {};
  const nav = navigator as any;
  const ctx: Record<string, unknown> = {
    user_agent: navigator.userAgent,
    language: navigator.language,
    languages: navigator.languages?.join(', '),
    platform: nav.userAgentData?.platform || navigator.platform,
    mobile: nav.userAgentData?.mobile,
    vendor: navigator.vendor,
    cookie_enabled: navigator.cookieEnabled,
    do_not_track: navigator.doNotTrack,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    timezone_offset: new Date().getTimezoneOffset(),
    screen_width: screen.width,
    screen_height: screen.height,
    screen_color_depth: screen.colorDepth,
    viewport_width: window.innerWidth,
    viewport_height: window.innerHeight,
    device_pixel_ratio: window.devicePixelRatio,
    online: navigator.onLine,
    connection_type: (nav.connection || nav.mozConnection || nav.webkitConnection)?.effectiveType,
    connection_downlink: (nav.connection || nav.mozConnection || nav.webkitConnection)?.downlink,
    hardware_concurrency: navigator.hardwareConcurrency,
    device_memory: nav.deviceMemory,
  };

  // JS heap memory (Chrome only)
  const perf = performance as any;
  if (perf.memory) {
    ctx.js_heap_used = perf.memory.usedJSHeapSize;
    ctx.js_heap_total = perf.memory.totalJSHeapSize;
    ctx.js_heap_limit = perf.memory.jsHeapSizeLimit;
  }

  return ctx;
}

function getPageContext(): Record<string, unknown> {
  if (typeof window === 'undefined') return {};
  return {
    url: window.location.href,
    path: window.location.pathname,
    search: window.location.search,
    hash: window.location.hash,
    referrer: document.referrer,
    title: document.title,
    ...getUtmParams(),
  };
}

// Collect memory measurement async (Chrome 89+)
async function measureMemory(): Promise<Record<string, unknown> | null> {
  if (typeof window === 'undefined') return null;
  const perf = performance as any;
  if (typeof perf.measureUserAgentSpecificMemory !== 'function') return null;
  try {
    const result = await perf.measureUserAgentSpecificMemory();
    return {
      memory_bytes: result.bytes,
      memory_breakdown: result.breakdown?.map((b: any) => ({
        bytes: b.bytes,
        types: b.types,
      })),
    };
  } catch {
    return null;
  }
}

type FunnelStage = 'browse' | 'product_view' | 'add_to_cart' | 'cart_view' | 'checkout_start' | 'order_placed' | 'order_failed';

function trackEvent(
  message: string,
  tags: Record<string, string>,
  extra?: Record<string, unknown>,
  level: 'info' | 'error' = 'info',
) {
  const browser = getBrowserContext();
  const page = getPageContext();
  Sentry.captureMessage(message, {
    level,
    tags,
    contexts: {
      browser_info: browser,
      page_info: page,
    },
    extra: { ...extra, ...page },
  });
}

function trackFunnelStage(stage: FunnelStage, data?: Record<string, unknown>) {
  Sentry.setTag('funnel_stage', stage);
  trackEvent(`Funnel: ${stage}`, { event: stage, funnel: 'purchase' }, data);
}

const Analytics = {
  setUser(userId: string) {
    Sentry.setUser({ id: userId });
    Sentry.setTag('session_user', userId);

    // Set persistent browser tags once
    if (typeof window !== 'undefined') {
      const nav = navigator as any;
      Sentry.setTag('timezone', Intl.DateTimeFormat().resolvedOptions().timeZone);
      Sentry.setTag('screen', `${screen.width}x${screen.height}`);
      Sentry.setTag('viewport', `${window.innerWidth}x${window.innerHeight}`);
      Sentry.setTag('language', navigator.language);
      Sentry.setTag('connection', (nav.connection || nav.mozConnection || nav.webkitConnection)?.effectiveType || 'unknown');
      if (nav.userAgentData?.mobile !== undefined) {
        Sentry.setTag('mobile', String(nav.userAgentData.mobile));
      }
      // Capture UTMs as persistent tags
      const utms = getUtmParams();
      for (const [key, val] of Object.entries(utms)) {
        Sentry.setTag(key, val);
      }
    }
  },

  // --- Page / Navigation ---

  pageViewed(pageName: string, referrer?: string) {
    Sentry.addBreadcrumb({
      category: 'navigation',
      message: `Page: ${pageName}`,
      data: { referrer: referrer || (typeof document !== 'undefined' ? document.referrer : '') },
      level: 'info',
    });
    trackEvent(`Page viewed: ${pageName}`, { event: 'page_view', page: pageName });
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
      productId, productName, quantity,
      price: fmtPrice(price), priceNumeric: priceNum, lineTotal,
    });
  },

  removedFromCart(productId: string, productName: string, quantity: number) {
    Sentry.addBreadcrumb({
      category: 'cart',
      message: `Removed: ${productName} x${quantity}`,
      data: { productId, quantity },
      level: 'info',
    });
    trackEvent(`Removed from cart: ${productName}`, { event: 'remove_from_cart', productId }, { productName, quantity });
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
    trackEvent('Cart emptied', { event: 'cart_emptied' }, { itemCount });
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
      contexts: { browser_info: getBrowserContext(), page_info: getPageContext() },
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
    trackEvent(`Currency changed: ${from} → ${to}`, { event: 'currency_changed', currency_from: from, currency_to: to });
  },

  // --- Recommendations ---

  recommendationClicked(productId: string, productName: string, source: string) {
    Sentry.addBreadcrumb({
      category: 'recommendation',
      message: `Clicked recommendation: ${productName}`,
      data: { productId, source },
      level: 'info',
    });
    trackEvent(`Recommendation clicked: ${productName}`, { event: 'recommendation_click', productId, source });
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
    trackEvent(`Web Vital: ${name}`, {
      event: 'web_vital',
      vital_name: name,
      vital_rating: rating,
    }, { name, value, rating });
  },

  // --- Memory ---

  async reportMemory() {
    const mem = await measureMemory();
    if (mem) {
      Sentry.addBreadcrumb({
        category: 'performance',
        message: `Memory: ${Math.round((mem.memory_bytes as number) / 1024 / 1024)}MB`,
        data: mem,
        level: 'info',
      });
      trackEvent('Memory measurement', { event: 'memory_measurement' }, mem);
    }
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
