import React, { useEffect } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Button, SegmentedButtons, ActivityIndicator } from 'react-native-paper';
import { Input } from '../components/ui/Input';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppStackParamList } from '../navigation/AppNavigator';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

export type MemberFormProps = NativeStackScreenProps<AppStackParamList, 'MemberForm'>;

const schema = z.object({
  first_name: z.string().min(1),
  last_name: z.string().min(1),
  date_of_birth: z.string().min(1),
  gender: z.enum(['Male', 'Female']),
  national_number: z.string().regex(/^MOR\d{4}$/,{ message: 'Format must be MOR followed by 4 digits (e.g., MOR0123)' }),
  jamaat: z.string().min(1),
  family_situation: z.enum(['Married', 'Divorced', 'Single']),
  children_count: z.coerce.number().int().min(0),
  children_over_15_count: z.coerce.number().int().min(0),
  spouse_is_ahmadi: z.boolean(),
  salary_mad: z.coerce.number().min(0),
  salary_type: z.enum(['Fixed', 'Variable']),
  monthly_tchanda: z.coerce.number().min(0),
  is_mousi: z.boolean(),
  is_active: z.boolean(),
  jamaat_role: z.string().min(1),
});

export type MemberFormValues = z.infer<typeof schema>;

export default function MemberFormScreen({ route, navigation }: MemberFormProps) {
  const id = route.params?.id;
  const isEdit = Boolean(id);
  const qc = useQueryClient();

  const { control, handleSubmit, reset } = useForm<MemberFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      first_name: '',
      last_name: '',
      date_of_birth: '',
      gender: 'Male',
      national_number: '',
      jamaat: '',
      family_situation: 'Single',
      children_count: 0,
      children_over_15_count: 0,
      spouse_is_ahmadi: false,
      salary_mad: 0,
      salary_type: 'Fixed',
      monthly_tchanda: 0,
      is_mousi: false,
      is_active: true,
      jamaat_role: '',
    },
  });

  const memberQuery = useQuery({
    queryKey: ['member', id],
    queryFn: () => (id ? api.getMember(id) : Promise.resolve(null)),
    enabled: isEdit,
  });

  useEffect(() => {
    if (memberQuery.data) {
      const { id: _ignored, ...rest } = memberQuery.data as any;
      // Ensure gender matches union type
      const fixed = { ...rest, gender: rest.gender === 'Female' ? 'Female' : 'Male' };
      reset(fixed);
    }
  }, [memberQuery.data, reset]);

  const saveMutation = useMutation({
    mutationFn: (values: MemberFormValues) => (isEdit ? api.updateMember(id!, values) : api.createMember(values)),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ['members'] });
      navigation.goBack();
    },
  });

  const onSubmit = (values: MemberFormValues) => saveMutation.mutate(values);

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>{isEdit ? 'Edit Member' : 'Add Member'}</Text>
        <Field label="First Name" name="first_name" control={control} />
        <Field label="Last Name" name="last_name" control={control} />
        <Field label="Date of Birth (YYYY-MM-DD)" name="date_of_birth" control={control} />
        <GenderField control={control} />
        <NationalNumberField control={control} />
        <Field label="Jamaat" name="jamaat" control={control} />
        <FamilySituationField control={control} />
        <Field label="Number of Children" name="children_count" control={control} />
        <Field label= "Children over 15" name="children_over_15_count" control={control} />
        <BooleanField label="Spouse is Ahmadi" name="spouse_is_ahmadi" control={control} />
        <Field label="Salary (MAD)" name="salary_mad" control={control} />
        <SalaryTypeField control={control} />
        <Field label="Monthly Tchanda" name="monthly_tchanda" control={control} />
        <BooleanField label="Mousi Member" name="is_mousi" control={control} />
        <BooleanField label="Active Member" name="is_active" control={control} />
        <Field label="Role in Jamaat" name="jamaat_role" control={control} />
        <Button
          mode="contained"
          onPress={handleSubmit(onSubmit)}
          disabled={saveMutation.isPending}
          style={styles.saveBtn}
        >
          {saveMutation.isPending ? 'Saving…' : 'Save'}
        </Button>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function Field({ label, name, control }: { label: string; name: keyof MemberFormValues; control: any }) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <View style={styles.fieldWrap}>
          <Text style={styles.fieldLabel}>{label}</Text>
          <Input value={String(value ?? '')} onChangeText={onChange} />
          {error && <Text style={styles.errorText}>{error.message}</Text>}
        </View>
      )}
    />
  );
}

