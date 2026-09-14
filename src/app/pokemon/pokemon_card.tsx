import { Image, StyleSheet, Dimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';

import { Back } from '@/components/back';

// 1. Definimos o tamanho REAL e gigante da carta para exportação
const CARD_REAL_WIDTH = 744;
const CARD_REAL_HEIGHT = 1045;

// 2. Pegamos a largura exata da tela do celular
const screenWidth = Dimensions.get('window').width;

// 3. Calculamos o fator de escala (zoom-out) para a carta ocupar 90% da tela
const cardScale = (screenWidth * 0.90) / CARD_REAL_WIDTH;

export default function PokemonCard() {
  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <Back href='/pokemon' />

        {/* Esse é o wrapper que reserva o espaço reduzido na tela para não quebrar o layout */}
        <View style={styles.scaledWrapper}>
          
          {/* ESSA é a carta real! Ela tem 744x1045. É dela que vamos tirar o print depois! */}
          <View style={styles.realSizeCard}>
            <Image 
              source={require('../../../assets/images/templates/pokemon/basic/normal_type.png')}
              style={styles.cardImage}
            />
            {/* Aqui dentro vão entrar os TextInputs flutuantes logo logo! */}
          </View>

        </View>
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
  }
})
