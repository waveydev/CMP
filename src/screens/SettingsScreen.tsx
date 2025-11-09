import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useAuth } from '../auth/AuthProvider';

export default function SettingsScreen() {
  const { user, logout } = useAuth();
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>
      <Text style={styles.label}>Role</Text>
      <Text style={styles.value}>{user?.role}</Text>
      <Text style={styles.label}>Region</Text>
      <Text style={styles.value}>{user?.region ?? '-'}</Text>
      <View style={{ height: 16 }} />
      <Pressable style={styles.dangerBtn} onPress={logout}>
        <Text style={styles.dangerBtnText}>Log Out</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 22, fontWeight: '800', marginBottom: 12, color: '#065F46' },
  label: { marginTop: 8, color: '#6B7280', fontWeight: '600' },
  value: { color: '#064E3B', fontWeight: '700' },
  dangerBtn: { backgroundColor: '#DC2626', paddingVertical: 12, borderRadius: 12, alignItems: 'center' },
  dangerBtnText: { color: '#fff', fontWeight: '800' },
});
