import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useTheme } from "../../context/ThemeContext";
import { useUser } from "../../context/UserContext";

const API_URL = "http://192.168.1.81:8000"; // your backend IP

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

export default function CustomerComplaints() {
  const { theme } = useTheme();
  const { user } = useUser();

  /** ✅ SAFE USER ID (fixes TS error) */
  const userId = user?.id;
  if (!userId) return null;

  const colors = {
    background: theme === "dark" ? "#1E293B" : "#F3F4F6",
    card: theme === "dark" ? "#334155" : "#FFFFFF",
    text: theme === "dark" ? "#F1F5F9" : "#111827",
    border: theme === "dark" ? "#475569" : "#E5E7EB",
    activeTab: "#0EA5E9",
    button: "#3B82F6",
    submit: "#10B981",
  };

  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [tab, setTab] = useState<"all" | "common" | "private">("all");
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newType, setNewType] = useState<"common" | "private">("common");

  /* ---------------- FETCH COMPLAINTS ---------------- */
  useEffect(() => {
    fetch(`${API_URL}/complaints/user/${userId}`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setComplaints(data);
        }
      })
      .catch((err) => console.error("Fetch error:", err));
  }, [userId]);

  /* ---------------- FILTER ---------------- */
  const filteredComplaints = useMemo(() => {
    if (tab === "all") return complaints;
    return complaints.filter((c) => c.complaint_type === tab);
  }, [tab, complaints]);

  /* ---------------- ADD COMPLAINT ---------------- */
  async function addComplaint() {
    if (!newTitle.trim()) return;

    setLoading(true);

    try {
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

      if (!res.ok) {
        console.error("Submit failed");
        setLoading(false);
        return;
      }

      const created: Complaint = await res.json();

      if (created?.id) {
        setComplaints((prev) => [created, ...prev]);
      }

      setShowModal(false);
      setNewTitle("");
      setNewDesc("");
      setNewType("common");
    } catch (err) {
      console.error("Submit error:", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.topPaddingWrapper}>
        <Text style={[styles.headerText, { color: colors.text }]}>
          My Complaints
        </Text>

        {/* Tabs */}
        <View style={styles.tabs}>
          {["all", "common", "private"].map((t) => (
            <TouchableOpacity
              key={t}
              onPress={() => setTab(t as any)}
              style={[
                styles.tabButton,
                { backgroundColor: tab === t ? colors.activeTab : colors.border },
              ]}
            >
              <Text style={{ color: tab === t ? "#fff" : colors.text }}>
                {t.toUpperCase()}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Add Button */}
        <TouchableOpacity
          style={[styles.newButton, { backgroundColor: colors.button }]}
          onPress={() => setShowModal(true)}
        >
          <Text style={{ color: "#fff", fontWeight: "bold" }}>
            + New Complaint
          </Text>
        </TouchableOpacity>

        {/* Complaints List */}
        <FlatList
          data={filteredComplaints}
          keyExtractor={(item, index) =>
            item?.id ? item.id.toString() : index.toString()
          }
          renderItem={({ item }) => (
            <View style={[styles.card, { backgroundColor: colors.card }]}>
              <Text style={[styles.title, { color: colors.text }]}>
                {item.title}
              </Text>
              <Text style={{ color: colors.text }}>
                Status: {item.status}
              </Text>
              <Text style={{ color: colors.text }}>
                Type: {item.complaint_type}
              </Text>
            </View>
          )}
        />

        {/* ADD MODAL */}
        <Modal visible={showModal} transparent animationType="slide">
          <View style={styles.modalContainer}>
            <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>
                New Complaint
              </Text>

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

              <TouchableOpacity
                style={[
                  styles.modalSubmit,
                  { backgroundColor: colors.submit },
                ]}
                onPress={addComplaint}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={{ color: "#fff" }}>Submit</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </View>
  );
}

/* ---------------- STYLES ---------------- */
const styles = StyleSheet.create({
  container: { flex: 1 },
  topPaddingWrapper: { flex: 1, paddingTop: 40, paddingHorizontal: 16 },
  headerText: { fontSize: 22, fontWeight: "bold", marginBottom: 12 },
  tabs: { flexDirection: "row", marginBottom: 10 },
  tabButton: {
    marginRight: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
  },
  newButton: {
    padding: 10,
    borderRadius: 6,
    alignItems: "center",
    marginBottom: 10,
  },
  card: { padding: 12, borderRadius: 6, marginBottom: 8 },
  title: { fontSize: 16, fontWeight: "bold" },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "90%",
    borderRadius: 8,
    padding: 16,
  },
  modalTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 12 },
  input: {
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 6,
    padding: 8,
    marginBottom: 12,
  },
  modalSubmit: {
    padding: 10,
    borderRadius: 6,
    alignItems: "center",
  },
});
