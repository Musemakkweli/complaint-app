import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    Dimensions,
    FlatList,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import API_URL from '../../constants/api';
import { useTheme } from '../../context/ThemeContext';
import { useUser } from '../../context/UserContext';

const { width } = Dimensions.get('window');
const cardWidth = (width - 60) / 2;

export default function DashboardHome() {
  const { theme } = useTheme();
  const darkMode = theme === 'dark';
  const router = useRouter();
  const { user } = useUser();

  /* -------------------- STATE -------------------- */
  const [stats, setStats] = useState({
    total: 0,
    assigned: 0,
    resolved: 0,
    pending: 0,
  });

  const [trendLabels, setTrendLabels] = useState<string[]>([]);
  const [complaintTrend, setComplaintTrend] = useState<number[]>([]);
  const [recentComplaints, setRecentComplaints] = useState<any[]>([]);

  /* -------------------- FETCH USER STATS -------------------- */
  useEffect(() => {
    if (!user?.id) return;

    fetch(`${API_URL}/complaints/stats/user/${user.id}`)
      .then(res => res.json())
      .then(data => {
        setStats({
          total: data.total_complaints ?? 0,
          assigned: data.assigned ?? 0,
          resolved: data.resolved ?? 0,
          pending: data.pending ?? 0,
        });
      })
      .catch(err => console.error('Stats error:', err));
  }, [user?.id]);

  /* -------------------- FETCH USER TREND -------------------- */
  useEffect(() => {
    if (!user?.id) return;

    fetch(`${API_URL}/complaints/trend/user/${user.id}`)
      .then(res => res.json())
      .then(data => {
        setTrendLabels(data.trend.map((t: any) => t.day));
        setComplaintTrend(data.trend.map((t: any) => t.count));
      })
      .catch(err => console.error('Trend error:', err));
  }, [user?.id]);

  /* -------------------- FETCH RECENT COMMON COMPLAINTS -------------------- */
  useEffect(() => {
    fetch(`${API_URL}/complaints/recent/common?limit=5`)
      .then(res => res.json())
      .then(data => {
        setRecentComplaints(
          data.recent_common_complaints.map((c: any) => ({
            id: c.id,
            user: c.user_name,
            type: c.title,
            status: c.status,
          }))
        );
      })
      .catch(err => console.error('Recent complaints error:', err));
  }, []);

  const openComplaints = (filter: string) => {
    router.push({ pathname: '/CustomerComplaints', params: { filter } });
  };

  const renderComplaint = ({ item }: any) => (
    <View style={[styles.tableRow, { backgroundColor: darkMode ? '#1F2937' : '#FFFFFF' }]}>
      <Text style={[styles.cell, { color: darkMode ? '#F9FAFB' : '#111827' }]}>{item.id}</Text>
      <Text style={[styles.cell, { color: darkMode ? '#F9FAFB' : '#111827' }]}>{item.user}</Text>
      <Text style={[styles.cell, { color: darkMode ? '#F9FAFB' : '#111827' }]}>{item.type}</Text>
      <Text
        style={[
          styles.cell,
          {
            color:
              item.status === 'Resolved'
                ? '#16A34A'
                : item.status === 'Pending'
                ? '#F59E0B'
                : '#2563EB',
          },
        ]}
      >
        {item.status}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: darkMode ? '#0B1220' : '#F3F4F6' }]}>
      <FlatList
        data={recentComplaints}
        keyExtractor={item => item.id}
        renderItem={renderComplaint}
        ListHeaderComponent={
          <View style={styles.container}>
            {/* HEADER */}
            <View style={styles.header}>
              <Text style={styles.orgText}>EUCL – Customer Complaints System</Text>
              <Text style={styles.dateText}>{new Date().toDateString()}</Text>
              <Text style={styles.welcomeText}>
                Welcome back, <Text style={styles.boldText}>{user?.full_name ?? 'User'}</Text>
              </Text>
            </View>

            {/* KPI CARDS */}
            <View style={styles.cardsContainer}>
              <View style={styles.row}>
                <StatCard title="Total" value={stats.total} icon="assignment" onPress={() => openComplaints('all')} />
                <StatCard title="Assigned" value={stats.assigned} icon="clipboard-list" onPress={() => openComplaints('assigned')} />
              </View>
              <View style={styles.row}>
                <StatCard title="Resolved" value={stats.resolved} icon="check" color="#16A34A" onPress={() => openComplaints('resolved')} />
                <StatCard title="Pending" value={stats.pending} icon="pending-actions" color="#F59E0B" onPress={() => openComplaints('pending')} />
              </View>
            </View>

            {/* TREND */}
            <Text style={[styles.sectionTitle, { color: darkMode ? '#E5E7EB' : '#111827' }]}>
              Complaint Trends (Last 7 Days)
            </Text>

            {complaintTrend.length > 0 && (
              <LineChart
                data={{ labels: trendLabels, datasets: [{ data: complaintTrend }] }}
                width={width - 36}
                height={180}
                chartConfig={{
                  backgroundGradientFrom: darkMode ? '#0B1220' : '#FFFFFF',
                  backgroundGradientTo: darkMode ? '#0B1220' : '#FFFFFF',
                  color: opacity => `rgba(37, 99, 235, ${opacity})`,
                  labelColor: opacity =>
                    darkMode
                      ? `rgba(229,231,235, ${opacity})`
                      : `rgba(17,24,39, ${opacity})`,
                }}
                style={{ borderRadius: 12 }}
              />
            )}

            <Text style={[styles.sectionTitle, { color: darkMode ? '#E5E7EB' : '#111827' }]}>
              Recent Common Complaints
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

/* -------------------- STAT CARD -------------------- */
function StatCard({ title, value, icon, onPress, color = '#2563EB' }: any) {
  return (
    <TouchableOpacity style={[styles.statCard, { borderLeftColor: color }]} onPress={onPress}>
      <Text style={styles.cardLabel}>{title}</Text>
      <Text style={styles.cardValue}>{value}</Text>
    </TouchableOpacity>
  );
}

/* -------------------- STYLES -------------------- */
const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { padding: 12 },
  header: { padding: 20, backgroundColor: '#0056B3', borderRadius: 16, marginBottom: 16 },
  orgText: { color: '#FFF', fontSize: 18, fontWeight: '700' },
  dateText: { color: '#D1D5DB', marginTop: 4 },
  welcomeText: { marginTop: 8, color: '#E5E7EB' },
  boldText: { fontWeight: '700' },

  cardsContainer: { marginBottom: 12 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  statCard: { width: cardWidth, backgroundColor: '#FFF', padding: 16, borderRadius: 12, borderLeftWidth: 4 },
  cardLabel: { color: '#6B7280', fontSize: 13 },
  cardValue: { fontSize: 26, fontWeight: '700' },

  sectionTitle: { fontSize: 16, fontWeight: '700', marginVertical: 10 },
  tableRow: { flexDirection: 'row', padding: 12, borderRadius: 8, marginBottom: 6 },
  cell: { flex: 1, fontSize: 13 },
});
