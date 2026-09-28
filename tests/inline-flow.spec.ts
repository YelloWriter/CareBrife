import { test, expect } from '@playwright/test';

test('same-page sliding keeps the document and draft, and the same mic button toggles', async ({ page }) => {
  await page.addInitScript(() => {
    delete (Navigator.prototype as { gpu?: unknown }).gpu;
    class Speech {
      onstart?: () => void; onresult?: (e: unknown) => void; onend?: () => void;
      start() { this.onstart?.(); this.onresult?.({results:[{ isFinal:true,0:{ transcript:'오늘 무릎이 불편해요.' }}]}); }
      stop() { this.onend?.(); } abort() {}
    }
    Object.defineProperty(window, 'SpeechRecognition', { value:Speech });
  });
  await page.goto('/');
  await page.evaluate(() => { document.body.dataset.sameDocument = 'yes'; });
  await page.getByRole('link', { name:'진료한장 만들어보기' }).click();
  await expect(page).toHaveURL('/#create-report');
  await expect(page.locator('body')).toHaveAttribute('data-same-document', 'yes');
  await expect.poll(() => page.locator('#create-report').evaluate(el => Math.round(el.getBoundingClientRect().top))).toBeLessThan(150);
  await page.getByRole('button', { name:'진료한장 만들기', exact:true }).click();
  const start = page.getByRole('button', { name:'녹음 시작', exact:true });
  await start.scrollIntoViewIfNeeded();
  const before = await start.boundingBox();
  await start.click();
  const stop = page.getByRole('button', { name:'녹음 마치기', exact:true });
  await expect(stop).toHaveAttribute('aria-pressed','true');
  const after = await stop.boundingBox();
  expect(Math.abs(before!.y - after!.y)).toBeLessThan(3);
  await stop.click();
  await expect(page.getByLabel('가장 전하고 싶은 내용', { exact:true })).toHaveValue('오늘 무릎이 불편해요.');
  await page.setViewportSize({ width:1440, height:1000 });
  await page.getByRole('link', { name:'개인정보 안내', exact:true }).click();
  await page.getByRole('link', { name:'만들어보기', exact:true }).click();
  await expect(page.getByLabel('가장 전하고 싶은 내용', { exact:true })).toHaveValue('오늘 무릎이 불편해요.');
  await expect(page.locator('body')).toHaveAttribute('data-same-document','yes');
  await page.getByRole('button', { name:'확인하고 완료' }).click();
  await page.emulateMedia({ media:'print' });
  await expect(page.locator('.inline-brief-heading')).toBeHidden();
  await expect(page.locator('.site-header')).toBeHidden();
  await expect(page.locator('.bf-print')).toBeVisible();
});

test('four generated scenes load, animate differently, pause and respect reduced motion', async ({ page }) => {
  await page.goto('/');
  const journey = page.locator('.care-journey');
  await journey.scrollIntoViewIfNeeded();
  await expect(journey).toHaveAttribute('data-animate','true');
  const images = journey.locator('img');
  await expect(images).toHaveCount(4);
  for (const img of await images.all()) {
    await expect.poll(() => img.evaluate((el: HTMLImageElement) => el.naturalWidth)).toBeGreaterThan(0);
  }
  const animations = await images.evaluateAll(imgs => imgs.map(el => getComputedStyle(el).animationName));
  expect(new Set(animations).size).toBe(4);
  await page.getByRole('button', { name:'움직임 멈추기' }).click();
  await expect(journey).toHaveAttribute('data-animate','false');
  expect(await images.first().evaluate(el => getComputedStyle(el).animationPlayState)).toBe('paused');
  for(const width of [390,1440]) {
    await page.setViewportSize({width,height:1000});
    await journey.scrollIntoViewIfNeeded();
    await journey.evaluate(el => window.scrollTo({ top:el.getBoundingClientRect().top + window.scrollY - 100, behavior:"instant" }));
    await journey.screenshot({path:`test-results/journey-${width}.png`});
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  }
  await page.emulateMedia({ reducedMotion:'reduce' });
  expect(await images.first().evaluate(el => getComputedStyle(el).animationName)).toBe('none');
});
