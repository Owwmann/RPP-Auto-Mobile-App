mport React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ImageBackground } from 'react-native';

export default function SignUpScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <ImageBackground
      source={require('../assets/images/splash.png')} // Uses your Cyberpunk background
      style={styles.background}
      imageStyle={{ opacity: 0.3 }} // Dims the car so text is readable
    >
      <View style={styles.container}>
        <Text style={styles.header}>RPP AUTO</Text>
        <Text style={styles.subHeader}>SYSTEMS ONLINE • v2.4.0</Text>

        <Text style={styles.label}>Authentication</Text>
       
        <TextInput
          style={styles.input}
          placeholder="USER ID / EMAIL"
          placeholderTextColor="#888"
          value={email}
          onChangeText={setEmail}
        />
       
        <TextInput
          style={styles.input}
          placeholder="PASSCODE"
          placeholderTextColor="#888"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>INITIALIZE SESSION</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1, backgroundColor: '#000' },
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  header: { fontSize: 40, color: '#fff', fontWeight: 'bold', textAlign: 'center', marginBottom: 10 },
  subHeader: { fontSize: 14, color: '#39FF14', textAlign: 'center', marginBottom: 50, letterSpacing: 2 },
  label: { color: '#fff', fontSize: 20, marginBottom: 20, fontWeight: 'bold' },
  input: {
    backgroundColor: '#111',
    borderWidth: 1,
    borderColor: '#333',
    color: '#fff',
    padding: 15,
    borderRadius: 5,
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#39FF14', // THE NEON GREEN BUTTON
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 16,
    letterSpacing: 1,
  }
});