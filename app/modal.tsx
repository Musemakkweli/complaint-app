import { Link } from 'expo-router';
import { StyleSheet } from 'react-native';

import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Fonts } from '@/constants/theme';

export default function AboutAppScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#E5E7EB', dark: '#1F2933' }}
      headerImage={
        <IconSymbol
          size={280}
          color="#4B5563"
          name="info.circle"
          style={styles.headerImage}
        />
      }
    >
      {/* Title */}
      <ThemedView style={styles.titleContainer}>
        <ThemedText
          type="title"
          style={{ fontFamily: Fonts.rounded }}
        >
          About the App
        </ThemedText>
      </ThemedView>

      {/* Description */}
      <ThemedText style={styles.text}>
        This Customer Complaint Application is designed to help users submit,
        track, and manage service-related complaints efficiently.
      </ThemedText>

      {/* How it Works */}
      <ThemedView style={styles.section}>
        <ThemedText type="subtitle">How It Works</ThemedText>
        <ThemedText style={styles.text}>
          1. Users log in using their registered credentials.
        </ThemedText>
        <ThemedText style={styles.text}>
          2. Submit complaints by providing details about the issue.
        </ThemedText>
        <ThemedText style={styles.text}>
          3. Complaints are recorded and assigned a status (Pending, In Progress, Resolved).
        </ThemedText>
        <ThemedText style={styles.text}>
          4. Users can track the progress of their complaints directly from the dashboard.
        </ThemedText>
      </ThemedView>

      {/* Purpose */}
      <ThemedView style={styles.section}>
        <ThemedText type="subtitle">Purpose of the System</ThemedText>
        <ThemedText style={styles.text}>
          The goal of this application is to improve communication between customers
          and the service provider, ensure transparency, and enhance service quality
          through effective complaint management.
        </ThemedText>
      </ThemedView>

      {/* Link to Login */}
      <Link href="/" dismissTo style={styles.link}>
        <ThemedText type="link">Go to Login Screen</ThemedText>
      </Link>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    bottom: -80,
    left: -30,
    position: 'absolute',
  },
  titleContainer: {
    marginBottom: 12,
  },
  section: {
    marginTop: 20,
  },
  text: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 10,
    opacity: 0.85,
  },
  link: {
    marginTop: 25,
    paddingVertical: 10,
    textAlign: 'center',
  },
});
