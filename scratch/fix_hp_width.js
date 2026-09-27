const fs = require('fs');

const filePath = 'c:\\React-Native\\cdc\\src\\app\\pokemon\\pokemon_card.tsx';
let content = fs.readFileSync(filePath, 'utf8');

const target1 = `            {/* Segundo Botão Redondo (Para o HP) */}
            <TouchableOpacity
              style={[styles.hpButton, isPreviewMode && styles.previewMode]}`;

const replacement1 = `            {/* Segundo Botão Redondo (Para o HP) */}
            <TouchableOpacity
              style={[
                styles.hpButton, 
                isPreviewMode && styles.previewMode,
                { width: hp.length > 2 ? 150 : 125 }
              ]}`;

content = content.replace(target1.replace(/\r\n/g, '\n'), replacement1);
if (!content.includes(replacement1)) content = content.replace(target1, replacement1);

fs.writeFileSync(filePath, content, 'utf8');
console.log('Done!');
