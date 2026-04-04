import { Image } from 'expo-image';
import { StyleSheet, Text, View } from 'react-native';

import { Copy } from '@/constants/copy';
import { Accent } from '@/constants/theme';
import { courseById } from '@/data/seed';
import { useAppColors } from '@/hooks/use-app-colors';
import type { StudentProfile } from '@/types';

export function StudentSwipeCard({
  student,
  viewerClassIds,
}: {
  student: StudentProfile;
  viewerClassIds: string[];
}) {
  const c = useAppColors();
  const shared = student.classIds.filter((id) => viewerClassIds.includes(id));
  const sharedTitles = shared
    .map((id) => courseById(id)?.code)
    .filter(Boolean)
    .slice(0, 3)
    .join(', ');

  return (
    <View style={styles.root}>
      <Image source={{ uri: student.imageUrl }} style={styles.image} contentFit="cover" />
      <View style={styles.body}>
        <Text style={[styles.name, { color: c.text }]}>{student.fullName}</Text>
        <Text style={[styles.meta, { color: c.textSecondary }]}>
          {student.program} · {student.yearLabel}
        </Text>
        {sharedTitles.length > 0 ? (
          <View style={styles.sharedRow}>
            <Text style={[styles.sharedLabel, { color: c.textMuted }]}>{Copy.sharedClass}</Text>
            <Text style={[styles.sharedValue, { color: Accent.blue }]}>{sharedTitles}</Text>
          </View>
        ) : (
          <Text style={[styles.hint, { color: c.textMuted }]}>{Copy.suggestedConnection}</Text>
        )}
        <Text style={[styles.bio, { color: c.textSecondary }]} numberOfLines={3}>
          {student.bio}
        </Text>
        <View style={styles.tags}>
          {student.suggestedContexts.slice(0, 2).map((t) => (
            <View key={t} style={[styles.tag, { backgroundColor: Accent.blueMuted }]}>
              <Text style={[styles.tagText, { color: Accent.blue }]}>{t}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  image: { width: '100%', height: 260, backgroundColor: '#E5E5E5' },
  body: { padding: 18, gap: 6 },
  name: { fontSize: 24, fontWeight: '800', letterSpacing: -0.3 },
  meta: { fontSize: 14, fontWeight: '600' },
  sharedRow: { gap: 3, marginTop: 10 },
  sharedLabel: { fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.8 },
  sharedValue: { fontSize: 14, fontWeight: '700' },
  hint: { fontSize: 13, fontWeight: '600', marginTop: 10 },
  bio: { marginTop: 8, fontSize: 14, lineHeight: 21 },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 12 },
  tag: { borderRadius: 20, paddingVertical: 6, paddingHorizontal: 12 },
  tagText: { fontSize: 12, fontWeight: '700' },
});
