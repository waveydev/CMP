import React from 'react';
import { View, Text, Button, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
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
        <Button title="Settings" onPress={() => navigation.navigate('Settings')} />
      </View>

      {isLoading && <Text>Loading...</Text>}
      {error && <Text style={{ color: 'red' }}>Failed to load</Text>}

      <FlatList
        data={data || []}
        keyExtractor={(item) => String(item.id)}
        onRefresh={refetch}
        refreshing={isLoading}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => navigation.navigate('MemberForm', { id: String(item.id) })}
            style={styles.row}
          >
            <Text style={styles.rowTitle}>
              {item.first_name} {item.last_name}
            </Text>
            <Text style={styles.rowSub}>{item.national_number}</Text>
          </TouchableOpacity>
        )}
      />

      <Button title="Add Member" onPress={() => navigation.navigate('MemberForm')} />
      <View style={{ height: 12 }} />
      <Button title="Log Out" onPress={logout} color="#cc0000" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, gap: 12 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontSize: 20, fontWeight: '700' },
  row: { paddingVertical: 12, borderBottomWidth: 1, borderColor: '#eee' },
  rowTitle: { fontSize: 16, fontWeight: '600' },
  rowSub: { color: '#666' },
});
