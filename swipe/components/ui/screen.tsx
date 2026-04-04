import type { ReactNode } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAppColors } from '@/hooks/use-app-colors';

export function Screen({
  children,
  scroll,
  keyboard,
  edges = ['top', 'left', 'right'],
  padded = true,
  keyboardOffset = 88,
}: {
  children: ReactNode;
  scroll?: boolean;
  keyboard?: boolean;
  edges?: ('top' | 'bottom' | 'left' | 'right')[];
  padded?: boolean;
  keyboardOffset?: number;
}) {
  const c = useAppColors();
  const px = padded ? 20 : 0;

  let content: ReactNode;
  if (scroll) {
    content = (
      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingHorizontal: px }]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">
        {children}
      </ScrollView>
    );
  } else {
    content = <View style={styles.fill}>{children}</View>;
  }

  if (keyboard) {
    content = (
      <KeyboardAvoidingView
        style={styles.fill}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={keyboardOffset}>
        {content}
      </KeyboardAvoidingView>
    );
  }

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
