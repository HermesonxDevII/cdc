import { Link } from 'expo-router';
import { Image, TouchableOpacity, StyleSheet } from 'react-native';
import { ThemedView } from '@/components/themed-view';

interface BackProps {
  href: string;
}

export function Back({ href }: BackProps) {
  return (
    <ThemedView style={styles.box}>
      <Link href={href as any} asChild>
        <TouchableOpacity style={styles.card}>
          <Image
            source={require('../../assets/images/icons/chevron-left.png')}
            style={styles.logo}
          />
        </TouchableOpacity>
      </Link>
    </ThemedView>
  )
}

const styles = StyleSheet.create({
  box: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start'
  },
  card: {
    width: 40,
    height: 40,
    backgroundColor: '#7C3AED',
    borderRadius: 20,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    marginTop: 15
  },
  logo: {
    resizeMode: 'contain'
  }
});
