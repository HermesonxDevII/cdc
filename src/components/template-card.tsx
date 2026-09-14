import { Link } from 'expo-router';
import { Image, TouchableOpacity, StyleSheet, ImageSourcePropType, View } from 'react-native';

interface TemplateCardProps {
  href: string;
  imageSource: ImageSourcePropType;
  disabled?: boolean;
}

export function TemplateCard({ href, imageSource, disabled }: TemplateCardProps) {
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
    width: '46%',
    aspectRatio: 180 / 250,
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
    width: '100%',
    height: '100%',
    resizeMode: 'contain'
  }
});
