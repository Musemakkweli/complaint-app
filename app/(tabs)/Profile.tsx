import * as ImagePicker from 'expo-image-picker';
import React, { useState } from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';

export default function ProfileScreen() {
  const { theme } = useTheme();
  const darkMode = theme === 'dark';

  const [profile, setProfile] = useState({
    name: 'Jane Doe',
    email: 'jane.doe@example.com',
    phone: '+1 (555) 123-4567',
    address: '123 Main St',
    city: 'Springfield',
    country: 'USA',
    about: 'Customer since 2023. Likes concise reports and quick responses.',
  });

  const [avatar, setAvatar] = useState(
    `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.name)}&background=7c3aed&color=fff&size=512`
  );
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(profile);
  const [successMsg, setSuccessMsg] = useState('');

  const pickImage = async () => {
    const result: ImagePicker.ImagePickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
      allowsEditing: true,
      aspect: [1, 1],
    });

    if (!result.canceled && result.assets?.[0]?.uri) {
      setAvatar(result.assets[0].uri);
    }
  };

  const startEdit = () => {
    setForm(profile);
    setEditing(true);
  };

  const cancelEdit = () => {
    setEditing(false);
    setForm(profile);
  };

  const saveEdit = () => {
    setProfile(form);
    setEditing(false);
    setSuccessMsg('Profile updated!');
    setTimeout(() => setSuccessMsg(''), 2500);
  };

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: darkMode ? '#111827' : '#F3F4F6' }]}>
      <View style={styles.cardWrapper}>
        <View style={[styles.card, { backgroundColor: darkMode ? '#1F2937' : '#fff' }]}>
          <View style={styles.avatarContainer}>
            <Image source={{ uri: avatar }} style={styles.avatar} />
            <TouchableOpacity style={styles.avatarButton} onPress={pickImage}>
              <Text style={styles.avatarButtonText}>+</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.headerRow}>
            <Text style={[styles.name, { color: darkMode ? '#fff' : '#111827' }]}>{profile.name}</Text>
            {!editing ? (
              <View style={styles.buttonsRow}>
                <TouchableOpacity style={styles.editButton} onPress={startEdit}>
                  <Text style={styles.buttonText}>Edit</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.buttonsRow}>
                <TouchableOpacity style={styles.cancelButton} onPress={cancelEdit}>
                  <Text style={styles.cancelText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.saveButton} onPress={saveEdit}>
                  <Text style={styles.buttonText}>Save</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          {successMsg ? <Text style={styles.success}>{successMsg}</Text> : null}

          {!editing ? (
            <View style={styles.infoContainer}>
              {Object.entries(profile).map(([key, value]) => (
                <View key={key} style={styles.infoRow}>
                  <Text style={[styles.label, { color: darkMode ? '#9CA3AF' : '#6B7280' }]}>{key.charAt(0).toUpperCase() + key.slice(1)}</Text>
                  <Text style={[styles.value, { color: darkMode ? '#fff' : '#111827' }]}>{value}</Text>
                </View>
              ))}
            </View>
          ) : (
            <View style={styles.infoContainer}>
              {Object.entries(form).map(([key, value]) => (
                <View key={key} style={styles.inputRow}>
                  <Text style={[styles.label, { color: darkMode ? '#9CA3AF' : '#6B7280' }]}>{key.charAt(0).toUpperCase() + key.slice(1)}</Text>
                  <TextInput
                    value={value}
                    onChangeText={(text) => setForm({ ...form, [key]: text })}
                    style={styles.input}
                    placeholderTextColor={darkMode ? '#9CA3AF' : '#6B7280'}
                  />
                </View>
              ))}
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 16,
    paddingBottom: 40,
  },
  cardWrapper: {
    flex: 1,
    justifyContent: 'center',
  },
  card: {
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 3,
  },
  avatarContainer: {
    alignSelf: 'center',
    marginBottom: 16,
    position: 'relative',
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  avatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#7C3AED',
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  name: { fontSize: 22, fontWeight: 'bold' },
  buttonsRow: { flexDirection: 'row' },
  editButton: { backgroundColor: '#7C3AED', padding: 8, borderRadius: 6 },
  saveButton: { backgroundColor: '#7C3AED', padding: 8, borderRadius: 6, marginRight: 8 },
  cancelButton: { borderColor: '#7C3AED', borderWidth: 1, padding: 8, borderRadius: 6, marginRight: 8 },
  cancelText: { color: '#7C3AED', fontWeight: 'bold' },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  success: { textAlign: 'center', color: '#10B981', marginVertical: 6 },
  infoContainer: { marginTop: 12 },
  infoRow: { marginBottom: 10 },
  label: { fontSize: 12 },
  value: { fontSize: 16, fontWeight: '500' },
  inputRow: { marginBottom: 10 },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: Platform.OS === 'ios' ? 10 : 6,
    marginTop: 4,
    fontSize: 16,
    color: '#111827',
  },
});
