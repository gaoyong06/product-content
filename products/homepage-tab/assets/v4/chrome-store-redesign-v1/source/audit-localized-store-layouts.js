async (page) => {
  const locales = [
    'ar', 'bg', 'bn', 'ca', 'cs', 'da', 'de', 'el', 'en', 'es', 'es-419', 'et', 'fa', 'fi', 'fil', 'fr', 'hi', 'hr', 'hu', 'id', 'it', 'iw', 'ja',
    'ko', 'lt', 'lv', 'ms', 'nl', 'no', 'pl', 'pt-BR', 'pt-PT', 'ro', 'ru', 'sk', 'sl', 'sr', 'sv', 'sw', 'th', 'tr', 'uk', 'vi', 'zh-CN', 'zh-TW'
  ];
  const variants = [
    { name: 'marquee', width: 1400, height: 560, selectors: ['.marquee-copy', '.screen-frame'] },
    { name: 'small', width: 440, height: 280, selectors: ['.small-product-name', '.small img'] },
    { name: 'dashboard', width: 1280, height: 800, selectors: ['.dashboard-message', '.dashboard img'] }
  ];
  const baseUrl = 'http://127.0.0.1:18988/source/chrome-store-promo.html';
  const failures = [];

  for (const locale of locales) {
    for (const variant of variants) {
      await page.setViewportSize({ width: variant.width, height: variant.height });
      await page.goto(baseUrl + '?locale=' + encodeURIComponent(locale) + '&variant=' + variant.name, { waitUntil: 'networkidle' });
      await page.waitForFunction(() => document.documentElement.dataset.ready === 'true');
      const result = await page.evaluate((selectors) => {
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        return selectors.map((selector) => {
          const element = document.querySelector(selector);
          if (!element) {
            return { selector, exists: false };
          }
          const rect = element.getBoundingClientRect();
          return {
            selector,
            exists: true,
            left: rect.left,
            top: rect.top,
            right: rect.right,
            bottom: rect.bottom,
            viewportWidth,
            viewportHeight
          };
        });
      }, variant.selectors);

      for (const item of result) {
        const isWithinViewport = item.exists
          && item.left >= 0
          && item.top >= 0
          && item.right <= item.viewportWidth
          && item.bottom <= item.viewportHeight;
        if (!isWithinViewport) {
          failures.push({ locale, variant: variant.name, ...item });
        }
      }
    }
  }

  if (failures.length > 0) {
    throw new Error(JSON.stringify(failures));
  }

  return 'Audited ' + locales.length * variants.length + ' localized promotion layouts';
}
