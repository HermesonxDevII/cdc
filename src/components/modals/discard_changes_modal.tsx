import React from 'react';
import { Modal, StyleSheet, TouchableOpacity, View, Text, Pressable , KeyboardAvoidingView, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface DiscardChangesModalProps {
  visible: boolean;
  onContinue: () => void;
  onDiscard: () => void;
}

export function DiscardChangesModal({ visible, onContinue, onDiscard }: DiscardChangesModalProps) {
  const insets = useSafeAreaInsets();
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onContinue}
    >
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
      <Pressable style={styles.overlay} onPress={onContinue}>
        <View style={[styles.modalContent, { paddingBottom: insets.bottom + 20 }]} onStartShouldSetResponder={() => true}>

          <Text style={styles.title}>Descartar edições?</Text>
          <Text style={styles.description}>
            Você tem alterações não salvas. Tem certeza que deseja sair?
          </Text>

          {/* Botões na base */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: '#7C3AED' }]}
              onPress={onContinue}
            >
              <Text style={styles.buttonText}>Continuar</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.actionButton, { backgroundColor: '#FF6467' }]} 
              onPress={onDiscard}
            >
              <Text style={styles.buttonText}>Sair</Text>
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
    minHeight: '25%', // Altura menor porque não tem input
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginBottom: 30,
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
});
