const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const targetDir = 'c:\\React-Native\\cdc\\assets\\images\\icons\\pokemon_types';
const MAX_SIZE = 300;

async function resizeImages() {
  const files = fs.readdirSync(targetDir);
  for (const file of files) {
    if (file.endsWith('.png')) {
      const filePath = path.join(targetDir, file);

      try {
        const { width, height } = await sharp(filePath).metadata();
        if (width <= MAX_SIZE && height <= MAX_SIZE) {
          console.log(`Skipping ${file} (${width}x${height}, already resized)`);
          continue;
        }

        console.log(`Resizing ${file} (${width}x${height})...`);
        // sharp can't write to the file it's reading from, so resize into a buffer first
        const buffer = await sharp(filePath)
          .resize(MAX_SIZE, MAX_SIZE, { fit: 'inside' })
          .toBuffer();
        fs.writeFileSync(filePath, buffer);

        console.log(`Success: saved optimized version to ${filePath}`);
      } catch (err) {
        console.error(`Error processing ${file}:`, err);
      }
    }
  }
}

resizeImages();
