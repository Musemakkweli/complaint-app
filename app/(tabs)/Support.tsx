import { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { useUser } from '../../context/UserContext';

export default function Support() {
  const { theme } = useTheme();
  const darkMode = theme === 'dark';
  const { user } = useUser();

  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = () => {
    if (!subject || !message) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    // For now, just show alert
    Alert.alert('Support Request Sent', `Subject: ${subject}\nMessage: ${message}`);

    // Clear fields
    setSubject('');
    setMessage('');
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: darkMode ? '#111827' : '#F3F4F6' }]}>
      <Text style={[styles.title, { color: darkMode ? '#fff' : '#111827' }]}>Contact Support</Text>

      <Text style={[styles.label, { color: darkMode ? '#D1D5DB' : '#6B7280' }]}>Subject</Text>
      <TextInput
        value={subject}
        onChangeText={setSubject}
        style={[styles.input, { backgroundColor: darkMode ? '#1F2937' : '#fff', color: darkMode ? '#fff' : '#111827' }]}
      />

      <Text style={[styles.label, { color: darkMode ? '#D1D5DB' : '#6B7280' }]}>Message</Text>
      <TextInput
        value={message}
        onChangeText={setMessage}
        multiline
        numberOfLines={5}
        style={[styles.input, { backgroundColor: darkMode ? '#1F2937' : '#fff', color: darkMode ? '#fff' : '#111827', textAlignVertical: 'top' }]}
      />

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Send</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 24 },
  label: { fontSize: 14, marginBottom: 8 },
  input: { borderRadius: 8, padding: 12, fontSize: 16, marginBottom: 16 },
  button: { backgroundColor: '#0EA5E9', paddingVertical: 12, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});
