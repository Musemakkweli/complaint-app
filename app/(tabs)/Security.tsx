import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import API_URL from '../../constants/api'; // ✅ UPDATED
import { useTheme } from '../../context/ThemeContext';
import { useUser } from '../../context/UserContext';

export default function Security() {
  const { theme } = useTheme();
  const darkMode = theme === 'dark';
  const { user } = useUser();
  const router = useRouter();

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  /* ================= CHANGE PASSWORD ================= */
  const handleChangePassword = async () => {
    if (!user) return;

    if (!oldPassword || !newPassword || !confirmPassword) {
      Alert.alert('Error', 'All fields are required');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('user_id', user.id);
      formData.append('old_password', oldPassword);
      formData.append('new_password', newPassword);

      const res = await fetch(`${API_URL}/change-password`, {
        method: 'POST',
        body: formData,
        headers: { Accept: 'application/json' },
      });

      const data = await res.json();

      if (!res.ok) {
        Alert.alert('Error', data.detail || 'Failed to change password');
      } else {
        Alert.alert('Success', 'Password changed successfully');
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Network error');
    } finally {
      setLoading(false);
    }
  };

  /* ================= RENDER ================= */
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={[
          styles.container,
          { backgroundColor: darkMode ? '#111827' : '#F3F4F6' },
        ]}
      >
        {/* Back button */}
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Feather name="arrow-left" size={24} color={darkMode ? '#fff' : '#000'} />
          <Text style={[styles.backText, { color: darkMode ? '#fff' : '#000' }]}>Back</Text>
        </TouchableOpacity>

        <View style={[styles.card, { backgroundColor: darkMode ? '#1F2937' : '#fff' }]}>
          <Text style={[styles.title, { color: darkMode ? '#fff' : '#000' }]}>
            Change Password
          </Text>

          <TextInput
            placeholder="Old Password"
            secureTextEntry
            value={oldPassword}
            onChangeText={setOldPassword}
            style={styles.input}
            placeholderTextColor={darkMode ? '#9CA3AF' : '#6B7280'}
          />
          <TextInput
            placeholder="New Password"
            secureTextEntry
            value={newPassword}
            onChangeText={setNewPassword}
            style={styles.input}
            placeholderTextColor={darkMode ? '#9CA3AF' : '#6B7280'}
          />
          <TextInput
            placeholder="Confirm New Password"
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            style={styles.input}
            placeholderTextColor={darkMode ? '#9CA3AF' : '#6B7280'}
          />

          <TouchableOpacity
            style={styles.button}
            onPress={handleChangePassword}
            disabled={loading}
          >
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Update Password</Text>}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

/* ================= STYLES ================= */
const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 16 },
  backButton: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  backText: { marginLeft: 8, fontSize: 16 },
  card: { borderRadius: 16, padding: 20, elevation: 4 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    marginBottom: 12,
    color: '#111827',
  },
  button: {
    backgroundColor: '#7C3AED',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});
