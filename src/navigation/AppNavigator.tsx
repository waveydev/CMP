import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/LoginScreen';
import InviteRedeemScreen from '../screens/InviteRedeemScreen';
import MembersListScreen from '../screens/MembersListScreen';
import MemberFormScreen from '../screens/MemberFormScreen';
import SettingsScreen from '../screens/SettingsScreen';
import { useAuth } from '../auth/AuthProvider';

export type AuthStackParamList = {
  Login: undefined;
  RedeemInvite: undefined;
};

export type AppStackParamList = {
  Members: undefined;
  MemberForm: { id?: string } | undefined;
  Settings: undefined;
};

const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const AppStack = createNativeStackNavigator<AppStackParamList>();

export default function AppNavigator() {
  const { user } = useAuth();

  if (!user) {
    return (
      <AuthStack.Navigator>
        <AuthStack.Screen name="Login" component={LoginScreen} options={{ title: 'Sign In' }} />
        <AuthStack.Screen
          name="RedeemInvite"
          component={InviteRedeemScreen}
          options={{ title: 'Redeem Invitation' }}
        />
      </AuthStack.Navigator>
    );
  }

  return (
    <AppStack.Navigator>
      <AppStack.Screen name="Members" component={MembersListScreen} options={{ title: 'Members' }} />
      <AppStack.Screen name="MemberForm" component={MemberFormScreen} options={{ title: 'Member' }} />
      <AppStack.Screen name="Settings" component={SettingsScreen} options={{ title: 'Settings' }} />
    </AppStack.Navigator>
  );
}
