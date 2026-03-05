// Copyright The OpenTelemetry Authors
// SPDX-License-Identifier: Apache-2.0
//
// Realistic Playwright-based traffic generator for the Better Stack Store.
// Simulates multiple concurrent virtual users performing real browser journeys.
// Because this runs a real Chromium browser the Better Stack JS tag fires
// normally → session replays, web vitals and RUM are captured as real data.
//
// Journey weights (out of 100):
//   30%  Window shopping  — browse home, view a product, leave
//   25%  Browse & cart    — add item(s), abandon (no checkout)
//   20%  Full checkout    — complete purchase end-to-end
//   10%  Multi-product    — view several products, add two or more
//   10%  Currency switch  — change currency, browse with new prices
//    5%  Deep read        — scroll, read reviews, do nothing else

const { chromium } = require('playwright');

const BASE_URL  = process.env.FRONTEND_URL  || 'http://frontend-proxy.otel-demo.svc.cluster.local';
const CONCURRENCY       = parseInt(process.env.CONCURRENCY       || '4',    10);
const THINK_MIN         = parseInt(process.env.THINK_MIN         || '600',  10);
const THINK_MAX         = parseInt(process.env.THINK_MAX         || '4500', 10);
const SESSION_PAUSE_MIN = parseInt(process.env.SESSION_PAUSE_MIN || '3000', 10);
const SESSION_PAUSE_MAX = parseInt(process.env.SESSION_PAUSE_MAX || '10000', 10);

// ──────────────────────────────────────────────────────────────
// Test data pools
// ──────────────────────────────────────────────────────────────

const USER_AGENTS = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
  'Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Mobile/15E148 Safari/604.1',
  'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Mobile Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:125.0) Gecko/20100101 Firefox/125.0',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 14.4; rv:125.0) Gecko/20100101 Firefox/125.0',
];

const VIEWPORTS = [
  { width: 1440, height: 900  },
  { width: 1280, height: 800  },
  { width: 1920, height: 1080 },
  { width: 1366, height: 768  },
  { width: 390,  height: 844  },  // iPhone 14
  { width: 393,  height: 851  },  // Pixel 8
  { width: 820,  height: 1180 },  // iPad Air
];

const LOCALES    = ['en-US', 'en-GB', 'de-DE', 'fr-FR', 'es-ES', 'ja-JP', 'pt-BR', 'ko-KR', 'zh-CN', 'it-IT', 'nl-NL', 'sv-SE'];
const TIMEZONES  = ['America/New_York', 'America/Los_Angeles', 'America/Chicago', 'America/Denver', 'America/Sao_Paulo', 'Europe/London', 'Europe/Berlin', 'Europe/Paris', 'Europe/Rome', 'Europe/Amsterdam', 'Europe/Stockholm', 'Asia/Tokyo', 'Asia/Seoul', 'Asia/Shanghai', 'Asia/Kolkata', 'Australia/Sydney', 'Pacific/Auckland'];
const CURRENCIES = ['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD'];

const GEOLOCATIONS = [
  { latitude: 40.7128,  longitude: -74.0060  }, // New York
  { latitude: 34.0522,  longitude: -118.2437 }, // Los Angeles
  { latitude: 41.8781,  longitude: -87.6298  }, // Chicago
  { latitude: 51.5074,  longitude: -0.1278   }, // London
  { latitude: 48.8566,  longitude: 2.3522    }, // Paris
  { latitude: 52.5200,  longitude: 13.4050   }, // Berlin
  { latitude: 35.6762,  longitude: 139.6503  }, // Tokyo
  { latitude: -23.5505, longitude: -46.6333  }, // São Paulo
  { latitude: 37.5665,  longitude: 126.9780  }, // Seoul
  { latitude: -33.8688, longitude: 151.2093  }, // Sydney
  { latitude: 19.0760,  longitude: 72.8777   }, // Mumbai
  { latitude: 55.7558,  longitude: 37.6173   }, // Moscow
  { latitude: 49.2827,  longitude: -123.1207 }, // Vancouver
  { latitude: 45.4642,  longitude: 9.1900    }, // Milan
  { latitude: 59.3293,  longitude: 18.0686   }, // Stockholm
];

