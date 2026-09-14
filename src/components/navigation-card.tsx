import { Link } from 'expo-router';
import { Image, TouchableOpacity, StyleSheet, ImageSourcePropType, View } from 'react-native';

interface NavigationCardProps {
  href: string;
  imageSource: ImageSourcePropType;
  disabled?: boolean;
}

export function NavigationCard({ href, imageSource, disabled }: NavigationCardProps) {
  return (
    <Link href={href as any} asChild>
      <TouchableOpacity style={styles.card} disabled={disabled}>
        <Image source={imageSource} style={styles.logo} />
        
        {disabled && <View style={styles.overlay} />}
      </TouchableOpacity>
    </Link>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '95%',
    height: 80,
    backgroundColor: '#7C3AED',
    borderRadius: 8,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden'
  },
  overlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  logo: {
    resizeMode: 'contain'
  }
});
