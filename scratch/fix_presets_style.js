const fs = require('fs');

const filePath = 'c:\\React-Native\\cdc\\src\\components\\modals\\illustration_modal.tsx';
let content = fs.readFileSync(filePath, 'utf8');

const target1 = `          {/* Atalhos Rápidos */}
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

const replacement1 = `          {/* Atalhos Rápidos */}
          <View style={styles.presetContainer}>
            <TouchableOpacity style={styles.presetButton} onPress={() => setInputValue("Keiji Kinebuchi")}>
              <Text style={styles.presetButtonText}>Keiji Kinebuchi</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.presetButton} onPress={() => setInputValue("Ken Sugimori")}>
              <Text style={styles.presetButtonText}>Ken Sugimori</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.presetButton} onPress={() => setInputValue("Mitsuhiro Arita")}>
              <Text style={styles.presetButtonText}>Mitsuhiro Arita</Text>
            </TouchableOpacity>
          </View>`;

const target2 = `  presetContainer: {
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

const replacement2 = `  presetContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
    marginTop: -10,
  },
  presetButton: {
    backgroundColor: '#E0E0E0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  presetButtonText: {
    color: '#333',
    fontWeight: 'bold',
    fontSize: 14,
  },`;

content = content.replace(target1.replace(/\r\n/g, '\n'), replacement1);
content = content.replace(target1, replacement1);
content = content.replace(target2.replace(/\r\n/g, '\n'), replacement2);
content = content.replace(target2, replacement2);

fs.writeFileSync(filePath, content, 'utf8');
console.log('Done!');
