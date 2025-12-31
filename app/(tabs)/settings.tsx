import React, { useState } from 'react';
import {
  FlatList,
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';

type Notification = {
  id: number;
  title: string;
  message: string;
  time: string;
  unread: boolean;
};

export default function Settings() {
  const { theme, toggleTheme } = useTheme();
  const darkMode = theme === 'dark';

  /* ---------------- PROFILE STATE ---------------- */
  const [profile, setProfile] = useState({
    name: 'Jane Doe',
    email: 'jane.doe@example.com',
    phone: '+1 (555) 123-4567',
    address: '123 Main St',
    city: 'Springfield',
    country: 'USA',
  });

  const [form, setForm] = useState(profile);
  const [editingProfile, setEditingProfile] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const saveProfile = () => {
    setProfile(form);
    setEditingProfile(false);
  };

  /* ---------------- NOTIFICATIONS ---------------- */
  const [notes, setNotes] = useState<Notification[]>([
    { id: 1, title: 'System Update', message: 'System updated tonight at 11pm.', time: '2h ago', unread: true },
    { id: 2, title: 'New Response', message: 'Support replied to complaint #23.', time: '1d ago', unread: true },
    { id: 3, title: 'Welcome', message: 'Thanks for joining ProConnect!', time: '3d ago', unread: false },
  ]);

  const [showNotifications, setShowNotifications] = useState(false);

  const markAllRead = () =>
    setNotes(prev => prev.map(n => ({ ...n, unread: false })));

  const toggleRead = (id: number) =>
    setNotes(prev =>
      prev.map(n => (n.id === id ? { ...n, unread: !n.unread } : n))
    );

  const renderNotification = ({ item }: { item: Notification }) => (
    <View
      style={[
        styles.noteCard,
        {
          backgroundColor: darkMode ? '#1F2937' : '#fff',
          borderColor: item.unread ? '#0EA5E9' : 'transparent',
        },
      ]}
    >
      <View style={{ flexDirection: 'row', marginBottom: 6 }}>
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
          <Text style={[styles.noteTitle, { color: darkMode ? '#fff' : '#000' }]}>
            {item.title}
          </Text>
          <Text
            style={[
              styles.noteMessage,
              { color: darkMode ? '#9CA3AF' : '#6B7280' },
            ]}
          >
            {item.message}
          </Text>
        </View>
      </View>

      <View style={styles.noteActions}>
        <Text style={[styles.noteTime, { color: darkMode ? '#9CA3AF' : '#6B7280' }]}>
          {item.time}
        </Text>
        <TouchableOpacity onPress={() => toggleRead(item.id)}>
          <Text style={styles.toggleRead}>
            {item.unread ? 'Mark read' : 'Mark unread'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <ScrollView
      contentContainerStyle={[
        styles.container,
        { backgroundColor: darkMode ? '#111827' : '#F3F4F6' },
      ]}
    >
      {/* Space from top */}
      <View style={{ marginTop: 40 }} />

      {/* Title */}
      <Text style={[styles.title, { color: darkMode ? '#fff' : '#000' }]}>
        Settings
      </Text>

      {/* ================= PROFILE SETTINGS ================= */}
      <View style={styles.section}>
        <TouchableOpacity onPress={() => setShowProfile(!showProfile)}>
          <Text style={[styles.sectionTitle, { color: darkMode ? '#fff' : '#000' }]}>
            Profile Settings {showProfile ? '▲' : '▼'}
          </Text>
        </TouchableOpacity>

        {/* COLLAPSED VIEW */}
        {!showProfile && (
          <View style={{ marginTop: 8 }}>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Name</Text>
              <Text style={[styles.value, { color: darkMode ? '#fff' : '#000' }]}>
                {profile.name}
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.label}>Email</Text>
              <Text style={[styles.value, { color: darkMode ? '#fff' : '#000' }]}>
                {profile.email}
              </Text>
            </View>
          </View>
        )}

        {/* EXPANDED VIEW */}
        {showProfile && (
          <>
            {!editingProfile ? (
              <View style={{ marginTop: 8 }}>
                {Object.entries(profile).map(([key, value]) => (
                  <View key={key} style={styles.infoRow}>
                    <Text style={styles.label}>
                      {key.charAt(0).toUpperCase() + key.slice(1)}
                    </Text>
                    <Text style={[styles.value, { color: darkMode ? '#fff' : '#000' }]}>
                      {value}
                    </Text>
                  </View>
                ))}

                <TouchableOpacity
                  style={styles.editBtn}
                  onPress={() => {
                    setForm(profile);
                    setEditingProfile(true);
                  }}
                >
                  <Text style={styles.editBtnText}>Edit Profile</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={{ marginTop: 8 }}>
                {Object.entries(form).map(([key, value]) => (
                  <View key={key} style={styles.inputRow}>
                    <Text style={styles.label}>
                      {key.charAt(0).toUpperCase() + key.slice(1)}
                    </Text>
                    <TextInput
                      value={value}
                      onChangeText={text => setForm({ ...form, [key]: text })}
                      style={[
                        styles.input,
                        {
                          color: darkMode ? '#fff' : '#000',
                          borderColor: darkMode ? '#374151' : '#D1D5DB',
                        },
                      ]}
                    />
                  </View>
                ))}

                <View style={{ flexDirection: 'row', marginTop: 8 }}>
                  <TouchableOpacity style={styles.saveBtn} onPress={saveProfile}>
                    <Text style={styles.editBtnText}>Save</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.cancelBtn}
                    onPress={() => setEditingProfile(false)}
                  >
                    <Text style={[styles.editBtnText, { color: '#EF4444' }]}>
                      Cancel
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </>
        )}
      </View>

      {/* ================= APP PREFERENCES ================= */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: darkMode ? '#fff' : '#000' }]}>
          App Preferences
        </Text>

        <View style={styles.preferenceRow}>
          <Text style={{ color: darkMode ? '#fff' : '#000' }}>Dark Mode</Text>
          <Switch value={darkMode} onValueChange={toggleTheme} />
        </View>
      </View>

      {/* ================= SECURITY ================= */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: darkMode ? '#fff' : '#000' }]}>
          Security
        </Text>
        <Text style={styles.sectionText}>
          Change your password in the web portal.
        </Text>
      </View>

      {/* ================= NOTIFICATIONS ================= */}
      <View style={styles.section}>
        <TouchableOpacity onPress={() => setShowNotifications(!showNotifications)}>
          <Text style={[styles.sectionTitle, { color: darkMode ? '#fff' : '#000' }]}>
            Notifications {showNotifications ? '▲' : '▼'}
          </Text>
        </TouchableOpacity>

        {showNotifications && (
          <View style={{ marginTop: 8 }}>
            <TouchableOpacity style={styles.markAllBtn} onPress={markAllRead}>
              <Text style={styles.markAllText}>Mark all read</Text>
            </TouchableOpacity>

            <FlatList
              data={notes}
              keyExtractor={item => item.id.toString()}
              renderItem={renderNotification}
              scrollEnabled={false}
            />
          </View>
        )}
      </View>

      {/* ================= ABOUT ================= */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: darkMode ? '#fff' : '#000' }]}>
          About
        </Text>
        <Text style={styles.sectionText}>Version 1.0.0</Text>
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

/* ================= STYLES ================= */
const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    alignSelf: 'center',
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  sectionText: {
    fontSize: 14,
    marginTop: 4,
    color: '#6B7280',
  },
  preferenceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    alignItems: 'center',
  },
  infoRow: {
    marginBottom: 8,
  },
  label: {
    fontSize: 12,
    color: '#6B7280',
  },
  value: {
    fontSize: 16,
    fontWeight: '500',
  },
  inputRow: {
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: Platform.OS === 'ios' ? 10 : 6,
    marginTop: 4,
    fontSize: 16,
  },
  editBtn: {
    backgroundColor: '#0EA5E9',
    padding: 8,
    borderRadius: 6,
    marginTop: 8,
    alignSelf: 'flex-start',
  },
  saveBtn: {
    backgroundColor: '#0EA5E9',
    padding: 8,
    borderRadius: 6,
    marginRight: 8,
  },
  cancelBtn: {
    borderColor: '#EF4444',
    borderWidth: 1,
    padding: 8,
    borderRadius: 6,
  },
  editBtnText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  noteCard: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
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
    color: '#0EA5E9',
  },
  markAllBtn: {
    backgroundColor: '#0EA5E9',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  markAllText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
