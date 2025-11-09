import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './src/navigation/AppNavigator';
import { AuthProvider } from './src/auth/AuthProvider';
import { Provider as PaperProvider, MD3LightTheme } from 'react-native-paper';

const queryClient = new QueryClient();

export default function App() {
  const navTheme = {
    ...DefaultTheme,
    colors: { ...DefaultTheme.colors, primary: '#10B981', background: '#ffffff', card: '#ffffff' },
  };
  const paperTheme = {
    ...MD3LightTheme,
    roundness: 12,
    colors: {
      ...MD3LightTheme.colors,
      primary: '#10B981',
      primaryContainer: '#A7F3D0',
      secondary: '#047857',
      tertiary: '#059669',
      background: '#FFFFFF',
      surface: '#FFFFFF',
      outline: '#A7F3D0'
    }
  };
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <PaperProvider theme={paperTheme}>
          <SafeAreaProvider>
            <NavigationContainer theme={navTheme}>
              <AppNavigator />
              <StatusBar style="dark" />
            </NavigationContainer>
          </SafeAreaProvider>
        </PaperProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
