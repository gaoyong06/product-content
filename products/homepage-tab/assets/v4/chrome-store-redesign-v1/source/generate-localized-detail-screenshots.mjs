import { copyFile, mkdir, readFile, readdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';

const sourceDirectory = dirname(fileURLToPath(import.meta.url));
const assetDirectory = resolve(sourceDirectory, '..');
const fireShotDirectory = '/Users/gaoyong/Downloads/FireShot';
const screenshotDefinitions = [
  { filename: 'chrome-screenshot-1-dashboard.png', sourceIndex: 1 },
  { filename: 'chrome-screenshot-2-new-tab.png', sourceIndex: 0 },
  { filename: 'chrome-screenshot-3-wallpaper.png', sourceIndex: 2 },
  { filename: 'chrome-screenshot-4-widgets.png', sourceIndex: 3 },
  { filename: 'chrome-screenshot-5-friday.png', sourceIndex: 4 }
];

function run(command, argumentsList) {
  return new Promise((resolveCommand, rejectCommand) => {
    const process = spawn(command, argumentsList, { stdio: 'pipe' });
    let stderr = '';

    process.stderr.on('data', (chunk) => {
      stderr += chunk;
    });

    process.on('error', rejectCommand);
    process.on('close', (code) => {
      if (code === 0) {
        resolveCommand();
        return;
      }
      rejectCommand(new Error(`${command} failed with code ${code}: ${stderr.trim()}`));
    });
  });
}

function captureNumber(filename) {
  const match = filename.match(/Capture (\d+)/);
  if (!match) {
    throw new Error(`Could not determine capture order for ${filename}`);
  }
  return Number(match[1]);
}

async function cropAndResize(sourcePath, destinationPath) {
  await run('sips', ['-c', '1488', '2381', sourcePath, '--out', destinationPath]);
  await run('sips', ['-z', '800', '1280', destinationPath]);
}

const copy = JSON.parse(await readFile(resolve(sourceDirectory, 'locale-copy.json'), 'utf8'));
const entries = await readdir(fireShotDirectory, { withFileTypes: true });
const locales = entries
  .filter((entry) => entry.isDirectory() && entry.name !== 'en')
  .map((entry) => entry.name)
  .sort();

for (const locale of locales) {
  if (!copy[locale]) {
    throw new Error(`Missing localized promotion copy for ${locale}`);
  }

  const sourceLocaleDirectory = resolve(fireShotDirectory, locale);
  const screenshots = (await readdir(sourceLocaleDirectory))
    .filter((filename) => filename.endsWith('.png'))
    .sort((left, right) => captureNumber(left) - captureNumber(right));

  if (screenshots.length !== 5) {
    throw new Error(`${locale} must contain exactly five source screenshots`);
  }

  const outputLocaleDirectory = resolve(assetDirectory, locale);
  const outputSourceDirectory = resolve(outputLocaleDirectory, 'source');
  await mkdir(outputSourceDirectory, { recursive: true });

  for (const definition of screenshotDefinitions) {
    const sourcePath = resolve(sourceLocaleDirectory, screenshots[definition.sourceIndex]);
    const destinationPath = resolve(outputLocaleDirectory, definition.filename);
    await cropAndResize(sourcePath, destinationPath);
  }

  await copyFile(
    resolve(outputLocaleDirectory, 'chrome-screenshot-1-dashboard.png'),
    resolve(outputSourceDirectory, 'chrome-screenshot-1-dashboard-base.png')
  );

  process.stdout.write(`Prepared ${locale}\n`);
}

process.stdout.write(`Prepared ${locales.length} localized screenshot sets.\n`);
