import { Image, StyleSheet, Platform, View, Text } from 'react-native';
import { Colors } from '@/constants/Colors';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      {/* This loads your Cyberpunk Car Image */}
      <Image
        source={require('../../assets/splash.png')}
        style={styles.carImage}
        resizeMode="contain"
      />
     
      <Text style={styles.statusText}>NO VEHICLE SELECTED</Text>
     
      <View style={styles.actionContainer}>
         <Text style={styles.subText}>Connect OBD2 Scanner to Initialize</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', alignItems: 'center', justifyContent: 'center' },
  carImage: { width: 300, height: 300, marginBottom: 20, tintColor: '#00FF00' }, // Adds green tint to image
  statusText: { color: '#fff', fontSize: 24, fontWeight: 'bold', letterSpacing: 1 },
  subText: { color: '#888', marginTop: 10 },
  actionContainer: { marginTop: 30, padding: 20, borderWidth: 1, borderColor: '#333', borderRadius: 10 }
});