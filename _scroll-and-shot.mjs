export default async function run(page) {
  await page.setViewportSize({ width: 1400, height: 950 });
  await page.evaluate(() => {
    const el = document.querySelector('.worldmap-section');
    el.scrollIntoView({ block: 'start' });
  });
  await page.waitForTimeout(600);
  await page.locator('.worldmap-section').screenshot({
    path: 'c:/Users/nikol/Downloads/simpor-premium-v2/_map-only.png'
  });
  return 'ok';
}
