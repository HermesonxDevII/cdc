import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';

import { Back } from '@/components/back';
import { TemplateCard } from '@/components/template-card';

export default function Index() {
  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <Back href='/' />

        <ThemedView style={styles.box}>
          <TemplateCard
            imageSource={require('../../../assets/images/templates/pokemon/basic/normal_type.png')}
            href='/pokemon/pokemon_card'
          />

          <TemplateCard
            imageSource={require('../../../assets/images/templates/pokemon/trainer/trainer.png')}
            href='/settings'
          />
        </ThemedView>
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
  box: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    gap: 15,
  },
  card: {
    width: '46%',
    aspectRatio: 180 / 250,
    resizeMode: 'contain'
  }
})
