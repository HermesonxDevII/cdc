import React, { useState } from "react";
import { Modal, StyleSheet, TouchableOpacity, View, Text, Image, Pressable , KeyboardAvoidingView, Platform, ScrollView, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { TYPES_CURRENT, TYPES_OLD, TYPES_OLD_2 } from '@/constants/type_icons';

interface WeaknessModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectWeakness: (id: string) => void;
}

export function WeaknessModal({ visible, onClose, onSelectWeakness }: WeaknessModalProps) {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const [activeTab, setActiveTab] = useState<'current' | 'old' | 'old_2'>('current');

  // Altura máxima do grid = 3 linhas (largura útil = tela - padding 20 de cada lado; ícone = 28% dela).
  // Do 10º ícone em diante o grid rola na vertical em vez de aumentar o modal.
  const iconSize = (width - 40) * 0.28;
  const gridMaxHeight = Math.ceil(10 + iconSize * 3 + 15 * 2); // marginTop + 3 linhas + 2 gaps

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

          <Text style={styles.title}>Selecione a Fraqueza</Text>

          {/* Abas de Seleção de Estilo */}
          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[styles.tabButton, activeTab === 'current' && styles.tabButtonActive]}
              onPress={() => setActiveTab('current')}
            >
              <Text numberOfLines={1} adjustsFontSizeToFit style={[styles.tabText, activeTab === 'current' && styles.tabTextActive]}>Atual</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.tabButton, activeTab === 'old' && styles.tabButtonActive]}
              onPress={() => setActiveTab('old')}
            >
              <Text numberOfLines={1} adjustsFontSizeToFit style={[styles.tabText, activeTab === 'old' && styles.tabTextActive]}>Clássico</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.tabButton, activeTab === 'old_2' && styles.tabButtonActive]}
              onPress={() => setActiveTab('old_2')}
            >
              <Text numberOfLines={1} adjustsFontSizeToFit style={[styles.tabText, activeTab === 'old_2' && styles.tabTextActive]}>Retrô</Text>
            </TouchableOpacity>
          </View>

          {/* Grid de Ícones (rola na vertical a partir da 4ª linha) */}
          <ScrollView style={{ maxHeight: gridMaxHeight }}>
            {/* Responder aqui dentro para o toque entre os ícones não travar a rolagem no modal */}
            <View style={styles.grid} onStartShouldSetResponder={() => true}>
              {getActiveList().map((type) => (
                <TouchableOpacity key={type.id} style={styles.iconButton} onPress={() => onSelectWeakness(type.id)}>
                  <Image source={type.source} style={styles.typeIcon} />
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
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
    fontSize: 13,
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
