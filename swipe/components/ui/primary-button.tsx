import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Accent } from '@/constants/theme';
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
  variant?: 'filled' | 'outline';
  disabled?: boolean;
  icon?: ReactNode;
  compact?: boolean;
}) {
  const c = useAppColors();
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        compact && styles.compact,
        variant === 'filled'
          ? { backgroundColor: disabled ? c.border : Accent.blue }
          : { backgroundColor: 'transparent', borderWidth: 1.5, borderColor: Accent.blue },
        pressed && !disabled && { opacity: 0.85, transform: [{ scale: 0.98 }] },
      ]}>
      <View style={styles.row}>
        {icon}
        <Text
          style={[
            styles.label,
            compact && styles.labelCompact,
            { color: variant === 'filled' ? '#FFFFFF' : Accent.blue },
          ]}>
          {label}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    height: 50,
    paddingHorizontal: 20,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  compact: { height: 40, paddingHorizontal: 16, borderRadius: 12 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  label: { fontSize: 16, fontWeight: '700' },
  labelCompact: { fontSize: 14 },
});
