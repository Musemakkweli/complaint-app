import { activateKeepAwake, deactivateKeepAwake } from 'expo-keep-awake';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Platform } from 'react-native';
import { Feather } from '@expo/vector-icons';
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
    // Avoid requesting WakeLock on web where the page may be hidden
    if (Platform.OS === 'web') return;

    try {
      void activateKeepAwake();
    } catch (err) {
      console.warn('activateKeepAwake failed:', err);
    }

    return () => {
      try {
        void deactivateKeepAwake();
      } catch (err) {
        console.warn('deactivateKeepAwake failed:', err);
      }
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
        {['home', 'complaint', 'profile', 'settings'].map((tab) => {
          const iconName: any =
            tab === 'home' ? 'home' : tab === 'complaint' ? 'file-text' : tab === 'profile' ? 'user' : 'settings';
          const active = activeTab === tab;
          const color = active ? '#0EA5E9' : darkMode ? '#9CA3AF' : '#6B7280';
          return (
            <TouchableOpacity key={tab} onPress={() => setActiveTab(tab as any)} style={styles.tab}>
              <Feather name={iconName} size={20} color={color} style={{ marginBottom: 4 }} />
              <Text style={active ? [styles.activeText, { color }] : [styles.inactiveText, { color }]}>
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </Text>
            </TouchableOpacity>
          );
        })}
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
    height: 68, 
    borderTopWidth: 1,
    paddingBottom: 8,
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
