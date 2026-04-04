import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { PrimaryButton } from '@/components/ui/primary-button';
import { Screen } from '@/components/ui/screen';
import { useAppColors } from '@/hooks/use-app-colors';

export default function NotFoundScreen() {
  const c = useAppColors();
  return (
    <Screen>
      <View style={styles.center}>
        <Text style={[styles.code, { color: c.textMuted }]}>404</Text>
        <Text style={[styles.title, { color: c.text }]}>Page not found</Text>
        <Text style={[styles.body, { color: c.textSecondary }]}>
          The screen you're looking for doesn't exist or has been moved.
        </Text>
        <View style={styles.btn}>
          <PrimaryButton label="Back to Explore" onPress={() => router.replace('/(tabs)/explore')} />
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 },
  code: { fontSize: 56, fontWeight: '900', letterSpacing: -2 },
  title: { fontSize: 22, fontWeight: '800', marginTop: 8 },
  body: { fontSize: 15, lineHeight: 22, textAlign: 'center', marginTop: 8, fontWeight: '500' },
  btn: { marginTop: 24, width: '100%' },
});
