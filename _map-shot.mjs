import { chromium } from 'file:///C:/Users/nikol/.vscode/extensions/danielsanmedium.dscodegpt-3.24.46/standalone/node_modules/patchright/index.mjs';

const browser = await chromium.launch({ headless: true, channel: 'chromium', args: ['--no-sandbox', '--disable-dev-shm-usage'] });
const page = await browser.newPage({ viewport: { width: 1800, height: 1100 } });
await page.goto('file:///c:/Users/nikol/Downloads/simpor-premium-v2/index.html');
await page.waitForLoadState('networkidle');
const el = await page.$('.worldmap');
await el.scrollIntoViewIfNeeded();
await page.waitForTimeout(500);
await el.screenshot({ path: 'c:/Users/nikol/Downloads/simpor-premium-v2/_map-check.png' });
await browser.close();
console.log('done');
