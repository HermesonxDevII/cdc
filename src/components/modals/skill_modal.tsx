import React, { useState } from 'react';
import { Modal, StyleSheet, TouchableOpacity, View, Text, Pressable, TextInput } from 'react-native';

interface SkillModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (skill: { name: string; description: string }) => void;
  title?: string;
}

export function SkillModal({ visible, onClose, onSave, title = "Habilidade" }: SkillModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [toastVisible, setToastVisible] = useState(false);

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <View style={styles.modalContent} onStartShouldSetResponder={() => true}>

          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeText}>X</Text>
          </TouchableOpacity>

          {/* Toast de Erro (Canto superior direito) */}
          {toastVisible && (
            <View style={styles.toast}>
              <Text style={styles.toastText}>Preencha o nome e a descrição!</Text>
            </View>
          )}

          <Text style={styles.title}>{title}</Text>
          
          <Text style={styles.label}>Nome da Habilidade</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: Stun Spore"
            placeholderTextColor="#888"
            value={name}
            onChangeText={setName}
          />

          <Text style={styles.label}>Descrição</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Ex: Flip a coin. If heads, the Defending Pokémon is now Paralyzed."
            placeholderTextColor="#888"
            value={description}
            onChangeText={setDescription}
            multiline={true}
            numberOfLines={4}
            textAlignVertical="top"
          />

          {/* Botões na base */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: '#7C3AED' }]}
              onPress={() => {
                if (!name.trim() || !description.trim()) {
                  setToastVisible(true);
                  setTimeout(() => setToastVisible(false), 3000);
                  return;
                }
                onSave({ name, description });
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
    minHeight: '55%',
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
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#555',
    marginBottom: 5,
    marginLeft: 5,
  },
  input: {
    backgroundColor: '#D9D9D9',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#333',
    marginBottom: 20,
  },
  textArea: {
    height: 100,
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
    zIndex: 999,
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
