import { DarkTheme, DefaultTheme, ThemeProvider, Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useColorScheme } from 'react-native';
import { useFonts } from 'expo-font';
import { useEffect } from 'react';

import { AnimatedSplashOverlay } from '@/components/animated-icon';

SplashScreen.preventAutoHideAsync();

export default function TabLayout() {
  const BASE_URL = '../../assets/fonts';

  const colorScheme = useColorScheme();

  const [loaded, error] = useFonts({
    'GillSans-Bold-Italic': require(`${BASE_URL}/Gill_Sans_Bold_Italic.ttf`),
    'GillSans-Bold': require(`${BASE_URL}/gill_sans_condensed_bold.ttf`),
    'GillSans': require(`${BASE_URL}/gill_sans.ttf`),
    'Revue': require(`${BASE_URL}/Revue.ttf`),
    'Futura-Heavy': require(`${BASE_URL}/Futura_Heavy.ttf`),
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AnimatedSplashOverlay />
      <Stack screenOptions={{ headerShown: false }} />
    </ThemeProvider>
  );
}
