import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  StatusBar,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useTheme } from "../../context/ThemeContext";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { theme, toggleTheme } = useTheme();
  const darkMode = theme === "dark";

  const router = useRouter();

  // 🔐 LOGIN HANDLER (CONNECTED TO BACKEND)
  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter email and password");
      return;
    }

    setLoading(true);

    try {
    const response = await fetch("http://192.168.1.89:8000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        Alert.alert("Login Failed", data.detail || "Invalid credentials");
        setLoading(false);
        return;
      }

      console.log("Login successful:", data);

      // 🔐 Later you can store token here
      // await AsyncStorage.setItem("token", data.access_token);

      router.replace("/(tabs)/dashboard");
    } catch (error) {
      console.error(error);
      Alert.alert("Network Error", "Cannot connect to server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemedView
      style={[
        styles.container,
        { backgroundColor: darkMode ? "#111827" : "#F3F4F6" },
      ]}
    >
      <StatusBar
        barStyle={darkMode ? "light-content" : "dark-content"}
        backgroundColor={darkMode ? "#111827" : "#F3F4F6"}
      />

      {/* Theme toggle button */}
      <TouchableOpacity style={styles.themeToggle} onPress={toggleTheme}>
        <Feather
          name={darkMode ? "sun" : "moon"}
          size={22}
          color={darkMode ? "#FACC15" : "#0EA5E9"}
        />
      </TouchableOpacity>

      <View
        style={[
          styles.card,
          { backgroundColor: darkMode ? "#1F2937" : "#fff" },
        ]}
      >
        {/* Header */}
        <ThemedText
          type="title"
          style={[
            styles.title,
            { color: darkMode ? "#E5E7EB" : "#0EA5E9" },
          ]}
        >
          Welcome Back
        </ThemedText>

        <ThemedText
          type="subtitle"
          style={[
            styles.subtitle,
            { color: darkMode ? "#E5E7EB" : "#0EA5E9" },
          ]}
        >
          Complaint Portal
        </ThemedText>

        <ThemedText
          type="default"
          style={[
            styles.instruction,
            { color: darkMode ? "#CBD5E1" : "#6B7280" },
          ]}
        >
          Please enter your email and password to login.
        </ThemedText>

        {/* Email Input */}
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: darkMode ? "#374151" : "#F3F4F6",
              color: darkMode ? "#E5E7EB" : "#111827",
            },
          ]}
          placeholder="Email or Employee ID"
          keyboardType="email-address"
          placeholderTextColor="#9CA3AF"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
        />

        {/* Password Input */}
        <View
          style={[
            styles.passwordContainer,
            { backgroundColor: darkMode ? "#374151" : "#F3F4F6" },
          ]}
        >
          <TextInput
            style={{
              flex: 1,
              paddingVertical: 14,
              paddingHorizontal: 20,
              color: darkMode ? "#E5E7EB" : "#111827",
            }}
            placeholder="Password"
            secureTextEntry={!showPassword}
            placeholderTextColor="#9CA3AF"
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            style={styles.eyeButton}
          >
            <Feather
              name={showPassword ? "eye" : "eye-off"}
              size={20}
              color="#0EA5E9"
            />
          </TouchableOpacity>
        </View>

        {/* Login Button */}
        <TouchableOpacity
          style={[styles.button, loading && { opacity: 0.7 }]}
          onPress={handleLogin}
          disabled={loading}
        >
          <ThemedText type="title" style={styles.buttonText}>
            {loading ? "Logging in..." : "Login"}
          </ThemedText>
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  card: {
    width: "100%",
    maxWidth: 400,
    borderRadius: 20,
    padding: 40,
    alignItems: "center",
    minHeight: 500,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
  },
  title: { fontSize: 28, fontWeight: "bold", marginBottom: 4 },
  subtitle: { fontSize: 20, fontWeight: "600", marginBottom: 12 },
  instruction: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 32,
  },
  input: {
    width: "100%",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginBottom: 32,
    borderRadius: 12,
  },
  eyeButton: { padding: 14 },
  button: {
    backgroundColor: "#0EA5E9",
    width: "100%",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 18 },
  themeToggle: {
    position: "absolute",
    top: 50,
    right: 24,
    zIndex: 10,
    backgroundColor: "#E5E7EB",
    padding: 10,
    borderRadius: 999,
  },
});
