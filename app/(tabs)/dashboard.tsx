import { activateKeepAwake, deactivateKeepAwake } from 'expo-keep-awake';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import CustomerComplaints from './CustomerComplaints';
import DashboardHome from './DashboardHome';
import Profile from './Profile';
import Setting from './settings'; // use lowercase if file is settings.tsx
// ✅ import the new Setting screen

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<'home' | 'complaint' | 'profile' | 'settings'>('home');
  const { theme } = useTheme();
  const darkMode = theme === 'dark';

  useEffect(() => {
    activateKeepAwake();
    return () => {
      void deactivateKeepAwake();
    };
  }, []);

  const renderTab = () => {
    switch (activeTab) {
      case 'home':
        return <DashboardHome />;
      case 'complaint':
        return <CustomerComplaints />;
      case 'profile':
        return <Profile />;
      case 'settings':
        return <Setting />; // ✅ render Setting screen
      default:
        return <DashboardHome />;
    }
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: darkMode ? '#111827' : '#F3F4F6' },
      ]}
    >
      {/* Main Content */}
      <View style={{ flex: 1 }}>{renderTab()}</View>

      {/* Bottom Tabs */}
      <View
        style={[
          styles.navbar,
          {
            backgroundColor: darkMode ? '#1F2937' : '#FFFFFF',
            borderTopColor: darkMode ? '#374151' : '#E5E7EB',
          },
        ]}
      >
        <TouchableOpacity onPress={() => setActiveTab('home')} style={styles.tab}>
          <Text
            style={
              activeTab === 'home'
                ? [styles.activeText, { color: '#0EA5E9' }]
                : [styles.inactiveText, { color: darkMode ? '#9CA3AF' : '#6B7280' }]
            }
          >
            Home
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setActiveTab('complaint')} style={styles.tab}>
          <Text
            style={
              activeTab === 'complaint'
                ? [styles.activeText, { color: '#0EA5E9' }]
                : [styles.inactiveText, { color: darkMode ? '#9CA3AF' : '#6B7280' }]
            }
          >
            Complaint
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setActiveTab('profile')} style={styles.tab}>
          <Text
            style={
              activeTab === 'profile'
                ? [styles.activeText, { color: '#0EA5E9' }]
                : [styles.inactiveText, { color: darkMode ? '#9CA3AF' : '#6B7280' }]
            }
          >
            Profile
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setActiveTab('settings')} style={styles.tab}>
          <Text
            style={
              activeTab === 'settings'
                ? [styles.activeText, { color: '#0EA5E9' }]
                : [styles.inactiveText, { color: darkMode ? '#9CA3AF' : '#6B7280' }]
            }
          >
            Settings
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  navbar: {
    flexDirection: 'row',
    height: 60,
    borderTopWidth: 1,
    marginBottom: 10,
    paddingBottom: 6,
  },
  tab: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeText: {
    fontWeight: '700',
    fontSize: 14,
  },
  inactiveText: {
    fontWeight: '500',
    fontSize: 13,
  },
});
