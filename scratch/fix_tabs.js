const fs = require('fs');
const path = require('path');

const modalsDir = 'c:\\React-Native\\cdc\\src\\components\\modals';
const filesToFix = [
  'resistance_modal.tsx',
  'retreat_modal.tsx',
  'skill_energy_modal.tsx',
  'weakness_modal.tsx'
];

for (const file of filesToFix) {
  const filePath = path.join(modalsDir, file);
  if (!fs.existsSync(filePath)) continue;
  
  let content = fs.readFileSync(filePath, 'utf8');

  // Add numberOfLines and adjustsFontSizeToFit to the Text components
  content = content.replace(/<Text style=\{\[styles\.tabText, activeTab === 'current' && styles\.tabTextActive\]\}>Atual<\/Text>/g, 
    "<Text numberOfLines={1} adjustsFontSizeToFit style={[styles.tabText, activeTab === 'current' && styles.tabTextActive]}>Atual</Text>");

  content = content.replace(/<Text style=\{\[styles\.tabText, activeTab === 'old' && styles\.tabTextActive\]\}>Clássico<\/Text>/g, 
    "<Text numberOfLines={1} adjustsFontSizeToFit style={[styles.tabText, activeTab === 'old' && styles.tabTextActive]}>Clássico</Text>");

  content = content.replace(/<Text style=\{\[styles\.tabText, activeTab === 'old_2' && styles\.tabTextActive\]\}>Retrô<\/Text>/g, 
    "<Text numberOfLines={1} adjustsFontSizeToFit style={[styles.tabText, activeTab === 'old_2' && styles.tabTextActive]}>Retrô</Text>");

  // Change font size from 14 to 13
  content = content.replace(/tabText:\s*\{\s*fontSize:\s*14,/g, "tabText: {\n    fontSize: 13,");

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Updated ${file}`);
}
