import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Fonts, Layout } from '@/constants/theme';
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
    <View style={[styles.row, { backgroundColor: c.surfaceContainerLowest }, Layout.seaGlowLight]}>
      <Pressable
        accessibilityRole={onPress ? 'button' : undefined}
        onPress={onPress}
        style={({ pressed }) => [{ flex: 1 }, pressed && onPress && { opacity: 0.85 }]}
      >
        <Text style={[styles.title, { color: c.onSurface }]} numberOfLines={2}>
          {title}
        </Text>
        {subtitle ? (
          <Text style={[styles.sub, { color: c.onSurfaceVariant }]} numberOfLines={2}>
            {subtitle}
          </Text>
        ) : null}
        {meta ? <Text style={[styles.meta, { color: c.textMuted }]}>{meta}</Text> : null}
      </Pressable>
      {onRemove ? (
        <Pressable onPress={onRemove} hitSlop={8} style={styles.removeWrap}>
          <Text
            style={{ color: c.primary, fontWeight: '700', fontSize: 12, fontFamily: Fonts.sans }}
          >
            Remove
          </Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    borderRadius: Layout.radiusLg,
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  removeWrap: { paddingLeft: 8 },
  title: { fontSize: 16, fontWeight: '700', fontFamily: Fonts.sans },
  sub: { marginTop: 4, fontSize: 14, fontWeight: '500', lineHeight: 22, fontFamily: Fonts.sans },
  meta: {
    marginTop: 8,
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.7,
    fontFamily: Fonts.sans,
  },
});
