import { router } from 'expo-router';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

import { EmptyState } from '@/components/ui/empty-state';
import { Screen } from '@/components/ui/screen';
import { Copy } from '@/constants/copy';
import { Accent, Layout } from '@/constants/theme';
import { useAppColors } from '@/hooks/use-app-colors';
import { useAppStore } from '@/store/app-store';

export default function ChatListScreen() {
  const c = useAppColors();
  const threads = useAppStore((s) => s.threads);
  const list = Object.values(threads).sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );

  return (
    <Screen padded={false}>
      <View style={styles.top}>
        <Text style={[styles.title, { color: c.text }]}>Chat</Text>
        <Text style={[styles.sub, { color: c.textSecondary }]}>Only classmates you have connected with.</Text>
      </View>
      <FlatList
        data={list}
        keyExtractor={(t) => t.id}
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 12, paddingBottom: 24 }}
        ListEmptyComponent={
          <EmptyState
            icon="chatbubbles-outline"
            title="No conversations yet"
            subtitle={Copy.emptyChat}
          />
        }
        renderItem={({ item }) => (
          <Pressable
            onPress={() =>
              router.push({ pathname: '/(tabs)/chat/[threadId]', params: { threadId: item.id } })
            }
            style={({ pressed }) => [
              styles.row,
              { backgroundColor: c.surface },
              Layout.shadowLight,
              pressed && { opacity: 0.88, transform: [{ scale: 0.99 }] },
            ]}>
            <View style={[styles.avatarDot, { backgroundColor: Accent.blueMuted }]}>
              <Text style={{ color: Accent.blue, fontWeight: '800', fontSize: 15 }}>
                {item.peerName.charAt(0)}
              </Text>
            </View>
            <View style={styles.rowBody}>
              <Text style={[styles.name, { color: c.text }]}>{item.peerName}</Text>
              {item.sharedClassLabel ? (
                <Text style={[styles.meta, { color: c.textMuted }]}>{item.sharedClassLabel}</Text>
              ) : null}
              {item.metViaCourseCode ? (
                <Text style={[styles.meta, { color: c.textMuted }]}>
                  {Copy.metVia(item.metViaCourseCode)}
                </Text>
              ) : null}
              <Text style={[styles.preview, { color: c.textSecondary }]} numberOfLines={2}>
                {item.lastMessagePreview}
              </Text>
            </View>
            <Text style={[styles.time, { color: c.textMuted }]}>
              {new Date(item.updatedAt).toLocaleDateString()}
            </Text>
          </Pressable>
        )}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  top: { paddingHorizontal: 20, paddingTop: 14 },
  title: { fontSize: 30, fontWeight: '900', letterSpacing: -0.5 },
  sub: { fontSize: 13, fontWeight: '600', marginTop: 4 },
  row: {
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
  },
  avatarDot: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  rowBody: { flex: 1 },
  name: { fontSize: 16, fontWeight: '800' },
  meta: { marginTop: 3, fontSize: 12, fontWeight: '700' },
  preview: { marginTop: 6, fontSize: 13, fontWeight: '500', lineHeight: 18 },
  time: { fontSize: 11, fontWeight: '700' },
  empty: { padding: 24, textAlign: 'center', fontSize: 14, fontWeight: '600' },
});
