import { View, Text, Pressable, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function VehiclesScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'dark'];
  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#000000' }}>
      <View style={{ padding: 24, paddingTop: 60 }}>
        <Text style={{ color: colors.text, fontSize: 30, fontWeight: 'bold' }}>My Vehicles</Text>
        <Text style={{ color: '#9BA1A6', fontSize: 14, marginTop: 4 }}>Manage your fleet</Text>
      </View>
      <View style={{ alignItems: 'center', paddingVertical: 60 }}>
        <Ionicons name="car-sport" size={80} color={colors.tint} />
        <Text style={{ color: colors.text, fontSize: 20, fontWeight: 'bold', marginTop: 20 }}>No vehicles yet</Text>
        <Text style={{ color: '#9BA1A6', fontSize: 14, marginTop: 8, marginBottom: 30 }}>Add your first vehicle to get started</Text>
        <Pressable style={({ pressed }) => ({
          backgroundColor: colors.tint, paddingVertical: 14, paddingHorizontal: 32,
          borderRadius: 10, opacity: pressed ? 0.7 : 1 })}
          onPress={() => console.log('Add Vehicle')}>
          <Text style={{ color: '#000000', fontSize: 16, fontWeight: 'bold' }}>+ Add Vehicle</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}
