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
      <ThemedView style={styles.titleContainer}>
        <ThemedText
          type="title"
          style={{ fontFamily: Fonts.rounded }}
        >
          About the App
        </ThemedText>
      </ThemedView>

      <ThemedText style={styles.text}>
        This Customer Complaint Application is designed to help users submit,
        track, and manage service-related complaints in a simple and efficient way.
      </ThemedText>

      <ThemedView style={styles.section}>
        <ThemedText type="subtitle">How It Works</ThemedText>

        <ThemedText style={styles.text}>
          1. Users log in to the system using their registered credentials.
        </ThemedText>

        <ThemedText style={styles.text}>
          2. After logging in, users can submit a complaint by providing details
          about the issue they are facing.
        </ThemedText>

        <ThemedText style={styles.text}>
          3. Submitted complaints are recorded in the system and assigned a status
          such as Pending, In Progress, or Resolved.
        </ThemedText>

        <ThemedText style={styles.text}>
          4. Users can track the progress of their complaints directly from the dashboard.
        </ThemedText>
      </ThemedView>

      <ThemedView style={styles.section}>
        <ThemedText type="subtitle">Purpose of the System</ThemedText>

        <ThemedText style={styles.text}>
          The goal of this application is to improve communication between customers
          and the service provider, ensure transparency, and enhance service quality
          through effective complaint management.
        </ThemedText>
      </ThemedView>
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
});
