const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const targetDir = 'c:\\React-Native\\cdc\\assets\\images\\icons\\pokemon_types';
const originalDir = path.join(targetDir, 'original');

async function resizeImages() {
  if (!fs.existsSync(originalDir)) {
    console.error("Original directory not found:", originalDir);
    return;
  }

  const files = fs.readdirSync(originalDir);
  for (const file of files) {
    if (file.endsWith('.png')) {
      const originalFilePath = path.join(originalDir, file);
      const targetFilePath = path.join(targetDir, file);
      
      try {
        console.log(`Resizing ${file}...`);
        await sharp(originalFilePath)
          .resize(300, 300, { fit: 'inside' })
          .toFile(targetFilePath);
        
        console.log(`Success: saved optimized version to ${targetFilePath}`);
      } catch (err) {
        console.error(`Error processing ${file}:`, err);
      }
    }
  }
}

resizeImages();
