const fs = require('fs');

const filePath = 'c:\\React-Native\\cdc\\src\\app\\pokemon\\pokemon_card.tsx';
let content = fs.readFileSync(filePath, 'utf8');

// 1. Update CardState
content = content.replace(
  'retreat: { symbol: string; count: number } | null;',
  'retreat: { symbol: string; count: number } | null;\n  movesCount: number;'
);

// 2. Update initialState
content = content.replace(
  'retreat: null,',
  'retreat: null,\n  movesCount: 2,'
);

// 3. Destructure movesCount
content = content.replace(
  'resistanceValue, retreat, firstSkill, firstSkillDamage,',
  'resistanceValue, retreat, movesCount, firstSkill, firstSkillDamage,'
);

// 4. Update MenuModal Props
const menuModalTarget = `<MenuModal
          visible={isMenuModalVisible}
          onClose={() => setMenuModalVisible(false)}
        />`;
const menuModalReplacement = `<MenuModal
          visible={isMenuModalVisible}
          onClose={() => setMenuModalVisible(false)}
          movesCount={movesCount}
          onSelectMovesCount={(count) => updateCard({ movesCount: count })}
        />`;
content = content.replace(menuModalTarget, menuModalReplacement);

// 5. Wrap existing two skills and add the new single skill block
// Using regex or exact string replacement
const firstSkillEnergyTarget = `            {/* Custo de Energia da Primeira Habilidade (À esquerda da habilidade) */}`;
content = content.replace(firstSkillEnergyTarget, `            {movesCount === 2 && (\n              <>\n${firstSkillEnergyTarget}`);

const secondSkillDamageEndTarget = `              ) : null}
            </TouchableOpacity>

            {/* Bloco de habilidade unica */}`;

const singleMoveBlock = `              ) : null}
            </TouchableOpacity>
            </>
            )}

            {/* Bloco de habilidade unica */}
            {movesCount === 1 && (
              <>
                {/* Custo de Energia (Habilidade Única) */}
                <TouchableOpacity
                  style={[
                    styles.firstSkillEnergyButton,
                    isPreviewMode && styles.previewMode,
                    { top: 670, height: 100 } // Valores provisórios centralizados
                  ]}
                  onPress={() => setFirstSkillEnergyModalVisible(true)}
                  disabled={isPreviewMode}
                >
                  {firstSkillEnergy ? (
                    <View style={styles.skillEnergyContainer}>
                      {Array.from({ length: firstSkillEnergy.count }).map((_, index) => (
                        <Image
                          key={index}
                          source={TYPE_ICONS[firstSkillEnergy.symbol]}
                          style={styles.skillEnergyIcon}
                        />
                      ))}
                    </View>
                  ) : null}
                </TouchableOpacity>

                {/* Habilidade Única (Nome e Descrição) */}
                <TouchableOpacity
                  style={[
                    styles.firstSkillButton,
                    isPreviewMode && styles.previewMode,
                    { top: 670, height: 100, flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }
                  ]}
                  onPress={() => setFirstSkillModalVisible(true)}
                  disabled={isPreviewMode}
                >
                  {firstSkill ? (
                    <>
                      <Text style={[styles.skillNameText, { textAlign: 'center' }]}>{firstSkill.name}</Text>
                      <Text style={[styles.skillDescriptionText, { textAlign: 'center' }]}>{firstSkill.description}</Text>
                    </>
                  ) : null}
                </TouchableOpacity>

                {/* Dano (Habilidade Única) */}
                <TouchableOpacity
                  style={[
                    styles.firstSkillDamageButton,
                    isPreviewMode && styles.previewMode,
                    { top: 670, height: 100 } // Valores provisórios centralizados
                  ]}
                  onPress={() => setFirstSkillDamageModalVisible(true)}
                  disabled={isPreviewMode}
                >
                  {firstSkillDamage ? (
                    <Text style={styles.skillDamageText}>{firstSkillDamage}</Text>
                  ) : null}
                </TouchableOpacity>
              </>
            )}`;

content = content.replace(secondSkillDamageEndTarget, singleMoveBlock);

fs.writeFileSync(filePath, content, 'utf8');
console.log('Done!');