const UTM_SOURCES   = ['google', 'facebook', 'twitter', 'linkedin', 'newsletter', 'reddit', 'youtube', 'bing', 'direct', 'instagram', 'tiktok'];
const UTM_MEDIUMS   = ['cpc', 'organic', 'social', 'email', 'referral', 'display', 'affiliate'];
const UTM_CAMPAIGNS = ['spring_sale', 'new_arrivals', 'clearance', 'brand_awareness', 'retargeting', 'holiday_promo', 'launch_2024', 'astronomy_week', 'telescope_deals', 'back_to_school'];
const UTM_TERMS     = ['telescope', 'astronomy gear', 'stargazing', 'astrophotography', 'binoculars', 'star map', 'observatory'];
const UTM_CONTENTS  = ['hero_banner', 'sidebar_ad', 'email_header', 'carousel_1', 'carousel_2', 'footer_cta', 'popup'];

const REFERRERS = [
  'https://www.google.com/',
  'https://www.google.co.uk/',
  'https://www.bing.com/',
  'https://www.facebook.com/',
  'https://t.co/abc123',
  'https://www.reddit.com/r/telescopes/',
  'https://www.youtube.com/',
  'https://www.instagram.com/',
  'https://news.ycombinator.com/',
  'https://betterstack.com/blog',
  'https://betterstack.com/docs',
  '',  // direct traffic
  '',
  '',
];

const FAKE_USERS = [
  { email: 'alice@example.com',       street: '742 Evergreen Terrace',  city: 'Springfield',   state: 'IL', country: 'United States', zip: '62701', cc: '4432-8015-6152-0454', cvv: '672', month: '3',  year: '2028' },
  { email: 'bob.smith@demo.org',      street: '1600 Amphitheatre Pkwy', city: 'Mountain View',  state: 'CA', country: 'United States', zip: '94043', cc: '4111-1111-1111-1111', cvv: '123', month: '6',  year: '2027' },
  { email: 'charlie@test.com',        street: '350 Fifth Ave',          city: 'New York',       state: 'NY', country: 'United States', zip: '10118', cc: '4000-0566-5566-5556', cvv: '456', month: '9',  year: '2029' },
  { email: 'diana.jones@example.net', street: '233 S Wacker Dr',        city: 'Chicago',        state: 'IL', country: 'United States', zip: '60606', cc: '4012-8888-8888-1881', cvv: '789', month: '12', year: '2028' },
  { email: 'eve@shopper.io',          street: '1 Infinite Loop',        city: 'Cupertino',      state: 'CA', country: 'United States', zip: '95014', cc: '4917-6101-6141-3107', cvv: '321', month: '2',  year: '2030' },
  { email: 'frank@galaxy.shop',       street: '5th Ave 350',            city: 'New York',       state: 'NY', country: 'United States', zip: '10001', cc: '4532-0151-5154-3291', cvv: '234', month: '7',  year: '2027' },
  { email: 'grace@cosmos.dev',        street: '200 Park Ave',           city: 'New York',       state: 'NY', country: 'United States', zip: '10166', cc: '4716-3840-2580-1234', cvv: '567', month: '4',  year: '2029' },
];

// ──────────────────────────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────────────────────────

function pick(arr)         { return arr[Math.floor(Math.random() * arr.length)]; }
function randInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function sleep(ms)         { return new Promise(r => setTimeout(r, ms)); }
function think()           { return sleep(randInt(THINK_MIN, THINK_MAX)); }
function quickThink()      { return sleep(randInt(200, 800)); }
function sessionPause()    { return sleep(randInt(SESSION_PAUSE_MIN, SESSION_PAUSE_MAX)); }

