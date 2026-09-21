import React, { useState } from "react";
import { Modal, StyleSheet, TouchableOpacity, View, Text, Image, Pressable , KeyboardAvoidingView, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const BASE_URL = '../../../assets/images/icons/pokemon_types';

const TYPES_CURRENT = [
  { id: 'dark', source: require(`${BASE_URL}/dark.png`) },
  { id: 'eletric', source: require(`${BASE_URL}/eletric.png`) },
  { id: 'fighter', source: require(`${BASE_URL}/fighter.png`) },
  { id: 'fire', source: require(`${BASE_URL}/fire.png`) },
  { id: 'grass', source: require(`${BASE_URL}/grass.png`) },
  { id: 'metal', source: require(`${BASE_URL}/metal.png`) },
  { id: 'normal', source: require(`${BASE_URL}/normal.png`) },
  { id: 'psychic', source: require(`${BASE_URL}/psychic.png`) },
  { id: 'water', source: require(`${BASE_URL}/water.png`) },
];

const TYPES_OLD = [
  { id: 'dark_old', source: require(`${BASE_URL}/dark_old.png`) },
  { id: 'eletric_old', source: require(`${BASE_URL}/eletric_old.png`) },
  { id: 'fighter_old', source: require(`${BASE_URL}/fighter_old.png`) },
  { id: 'fire_old', source: require(`${BASE_URL}/fire_old.png`) },
  { id: 'grass_old', source: require(`${BASE_URL}/grass_old.png`) },
  { id: 'metal_old', source: require(`${BASE_URL}/metal_old.png`) },
  { id: 'normal_old', source: require(`${BASE_URL}/normal_old.png`) },
  { id: 'psychic_old', source: require(`${BASE_URL}/psychic_old.png`) },
  { id: 'water_old', source: require(`${BASE_URL}/water_old.png`) },
];

const TYPES_OLD_2 = [
  { id: 'dark_old_2', source: require(`${BASE_URL}/dark_old_2.png`) },
  { id: 'eletric_old_2', source: require(`${BASE_URL}/eletric_old_2.png`) },
  { id: 'fighter_old_2', source: require(`${BASE_URL}/fighter_old_2.png`) },
  { id: 'fire_old_2', source: require(`${BASE_URL}/fire_old_2.png`) },
  { id: 'grass_old_2', source: require(`${BASE_URL}/grass_old_2.png`) },
  { id: 'metal_old_2', source: require(`${BASE_URL}/metal_old_2.png`) },
  { id: 'normal_old_2', source: require(`${BASE_URL}/normal_old_2.png`) },
  { id: 'psychic_old_2', source: require(`${BASE_URL}/psychic_old_2.png`) },
  { id: 'water_old_2', source: require(`${BASE_URL}/water_old_2.png`) },
];

interface ResistanceModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectResistance: (id: string) => void;
}

export function ResistanceModal({ visible, onClose, onSelectResistance }: ResistanceModalProps) {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<'current' | 'old' | 'old_2'>('current');

  const getActiveList = () => {
    if (activeTab === 'old') return TYPES_OLD;
    if (activeTab === 'old_2') return TYPES_OLD_2;
    return TYPES_CURRENT;
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

          <Text style={styles.title}>Selecione a Resistência</Text>

          {/* Abas de Seleção de Estilo */}
          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[styles.tabButton, activeTab === 'current' && styles.tabButtonActive]}
              onPress={() => setActiveTab('current')}
            >
              <Text style={[styles.tabText, activeTab === 'current' && styles.tabTextActive]}>Atual</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.tabButton, activeTab === 'old' && styles.tabButtonActive]}
              onPress={() => setActiveTab('old')}
            >
              <Text style={[styles.tabText, activeTab === 'old' && styles.tabTextActive]}>Clássico</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.tabButton, activeTab === 'old_2' && styles.tabButtonActive]}
              onPress={() => setActiveTab('old_2')}
            >
              <Text style={[styles.tabText, activeTab === 'old_2' && styles.tabTextActive]}>Retrô</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.grid}>
            {getActiveList().map((type) => (
              <TouchableOpacity key={type.id} style={styles.iconButton} onPress={() => onSelectResistance(type.id)}>
                <Image source={type.source} style={styles.typeIcon} />
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
    minHeight: '50%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
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
    marginBottom: 10,
    textAlign: 'center',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#E0E0E0',
    borderRadius: 20,
    padding: 4,
    marginBottom: 15,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 16,
    alignItems: 'center',
  },
  tabButtonActive: {
    backgroundColor: '#7C3AED',
  },
  tabText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#555',
  },
  tabTextActive: {
    color: '#FFF',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 15,
    marginTop: 10,
  },
  iconButton: {
    width: '28%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  typeIcon: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  }
});
