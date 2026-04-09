import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { Colors, Fonts, Layout } from '@/constants/theme';
import { useAppColors } from '@/hooks/use-app-colors';

export function PrimaryButton({
  label,
  onPress,
  variant = 'filled',
  disabled,
  icon,
  compact,
}: {
  label: string;
  onPress: () => void;
  variant?: 'filled' | 'secondary' | 'tertiary' | 'outline';
  disabled?: boolean;
  icon?: ReactNode;
  compact?: boolean;
}) {
  const c = useAppColors();
  const tertiary = variant === 'tertiary' || variant === 'outline';

  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        compact && styles.compact,
        variant === 'secondary' && { backgroundColor: c.surfaceContainerHighest },
        tertiary && { backgroundColor: 'transparent' },
        disabled && { opacity: 0.55 },
        pressed && !disabled && { opacity: 0.85, transform: [{ scale: 0.98 }] },
      ]}
    >
      {variant === 'filled' ? (
        <LinearGradient
          colors={[Colors.light.primary, Colors.light.primaryContainer]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.fill, compact && styles.fillCompact]}
        >
          <View style={styles.row}>
            {icon}
            <Text style={[styles.label, compact && styles.labelCompact, styles.labelLight]}>
              {label}
            </Text>
          </View>
        </LinearGradient>
      ) : (
        <View style={styles.row}>
          {icon}
          <Text
            style={[
              styles.label,
              compact && styles.labelCompact,
              { color: tertiary ? c.primary : c.onSurface },
            ]}
          >
            {label}
          </Text>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    height: 50,
    paddingHorizontal: 20,
    borderRadius: Layout.radiusXl,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  fill: {
    width: '100%',
    height: '100%',
    borderRadius: Layout.radiusXl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fillCompact: { borderRadius: Layout.radiusLg },
  compact: { height: 40, paddingHorizontal: 16, borderRadius: Layout.radiusLg },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  label: { fontSize: 16, fontWeight: '700', fontFamily: Fonts.sans, letterSpacing: 0.2 },
  labelLight: { color: '#FFFFFF' },
  labelCompact: { fontSize: 14 },
});
