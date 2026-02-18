import { View, Text, TextInput, TouchableOpacity, StyleSheet, ImageBackground, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';

// Make sure your splash.png is actually in the root assets folder!
const bgImage = require('../assets/splash.png');

export default function SignUpScreen() {
  const router = useRouter();

  return (
    <ImageBackground source={bgImage} style={styles.background} resizeMode="cover">
      <StatusBar barStyle="light-content" />
      <View style={styles.overlay}>
        <Text style={styles.title}>AUTHENTICATION</Text>
       
        <TextInput
          style={styles.input}
          placeholder="Email / User ID"
          placeholderTextColor="#888"
        />
        <TextInput
          style={styles.input}
          placeholder="Passcode"
          placeholderTextColor="#888"
          secureTextEntry
        />

        {/* NEON GREEN BUTTON */}
        <TouchableOpacity style={styles.button} onPress={() => router.replace('/(tabs)')}>
          <Text style={styles.buttonText}>INITIALIZE SESSION</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1, justifyContent: 'center' },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', padding: 20 },
  title: { fontSize: 28, color: '#00FF00', fontWeight: 'bold', marginBottom: 40, textAlign: 'center', letterSpacing: 2 },
  input: { backgroundColor: '#111', color: '#fff', padding: 15, borderRadius: 5, marginBottom: 15, borderColor: '#333', borderWidth: 1 },
  button: { backgroundColor: '#00FF00', padding: 15, borderRadius: 5, alignItems: 'center', marginTop: 10 },
  buttonText: { color: '#000', fontWeight: '900', fontSize: 16, letterSpacing: 1 },
});