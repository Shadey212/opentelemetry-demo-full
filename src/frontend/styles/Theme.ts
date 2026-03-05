// Copyright The OpenTelemetry Authors
// SPDX-License-Identifier: Apache-2.0

import { DefaultTheme } from 'styled-components';

const Theme: DefaultTheme = {
  colors: {
    otelBlue: '#f97316',                  // Orange — primary CTA / button
    otelYellow: '#fbbf24',                // Amber — badge / highlight
    otelGray: '#0f172a',                  // Slate-900 — header / footer bg
    otelRed: '#ef4444',                   // Red — errors
    backgroundGray: '#f8fafc',            // Slate-50 — page background
    lightBorderGray: 'rgba(15,23,42,0.1)',// Light dividers
    borderGray: '#e2e8f0',               // Slate-200 — card borders
    textGray: '#0f172a',                  // Slate-900 — primary text
    textLightGray: '#64748b',             // Slate-500 — muted text
    white: '#ffffff',
  },
  breakpoints: {
    desktop: '@media (min-width: 768px)',
  },
  sizes: {
    mxLarge: '22px',
    mLarge: '20px',
    mMedium: '14px',
    mSmall: '12px',
    dxLarge: '56px',
    dLarge: '40px',
    dMedium: '18px',
    dSmall: '16px',
    nano: '8px',
  },
  fonts: {
    bold: '800',
    regular: '500',
    semiBold: '700',
    light: '400',
  },
};

export default Theme;
