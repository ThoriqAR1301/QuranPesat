import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    'Poppins-Regular': require('@/assets/fonts/Poppins-Regular.ttf'),
    'Poppins-Medium': require('@/assets/fonts/Poppins-Medium.ttf'),
    'Poppins-SemiBold': require('@/assets/fonts/Poppins-SemiBold.ttf'),
    'Poppins-Bold': require('@/assets/fonts/Poppins-Bold.ttf'),
    'NotoNaskhArabic': require('@/assets/fonts/arabic/NotoNaskhArabic-VariableFont_wght.ttf'),
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <>
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="surah/[id]"
          options={{
            headerShown: true,
            headerStyle: { backgroundColor: '#1B4332' },
            headerTintColor: '#FFFFFF',
            headerTitleStyle: { fontFamily: 'Poppins-SemiBold' },
          }}
        />
        <Stack.Screen
          name="menu/doa"
          options={{
            headerShown: true,
            headerStyle: { backgroundColor: '#1B4332' },
            headerTintColor: '#FFFFFF',
            title: 'Doa Harian',
          }}
        />
        <Stack.Screen
          name="menu/dzikir"
          options={{
            headerShown: true,
            headerStyle: { backgroundColor: '#1B4332' },
            headerTintColor: '#FFFFFF',
            title: 'Dzikir',
          }}
        />
        <Stack.Screen
          name="menu/hadits"
          options={{
            headerShown: true,
            headerStyle: { backgroundColor: '#1B4332' },
            headerTintColor: '#FFFFFF',
            title: 'Hadits',
          }}
        />
        <Stack.Screen
          name="menu/asmaul-husna"
          options={{
            headerShown: true,
            headerStyle: { backgroundColor: '#1B4332' },
            headerTintColor: '#FFFFFF',
            title: 'Asmaul Husna',
          }}
        />
        <Stack.Screen
          name="menu/arah-kiblat"
          options={{
            headerShown: true,
            headerStyle: { backgroundColor: '#1B4332' },
            headerTintColor: '#FFFFFF',
            title: 'Arah Kiblat',
          }}
        />
        <Stack.Screen
          name="menu/donasi"
          options={{
            headerShown: true,
            headerStyle: { backgroundColor: '#1B4332' },
            headerTintColor: '#FFFFFF',
            title: 'Donasi',
          }}
        />
      </Stack>
    </>
  );
}