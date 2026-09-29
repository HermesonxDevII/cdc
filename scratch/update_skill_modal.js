const fs = require('fs');

const filePath = 'c:\\React-Native\\cdc\\src\\components\\modals\\skill_modal.tsx';
let content = fs.readFileSync(filePath, 'utf8');

// Replace validation logic
content = content.replace('!name.trim() || !description.trim()', '!name.trim()');

// Replace label text
content = content.replace('<Text style={styles.label}>Descrição</Text>', '<Text style={styles.label}>Descrição (Opcional)</Text>');

// Replace Toast text (handling possible encoding issues by targeting only the beginning)
content = content.replace('Preencha o nome e a descrição!', 'Preencha o nome da habilidade!');

fs.writeFileSync(filePath, content, 'utf8');
console.log('Done!');
