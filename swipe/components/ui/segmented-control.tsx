import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Accent } from '@/constants/theme';
import { useAppColors } from '@/hooks/use-app-colors';

export function SegmentedControl<T extends string>({
  values,
  labels,
  value,
  onChange,
}: {
  values: readonly T[];
  labels: Record<T, string>;
  value: T;
  onChange: (v: T) => void;
}) {
  const c = useAppColors();
  return (
    <View style={[styles.wrap, { backgroundColor: c.border }]}>
      {values.map((v) => {
        const active = v === value;
        return (
          <Pressable
            key={v}
            accessibilityRole="button"
            accessibilityState={{ selected: active }}
            onPress={() => onChange(v)}
            style={[
              styles.seg,
              active
                ? { backgroundColor: c.surface }
                : { backgroundColor: 'transparent' },
            ]}>
            <Text
              numberOfLines={1}
              style={[
                styles.text,
                { color: active ? Accent.blue : c.textSecondary },
                active && { fontWeight: '700' },
              ]}>
              {labels[v]}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    borderRadius: 14,
    padding: 3,
    gap: 2,
  },
  seg: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 6,
    borderRadius: 12,
    alignItems: 'center',
  },
  text: { fontSize: 13, fontWeight: '600' },
});
