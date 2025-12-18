import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { FlatList, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

// Mock data
const mockComplaints = [
  {
    id: 1,
    title: 'Room light not working',
    description: 'The light in my room is broken',
    address: 'Block A, Room 101',
    type: 'common',
    status: 'pending',
    created: '2025-12-18 09:00',
    employee_id: null,
  },
  {
    id: 2,
    title: 'Leaking faucet',
    description: 'Faucet in bathroom is leaking',
    address: 'Block B, Room 202',
    type: 'private',
    status: 'assigned',
    created: '2025-12-17 15:30',
    employee_id: 456,
  },
];

export default function CustomerComplaints() {
  const router = useRouter();
  const [complaints, setComplaints] = useState(mockComplaints);
  const [showModal, setShowModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newType, setNewType] = useState<'common' | 'private'>('common');
  const [tab, setTab] = useState<'all' | 'common' | 'private'>('all');

  const filteredComplaints = useMemo(() => {
    if (tab === 'all') return complaints;
    return complaints.filter(c => c.type === tab);
  }, [tab, complaints]);

  function addComplaint() {
    if (!newTitle.trim()) return;
    const newComplaint = {
      id: complaints.length + 1,
      title: newTitle,
      description: newDesc,
      address: 'N/A',
      type: newType,
      status: 'pending',
      created: new Date().toLocaleString(),
      employee_id: null,
    };
    setComplaints([newComplaint, ...complaints]);
    setShowModal(false);
    setNewTitle('');
    setNewDesc('');
    setNewType('common');
  }

  return (
    <View style={styles.container}>
      {/* Back button */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.replace('/Dashboard' as any)}>
        <Text style={styles.backButtonText}>← Back to Dashboard</Text>
      </TouchableOpacity>

      {/* Header */}
      <Text style={styles.headerText}>My Complaints</Text>
      <View style={styles.tabs}>
        {['all', 'common', 'private'].map(t => (
          <TouchableOpacity
            key={t}
            onPress={() => setTab(t as any)}
            style={[styles.tabButton, tab === t && styles.activeTab]}
          >
            <Text style={[styles.tabText, tab === t && styles.activeTabText]}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* New complaint button (blue) */}
      <TouchableOpacity style={styles.newButton} onPress={() => setShowModal(true)}>
        <Text style={styles.newButtonText}>+ New Complaint</Text>
      </TouchableOpacity>

      {/* Complaints list */}
      <FlatList
        data={filteredComplaints}
        keyExtractor={(item) => item.id.toString()}
        style={styles.list}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.title}>{item.title}</Text>
            <Text>Status: {item.status}</Text>
            <Text>Type: {item.type.charAt(0).toUpperCase() + item.type.slice(1)}</Text>
            <Text>Created: {item.created}</Text>
            {item.employee_id && (
              <TouchableOpacity
                style={styles.chatButton}
                onPress={() => router.push(`/ChatScreen?complaintId=${item.id}` as any)}
              >
                <Text style={styles.chatButtonText}>Chat</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      />

      {/* Modal for new complaint */}
      <Modal visible={showModal} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>New Complaint</Text>
            <TextInput
              placeholder="Title"
              value={newTitle}
              onChangeText={setNewTitle}
              style={styles.input}
            />
            <TextInput
              placeholder="Description"
              value={newDesc}
              onChangeText={setNewDesc}
              multiline
              style={[styles.input, { height: 80 }]}
            />
            <View style={styles.typeSelector}>
              <TouchableOpacity
                onPress={() => setNewType('common')}
                style={[styles.typeButton, newType === 'common' && styles.typeButtonActive]}
              >
                <Text style={newType === 'common' ? styles.typeTextActive : styles.typeText}>Common</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setNewType('private')}
                style={[styles.typeButton, newType === 'private' && styles.typeButtonActive]}
              >
                <Text style={newType === 'private' ? styles.typeTextActive : styles.typeText}>Private</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.modalCancel} onPress={() => setShowModal(false)}>
                <Text>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalSubmit} onPress={addComplaint}>
                <Text style={{ color: '#fff' }}>Submit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#F3F4F6' },
  backButton: { marginBottom: 12 }, // moved down for easier click
  backButtonText: { color: '#0EA5E9', fontWeight: 'bold' },
  headerText: { fontSize: 22, fontWeight: 'bold', marginBottom: 8 },
  tabs: { flexDirection: 'row', marginBottom: 12 },
  tabButton: { marginRight: 8, paddingVertical: 4, paddingHorizontal: 12, borderRadius: 4, backgroundColor: '#E5E7EB' },
  activeTab: { backgroundColor: '#0EA5E9' },
  tabText: { color: '#374151' },
  activeTabText: { color: '#fff' },
  newButton: { backgroundColor: '#3B82F6', padding: 10, borderRadius: 6, alignItems: 'center', marginBottom: 12 },
  newButtonText: { color: '#fff', fontWeight: 'bold' },
  list: { flex: 1 },
  card: { padding: 12, backgroundColor: '#fff', marginBottom: 8, borderRadius: 6, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5 },
  title: { fontSize: 16, fontWeight: 'bold', marginBottom: 4 },
  chatButton: { marginTop: 6, backgroundColor: '#10B981', paddingVertical: 4, paddingHorizontal: 8, borderRadius: 4, alignItems: 'center', alignSelf: 'flex-start' },
  chatButtonText: { color: '#fff', fontSize: 12 },
  modalContainer: { flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { width: '90%', backgroundColor: '#fff', borderRadius: 8, padding: 16 },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 12 },
  input: { borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 6, padding: 8, marginBottom: 12 },
  typeSelector: { flexDirection: 'row', marginBottom: 12 },
  typeButton: { flex: 1, padding: 8, borderRadius: 6, borderWidth: 1, borderColor: '#D1D5DB', marginRight: 8, alignItems: 'center' },
  typeButtonActive: { backgroundColor: '#0EA5E9', borderColor: '#0EA5E9' },
  typeText: { color: '#374151' },
  typeTextActive: { color: '#fff' },
  modalActions: { flexDirection: 'row', justifyContent: 'flex-end' },
  modalCancel: { padding: 8, marginRight: 8 },
  modalSubmit: { padding: 8, backgroundColor: '#10B981', borderRadius: 6 },
});
