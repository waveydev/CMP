import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './src/navigation/AppNavigator';
import { AuthProvider } from './src/auth/AuthProvider';

const queryClient = new QueryClient();

export default function App() {
  const navTheme = {
    ...DefaultTheme,
    colors: { ...DefaultTheme.colors, primary: '#10B981', background: '#ffffff', card: '#ffffff' },
  };
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <SafeAreaProvider>
          <NavigationContainer theme={navTheme}>
            <AppNavigator />
            <StatusBar style="dark" />
          </NavigationContainer>
        </SafeAreaProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
