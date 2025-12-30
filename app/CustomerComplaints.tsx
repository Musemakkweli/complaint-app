import { useSearchParams } from 'expo-router/build/hooks';
import { useEffect, useState } from 'react';
import { FlatList, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import API_URL from '../constants/api'; // Adjust path if needed
import { useUser } from '../context/UserContext'; // Adjust path if needed

export default function CustomerComplaints() {
  const { user } = useUser();
  const params = useSearchParams();
  const filter = params.get('filter') ?? 'all';
  const [complaints, setComplaints] = useState<any[]>([]);

  useEffect(() => {
    if (!user?.id) return;

    fetch(`${API_URL}/complaints/user/${user.id}`)
      .then(res => res.json())
      .then(data => {
        // Apply filter if it's not "all"
        let filtered = data;
        if (filter && filter !== 'all') {
          filtered = data.filter(
            (c: any) => c.status.toLowerCase() === filter.toLowerCase()
          );
        }

        // Add sequential IDs for display
        setComplaints(
          filtered.map((c: any, index: number) => ({
            id: (index + 1).toString(),
            title: c.title,
            status: c.status,
            created_at: c.created_at,
          }))
        );
      })
      .catch(err => console.error('Fetch complaints error:', err));
  }, [user?.id, filter]);

  const renderComplaint = ({ item }: any) => (
    <View style={styles.tableRow}>
      <Text style={styles.cell}>{item.id}</Text>
      <Text style={styles.cell}>{item.title}</Text>
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
      <Text style={styles.cell}>
        {item.created_at ? new Date(item.created_at).toLocaleDateString() : '-'}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Complaints ({filter})</Text>

      {/* Table Header */}
      <View style={[styles.tableRow, styles.tableHeader]}>
        <Text style={styles.cell}>ID</Text>
        <Text style={styles.cell}>Complaint</Text>
        <Text style={styles.cell}>Status</Text>
        <Text style={styles.cell}>Date</Text>
      </View>

      <FlatList
        data={complaints}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderComplaint}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#F3F4F6' },
  title: { fontSize: 20, fontWeight: '700', marginBottom: 16 },
  tableRow: { flexDirection: 'row', padding: 12, borderBottomWidth: 1, borderColor: '#DDD' },
  tableHeader: { backgroundColor: '#E5E7EB' },
  cell: { flex: 1, fontSize: 14 },
});
