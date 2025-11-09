import React from 'react';
import { TextInput, Text, View } from 'react-native';
import { styled } from 'nativewind';

interface InputProps {
  label?: string;
  value?: string;
  onChangeText?: (t: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric';
}

const STextInput = styled(TextInput);
const SText = styled(Text);
const SView = styled(View);

export const Input: React.FC<InputProps> = ({ label, ...rest }) => {
  return (
    <SView className="mb-3">
      {label && <SText className="mb-1 text-gray-600 font-semibold">{label}</SText>}
      <STextInput
        className="border border-primary-200 rounded-xl px-3 py-3"
        placeholderTextColor="#9CA3AF"
        {...rest}
      />
    </SView>
  );
};
