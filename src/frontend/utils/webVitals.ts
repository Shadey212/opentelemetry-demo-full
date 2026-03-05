// Web Vitals reporting — captures CLS, FCP, FID, INP, LCP, TTFB
// and sends them both as Analytics events (Sentry) and OTel spans.

import Analytics from './analytics';

type MetricEntry = {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  id: string;
};

function sendMetric(metric: MetricEntry) {
  Analytics.webVital(metric.name, metric.value, metric.rating);
}

export function reportWebVitals() {
  if (typeof window === 'undefined') return;

  // Use dynamic import — web-vitals is tree-shaken and only loaded client-side
  import('web-vitals').then(({ onCLS, onFCP, onINP, onLCP, onTTFB }) => {
    onCLS(sendMetric);
    onFCP(sendMetric);
    onINP(sendMetric);
    onLCP(sendMetric);
    onTTFB(sendMetric);
  }).catch(() => {
    // web-vitals not available — no-op
  });
}
