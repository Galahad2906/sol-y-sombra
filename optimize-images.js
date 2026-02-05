import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TARGET_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp'];
const DIRS_TO_SCAN = ['src', 'public'];

async function getFiles(dir) {
    const dirents = await fs.readdir(dir, { withFileTypes: true });
    const files = await Promise.all(dirents.map((dirent) => {
        const res = path.resolve(dir, dirent.name);
        return dirent.isDirectory() ? getFiles(res) : res;
    }));
    return files.flat();
}

async function optimizeImage(filePath) {
    const ext = path.extname(filePath).toLowerCase();
    if (!TARGET_EXTENSIONS.includes(ext)) return;

    try {
        const originalBuffer = await fs.readFile(filePath);
        const originalSize = originalBuffer.length;

        let pipeline = sharp(originalBuffer);

        if (ext === '.jpg' || ext === '.jpeg') {
            pipeline = pipeline.jpeg({ quality: 80, mozjpeg: true });
        } else if (ext === '.png') {
            pipeline = pipeline.png({ quality: 80, compressionLevel: 9, palette: true });
        } else if (ext === '.webp') {
            pipeline = pipeline.webp({ quality: 80 });
        }

        const optimizedBuffer = await pipeline.toBuffer();
        const optimizedSize = optimizedBuffer.length;

        if (optimizedSize < originalSize) {
            await fs.writeFile(filePath, optimizedBuffer);
            const savings = ((originalSize - optimizedSize) / originalSize * 100).toFixed(2);
            console.log(`Optimized: ${path.relative(__dirname, filePath)} - Saved ${savings}% (${(originalSize / 1024).toFixed(2)}KB -> ${(optimizedSize / 1024).toFixed(2)}KB)`);
        } else {
            console.log(`Skipped: ${path.relative(__dirname, filePath)} (No size reduction)`);
        }
    } catch (error) {
        console.error(`Error processing ${filePath}:`, error.message);
    }
}

async function main() {
    console.log('Starting image optimization...');

    for (const dir of DIRS_TO_SCAN) {
        const fullPath = path.resolve(__dirname, dir);
        try {
            const files = await getFiles(fullPath);
            for (const file of files) {
                await optimizeImage(file);
            }
        } catch (err) {
            console.error(`Error scanning directory ${dir}:`, err);
        }
    }

    console.log('Optimization complete.');
}

main();
