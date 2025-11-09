import React from 'react';
import { View, ViewProps, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#ffffff' },
});

export const Screen: React.FC<ViewProps> = ({ children, style, ...rest }) => (
  <View style={[styles.root, style]} {...rest}>
    {children}
  </View>
);
