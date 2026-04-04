import { router, useLocalSearchParams } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { FlatList, StyleSheet, Text, View } from 'react-native';

import { EmptyState } from '@/components/ui/empty-state';
import { PrimaryButton } from '@/components/ui/primary-button';
import { Screen } from '@/components/ui/screen';
import { Copy } from '@/constants/copy';
import { Layout } from '@/constants/theme';
import { taById } from '@/data/seed';
import { fetchEntityReviews } from '@/services/mockApi';
import { useAppColors } from '@/hooks/use-app-colors';

export default function TADetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const c = useAppColors();
  const t = id ? taById(id) : undefined;
  const { data: reviews = [] } = useQuery({
    queryKey: ['reviews', 'ta', id],
    queryFn: () => fetchEntityReviews('ta', id!),
    enabled: Boolean(id),
  });

  if (!t) {
    return (
      <Screen>
        <EmptyState icon="person-outline" title="TA not found" />
      </Screen>
    );
  }

  return (
    <Screen scroll>
      <Text style={[styles.title, { color: c.text }]}>{t.name}</Text>
      <Text style={[styles.meta, { color: c.textSecondary }]}>
        {t.department} · {t.associatedCourseCode}
      </Text>
      <Text style={[styles.meta, { color: c.textSecondary }]}>{t.officeHours}</Text>
      <Text style={[styles.ratingLine, { color: c.text }]}>★ {t.rating.toFixed(1)}</Text>
      <Text style={[styles.body, { color: c.textSecondary }]}>{t.reviewSnippet}</Text>
      <View style={{ marginTop: 16 }}>
        <PrimaryButton label={Copy.addReview} onPress={() => router.push(`/review/ta/${t.id}`)} />
      </View>
      <Text style={[styles.section, { color: c.text }]}>{Copy.reviews}</Text>
      <FlatList
        data={reviews}
        keyExtractor={(r) => r.id}
        scrollEnabled={false}
        renderItem={({ item }) => (
          <View style={[styles.card, { backgroundColor: c.surface }, Layout.shadowLight]}>
            <Text style={{ color: c.text, fontWeight: '800', fontSize: 15 }}>
              ★ {item.rating.toFixed(1)} · {item.authorName}
            </Text>
            <Text style={{ color: c.textSecondary, marginTop: 6, fontSize: 14, lineHeight: 20 }}>{item.body}</Text>
            {item.tags.length > 0 ? (
              <Text style={{ color: c.textMuted, marginTop: 8, fontSize: 12, fontWeight: '700' }}>
                {item.tags.join(' · ')}
              </Text>
            ) : null}
          </View>
        )}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 24, fontWeight: '900', letterSpacing: -0.3, paddingTop: 4 },
  meta: { marginTop: 8, fontWeight: '600', fontSize: 13 },
  ratingLine: { marginTop: 10, fontSize: 18, fontWeight: '800' },
  body: { marginTop: 10, lineHeight: 21, fontWeight: '500', fontSize: 14 },
  section: { marginTop: 24, marginBottom: 12, fontSize: 18, fontWeight: '800' },
  card: { borderRadius: 16, padding: 14, marginBottom: 10 },
});
