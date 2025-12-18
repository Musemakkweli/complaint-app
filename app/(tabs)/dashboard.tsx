import { activateKeepAwake, deactivateKeepAwake } from 'expo-keep-awake';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import CustomerComplaints from './CustomerComplaints';
import DashboardHome from './DashboardHome';
import Profile from './Profile';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<'home' | 'complaint' | 'profile'>('home');
  const router = useRouter();
  const { theme } = useTheme();
  const darkMode = theme === 'dark';

  // Keep screen awake when this component is mounted
  useEffect(() => {
    activateKeepAwake();
    return () => {
      deactivateKeepAwake();
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
      default:
        return <DashboardHome />;
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: darkMode ? '#111827' : '#F3F4F6' }]}>
      <View style={{ flex: 1 }}>{renderTab()}</View>

      <View
        style={[
          styles.navbar,
          { 
            backgroundColor: darkMode ? '#1F2937' : '#fff', 
            borderTopColor: darkMode ? '#374151' : '#ccc' 
          },
        ]}
      >
        <TouchableOpacity onPress={() => setActiveTab('home')} style={styles.tab}>
          <Text style={activeTab === 'home' 
            ? [styles.activeText, { color: '#0EA5E9' }] 
            : [styles.inactiveText, { color: darkMode ? '#9CA3AF' : '#888' }]}
          >
            Home
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setActiveTab('complaint')} style={styles.tab}>
          <Text style={activeTab === 'complaint' 
            ? [styles.activeText, { color: '#0EA5E9' }] 
            : [styles.inactiveText, { color: darkMode ? '#9CA3AF' : '#888' }]}
          >
            Complaint
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setActiveTab('profile')} style={styles.tab}>
          <Text style={activeTab === 'profile' 
            ? [styles.activeText, { color: '#0EA5E9' }] 
            : [styles.inactiveText, { color: darkMode ? '#9CA3AF' : '#888' }]}
          >
            Profile
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.replace('/')} style={styles.tab}>
          <Text style={[styles.inactiveText, { color: darkMode ? '#F87171' : '#EF4444' }]}>
            Logout
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  navbar: { flexDirection: 'row', height: 60, borderTopWidth: 1 },
  tab: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  activeText: { fontWeight: 'bold' },
  inactiveText: { fontWeight: '500' },
});
