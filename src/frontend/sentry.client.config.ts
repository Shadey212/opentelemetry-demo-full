// Copyright The OpenTelemetry Authors
// SPDX-License-Identifier: Apache-2.0

import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  release: process.env.NEXT_PUBLIC_APP_VERSION,
  environment: process.env.NEXT_PUBLIC_PLATFORM || 'production',

  // Capture 100% of transactions for performance monitoring / web vitals
  tracesSampleRate: 1.0,

  // Better Stack JS tag handles session replays — keep Sentry replays off
  // to avoid duplicating replay storage.
  replaysSessionSampleRate: 0,
  replaysOnErrorSampleRate: 0,

  // Capture user interactions (clicks, input) automatically as breadcrumbs
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.breadcrumbsIntegration({
      console: true,
      dom: true,        // click / input events → auto breadcrumbs
      fetch: true,
      history: true,    // client-side navigations
      xhr: true,
    }),
  ],

  // Forward OTel trace headers so server spans link to browser traces
  tracePropagationTargets: ['localhost', /^\//],
});
