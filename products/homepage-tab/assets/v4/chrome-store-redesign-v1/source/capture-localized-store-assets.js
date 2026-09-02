async (page) => {
  const locales = [
    'ar', 'bg', 'bn', 'ca', 'cs', 'da', 'de', 'el', 'en', 'es', 'es-419', 'et', 'fa', 'fi', 'fil', 'fr', 'hi', 'hr', 'hu', 'id', 'it', 'iw', 'ja',
    'ko', 'lt', 'lv', 'ms', 'nl', 'no', 'pl', 'pt-BR', 'pt-PT', 'ro', 'ru', 'sk', 'sl', 'sr', 'sv', 'sw', 'th', 'tr', 'uk', 'vi', 'zh-CN', 'zh-TW'
  ];
  const baseUrl = 'http://127.0.0.1:18988/source/chrome-store-promo.html';
  const assetDirectory = '/Users/gaoyong/Documents/work/xinyuan_tech/product-content/products/homepage-tab/assets/v4/chrome-store-redesign-v1';

  async function capture(locale, variant, width, height, filename, options) {
    await page.setViewportSize({ width, height });
    await page.goto(baseUrl + '?locale=' + encodeURIComponent(locale) + '&variant=' + variant, { waitUntil: 'networkidle' });
    await page.waitForFunction(() => document.documentElement.dataset.ready === 'true');
    await page.screenshot({
      path: assetDirectory + '/' + locale + '/' + filename,
      scale: 'css',
      ...options
    });
  }

  for (const locale of locales) {
    await capture(locale, 'marquee', 1400, 560, 'chrome-marquee-promo.png', { type: 'png' });
    await capture(locale, 'small', 440, 280, 'chrome-small-promo.png', { type: 'png' });
    await capture(locale, 'dashboard', 1280, 800, 'chrome-screenshot-1-dashboard.png', { type: 'png' });
  }

  return 'Rendered ' + locales.length + ' localized asset sets';
}
