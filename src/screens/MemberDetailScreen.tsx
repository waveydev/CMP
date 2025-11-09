import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Chip, Divider, Button, ActivityIndicator } from 'react-native-paper';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AppStackParamList } from '../navigation/AppNavigator';
import { useQuery } from '@tanstack/react-query';
import { api } from '../services/api';

export type MemberDetailProps = NativeStackScreenProps<AppStackParamList, 'MemberDetail'>;

export default function MemberDetailScreen({ route, navigation }: MemberDetailProps) {
  const { id } = route.params;
  const memberQuery = useQuery({
    queryKey: ['member', id],
    queryFn: () => api.getMember(id),
  });

  const m = memberQuery.data;

  if (memberQuery.isLoading) {
    return (
      <View style={styles.center}> 
        <ActivityIndicator />
        <Text style={{ marginTop: 8 }}>Loading member…</Text>
      </View>
    );
  }

  if (!m) {
    return (
      <View style={styles.center}>
        <Text>Member not found.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.name}>{m.first_name} {m.last_name}</Text>
      <View style={styles.rowChips}>
        <Chip style={styles.chip} textStyle={styles.chipText}>{m.jamaat_role || 'Member'}</Chip>
        <Chip style={styles.chip} textStyle={styles.chipText}>{m.is_active ? 'Active' : 'Inactive'}</Chip>
        <Chip style={styles.chip} textStyle={styles.chipText}>{m.family_situation}</Chip>
        <Chip style={styles.chip} textStyle={styles.chipText}>{m.gender}</Chip>
      </View>
      <Divider style={styles.divider} />
      <Section title="Identifiers">
        <Field label="National Number" value={m.national_number} />
        <Field label="Jamaat" value={m.jamaat} />
        <Field label="Date of Birth" value={m.date_of_birth} />
      </Section>
      <Section title="Family">
        <Field label="Children" value={String(m.children_count)} />
        <Field label=">15 Years" value={String(m.children_over_15_count)} />
        <Field label="Spouse Ahmadi" value={m.spouse_is_ahmadi ? 'Yes' : 'No'} />
      </Section>
      <Section title="Financial">
        <Field label="Salary (MAD)" value={String(m.salary_mad)} />
        <Field label="Salary Type" value={m.salary_type} />
        <Field label="Monthly Tchanda" value={String(m.monthly_tchanda)} />
        <Field label="Mousi Member" value={m.is_mousi ? 'Yes' : 'No'} />
      </Section>
      <Button mode="contained" style={styles.editBtn} onPress={() => navigation.navigate('MemberForm', { id: String(m.id) })}>
        Edit Member
      </Button>
    </ScrollView>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.fieldRow}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <Text style={styles.fieldValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  name: { fontSize: 24, fontWeight: '800', color: '#065F46', marginBottom: 8 },
  rowChips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 12 },
  chip: { backgroundColor: '#ECFDF5' },
  chipText: { color: '#047857' },
  divider: { marginVertical: 8 },
  section: { marginTop: 12 },
  sectionTitle: { fontSize: 14, fontWeight: '700', color: '#047857', marginBottom: 4, textTransform: 'uppercase' },
  fieldRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6, borderBottomWidth: 1, borderColor: '#F1F5F9' },
  fieldLabel: { color: '#6B7280', fontWeight: '600' },
  fieldValue: { color: '#064E3B', fontWeight: '600' },
  editBtn: { marginTop: 24, backgroundColor: '#10B981' },
});
