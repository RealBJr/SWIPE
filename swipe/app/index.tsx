import { Redirect } from 'expo-router';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { Colors } from '@/constants/theme';
import { useAppColors } from '@/hooks/use-app-colors';
import { useAppStore } from '@/store/app-store';

export default function Index() {
  const c = useAppColors();
  const hydrated = useAppStore((s) => s._hasHydrated);

  if (!hydrated) {
    return (
      <View style={[styles.splash, { backgroundColor: c.surface }]}>
        <ActivityIndicator size="large" color={Colors.light.primary} />
      </View>
    );
  }

  return <Redirect href="/(tabs)/explore" />;
}

const styles = StyleSheet.create({
  splash: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
