import { router } from 'expo-router';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

import { EmptyState } from '@/components/ui/empty-state';
import { Screen } from '@/components/ui/screen';
import { Copy } from '@/constants/copy';
import { Fonts, Layout } from '@/constants/theme';
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
        <Text style={[styles.title, { color: c.onSurface }]}>Scholarly Chat</Text>
        <Text style={[styles.sub, { color: c.onSurfaceVariant }]}>
          Only classmates you have connected with.
        </Text>
      </View>
      <FlatList
        data={list}
        keyExtractor={(t) => t.id}
        contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 16, paddingBottom: 30 }}
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
              { backgroundColor: c.surfaceContainerLowest },
              Layout.seaGlowLight,
              pressed && { opacity: 0.88, transform: [{ scale: 0.99 }] },
            ]}
          >
            <View style={[styles.avatarDot, { backgroundColor: c.surfaceContainerLow }]}>
              <Text
                style={{
                  color: c.primary,
                  fontWeight: '800',
                  fontSize: 15,
                  fontFamily: Fonts.sans,
                }}
              >
                {item.peerName.charAt(0)}
              </Text>
            </View>
            <View style={styles.rowBody}>
              <Text style={[styles.name, { color: c.onSurface }]}>{item.peerName}</Text>
              {item.sharedClassLabel ? (
                <Text style={[styles.meta, { color: c.textMuted }]}>{item.sharedClassLabel}</Text>
              ) : null}
              {item.metViaCourseCode ? (
                <Text style={[styles.meta, { color: c.textMuted }]}>
                  {Copy.metVia(item.metViaCourseCode)}
                </Text>
              ) : null}
              <Text style={[styles.preview, { color: c.onSurfaceVariant }]} numberOfLines={2}>
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
  top: { paddingHorizontal: 24, paddingTop: 18 },
  title: {
    fontSize: 32,
    fontWeight: '900',
    letterSpacing: -0.7,
    fontFamily: Fonts.sans,
    marginLeft: 10,
  },
  sub: { fontSize: 14, fontWeight: '500', marginTop: 6, fontFamily: Fonts.sans },
  row: {
    borderRadius: Layout.radiusLg,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
  },
  avatarDot: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  rowBody: { flex: 1 },
  name: { fontSize: 17, fontWeight: '800', fontFamily: Fonts.sans },
  meta: {
    marginTop: 4,
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    fontFamily: Fonts.sans,
  },
  preview: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 22,
    fontFamily: Fonts.sans,
  },
  time: { fontSize: 11, fontWeight: '700', letterSpacing: 0.4, fontFamily: Fonts.sans },
});
