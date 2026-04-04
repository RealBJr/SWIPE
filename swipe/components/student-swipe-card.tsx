import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { Copy } from '@/constants/copy';
import { Accent } from '@/constants/theme';
import { courseById } from '@/data/seed';
import { useAppColors } from '@/hooks/use-app-colors';
import type { StudentProfile } from '@/types';

const IMAGE_H = Dimensions.get('window').height * 0.34;

export function StudentSwipeCard({
  student,
  viewerClassIds,
}: {
  student: StudentProfile;
  viewerClassIds: string[];
}) {
  const c = useAppColors();
  const shared = student.classIds.filter((id) => viewerClassIds.includes(id));
  const sharedNames = shared
    .map((id) => courseById(id)?.title?.split(' ').slice(-1)[0])
    .filter(Boolean)
    .slice(0, 3);

  return (
    <View style={styles.root}>
      <View style={styles.imageWrap}>
        <Image source={{ uri: student.imageUrl }} style={styles.image} contentFit="cover" />
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.65)']}
          style={styles.gradient}
        />
        {shared.length > 0 ? (
          <View style={styles.recommendBadge}>
            <Text style={styles.recommendText}>RECOMMENDED</Text>
          </View>
        ) : null}
        <View style={styles.overlayInfo}>
          <Text style={styles.overlayName}>{student.fullName}</Text>
          <Text style={styles.overlayMeta}>
            {student.program} · {student.yearLabel}
          </Text>
        </View>
      </View>

      <View style={styles.body}>
        {sharedNames.length > 0 ? (
          <View style={[styles.sharedSection, { backgroundColor: c.surface }]}>
            <View style={styles.sharedHeader}>
              <Ionicons name="school-outline" size={14} color={Accent.blue} />
              <Text style={[styles.sharedLabel, { color: Accent.blue }]}>{Copy.sharedClass.toUpperCase()}ES</Text>
            </View>
            <View style={styles.sharedTags}>
              {sharedNames.map((name) => (
                <View key={name} style={[styles.sharedPill, { backgroundColor: c.background, borderColor: c.border }]}>
                  <Text style={[styles.sharedPillText, { color: c.text }]}>{name}</Text>
                </View>
              ))}
            </View>
          </View>
        ) : null}

        <Text style={[styles.bio, { color: c.textSecondary }]} numberOfLines={3}>
          "{student.bio}"
        </Text>

        {student.suggestedContexts.length > 0 ? (
          <View style={styles.contextTags}>
            {student.suggestedContexts.slice(0, 3).map((t) => (
              <View key={t} style={[styles.tag, { backgroundColor: Accent.blueMuted }]}>
                <Text style={[styles.tagText, { color: Accent.blue }]}>{t}</Text>
              </View>
            ))}
          </View>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  imageWrap: { height: IMAGE_H, position: 'relative' },
  image: { width: '100%', height: '100%', backgroundColor: '#E0E0E0' },
  gradient: { position: 'absolute', bottom: 0, left: 0, right: 0, height: IMAGE_H * 0.5 },
  recommendBadge: {
    position: 'absolute',
    bottom: 80,
    left: 16,
    backgroundColor: Accent.blue,
    borderRadius: 6,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  recommendText: { color: '#FFF', fontSize: 10, fontWeight: '800', letterSpacing: 1 },
  overlayInfo: { position: 'absolute', bottom: 16, left: 16, right: 16 },
  overlayName: { color: '#FFF', fontSize: 26, fontWeight: '900', letterSpacing: -0.3 },
  overlayMeta: { color: 'rgba(255,255,255,0.8)', fontSize: 14, fontWeight: '600', marginTop: 2 },
  body: { padding: 16, gap: 12 },
  sharedSection: { borderRadius: 14, padding: 14, gap: 8 },
  sharedHeader: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  sharedLabel: { fontSize: 11, fontWeight: '800', letterSpacing: 0.8 },
  sharedTags: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  sharedPill: { borderRadius: 10, borderWidth: 1, paddingVertical: 6, paddingHorizontal: 14 },
  sharedPillText: { fontSize: 13, fontWeight: '700' },
  bio: { fontSize: 14, lineHeight: 21, fontStyle: 'italic' },
  contextTags: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  tag: { borderRadius: 20, paddingVertical: 5, paddingHorizontal: 12 },
  tagText: { fontSize: 12, fontWeight: '700' },
});
