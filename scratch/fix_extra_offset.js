const fs = require('fs');

const filePath = 'c:\\React-Native\\cdc\\src\\app\\pokemon\\pokemon_card.tsx';
let content = fs.readFileSync(filePath, 'utf8');

const target = `            {/* Nono Botão Retangular (Extra, centralizado horizontalmente) */}
            <TouchableOpacity
              style={[
                styles.extraInfoButton,
                isPreviewMode && styles.previewMode,
              ]}
              onPress={() => setExtraInfoModalVisible(true)}`;

const replacement = `            {/* Nono Botão Retangular (Extra, centralizado horizontalmente) */}
            <TouchableOpacity
              style={[
                styles.extraInfoButton,
                isPreviewMode && styles.previewMode,
                isPreviewMode && { left: 200 }
              ]}
              onPress={() => setExtraInfoModalVisible(true)}`;

content = content.replace(target.replace(/\r\n/g, '\n'), replacement);
content = content.replace(target, replacement);

fs.writeFileSync(filePath, content, 'utf8');
console.log('Done!');
