const fs = require('fs');

const filePath = 'c:\\React-Native\\cdc\\src\\app\\pokemon\\pokemon_card.tsx';
let content = fs.readFileSync(filePath, 'utf8');

// 1. Import
const importTarget = `import { DiscardChangesModal } from "@/components/modals/discard_changes_modal";`;
const importReplacement = `import { DiscardChangesModal } from "@/components/modals/discard_changes_modal";\nimport { MenuModal } from "@/components/modals/menu_modal";`;
content = content.replace(importTarget, importReplacement);

// 3. Modal Visible State
const modalStateTarget = `  const [isDiscardModalVisible, setDiscardModalVisible] = useState(false);`;
const modalStateReplacement = `  const [isDiscardModalVisible, setDiscardModalVisible] = useState(false);\n  const [isMenuModalVisible, setMenuModalVisible] = useState(false);`;
content = content.replace(modalStateTarget, modalStateReplacement);

// 4. Modal Render
const modalRenderTarget = `        {/* Modal de Descarte de Alterações */}`;
const modalRenderReplacement = `        {/* Modal de Menu */}\n        <MenuModal\n          visible={isMenuModalVisible}\n          onClose={() => setMenuModalVisible(false)}\n        />\n\n        {/* Modal de Descarte de Alterações */}`;
content = content.replace(modalRenderTarget, modalRenderReplacement);

// 5. Button Press
const buttonTarget = `          {/* Menu Button */}
          <TouchableOpacity onPress={() => {}}>`;
const buttonReplacement = `          {/* Menu Button */}
          <TouchableOpacity onPress={() => setMenuModalVisible(true)}>`;
content = content.replace(buttonTarget.replace(/\r\n/g, '\n'), buttonReplacement);
content = content.replace(buttonTarget, buttonReplacement);

fs.writeFileSync(filePath, content, 'utf8');
console.log('Done!');
