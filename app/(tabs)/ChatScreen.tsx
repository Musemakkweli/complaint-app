import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { io, Socket } from 'socket.io-client';
import API_URL from '../../constants/api';

export default function ChatScreen() {
  const router = useRouter();
  const { complaintId } = useLocalSearchParams<{ complaintId: string }>();
  const [messages, setMessages] = useState<{ text: string; sender: string }[]>([]);
  const [input, setInput] = useState('');
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const s = io(API_URL); // use centralized backend URL
    setSocket(s);

    s.emit('joinRoom', complaintId);

    s.on('message', (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      s.disconnect();
    };
  }, [complaintId]);

  const sendMessage = () => {
    if (!input.trim() || !socket) return;
    const msg = { complaintId, text: input, sender: 'user' };
    socket.emit('message', msg);
    setMessages((prev) => [...prev, msg]); // show instantly
    setInput('');
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backButtonText}>← Back</Text>
      </TouchableOpacity>

      <FlatList
        data={messages}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.messageBubble}>
            <Text>{item.sender}: {item.text}</Text>
          </View>
        )}
        style={{ flex: 1, marginVertical: 8 }}
      />

      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Type a message..."
          value={input}
          onChangeText={setInput}
          style={styles.input}
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Text style={{ color: '#fff' }}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  backButton: {
    marginTop: 16,
    marginBottom: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
    alignSelf: 'flex-start',
  },
  backButtonText: { color: '#0EA5E9', fontSize: 16, fontWeight: '500' },
  messageBubble: { padding: 8, backgroundColor: '#E5E7EB', borderRadius: 6, marginBottom: 6 },
  inputContainer: { flexDirection: 'row', alignItems: 'center' },
  input: { flex: 1, borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 6, padding: 8 },
  sendButton: { marginLeft: 8, padding: 10, backgroundColor: '#0EA5E9', borderRadius: 6 },
});
