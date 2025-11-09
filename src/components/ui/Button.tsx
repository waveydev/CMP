import React from 'react';
import { Pressable, Text, ActivityIndicator, ViewStyle } from 'react-native';
import { styled } from 'nativewind';

interface ButtonProps {
  title: string;
  onPress?: () => void;
  loading?: boolean;
  variant?: 'primary' | 'secondary' | 'danger';
  disabled?: boolean;
  style?: ViewStyle;
}

const variants: Record<string, string> = {
  primary: 'bg-primary-500 active:bg-primary-600',
  secondary: 'bg-primary-100 active:bg-primary-200',
  danger: 'bg-red-600 active:bg-red-700',
};

const textVariants: Record<string, string> = {
  primary: 'text-white',
  secondary: 'text-primary-700',
  danger: 'text-white',
};

const SPressable = styled(Pressable);
const SText = styled(Text);

export const Button: React.FC<ButtonProps> = ({ title, onPress, loading, variant = 'primary', disabled, style }) => {
  return (
    <SPressable
      disabled={disabled || loading}
      onPress={onPress}
      className={`flex-row items-center justify-center rounded-xl px-4 py-3 ${variants[variant]} ${disabled ? 'opacity-50' : ''}`}
      style={style}
    >
      {loading && <ActivityIndicator size="small" color="#fff" className="mr-2" />}
      <SText className={`font-semibold ${textVariants[variant]}`}>{title}</SText>
    </SPressable>
  );
};
