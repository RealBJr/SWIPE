import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Layout } from '@/constants/theme';
import { useAppColors } from '@/hooks/use-app-colors';

export function CompactAcademicRow({
  title,
  subtitle,
  meta,
  onPress,
  onRemove,
}: {
  title: string;
  subtitle?: string;
  meta?: string;
  onPress?: () => void;
  onRemove?: () => void;
}) {
  const c = useAppColors();
  return (
    <View style={[styles.row, { backgroundColor: c.surface }, Layout.shadowLight]}>
      <Pressable
        accessibilityRole={onPress ? 'button' : undefined}
        onPress={onPress}
        style={({ pressed }) => [{ flex: 1 }, pressed && onPress && { opacity: 0.85 }]}>
        <Text style={[styles.title, { color: c.text }]} numberOfLines={2}>
          {title}
        </Text>
        {subtitle ? (
          <Text style={[styles.sub, { color: c.textSecondary }]} numberOfLines={2}>
            {subtitle}
          </Text>
        ) : null}
        {meta ? <Text style={[styles.meta, { color: c.textMuted }]}>{meta}</Text> : null}
      </Pressable>
      {onRemove ? (
        <Pressable onPress={onRemove} hitSlop={8} style={styles.removeWrap}>
          <Text style={{ color: '#EF4444', fontWeight: '700', fontSize: 12 }}>Remove</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  removeWrap: { paddingLeft: 8 },
  title: { fontSize: 15, fontWeight: '700' },
  sub: { marginTop: 4, fontSize: 13, fontWeight: '500' },
  meta: { marginTop: 5, fontSize: 12, fontWeight: '600' },
});
