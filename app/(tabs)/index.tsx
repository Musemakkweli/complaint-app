import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleLogin = () => {
    router.replace('/(tabs)'); // navigate to main app
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.card}>
        {/* Header */}
        <ThemedText type="title" style={styles.title}>Welcome Back</ThemedText>
        <ThemedText type="subtitle" style={styles.subtitle}>CPP</ThemedText>
        <ThemedText type="default" style={styles.instruction}>
          Please enter your email and password to login.
        </ThemedText>

        {/* Email input */}
        <TextInput
          style={styles.input}
          placeholder="Email"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
          placeholderTextColor="#9CA3AF"
        />

        {/* Password input */}
        <View style={styles.passwordContainer}>
          <TextInput
            style={[styles.input, { flex: 1, marginBottom: 0 }]}
            placeholder="Password"
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
            placeholderTextColor="#9CA3AF"
          />
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            style={styles.eyeButton}
          >
            <Feather
              name={showPassword ? 'eye' : 'eye-off'}
              size={20}
              color="#0EA5E9"
            />
          </TouchableOpacity>
        </View>

        {/* Login button */}
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <ThemedText type="title" style={styles.buttonText}>Login</ThemedText>
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6', // neutral background
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  card: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 40,       // increased padding
    alignItems: 'center',
    minHeight: 500,    // taller card
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0EA5E9', // sky blue
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#0EA5E9', // sky blue
    marginBottom: 12,
  },
  instruction: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 32,   // more spacing
  },
  input: {
    width: '100%',
    backgroundColor: '#F3F4F6',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginBottom: 16,
    fontSize: 16,
    color: '#111827',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 32,   // more space before button
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
  },
  eyeButton: {
    padding: 14,
  },
  button: {
    backgroundColor: '#0EA5E9', // sky blue button
    width: '100%',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
});