/** Smooth scroll the page like a human reading content. */
async function humanScroll(page, steps = 5) {
  const height = await page.evaluate(() => document.body.scrollHeight);
  for (let i = 1; i <= steps; i++) {
    await page.evaluate(y => window.scrollTo({ top: y, behavior: 'smooth' }), Math.round((height / steps) * i));
    await sleep(randInt(300, 900));
  }
  // Scroll back up partway
  await page.evaluate(y => window.scrollTo({ top: y, behavior: 'smooth' }), Math.round(height * 0.3));
  await sleep(randInt(200, 600));
}

/** Click a random product card. Returns false if none found. */
async function clickRandomProduct(page) {
  const cards = await page.$$('[data-cy="product-card"]');
  if (!cards.length) return false;
  const card = pick(cards);
  await card.scrollIntoViewIfNeeded();
  await quickThink();
  await card.click();
  return true;
}

// ──────────────────────────────────────────────────────────────
// Journey: Window Shopping
// Land → scroll → maybe view one product → leave
// ──────────────────────────────────────────────────────────────
async function journeyWindowShop(page, label) {
  console.log(`[${label}] window-shop: start`);
  await page.goto(buildLandingUrl(), { waitUntil: 'domcontentloaded', timeout: 20000 });
  await page.waitForSelector('[data-cy="product-card"]', { timeout: 15000 });
  await think();
  await humanScroll(page, randInt(3, 6));
  await think();

  if (Math.random() < 0.6) {
    const clicked = await clickRandomProduct(page);
    if (clicked) {
      await page.waitForSelector('[data-cy="product-detail"]', { timeout: 10000 }).catch(() => {});
      await think();
      await humanScroll(page, 3);
      await think();
    }
  }
  console.log(`[${label}] window-shop: done`);
}

// ──────────────────────────────────────────────────────────────
// Journey: Browse and add to cart (abandon)
// ──────────────────────────────────────────────────────────────
async function journeyBrowseAndCart(page, label) {
  console.log(`[${label}] browse-cart: start`);
  await page.goto(buildLandingUrl(), { waitUntil: 'domcontentloaded', timeout: 20000 });
  await page.waitForSelector('[data-cy="product-card"]', { timeout: 15000 });
  await think();

  const clicked = await clickRandomProduct(page);
  if (!clicked) return;

  await page.waitForSelector('[data-cy="product-detail"]', { timeout: 10000 }).catch(() => {});
  await think();
  await humanScroll(page, 2);
  await think();

  // Occasionally change quantity
  if (Math.random() < 0.35) {
    const qtySelect = page.locator('[data-cy="product-quantity"]');
    if (await qtySelect.count()) {
      await qtySelect.selectOption(String(randInt(1, 3)));
      await quickThink();
    }
  }

  const addBtn = page.locator('[data-cy="product-add-to-cart"]');
  if (await addBtn.count()) {
    await addBtn.click();
    await page.waitForURL('**/cart', { timeout: 10000 }).catch(() => {});
    await think();
    // Abandon — go back to home
    await page.goto(BASE_URL, { waitUntil: 'domcontentloaded', timeout: 15000 });
    await think();
  }

  console.log(`[${label}] browse-cart: done`);
}

