import { readFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const sourceDirectory = dirname(fileURLToPath(import.meta.url));
const playwrightModule = await import(pathToFileURL(resolve(sourceDirectory, '../../../../../../../homepage-tab-web/node_modules/playwright/index.js')));

const { chromium } = playwrightModule.default;

const assetDirectory = new URL('../', import.meta.url).pathname.replace(/\/$/, '');
const locales = Object.keys(JSON.parse(await readFile(new URL('./locale-copy.json', import.meta.url), 'utf8'))).sort();
const variants = {
  marquee: { width: 1400, height: 560, filename: 'chrome-marquee-promo' },
  small: { width: 440, height: 280, filename: 'chrome-small-promo' },
  dashboard: { width: 1280, height: 800, filename: 'chrome-screenshot-1-dashboard' }
};
const outputFormats = {
  png: { extension: 'png', options: { type: 'png' } },
  jpeg: { extension: 'jpg', options: { type: 'jpeg', quality: 94 } }
};
const argumentsList = process.argv.slice(2);
const requestedLocales = argumentsList
  .filter((argument) => argument.startsWith('--locale='))
  .map((argument) => argument.slice('--locale='.length));
const requestedFormat = argumentsList.find((argument) => argument.startsWith('--format='))?.slice('--format='.length) ?? 'png';
const requestedVariants = argumentsList.filter((argument) => !argument.startsWith('--locale=') && !argument.startsWith('--format='));
const selectedVariants = requestedVariants.length === 0 ? ['marquee'] : requestedVariants;
const selectedLocales = requestedLocales.length === 0 ? locales : requestedLocales;

for (const variant of selectedVariants) {
  if (!variants[variant]) {
    throw new Error(`Unsupported store asset variant: ${variant}`);
  }
}

for (const locale of selectedLocales) {
  if (!locales.includes(locale)) {
    throw new Error(`Unsupported store locale: ${locale}`);
  }
}

if (!outputFormats[requestedFormat]) {
  throw new Error(`Unsupported store asset format: ${requestedFormat}`);
}

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();

for (const variant of selectedVariants) {
  const definition = variants[variant];
  for (const locale of selectedLocales) {
    await page.setViewportSize({ width: definition.width, height: definition.height });
    await page.goto(`http://127.0.0.1:18988/source/chrome-store-promo.html?locale=${encodeURIComponent(locale)}&variant=${variant}`, { waitUntil: 'networkidle' });
    await page.waitForFunction(() => document.documentElement.dataset.ready === 'true');
    await page.screenshot({
      scale: 'css',
      path: `${assetDirectory}/${locale}/${definition.filename}.${outputFormats[requestedFormat].extension}`,
      ...outputFormats[requestedFormat].options
    });
  }
}

await browser.close();
process.stdout.write(`Rendered ${selectedLocales.length * selectedVariants.length} localized store assets.\n`);
