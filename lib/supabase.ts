import { createClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';

const getUrl = (): string => {
  const env = process.env.EXPO_PUBLIC_SUPABASE_URL;
  if (env && env.startsWith('https://')) return e

export default function RootLayout() {
  useEffect(() => {
    console.log('[RPP Auto] App started - Supabase loaded');
    const t = setTimeout(() => SplashScreen.hideAsync(), 1500);
    return () => clearTimeout(t);
  }, []);
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}
