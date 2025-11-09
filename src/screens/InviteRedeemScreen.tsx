import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../navigation/AppNavigator';
import { useAuth } from '../auth/AuthProvider';
import { LinearGradient } from 'expo-linear-gradient';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';

export type InviteRedeemProps = NativeStackScreenProps<AuthStackParamList, 'RedeemInvite'>;

export default function InviteRedeemScreen({ navigation }: InviteRedeemProps) {
  const { redeemInvite } = useAuth();
  const [token, setToken] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      await redeemInvite({ token, email, password });
      navigation.replace('Login');
    } catch (e: any) {
      setError(e?.message || 'Failed to redeem');
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={["#ECFDF5", "#ffffff"]} style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Redeem Invitation</Text>
        {error && <Text style={styles.error}>{error}</Text>}
        <Input label="Invitation Token" value={token} onChangeText={setToken} placeholder="Paste token" />
        <Input label="Email" value={email} onChangeText={setEmail} placeholder="you@example.com" keyboardType="email-address" />
        <Input label="Password" value={password} onChangeText={setPassword} placeholder="••••••••" secureTextEntry />
        <Button title={loading ? 'Submitting…' : 'Submit'} onPress={onSubmit} loading={loading} />
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, justifyContent: 'center' },
  card: { backgroundColor: '#fff', padding: 20, borderRadius: 16, elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8 },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 12, color: '#065F46' },
  error: { color: '#DC2626', marginBottom: 8 },
});
