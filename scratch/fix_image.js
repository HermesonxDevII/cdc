const fs = require('fs');
const path = require('path');

const modalsDir = 'c:\\React-Native\\cdc\\src\\components\\modals';
const filesToFix = [
  'resistance_modal.tsx',
  'retreat_modal.tsx',
  'skill_energy_modal.tsx',
  'weakness_modal.tsx',
  'type_modal.tsx'
];

for (const file of filesToFix) {
  const filePath = path.join(modalsDir, file);
  if (!fs.existsSync(filePath)) continue;
  
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  // 1. Remove Image from react-native import
  if (content.includes("Image,")) {
    content = content.replace(/Image,\s*/, '');
    modified = true;
  } else if (content.includes(", Image")) {
    content = content.replace(/,\s*Image/, '');
    modified = true;
  }

  // 2. Add import { Image } from 'expo-image'
  if (!content.includes("import { Image } from 'expo-image';")) {
    content = content.replace(/(import.*from 'react-native';)/, "$1\nimport { Image } from 'expo-image';");
    modified = true;
  }

  // 3. Add contentFit prop
  if (content.includes("<Image source")) {
    content = content.replace(/<Image source/g, '<Image contentFit="contain" source');
    modified = true;
  }

  // 4. Remove resizeMode from styles
  if (content.includes("resizeMode: 'contain'")) {
    content = content.replace(/resizeMode:\s*'contain',?\s*/g, '');
    modified = true;
  }

  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${file}`);
  }
}
