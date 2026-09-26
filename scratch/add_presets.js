const fs = require('fs');

const filePath = 'c:\\React-Native\\cdc\\src\\components\\modals\\illustration_modal.tsx';
let content = fs.readFileSync(filePath, 'utf8').replace(/\r\n/g, '\n');

const target1 = `          <TextInput
            style={styles.input}
            placeholder="Nome do Ilustrador"
            placeholderTextColor="#888"
            value={inputValue}
            onChangeText={setInputValue}
          />`;

const replacement1 = `          <TextInput
            style={styles.input}
            placeholder="Nome do Ilustrador"
            placeholderTextColor="#888"
            value={inputValue}
            onChangeText={setInputValue}
          />

          {/* Atalhos Rápidos */}
          <View style={styles.presetContainer}>
            <TouchableOpacity style={styles.presetButton} onPress={() => setInputValue("Keiji Kinebuchi")}>
              <Text numberOfLines={1} adjustsFontSizeToFit style={styles.presetButtonText}>Keiji Kinebuchi</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.presetButton} onPress={() => setInputValue("Ken Sugimori")}>
              <Text numberOfLines={1} adjustsFontSizeToFit style={styles.presetButtonText}>Ken Sugimori</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.presetButton} onPress={() => setInputValue("Mitsuhiro Arita")}>
              <Text numberOfLines={1} adjustsFontSizeToFit style={styles.presetButtonText}>Mitsuhiro Arita</Text>
            </TouchableOpacity>
          </View>`;

const target2 = `  input: {
    backgroundColor: '#D9D9D9',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#333',
    marginBottom: 20,
  },`;

const replacement2 = `  input: {
    backgroundColor: '#D9D9D9',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#333',
    marginBottom: 20,
  },
  presetContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 5,
    marginBottom: 20,
    marginTop: -10,
  },
  presetButton: {
    flex: 1,
    backgroundColor: '#E0E0E0',
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  presetButtonText: {
    color: '#333',
    fontWeight: 'bold',
    fontSize: 11,
    textAlign: 'center',
  },`;

content = content.replace(target1, replacement1);
content = content.replace(target2, replacement2);

fs.writeFileSync(filePath, content, 'utf8');
console.log('Done!');
