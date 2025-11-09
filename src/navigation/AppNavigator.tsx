import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import LoginScreen from '../screens/LoginScreen';
import InviteRedeemScreen from '../screens/InviteRedeemScreen';
import MembersListScreen from '../screens/MembersListScreen';
import MemberFormScreen from '../screens/MemberFormScreen';
// Importing directly should work; if TS cache complains, lazy-load
const MemberDetailScreen = React.lazy(() => import('../screens/MemberDetailScreen')) as any;
import SettingsScreen from '../screens/SettingsScreen';
import { useAuth } from '../auth/AuthProvider';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export type AuthStackParamList = {
  Login: undefined;
  RedeemInvite: undefined;
};

export type AppStackParamList = {
  MainTabs: undefined;
  MemberForm: { id?: string } | undefined;
  MemberDetail: { id: string };
};

export type TabParamList = {
  MembersTab: undefined;
  SettingsTab: undefined;
};

const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const AppStack = createNativeStackNavigator<AppStackParamList>();
const Tabs = createBottomTabNavigator<TabParamList>();

function MainTabsComponent() {
  return (
    <Tabs.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#10B981',
        tabBarStyle: { borderTopColor: '#E5E7EB' },
        tabBarIcon: ({ color, size }) => {
          let icon: string;
          switch (route.name) {
            case 'MembersTab': icon = 'account-group'; break;
            case 'SettingsTab': icon = 'cog'; break;
            default: icon = 'home';
          }
          return <MaterialCommunityIcons name={icon as any} color={color} size={size} />;
        },
      })}
    >
      <Tabs.Screen name="MembersTab" component={MembersListScreen} options={{ title: 'Members' }} />
      <Tabs.Screen name="SettingsTab" component={SettingsScreen} options={{ title: 'Settings' }} />
    </Tabs.Navigator>
  );
}

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
      <AppStack.Screen name="MainTabs" component={MainTabsComponent} options={{ headerShown: false }} />
      <AppStack.Screen name="MemberDetail" component={MemberDetailScreen} options={{ title: 'Member' }} />
      <AppStack.Screen name="MemberForm" component={MemberFormScreen} options={{ title: 'Member' }} />
    </AppStack.Navigator>
  );
}
