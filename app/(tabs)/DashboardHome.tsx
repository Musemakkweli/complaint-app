import { Entypo, FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../context/ThemeContext';

const { width } = Dimensions.get('window');
const cardWidth = (width - 60) / 2; // two cards per row with spacing

export default function DashboardHome() {
  const { theme } = useTheme();
  const darkMode = theme === 'dark';
  const router = useRouter();

  // Function to navigate with filter type
  const openComplaints = (filter: string) => {
    router.push({
      pathname: '/(tabs)/CustomerComplaints',
      params: { filter }, // we will read this in CustomerComplaints.tsx
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: darkMode ? '#111827' : '#F3F4F6' }]}>
      {/* Hero Banner */}
      <View style={[styles.hero, { backgroundColor: '#0EA5E9' }]}>
        <Text style={[styles.welcomeText, { color: '#fff' }]}>Welcome, User!</Text>
        <Text style={[styles.heroTitle, { color: '#fff' }]}>Manage Your Complaints Efficiently</Text>
        <Text style={[styles.heroSubtitle, { color: '#e0f2fe' }]}>
          Track, assign, and resolve issues quickly.
        </Text>
      </View>

      {/* Complaint Cards */}
      <View style={styles.cardsContainer}>
        <View style={styles.row}>
          <TouchableOpacity
            style={[styles.card, { width: cardWidth, backgroundColor: darkMode ? '#1F2937' : '#fff', borderColor: '#0EA5E9' }]}
            onPress={() => openComplaints('all')}
          >
            <MaterialIcons name="assignment" size={40} color="#0EA5E9" />
            <Text style={[styles.cardTitle, { color: darkMode ? '#E5E7EB' : '#333' }]}>Total Complaints</Text>
            <Text style={[styles.cardNumber, { color: '#0EA5E9' }]}>24</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.card, { width: cardWidth, backgroundColor: darkMode ? '#1F2937' : '#fff', borderColor: '#0EA5E9' }]}
            onPress={() => openComplaints('assigned')}
          >
            <FontAwesome5 name="clipboard-list" size={40} color="#0EA5E9" />
            <Text style={[styles.cardTitle, { color: darkMode ? '#E5E7EB' : '#333' }]}>Assigned</Text>
            <Text style={[styles.cardNumber, { color: '#0EA5E9' }]}>10</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.row}>
          <TouchableOpacity
            style={[styles.card, { width: cardWidth, backgroundColor: darkMode ? '#1F2937' : '#fff', borderColor: '#0EA5E9' }]}
            onPress={() => openComplaints('resolved')}
          >
            <Entypo name="check" size={40} color="#0EA5E9" />
            <Text style={[styles.cardTitle, { color: darkMode ? '#E5E7EB' : '#333' }]}>Resolved</Text>
            <Text style={[styles.cardNumber, { color: '#0EA5E9' }]}>8</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.card, { width: cardWidth, backgroundColor: darkMode ? '#1F2937' : '#fff', borderColor: '#0EA5E9' }]}
            onPress={() => openComplaints('pending')}
          >
            <MaterialIcons name="pending-actions" size={40} color="#0EA5E9" />
            <Text style={[styles.cardTitle, { color: darkMode ? '#E5E7EB' : '#333' }]}>Pending</Text>
            <Text style={[styles.cardNumber, { color: '#0EA5E9' }]}>6</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  hero: {
    height: 170,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    padding: 20,
    justifyContent: 'center',
    overflow: 'hidden',
  },
  welcomeText: { fontSize: 17, marginBottom: 5 },
  heroTitle: { fontSize: 24, fontWeight: 'bold' },
  heroSubtitle: { fontSize: 15, marginTop: 5 },
  cardsContainer: { padding: 20 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 18 },
  card: { borderWidth: 2, borderRadius: 15, paddingVertical: 25, paddingHorizontal: 10, alignItems: 'center', minHeight: 160 },
  cardTitle: { fontSize: 16, marginTop: 12, fontWeight: '600', textAlign: 'center' },
  cardNumber: { fontSize: 28, fontWeight: 'bold', marginTop: 8 },
});
