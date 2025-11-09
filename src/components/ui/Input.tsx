import React, { useMemo, useState } from 'react';
import { TextInput, Text, View, StyleSheet, Pressable } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface InputProps {
  label?: string;
  value?: string;
  onChangeText?: (t: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric';
  secureToggle?: boolean; // show eye/eye-off toggle when secure
}

const styles = StyleSheet.create({
  wrapper: { marginBottom: 12, position: 'relative' },
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
  eyeBtn: {
    position: 'absolute',
    right: 8,
    top: 32,
    height: 40,
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export const Input: React.FC<InputProps> = ({ label, secureTextEntry, secureToggle, ...rest }) => {
  const [hidden, setHidden] = useState<boolean>(!!secureTextEntry);
  const effectiveSecure = secureToggle ? hidden : !!secureTextEntry;
  const showToggle = !!secureToggle && !!secureTextEntry;
  return (
    <View style={styles.wrapper}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        style={[styles.input, showToggle && { paddingRight: 44 }]}
        placeholderTextColor="#9CA3AF"
        secureTextEntry={effectiveSecure}
        {...rest}
      />
      {showToggle && (
        <Pressable accessibilityRole="button" style={styles.eyeBtn} onPress={() => setHidden((v) => !v)}>
          <MaterialCommunityIcons name={hidden ? 'eye-off' : 'eye'} size={22} color="#6B7280" />
        </Pressable>
      )}
    </View>
  );
};
