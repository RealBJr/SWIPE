import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { Fonts } from '@/constants/theme';
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
      <Ionicons name={icon} size={40} color={c.primary} />
      <Text style={[styles.title, { color: c.onSurface }]}>{title}</Text>
      {subtitle ? (
        <Text style={[styles.subtitle, { color: c.onSurfaceVariant }]}>{subtitle}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { alignItems: 'center', justifyContent: 'center', padding: 36, gap: 12 },
  title: {
    fontSize: 19,
    fontWeight: '800',
    textAlign: 'center',
    letterSpacing: -0.3,
    fontFamily: Fonts.sans,
  },
  subtitle: {
    fontSize: 15,
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: 24,
    fontFamily: Fonts.sans,
  },
});