function GenderField({ control }: { control: any }) {
  return (
    <Controller
      name="gender"
      control={control}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <View style={styles.fieldWrap}>
          <Text style={styles.fieldLabel}>Gender</Text>
          <SegmentedButtons
            value={value}
            onValueChange={onChange}
            buttons={[
              { value: 'Male', label: 'Male' },
              { value: 'Female', label: 'Female' },
            ]}
          />
          {error && <Text style={styles.errorText}>{error.message}</Text>}
        </View>
      )}
    />
  );
}

function NationalNumberField({ control }: { control: any }) {
  return (
    <Controller
      name="national_number"
      control={control}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <View style={styles.fieldWrap}>
          <Text style={styles.fieldLabel}>National Number (MORxxxx)</Text>
          <Input
            value={String(value ?? '')}
            onChangeText={(t) => {
              let v = t.toUpperCase();
              if (!v.startsWith('MOR')) v = 'MOR' + v.replace(/[^0-9]/g, '');
              const digits = v.replace(/^MOR/, '').replace(/[^0-9]/g, '').slice(0, 4);
              onChange('MOR' + digits);
            }}
            keyboardType="numeric"
            placeholder="MOR0123"
          />
          {error && <Text style={styles.errorText}>{error.message}</Text>}
        </View>
      )}
    />
  );
}

function FamilySituationField({ control }: { control: any }) {
  return (
    <Controller
      name="family_situation"
      control={control}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <View style={styles.fieldWrap}>
          <Text style={styles.fieldLabel}>Family Situation</Text>
          <SegmentedButtons
            value={value}
            onValueChange={onChange}
            buttons={[
              { value: 'Single', label: 'Single' },
              { value: 'Married', label: 'Married' },
              { value: 'Divorced', label: 'Divorced' },
            ]}
          />
          {error && <Text style={styles.errorText}>{error.message}</Text>}
        </View>
      )}
    />
  );
}

function SalaryTypeField({ control }: { control: any }) {
  return (
    <Controller
      name="salary_type"
      control={control}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <View style={styles.fieldWrap}>
          <Text style={styles.fieldLabel}>Salary Type</Text>
          <SegmentedButtons
            value={value}
            onValueChange={onChange}
            buttons={[
              { value: 'Fixed', label: 'Fixed' },
              { value: 'Variable', label: 'Variable' },
            ]}
          />
          {error && <Text style={styles.errorText}>{error.message}</Text>}
        </View>
      )}
    />
  );
}

function BooleanField({ label, name, control }: { label: string; name: keyof MemberFormValues; control: any }) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <View style={styles.fieldWrap}>
          <Text style={styles.fieldLabel}>{label}</Text>
          <SegmentedButtons
            value={value ? 'true' : 'false'}
            onValueChange={(v) => onChange(v === 'true')}
            buttons={[
              { value: 'true', label: 'Yes' },
              { value: 'false', label: 'No' },
            ]}
          />
          {error && <Text style={styles.errorText}>{error.message}</Text>}
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  scroll: { padding: 16 },
  title: { fontSize: 22, fontWeight: '800', marginBottom: 16, color: '#065F46' },
  fieldWrap: { marginBottom: 14 },
  fieldLabel: { marginBottom: 6, color: '#6B7280', fontWeight: '600' },
  errorText: { marginTop: 4, color: '#DC2626', fontSize: 12 },
  saveBtn: { marginTop: 8, backgroundColor: '#10B981' },
});