// ──────────────────────────────────────────────────────────────
// Journey: Full checkout (end-to-end purchase)
// ──────────────────────────────────────────────────────────────
async function journeyFullCheckout(page, label) {
  console.log(`[${label}] checkout: start`);
  await page.goto(buildLandingUrl(), { waitUntil: 'domcontentloaded', timeout: 20000 });
  await page.waitForSelector('[data-cy="product-card"]', { timeout: 15000 });
  await think();

  const clicked = await clickRandomProduct(page);
  if (!clicked) return;

  await page.waitForSelector('[data-cy="product-detail"]', { timeout: 10000 }).catch(() => {});
  await think();
  await humanScroll(page, 2);
  await think();

  const addBtn = page.locator('[data-cy="product-add-to-cart"]');
  if (!await addBtn.count()) return;
  await addBtn.click();
  await page.waitForURL('**/cart', { timeout: 10000 }).catch(() => {});
  await think();

  const placeOrderBtn = page.locator('[data-cy="checkout-place-order"]');
  if (!await placeOrderBtn.count()) {
    console.log(`[${label}] checkout: no place-order button, skipping`);
    return;
  }

  const user = pick(FAKE_USERS);
  await page.fill('[name="email"]',            user.email  ).catch(() => {});
  await quickThink();
  await page.fill('[name="streetAddress"]',    user.street ).catch(() => {});
  await quickThink();
  await page.fill('[name="zipCode"]',          user.zip    ).catch(() => {});
  await quickThink();
  await page.fill('[name="city"]',             user.city   ).catch(() => {});
  await quickThink();
  await page.fill('[name="state"]',            user.state  ).catch(() => {});
  await quickThink();
  await page.fill('[name="country"]',          user.country).catch(() => {});
  await quickThink();
  await page.fill('[name="creditCardNumber"]', user.cc     ).catch(() => {});
  await quickThink();
  await page.fill('[name="creditCardCvv"]',    user.cvv    ).catch(() => {});
  await quickThink();

  await think();
  await placeOrderBtn.click();
  await page.waitForURL('**/checkout/**', { timeout: 20000 }).catch(() => {});
  await think();
  await humanScroll(page, 2);

  console.log(`[${label}] checkout: done`);
}

// ──────────────────────────────────────────────────────────────
// Journey: Multi-product browser
// View 2–4 products, add 2 to cart, abandon
// ──────────────────────────────────────────────────────────────
async function journeyMultiProduct(page, label) {
  console.log(`[${label}] multi-product: start`);
  await page.goto(buildLandingUrl(), { waitUntil: 'domcontentloaded', timeout: 20000 });
  await page.waitForSelector('[data-cy="product-card"]', { timeout: 15000 });
  await think();
  await humanScroll(page, 2);

  const viewCount = randInt(2, 4);
  let addedCount = 0;

  for (let i = 0; i < viewCount; i++) {
    const clicked = await clickRandomProduct(page);
    if (!clicked) break;

    await page.waitForSelector('[data-cy="product-detail"]', { timeout: 10000 }).catch(() => {});
    await think();
    await humanScroll(page, 2);
    await think();

    if (addedCount < 2) {
      const addBtn = page.locator('[data-cy="product-add-to-cart"]');
      if (await addBtn.count()) {
        await addBtn.click();
        await page.waitForURL('**/cart', { timeout: 10000 }).catch(() => {});
        addedCount++;
        await think();
        await page.goto(BASE_URL, { waitUntil: 'domcontentloaded', timeout: 15000 });
        await page.waitForSelector('[data-cy="product-card"]', { timeout: 10000 }).catch(() => {});
        await think();
        await humanScroll(page, randInt(1, 3));
      }
    } else {
      await page.goBack().catch(() => {});
      await think();
    }
  }

  console.log(`[${label}] multi-product: done (viewed=${viewCount}, added=${addedCount})`);
}

// ──────────────────────────────────────────────────────────────
// Journey: Currency switcher
// Change currency, browse a product with new price
// ──────────────────────────────────────────────────────────────
async function journeyChangeCurrency(page, label) {
  console.log(`[${label}] currency: start`);
  await page.goto(buildLandingUrl(), { waitUntil: 'domcontentloaded', timeout: 20000 });
  await page.waitForSelector('[data-cy="product-card"]', { timeout: 15000 });
  await think();

  const switcher = page.locator('[data-cy="currency-switcher"]');
  if (await switcher.count()) {
    await switcher.selectOption(pick(CURRENCIES)).catch(() => {});
    await think();
    await humanScroll(page, 2);
    await think();

    const clicked = await clickRandomProduct(page);
    if (clicked) {
      await page.waitForSelector('[data-cy="product-detail"]', { timeout: 10000 }).catch(() => {});
      await think();
      await humanScroll(page, 2);
    }
  }

  console.log(`[${label}] currency: done`);
}

