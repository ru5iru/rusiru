import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import { siteSchema, themeSchema } from '../src/config/schema';
import site from '../src/config/site.json';
import theme from '../src/config/theme.json';

const root = process.cwd();
const config = siteSchema.parse(site);
const colors = themeSchema.parse(theme);
const publicFile = (reference: string) => path.join(root, 'public', reference.replace(/^\//, ''));
const sourceFile = (reference: string) => path.join(root, 'media-src', reference.replace(/^\/media\//, ''));
const hsl = (value: string) => {
  const [hue, saturation, lightness] = value.split(/\s+/);
  return `hsl(${hue}, ${saturation}, ${lightness})`;
};

for (const [id, reference] of Object.entries(config.educationLogos)) {
  if (!reference.startsWith('/media/')) continue;
  const source = sourceFile(reference);
  const output = publicFile(reference);
  if (!fs.existsSync(source)) throw new Error(`Missing original education logo for ${id}: ${path.relative(root, source)}`);
  fs.mkdirSync(path.dirname(output), { recursive: true });
  const temporary = `${output}.tmp`;
  await sharp(source)
    .resize(132, 132, { fit: 'inside', withoutEnlargement: true })
    .png({ compressionLevel: 9 })
    .toFile(temporary);
  fs.renameSync(temporary, output);
  const metadata = await sharp(output).metadata();
  console.log(`${id}: ${metadata.width}x${metadata.height}, ${fs.statSync(output).size} bytes`);
}

const portrait = await sharp(publicFile(config.person.profileImage))
  .resize(400, 400, { fit: 'cover' })
  .png()
  .toBuffer();
const monogram = await sharp(path.join(root, 'public', 'favicon.svg'))
  .resize(330, 330)
  .png()
  .toBuffer();
const paper = hsl(colors.light.background);
const ink = hsl(colors.light.foreground);
const rule = hsl(colors.light.border);
const crimson = hsl(colors.light.primary);
const artwork = `<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <rect width="1200" height="630" fill="${paper}"/>
  <rect x="24" y="24" width="1152" height="582" fill="none" stroke="${ink}" stroke-width="3"/>
  <path d="M70 88H1130 M70 542H1130" stroke="${ink}" stroke-width="3"/>
  <path d="M70 102H1130 M70 528H1130" stroke="${rule}"/>
  <rect x="96" y="142" width="8" height="330" fill="${crimson}"/>
  <path d="M610 142V488" stroke="${rule}"/>
  <rect x="700" y="115" width="400" height="400" fill="none" stroke="${ink}" stroke-width="3"/>
  <rect x="132" y="488" width="400" height="8" fill="${crimson}"/>
</svg>`;
const shareOutput = publicFile(config.seo.shareImage);
fs.mkdirSync(path.dirname(shareOutput), { recursive: true });
await sharp(Buffer.from(artwork))
  .composite([
    { input: monogram, left: 165, top: 145 },
    { input: portrait, left: 700, top: 115 },
  ])
  .png({ compressionLevel: 9 })
  .toFile(shareOutput);
console.log(`social: 1200x630, ${fs.statSync(shareOutput).size} bytes`);
