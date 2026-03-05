// Copyright The OpenTelemetry Authors
// SPDX-License-Identifier: Apache-2.0

import Document, { DocumentContext, Html, Head, Main, NextScript } from 'next/document';
import { ServerStyleSheet } from 'styled-components';
import {context, propagation} from "@opentelemetry/api";

const { ENV_PLATFORM, WEB_OTEL_SERVICE_NAME, PUBLIC_OTEL_EXPORTER_OTLP_TRACES_ENDPOINT, OTEL_COLLECTOR_HOST, BETTERSTACK_JS_TOKEN, APP_VERSION, SENTRY_DSN } = process.env;

export default class MyDocument extends Document<{ envString: string; betterstackJsToken: string; appVersion: string; sentryDsn: string }> {
  static async getInitialProps(ctx: DocumentContext) {
    const sheet = new ServerStyleSheet();
    const originalRenderPage = ctx.renderPage;

    try {
      ctx.renderPage = () =>
        originalRenderPage({
          enhanceApp: App => props => sheet.collectStyles(<App {...props} />),
        });

      const initialProps = await Document.getInitialProps(ctx);
      const baggage = propagation.getBaggage(context.active());
      const isSyntheticRequest = baggage?.getEntry('synthetic_request')?.value === 'true';

      const otlpTracesEndpoint = isSyntheticRequest
          ? `http://${OTEL_COLLECTOR_HOST}:4318/v1/traces`
          : PUBLIC_OTEL_EXPORTER_OTLP_TRACES_ENDPOINT;

      const envString = `
        window.ENV = {
          NEXT_PUBLIC_PLATFORM: '${ENV_PLATFORM}',
          NEXT_PUBLIC_OTEL_SERVICE_NAME: '${WEB_OTEL_SERVICE_NAME}',
          NEXT_PUBLIC_OTEL_EXPORTER_OTLP_TRACES_ENDPOINT: '${otlpTracesEndpoint}',
          IS_SYNTHETIC_REQUEST: '${isSyntheticRequest}',
          SENTRY_DSN: '${SENTRY_DSN || ''}',
        };`;
      return {
        ...initialProps,
        styles: [initialProps.styles, sheet.getStyleElement()],
        envString,
        betterstackJsToken: BETTERSTACK_JS_TOKEN || '',
        appVersion: APP_VERSION || '2.3.0',
        sentryDsn: SENTRY_DSN || '',
      };
    } finally {
      sheet.seal();
    }
  }

  render() {
    const { betterstackJsToken, appVersion } = this.props;
    const betterstackScript = betterstackJsToken ? `
      !function(b,e,t,r){
        b[t]=b[t]||function(...args){(b[t].q=b[t].q||[]).push(args)};
        b[t].l=+new Date;
        var s=e.createElement('script'); s.async=1; s.crossOrigin='anonymous';
        s.src='https://betterstack.net/b.js?t='+r;
        (e.head||e.getElementsByTagName('head')[0]).appendChild(s);
      }(window,document,'betterstack','${betterstackJsToken}');
      betterstack('init', { environment: 'production', release: '${appVersion}' });
    ` : '';

    return (
      <Html>
        <Head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link
            href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap"
            rel="stylesheet"
          />
          {betterstackScript && (
            <script dangerouslySetInnerHTML={{ __html: betterstackScript }} />
          )}
        </Head>
        <body>
          <Main />
          <script dangerouslySetInnerHTML={{ __html: this.props.envString }}></script>
          <NextScript />
        </body>
      </Html>
    );
  }
}