// ──────────────────────────────────────────────────────────────
// Journey: Deep read
// View a product, read reviews slowly, don't buy
// ──────────────────────────────────────────────────────────────
async function journeyDeepRead(page, label) {
  console.log(`[${label}] deep-read: start`);
  await page.goto(buildLandingUrl(), { waitUntil: 'domcontentloaded', timeout: 20000 });
  await page.waitForSelector('[data-cy="product-card"]', { timeout: 15000 });
  await think();

  const clicked = await clickRandomProduct(page);
  if (!clicked) return;

  await page.waitForSelector('[data-cy="product-detail"]', { timeout: 10000 }).catch(() => {});
  await think();
  await humanScroll(page, 7);  // scroll slowly through the whole page
  await think();
  await think();  // extra dwell on reviews / recommendations

  console.log(`[${label}] deep-read: done`);
}

// ──────────────────────────────────────────────────────────────
// Journey weights
// ──────────────────────────────────────────────────────────────
const JOURNEYS = [
  [journeyWindowShop,     30],
  [journeyBrowseAndCart,  25],
  [journeyFullCheckout,   20],
  [journeyMultiProduct,   10],
  [journeyChangeCurrency, 10],
  [journeyDeepRead,        5],
];

function pickJourney() {
  const total = JOURNEYS.reduce((sum, [, w]) => sum + w, 0);
  let rand = Math.random() * total;
  for (const [fn, w] of JOURNEYS) {
    rand -= w;
    if (rand <= 0) return fn;
  }
  return JOURNEYS[0][0];
}

// ──────────────────────────────────────────────────────────────
// Worker — one per concurrent virtual user
// ──────────────────────────────────────────────────────────────
/** Build a landing URL with random UTM params (60% of sessions get UTMs). */
function buildLandingUrl() {
  let url = BASE_URL;
  if (Math.random() < 0.6) {
    const params = new URLSearchParams();
    params.set('utm_source', pick(UTM_SOURCES));
    params.set('utm_medium', pick(UTM_MEDIUMS));
    params.set('utm_campaign', pick(UTM_CAMPAIGNS));
    if (Math.random() < 0.5) params.set('utm_term', pick(UTM_TERMS));
    if (Math.random() < 0.4) params.set('utm_content', pick(UTM_CONTENTS));
    url += '?' + params.toString();
  }
  return url;
}

async function runWorker(browser, workerId) {
  const label = `worker-${workerId}`;
  let sessionCount = 0;

  while (true) {
    sessionCount++;
    const geo = pick(GEOLOCATIONS);
    const context = await browser.newContext({
      userAgent:  pick(USER_AGENTS),
      viewport:   pick(VIEWPORTS),
      locale:     pick(LOCALES),
      timezoneId: pick(TIMEZONES),
      geolocation: geo,
      permissions: ['geolocation'],
      extraHTTPHeaders: {
        'Referer': pick(REFERRERS),
      },
    });

    const page = await context.newPage();
    const sessionLabel = `${label}:s${sessionCount}`;

    try {
      const journey = pickJourney();
      await journey(page, sessionLabel);
    } catch (err) {
      console.warn(`[${sessionLabel}] error: ${err.message}`);
    } finally {
      await context.close();
    }

    await sessionPause();
  }
}

// ──────────────────────────────────────────────────────────────
// Entry point
// ──────────────────────────────────────────────────────────────
async function main() {
  console.log('Better Stack Store traffic generator starting');
  console.log(`  Target:      ${BASE_URL}`);
  console.log(`  Concurrency: ${CONCURRENCY} workers`);
  console.log(`  Think time:  ${THINK_MIN}–${THINK_MAX}ms`);

  const browser = await chromium.launch({
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
    ],
  });

  const workers = [];
  for (let i = 1; i <= CONCURRENCY; i++) {
    workers.push(runWorker(browser, i));
    await sleep(randInt(800, 3000));
  }

  await Promise.all(workers);
}

main().catch(err => {
  console.error('Fatal:', err);
  process.exit(1);
});
