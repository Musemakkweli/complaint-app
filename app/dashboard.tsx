import { activateKeepAwake, deactivateKeepAwake } from 'expo-keep-awake';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import CustomerComplaints from './(tabs)/CustomerComplaints';
import DashboardHome from './(tabs)/DashboardHome';
import Profile from './(tabs)/Profile';
import Settings from './(tabs)/settings';

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
        return <Settings />;
      default:
        return <DashboardHome />;
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: darkMode ? '#111827' : '#F3F4F6' }]}>
      {/* Main Content */}
      <View style={styles.content}>
        {renderTab()}
      </View>

      {/* Bottom Navbar */}
      <View style={[styles.navbar, {
        backgroundColor: darkMode ? '#1F2937' : '#FFFFFF',
        borderTopColor: darkMode ? '#374151' : '#E5E7EB',
      }]}>
        {['home', 'complaint', 'profile', 'settings'].map((tab) => (
          <TouchableOpacity key={tab} onPress={() => setActiveTab(tab as any)} style={styles.tab}>
            <Text style={activeTab === tab 
              ? [styles.activeText, { color: '#0EA5E9' }] 
              : [styles.inactiveText, { color: darkMode ? '#9CA3AF' : '#6B7280' }]}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
  },
  content: {
    flex: 1, // fill all space above navbar
  },
  navbar: { 
    flexDirection: 'row', 
    height: 60, 
    borderTopWidth: 1,
  },
  tab: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  activeText: { 
    fontWeight: '700', 
    fontSize: 14 
  },
  inactiveText: { 
    fontWeight: '500', 
    fontSize: 13 
  },
});
