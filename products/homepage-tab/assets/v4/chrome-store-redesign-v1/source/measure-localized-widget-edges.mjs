import { readFile, readdir } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const { PNG } = require('../../../../../../../homepage-tab-web/node_modules/pngjs');
const sourceDirectory = dirname(fileURLToPath(import.meta.url));
const assetDirectory = resolve(sourceDirectory, '..');

function isWidgetSurface(red, green, blue) {
  return red >= 232 && green >= 232 && blue >= 232 && Math.max(red, green, blue) - Math.min(red, green, blue) <= 22;
}

function widgetRunsAtRow(image, y) {
  const runs = [];
  let start = null;

  for (let x = 0; x < image.width; x += 1) {
    const offset = (y * image.width + x) * 4;
    const isSurface = isWidgetSurface(image.data[offset], image.data[offset + 1], image.data[offset + 2]);
    if (isSurface && start === null) {
      start = x;
    }
    if ((!isSurface || x === image.width - 1) && start !== null) {
      const end = isSurface && x === image.width - 1 ? x + 1 : x;
      if (end - start >= 120) {
        runs.push({ start, end });
      }
      start = null;
    }
  }

  return runs;
}

export function resolveWidgetBounds(image) {
  const rows = [];
  for (let y = 34; y <= 190; y += 2) {
    const runs = widgetRunsAtRow(image, y);
    if (runs.length >= 2) {
      rows.push(runs);
    }
  }

  if (rows.length === 0) {
    throw new Error('Could not identify top-row widget surfaces');
  }

  const allRuns = rows.flat();
  return {
    left: Math.min(...allRuns.map((run) => run.start)),
    right: Math.max(...allRuns.map((run) => run.end))
  };
}

export async function measureLocalizedWidgetEdges() {
  const copy = JSON.parse(await readFile(resolve(sourceDirectory, 'locale-copy.json'), 'utf8'));
  const localeDirectories = await readdir(assetDirectory, { withFileTypes: true });
  const locales = localeDirectories
    .filter((entry) => entry.isDirectory() && copy[entry.name])
    .map((entry) => entry.name)
    .sort();
  const measurements = {};

  for (const locale of locales) {
    const path = resolve(assetDirectory, locale, 'source', 'chrome-screenshot-1-dashboard-base.png');
    const image = PNG.sync.read(await readFile(path));
    const bounds = resolveWidgetBounds(image);
    const isRightToLeft = copy[locale].dir === 'rtl';
    const dashboardInlineStart = isRightToLeft ? image.width - bounds.right : bounds.left;
    const smallScale = 280 / image.height;
    const smallOffsetX = (440 - image.width * smallScale) / 2;
    const smallInlineStart = isRightToLeft
      ? 440 - (bounds.right * smallScale + smallOffsetX)
      : bounds.left * smallScale + smallOffsetX;

    measurements[locale] = {
      direction: copy[locale].dir,
      bounds,
      dashboardInlineStart: Number(dashboardInlineStart.toFixed(2)),
      smallInlineStart: Number(smallInlineStart.toFixed(2))
    };
  }

  return measurements;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  process.stdout.write(`${JSON.stringify(await measureLocalizedWidgetEdges(), null, 2)}\n`);
}
