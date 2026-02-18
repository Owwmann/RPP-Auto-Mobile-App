
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ImageBackground, StyleSheet, StatusBar, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import Colors from '../constants/Colors';

// Try to use the asset, fallback to a color if image missing
const bgImage = require('../assets/splash.png');

export default function SignUpScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignUp = async () => {
    // REAL-TIME TOUCH REACTION
      Alert.alert('System Alert', 'Credentials required for access.');
      return;
    }
    // Simulate Backend Handshake
    console.log('Authenticating:', email);
    router.replace('/(tabs)');
  };

  return (
    <ImageBackground source={bgImage} style={styles.container} resizeMode='cover'>
      <StatusBar barStyle='light-content' />
      <View style={styles.overlay}>
        <Text style={styles.title}>RPP AUTO</Text>
        <Text style={styles.subtitle}>SYSTEMS ONLINE • v2.4.0</Text>
       
        <View style={styles.formContainer}>
          <Text style={styles.label}>AUTHENTICATION</Text>
          <TextInput
            style={styles.input}
            placeholder='USER ID / EMAIL'
            placeholderTextColor='#666'
            value={email}
            onChangeText={setEmail}
          />
          <TextInput
            style={styles.input}
            placeholder='PASSCODE'
            placeholderTextColor='#666'
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          <TouchableOpacity style={styles.button} onPress={handleSignUp} activeOpacity={0.7}>
            <Text style={styles.buttonText}>INITIALIZE SESSION</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.75)', justifyContent: 'center', padding: 20 },
  title: { fontSize: 32, fontWeight: 'bold', color: '#fff', textAlign: 'center', letterSpacing: 2 },
  subtitle: { fontSize: 12, color: '#39FF14', textAlign: 'center', marginBottom: 50, letterSpacing: 1 },
  formContainer: { width: '100%' },
  label: { color: '#fff', fontSize: 16, marginBottom: 10, fontWeight: 'bold' },
  input: {
    backgroundColor: '#111',
    borderWidth: 1,
    borderColor: '#333',
    color: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    fontSize: 16
  },
  button: {
    backgroundColor: '#39FF14',
    padding: 18,
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: '#39FF14',
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 5
  },
  buttonText: { color: '#000', fontWeight: '900', fontSize: 16, letterSpacing: 1 }
});
