export default async function run(page, ui) {
  // Set a wide viewport so the world map has room to render
  await page.setViewportSize({ width: 1400, height: 900 });

  // Wait for the map to appear
  await page.waitForSelector('.worldmap-section', { timeout: 10000 });

  // Scroll the world map into view (top of section)
  await page.evaluate(() => {
    const el = document.querySelector('.worldmap-section');
    if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
  });
  await page.waitForTimeout(400);

  // Grab bounding rects for the map + country list
  const geometry = await page.evaluate(() => {
    const pick = sel => {
      const el = document.querySelector(sel);
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return { x: r.x, y: r.y, w: r.width, h: r.height };
    };
    const dots = Array.from(document.querySelectorAll('.dot-group')).map(g => ({
      country: g.getAttribute('data-country'),
      dogs: g.getAttribute('data-dogs'),
    }));
    const tiles = Array.from(document.querySelectorAll('.country-tile')).map(t => ({
      country: t.getAttribute('data-country'),
      text: t.innerText.replace(/\s+/g, ' ').trim(),
    }));
    // Check the bg image loaded
    const bg = document.querySelector('.worldmap-bg');
    const bgStyle = bg ? getComputedStyle(bg).backgroundImage : null;
    return {
      worldmap: pick('.worldmap'),
      wrap: pick('.worldmap-wrap'),
      tilesBox: pick('.country-tiles'),
      dots,
      tiles,
      bgStyle,
    };
  });

  // Take a screenshot of the whole map section
  await page.locator('.worldmap-section').screenshot({
    path: 'c:/Users/nikol/Downloads/simpor-premium-v2/_worldmap-qa.png'
  });

  return geometry;
}
