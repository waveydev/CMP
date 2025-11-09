import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../navigation/AppNavigator';
import { useAuth } from '../auth/AuthProvider';

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
    <View style={styles.container}>
      <Text style={styles.title}>Redeem Invitation</Text>
      {error && <Text style={styles.error}>{error}</Text>}
      <TextInput
        placeholder="Invitation Token"
        autoCapitalize="none"
        value={token}
        onChangeText={setToken}
        style={styles.input}
      />
      <TextInput
        placeholder="Email"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
      />
      <TextInput
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={styles.input}
      />
      <Button title={loading ? 'Submitting...' : 'Submit'} onPress={onSubmit} disabled={loading} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, gap: 12, justifyContent: 'center' },
  title: { fontSize: 20, fontWeight: '600', marginBottom: 8 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12 },
  error: { color: 'red' },
});
