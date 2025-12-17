import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function CustomerComplaints() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Customer Complaints Screen</Text>
      {/* Later you can add the form + table here */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  text: { fontSize: 18, fontWeight: 'bold' },
});
