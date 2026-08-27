#!/usr/bin/env node

import { execFileSync } from 'node:child_process';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const productDirectory = resolve(scriptDirectory, '..');
const assetsDirectory = join(productDirectory, 'assets', 'v4');
const outputDirectory = join(assetsDirectory, 'chrome-store-redesign-v1');
const sourceDirectory = join(outputDirectory, 'source');
const rsvgConvert = '/opt/homebrew/bin/rsvg-convert';
const fontFamily = 'Hiragino Sans, PingFang SC, sans-serif';

const screens = {
  home: join(assetsDirectory, 'desktop-1.png'),
  workspace: join(assetsDirectory, 'desktop-2.png'),
  widgets: join(assetsDirectory, 'desktop-3.png'),
  wallpaper: join(assetsDirectory, 'desktop-4.png'),
  calendar: join(assetsDirectory, 'desktop-5.png'),
};

function dataUri(filePath, mimeType) {
  return `data:${mimeType};base64,${readFileSync(filePath).toString('base64')}`;
}

function imageDataUri(filePath) {
  return dataUri(filePath, 'image/png');
}

function escapeXml(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function textLine(value, x, y, options = {}) {
  const {
    color = '#1D2421',
    size = 28,
    weight = 400,
    anchor = 'start',
    opacity = 1,
    letterSpacing = 0,
  } = options;

  return `<text x="${x}" y="${y}" fill="${color}" font-family="${fontFamily}" font-size="${size}" font-weight="${weight}" text-anchor="${anchor}" opacity="${opacity}" letter-spacing="${letterSpacing}">${escapeXml(value)}</text>`;
}

function screenFrame({
  id,
  image,
  x,
  y,
  width,
  height,
  outlined = true,
  imageFit = 'meet',
  cornerRadius = 16,
  frameBackground = true,
}) {
  const innerCornerRadius = cornerRadius - 0.75;
  const backdrop = frameBackground
    ? `<rect x="${x}" y="${y}" width="${width}" height="${height}" rx="${cornerRadius}" fill="#FFFFFF" />`
    : '';
  const outline = outlined
    ? `<rect x="${x + 0.75}" y="${y + 0.75}" width="${width - 1.5}" height="${height - 1.5}" rx="${innerCornerRadius}" fill="none" stroke="#FFFFFF" stroke-opacity="0.82" stroke-width="1.5" />`
    : '';

  return `
    <defs>
      <clipPath id="screen-${id}">
        <rect x="${x}" y="${y}" width="${width}" height="${height}" rx="${cornerRadius}" />
      </clipPath>
    </defs>
    <g filter="url(#shadow)">
      ${backdrop}
      <image href="${image}" x="${x}" y="${y}" width="${width}" height="${height}" preserveAspectRatio="xMidYMid ${imageFit}" clip-path="url(#screen-${id})" />
      ${outline}
    </g>`;
}

function page({ index, title, description, accent, background, screen, outlined, imageFit, cornerRadius, frameBackground }) {
  const image = imageDataUri(screen);

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="800" viewBox="0 0 1280 800">
  <defs>
    <filter id="shadow" x="-12%" y="-18%" width="124%" height="145%">
      <feDropShadow dx="0" dy="14" stdDeviation="15" flood-color="#17201C" flood-opacity="0.17" />
    </filter>
  </defs>

  <rect width="1280" height="800" fill="${background}" />
  ${textLine(title, 100, 128, { color: '#1D2421', size: 44, weight: 700 })}
  ${textLine(description, 100, 182, { color: '#52605A', size: 20, weight: 400 })}
  <rect x="100" y="204" width="44" height="5" rx="2.5" fill="${accent}" />
  ${screenFrame({ id: index, image, x: 100, y: 232, width: 1080, height: 530, outlined, imageFit, cornerRadius, frameBackground })}
</svg>`;
}

function smallTile() {
  const image = imageDataUri(screens.workspace);

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="440" height="280" viewBox="0 0 440 280">
  <defs>
    <filter id="tile-shadow" x="-20%" y="-20%" width="140%" height="160%">
      <feDropShadow dx="0" dy="9" stdDeviation="8" flood-color="#17201C" flood-opacity="0.18" />
    </filter>
    <clipPath id="tile-screen">
      <rect x="20" y="84" width="400" height="196" rx="10" />
    </clipPath>
  </defs>

  <rect width="440" height="280" fill="#EFF5ED" />
  ${textLine('HomepageTab', 20, 40, { color: '#1D2421', size: 18, weight: 700 })}
  ${textLine('你的主页，在每一个新标签页', 20, 70, { color: '#52605A', size: 14, weight: 500 })}
  <g filter="url(#tile-shadow)">
    <rect x="20" y="84" width="400" height="196" rx="10" fill="#FFFFFF" />
    <image href="${image}" x="20" y="84" width="400" height="196" preserveAspectRatio="xMidYMid meet" clip-path="url(#tile-screen)" />
    <rect x="20.75" y="84.75" width="398.5" height="194.5" rx="9.25" fill="none" stroke="#FFFFFF" stroke-opacity="0.8" stroke-width="1.5" />
  </g>
</svg>`;
}

const pages = [
  {
    index: 1,
    title: '你的主页，在每一个新标签页',
    description: '搜索、常用网站与每日信息，打开即见',
    accent: '#B7D63B',
    background: '#EFF6EC',
    screen: screens.home,
    outlined: false,
    imageFit: 'slice',
  },
  {
    index: 2,
    title: '把今天要用的，放在眼前',
    description: '网站、待办、日程与热榜，按你的喜好排布',
    accent: '#F08F72',
    background: '#FBF3ED',
    screen: screens.workspace,
    outlined: false,
    imageFit: 'slice',
  },
  {
    index: 3,
    title: '用小组件，自定义你的新标签页',
    description: '把在意的内容留在眼前，让每一次打开都回到自己的世界',
    accent: '#708FE0',
    background: '#EEF3FF',
    screen: screens.widgets,
  },
  {
    index: 4,
    title: '留白处，自有回响',
    description: '壁纸的明暗之间，让新标签页更像平行世界的你',
    accent: '#71A987',
    background: '#F3F5EE',
    screen: screens.wallpaper,
    outlined: false,
    imageFit: 'slice',
    cornerRadius: 20,
    frameBackground: false,
  },
  {
    index: 5,
    title: '每天，都留给重要的事',
    description: '万年历、节日与倒数日，让安排更从容',
    accent: '#A67EDC',
    background: '#F6F1FA',
    screen: screens.calendar,
  },
];

function renderSvg(sourcePath, pngPath, jpgPath) {
  execFileSync(rsvgConvert, ['-w', '1280', '-h', '800', '-o', pngPath, sourcePath], { stdio: 'inherit' });
  execFileSync('sips', ['-s', 'format', 'jpeg', '-s', 'formatOptions', '95', '--out', jpgPath, pngPath], { stdio: 'inherit' });
}

function renderTile(sourcePath, pngPath, jpgPath) {
  execFileSync(rsvgConvert, ['-w', '440', '-h', '280', '-o', pngPath, sourcePath], { stdio: 'inherit' });
  execFileSync('sips', ['-s', 'format', 'jpeg', '-s', 'formatOptions', '95', '--out', jpgPath, pngPath], { stdio: 'inherit' });
}

mkdirSync(sourceDirectory, { recursive: true });

for (const entry of pages) {
  const basename = `chrome-localized-${entry.index}`;
  const svgPath = join(sourceDirectory, `${basename}.svg`);
  writeFileSync(svgPath, page(entry), 'utf8');
  renderSvg(svgPath, join(outputDirectory, `${basename}.png`), join(outputDirectory, `${basename}.jpg`));
}

const tileSvgPath = join(sourceDirectory, 'chrome-small-tile.svg');
writeFileSync(tileSvgPath, smallTile(), 'utf8');
renderTile(tileSvgPath, join(outputDirectory, 'chrome-small-tile.png'), join(outputDirectory, 'chrome-small-tile.jpg'));

console.log(`Rendered vertical Chrome Web Store assets to ${outputDirectory}`);
