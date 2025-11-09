import React, { useEffect } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
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
  national_number: z.string().min(1),
  jamaat: z.string().min(1),
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
    <View style={styles.container}>
      <Text style={styles.title}>{isEdit ? 'Edit Member' : 'Add Member'}</Text>
      <Field label="First Name" name="first_name" control={control} />
      <Field label="Last Name" name="last_name" control={control} />
      <Field label="Date of Birth (YYYY-MM-DD)" name="date_of_birth" control={control} />
      <Field label="Gender (Male/Female)" name="gender" control={control} />
      <Field label="National Number" name="national_number" control={control} />
      <Field label="Jamaat" name="jamaat" control={control} />
      <Pressable style={styles.primaryBtn} onPress={handleSubmit(onSubmit)} disabled={saveMutation.isPending}>
        <Text style={styles.primaryBtnText}>{saveMutation.isPending ? 'Saving...' : 'Save'}</Text>
      </Pressable>
    </View>
  );
}

function Field({ label, name, control }: { label: string; name: keyof MemberFormValues; control: any }) {
  return (
    <View style={{ marginBottom: 10 }}>
      <Text style={{ marginBottom: 4, color: '#6B7280', fontWeight: '600' }}>{label}</Text>
      <Controller
        name={name}
        control={control}
        render={({ field: { onChange, onBlur, value } }) => (
          <Input value={String(value ?? '')} onChangeText={onChange} />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 22, fontWeight: '800', marginBottom: 12, color: '#065F46' },
  input: { borderWidth: 1, borderColor: '#A7F3D0', borderRadius: 12, padding: 12 },
  primaryBtn: { backgroundColor: '#10B981', paddingVertical: 12, borderRadius: 12, alignItems: 'center', marginTop: 8 },
  primaryBtnText: { color: '#fff', fontWeight: '800' },
});
