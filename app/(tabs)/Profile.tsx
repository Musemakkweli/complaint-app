import { Entypo, FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { activateKeepAwakeAsync } from 'expo-keep-awake';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { useTheme } from '../../context/ThemeContext';
import { useUser } from '../../context/UserContext';


const API_URL = 'http://192.168.1.80:8000'; // replace with your PC's LAN IP
export default function ProfileScreen() {
  const { theme } = useTheme();
  const darkMode = theme === 'dark';
  const { user } = useUser();

  const [profileData, setProfileData] = useState<any>(null);
  const [avatar, setAvatar] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  /* ================= KEEP AWAKE ================= */
  useEffect(() => {
    activateKeepAwakeAsync();
  }, []);

  /* ================= FETCH PROFILE ================= */
  const fetchProfile = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/user-profile/${user.id}`);
      const data = await res.json();

      const profileObj = {
        name: data.user.fullname,
        email: data.user.email,
        phone: data.user.phone || '',
        province: data.profile.province || '',
        district: data.profile.district || '',
        sector: data.profile.sector || '',
        cell: data.profile.cell || '',
        village: data.profile.village || '',
        about: data.profile.about || '',
      };

      setProfileData(profileObj);
      setForm(profileObj);
      setAvatar(
        data.profile.profile_image_url ||
          `https://ui-avatars.com/api/?name=${encodeURIComponent(
            profileObj.name
          )}&background=7c3aed&color=fff&size=512`
      );
    } catch (err) {
      console.error('Fetch profile error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [user]);

  /* ================= IMAGE PICKER ================= */
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
      allowsEditing: true,
      aspect: [1, 1],
    });

    if (!result.canceled && result.assets?.[0]?.uri) {
      setAvatar(result.assets[0].uri);
    }
  };

  const startEdit = () => setEditing(true);
  const cancelEdit = () => {
    setEditing(false);
    setForm(profileData);
  };

  /* ================= SAVE PROFILE ================= */
  const saveEdit = async () => {
    if (!user || !form) return;

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('updated', JSON.stringify(form));

      if (avatar && avatar.startsWith('file://')) {
        const filename = avatar.split('/').pop();
        const fileType = filename?.split('.').pop();
        formData.append('profile_image', {
          uri: avatar,
          name: filename,
          type: `image/${fileType}`,
        } as any);
      }

      const res = await fetch(`${API_URL}/user-profile/${user.id}`, {
        method: 'PUT',
        body: formData,
        headers: {
          Accept: 'application/json',
        },
      });

      const data = await res.json();

      if (!res.ok) {
        console.error('Update failed:', data);
        return;
      }

      const profileObj = {
        name: data.user.fullname,
        email: data.user.email,
        phone: data.user.phone || '',
        province: data.profile.province || '',
        district: data.profile.district || '',
        sector: data.profile.sector || '',
        cell: data.profile.cell || '',
        village: data.profile.village || '',
        about: data.profile.about || '',
      };

      setProfileData(profileObj);
      setForm(profileObj);
      setAvatar(
        data.profile.profile_image_url ||
          `https://ui-avatars.com/api/?name=${encodeURIComponent(
            profileObj.name
          )}&background=7c3aed&color=fff&size=512`
      );

      setEditing(false);
      setSuccessMsg('Profile updated!');
      setTimeout(() => setSuccessMsg(''), 2500);
    } catch (err) {
      console.error('Error updating profile:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!profileData || loading) {
    return (
      <ActivityIndicator
        style={{ flex: 1 }}
        size="large"
        color={darkMode ? '#fff' : '#000'}
      />
    );
  }

  const fields = [
    { key: 'email', icon: <MaterialIcons name="email" size={18} color="#7C3AED" />, label: 'Email' },
    { key: 'phone', icon: <FontAwesome5 name="phone" size={16} color="#7C3AED" />, label: 'Phone' },
    { key: 'province', icon: <Entypo name="location-pin" size={16} color="#7C3AED" />, label: 'Province' },
    { key: 'district', icon: <Entypo name="location-pin" size={16} color="#7C3AED" />, label: 'District' },
    { key: 'sector', icon: <Entypo name="location-pin" size={16} color="#7C3AED" />, label: 'Sector' },
    { key: 'cell', icon: <Entypo name="location-pin" size={16} color="#7C3AED" />, label: 'Cell' },
    { key: 'village', icon: <Entypo name="location-pin" size={16} color="#7C3AED" />, label: 'Village' },
    { key: 'about', icon: <FontAwesome5 name="info-circle" size={16} color="#7C3AED" />, label: 'About' },
  ];

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
    >
      <ScrollView
        contentContainerStyle={[
          styles.container,
          { backgroundColor: darkMode ? '#111827' : '#F3F4F6' },
        ]}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.cardWrapper}>
          <View
            style={[
              styles.card,
              { backgroundColor: darkMode ? '#1F2937' : '#fff' },
            ]}
          >
            <View style={styles.avatarContainer}>
              <Image source={{ uri: avatar! }} style={styles.avatar} />
              <TouchableOpacity
                style={styles.avatarButton}
                onPress={pickImage}
              >
                <Text style={styles.avatarButtonText}>+</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.headerRow}>
              <Text
                style={[
                  styles.name,
                  { color: darkMode ? '#fff' : '#111827' },
                ]}
              >
                {form.name}
              </Text>

              {!editing ? (
                <TouchableOpacity
                  style={styles.editButton}
                  onPress={startEdit}
                >
                  <Text style={styles.buttonText}>Edit</Text>
                </TouchableOpacity>
              ) : (
                <View style={styles.buttonsRow}>
                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={cancelEdit}
                  >
                    <Text style={styles.cancelText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.saveButton}
                    onPress={saveEdit}
                  >
                    <Text style={styles.buttonText}>Save</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>

            {successMsg ? (
              <Text style={styles.success}>{successMsg}</Text>
            ) : null}

            <View style={styles.infoContainer}>
              {fields.map((f) => (
                <View key={f.key} style={styles.infoRow}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 6,
                    }}
                  >
                    {f.icon}
                    <Text
                      style={[
                        styles.label,
                        { color: darkMode ? '#9CA3AF' : '#6B7280' },
                      ]}
                    >
                      {f.label}
                    </Text>
                  </View>

                  {!editing ? (
                    <Text
                      style={[
                        styles.value,
                        { color: darkMode ? '#fff' : '#111827' },
                      ]}
                    >
                      {form[f.key]}
                    </Text>
                  ) : (
                    <TextInput
                      value={form[f.key]}
                      onChangeText={(text) =>
                        setForm({ ...form, [f.key]: text })
                      }
                      style={styles.input}
                      placeholderTextColor={
                        darkMode ? '#9CA3AF' : '#6B7280'
                      }
                    />
                  )}
                </View>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

/* ================= STYLES ================= */
const styles = StyleSheet.create({
  container: { flexGrow: 1, justifyContent: 'center', padding: 16, paddingBottom: 40 },
  cardWrapper: { flex: 1, justifyContent: 'center' },
  card: { borderRadius: 16, padding: 20, shadowColor: '#000', shadowOpacity: 0.12, shadowRadius: 12, shadowOffset: { width: 0, height: 6 }, elevation: 4 },
  avatarContainer: { alignSelf: 'center', marginBottom: 20, position: 'relative' },
  avatar: { width: 120, height: 120, borderRadius: 60 },
  avatarButton: { position: 'absolute', bottom: 0, right: 0, backgroundColor: '#7C3AED', width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  avatarButtonText: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  name: { fontSize: 24, fontWeight: 'bold' },
  buttonsRow: { flexDirection: 'row', gap: 8 },
  editButton: { backgroundColor: '#7C3AED', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 6 },
  saveButton: { backgroundColor: '#7C3AED', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 6 },
  cancelButton: { borderColor: '#7C3AED', borderWidth: 1, paddingVertical: 6, paddingHorizontal: 12, borderRadius: 6 },
  cancelText: { color: '#7C3AED', fontWeight: 'bold' },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  success: { textAlign: 'center', color: '#10B981', marginVertical: 8 },
  infoContainer: { marginTop: 16, gap: 12 },
  infoRow: { marginBottom: 12, justifyContent: 'space-between' },
  label: { fontSize: 14 },
  value: { fontSize: 16, fontWeight: '500' },
  input: { borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 6, paddingHorizontal: 10, paddingVertical: Platform.OS === 'ios' ? 10 : 6, fontSize: 16, color: '#111827', marginTop: 4 },
});
