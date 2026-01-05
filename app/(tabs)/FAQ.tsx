import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../context/ThemeContext';

const faqData = [
  { question: 'How do I submit a complaint?', answer: 'Go to the Customer Complaints tab and fill out the form.' },
  { question: 'How can I change my password?', answer: 'Go to Settings > Security and change your password.' },
  { question: 'How do I view notifications?', answer: 'Go to the Notifications tab to see all updates.' },
];

export default function FAQ() {
  const { theme } = useTheme();
  const darkMode = theme === 'dark';

  return (
    <ScrollView style={[styles.container, { backgroundColor: darkMode ? '#111827' : '#F3F4F6' }]}>
      {faqData.map((item, idx) => (
        <View key={idx} style={[styles.card, { backgroundColor: darkMode ? '#1F2937' : '#fff' }]}>
          <Text style={[styles.question, { color: darkMode ? '#fff' : '#111827' }]}>{item.question}</Text>
          <Text style={[styles.answer, { color: darkMode ? '#D1D5DB' : '#6B7280' }]}>{item.answer}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  card: { padding: 16, borderRadius: 12, marginBottom: 12 },
  question: { fontSize: 16, fontWeight: '600', marginBottom: 8 },
  answer: { fontSize: 14 },
});
