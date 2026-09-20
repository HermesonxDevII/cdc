import { useRouter } from 'expo-router';
import { Image, TouchableOpacity, StyleSheet } from 'react-native';
import { ThemedView } from '@/components/themed-view';

interface BackProps {
  href: string;
  onPress?: () => void;
}

export function Back({ href, onPress }: BackProps) {
  const router = useRouter();

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      router.push(href as any);
    }
  };

  return (
    <ThemedView style={styles.box}>
      <TouchableOpacity style={styles.card} onPress={handlePress}>
        <Image
          source={require('../../assets/images/icons/chevron-left.png')}
          style={styles.logo}
        />
      </TouchableOpacity>
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
