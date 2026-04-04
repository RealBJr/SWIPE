import { Stack } from 'expo-router';

import { useAppColors } from '@/hooks/use-app-colors';

export default function ChatStackLayout() {
  const c = useAppColors();
  return (
    <Stack
      screenOptions={{
        headerBackTitleVisible: false,
        headerShadowVisible: false,
        headerStyle: { backgroundColor: c.surface },
        headerTintColor: c.text,
        headerTitleStyle: { fontWeight: '700', fontSize: 17 },
      }}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="[threadId]" options={{ title: 'Chat' }} />
    </Stack>
  );
}
