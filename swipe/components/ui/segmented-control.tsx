import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Fonts } from '@/constants/theme';

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
  return (
    <View style={[styles.wrap, { backgroundColor: 'rgba(30, 30, 30, 0.28)' }]}>
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
                ? { backgroundColor: 'rgba(255,255,255,0.2)' }
                : { backgroundColor: 'transparent' },
            ]}
          >
            <Text
              numberOfLines={1}
              style={[
                styles.text,
                { color: active ? '#FFFFFF' : 'rgba(255,255,255,0.68)' },
                active && { fontWeight: '700' },
              ]}
            >
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
    borderRadius: 22,
    padding: 4,
    gap: 2,
  },
  seg: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 6,
    borderRadius: 18,
    alignItems: 'center',
  },
  text: {
    fontSize: 11,
    fontWeight: '700',
    fontFamily: Fonts.sans,
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
});
