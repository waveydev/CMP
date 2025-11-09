import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useAuth } from '../auth/AuthProvider';

export default function SettingsScreen() {
  const { user, logout } = useAuth();
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>
      <Text>Role: {user?.role}</Text>
      <Text>Region: {user?.region ?? '-'}</Text>
      <View style={{ height: 16 }} />
      <Button title="Log Out" onPress={logout} color="#cc0000" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 20, fontWeight: '700', marginBottom: 12 },
});
