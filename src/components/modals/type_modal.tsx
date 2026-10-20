import { useState } from 'react';
import { Modal, StyleSheet, TouchableOpacity, View, Text, Image, Pressable , KeyboardAvoidingView, Platform, ScrollView, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { TYPES_CURRENT, TYPES_OLD, TYPES_OLD_2 } from '@/constants/type_icons';
import { CARD_TEMPLATES } from '@/constants/card_templates';

interface TypeModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectType: (id: string) => void;
}

export function TypeModal({ visible, onClose, onSelectType }: TypeModalProps) {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const [activeTab, setActiveTab] = useState<'current' | 'old' | 'old_2'>('current');

  const getActiveList = () => {
    if (activeTab === 'old') return TYPES_OLD;
    if (activeTab === 'old_2') return TYPES_OLD_2;
    return TYPES_CURRENT;
  };

  // Altura máxima do grid = 3 linhas (largura útil = tela - padding 20 de cada lado; ícone = 28% dela).
  // Do 10º ícone em diante o grid rola na vertical em vez de aumentar o modal.
  const iconSize = (width - 40) * 0.28;
  const gridMaxHeight = Math.ceil(10 + iconSize * 3 + 15 * 2); // marginTop + 3 linhas + 2 gaps

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      {/* Overlay escuro no fundo (agora clicável para fechar o modal) */}
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
      <Pressable style={styles.overlay} onPress={onClose}>
        {/* Caixa principal do modal (evita que o clique vaze pro fundo) */}
        <View style={[styles.modalContent, { paddingBottom: insets.bottom + 20 }]} onStartShouldSetResponder={() => true}>

          {/* Botão de Fechar no topo direito */}
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeText}>X</Text>
          </TouchableOpacity>

          {/* Título do Modal */}
          <Text style={styles.title}>Selecione o Tipo</Text>

          {/* Menu de navegação entre os estilos de ícones */}
          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[styles.tabButton, activeTab === 'current' && styles.tabButtonActive]}
              onPress={() => setActiveTab('current')}
            >
              <Text
                numberOfLines={1}
                adjustsFontSizeToFit
                style={[
                  styles.tabText,
                  activeTab === 'current' && styles.tabTextActive
                ]}
              >Atual</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.tabButton, activeTab === 'old' && styles.tabButtonActive]}
              onPress={() => setActiveTab('old')}
            >
              <Text
                numberOfLines={1}
                adjustsFontSizeToFit
                style={[
                  styles.tabText,
                  activeTab === 'old' && styles.tabTextActive
                ]}
              >Clássico</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.tabButton, activeTab === 'old_2' && styles.tabButtonActive]}
              onPress={() => setActiveTab('old_2')}
            >
              <Text
                numberOfLines={1}
                adjustsFontSizeToFit
                style={[
                  styles.tabText,
                  activeTab === 'old_2' && styles.tabTextActive
                ]}
              >Retrô</Text>
            </TouchableOpacity>
          </View>

          {/* Grid de Ícones (rola na vertical a partir da 4ª linha) */}
          <ScrollView style={{ maxHeight: gridMaxHeight }}>
            {/* Responder aqui dentro para o toque entre os ícones não travar a rolagem no modal */}
            <View style={styles.grid} onStartShouldSetResponder={() => true}>
              {getActiveList().filter((type) => type.id in CARD_TEMPLATES).map((type) => (
                <TouchableOpacity key={type.id} style={styles.iconButton} onPress={() => onSelectType(type.id)}>
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
    justifyContent: 'flex-end', // Joga o modal para a parte de baixo da tela
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fundo escurinho transparente
  },
  modalContent: {
    backgroundColor: '#F1F1FD', // A cor que você pediu!
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    minHeight: '50%', // Ocupa metade da tela
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
    zIndex: 1, // Garante que o botão fique sempre por cima de tudo
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
    justifyContent: 'center', // centraliza a grade
    gap: 15, // Espaço entre os ícones
    marginTop: 10,
  },
  iconButton: {
    width: '28%', // Aproximadamente 3 por linha (com o gap, dá certinho)
    aspectRatio: 1, // Mantém quadrado
    justifyContent: 'center',
    alignItems: 'center',
  },
  typeIcon: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  }
});
