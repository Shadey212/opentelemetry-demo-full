// Copyright The OpenTelemetry Authors
// SPDX-License-Identifier: Apache-2.0

import * as Sentry from '@sentry/nextjs';

const dsn =
  (typeof window !== 'undefined' && (window as any).ENV?.SENTRY_DSN) ||
  process.env.NEXT_PUBLIC_SENTRY_DSN;

Sentry.init({
  dsn,
  release: process.env.NEXT_PUBLIC_APP_VERSION,
  environment: process.env.NEXT_PUBLIC_PLATFORM || 'production',

  // Capture 100% of transactions for performance monitoring / web vitals
  tracesSampleRate: 1.0,

  // Better Stack JS tag handles session replays — keep Sentry replays off
  replaysSessionSampleRate: 0,
  replaysOnErrorSampleRate: 0,

  integrations: [
    Sentry.browserTracingIntegration({
      enableInp: true,
      enableLongTask: true,
      enableLongAnimationFrame: true,
    }),
    Sentry.breadcrumbsIntegration({
      console: true,
      dom: true,
      fetch: true,
      history: true,
      xhr: true,
    }),
  ],

  // Forward OTel trace headers so server spans link to browser traces
  tracePropagationTargets: ['localhost', /^\//],

  beforeBreadcrumb(breadcrumb) {
    // Enrich DOM breadcrumbs with element text for better context
    if (breadcrumb.category === 'ui.click' && breadcrumb.message) {
      breadcrumb.data = {
        ...breadcrumb.data,
        url: typeof window !== 'undefined' ? window.location.pathname : '',
      };
    }
    return breadcrumb;
  },
});
