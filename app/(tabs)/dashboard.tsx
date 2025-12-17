import { activateKeepAwake, deactivateKeepAwake } from 'expo-keep-awake';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import CustomerComplaints from './CustomerComplaints';
import DashboardHome from './DashboardHome';
import Profile from './Profile';

// To keep the screen awake
activateKeepAwake();

// Later, to allow sleep
deactivateKeepAwake();


export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<'home' | 'complaint' | 'profile'>('home');
  const router = useRouter();

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
    <View style={{ flex: 1 }}>
      {/* Render active tab content */}
      <View style={{ flex: 1 }}>{renderTab()}</View>

      {/* Bottom navbar */}
      <View style={styles.navbar}>
        <TouchableOpacity onPress={() => setActiveTab('home')} style={styles.tab}>
          <Text style={activeTab === 'home' ? styles.activeText : styles.inactiveText}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setActiveTab('complaint')} style={styles.tab}>
          <Text style={activeTab === 'complaint' ? styles.activeText : styles.inactiveText}>Complaint</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setActiveTab('profile')} style={styles.tab}>
          <Text style={activeTab === 'profile' ? styles.activeText : styles.inactiveText}>Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.replace('/')} style={styles.tab}>
          <Text style={styles.inactiveText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  navbar: {
    flexDirection: 'row',
    height: 60,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    backgroundColor: '#fff',
  },
  tab: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeText: {
    color: '#0EA5E9',
    fontWeight: 'bold',
  },
  inactiveText: {
    color: '#888',
  },
});
