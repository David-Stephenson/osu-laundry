import path from 'node:path';
import fs from 'node:fs/promises';
import fg from 'fast-glob';
import sharp from 'sharp';

// Inputs / outputs
const SRC_DIR = path.resolve('src/images/dorms');
const OUT_DIR = path.resolve('static/generated/dorms');

// Target widths and formats
const WIDTHS = [400, 640, 960, 1280];
// Generate only WebP variants for simpler delivery
const FORMATS = [
  { ext: 'webp', options: { quality: 78 } }
];

async function ensureDir(dir) {
  await fs.mkdir(dir, { recursive: true });
}

function baseNameNoExt(file) {
  const b = path.basename(file);
  const i = b.lastIndexOf('.');
  return i >= 0 ? b.slice(0, i) : b;
}

async function buildOne(srcPath) {
  const base = baseNameNoExt(srcPath);
  const outBase = path.join(OUT_DIR, base);
  await ensureDir(OUT_DIR);

  const input = sharp(srcPath).rotate();
  const meta = await input.metadata();

  // Create resized variants
  for (const width of WIDTHS) {
    const resized = input.clone().resize({ width, withoutEnlargement: true });
    for (const { ext, options } of FORMATS) {
      const outFile = `${outBase}-${width}.${ext}`;
      const pipeline = ext === 'webp'
        ? resized.webp(options)
        : resized;
      await pipeline.toFile(outFile);
    }
  }

  // Also write an original-size webp as a fallback hero
  const largest = Math.max(...WIDTHS);
  const targetWidth = Math.min(largest, meta.width || largest);
  await input.clone().resize({ width: targetWidth, withoutEnlargement: true }).webp({ quality: 78 }).toFile(`${outBase}.webp`);
}

async function main() {
  const patterns = [`${SRC_DIR}/*.{jpg,jpeg,png,webp,avif}`];
  const files = await fg(patterns, { dot: false, onlyFiles: true });
  if (files.length === 0) {
    console.log('[images] No dorm images found to process');
    return;
  }
  await ensureDir(OUT_DIR);
  console.log(`[images] Processing ${files.length} images → ${OUT_DIR}`);
  for (const f of files) {
    await buildOne(f);
  }
  console.log('[images] Done');
}

main().catch((err) => {
  console.error('[images] Error:', err);
  process.exitCode = 1;
});


