const fs = require('fs');

const filePath = 'c:\\React-Native\\cdc\\src\\app\\pokemon\\pokemon_card.tsx';
let content = fs.readFileSync(filePath, 'utf8');

const target = `            {/* Sétimo Botão Retangular (Para o nome do Ilustrador) */}
            <TouchableOpacity
              style={[
                styles.illustrationButton,
                isPreviewMode && styles.previewMode,
              ]}
              onPress={() => setIllustrationModalVisible(true)}
              disabled={isPreviewMode}`;

const replacement = `            {/* Sétimo Botão Retangular (Para o nome do Ilustrador) */}
            <TouchableOpacity
              style={[
                styles.illustrationButton,
                isPreviewMode && styles.previewMode,
                isPreviewMode && { left: 45 }
              ]}
              onPress={() => setIllustrationModalVisible(true)}
              disabled={isPreviewMode}`;

content = content.replace(target.replace(/\r\n/g, '\n'), replacement);
content = content.replace(target, replacement);

fs.writeFileSync(filePath, content, 'utf8');
console.log('Done!');
