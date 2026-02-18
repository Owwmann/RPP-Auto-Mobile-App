import { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, Pressable, ScrollView,
         KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

interface Message { id: string; text: string; isUser: boolean; }

export default function AIAssistantScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'dark'];
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', text: "Hello! I'm your AI mechanic. Ask me anything about your vehicle!", isUser: false }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<ScrollView>(null);
  useEffect(() => { scrollRef.current?.scrollToEnd({ animated: true }); }, [messages]);

  const send = async () => {
    if (!input.trim() || loading) return;
    const q = input;
    setMessages(p => [...p, { id: Date.now().toString(), text: q, isUser: true }]);
    setInput('');
    setLoading(true);
    try {
      const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.EXPO_PUBLIC_OPENROUTER_API_KEY}`,
          'HTTP-Referer': 'https://rppauto.com', 'X-Title': 'RPP Auto' },
        body: JSON.stringify({
          model: 'anthropic/claude-3-sonnet',
          messages: [
            { role: 'system', content: 'You are an expert automotive mechanic AI assistant for RPP Auto. Be concise and helpful.' },
            { role: 'user', content: q }
          ],
        }),
      });
      const data = await res.json();
      setMessages(p => [...p, { id: (Date.now()+1).toString(),
        text: data.choices?.[0]?.message?.content || 'No response received.', isUser: false }]);
    } catch {
      setMessages(p => [...p, { id: (Date.now()+1).toString(),
        text: 'Connection error. Check your internet and try again.', isUser: false }]);
    } finally { setLoading(false); }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: '#000000' }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={100}>
      <View style={{ padding: 16, paddingTop: 60, borderBottomWidth: 1, borderBottomColor: '#2A2A2A' }}>
        <Text style={{ color: colors.text, fontSize: 24, fontWeight: 'bold' }}>AI Mechanic</Text>
        <Text style={{ color: colors.tint, fontSize: 12 }}>Powered by Claude AI</Text>
      </View>
      <ScrollView ref={scrollRef} style={{ flex: 1, padding: 16 }}>
        {messages.map(m => (
          <View key={m.id} style={{
            maxWidth: '80%', padding: 12, borderRadius: 16, marginBottom: 10,
            alignSelf: m.isUser ? 'flex-end' : 'flex-start',
            backgroundColor: m.isUser ? colors.tint : '#1A1A1A',
            marginLeft: m.isUser ? '20%' : 0, marginRight: m.isUser ? 0 : '20%',
          }}>
            <Text style={{ color: m.isUser ? '#000000' : colors.text, fontSize: 15 }}>{m.text}</Text>
          </View>
        ))}
        {loading && (
          <View style={{ flexDirection: 'row', alignItems: 'center', padding: 12,
            backgroundColor: '#1A1A1A', borderRadius: 16, marginBottom: 10, alignSelf: 'flex-start' }}>
            <ActivityIndicator size="small" color={colors.tint} />
            <Text style={{ color: colors.text, marginLeft: 8 }}>AI is thinking...</Text>
          </View>
        )}
      </ScrollView>
      <View style={{ flexDirection: 'row', padding: 12, borderTopWidth: 1,
        borderTopColor: '#2A2A2A', backgroundColor: '#000000', alignItems: 'flex-end' }}>
        <TextInput style={{ flex: 1, maxHeight: 100, borderRadius: 20,
          paddingHorizontal: 16, paddingVertical: 10, marginRight: 10,
          backgroundColor: '#1A1A1A', color: colors.text, fontSize: 15 }}
          value={input} onChangeText={setInput}
          placeholder="Ask about your vehicle..." placeholderTextColor="#4A4A4A" multiline
          onSubmitEditing={send} />
        <Pressable style={({ pressed }) => ({
          width: 46, height: 46, borderRadius: 23, backgroundColor: colors.tint,
          alignItems: 'center', justifyContent: 'center', opacity: pressed ? 0.7 : 1 })}
          onPress={send} disabled={loading}>
          <Ionicons name="send" size={22} color="#000000" />
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}
