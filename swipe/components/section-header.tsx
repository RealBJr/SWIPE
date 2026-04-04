import type { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { useAppColors } from '@/hooks/use-app-colors';

export function SectionHeader({ title, action }: { title: string; action?: ReactNode }) {
  const c = useAppColors();
  return (
    <View style={styles.row}>
      <Text style={[styles.title, { color: c.text }]}>{title}</Text>
      {action}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    marginTop: 20,
  },
  title: { fontSize: 18, fontWeight: '800', letterSpacing: -0.2 },
});
