import { StyleSheet, ScrollView, View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'dark'];
  const actions = [
    { icon: 'add-circle', label: 'Add Vehicle' },
    { icon: 'scan',       label: 'Scan OBD2'  },
    { icon: 'calendar',   label: 'Book Service'},
    { icon: 'analytics',  label: 'Diagnostics' },
  ];
  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#000000' }}>
      <View style={{ padding: 24, paddingTop: 60, backgroundColor: '#000000' }}>
        <Text style={{ color: colors.text, fontSize: 30, fontWeight: 'bold' }}>Welcome back!</Text>
        <Text style={{ color: colors.tint, fontSize: 16, marginTop: 4 }}>RPP Auto v2.0</Text>
      </View>
      <View style={styles.grid}>
        {actions.map((a, i) => (
          <Pressable key={i}
            style={({ pressed }) => [styles.card,
              { borderColor: colors.tint, opacity: pressed ? 0.6 : 1, transform: [{ scale: pressed ? 0.95 : 1 }] }]}
            onPress={() => console.log('Action:', a.label)}>
            <Ionicons name={a.icon as any} size={48} color={colors.tint} />
            <Text style={{ color: colors.text, marginTop: 10, fontWeight: '600', fontSize: 14 }}>{a.label}</Text>
          </Pressable>
        ))}
      </View>
      <View style={{ padding: 20 }}>
        <Text style={{ color: colors.text, fontSize: 18, fontWeight: 'bold', marginBottom: 12 }}>Recent Activity</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', padding: 14,
          backgroundColor: '#1A1A1A', borderRadius: 12, borderWidth: 1, borderColor: '#2A2A2A' }}>
          <Ionicons name="checkmark-circle" size={24} color={colors.tint} />
          <View style={{ marginLeft: 12 }}>
            <Text style={{ color: colors.text, fontSize: 15, fontWeight: '600' }}>System Check Complete</Text>
            <Text style={{ color: '#9BA1A6', fontSize: 12 }}>Ready to use</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', padding: 12, justifyContent: 'space-between' },
  card: { width: '48%', aspectRatio: 1, borderWidth: 2, borderRadius: 16,
    alignItems: 'center', justifyContent: 'center', marginBottom: 12, backgroundColor: 'rgba(0,255,0,0.03)' },
});
