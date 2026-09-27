const fs = require('fs');

const filePath = 'c:\\React-Native\\cdc\\src\\app\\pokemon\\pokemon_card.tsx';
let content = fs.readFileSync(filePath, 'utf8');

const target = `{hp ? <Text style={styles.hpText}>{hp} HP</Text> : null}`;
const replacement = `{hp ? <Text style={styles.hpText} numberOfLines={1} adjustsFontSizeToFit>{hp} HP</Text> : null}`;

content = content.replace(target, replacement);

fs.writeFileSync(filePath, content, 'utf8');
console.log('Done!');
