import { Feather, MaterialIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../context/ThemeContext';

type Option = {
  title: string;
  subtitle?: string;
  onPress?: () => void;
  icon?: React.ReactNode;
  isToggle?: boolean;
};

type Category = {
  title: string;
  icon?: React.ReactNode;
  options: Option[];
};

export default function Settings() {
  const { theme, toggleTheme } = useTheme();
  const darkMode = theme === 'dark';

  // ---------------- SETTINGS CATEGORIES ----------------
  const [categories] = useState<Category[]>([
    {
      title: 'Account',
      icon: <MaterialIcons name="person" size={20} color={darkMode ? '#fff' : '#000'} />,
      options: [
        {
          title: 'Edit Profile',
          subtitle: 'Update your information',
          icon: <Feather name="edit" size={18} color="#0EA5E9" />,
          onPress: () => Alert.alert('Edit Profile', 'Go to Edit Profile screen'),
        },
        {
          title: 'Security',
          subtitle: 'Change password, 2FA',
          icon: <Feather name="lock" size={18} color="#0EA5E9" />,
          onPress: () => Alert.alert('Security', 'Go to Security screen'),
        },
      ],
    },
    {
      title: 'Preferences',
      icon: <Feather name="sliders" size={20} color={darkMode ? '#fff' : '#000'} />,
      options: [
        {
          title: 'Dark Mode',
          icon: <Feather name="moon" size={18} color="#0EA5E9" />,
          isToggle: true,
        },
      ],
    },
    {
      title: 'Notifications',
      icon: <Feather name="bell" size={20} color={darkMode ? '#fff' : '#000'} />,
      options: [
        {
          title: 'Push Notifications',
          subtitle: 'Manage alerts for complaints',
          icon: <Feather name="bell" size={18} color="#0EA5E9" />,
          onPress: () => Alert.alert('Notifications', 'Manage notification settings'),
        },
      ],
    },
    {
      title: 'Help & Support',
      icon: <Feather name="help-circle" size={20} color={darkMode ? '#fff' : '#000'} />,
      options: [
        {
          title: 'FAQ',
          subtitle: 'Frequently Asked Questions',
          icon: <Feather name="info" size={18} color="#0EA5E9" />,
          onPress: () => Alert.alert('FAQ', 'Open FAQ'),
        },
        {
          title: 'Contact Support',
          subtitle: 'Get help from our team',
          icon: <Feather name="phone" size={18} color="#0EA5E9" />,
          onPress: () => Alert.alert('Support', 'Contact support'),
        },
      ],
    },
    {
      title: 'Logout',
      icon: <Feather name="log-out" size={20} color={darkMode ? '#fff' : '#000'} />,
      options: [
        {
          title: 'Logout',
          icon: <Feather name="log-out" size={18} color="#EF4444" />,
          onPress: () =>
            Alert.alert('Logout', 'Are you sure you want to logout?', [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Logout', style: 'destructive', onPress: () => console.log('Logged out') },
            ]),
        },
      ],
    },
  ]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView
        contentContainerStyle={[
          styles.container,
          { backgroundColor: darkMode ? '#111827' : '#F3F4F6' },
        ]}
      >
        <View style={{ marginTop: 16 }} />

        <Text style={[styles.title, { color: darkMode ? '#fff' : '#000' }]}>Settings</Text>

        {categories?.map((cat, idx) => (
          <View key={idx} style={styles.section}>
            <View style={styles.categoryHeader}>
              {cat.icon && <View style={{ marginRight: 8 }}>{cat.icon}</View>}
              <Text style={[styles.categoryTitle, { color: darkMode ? '#fff' : '#000' }]}>
                {cat.title}
              </Text>
            </View>

            {cat.options.map((opt, i) => (
              <TouchableOpacity
                key={i}
                style={[
                  styles.optionRow,
                  {
                    backgroundColor: darkMode ? '#1F2937' : '#fff',
                    borderColor: darkMode ? '#374151' : '#D1D5DB',
                  },
                ]}
                onPress={opt.onPress}
                activeOpacity={opt.isToggle ? 1 : 0.7}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  {opt.icon && <View style={{ marginRight: 12 }}>{opt.icon}</View>}
                  <View style={{ flexShrink: 1 }}>
                    <Text style={[styles.optionTitle, { color: darkMode ? '#fff' : '#000' }]}>
                      {opt.title}
                    </Text>
                    {opt.subtitle && (
                      <Text
                        style={[
                          styles.optionSubtitle,
                          { color: darkMode ? '#9CA3AF' : '#6B7280' },
                        ]}
                      >
                        {opt.subtitle}
                      </Text>
                    )}
                  </View>
                </View>

                {opt.isToggle && <Switch value={darkMode} onValueChange={toggleTheme} />}
              </TouchableOpacity>
            ))}
          </View>
        ))}

        <View style={{ height: 60 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    alignSelf: 'center',
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  optionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  optionSubtitle: {
    fontSize: 12,
    marginTop: 2,
  },
});
