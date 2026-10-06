import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { API, CONTRACT, IMD, LINKS } from '../src/constants';

const pair = { chainId: 'ethereum', baseToken: { address: CONTRACT }, quoteToken: { address: IMD }, priceUsd: '0.000042', marketCap: 42000, liquidity: { usd: 8400 }, volume: { h24: 1200 } };
async function mock(page: Page, body: unknown = { pairs: [pair] }) {
  await page.route(API, route => route.fulfill({ json: body }));
}

test('production subpath, exact links, local assets, semantics and copy with keyboard', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await mock(page);
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  const failedAssets: string[] = [];
  page.on('response', response => { if (response.url().includes('/preview/') && response.status() >= 400) failedAssets.push(response.url()); });
  await page.goto('./');
  await expect(page).toHaveTitle('DAEMON');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('DAEMON');
  for (const [label, href] of [['Buy on Uniswap', LINKS.buy], ['Chart', LINKS.chart], ['Etherscan', LINKS.etherscan], ['View source code', LINKS.source], ['View token job', LINKS.tokenJob], ['View logo job', LINKS.logoJob]]) {
    await expect(page.getByRole('link', { name: label, exact: false })).toHaveAttribute('href', href);
  }
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Skip to content' })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('main')).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(page.getByRole('button', { name: 'Copy contract address', exact: true })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.getByText('Contract address copied.', { exact: true })).toBeVisible();
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(CONTRACT);
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Buy on Uniswap' })).toBeFocused();
  await page.getByRole('button', { name: 'Pause cursor' }).click();
  await expect(page.locator('.cursor')).toHaveCSS('animation-name', 'none');
  await expect(page.locator('.metric dd').first()).toHaveText('$0.000042');
  expect(await page.evaluate(() => document.fonts.check('400 16px "IBM Plex Mono"'))).toBe(true);
  expect(errors).toEqual([]);
  expect(failedAssets).toEqual([]);
});

test('copy denial gives a persistent manual recovery and selects the complete address', async ({ page }) => {
  await mock(page);
  await page.addInitScript(() => Object.defineProperty(navigator, 'clipboard', { value: { writeText: () => Promise.reject(new Error('denied')) } }));
  await page.goto('./');
  await page.getByRole('button', { name: 'Copy contract address', exact: true }).click();
  await expect(page.getByText('Copy unavailable. Select and copy the full address above.')).toBeVisible();
  expect(await page.evaluate(() => window.getSelection()?.toString())).toBe(CONTRACT);
  await expect(page.getByRole('link', { name: 'Buy on Uniswap' })).toBeVisible();
});

test('primary buttons navigate to the exact external destinations', async ({ page }) => {
  await mock(page);
  for (const [label, destination] of [['Buy on Uniswap', LINKS.buy], ['Chart', LINKS.chart], ['Etherscan', LINKS.etherscan]]) {
    await page.route(destination, route => route.fulfill({ contentType: 'text/html', body: '<title>Destination fixture</title>' }));
    await page.goto('./');
    await page.getByRole('link', { name: label, exact: false }).click();
    await expect(page).toHaveURL(destination);
  }
});

test('60 second refresh, true IMD pool, error clearing, recovery, pause and resume', async ({ page }) => {
  await page.clock.install();
  let calls = 0;
  await page.route(API, async route => {
    calls++;
    if (calls === 2) return route.abort();
    return route.fulfill({ json: { pairs: [{ ...pair, quoteToken: { address: '0xother', symbol: 'IMD' }, priceUsd: '999' }, pair] } });
  });
  await page.goto('./');
  await expect(page.locator('.metric dd').first()).toHaveText('$0.000042');
  await page.clock.fastForward(59_000);
  expect(calls).toBe(1);
  await page.clock.fastForward(1_000);
  await expect(page.locator('.metric dd')).toHaveText(['—', '—', '—', '—']);
  await expect(page.getByText('Data unavailable. Retrying every 60 s.')).toBeVisible();
  await page.clock.fastForward(60_000);
  await expect(page.locator('.metric dd')).toHaveText(['$0.000042', '$42,000.00', '$8,400.00', '$1,200.00']);
  await page.getByRole('button', { name: 'Pause updates' }).click();
  await page.clock.fastForward(120_000);
  expect(calls).toBe(3);
  await page.getByRole('button', { name: 'Resume updates' }).click();
  await expect.poll(() => calls).toBe(4);
});

test('empty pairs and malformed responses keep all static content usable', async ({ page }) => {
  await mock(page, { pairs: [] });
  await page.goto('./');
  await expect(page.locator('.metric dd')).toHaveText(['—', '—', '—', '—']);
  await expect(page.getByText('No IMD pair available yet. Retrying every 60 s.')).toBeVisible();
  await page.route(API, route => route.fulfill({ body: '{bad', contentType: 'application/json' }));
  await page.reload();
  await expect(page.getByText('Data unavailable. Retrying every 60 s.')).toBeVisible();
  await expect(page.getByRole('link', { name: 'Etherscan', exact: true })).toBeVisible();
});

test('pending request times out after ten seconds', async ({ page }) => {
  await page.clock.install();
  await page.route(API, () => new Promise(() => {}));
  await page.goto('./');
  await expect(page.getByText('Loading market data…')).toBeVisible();
  await page.clock.fastForward(10_001);
  await expect(page.getByText('Data unavailable. Retrying every 60 s.')).toBeVisible();
});

test('responsive reflow, 200% text size, reduced motion, and automated accessibility', async ({ page }) => {
  await mock(page);
  await page.goto('./');
  for (const width of [320, 375, 640, 960, 1280, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await expect(page.getByRole('button', { name: 'Copy contract address', exact: true })).toBeVisible();
  }
  await page.setViewportSize({ width: 375, height: 812 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(page.locator('.cursor')).toHaveCSS('animation-name', 'none');
  const audit = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze();
  expect(audit.violations).toEqual([]);
  await page.emulateMedia({ forcedColors: 'active' });
  await expect(page.locator('.hero-art img')).toHaveCSS('mix-blend-mode', 'normal');
  await page.emulateMedia({ forcedColors: 'none' });
  await page.evaluate(() => document.documentElement.style.fontSize = '200%');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test('prerendered content and primary navigation work without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto('http://127.0.0.1:4173/preview/');
  await expect(page.getByRole('heading', { name: 'DAEMON', exact: true })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Buy on Uniswap' })).toHaveAttribute('href', LINKS.buy);
  await expect(page.locator('.live-section noscript')).toBeVisible();
  // Playwright text matchers intentionally omit noscript; inspect its DOM text.
  expect(await page.locator('.live-section noscript').evaluate(element => element.textContent)).toContain('Live figures need JavaScript.');
  await context.close();
});
