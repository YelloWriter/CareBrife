import lighthouse from 'lighthouse';
import { launch } from 'chrome-launcher';
import { mkdir, writeFile } from 'node:fs/promises';
const url = process.env.AUDIT_URL || 'http://127.0.0.1:3000';
const chrome = await launch({ chromePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE, chromeFlags: ['--headless', '--disable-gpu'] });
try {
  await mkdir('.lighthouse', { recursive: true });
  for (const mode of ['mobile', 'desktop']) {
    const config = mode === 'desktop' ? { extends: 'lighthouse:default', settings: { formFactor: 'desktop', screenEmulation: { mobile: false, width: 1440, height: 900, deviceScaleFactor: 1, disabled: false }, throttling: { rttMs: 40, throughputKbps: 10240, cpuSlowdownMultiplier: 1, requestLatencyMs: 0, downloadThroughputKbps: 0, uploadThroughputKbps: 0 } } } : undefined;
    const result = await lighthouse(url, { port: chrome.port, output: ['html', 'json'], onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'], logLevel: 'error' }, config);
    await writeFile(`.lighthouse/${mode}.html`, result.report[0]);
    await writeFile(`.lighthouse/${mode}.json`, result.report[1]);
    console.log(mode, JSON.stringify(Object.fromEntries(Object.entries(result.lhr.categories).map(([key, value]) => [key, Math.round(value.score * 100)]))));
    console.log('Findings', JSON.stringify(Object.entries(result.lhr.audits).filter(([, a]) => a.score !== null && a.score < 1 && a.details?.items?.length).map(([id, a]) => ({ id, title: a.title, score: a.score })).slice(0, 20)));
  }
} finally { await chrome.kill(); }
