import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { Colors } from '@/constants/Colors';

export default function AIAssistant() {
  const [messages, setMessages] = useState([{ id: '1', text: 'SYSTEM READY. AWAITING INPUT.', sender: 'bot' }]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg = { id: Date.now().toString(), text: input, sender: 'user' };
    setMessages((prev) => [...prev, userMsg]);
   
    // Simulate Smart Response
    setTimeout(() => {
      const botMsg = { id: (Date.now() + 1).toString(), text: `ANALYZING: "${input}"... \n\nDIAGNOSTIC: No faults detected in syntax.`, sender: 'bot' };
      setMessages((prev) => [...prev, botMsg]);
    }, 1000);
   
    setInput('');
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={[styles.msgBubble, item.sender === 'user' ? styles.userMsg : styles.botMsg]}>
            <Text style={styles.msgText}>{item.text}</Text>
          </View>
        )}
        contentContainerStyle={{ padding: 20 }}
      />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="Enter Command..."
          placeholderTextColor="#555"
        />
        <TouchableOpacity onPress={handleSend}>
          <Text style={styles.sendBtn}>RUN</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  msgBubble: { padding: 10, borderRadius: 8, marginBottom: 10, maxWidth: '80%' },
  userMsg: { alignSelf: 'flex-end', backgroundColor: '#333' },
  botMsg: { alignSelf: 'flex-start', borderLeftWidth: 2, borderLeftColor: '#00FF00', paddingLeft: 10 },
  msgText: { color: '#00FF00', fontFamily: 'Courier' }, // Monospace font for hacker feel
  inputContainer: { flexDirection: 'row', padding: 15, borderTopWidth: 1, borderTopColor: '#333' },
  input: { flex: 1, color: '#00FF00', backgroundColor: '#111', borderRadius: 5, padding: 10 },
  sendBtn: { color: '#00FF00', fontWeight: 'bold', marginLeft: 15, alignSelf: 'center' }
});