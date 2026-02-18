/**
* RPP AUTO Root Layout
* CRITICAL: Supabase imported FIRST before any screen loads
*/
import '../lib/supabase';
import { useEffect } from 'react';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useEffect(() => {
    console.log('[RPP Auto] App initialized successfully');
    const t = setTimeout(() => SplashScreen.hideAsync(), 1500);
    return () => clearTimeout(t);
  }, []);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}
