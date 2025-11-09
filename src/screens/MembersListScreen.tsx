import React, { useMemo, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { FAB, Appbar, Searchbar, List, ActivityIndicator, Snackbar, Chip } from 'react-native-paper';
import * as FS from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { TabParamList } from '../navigation/AppNavigator';
import { useQuery } from '@tanstack/react-query';
import { api } from '../services/api';
// import { useAuth } from '../auth/AuthProvider';

export type MembersListProps = BottomTabScreenProps<TabParamList, 'MembersTab'>;

export default function MembersListScreen({ navigation }: MembersListProps) {
  const rootNavigation = navigation.getParent();
  const [query, setQuery] = useState('');
  const [snack, setSnack] = useState<string | null>(null);
  const { data, isLoading, error, refetch, isRefetching } = useQuery({
    queryKey: ['members'],
    queryFn: () => api.listMembers(),
  });

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return data || [];
    return (data || []).filter(m =>
      `${m.first_name} ${m.last_name}`.toLowerCase().includes(q) ||
      String(m.national_number).toLowerCase().includes(q) ||
      (m.jamaat || '').toLowerCase().includes(q)
    );
  }, [data, query]);

  const sorted = useMemo(() => {
    const arr = [...filtered];
    arr.sort((a, b) => {
      if (a.is_active !== b.is_active) return a.is_active ? -1 : 1;
      return `${a.last_name} ${a.first_name}`.localeCompare(`${b.last_name} ${b.first_name}`);
    });
    return arr;
  }, [filtered]);

  const exportCSV = async () => {
    try {
      const rows = [
        [
          'id','first_name','last_name','national_number','jamaat','date_of_birth','gender','family_situation','children_count','children_over_15_count','spouse_is_ahmadi','salary_mad','salary_type','monthly_tchanda','is_mousi','is_active','jamaat_role'
        ],
        ...sorted.map(m => [
          m.id, m.first_name, m.last_name, m.national_number, m.jamaat, m.date_of_birth, m.gender, m.family_situation,
          m.children_count, m.children_over_15_count, m.spouse_is_ahmadi ? 'Yes' : 'No', m.salary_mad, m.salary_type,
          m.monthly_tchanda, m.is_mousi ? 'Yes' : 'No', m.is_active ? 'Active' : 'Inactive', m.jamaat_role
        ])
      ];
      const csv = rows.map(r => r.map(v => `"${String(v ?? '').replace(/"/g, '""')}"`).join(',')).join('\n');
      const dir = (FS as any).cacheDirectory || (FS as any).documentDirectory || '';
      const fileUri = `${dir}members_${Date.now()}.csv`;
      await (FS as any).writeAsStringAsync(fileUri, csv);
      const available = await Sharing.isAvailableAsync();
      if (available) {
        await Sharing.shareAsync(fileUri, { mimeType: 'text/csv', dialogTitle: 'Export Members CSV' });
      } else {
        setSnack('CSV saved to cache');
      }
    } catch (e) {
      setSnack('Export failed');
    }
  };

  return (
    <View style={styles.container}>
      <Appbar.Header mode="small" style={{ backgroundColor: '#FFFFFF' }}>
        <Appbar.Content title="Members" titleStyle={styles.title} />
        <Appbar.Action icon="download" onPress={exportCSV} />
        <Appbar.Action icon="cog" onPress={() => navigation.navigate('SettingsTab')} />
      </Appbar.Header>

      <View style={styles.searchWrap}>
        <Searchbar
          placeholder="Search by name, number, jamaat"
          value={query}
          onChangeText={setQuery}
          onClearIconPress={() => setQuery('')}
        />
      </View>

      {isLoading && (
        <View style={styles.center}>
          <ActivityIndicator animating color="#10B981" />
          <Text style={{ marginTop: 8, color: '#6B7280' }}>Loading members…</Text>
        </View>
      )}

      {!isLoading && !error && (
        <FlatList
          data={sorted}
          keyExtractor={(item) => String(item.id)}
          onRefresh={refetch}
          refreshing={isRefetching}
          ListEmptyComponent={
            <View style={styles.center}>
              <Text style={{ color: '#6B7280', marginBottom: 12 }}>No members found.</Text>
              <FAB icon="plus" label="Add member" onPress={() => rootNavigation?.navigate('MemberForm')} style={{ backgroundColor: '#10B981' }} color="#fff" />
            </View>
          }
          renderItem={({ item }) => (
            <List.Item
              title={`${item.first_name} ${item.last_name}`}
              description={() => (
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 4 }}>
                  <Text style={{ color: '#6B7280', marginRight: 4 }}>{item.national_number}</Text>
                  <Chip compact style={{ backgroundColor: '#ECFDF5' }} textStyle={{ color: '#047857' }}>
                    {item.jamaat_role || 'Member'}
                  </Chip>
                  <Chip compact style={{ backgroundColor: '#F0FDFA' }} textStyle={{ color: item.is_active ? '#047857' : '#DC2626' }}>
                    {item.is_active ? 'Active' : 'Inactive'}
                  </Chip>
                </View>
              )}
              left={(props) => <List.Icon {...props} icon={item.gender === 'Male' ? 'account' : 'account-female'} color="#047857" />}
              right={(props) => <List.Icon {...props} icon="chevron-right" />}
              onPress={() => rootNavigation?.navigate('MemberDetail', { id: String(item.id) })}
              style={{ backgroundColor: '#fff' }}
            />
          )}
        />
      )}

      {!!error && (
        <View style={styles.center}>
          <Text style={{ color: '#DC2626', marginBottom: 8 }}>Failed to load members.</Text>
          <FAB icon="refresh" label="Retry" onPress={() => refetch().then(() => setSnack('Reloaded'))} style={{ backgroundColor: '#10B981' }} color="#fff" />
        </View>
      )}

      <FAB icon="plus" style={styles.fab} onPress={() => rootNavigation?.navigate('MemberForm')} color="#fff" />
      <Snackbar visible={!!snack} onDismiss={() => setSnack(null)} duration={2000}>
        {snack}
      </Snackbar>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  searchWrap: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 8 },
  title: { fontSize: 22, fontWeight: '800', color: '#065F46' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 16 },
  fab: { position: 'absolute', right: 16, bottom: 16, backgroundColor: '#10B981' },
});
