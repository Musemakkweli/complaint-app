import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useTheme } from "../../context/ThemeContext";
import { useUser } from "../../context/UserContext";

const API_URL = "http://10.197.223.252:8000";

type Complaint = {
  id: number;
  title: string;
  description: string;
  address: string;
  complaint_type: "common" | "private";
  status: "pending" | "assigned" | "resolved";
  created_at?: string;
  employee_id?: number | null;
};

type ChatMessage = {
  sender: "user" | "employee";
  text: string;
  timestamp: string;
};

export default function CustomerComplaints() {
  const { theme } = useTheme();
  const { user } = useUser();
  const userId = user?.id;
  if (!userId) return null;

  const colors = {
    background: theme === "dark" ? "#1E293B" : "#F9FAFB",
    card: theme === "dark" ? "#334155" : "#FFFFFF",
    text: theme === "dark" ? "#F1F5F9" : "#111827",
    border: theme === "dark" ? "#475569" : "#E5E7EB",
    primary: "#3B82F6",
    submit: "#10B981",
  };

  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [tab, setTab] = useState<"all" | "common" | "private">("all");
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newType, setNewType] = useState<"common" | "private">("common");
  const [editingComplaint, setEditingComplaint] = useState<Complaint | null>(null);

  const [chatModal, setChatModal] = useState(false);
  const [currentChat, setCurrentChat] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [activeComplaintId, setActiveComplaintId] = useState<number | null>(null);
  const scrollRef = useRef<ScrollView>(null);

  const [viewModal, setViewModal] = useState(false);
  const [activeComplaint, setActiveComplaint] = useState<Complaint | null>(null);

  const [optionsModal, setOptionsModal] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);

  // Fetch complaints
  useEffect(() => {
    fetch(`${API_URL}/complaints/user/${userId}`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setComplaints(data);
      })
      .catch((err) => console.error("Fetch error:", err));
  }, [userId]);

  const filteredComplaints = useMemo(() => {
    if (tab === "all") return complaints;
    return complaints.filter((c) => c.complaint_type === tab);
  }, [tab, complaints]);

  // Submit or edit complaint
  const submitComplaint = async () => {
    if (!newTitle.trim()) return alert("Title cannot be blank.");

    setLoading(true);
    try {
      if (editingComplaint) {
        const res = await fetch(`${API_URL}/complaints/${editingComplaint.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: newTitle,
            description: newDesc,
            complaint_type: newType,
          }),
        });
        if (!res.ok) return alert("Failed to edit complaint.");
        const updated: Complaint = await res.json();
        setComplaints((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
      } else {
        const res = await fetch(`${API_URL}/complaints`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_id: userId,
            title: newTitle,
            description: newDesc,
            complaint_type: newType,
            address: "N/A",
          }),
        });
        if (!res.ok) return alert("Failed to submit complaint.");
        const created: Complaint = await res.json();
        if (created?.id) setComplaints((prev) => [created, ...prev]);
      }

      setShowModal(false);
      setEditingComplaint(null);
      setNewTitle("");
      setNewDesc("");
      setNewType("common");
    } catch (err) {
      console.error("Submit error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Delete complaint
  const deleteComplaint = async (id: number) => {
    if (!confirm("Are you sure you want to delete this complaint?")) return;
    try {
      const res = await fetch(`${API_URL}/complaints/${id}`, { method: "DELETE" });
      if (res.ok) setComplaints((prev) => prev.filter((c) => c.id !== id));
      else alert("Failed to delete complaint.");
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  // Chat
  const openChat = (complaintId: number) => {
    setActiveComplaintId(complaintId);
    setChatModal(true);
    setCurrentChat([
      { sender: "employee", text: "Hello, how can I help?", timestamp: new Date().toISOString() },
    ]);
  };

  const sendMessage = () => {
    if (!chatInput.trim()) return;
    const msg: ChatMessage = { sender: "user", text: chatInput, timestamp: new Date().toISOString() };
    setCurrentChat((prev) => [...prev, msg]);
    setChatInput("");
    setTimeout(() => {
      setCurrentChat((prev) => [
        ...prev,
        { sender: "employee", text: "Received your message.", timestamp: new Date().toISOString() },
      ]);
    }, 1000);
  };

  const statusColor = (status: Complaint["status"]) => {
    switch (status) {
      case "pending": return "#F59E0B";
      case "assigned": return "#3B82F6";
      case "resolved": return "#10B981";
      default: return colors.text;
    }
  };

  const openOptions = (complaint: Complaint) => {
    setSelectedComplaint(complaint);
    setOptionsModal(true);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.topPaddingWrapper}>
        <Text style={[styles.headerText, { color: colors.text }]}>My Complaints</Text>

        {/* Tabs */}
        <View style={styles.tabs}>
          {["all", "common", "private"].map((t) => (
            <TouchableOpacity
              key={t}
              onPress={() => setTab(t as any)}
              style={[styles.tabButton, { backgroundColor: tab === t ? colors.primary : colors.border }]}
            >
              <Text style={{ color: tab === t ? "#fff" : colors.text }}>{t.toUpperCase()}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* New Complaint */}
        <TouchableOpacity
          style={[styles.newButton, { backgroundColor: colors.primary }]}
          onPress={() => {
            setEditingComplaint(null);
            setNewTitle("");
            setNewDesc("");
            setNewType("common");
            setShowModal(true);
          }}
        >
          <Text style={{ color: "#fff", fontWeight: "bold" }}>+ New Complaint</Text>
        </TouchableOpacity>

        {/* Complaint List */}
        <FlatList
          data={filteredComplaints}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                setActiveComplaint(item);
                setViewModal(true);
              }}
              style={[styles.card, { backgroundColor: colors.card }]}
            >
              {/* Three-dot menu */}
              <TouchableOpacity
                onPress={() => openOptions(item)}
                style={{ position: "absolute", top: 10, right: 10, padding: 6 }}
              >
                <Text style={{ fontSize: 22, color: colors.text }}>⋮</Text>
              </TouchableOpacity>

              <Text style={[styles.title, { color: colors.text, marginTop: 6 }]}>{item.title}</Text>
              <Text style={{ color: statusColor(item.status), fontWeight: "bold", marginTop: 4 }}>
                {item.status.toUpperCase()}
              </Text>
              <Text style={{ color: colors.text }}>Type: {item.complaint_type}</Text>

              {/* Chat button */}
              {item.status === "assigned" && item.employee_id && (
                <View style={{ marginTop: 10 }}>
                  <TouchableOpacity
                    onPress={() => openChat(item.id)}
                    style={[styles.smallButton, { backgroundColor: "#10B981" }]}
                  >
                    <Text style={styles.buttonText}>Chat</Text>
                  </TouchableOpacity>
                </View>
              )}
            </TouchableOpacity>
          )}
        />

        {/* Options Modal */}
        <Modal visible={optionsModal} transparent animationType="fade">
          <TouchableOpacity
            style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.3)", justifyContent: "center", alignItems: "center" }}
            onPress={() => setOptionsModal(false)}
            activeOpacity={1}
          >
            <View style={{ backgroundColor: colors.card, borderRadius: 8, width: 200, padding: 12 }}>
              <TouchableOpacity
                style={styles.optionButton}
                onPress={() => {
                  setEditingComplaint(selectedComplaint);
                  setNewTitle(selectedComplaint!.title);
                  setNewDesc(selectedComplaint!.description);
                  setNewType(selectedComplaint!.complaint_type);
                  setShowModal(true);
                  setOptionsModal(false);
                }}
              >
                <Text style={styles.optionText}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.optionButton}
                onPress={() => {
                  if (selectedComplaint) deleteComplaint(selectedComplaint.id);
                  setOptionsModal(false);
                }}
              >
                <Text style={[styles.optionText, { color: "red" }]}>Delete</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </Modal>

        {/* View Complaint Modal */}
        <Modal visible={viewModal} transparent animationType="slide">
          <KeyboardAvoidingView style={styles.modalContainer}>
            <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>Complaint Details</Text>
              <ScrollView>
                <Text style={{ color: colors.text, fontWeight: "bold" }}>Title:</Text>
                <Text style={{ color: colors.text, marginBottom: 8 }}>{activeComplaint?.title}</Text>
                <Text style={{ color: colors.text, fontWeight: "bold" }}>Description:</Text>
                <Text style={{ color: colors.text, marginBottom: 8 }}>{activeComplaint?.description}</Text>
                <Text style={{ color: colors.text, fontWeight: "bold" }}>Type:</Text>
                <Text style={{ color: colors.text, marginBottom: 8 }}>{activeComplaint?.complaint_type}</Text>
                <Text style={{ color: colors.text, fontWeight: "bold" }}>Status:</Text>
                <Text style={{ color: colors.text, marginBottom: 8 }}>{activeComplaint?.status}</Text>
              </ScrollView>
              <TouchableOpacity style={[styles.modalCancel, { marginTop: 10 }]} onPress={() => setViewModal(false)}>
                <Text style={{ color: colors.text, textAlign: "center" }}>Close</Text>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </Modal>

        {/* Add/Edit Modal */}
        <Modal visible={showModal} transparent animationType="slide">
          <KeyboardAvoidingView style={styles.modalContainer}>
            <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>
                {editingComplaint ? "Edit Complaint" : "New Complaint"}
              </Text>
              <TextInput placeholder="Title" value={newTitle} onChangeText={setNewTitle} style={styles.input} />
              <TextInput
                placeholder="Description"
                value={newDesc}
                onChangeText={setNewDesc}
                multiline
                style={[styles.input, { height: 80 }]}
              />
              <Text style={{ marginBottom: 8, color: colors.text }}>Type:</Text>
              <View style={{ flexDirection: "row", marginBottom: 12 }}>
                {["common", "private"].map((t) => (
                  <TouchableOpacity
                    key={t}
                    onPress={() => setNewType(t as any)}
                    style={[
                      styles.typeButton,
                      { backgroundColor: newType === t ? colors.submit : colors.border },
                    ]}
                  >
                    <Text style={{ color: newType === t ? "#fff" : colors.text }}>{t.toUpperCase()}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <TouchableOpacity
                  style={[styles.modalSubmit, { flex: 1, marginRight: 8 }]}
                  onPress={submitComplaint}
                  disabled={loading}
                >
                  {loading ? <ActivityIndicator color="#fff" /> : <Text style={{ color: "#fff" }}>{editingComplaint ? "Save" : "Submit"}</Text>}
                </TouchableOpacity>
                <TouchableOpacity style={[styles.modalCancel, { flex: 1 }]} onPress={() => setShowModal(false)}>
                  <Text style={{ color: colors.text, textAlign: "center" }}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>
        </Modal>

        {/* Chat Modal */}
        <Modal visible={chatModal} transparent animationType="slide">
          <KeyboardAvoidingView style={styles.modalContainer}>
            <View style={[styles.chatContent, { backgroundColor: colors.card }]}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>Chat</Text>
              <ScrollView
                style={{ flex: 1 }}
                ref={scrollRef}
                onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}
              >
                {currentChat.map((msg, index) => (
                  <View
                    key={index}
                    style={[
                      styles.chatMessage,
                      {
                        alignSelf: msg.sender === "user" ? "flex-end" : "flex-start",
                        backgroundColor: msg.sender === "user" ? colors.submit : colors.border,
                      },
                    ]}
                  >
                    <Text style={{ color: msg.sender === "user" ? "#fff" : colors.text }}>{msg.text}</Text>
                    <Text style={{ fontSize: 10, color: colors.text, marginTop: 2 }}>
                      {new Date(msg.timestamp).toLocaleTimeString()}
                    </Text>
                  </View>
                ))}
              </ScrollView>
              <View style={{ flexDirection: "row", marginTop: 8 }}>
                <TextInput
                  value={chatInput}
                  onChangeText={setChatInput}
                  placeholder="Type a message"
                  style={[styles.input, { flex: 1, marginBottom: 0, height: 40 }]}
                />
                <TouchableOpacity
                  onPress={sendMessage}
                  style={[styles.modalSubmit, { marginLeft: 8, paddingHorizontal: 16 }]}
                >
                  <Text style={{ color: "#fff" }}>Send</Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity style={{ marginTop: 8 }} onPress={() => setChatModal(false)}>
                <Text style={{ color: colors.text, textAlign: "center" }}>Close</Text>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </Modal>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  topPaddingWrapper: { flex: 1, paddingTop: 20, paddingHorizontal: 16 },
  headerText: { fontSize: 22, fontWeight: "bold", marginBottom: 12 },
  tabs: { flexDirection: "row", marginBottom: 12 },
  tabButton: { marginRight: 8, paddingVertical: 8, paddingHorizontal: 16, borderRadius: 6 },
  newButton: { padding: 12, borderRadius: 8, alignItems: "center", marginBottom: 12 },
  card: { padding: 16, borderRadius: 10, marginBottom: 12, borderWidth: 1, borderColor: "#E5E7EB" },
  title: { fontSize: 16, fontWeight: "bold", marginBottom: 6 },
  smallButton: { paddingVertical: 6, paddingHorizontal: 10, borderRadius: 6, alignItems: "center", justifyContent: "center" },
  buttonText: { color: "#fff", fontSize: 14, fontWeight: "500" },
  modalContainer: { flex: 1, backgroundColor: "rgba(0,0,0,0.4)", justifyContent: "center", alignItems: "center" },
  modalContent: { width: "90%", borderRadius: 12, padding: 20, maxHeight: "90%" },
  chatContent: { width: "90%", borderRadius: 12, padding: 16, height: "70%" },
  modalTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 12 },
  input: { borderWidth: 1, borderColor: "#CBD5E1", borderRadius: 8, padding: 10, marginBottom: 12 },
  modalSubmit: { padding: 12, borderRadius: 8, alignItems: "center", backgroundColor: "#10B981" },
  modalCancel: { padding: 12, borderRadius: 8, alignItems: "center", backgroundColor: "#E5E7EB" },
  typeButton: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: 6, marginRight: 8 },
  optionButton: { paddingVertical: 10 },
  optionText: { fontSize: 16 },
  chatMessage: { padding: 8, borderRadius: 8, marginBottom: 6, maxWidth: "80%" },
});
