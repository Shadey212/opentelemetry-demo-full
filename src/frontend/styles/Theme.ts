// Copyright The OpenTelemetry Authors
// SPDX-License-Identifier: Apache-2.0

import { DefaultTheme } from 'styled-components';

const Theme: DefaultTheme = {
  colors: {
    otelBlue: '#5B63D3',                  // Better Stack indigo — primary CTA
    otelYellow: '#7C87F7',                // Indigo-light — highlight
    otelGray: '#0a0a0a',                  // Near-black — hero / footer bg
    otelRed: '#ef4444',                   // Red — errors
    backgroundGray: '#f9fafb',            // Gray-50 — page background
    lightBorderGray: 'rgba(0,0,0,0.06)', // Light dividers
    borderGray: '#e5e7eb',               // Gray-200 — card borders
    textGray: '#111827',                  // Gray-900 — primary text
    textLightGray: '#6b7280',             // Gray-500 — muted text
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
