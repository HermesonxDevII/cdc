import React, { useState } from 'react';
import { Modal, StyleSheet, TouchableOpacity, View, Text, Pressable, TextInput , KeyboardAvoidingView, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface NameModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (value: string) => void;
}

export function NameModal({ visible, onClose, onSave }: NameModalProps) {
  const insets = useSafeAreaInsets();
  const [inputValue, setInputValue] = useState('');
  const [toastVisible, setToastVisible] = useState(false);

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

          {/* Toast de Erro (Canto superior direito) */}
          {toastVisible && (
            <View style={styles.toast}>
              <Text style={styles.toastText}>Digite um nome!</Text>
            </View>
          )}

          <Text style={styles.title}>Definir Nome</Text>
          
          {/* Input de Valor */}
          <TextInput
            style={styles.input}
            placeholder="Nome do Pokémon"
            placeholderTextColor="#888"
            value={inputValue}
            onChangeText={setInputValue}
            // Não limitamos a números aqui, pois nomes tem letras
          />

          {/* Botões na base */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={[styles.actionButton, { backgroundColor: '#7C3AED' }]} 
              onPress={() => {
                if (!inputValue.trim()) {
                  setToastVisible(true);
                  setTimeout(() => setToastVisible(false), 3000); // Some depois de 3s
                  return;
                }
                onSave(inputValue);
                onClose();
              }}
            >
              <Text style={styles.buttonText}>Salvar</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.actionButton, { backgroundColor: '#FF6467' }]} onPress={onClose}>
              <Text style={styles.buttonText}>Cancelar</Text>
            </TouchableOpacity>
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
    minHeight: '40%', // Ocupa 40% da tela
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
  input: {
    backgroundColor: '#D9D9D9',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#333',
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    marginTop: 'auto',
  },
  actionButton: {
    borderRadius: 3, 
    paddingVertical: 10,
    paddingHorizontal: 50,
    minWidth: 100,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  toast: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: '#FF6467',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 8,
    zIndex: 999, // Fica por cima de tudo
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 6,
  },
  toastText: {
    color: 'white',
    fontWeight: 'bold',
  }
});
