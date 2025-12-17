import { Entypo, FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';

const { width } = Dimensions.get('window');
const cardWidth = (width - 60) / 2; // two cards per row with spacing

export default function DashboardHome() {
  return (
    <View style={styles.container}>
      {/* Hero Banner */}
      <View style={styles.hero}>
        <Text style={styles.welcomeText}>Welcome, User!</Text>
        <Text style={styles.heroTitle}>Manage Your Complaints Efficiently</Text>
        <Text style={styles.heroSubtitle}>
          Track, assign, and resolve issues quickly.
        </Text>
      </View>

      {/* Complaint Cards */}
      <View style={styles.cardsContainer}>
        <View style={styles.row}>
          <View style={[styles.card, { width: cardWidth }]}>
            <MaterialIcons name="assignment" size={40} color="#0EA5E9" />
            <Text style={styles.cardTitle}>Total Complaints</Text>
            <Text style={styles.cardNumber}>24</Text>
          </View>

          <View style={[styles.card, { width: cardWidth }]}>
            <FontAwesome5 name="clipboard-list" size={40} color="#0EA5E9" />
            <Text style={styles.cardTitle}>Assigned</Text>
            <Text style={styles.cardNumber}>10</Text>
          </View>
        </View>

        <View style={styles.row}>
          <View style={[styles.card, { width: cardWidth }]}>
            <Entypo name="check" size={40} color="#0EA5E9" />
            <Text style={styles.cardTitle}>Resolved</Text>
            <Text style={styles.cardNumber}>8</Text>
          </View>

          <View style={[styles.card, { width: cardWidth }]}>
            <MaterialIcons name="pending-actions" size={40} color="#0EA5E9" />
            <Text style={styles.cardTitle}>Pending</Text>
            <Text style={styles.cardNumber}>6</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  hero: {
    height: 170, // slightly taller hero
    backgroundColor: '#0EA5E9',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    padding: 20,
    justifyContent: 'center',
    overflow: 'hidden',
  },
  welcomeText: {
    color: '#fff',
    fontSize: 17,
    marginBottom: 5,
  },
  heroTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  heroSubtitle: {
    color: '#e0f2fe',
    fontSize: 15,
    marginTop: 5,
  },
  cardsContainer: {
    padding: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  card: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#0EA5E9',
    borderRadius: 15,
    paddingVertical: 25,
    paddingHorizontal: 10,
    alignItems: 'center',
    minHeight: 160, // increased height
  },
  cardTitle: {
    fontSize: 16,
    marginTop: 12,
    color: '#333',
    fontWeight: '600',
    textAlign: 'center',
  },
  cardNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 8,
    color: '#0EA5E9',
  },
});
