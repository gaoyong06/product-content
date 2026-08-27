#!/usr/bin/env node

import { execFileSync } from 'node:child_process';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const productDirectory = resolve(scriptDirectory, '..');
const assetsDirectory = join(productDirectory, 'assets', 'v4');
const outputDirectory = join(assetsDirectory, 'chrome-store-redesign');
const sourceDirectory = join(outputDirectory, 'source');
const brandMarkPath = resolve(productDirectory, '../../../homepage-tab-web/icons/brand-mark.svg');
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

const brandMarkDataUri = dataUri(brandMarkPath, 'image/svg+xml');

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

function screenFrame({ id, image, x, y, width, height, dark = false }) {
  const border = dark ? '#242B28' : '#FFFFFF';
  const imageOpacity = dark ? 0.98 : 1;

  return `
    <defs>
      <clipPath id="screen-${id}">
        <rect x="${x}" y="${y}" width="${width}" height="${height}" rx="18" />
      </clipPath>
    </defs>
    <g filter="url(#shadow)">
      <rect x="${x}" y="${y}" width="${width}" height="${height}" rx="18" fill="${border}" />
      <image href="${image}" x="${x}" y="${y}" width="${width}" height="${height}" preserveAspectRatio="xMidYMid meet" clip-path="url(#screen-${id})" opacity="${imageOpacity}" />
      <rect x="${x + 0.75}" y="${y + 0.75}" width="${width - 1.5}" height="${height - 1.5}" rx="17.25" fill="none" stroke="#FFFFFF" stroke-opacity="0.76" stroke-width="1.5" />
    </g>`;
}

function page({ index, titleLines, description, accent, background, screen, frame }) {
  const titleMarkup = titleLines
    .map((line, lineIndex) => textLine(line, 60, 247 + lineIndex * 61, { color: '#1D2421', size: 48, weight: 700 }))
    .join('');
  const image = imageDataUri(screen);

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="800" viewBox="0 0 1280 800">
  <defs>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="160%">
      <feDropShadow dx="0" dy="18" stdDeviation="18" flood-color="#17201C" flood-opacity="0.18" />
    </filter>
  </defs>

  <rect width="1280" height="800" fill="${background}" />
  <path d="M 0 0 H 455 L 364 800 H 0 Z" fill="#FFFFFF" fill-opacity="0.62" />
  <image href="${brandMarkDataUri}" x="60" y="51" width="50" height="50" />
  ${textLine('HomepageTab', 126, 82, { color: '#1D2421', size: 24, weight: 700 })}
  ${textLine(`0${index} / 05`, 1220, 80, { color: '#1D2421', size: 15, weight: 700, anchor: 'end', letterSpacing: 1 })}
  <rect x="60" y="149" width="42" height="6" rx="3" fill="${accent}" />
  ${titleMarkup}
  ${textLine(description, 60, 365, { color: '#52605A', size: 20, weight: 400 })}
  ${screenFrame({ id: index, image, ...frame })}
  <line x1="60" y1="720" x2="300" y2="720" stroke="#1D2421" stroke-opacity="0.16" />
  ${textLine('你的主页，在每一个新标签页', 60, 756, { color: '#52605A', size: 17, weight: 500 })}
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
    <clipPath id="tile-screen"><rect x="20" y="84" width="400" height="196" rx="10" /></clipPath>
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
    titleLines: ['你的主页', '在每一个新标签页'],
    description: '搜索、常用入口与每日信息，打开即见。',
    accent: '#B7D63B',
    background: '#EEF5EB',
    screen: screens.home,
    frame: { x: 535, y: 200, width: 690, height: 339 },
  },
  {
    index: 2,
    titleLines: ['把今天要用的', '放在眼前'],
    description: '网站、待办、日程与热榜，按你的节奏排布。',
    accent: '#F08F72',
    background: '#F8F1EC',
    screen: screens.workspace,
    frame: { x: 535, y: 200, width: 690, height: 339 },
  },
  {
    index: 3,
    titleLines: ['用小组件', '自定义你的新标签页'],
    description: '从小组件库选择需要的内容，组合成自己的工作台。',
    accent: '#708FE0',
    background: '#EEF3FF',
    screen: screens.widgets,
    frame: { x: 535, y: 200, width: 690, height: 339 },
  },
  {
    index: 4,
    titleLines: ['今天的心情', '从背景开始'],
    description: '壁纸与明暗外观，让留白处，自有回响。',
    accent: '#71A987',
    background: '#F5F5EE',
    screen: screens.wallpaper,
    frame: { x: 535, y: 200, width: 690, height: 339 },
  },
  {
    index: 5,
    titleLines: ['每天，都留给', '重要的事'],
    description: '万年历、节日与倒数日，让安排更从容。',
    accent: '#A67EDC',
    background: '#F5F0FA',
    screen: screens.calendar,
    frame: { x: 535, y: 200, width: 690, height: 339 },
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

console.log(`Rendered Chrome Web Store redesign assets to ${outputDirectory}`);
