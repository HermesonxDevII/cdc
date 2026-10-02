import React from 'react';
import { Modal, StyleSheet, TouchableOpacity, View, Text, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface ColorPickerModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectColor: (color: string) => void;
  currentColor: string;
}

const COLORS = [
  '#CC0000', // Vermelho (Fogo/Lutador)
  '#0066CC', // Azul (Água)
  '#009900', // Verde (Grama)
  '#CCCC00', // Amarelo (Elétrico)
  '#990099', // Roxo (Psíquico)
  '#663300', // Marrom (Terra/Lutador antigo)
  '#000000', // Preto (Noturno)
  '#A0A0A0', // Prata/Cinza (Metal)
  '#FF9900', // Laranja (Fogo alternativo)
  '#00CCCC', // Ciano (Gelo)
  '#FF66B2', // Rosa (Fada)
  '#FFFFFF', // Branco (Incolor)
];

export function ColorPickerModal({ visible, onClose, onSelectColor, currentColor }: ColorPickerModalProps) {
  const insets = useSafeAreaInsets();

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <View style={[styles.modalContent, { paddingBottom: insets.bottom + 20 }]} onStartShouldSetResponder={() => true}>
          <Text style={styles.title}>Selecione uma Cor</Text>

          <View style={styles.grid}>
            {COLORS.map((color) => (
              <TouchableOpacity
                key={color}
                style={[
                  styles.colorSquare,
                  { backgroundColor: color },
                  currentColor === color && styles.selectedSquare
                ]}
                onPress={() => {
                  onSelectColor(color);
                  onClose();
                }}
              />
            ))}
          </View>

          <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
            <Text style={styles.cancelText}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  modalContent: {
    backgroundColor: '#F1F1FD',
    borderRadius: 20,
    width: '85%',
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontFamily: "GillSans",
    fontSize: 22,
    color: '#333',
    marginBottom: 20,
    fontWeight: 'bold',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 15,
  },
  colorSquare: {
    width: 50,
    height: 50,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'rgba(0,0,0,0.1)',
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  selectedSquare: {
    borderWidth: 4,
    borderColor: '#333',
    transform: [{ scale: 1.1 }],
  },
  cancelButton: {
    marginTop: 25,
    paddingVertical: 12,
    paddingHorizontal: 30,
    backgroundColor: '#FF6467',
    borderRadius: 25,
  },
  cancelText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: "GillSans",
  },
});
