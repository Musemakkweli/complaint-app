import React, { useState } from 'react';
import {
    FlatList,
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';

type Notification = {
  id: number;
  title: string;
  message: string;
  time: string;
  unread: boolean;
};

export default function Notifications() {
  const { theme } = useTheme();
  const darkMode = theme === 'dark';

  const [notes, setNotes] = useState<Notification[]>([
    { id: 1, title: 'System Update', message: 'The system will be updated tonight at 11pm.', time: '2h ago', unread: true },
    { id: 2, title: 'New Response', message: 'Support replied to your complaint #23.', time: '1d ago', unread: true },
    { id: 3, title: 'Welcome', message: 'Thanks for joining ProConnect — get started by submitting a complaint.', time: '3d ago', unread: false },
  ]);

  const markAllRead = () => {
    setNotes(prev => prev.map(n => ({ ...n, unread: false })));
  };

  const toggleRead = (id: number) => {
    setNotes(prev => prev.map(n => n.id === id ? { ...n, unread: !n.unread } : n));
  };

  const renderItem = ({ item }: { item: Notification }) => (
    <View
      style={[
        styles.noteCard,
        { backgroundColor: darkMode ? '#1F2937' : '#fff', borderColor: item.unread ? '#0EA5E9' : 'transparent' },
      ]}
    >
      <View style={styles.noteContent}>
        <View
          style={[
            styles.avatar,
            { backgroundColor: item.unread ? '#0EA5E9' : '#9CA3AF' },
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
          <Text style={[styles.noteTitle, { color: darkMode ? '#fff' : '#000' }]}>{item.title}</Text>
          <Text style={[styles.noteMessage, { color: darkMode ? '#9CA3AF' : '#6B7280' }]}>{item.message}</Text>
        </View>
      </View>

      <View style={styles.noteActions}>
        <Text style={[styles.noteTime, { color: darkMode ? '#9CA3AF' : '#6B7280' }]}>{item.time}</Text>
        <TouchableOpacity onPress={() => toggleRead(item.id)}>
          <Text style={[styles.toggleRead, { color: '#0EA5E9' }]}>
            {item.unread ? 'Mark read' : 'Mark unread'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: darkMode ? '#111827' : '#F3F4F6' }]}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: darkMode ? '#fff' : '#000' }]}>Notifications</Text>
        <TouchableOpacity style={styles.markAllBtn} onPress={markAllRead}>
          <Text style={styles.markAllText}>Mark all read</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={notes}
        keyExtractor={item => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 80 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? 80 : 60,
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  markAllBtn: {
    backgroundColor: '#0EA5E9',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  markAllText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  noteCard: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  noteContent: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  noteTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  noteMessage: {
    fontSize: 14,
    marginTop: 2,
  },
  noteActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  noteTime: {
    fontSize: 12,
  },
  toggleRead: {
    fontSize: 12,
    fontWeight: '500',
  },
});
