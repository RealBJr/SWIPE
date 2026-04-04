import { StyleSheet, Text, View } from 'react-native';

import { Accent, Layout } from '@/constants/theme';
import { useAppColors } from '@/hooks/use-app-colors';

export function MessageBubble({
  body,
  time,
  mine,
}: {
  body: string;
  time: string;
  mine: boolean;
}) {
  const c = useAppColors();
  return (
    <View style={[styles.row, mine ? styles.alignEnd : styles.alignStart]}>
      <View
        style={[
          styles.bubble,
          mine
            ? {
                backgroundColor: Accent.blue,
                borderBottomRightRadius: 6,
              }
            : {
                backgroundColor: c.surface,
                borderBottomLeftRadius: 6,
                ...Layout.shadowLight,
              },
        ]}>
        <Text style={[styles.text, { color: mine ? '#FFF' : c.text }]}>{body}</Text>
        <Text style={[styles.time, { color: mine ? 'rgba(255,255,255,0.7)' : c.textMuted }]}>{time}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { marginVertical: 5, paddingHorizontal: 4 },
  alignStart: { alignItems: 'flex-start' },
  alignEnd: { alignItems: 'flex-end' },
  bubble: {
    maxWidth: '82%',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  text: { fontSize: 15, lineHeight: 21 },
  time: { marginTop: 5, fontSize: 11, fontWeight: '500' },
});
