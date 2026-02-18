import { View, Text, ScrollView, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function SettingsScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'dark'];
  const items = [
    { icon: 'person-outline',        label: 'Account',        sub: 'Louis Gray' },
    { icon: 'notifications-outline', label: 'Notifications',  sub: 'All alerts on' },
    { icon: 'bluetooth-outline',     label: 'OBD2 Devices',   sub: 'No device paired' },
    { icon: 'moon-outline',          label: 'Dark Mode',      sub: 'Enabled' },
    { icon: 'shield-outline',        label: 'Privacy',        sub: 'Data settings' },
    { icon: 'help-circle-outline',   label: 'Help & Support', sub: 'Get assistance' },
    { icon: 'information-circle-outline', label: 'About RPP Auto', sub: 'v2.0.1' },
  ];
  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#000000' }}>
      <View style={{ padding: 24, paddingTop: 60 }}>
        <Text style={{ color: colors.text, fontSize: 30, fontWeight: 'bold' }}>Settings</Text>
      </View>
      {items.map((item, i) => (
        <Pressable key={i} style={({ pressed }) => ({
          flexDirection: 'row', alignItems: 'center', padding: 16,
          marginHorizontal: 16, marginVertical: 4,
          backgroundColor: '#1A1A1A', borderRadius: 12,
          borderWidth: 1, borderColor: '#2A2A2A', opacity: pressed ? 0.7 : 1 })}
          onPress={() => console.log('Settings:', item.label)}>
          <Ionicons name={item.icon as any} size={22} color={colors.tint} />
          <View style={{ flex: 1, marginLeft: 14 }}>
            <Text style={{ color: colors.text, fontSize: 16, fontWeight: '500' }}>{item.label}</Text>
            <Text style={{ color: '#9BA1A6', fontSize: 12, marginTop: 2 }}>{item.sub}</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#4A4A4A" />
        </Pressable>
      ))}
    </ScrollView>
  );
}
