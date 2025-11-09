import React from 'react';
import { View, ViewProps } from 'react-native';
import { styled } from 'nativewind';

const SView = styled(View);

export const Screen: React.FC<ViewProps> = ({ children, style, ...rest }) => {
  return (
    <SView className="flex-1 bg-white" style={style} {...rest}>
      {children}
    </SView>
  );
};
