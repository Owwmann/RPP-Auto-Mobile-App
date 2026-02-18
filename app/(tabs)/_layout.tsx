import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'dark'];
  return (
    <Tabs screenOptions={{
      tabBarActiveTintColor: colors.tint,
      tabBarInactiveTintColor: colors.tabIconDefault,
      tabBarStyle: { backgroundColor: '#000000', borderTopColor: '#2A2A2A', height: 62, paddingBottom: 8 },
      headerStyle: { backgroundColor: '#000000' },
      headerTintColor: colors.text,
    }}>
      <Tabs.Screen name="index" options={{ title: 'Home',
        tabBarIcon: ({ color, focused }) => <Ionicons name={focused ? 'home' : 'home-outline'} size={26} color={color} /> }} />
      <Tabs.Screen name="vehicles" options={{ title: 'Vehicles',
        tabBarIcon: ({ color, focused }) => <Ionicons name={focused ? 'car' : 'car-outline'} size={26} color={color} /> }} />
      <Tabs.Screen name="ai-assistant" options={{ title: 'AI',
        tabBarIcon: ({ color, focused }) => <Ionicons name={focused ? 'chatbubble' : 'chatbubble-outline'} size={26} color={color} /> }} />
      <Tabs.Screen name="settings" options={{ title: 'Settings',
        tabBarIcon: ({ color, focused }) => <Ionicons name={focused ? 'settings' : 'settings-outline'} size={26} color={color} /> }} />
    </Tabs>
  );
}
