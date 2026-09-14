import React, { useState } from 'react';
import { Image, StyleSheet, Dimensions, View, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';

import { Back } from '@/components/back';
import { TypeModal } from '@/components/modals/type_modal';

// Mapeamento de todas as texturas de cartas baseadas no tipo
const TEMPLATES: Record<string, any> = {
  dark: require('../../../assets/images/templates/pokemon/basic/dark.png'),
  eletric: require('../../../assets/images/templates/pokemon/basic/eletric.png'),
  fighter: require('../../../assets/images/templates/pokemon/basic/fighter.png'),
  fire: require('../../../assets/images/templates/pokemon/basic/fire.png'),
  grass: require('../../../assets/images/templates/pokemon/basic/grass.png'),
  metal: require('../../../assets/images/templates/pokemon/basic/metal.png'),
  normal: require('../../../assets/images/templates/pokemon/basic/normal.png'),
  psychic: require('../../../assets/images/templates/pokemon/basic/psychic.png'),
  water: require('../../../assets/images/templates/pokemon/basic/water.png'),
};

// 1. Definimos o tamanho REAL e gigante da carta para exportação
const CARD_REAL_WIDTH = 744;
const CARD_REAL_HEIGHT = 1045;

// 2. Pegamos a largura exata da tela do celular
const screenWidth = Dimensions.get('window').width;

// 3. Calculamos o fator de escala (zoom-out) para a carta ocupar 90% da tela
const cardScale = (screenWidth * 0.90) / CARD_REAL_WIDTH;

export default function PokemonCard() {
  const [isTypeModalVisible, setTypeModalVisible] = useState(false);
  const [currentTemplate, setCurrentTemplate] = useState(TEMPLATES.normal);

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <Back href='/pokemon' />

        {/* Esse é o wrapper que reserva o espaço reduzido na tela para não quebrar o layout */}
        <View style={styles.scaledWrapper}>

          {/* ESSA é a carta real! Ela tem 744x1045. É dela que vamos tirar o print depois! */}
          <View style={styles.realSizeCard}>
            <Image
              source={currentTemplate}
              style={styles.cardImage}
            />

            {/* Botão para trocar o Tipo (Símbolo no canto superior direito) */}
            <TouchableOpacity
              style={styles.typeButton}
              onPress={() => setTypeModalVisible(true)}
            />

            {/* Aqui dentro vão entrar os TextInputs flutuantes logo logo! */}
          </View>

        </View>

        {/* Modal embutido na tela que só aparece quando isTypeModalVisible for true */}
        <TypeModal
          visible={isTypeModalVisible}
          onClose={() => setTypeModalVisible(false)}
          onSelectType={(id) => {
            setCurrentTemplate(TEMPLATES[id]); // Troca a imagem da carta
            setTypeModalVisible(false);        // Fecha o modal logo em seguida
          }}
        />

      </SafeAreaView>
    </ThemedView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'row',
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: Spacing.four,
    alignItems: 'center',
    gap: Spacing.three,
    paddingBottom: BottomTabInset + Spacing.three,
    maxWidth: MaxContentWidth,
  },
  // O wrapper invisível com o tamanho já reduzido matematicamente
  scaledWrapper: {
    width: CARD_REAL_WIDTH * cardScale,
    height: CARD_REAL_HEIGHT * cardScale,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },

  // A carta gigante que sofre o zoom-out visualmente
  realSizeCard: {
    width: CARD_REAL_WIDTH,
    height: CARD_REAL_HEIGHT,
    transform: [{ scale: cardScale }],
    position: 'absolute', // Fundamental para a carta gigante não empurrar os botões da tela
  },

  cardImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain'
  },

  // Botão editável flutuante
  typeButton: {
    position: 'absolute',

    // POSIÇÃO: Ajuste esses números para encaixar perfeitamente em cima da bolinha!
    top: 59,       // Aumente para descer o quadrado, diminua para subir
    right: 68,     // Aumente para empurrar para a esquerda, diminua para colar na borda direita

    // TAMANHO: Ajuste para ficar do tamanho exato da bolinha
    width: 60,
    height: 60,

    // VISUAL: O quadrado branco que você pediu
    borderWidth: 3,
    borderColor: 'white',
    borderRadius: 8, // Deixa as pontas um pouquinho arredondadas
    backgroundColor: 'rgba(255, 255, 255, 0.2)', // Um fundo branco transparente pra dar destaque visual
  }
})
