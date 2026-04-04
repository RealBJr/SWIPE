import type { ReactNode } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAppColors } from '@/hooks/use-app-colors';

export function Screen({
  children,
  scroll,
  edges = ['top', 'left', 'right'],
  padded = true,
}: {
  children: ReactNode;
  scroll?: boolean;
  edges?: ('top' | 'bottom' | 'left' | 'right')[];
  padded?: boolean;
}) {
  const c = useAppColors();
  const px = padded ? 20 : 0;
  const content = scroll ? (
    <ScrollView
      contentContainerStyle={[styles.scroll, { paddingHorizontal: px }]}
      showsVerticalScrollIndicator={false}>
      {children}
    </ScrollView>
  ) : (
    <View style={styles.fill}>{children}</View>
  );
  return (
    <SafeAreaView style={[styles.fill, { backgroundColor: c.background }]} edges={edges}>
      {content}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  scroll: { flexGrow: 1, paddingBottom: 32 },
});
