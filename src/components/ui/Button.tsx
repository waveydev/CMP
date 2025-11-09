import React from 'react';
import { Pressable, Text, ActivityIndicator, ViewStyle, StyleSheet } from 'react-native';

interface ButtonProps {
  title: string;
  onPress?: () => void;
  loading?: boolean;
  variant?: 'primary' | 'secondary' | 'danger';
  disabled?: boolean;
  style?: ViewStyle;
}

const styles = StyleSheet.create({
  baseBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  primary: { backgroundColor: '#10B981' },
  secondary: { backgroundColor: '#ECFDF5' },
  danger: { backgroundColor: '#DC2626' },
  textPrimary: { color: '#fff', fontWeight: '600' },
  textSecondary: { color: '#047857', fontWeight: '700' },
  textDanger: { color: '#fff', fontWeight: '700' },
  spinner: { marginRight: 8 },
});

export const Button: React.FC<ButtonProps> = ({ title, onPress, loading, variant = 'primary', disabled, style }) => {
  const btnStyle = [
    styles.baseBtn,
    variant === 'primary' && styles.primary,
    variant === 'secondary' && styles.secondary,
    variant === 'danger' && styles.danger,
    (disabled || loading) && { opacity: 0.6 },
    style,
  ];
  const textStyle = [
    variant === 'primary' && styles.textPrimary,
    variant === 'secondary' && styles.textSecondary,
    variant === 'danger' && styles.textDanger,
  ];
  const spinnerColor = variant === 'secondary' ? '#047857' : '#fff';

  return (
    <Pressable disabled={disabled || loading} onPress={onPress} style={btnStyle}>
      {loading && <ActivityIndicator size="small" color={spinnerColor} style={styles.spinner} />}
      <Text style={textStyle as any}>{title}</Text>
    </Pressable>
  );
};
