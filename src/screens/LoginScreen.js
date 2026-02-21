import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, SafeAreaView, StatusBar, Pressable, KeyboardAvoidingView, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS } from '../constants/theme';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1, padding: 24, justifyContent: 'center' }}>
       
        <View style={styles.logoContainer}>
          <View style={styles.chipIcon}>
            <Icon name="chip" size={50} color={COLORS.primary} />
          </View>
          <Text style={styles.appTitle}>RPP AUTO</Text>
          <Text style={styles.status}>SYSTEMS ONLINE • v2.4.0</Text>
        </View>

        <Text style={styles.header}>Authentication</Text>
        <Text style={styles.subHeader}>Enter your credentials to access diagnostics.</Text>

        <View style={styles.inputContainer}>
          <Icon name="account-outline" size={20} color={COLORS.textDim} style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="name@example.com"
            placeholderTextColor="#444"
            value={email}
            onChangeText={setEmail}
          />
        </View>

        <View style={styles.inputContainer}>
          <Icon name="lock-outline" size={20} color={COLORS.textDim} style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="••••••••"
            placeholderTextColor="#444"
            secureTextEntry={!showPass}
            value={password}
            onChangeText={setPassword}
          />
          <Pressable onPress={() => setShowPass(!showPass)}>
            <Icon name={showPass ? "eye-off" : "eye"} size={20} color={COLORS.textDim} />
          </Pressable>
        </View>

        <Pressable style={styles.recover}>
          <Text style={{color: COLORS.secondary}}>Recover Access</Text>
        </Pressable>

        <Pressable
          style={({pressed}) => [styles.btn, pressed && {opacity: 0.8}]}
          onPress={() => navigation.replace('MainApp')}
        >
          <Text style={styles.btnText}>INITIALIZE SESSION</Text>
          <Icon name="arrow-right" size={20} color="black" />
        </Pressable>

      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  logoContainer: { alignItems: 'center', marginBottom: 40 },
  chipIcon: { width: 80, height: 80, borderRadius: 40, borderWidth: 1, borderColor: '#333', alignItems: 'center', justifyContent: 'center', marginBottom: 10, borderStyle: 'dashed' },
  appTitle: { color: COLORS.text, fontSize: 28, fontWeight: 'bold' },
  status: { color: COLORS.primary, fontSize: 12, letterSpacing: 2, marginTop: 5 },
  header: { color: COLORS.text, fontSize: 24, fontWeight: 'bold', marginBottom: 5 },
  subHeader: { color: COLORS.textDim, marginBottom: 30 },
  inputContainer: { flexDirection: 'row', backgroundColor: COLORS.card, borderRadius: 8, padding: 15, marginBottom: 15, borderWidth: 1, borderColor: COLORS.border, alignItems: 'center' },
  icon: { marginRight: 10 },
  input: { flex: 1, color: COLORS.text, fontSize: 16 },
  recover: { alignSelf: 'flex-end', marginBottom: 30 },
  btn: { backgroundColor: COLORS.primary, padding: 18, borderRadius: 8, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  btnText: { color: 'black', fontWeight: 'bold', fontSize: 16, marginRight: 10 }
});
