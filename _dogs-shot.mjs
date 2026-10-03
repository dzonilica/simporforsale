export default async function run(page) {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.evaluate(() => {
    const el = document.querySelector('#dogs-for-sale');
    if (el) el.scrollIntoView({ block: 'start' });
  });
  await page.waitForTimeout(700);
  const el = await page.$('#dogs-for-sale');
  if (el) {
    await el.screenshot({
      path: 'c:/Users/nikol/Downloads/simpor-premium-v2/_dogs-section-preview.png'
    });
    return 'shot ok';
  }
  return 'section not found';
}
