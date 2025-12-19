import React, { useMemo, useState } from "react";
import {
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useTheme } from "../../context/ThemeContext";

// Mock complaints
const mockComplaints = [
  {
    id: 1,
    title: "Room light not working",
    description: "The light in my room is broken",
    address: "Block A, Room 101",
    type: "common",
    status: "pending",
    created: "2025-12-18 09:00",
    employee_id: null,
  },
  {
    id: 2,
    title: "Leaking faucet",
    description: "Faucet in bathroom is leaking",
    address: "Block B, Room 202",
    type: "private",
    status: "assigned",
    created: "2025-12-17 15:30",
    employee_id: 456,
  },
];

export default function CustomerComplaints() {
  const { theme } = useTheme();

  const colors = {
    background: theme === "dark" ? "#1E293B" : "#F3F4F6",
    card: theme === "dark" ? "#334155" : "#FFFFFF",
    text: theme === "dark" ? "#F1F5F9" : "#111827",
    border: theme === "dark" ? "#475569" : "#E5E7EB",
    activeTab: "#0EA5E9",
    button: "#3B82F6",
    submit: "#10B981",
  };

  const [complaints, setComplaints] = useState(mockComplaints);
  const [showModal, setShowModal] = useState(false);

  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newType, setNewType] = useState<"common" | "private">("common");
  const [tab, setTab] = useState<"all" | "common" | "private">("all");

  // Chat states
  const [chatVisible, setChatVisible] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState([
    {
      id: 1,
      sender: "employee",
      message: "Hello! I will help you with this complaint.",
    },
  ]);

  const filteredComplaints = useMemo(() => {
    if (tab === "all") return complaints;
    return complaints.filter((c) => c.type === tab);
  }, [tab, complaints]);

  function addComplaint() {
    if (!newTitle.trim()) return;

    const newComplaint = {
      id: Date.now(),
      title: newTitle,
      description: newDesc,
      address: "N/A",
      type: newType,
      status: "pending",
      created: new Date().toLocaleString(),
      employee_id: null,
    };

    setComplaints([newComplaint, ...complaints]);
    setShowModal(false);
    setNewTitle("");
    setNewDesc("");
    setNewType("common");
  }

  function openChat() {
    setChatVisible(true);
  }

  function sendMessage() {
    if (!chatInput.trim()) return;

    const userMessage = {
      id: Date.now(),
      sender: "user",
      message: chatInput,
    };

    setChatMessages((prev) => [...prev, userMessage]);
    setChatInput("");

    // Fake employee reply (simulates websocket)
    setTimeout(() => {
      setChatMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: "employee",
          message: "Thank you. We are working on your complaint.",
        },
      ]);
    }, 1000);
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* PUSH CONTENT DOWN */}
      <View style={styles.topPaddingWrapper}>
        {/* TITLE */}
        <View style={styles.headerRow}>
          <Text style={[styles.headerText, { color: colors.text }]}>
            My Complaints
          </Text>
        </View>

        {/* Tabs */}
        <View style={styles.tabs}>
          {["all", "common", "private"].map((t) => (
            <TouchableOpacity
              key={t}
              onPress={() => setTab(t as any)}
              style={[
                styles.tabButton,
                { backgroundColor: colors.border },
                tab === t && { backgroundColor: colors.activeTab },
              ]}
            >
              <Text
                style={[
                  styles.tabText,
                  { color: tab === t ? "#fff" : colors.text },
                ]}
              >
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* New Complaint */}
        <TouchableOpacity
          style={[styles.newButton, { backgroundColor: colors.button }]}
          onPress={() => setShowModal(true)}
        >
          <Text style={styles.newButtonText}>+ New Complaint</Text>
        </TouchableOpacity>

        {/* Complaints */}
        <FlatList
          contentContainerStyle={{ paddingTop: 10 }}
          data={filteredComplaints}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={[styles.card, { backgroundColor: colors.card }]}>
              <Text style={[styles.title, { color: colors.text }]}>
                {item.title}
              </Text>
              <Text style={{ color: colors.text }}>
                Status: {item.status}
              </Text>
              <Text style={{ color: colors.text }}>
                Type: {item.type}
              </Text>
              <Text style={{ color: colors.text }}>
                Created: {item.created}
              </Text>

              {item.status === "assigned" && (
                <TouchableOpacity
                  style={[
                    styles.chatButton,
                    { backgroundColor: colors.submit },
                  ]}
                  onPress={openChat}
                >
                  <Text style={styles.chatButtonText}>Chat</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        />

        {/* New Complaint Modal */}
        <Modal visible={showModal} transparent animationType="slide">
          <View style={styles.modalContainer}>
            <View
              style={[styles.modalContent, { backgroundColor: colors.card }]}
            >
              <Text
                style={[styles.modalTitle, { color: colors.text }]}
              >
                New Complaint
              </Text>

              <TextInput
                placeholder="Title"
                placeholderTextColor="#94A3B8"
                value={newTitle}
                onChangeText={setNewTitle}
                style={[
                  styles.input,
                  { borderColor: colors.border, color: colors.text },
                ]}
              />

              <TextInput
                placeholder="Description"
                placeholderTextColor="#94A3B8"
                value={newDesc}
                onChangeText={setNewDesc}
                multiline
                style={[
                  styles.input,
                  {
                    height: 80,
                    borderColor: colors.border,
                    color: colors.text,
                  },
                ]}
              />

              <View style={styles.typeSelector}>
                {["common", "private"].map((t) => (
                  <TouchableOpacity
                    key={t}
                    onPress={() => setNewType(t as any)}
                    style={[
                      styles.typeButton,
                      { borderColor: colors.border },
                      newType === t && {
                        backgroundColor: colors.activeTab,
                      },
                    ]}
                  >
                    <Text
                      style={
                        newType === t
                          ? styles.typeTextActive
                          : [styles.typeText, { color: colors.text }]
                      }
                    >
                      {t}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <View style={styles.modalActions}>
                <TouchableOpacity onPress={() => setShowModal(false)}>
                  <Text style={{ color: colors.text }}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.modalSubmit,
                    { backgroundColor: colors.submit },
                  ]}
                  onPress={addComplaint}
                >
                  <Text style={{ color: "#fff" }}>Submit</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* Chat Modal */}
        <Modal visible={chatVisible} transparent animationType="slide">
          <View style={styles.modalContainer}>
            <View
              style={[
                styles.modalContent,
                { backgroundColor: colors.card, height: "70%" },
              ]}
            >
              <Text
                style={[styles.modalTitle, { color: colors.text }]}
              >
                Chat
              </Text>

              <FlatList
                style={{ flex: 1 }}
                data={chatMessages}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                  <View
                    style={{
                      alignSelf:
                        item.sender === "user"
                          ? "flex-end"
                          : "flex-start",
                      backgroundColor:
                        item.sender === "user"
                          ? colors.activeTab
                          : colors.border,
                      padding: 8,
                      borderRadius: 6,
                      marginBottom: 6,
                      maxWidth: "80%",
                    }}
                  >
                    <Text
                      style={{
                        color:
                          item.sender === "user"
                            ? "#fff"
                            : colors.text,
                      }}
                    >
                      {item.message}
                    </Text>
                  </View>
                )}
              />

              <View style={{ flexDirection: "row", marginTop: 8 }}>
                <TextInput
                  value={chatInput}
                  onChangeText={setChatInput}
                  placeholder="Type a message..."
                  placeholderTextColor="#94A3B8"
                  style={[
                    styles.input,
                    {
                      flex: 1,
                      marginBottom: 0,
                      color: colors.text,
                      borderColor: colors.border,
                    },
                  ]}
                />

                <TouchableOpacity
                  onPress={sendMessage}
                  style={{
                    backgroundColor: colors.submit,
                    paddingHorizontal: 14,
                    marginLeft: 6,
                    borderRadius: 6,
                    justifyContent: "center",
                  }}
                >
                  <Text style={{ color: "#fff", fontWeight: "bold" }}>
                    Send
                  </Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity onPress={() => setChatVisible(false)}>
                <Text
                  style={{
                    color: colors.text,
                    marginTop: 10,
                    textAlign: "center",
                  }}
                >
                  Close Chat
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  topPaddingWrapper: {
    flex: 1,
    paddingTop: 50, // keeps screen down
    paddingHorizontal: 16,
  },

  headerRow: { alignItems: "center", marginBottom: 12 },

  headerText: { fontSize: 22, fontWeight: "bold" },

  tabs: { flexDirection: "row", marginBottom: 12 },

  tabButton: {
    marginRight: 8,
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 4,
  },

  tabText: { fontSize: 14 },

  newButton: {
    padding: 10,
    borderRadius: 6,
    alignItems: "center",
    marginBottom: 12,
  },

  newButtonText: { color: "#fff", fontWeight: "bold" },

  card: { padding: 12, marginBottom: 8, borderRadius: 6 },

  title: { fontSize: 16, fontWeight: "bold" },

  chatButton: {
    marginTop: 6,
    padding: 6,
    borderRadius: 4,
    alignSelf: "flex-start",
  },

  chatButtonText: { color: "#fff", fontSize: 12 },

  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },

  modalContent: {
    width: "90%",
    borderRadius: 8,
    padding: 16,
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },

  input: {
    borderWidth: 1,
    borderRadius: 6,
    padding: 8,
    marginBottom: 12,
  },

  typeSelector: { flexDirection: "row", marginBottom: 12 },

  typeButton: {
    flex: 1,
    padding: 8,
    borderRadius: 6,
    borderWidth: 1,
    marginRight: 8,
    alignItems: "center",
  },

  typeText: { color: "#374151" },

  typeTextActive: { color: "#fff" },

  modalActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 12,
  },

  modalSubmit: { padding: 8, borderRadius: 6 },
});
