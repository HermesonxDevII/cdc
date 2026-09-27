const fs = require('fs');

const filePath = 'c:\\React-Native\\cdc\\src\\app\\pokemon\\pokemon_card.tsx';
let content = fs.readFileSync(filePath, 'utf8');

// 1. Import
const importTarget = `import { PokemonNumberModal } from "@/components/modals/pokemon_number_modal";`;
const importReplacement = `import { PokemonNumberModal } from "@/components/modals/pokemon_number_modal";\nimport { LevelModal } from "@/components/modals/level_modal";`;
content = content.replace(importTarget, importReplacement);

// 2. CardState
const stateTarget1 = `  pokemonNumber: string;`;
const stateReplacement1 = `  pokemonNumber: string;\n  level: string;`;
content = content.replace(stateTarget1, stateReplacement1);

const stateTarget2 = `  pokemonNumber: "",`;
const stateReplacement2 = `  pokemonNumber: "",\n  level: "",`;
content = content.replace(stateTarget2, stateReplacement2);

const stateTarget3 = `illustration, pokemonNumber, extraInfo, weakness, weaknessValue,`;
const stateReplacement3 = `illustration, pokemonNumber, extraInfo, weakness, weaknessValue, level,`;
content = content.replace(stateTarget3, stateReplacement3);

// 3. Modal Visible State
const modalStateTarget = `  const [isPokemonNumberModalVisible, setPokemonNumberModalVisible] =\n    useState(false);`;
const modalStateReplacement = `  const [isPokemonNumberModalVisible, setPokemonNumberModalVisible] =\n    useState(false);\n  const [isLevelModalVisible, setLevelModalVisible] = useState(false);`;
content = content.replace(modalStateTarget, modalStateReplacement);
// If it was formatted on one line:
if (!content.includes('isLevelModalVisible')) {
    const modalStateAlt = `  const [isPokemonNumberModalVisible, setPokemonNumberModalVisible] = useState(false);`;
    content = content.replace(modalStateAlt, `  const [isPokemonNumberModalVisible, setPokemonNumberModalVisible] = useState(false);\n  const [isLevelModalVisible, setLevelModalVisible] = useState(false);`);
}

// 4. Modal Render
const modalRenderTarget = `        {/* Modal do Número do Pokémon */}`;
const modalRenderReplacement = `        {/* Modal do Level */}\n        <LevelModal\n          visible={isLevelModalVisible}\n          onClose={() => setLevelModalVisible(false)}\n          onSave={(valor) => {\n            updateCard({ level: valor });\n            setLevelModalVisible(false);\n          }}\n        />\n\n        {/* Modal do Número do Pokémon */}`;
content = content.replace(modalRenderTarget, modalRenderReplacement);

// 5. Button Press and Text
const buttonTarget = `            {/* Novo Botão para Level (Específico das versões japonesas) */}
            <TouchableOpacity
              style={[styles.levelButton, isPreviewMode && styles.previewMode]}
              disabled={isPreviewMode}
            >
              {/* Aqui entrará a lógica do modal e texto no futuro */}
            </TouchableOpacity>`;
const buttonReplacement = `            {/* Novo Botão para Level (Específico das versões japonesas) */}
            <TouchableOpacity
              style={[styles.levelButton, isPreviewMode && styles.previewMode]}
              onPress={() => setLevelModalVisible(true)}
              disabled={isPreviewMode}
            >
              {level ? <Text style={styles.levelText}>LV.{level}</Text> : null}
            </TouchableOpacity>`;
content = content.replace(buttonTarget.replace(/\r\n/g, '\n'), buttonReplacement);
content = content.replace(buttonTarget, buttonReplacement);

// 6. Style
const styleTarget = `  levelButton: {`;
const styleReplacement = `  levelText: {
    fontFamily: "Revue",
    fontSize: 22, // Ajuste conforme necessário
    color: "#000",
    textAlign: "center",
    textShadowColor: "white",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
    includeFontPadding: false,
  },

  levelButton: {`;
content = content.replace(styleTarget, styleReplacement);

fs.writeFileSync(filePath, content, 'utf8');
console.log('Done!');
