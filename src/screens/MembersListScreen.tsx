import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Pressable } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppStackParamList } from '../navigation/AppNavigator';
import { useQuery } from '@tanstack/react-query';
import { api } from '../services/api';
import { useAuth } from '../auth/AuthProvider';

export type MembersListProps = NativeStackScreenProps<AppStackParamList, 'Members'>;

export default function MembersListScreen({ navigation }: MembersListProps) {
  const { logout } = useAuth();
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['members'],
    queryFn: () => api.listMembers(),
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Members</Text>
        <Pressable style={styles.secondaryBtn} onPress={() => navigation.navigate('Settings')}>
          <Text style={styles.secondaryBtnText}>Settings</Text>
        </Pressable>
      </View>

      {isLoading && <Text>Loading...</Text>}
      {error && <Text style={{ color: 'red' }}>Failed to load</Text>}

      <FlatList
        data={data || []}
        keyExtractor={(item) => String(item.id)}
        onRefresh={refetch}
        refreshing={isLoading}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => navigation.navigate('MemberForm', { id: String(item.id) })} style={styles.row}>
            <Text style={styles.rowTitle}>
              {item.first_name} {item.last_name}
            </Text>
            <Text style={styles.rowSub}>{item.national_number}</Text>
          </TouchableOpacity>
        )}
      />
      <Pressable style={styles.fab} onPress={() => navigation.navigate('MemberForm')}>
        <Text style={styles.fabText}>+ Add</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, gap: 12 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontSize: 22, fontWeight: '800', color: '#065F46' },
  row: { paddingVertical: 14, borderBottomWidth: 1, borderColor: '#E5E7EB' },
  rowTitle: { fontSize: 16, fontWeight: '600', color: '#064E3B' },
  rowSub: { color: '#6B7280' },
  secondaryBtn: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 999, backgroundColor: '#ECFDF5' },
  secondaryBtnText: { color: '#047857', fontWeight: '700' },
  fab: { position: 'absolute', right: 16, bottom: 16, backgroundColor: '#10B981', paddingVertical: 12, paddingHorizontal: 18, borderRadius: 999, elevation: 3 },
  fabText: { color: '#fff', fontWeight: '800' },
});
