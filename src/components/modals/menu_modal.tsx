import React, { useState } from 'react';
import { Modal, StyleSheet, TouchableOpacity, View, Text, Pressable, Platform, KeyboardAvoidingView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface MenuModalProps {
  visible: boolean;
  onClose: () => void;
  movesCount: number;
  onSelectMovesCount: (count: number) => void;
  hasPassiveSkill: boolean;
  onSelectPassiveSkill: (hasPassive: boolean) => void;
  weaknessesCount: number;
  onSelectWeaknessesCount: (count: number) => void;
}

export function MenuModal({ visible, onClose, movesCount, onSelectMovesCount, hasPassiveSkill, onSelectPassiveSkill, weaknessesCount, onSelectWeaknessesCount }: MenuModalProps) {
  const insets = useSafeAreaInsets();

  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const [isPassiveSelectOpen, setIsPassiveSelectOpen] = useState(false);
  const [isWeaknessesSelectOpen, setIsWeaknessesSelectOpen] = useState(false);

  const handleSelect = (value: number) => {
    onSelectMovesCount(value);
    setIsSelectOpen(false);
  };

  const handlePassiveSelect = (value: boolean) => {
    onSelectPassiveSkill(value);
    setIsPassiveSelectOpen(false);
  };

  const handleWeaknessesSelect = (value: number) => {
    onSelectWeaknessesCount(value);
    setIsWeaknessesSelectOpen(false);
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <Pressable style={styles.overlay} onPress={onClose}>
          <View style={[styles.modalContent, { paddingBottom: insets.bottom + 20 }]} onStartShouldSetResponder={() => true}>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeText}>X</Text>
            </TouchableOpacity>

            <Text style={styles.title}>Opções da Carta</Text>

            <View style={[styles.optionContainer, { zIndex: 2 }]}>
              <Text style={styles.label}>Movimentos:</Text>

              {/* Custom Select Box */}
              <View style={styles.selectWrapper}>
                <TouchableOpacity
                  style={styles.selectBox}
                  onPress={() => setIsSelectOpen(!isSelectOpen)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.selectValue}>{movesCount}</Text>
                  <Text style={styles.selectArrow}>{isSelectOpen ? '▲' : '▼'}</Text>
                </TouchableOpacity>

                {/* Dropdown Options */}
                {isSelectOpen && (
                  <View style={styles.dropdownMenu}>
                    <TouchableOpacity
                      style={styles.dropdownOption}
                      onPress={() => handleSelect(1)}
                    >
                      <Text style={[styles.dropdownOptionText, movesCount === 1 && styles.selectedOptionText]}>1</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.dropdownOption}
                      onPress={() => handleSelect(2)}
                    >
                      <Text style={[styles.dropdownOptionText, movesCount === 2 && styles.selectedOptionText]}>2</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </View>

            <View style={[styles.optionContainer, { zIndex: 1 }]}>
              <Text style={styles.label}>Habilidade:</Text>

              {/* Custom Select Box */}
              <View style={styles.selectWrapper}>
                <TouchableOpacity
                  style={styles.selectBox}
                  onPress={() => setIsPassiveSelectOpen(!isPassiveSelectOpen)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.selectValue}>{hasPassiveSkill ? 'Sim' : 'Não'}</Text>
                  <Text style={styles.selectArrow}>{isPassiveSelectOpen ? '▲' : '▼'}</Text>
                </TouchableOpacity>

                {/* Dropdown Options */}
                {isPassiveSelectOpen && (
                  <View style={styles.dropdownMenu}>
                    <TouchableOpacity
                      style={styles.dropdownOption}
                      onPress={() => handlePassiveSelect(true)}
                    >
                      <Text style={[styles.dropdownOptionText, hasPassiveSkill === true && styles.selectedOptionText]}>Sim</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.dropdownOption}
                      onPress={() => handlePassiveSelect(false)}
                    >
                      <Text style={[styles.dropdownOptionText, hasPassiveSkill === false && styles.selectedOptionText]}>Não</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </View>

            <View style={[styles.optionContainer, { zIndex: 0 }]}>
              <Text style={styles.label}>Fraquezas:</Text>

              {/* Custom Select Box */}
              <View style={styles.selectWrapper}>
                <TouchableOpacity
                  style={styles.selectBox}
                  onPress={() => setIsWeaknessesSelectOpen(!isWeaknessesSelectOpen)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.selectValue}>{weaknessesCount}</Text>
                  <Text style={styles.selectArrow}>{isWeaknessesSelectOpen ? '▲' : '▼'}</Text>
                </TouchableOpacity>

                {/* Dropdown Options */}
                {isWeaknessesSelectOpen && (
                  <View style={styles.dropdownMenu}>
                    <TouchableOpacity
                      style={styles.dropdownOption}
                      onPress={() => handleWeaknessesSelect(1)}
                    >
                      <Text style={[styles.dropdownOptionText, weaknessesCount === 1 && styles.selectedOptionText]}>1</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.dropdownOption}
                      onPress={() => handleWeaknessesSelect(2)}
                    >
                      <Text style={[styles.dropdownOptionText, weaknessesCount === 2 && styles.selectedOptionText]}>2</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </View>

          </View>
        </Pressable>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#F1F1FD',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    minHeight: '30%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  closeButton: {
    position: 'absolute',
    top: 15,
    right: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
    zIndex: 1,
  },
  closeText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  optionContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    zIndex: 10, // Para garantir que o dropdown fique por cima se houver outros itens abaixo
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 10,
  },
  selectWrapper: {
    position: 'relative',
    width: 130, // Largura um pouco maior
  },
  selectBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#7C3AED', // Cor roxa
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#7C3AED',
  },
  selectValue: {
    fontSize: 16,
    color: 'white', // Texto branco para contrastar com roxo
    fontWeight: '600',
  },
  selectArrow: {
    fontSize: 12,
    color: 'white', // Seta branca
  },
  dropdownMenu: {
    position: 'absolute',
    top: 45, // Logo abaixo do selectBox
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#bbb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
    zIndex: 20,
  },
  dropdownOption: {
    paddingVertical: 12,
    paddingHorizontal: 15,
  },
  dropdownOptionText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
  },
  selectedOptionText: {
    fontWeight: 'bold',
    color: '#7C3AED',
  },
});
