const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const iconsDir = path.join(__dirname, '../public/icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

function createSVG(size, primaryColorHex) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
    <rect width="${size}" height="${size}" rx="${Math.round(size * 0.22)}" fill="${primaryColorHex}"/>
    <g transform="translate(${size * 0.2}, ${size * 0.16}) scale(${size / 100 * 0.6})">
      <path d="M50 15 C 30 15, 15 35, 15 55 C 15 75, 30 85, 50 85 C 70 85, 85 75, 85 55 C 85 35, 70 15, 50 15 Z" fill="#FFFFFF" opacity="0.95"/>
      <path d="M50 25 C 40 25, 30 38, 30 52 C 30 66, 40 75, 50 75 C 60 75, 70 66, 70 52 C 70 38, 60 25, 50 25 Z" fill="#22C55E" opacity="0.9"/>
      <circle cx="50" cy="48" r="12" fill="#FFFFFF"/>
    </g>
    <text x="50%" y="82%" font-family="system-ui, -apple-system, BlinkMacSystemFont, sans-serif" font-weight="900" font-size="${Math.round(size * 0.12)}px" fill="#FFFFFF" text-anchor="middle">RUDU</text>
  </svg>`;
}

async function main() {
  const sizes = [
    { size: 192, name: 'icon-192x192.png' },
    { size: 512, name: 'icon-512x512.png' },
    { size: 512, name: 'icon-512x512-maskable.png' },
    { size: 180, name: 'apple-touch-icon.png' },
  ];

  for (const item of sizes) {
    const svgBuffer = Buffer.from(createSVG(item.size, '#4E2A18'));
    const outputPath = path.join(iconsDir, item.name);
    await sharp(svgBuffer)
      .resize(item.size, item.size)
      .png()
      .toFile(outputPath);
    console.log(`Generated ${item.name} (${item.size}x${item.size})`);
  }

  console.log("All PWA PNG Icons successfully generated!");
}

main().catch(console.error);
