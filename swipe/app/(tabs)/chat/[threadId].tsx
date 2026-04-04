import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import { FlatList, KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { MessageBubble } from '@/components/message-bubble';
import { Copy } from '@/constants/copy';
import { Accent, Layout } from '@/constants/theme';
import { useAppColors } from '@/hooks/use-app-colors';
import { useAppStore } from '@/store/app-store';

export default function ChatThreadScreen() {
  const { threadId } = useLocalSearchParams<{ threadId: string }>();
  const c = useAppColors();
  const thread = useAppStore((s) => (threadId ? s.threads[threadId] : undefined));
  const messages = useAppStore((s) => (threadId ? s.messages[threadId] ?? [] : []));
  const sendMessage = useAppStore((s) => s.sendMessage);
  const [draft, setDraft] = useState('');

  const sorted = useMemo(
    () => [...messages].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()),
    [messages]
  );

  if (!threadId || !thread) {
    return (
      <View style={[styles.fill, { backgroundColor: c.background }]}>
        <Text style={{ color: c.textSecondary, padding: 20 }}>Conversation not found.</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={[styles.fill, { backgroundColor: c.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={88}>
      <View style={[styles.banner, { backgroundColor: c.surface }, Layout.shadowLight]}>
        <Text style={[styles.bannerTitle, { color: c.text }]}>{thread.peerName}</Text>
        {thread.sharedClassLabel ? (
          <Text style={[styles.bannerSub, { color: c.textSecondary }]}>{thread.sharedClassLabel}</Text>
        ) : null}
        {thread.metViaCourseCode ? (
          <Text style={[styles.bannerSub, { color: c.textMuted }]}>{Copy.metVia(thread.metViaCourseCode)}</Text>
        ) : null}
      </View>
      <FlatList
        data={sorted}
        keyExtractor={(m) => m.id}
        contentContainerStyle={{ padding: 16, paddingBottom: 12 }}
        renderItem={({ item }) => (
          <MessageBubble
            body={item.body}
            mine={item.senderId === 'me'}
            time={new Date(item.createdAt).toLocaleString()}
          />
        )}
      />
      <View style={[styles.composer, { backgroundColor: c.surface }, Layout.shadowLight]}>
        <TextInput
          value={draft}
          onChangeText={setDraft}
          placeholder="Message"
          placeholderTextColor={c.textMuted}
          style={[styles.input, { color: c.text, backgroundColor: c.background }]}
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
            { backgroundColor: Accent.blue },
            pressed && { opacity: 0.85, transform: [{ scale: 0.95 }] },
          ]}>
          <Ionicons name="send" size={18} color="#FFF" />
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  banner: { paddingHorizontal: 20, paddingVertical: 14 },
  bannerTitle: { fontSize: 17, fontWeight: '800' },
  bannerSub: { marginTop: 3, fontSize: 12, fontWeight: '600' },
  composer: { flexDirection: 'row', alignItems: 'flex-end', padding: 12, gap: 10 },
  input: {
    flex: 1,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    minHeight: 44,
    maxHeight: 120,
    fontSize: 16,
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
