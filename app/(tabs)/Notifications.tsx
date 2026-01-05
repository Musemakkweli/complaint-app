import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { useUser } from '../../context/UserContext';

const API_URL = 'http://10.197.223.252:8000';

type Notification = {
  id: string;
  title: string;
  message: string;
  created_at: string | null;
  is_read: number;
};

export default function Notifications() {
  const { theme } = useTheme();
  const darkMode = theme === 'dark';
  const { user } = useUser();

  const [notes, setNotes] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch notifications from backend
  const fetchNotifications = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/notifications/${user.id}`);
      const data = await res.json();

      if (!res.ok) {
        console.error('Failed to fetch notifications', data.detail);
        setNotes([]);
      } else {
        setNotes(data.notifications || []);
      }
    } catch (err) {
      console.error('Network error fetching notifications', err);
      setNotes([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [user]);

  // Mark all notifications as read locally
  const markAllRead = () => {
    setNotes(prev => prev.map(n => ({ ...n, is_read: 1 })));
    // TODO: Optionally call backend to mark read
  };

  // Toggle read/unread for a single notification locally
  const toggleRead = (id: string) => {
    setNotes(prev =>
      prev.map(n => n.id === id ? { ...n, is_read: n.is_read ? 0 : 1 } : n)
    );
    // TODO: Optionally call backend to update read status
  };

  const renderItem = ({ item }: { item: Notification }) => (
    <View
      style={[
        styles.noteCard,
        {
          backgroundColor: darkMode
            ? item.is_read === 0 ? '#1F2937' : '#111827'
            : item.is_read === 0 ? '#EDE9FE' : '#fff',
          borderColor: item.is_read === 0 ? '#0EA5E9' : 'transparent',
        },
      ]}
    >
      <View style={styles.noteContent}>
        <View
          style={[
            styles.avatar,
            { backgroundColor: item.is_read === 0 ? '#0EA5E9' : '#9CA3AF' },
          ]}
        >
          <Text style={styles.avatarText}>
            {item.title
              .split(' ')
              .map(s => s[0])
              .slice(0, 2)
              .join('')
              .toUpperCase()}
          </Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[styles.noteTitle, { color: darkMode ? '#fff' : '#111827' }]}>{item.title}</Text>
          <Text style={[styles.noteMessage, { color: darkMode ? '#9CA3AF' : '#6B7280' }]}>{item.message}</Text>
          {item.created_at && (
            <Text style={[styles.noteTime, { color: darkMode ? '#9CA3AF' : '#6B7280' }]}>
              {new Date(item.created_at).toLocaleString()}
            </Text>
          )}
        </View>
      </View>

      <TouchableOpacity onPress={() => toggleRead(item.id)}>
        <Text style={[styles.toggleRead, { color: '#0EA5E9' }]}>
          {item.is_read === 0 ? 'Mark read' : 'Mark unread'}
        </Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) return <ActivityIndicator style={{ flex: 1 }} size="large" color={darkMode ? '#fff' : '#000'} />;

  return (
    <View style={[styles.container, { backgroundColor: darkMode ? '#111827' : '#F3F4F6' }]}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: darkMode ? '#fff' : '#111827' }]}>
          Notifications ({notes.filter(n => n.is_read === 0).length})
        </Text>
        <TouchableOpacity style={styles.markAllBtn} onPress={markAllRead}>
          <Text style={styles.markAllText}>Mark all read</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={notes}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 80 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: Platform.OS === 'ios' ? 80 : 60, paddingHorizontal: 16 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  headerTitle: { fontSize: 24, fontWeight: 'bold' },
  markAllBtn: { backgroundColor: '#0EA5E9', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 6 },
  markAllText: { color: '#fff', fontWeight: 'bold' },
  noteCard: { borderWidth: 1, borderRadius: 8, padding: 12, marginBottom: 12 },
  noteContent: { flexDirection: 'row', marginBottom: 8 },
  avatar: { width: 40, height: 40, borderRadius: 20, marginRight: 12, justifyContent: 'center', alignItems: 'center' },
  avatarText: { color: '#fff', fontWeight: 'bold' },
  noteTitle: { fontSize: 16, fontWeight: '600' },
  noteMessage: { fontSize: 14, marginTop: 2 },
  noteTime: { fontSize: 12 },
  toggleRead: { fontSize: 12, fontWeight: '500', marginTop: 4 },
});
