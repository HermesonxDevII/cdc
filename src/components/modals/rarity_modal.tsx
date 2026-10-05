import React from "react";
import { Modal, StyleSheet, TouchableOpacity, View, Text, Image, Pressable, KeyboardAvoidingView, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const BASE_URL = '../../../assets/images/icons/rarities';

const RARITIES = [
  { id: 'common', source: require(`${BASE_URL}/common.png`) },
  { id: 'uncommon', source: require(`${BASE_URL}/uncommon.png`) },
  { id: 'rare', source: require(`${BASE_URL}/rare.png`) },
  { id: 'promo', source: require(`${BASE_URL}/promo.png`) },
];

interface RarityModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectRarity: (id: string) => void;
}

export function RarityModal({ visible, onClose, onSelectRarity }: RarityModalProps) {
  const insets = useSafeAreaInsets();
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

          <Text style={styles.title}>Selecione a Raridade</Text>

          <View style={styles.grid}>
            {RARITIES.map((rarity) => (
              <TouchableOpacity key={rarity.id} style={styles.iconButton} onPress={() => onSelectRarity(rarity.id)}>
                <Image source={rarity.source} style={styles.rarityIcon} />
              </TouchableOpacity>
            ))}
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
    minHeight: '40%',
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
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 20,
    marginTop: 10,
  },
  iconButton: {
    width: '40%', // Adjust width for 4 items, making them nicely distributed
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  rarityIcon: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  }
});
