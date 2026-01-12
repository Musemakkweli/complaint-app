import { ThemedView } from "@/components/themed-view";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
    Alert,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import API_URL from "../constants/api";
import { useTheme } from "../context/ThemeContext";

export default function RegisterScreen() {
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const darkMode = theme === "dark";

  const [step, setStep] = useState<1 | 2>(1);
  const [fullname, setFullname] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleNext = () => {
    if (!fullname.trim() || !phone.trim() || !email.trim()) {
      Alert.alert("Error", "Please fill all fields before proceeding.");
      return;
    }
    setStep(2);
  };

  const handleBack = () => setStep(1);

  const handleRegister = async () => {
    if (!password.trim() || !confirmPassword.trim()) {
      Alert.alert("Error", "Please fill both password fields");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullname,
          phone,
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        Alert.alert("Registration Failed", data.detail || data.message || "Error");
        return;
      }

      Alert.alert("Success", data.message || "Registered successfully!", [
        { text: "Login", onPress: () => router.replace("/") },
      ]);
    } catch (err) {
      console.error(err);
      Alert.alert("Network Error", "Cannot connect to server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemedView style={[styles.container, { backgroundColor: darkMode ? "#111827" : "#F3F4F6" }]}>
      <StatusBar barStyle={darkMode ? "light-content" : "dark-content"} />

      {/* THEME TOGGLE */}
      <TouchableOpacity onPress={toggleTheme} style={styles.themeToggle}>
        <Feather
          name={darkMode ? "sun" : "moon"}
          size={22}
          color={darkMode ? "#FACC15" : "#0EA5E9"}
        />
      </TouchableOpacity>

      <KeyboardAwareScrollView
        contentContainerStyle={{ flexGrow: 1, justifyContent: "center", alignItems: "center", padding: 16 }}
        enableOnAndroid
        keyboardShouldPersistTaps="handled"
        extraScrollHeight={20}
      >
        <View style={[styles.card, { backgroundColor: darkMode ? "#1F2937" : "#fff" }]}>
          {/* TITLE */}
          <Text style={[styles.title, { color: darkMode ? "#E5E7EB" : "#111827" }]}>Create Account</Text>
          <Text style={[styles.subtitle, { color: darkMode ? "#CBD5E1" : "#0EA5E9" }]}>Complaint Portal</Text>
          <Text style={{ textAlign: "center", marginBottom: 16, color: darkMode ? "#CBD5E1" : "#6B7280" }}>
            Step {step} of 2
          </Text>

          {/* STEP 1 */}
          {step === 1 && (
            <>
              <TextInput
                style={[styles.input, inputStyle(darkMode)]}
                placeholder="Full Name"
                placeholderTextColor="#9CA3AF"
                value={fullname}
                onChangeText={setFullname}
              />
              <TextInput
                style={[styles.input, inputStyle(darkMode)]}
                placeholder="Phone"
                placeholderTextColor="#9CA3AF"
                keyboardType="phone-pad"
                value={phone}
                onChangeText={setPhone}
              />
              <TextInput
                style={[styles.input, inputStyle(darkMode)]}
                placeholder="Email"
                placeholderTextColor="#9CA3AF"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />

              <View style={styles.actionRow}>
                <TouchableOpacity style={styles.smallButton} onPress={handleNext}>
                  <Text style={styles.smallButtonText}>Next</Text>
                </TouchableOpacity>
              </View>
            </>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <>
              <View style={[styles.passwordContainer, inputStyle(darkMode)]}>
                <TextInput
                  style={{ flex: 1, color: darkMode ? "#E5E7EB" : "#111827" }}
                  placeholder="Password"
                  placeholderTextColor="#9CA3AF"
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={setPassword}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  <Feather name={showPassword ? "eye" : "eye-off"} size={20} color="#0EA5E9" />
                </TouchableOpacity>
              </View>

              <View style={[styles.passwordContainer, inputStyle(darkMode)]}>
                <TextInput
                  style={{ flex: 1, color: darkMode ? "#E5E7EB" : "#111827" }}
                  placeholder="Confirm Password"
                  placeholderTextColor="#9CA3AF"
                  secureTextEntry={!showConfirmPassword}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                />
                <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                  <Feather name={showConfirmPassword ? "eye" : "eye-off"} size={20} color="#0EA5E9" />
                </TouchableOpacity>
              </View>

              <View style={styles.actionRow}>
                <TouchableOpacity style={styles.smallButton} onPress={handleBack}>
                  <Text style={styles.smallButtonText}>Back</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.primaryButton, loading && { opacity: 0.6 }]} onPress={handleRegister}>
                  <Text style={styles.primaryButtonText}>{loading ? "Registering..." : "Register"}</Text>
                </TouchableOpacity>
              </View>
            </>
          )}

          {/* LOGIN LINK */}
          <TouchableOpacity onPress={() => router.replace("/")}>
            <Text style={styles.loginText}>
              Already have an account?<Text style={styles.loginLink}> Login</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAwareScrollView>
    </ThemedView>
  );
}

// ================= STYLES =================
const inputStyle = (dark: boolean) => ({
  backgroundColor: dark ? "#374151" : "#F9FAFB",
  color: dark ? "#E5E7EB" : "#111827",
});

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 16 },
  card: { width: "100%", maxWidth: 400, borderRadius: 22, padding: 28 },
  title: { fontSize: 26, fontWeight: "bold", marginBottom: 4, textAlign: "center" },
  subtitle: { fontSize: 20, fontWeight: "600", marginBottom: 16, textAlign: "center" },
  input: { width: "100%", padding: 14, borderRadius: 12, marginBottom: 14 },
  passwordContainer: { flexDirection: "row", alignItems: "center", padding: 14, borderRadius: 12, marginBottom: 14 },
  actionRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 10 },
  smallButton: { backgroundColor: "#E5E7EB", paddingVertical: 14, paddingHorizontal: 20, borderRadius: 12, flex: 1, marginRight: 10, alignItems: "center" },
  smallButtonText: { color: "#111827", fontWeight: "600" },
  primaryButton: { backgroundColor: "#0EA5E9", paddingVertical: 16, borderRadius: 14, alignItems: "center", flex: 1 },
  primaryButtonText: { color: "#FFF", fontSize: 16, fontWeight: "bold" },
  loginText: { textAlign: "center", marginTop: 18, color: "#6B7280" },
  loginLink: { color: "#0EA5E9", fontWeight: "bold" },
  themeToggle: { position: "absolute", top: 50, right: 24, zIndex: 10, padding: 10, borderRadius: 999, backgroundColor: "#E5E7EB" },
});
