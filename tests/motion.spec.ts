import { test, expect } from '@playwright/test';

test('sections reveal once, stagger within groups and respond to live reduced motion', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/');
  const cards = page.locator('.step-grid > article');
  await expect(cards.first()).toHaveClass(/scroll-reveal/);
  await expect(cards.first()).not.toHaveClass(/is-visible/);
  await page.getByRole('link', { name: '이용 방법', exact: true }).click();
  await expect(cards.first()).toHaveClass(/is-visible/);
  expect(await cards.evaluateAll(items => items.map(el => (el as HTMLElement).style.getPropertyValue('--reveal-delay')))).toEqual(['0ms', '60ms', '120ms', '180ms']);
  await page.getByRole('link', { name: '진료한장 홈' }).click();
  await expect(cards.first()).toHaveClass(/is-visible/);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  const faq = page.locator('.faq-list > details').last();
  await expect(faq).toHaveClass(/is-visible/);
  expect(await faq.evaluate(el => getComputedStyle(el).transform)).toBe('none');
});

test('keyboard focus reveals content immediately; no-JS still shows sections', async ({ page, browser }) => {
  await page.goto('/');
  const summary = page.locator('.faq-list summary').first();
  await summary.focus();
  await expect(page.locator('.faq-list > details').first()).toHaveClass(/is-visible/);
  await summary.press('Enter');
  await expect(page.locator('.faq-list > details').first()).toHaveAttribute('open', '');
  const context = await browser.newContext({ javaScriptEnabled: false });
  const plain = await context.newPage();
  await plain.goto(new URL('/', page.url()).href);
  expect(await plain.locator('.step-grid').evaluate(el => getComputedStyle(el).opacity)).toBe('1');
  await context.close();
});
