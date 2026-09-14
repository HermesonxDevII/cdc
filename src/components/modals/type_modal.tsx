import { Modal, StyleSheet, TouchableOpacity, View, Text, Image, Pressable } from 'react-native';

const BASE_URL = '../../../assets/images/icons/pokemon_types';

const POKEMON_TYPES = [
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

interface TypeModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectType: (id: string) => void;
}

export function TypeModal({ visible, onClose, onSelectType }: TypeModalProps) {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      {/* Overlay escuro no fundo (agora clicável para fechar o modal) */}
      <Pressable style={styles.overlay} onPress={onClose}>
        {/* Caixa principal do modal (evita que o clique vaze pro fundo) */}
        <View style={styles.modalContent} onStartShouldSetResponder={() => true}>

          {/* Botão de Fechar no topo direito */}
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeText}>X</Text>
          </TouchableOpacity>

          {/* Título do Modal */}
          <Text style={styles.title}>Selecione o Tipo</Text>

          {/* Grid de Ícones */}
          <View style={styles.grid}>
            {POKEMON_TYPES.map((type) => (
              <TouchableOpacity key={type.id} style={styles.iconButton} onPress={() => onSelectType(type.id)}>
                <Image source={type.source} style={styles.typeIcon} />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Pressable>
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
