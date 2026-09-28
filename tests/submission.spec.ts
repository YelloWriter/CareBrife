import { test, expect } from '@playwright/test';

test('public pages have one description, correct language metadata and working assets', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', e => errors.push(e.message));
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  for (const path of ['/', '/en/', '/create/']) {
    await page.goto(path);
    await expect(page.locator('meta[name="description"]')).toHaveCount(1);
    await expect(page.locator('meta[property="og:image"]')).toHaveCount(1);
    if (path === '/en/') {
      await expect(page).toHaveTitle(/One caring page/);
      await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /Organize a parent/);
    }
    for (const img of await page.locator('img').all()) {
      await img.evaluate(el => { (el as HTMLImageElement).loading = 'eager'; });
      await expect.poll(() => img.evaluate(el => (el as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
      expect(await img.getAttribute('alt')).not.toBeNull();
    }
    for (const width of [320, 390, 768, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    }
    const broken = await page.locator('a[href^="#"]').evaluateAll(links => links.filter(link => {
      const hash = (link as HTMLAnchorElement).hash;
      return hash && !document.getElementById(decodeURIComponent(hash.slice(1)));
    }).map(link => link.getAttribute('href')));
    expect(broken).toEqual([]);
  }
  expect(errors).toEqual([]);
});
