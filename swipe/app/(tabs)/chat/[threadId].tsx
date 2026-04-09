import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { MessageBubble } from '@/components/message-bubble';
import { EmptyState } from '@/components/ui/empty-state';
import { Screen } from '@/components/ui/screen';
import { Copy } from '@/constants/copy';
import { Fonts, Layout } from '@/constants/theme';
import { useAppColors } from '@/hooks/use-app-colors';
import { useAppStore } from '@/store/app-store';

export default function ChatThreadScreen() {
  const { threadId } = useLocalSearchParams<{ threadId: string }>();
  const c = useAppColors();
  const tabBarHeight = useBottomTabBarHeight();
  const thread = useAppStore((s) => (threadId ? s.threads[threadId] : undefined));
  const messages = useAppStore((s) => (threadId ? (s.messages[threadId] ?? []) : []));
  const sendMessage = useAppStore((s) => s.sendMessage);
  const [draft, setDraft] = useState('');
  const [focused, setFocused] = useState(false);

  const sorted = useMemo(
    () =>
      [...messages].sort(
        (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      ),
    [messages]
  );

  if (!threadId || !thread) {
    return (
      <Screen>
        <EmptyState icon="chatbubble-outline" title="Conversation not found" />
      </Screen>
    );
  }

  return (
    <Screen keyboard padded={false} edges={['left', 'right']}>
      <View
        style={[styles.banner, { backgroundColor: c.glass }, Layout.seaGlowLight, Layout.webGlass]}
      >
        <Text style={[styles.bannerTitle, { color: c.onSurface }]}>{thread.peerName}</Text>
        {thread.sharedClassLabel ? (
          <Text style={[styles.bannerSub, { color: c.onSurfaceVariant }]}>
            {thread.sharedClassLabel}
          </Text>
        ) : null}
        {thread.metViaCourseCode ? (
          <Text style={[styles.bannerSub, { color: c.textMuted }]}>
            {Copy.metVia(thread.metViaCourseCode)}
          </Text>
        ) : null}
      </View>
      <FlatList
        data={sorted}
        keyExtractor={(m) => m.id}
        contentContainerStyle={{ padding: 18, paddingBottom: 12 }}
        renderItem={({ item }) => (
          <MessageBubble
            body={item.body}
            mine={item.senderId === 'me'}
            time={new Date(item.createdAt).toLocaleString()}
          />
        )}
      />
      <View
        style={[
          styles.composer,
          { backgroundColor: c.glass, marginBottom: tabBarHeight + 8 },
          Layout.seaGlowLight,
          Layout.webGlass,
        ]}
      >
        <TextInput
          value={draft}
          onChangeText={setDraft}
          placeholder="Message"
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholderTextColor={c.textMuted}
          style={[
            styles.input,
            {
              color: c.onSurface,
              backgroundColor: focused ? c.surfaceContainerLowest : c.surfaceContainerLow,
              borderColor: focused ? c.ghostBorderFocus : c.ghostBorder,
            },
          ]}
          multiline
        />
        <Pressable
          onPress={() => {
            const t = draft.trim();
            if (!t) return;
            sendMessage(threadId, t);
            setDraft('');
          }}
          style={({ pressed }) => [
            styles.sendBtn,
            { backgroundColor: c.primary },
            pressed && { opacity: 0.85, transform: [{ scale: 0.95 }] },
          ]}
        >
          <Ionicons name="send" size={18} color="#FFF" />
        </Pressable>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  banner: {
    marginHorizontal: 16,
    marginTop: 10,
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  bannerTitle: { fontSize: 17, fontWeight: '800', fontFamily: Fonts.sans },
  bannerSub: {
    marginTop: 4,
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.4,
    fontFamily: Fonts.sans,
  },
  composer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 12,
    paddingTop: 10,
    paddingBottom: 14,
    gap: 10,
    marginHorizontal: 12,
    marginBottom: 8,
    borderRadius: 24,
  },
  input: {
    flex: 1,
    borderRadius: 16,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    minHeight: 46,
    maxHeight: 120,
    fontSize: 16,
    fontFamily: Fonts.sans,
    lineHeight: 24,
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
