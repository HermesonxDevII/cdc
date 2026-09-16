import React, { useState } from 'react';
import { Image, StyleSheet, Dimensions, View, TouchableOpacity, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';

import { Back } from '@/components/back';
import { TypeModal } from '@/components/modals/type_modal';
import { HpModal } from '@/components/modals/hp_modal';
import { NameModal } from '@/components/modals/name_modal';

// Mapeamento de todas as texturas de cartas baseadas no tipo
const BASE_URL = '../../../assets/images/templates/pokemon/basic';

const TEMPLATES: Record<string, any> = {
  dark: require(`${BASE_URL}/dark.png`),
  eletric: require(`${BASE_URL}/eletric.png`),
  fighter: require(`${BASE_URL}/fighter.png`),
  fire: require(`${BASE_URL}/fire.png`),
  grass: require(`${BASE_URL}/grass.png`),
  metal: require(`${BASE_URL}/metal.png`),
  normal: require(`${BASE_URL}/normal.png`),
  psychic: require(`${BASE_URL}/psychic.png`),
  water: require(`${BASE_URL}/water.png`),
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
  const [isHpModalVisible, setHpModalVisible] = useState(false);
  const [isNameModalVisible, setNameModalVisible] = useState(false);

  const [currentTemplate, setCurrentTemplate] = useState(TEMPLATES.normal);
  const [hp, setHp] = useState('');
  const [name, setName] = useState('');

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

            {/* Novo Botão Retangular (Para o HP ou outro campo) */}
            <TouchableOpacity
              style={styles.hpButton}
              onPress={() => setHpModalVisible(true)}
            >
              {hp ? <Text style={styles.hpText}>{hp} HP</Text> : null}
            </TouchableOpacity>

            {/* Terceiro Botão Retangular (Para o Nome ou outro campo) */}
            <TouchableOpacity
              style={styles.nameButton}
              onPress={() => setNameModalVisible(true)}
            >
              {name ? <Text style={styles.nameText}>{name}</Text> : null}
            </TouchableOpacity>

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

        {/* Modal de HP */}
        <HpModal
          visible={isHpModalVisible}
          onClose={() => setHpModalVisible(false)}
          onSave={(valor) => setHp(valor)}
        />

        {/* Modal de Nome */}
        <NameModal
          visible={isNameModalVisible}
          onClose={() => setNameModalVisible(false)}
          onSave={(valor) => setName(valor)}
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

  typeButton: {
    position: 'absolute',
    top: 59,   // Alinhamento vertical
    right: 68, // Alinhamento horizontal
    width: 60,  // Largura
    height: 60, // Altura
    borderWidth: 3,
    borderColor: 'white',
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)'
  },

  hpButton: {
    position: 'absolute',
    top: 70,    // Mesmo alinhamento vertical da bolinha
    right: 130, // Fica à esquerda da bolinha (68 da margem + 60 da bolinha + 12 de espaço)
    width: 150, // Aumentei de 100 para 140 a seu pedido para dar espaço ao "120 HP"
    height: 50, // Mesma altura
    borderWidth: 3,
    borderColor: 'white',
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center', // Centraliza o texto verticalmente
    alignItems: 'center',     // Centraliza o texto horizontalmente
  },

  // Terceiro botão (Para o Nome do Pokémon, etc)
  nameButton: {
    position: 'absolute',
    top: 70,    // Mesmo alinhamento vertical da bolinha
    left: 80, // Fica à esquerda do botão de HP (135 da margem do hp + 100 da largura do hp + 10 de espaço)
    width: 250, // Bem mais largo por ser um retângulo gigante (ajuste se precisar)
    height: 50, // Mesma altura
    borderWidth: 3,
    borderColor: 'white',
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center', // Centraliza verticalmente
    alignItems: 'flex-start', // Alinha o nome pela esquerda
    paddingLeft: 10,          // Dá um espacinho da borda
  },

  // Texto do Nome
  nameText: {
    fontFamily: 'GillSans-Bold',
    fontSize: 45,
    color: '#000',
    textShadowColor: 'white',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },

  // Texto do HP (Usando a fonte personalizada)
  hpText: {
    fontFamily: 'GillSans-Bold',
    fontSize: 45,
    color: '#000', // HP geralmente é preto ou bem escuro
    textAlign: 'center',
    // Um pouco de sombra para dar leitura melhor
    textShadowColor: 'white',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  }
})
