import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../navigation/AppNavigator';
import { useAuth } from '../auth/AuthProvider';

export type LoginScreenProps = NativeStackScreenProps<AuthStackParamList, 'Login'>;

export default function LoginScreen({ navigation }: LoginScreenProps) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      await login({ email, password });
    } catch (e: any) {
      setError(e?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={["#ECFDF5", "#ffffff"]} style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Representative Login</Text>
        {error && <Text style={styles.error}>{error}</Text>}
        <Input label="Email" placeholder="you@example.com" keyboardType="email-address" value={email} onChangeText={setEmail} />
        <Input label="Password" placeholder="••••••••" secureTextEntry secureToggle value={password} onChangeText={setPassword} />
        <Button title={loading ? 'Signing in…' : 'Sign In'} onPress={onSubmit} loading={loading} />
        <View style={{ height: 12 }} />
        <Button title="Redeem Invitation" variant="secondary" onPress={() => navigation.navigate('RedeemInvite')} />
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
