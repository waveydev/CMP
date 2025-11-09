import { NavigationContainer } from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppNavigator from './src/navigation/AppNavigator';
import { AuthProvider } from './src/auth/AuthProvider';

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <NavigationContainer>
          <SafeAreaView style={{ flex: 1 }}>
            <AppNavigator />
            <StatusBar style="dark" />
          </SafeAreaView>
        </NavigationContainer>
      </AuthProvider>
    </QueryClientProvider>
  );
}
