import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { NavigationCard } from '@/components/navigation-card';

export default function HomeScreen() {

  const BASE_URL = '../../assets/images/logos';

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ThemedText style={styles.title}>Selecione o tipo de TCG</ThemedText>

        <ThemedView style={styles.box}>
          <NavigationCard
            href="/pokemon"
            imageSource={require(`${BASE_URL}/pokemon_logo.png`)}
          />

          <NavigationCard
            href="/profile"
            imageSource={require(`${BASE_URL}/yu_gi_oh_logo.png`)}
            disabled
          />

          <NavigationCard
            href="/profile"
            imageSource={require(`${BASE_URL}/chaotic_logo.png`)}
            disabled
          />
        </ThemedView>
      </SafeAreaView>
    </ThemedView>
  );
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
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 15,
  },
  title: {
    fontSize: 20,
    textAlign: 'center',
    fontWeight: 'bold',
    marginTop: 15
  }
});
