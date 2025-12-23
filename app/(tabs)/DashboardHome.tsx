import { Entypo, FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Dimensions, FlatList, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { useTheme } from '../../context/ThemeContext';
import { useUser } from '../../context/UserContext';

const { width } = Dimensions.get('window');
const cardWidth = (width - 60) / 2;

export default function DashboardHome() {
  const { theme } = useTheme();
  const darkMode = theme === 'dark';
  const router = useRouter();

  const { user } = useUser(); // ✅ Use logged-in user
  const userName = user ? user.full_name : 'ICT Support Officer';

  const stats = {
    total: 24,
    assigned: 10,
    resolved: 8,
    pending: 6,
  };

  const complaintTrend = [2, 4, 6, 3, 5, 7, 4]; // last 7 days

  const recentComplaints = [
    { id: 'C001', user: 'John Doe', type: 'Water', status: 'Resolved' },
    { id: 'C002', user: 'Jane Smith', type: 'Electricity', status: 'Pending' },
    { id: 'C003', user: 'Paul K.', type: 'Billing', status: 'Assigned' },
    { id: 'C004', user: 'Alice M.', type: 'Service', status: 'Resolved' },
  ];

  const openComplaints = (filter: string) => {
    router.push({
      pathname: '/(tabs)/CustomerComplaints',
      params: { filter },
    });
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: darkMode ? '#0B1220' : '#F3F4F6' }]}>
      <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
        <View style={styles.container}>

          {/* ===== Header Banner ===== */}
          <View
            style={[
              styles.header,
              {
                backgroundColor: '#0056B3', // EUCL blue
              },
            ]}
          >
            <Text style={styles.orgText}>EUCL – Customer Complaints System</Text>
            <Text style={styles.dateText}>{new Date().toDateString()}</Text>
            <Text style={styles.welcomeText}>
              Welcome back, <Text style={styles.boldText}>{userName}</Text>
            </Text>
          </View>

          {/* ===== KPI Cards ===== */}
          <View style={styles.cardsContainer}>
            <View style={styles.row}>
              <StatCard title="Total" value={stats.total} icon={<MaterialIcons name="assignment" size={20} color="#2563EB" />} onPress={() => openComplaints('all')} darkMode={darkMode} topColor="#2563EB" />
              <StatCard title="Assigned" value={stats.assigned} icon={<FontAwesome5 name="clipboard-list" size={18} color="#2563EB" />} onPress={() => openComplaints('assigned')} darkMode={darkMode} topColor="#2563EB" />
            </View>
            <View style={styles.row}>
              <StatCard title="Resolved" value={stats.resolved} icon={<Entypo name="check" size={20} color="#16A34A" />} onPress={() => openComplaints('resolved')} darkMode={darkMode} topColor="#16A34A" />
              <StatCard title="Pending" value={stats.pending} icon={<MaterialIcons name="pending-actions" size={20} color="#F59E0B" />} onPress={() => openComplaints('pending')} darkMode={darkMode} topColor="#F59E0B" />
            </View>
          </View>

          {/* ===== Trend Chart ===== */}
          <Text style={[styles.sectionTitle, { color: darkMode ? '#E5E7EB' : '#111827' }]}>
            Complaint Trends (Last 7 Days)
          </Text>
          <LineChart
            data={{
              labels: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
              datasets: [{ data: complaintTrend }],
            }}
            width={width - 36}
            height={180}
            chartConfig={{
              backgroundGradientFrom: darkMode ? '#0B1220' : '#FFFFFF',
              backgroundGradientTo: darkMode ? '#0B1220' : '#FFFFFF',
              color: (opacity = 1) => `rgba(37, 99, 235, ${opacity})`,
              labelColor: (opacity = 1) => darkMode ? `rgba(229,231,235, ${opacity})` : `rgba(17,24,39, ${opacity})`,
              propsForDots: { r: '4', strokeWidth: '2', stroke: '#2563EB' },
            }}
            style={{ marginVertical: 10, borderRadius: 12 }}
          />

          {/* ===== Recent Complaints Table ===== */}
          <Text style={[styles.sectionTitle, { color: darkMode ? '#E5E7EB' : '#111827' }]}>Recent Complaints</Text>
          <FlatList
            data={recentComplaints}
            keyExtractor={(item) => item.id}
            style={styles.table}
            renderItem={({ item }) => (
              <View style={[styles.tableRow, { backgroundColor: darkMode ? '#1F2937' : '#FFFFFF' }]}>
                <Text style={[styles.cell, { color: darkMode ? '#F9FAFB' : '#111827' }]}>{item.id}</Text>
                <Text style={[styles.cell, { color: darkMode ? '#F9FAFB' : '#111827' }]}>{item.user}</Text>
                <Text style={[styles.cell, { color: darkMode ? '#F9FAFB' : '#111827' }]}>{item.type}</Text>
                <Text style={[styles.cell, { color: item.status === 'Resolved' ? '#16A34A' : item.status === 'Pending' ? '#F59E0B' : '#2563EB' }]}>{item.status}</Text>
              </View>
            )}
          />

          <Text style={[styles.footerText, { color: darkMode ? '#9CA3AF' : '#6B7280' }]}>
            Data synchronized from EUCL complaint registry
          </Text>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

/* ===================== REUSABLE CARD ===================== */
function StatCard({ title, value, icon, onPress, darkMode, topColor }: any) {
  return (
    <TouchableOpacity
      style={[
        styles.statCard,
        {
          backgroundColor: darkMode ? '#1F2937' : '#FFFFFF',
          borderLeftColor: topColor,
          borderLeftWidth: 4,
          shadowColor: '#000',
          shadowOpacity: 0.1,
          shadowOffset: { width: 0, height: 2 },
          shadowRadius: 4,
        },
      ]}
      onPress={onPress}
    >
      <View style={styles.cardTop}>
        <Text style={[styles.cardLabel, { color: darkMode ? '#9CA3AF' : '#6B7280' }]}>{title}</Text>
        {icon}
      </View>
      <Text style={[styles.cardValue, { color: darkMode ? '#F9FAFB' : '#111827' }]}>{value}</Text>
    </TouchableOpacity>
  );
}

/* ===================== STYLES ===================== */
const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { flex: 1, paddingTop: 60, paddingHorizontal: 12 }, // moved down for status bar
  header: { padding: 20, borderBottomLeftRadius: 16, borderBottomRightRadius: 16, marginBottom: 16 },
  orgText: { fontSize: 18, fontWeight: '700', color: '#FFFFFF' },
  dateText: { fontSize: 13, color: '#D1D5DB', marginTop: 4 },
  welcomeText: { marginTop: 8, fontSize: 14, color: '#E5E7EB' },
  boldText: { fontWeight: '700' },
  cardsContainer: { marginBottom: 16 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  statCard: { width: cardWidth, borderRadius: 12, padding: 16 },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardLabel: { fontSize: 13 },
  cardValue: { fontSize: 28, fontWeight: '700', marginTop: 10 },
  sectionTitle: { fontSize: 16, fontWeight: '700', marginTop: 12, marginBottom: 6 },
  table: { marginBottom: 12 },
  tableRow: { flexDirection: 'row', padding: 12, borderRadius: 8, marginBottom: 6 },
  cell: { flex: 1, fontSize: 13 },
  footerText: { marginTop: 8, fontSize: 12, textAlign: 'center' },
});
