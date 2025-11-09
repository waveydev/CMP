import React from 'react';
import { TextInput, Text, View, StyleSheet } from 'react-native';

interface InputProps {
  label?: string;
  value?: string;
  onChangeText?: (t: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric';
}

const styles = StyleSheet.create({
  wrapper: { marginBottom: 12 },
  label: { marginBottom: 4, color: '#6B7280', fontWeight: '600' },
  input: {
    borderWidth: 1,
    borderColor: '#A7F3D0',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: '#064E3B',
  },
});

export const Input: React.FC<InputProps> = ({ label, ...rest }) => {
  return (
    <View style={styles.wrapper}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        style={styles.input}
        placeholderTextColor="#9CA3AF"
        {...rest}
      />
    </View>
  );
};
