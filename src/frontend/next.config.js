// Copyright The OpenTelemetry Authors
// SPDX-License-Identifier: Apache-2.0

/** @type {import('next').NextConfig} */

const dotEnv = require('dotenv');
const dotenvExpand = require('dotenv-expand');
const { resolve } = require('path');
const { withSentryConfig } = require('@sentry/nextjs');

const myEnv = dotEnv.config({
  path: resolve(__dirname, '../../.env'),
});
dotenvExpand.expand(myEnv);

const {
  AD_ADDR = '',
  CART_ADDR = '',
  CHECKOUT_ADDR = '',
  CURRENCY_ADDR = '',
  PRODUCT_CATALOG_ADDR = '',
  PRODUCT_REVIEWS_ADDR = '',
  RECOMMENDATION_ADDR = '',
  SHIPPING_ADDR = '',
  ENV_PLATFORM = '',
  OTEL_EXPORTER_OTLP_TRACES_ENDPOINT = '',
  OTEL_SERVICE_NAME = 'frontend',
  PUBLIC_OTEL_EXPORTER_OTLP_TRACES_ENDPOINT = '',
  APP_VERSION = '2.3.1',
} = process.env;

const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  compiler: {
    styledComponents: true,
  },
  // Turbopack configuration (Next.js 16 default bundler)
  // Turbopack automatically handles Node.js polyfills for client bundles
  turbopack: {
    // Set root to current directory to avoid confusion with parent lockfile
    root: __dirname,
  },
  // Keep webpack config for backwards compatibility if --webpack flag is used
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback.http2 = false;
      config.resolve.fallback.tls = false;
      config.resolve.fallback.net = false;
      config.resolve.fallback.dns = false;
      config.resolve.fallback.fs = false;
    }

    return config;
  },
  env: {
    AD_ADDR,
    CART_ADDR,
    CHECKOUT_ADDR,
    CURRENCY_ADDR,
    PRODUCT_CATALOG_ADDR,
    PRODUCT_REVIEWS_ADDR,
    RECOMMENDATION_ADDR,
    SHIPPING_ADDR,
    OTEL_EXPORTER_OTLP_TRACES_ENDPOINT,
    NEXT_PUBLIC_PLATFORM: ENV_PLATFORM,
    NEXT_PUBLIC_OTEL_SERVICE_NAME: OTEL_SERVICE_NAME,
    NEXT_PUBLIC_OTEL_EXPORTER_OTLP_TRACES_ENDPOINT: PUBLIC_OTEL_EXPORTER_OTLP_TRACES_ENDPOINT,
    NEXT_PUBLIC_APP_VERSION: APP_VERSION,
    // NEXT_PUBLIC_SENTRY_DSN is read at runtime from window.ENV or process.env
  },
  images: {
    loader: "custom",
    loaderFile: "./utils/imageLoader.js"
  }
};

module.exports = withSentryConfig(nextConfig, {
  silent: true,
  // No source map upload needed — no Sentry org configured
  disableServerWebpackPlugin: true,
  disableClientWebpackPlugin: true,
});
