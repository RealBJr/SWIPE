import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors, Fonts } from '@/constants/theme';
import { queryClient } from '@/lib/query-client';

const LightNavTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: Colors.light.primary,
    background: Colors.light.background,
    card: Colors.light.surfaceContainerLowest,
    text: Colors.light.onSurface,
    border: Colors.light.ghostBorder,
    notification: Colors.light.primary,
  },
};

const DarkNavTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: Colors.dark.primary,
    background: Colors.dark.background,
    card: Colors.dark.surfaceContainerLowest,
    text: Colors.dark.onSurface,
    border: Colors.dark.ghostBorder,
    notification: Colors.dark.primary,
  },
};

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const navColors = colorScheme === 'dark' ? Colors.dark : Colors.light;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider value={colorScheme === 'dark' ? DarkNavTheme : LightNavTheme}>
          <Stack
            screenOptions={{
              headerBackTitleVisible: false,
              headerShadowVisible: false,
              headerStyle: { backgroundColor: navColors.surface },
              headerTintColor: navColors.onSurface,
              headerTitleStyle: { fontFamily: Fonts.sans, fontWeight: '600', fontSize: 17 },
            }}
          >
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen
              name="match/[peerId]"
              options={{ presentation: 'modal', headerShown: false }}
            />
            <Stack.Screen
              name="review/[kind]/[id]"
              options={{
                presentation: 'transparentModal',
                headerShown: false,
                contentStyle: { backgroundColor: 'transparent' },
                animation: 'slide_from_bottom',
              }}
            />
            <Stack.Screen
              name="reviews/[kind]/[id]"
              options={{
                presentation: 'transparentModal',
                headerShown: false,
                contentStyle: { backgroundColor: 'transparent' },
                animation: 'slide_from_bottom',
              }}
            />
            <Stack.Screen name="class/[id]" options={{ title: 'Class' }} />
            <Stack.Screen name="professor/[id]" options={{ title: 'Professor' }} />
            <Stack.Screen name="ta/[id]" options={{ title: 'TA' }} />
            <Stack.Screen name="+not-found" options={{ title: 'Not Found' }} />
          </Stack>
          <StatusBar style="auto" />
        </ThemeProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
