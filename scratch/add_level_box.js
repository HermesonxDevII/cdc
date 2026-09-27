const fs = require('fs');

const filePath = 'c:\\React-Native\\cdc\\src\\app\\pokemon\\pokemon_card.tsx';
let content = fs.readFileSync(filePath, 'utf8');

const target1 = `            {/* Segundo Botão Redondo (Para o HP) */}
            <TouchableOpacity
              style={[styles.hpButton, isPreviewMode && styles.previewMode]}`;

const replacement1 = `            {/* Novo Botão para Level (Específico das versões japonesas) */}
            <TouchableOpacity
              style={[styles.levelButton, isPreviewMode && styles.previewMode]}
              disabled={isPreviewMode}
            >
              {/* Aqui entrará a lógica do modal e texto no futuro */}
            </TouchableOpacity>

            {/* Segundo Botão Redondo (Para o HP) */}
            <TouchableOpacity
              style={[styles.hpButton, isPreviewMode && styles.previewMode]}`;

const target2 = `  hpButton: {
    position: "absolute",
    top: 70, // Mesmo alinhamento vertical da bolinha`;

const replacement2 = `  levelButton: {
    position: "absolute",
    top: 75, // Provisório (um pouco mais baixo que o HP pra centralizar ou se alinhar)
    right: 290, // Provisório (à esquerda da box de HP)
    width: 80, // Menor que o HP
    height: 40, // Menor que o HP
    borderWidth: 3,
    borderColor: "white",
    borderRadius: 8,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },

  hpButton: {
    position: "absolute",
    top: 70, // Mesmo alinhamento vertical da bolinha`;

content = content.replace(target1.replace(/\r\n/g, '\n'), replacement1);
if (!content.includes(replacement1)) content = content.replace(target1, replacement1);

content = content.replace(target2.replace(/\r\n/g, '\n'), replacement2);
if (!content.includes(replacement2)) content = content.replace(target2, replacement2);

fs.writeFileSync(filePath, content, 'utf8');
console.log('Done!');
