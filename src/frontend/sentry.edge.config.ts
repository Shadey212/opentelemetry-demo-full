// Copyright The OpenTelemetry Authors
// SPDX-License-Identifier: Apache-2.0

import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  release: process.env.APP_VERSION,
  tracesSampleRate: 1.0,
});
