import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { useAppColors } from '@/hooks/use-app-colors';

export function EmptyState({
  icon = 'albums-outline',
  title,
  subtitle,
}: {
  icon?: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle?: string;
}) {
  const c = useAppColors();
  return (
    <View style={styles.root}>
      <Ionicons name={icon} size={40} color={c.textMuted} />
      <Text style={[styles.title, { color: c.text }]}>{title}</Text>
      {subtitle ? (
        <Text style={[styles.subtitle, { color: c.textSecondary }]}>{subtitle}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { alignItems: 'center', justifyContent: 'center', padding: 32, gap: 8 },
  title: { fontSize: 17, fontWeight: '800', textAlign: 'center' },
  subtitle: { fontSize: 14, fontWeight: '500', textAlign: 'center', lineHeight: 20 },
});
