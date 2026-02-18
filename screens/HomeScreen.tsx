
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Alert } from 'react-native';
// Try to import Expo Router, fallback to safe navigation if strictly React Native
// Assuming Expo Router based on diagnosis
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const router = useRouter();

  // Function to handle navigation safely
  const handleNav = (route) => {
    try {
      router.push(route);
    } catch (e) {
      Alert.alert("Navigation Error", "Ensure the route exists: " + route);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>RPP AUTO</Text>
        <Text style={styles.subtitle}>AI-Powered Diagnostics</Text>
      </View>

      <View style={styles.grid}>
        {/* SCAN VEHICLE - REAL ASSET & ONPRESS */}
        <TouchableOpacity style={styles.card} onPress={() => handleNav('/scan')}>
           {/* ENSURE A FILE NAMED scan.png IS IN assets/images/ */}
           <Image source={require('../../assets/images/scan.png')} style={styles.icon} />
           <Text style={styles.cardText}>Scan Vehicle</Text>
        </TouchableOpacity>

        {/* BOOK SERVICE - REAL ASSET & ONPRESS */}
        <TouchableOpacity style={styles.card} onPress={() => handleNav('/booking')}>
           {/* ENSURE A FILE NAMED book.png IS IN assets/images/ */}
           <Image source={require('../../assets/images/book.png')} style={styles.icon} />
           <Text style={styles.cardText}>Book Service</Text>
        </TouchableOpacity>

        {/* CHATBOT - REAL ASSET & ONPRESS */}
        <TouchableOpacity style={styles.card} onPress={() => handleNav('/chat')}>
           <Image source={require('../../assets/images/chat.png')} style={styles.icon} />
           <Text style={styles.cardText}>AI Assistant</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { padding: 20, alignItems: 'center', backgroundColor: '#28a745' }, // RPP GREEN
  title: { fontSize: 24, fontWeight: 'bold', color: '#fff' },
  subtitle: { fontSize: 16, color: '#e0e0e0' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', marginTop: 20 },
  card: { width: '40%', aspectRatio: 1, backgroundColor: '#f9f9f9', margin: 10, justifyContent: 'center', alignItems: 'center', borderRadius: 10, elevation: 3 },
  icon: { width: 60, height: 60, marginBottom: 10, resizeMode: 'contain' },
  cardText: { fontWeight: '600' }
});
