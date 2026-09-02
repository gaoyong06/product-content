import { resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { dirname } from 'node:path';
import { measureLocalizedWidgetEdges } from './measure-localized-widget-edges.mjs';

const sourceDirectory = dirname(fileURLToPath(import.meta.url));
const playwrightModule = await import(pathToFileURL(resolve(sourceDirectory, '../../../../../../../homepage-tab-web/node_modules/playwright/index.js')));
const { chromium } = playwrightModule.default;
const baseUrl = 'http://127.0.0.1:18988/source/chrome-store-promo.html';
const measurements = await measureLocalizedWidgetEdges();
const failures = [];
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();

function isAligned(actual, expected) {
  return Math.abs(actual - expected) <= 0.1;
}

for (const [locale, measurement] of Object.entries(measurements)) {
  const isRightToLeft = measurement.direction === 'rtl';
  const variants = [
    { name: 'dashboard', width: 1280, height: 800, selector: '.dashboard-message', inlineStart: measurement.dashboardInlineStart },
    { name: 'small', width: 440, height: 280, selector: '.small-product-name', inlineStart: measurement.smallInlineStart }
  ];

  for (const variant of variants) {
    await page.setViewportSize({ width: variant.width, height: variant.height });
    await page.goto(`${baseUrl}?locale=${encodeURIComponent(locale)}&variant=${variant.name}`, { waitUntil: 'networkidle' });
    await page.waitForFunction(() => document.documentElement.dataset.ready === 'true');
    const result = await page.evaluate(({ selector, rightToLeft, variantName }) => {
      const rect = document.querySelector(selector).getBoundingClientRect();
      const smallCopy = variantName === 'small' ? (() => {
        const copy = document.querySelector('.small-promo-copy').getBoundingClientRect();
        const line = (copySelector) => {
          const element = document.querySelector(copySelector);
          const lineHeight = Number.parseFloat(window.getComputedStyle(element).lineHeight);
          const bounds = element.getBoundingClientRect();
          return {
            isSingleLine: bounds.height <= lineHeight + 0.1,
            isHorizontallyContained: element.scrollWidth <= element.clientWidth + 0.1
          };
        };

        return {
          isWithinViewport: copy.left >= 0 && copy.top >= 0 && copy.right <= window.innerWidth && copy.bottom <= window.innerHeight,
          headline: line('.small-promo-headline'),
          feature: line('.small-promo-feature')
        };
      })() : null;
      return {
        anchor: rightToLeft ? rect.right : rect.left,
        measuredInlineStart: Number(document.documentElement.dataset[selector === '.dashboard-message'
          ? 'dashboardWidgetInlineStart'
          : 'smallWidgetInlineStart']),
        smallCopy
      };
    }, { selector: variant.selector, rightToLeft: isRightToLeft, variantName: variant.name });
    const expectedAnchor = isRightToLeft ? variant.width - variant.inlineStart : variant.inlineStart;
    const smallCopyIsValid = variant.name !== 'small'
      || (result.smallCopy.isWithinViewport
        && result.smallCopy.headline.isSingleLine
        && result.smallCopy.headline.isHorizontallyContained
        && result.smallCopy.feature.isSingleLine
        && result.smallCopy.feature.isHorizontallyContained);

    if (!isAligned(result.anchor, expectedAnchor) || !isAligned(result.measuredInlineStart, variant.inlineStart) || !smallCopyIsValid) {
      failures.push({
        locale,
        variant: variant.name,
        expectedAnchor,
        actualAnchor: result.anchor,
        expectedInlineStart: variant.inlineStart,
        measuredInlineStart: result.measuredInlineStart,
        smallCopy: result.smallCopy
      });
    }
  }
}

await browser.close();

if (failures.length > 0) {
  throw new Error(`Widget copy alignment failed: ${JSON.stringify(failures)}`);
}

process.stdout.write(`Verified widget copy alignment in ${Object.keys(measurements).length} localized dashboard and small-promo layouts.\n`);
