import { useQueryClient } from '@tanstack/react-query';
import { router, useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { PrimaryButton } from '@/components/ui/primary-button';
import { Screen } from '@/components/ui/screen';
import { Accent } from '@/constants/theme';
import { useAppColors } from '@/hooks/use-app-colors';
import { submitReview } from '@/services/mockApi';
import type { ReviewEntityKind } from '@/types';

const TAGS = ['Clear', 'Helpful', 'Difficult', 'Engaging', 'Good explanations', 'Heavy workload', 'Important'];

export default function ReviewModal() {
  const { kind, id } = useLocalSearchParams<{ kind: string; id: string }>();
  const qc = useQueryClient();
  const c = useAppColors();
  const entityKind = kind as ReviewEntityKind;
  const [rating, setRating] = useState(5);
  const [body, setBody] = useState('');
  const [selected, setSelected] = useState<string[]>([]);

  const title = useMemo(() => {
    if (entityKind === 'class') return 'Class review';
    if (entityKind === 'professor') return 'Professor review';
    return 'TA review';
  }, [entityKind]);

  async function save() {
    await submitReview({
      entityKind,
      entityId: id,
      rating,
      body: body.trim() || 'No comment provided.',
      tags: selected,
    });
    await qc.invalidateQueries({ queryKey: ['reviews', entityKind, id] });
    router.back();
  }

  function toggle(tag: string) {
    setSelected((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]));
  }

  return (
    <Screen scroll>
      <Text style={[styles.title, { color: c.text }]}>{title}</Text>
      <Text style={[styles.label, { color: c.textSecondary }]}>Rating</Text>
      <View style={styles.row}>
        {[1, 2, 3, 4, 5].map((n) => {
          const active = n <= rating;
          return (
            <Pressable
              key={n}
              onPress={() => setRating(n)}
              style={[
                styles.ratingBtn,
                active
                  ? { backgroundColor: Accent.blue }
                  : { backgroundColor: c.surface },
              ]}>
              <Text style={{ color: active ? '#FFF' : c.text, fontWeight: '800', fontSize: 16 }}>
                {n}
              </Text>
            </Pressable>
          );
        })}
      </View>
      <Text style={[styles.label, { color: c.textSecondary }]}>Comment</Text>
      <TextInput
        value={body}
        onChangeText={setBody}
        placeholder="Short, constructive feedback"
        placeholderTextColor={c.textMuted}
        multiline
        style={[styles.input, { color: c.text, backgroundColor: c.surface }]}
      />
      <Text style={[styles.label, { color: c.textSecondary }]}>Tags</Text>
      <View style={styles.wrap}>
        {TAGS.map((t) => {
          const on = selected.includes(t);
          return (
            <Pressable
              key={t}
              onPress={() => toggle(t)}
              style={[
                styles.tag,
                on
                  ? { backgroundColor: Accent.blueMuted }
                  : { backgroundColor: c.surface },
              ]}>
              <Text style={{ color: on ? Accent.blue : c.textSecondary, fontWeight: '700', fontSize: 13 }}>
                {t}
              </Text>
            </Pressable>
          );
        })}
      </View>
      <PrimaryButton label="Submit review" onPress={() => void save()} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 24, fontWeight: '900', marginBottom: 16, letterSpacing: -0.3 },
  label: { fontSize: 12, fontWeight: '700', marginTop: 14, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 },
  row: { flexDirection: 'row', gap: 10 },
  ratingBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    borderRadius: 14,
    padding: 14,
    minHeight: 110,
    textAlignVertical: 'top',
    fontSize: 16,
  },
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 20 },
  tag: { borderRadius: 20, paddingVertical: 8, paddingHorizontal: 14 },
});
