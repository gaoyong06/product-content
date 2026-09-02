import { access, readFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';

const sourceDirectory = dirname(fileURLToPath(import.meta.url));
const assetDirectory = resolve(sourceDirectory, '..');
const copy = JSON.parse(await readFile(resolve(sourceDirectory, 'locale-copy.json'), 'utf8'));
const definitions = [
  { filename: 'chrome-screenshot-1-dashboard.png', width: 1280, height: 800, format: 'png' },
  { filename: 'chrome-screenshot-2-new-tab.png', width: 1280, height: 800, format: 'png' },
  { filename: 'chrome-screenshot-3-wallpaper.png', width: 1280, height: 800, format: 'png' },
  { filename: 'chrome-screenshot-4-widgets.png', width: 1280, height: 800, format: 'png' },
  { filename: 'chrome-screenshot-5-friday.png', width: 1280, height: 800, format: 'png' },
  { filename: 'chrome-small-promo.png', width: 440, height: 280, format: 'png' },
  { filename: 'chrome-marquee-promo.png', width: 1400, height: 560, format: 'png' }
];

function inspect(path) {
  return new Promise((resolveInspection, rejectInspection) => {
    const process = spawn('sips', ['-g', 'pixelWidth', '-g', 'pixelHeight', '-g', 'format', '-g', 'hasAlpha', '-g', 'bitsPerSample', '-g', 'space', path]);
    let stdout = '';
    let stderr = '';

    process.stdout.on('data', (chunk) => {
      stdout += chunk;
    });
    process.stderr.on('data', (chunk) => {
      stderr += chunk;
    });
    process.on('error', rejectInspection);
    process.on('close', (code) => {
      if (code !== 0) {
        rejectInspection(new Error(`Could not inspect ${path}: ${stderr.trim()}`));
        return;
      }

      const property = (name) => {
        const match = stdout.match(new RegExp(`${name}:\\s*(.+)`));
        return match?.[1]?.trim();
      };
      resolveInspection({
        width: Number(property('pixelWidth')),
        height: Number(property('pixelHeight')),
        format: property('format'),
        hasAlpha: property('hasAlpha'),
        bitsPerSample: Number(property('bitsPerSample')),
        space: property('space')
      });
    });
  });
}

let verified = 0;

for (const locale of Object.keys(copy).sort()) {
  for (const definition of definitions) {
    const path = resolve(assetDirectory, locale, definition.filename);
    await access(path);
    const metadata = await inspect(path);
    const isValid = metadata.width === definition.width
      && metadata.height === definition.height
      && metadata.format === definition.format
      && metadata.hasAlpha === 'no'
      && metadata.bitsPerSample === 8
      && metadata.space === 'RGB';

    if (!isValid) {
      throw new Error(`${locale}/${definition.filename} has invalid metadata: ${JSON.stringify(metadata)}`);
    }
    verified += 1;
  }
}

process.stdout.write(`Verified ${verified} localized Chrome Web Store assets.\n`);
