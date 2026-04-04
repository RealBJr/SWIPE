import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Dimensions, Linking, Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { Copy } from '@/constants/copy';
import { Accent } from '@/constants/theme';
import { useAppColors } from '@/hooks/use-app-colors';
import type { CourseOffering, ProfessorProfile, TAProfile } from '@/types';

const IMAGE_H = Dimensions.get('window').height * 0.34;

const COURSE_GRADIENTS: Record<string, [string, string]> = {
  'Computer Science': ['#93C5FD', '#3B82F6'],
  'Data Science & Engineering': ['#A5B4FC', '#6366F1'],
  'Mathematics': ['#86EFAC', '#22C55E'],
};

function getDifficultyColor(difficulty: string) {
  switch (difficulty) {
    case 'Advanced': return '#EF4444';
    case 'Intermediate': return '#F59E0B';
    case 'Lab-heavy': return '#8B5CF6';
    default: return '#22C55E';
  }
}

export function ClassSwipeCard({ course }: { course: CourseOffering }) {
  const c = useAppColors();
  const gradient = COURSE_GRADIENTS[course.department] ?? ['#93C5FD', '#3B82F6'];
  const diffColor = getDifficultyColor(course.difficulty);

  return (
    <View style={styles.root}>
      <LinearGradient colors={gradient} style={styles.courseBanner} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
        <View style={[styles.deptBadge, { backgroundColor: 'rgba(255,255,255,0.25)' }]}>
          <Text style={styles.deptBadgeText}>{course.department.toUpperCase()}</Text>
        </View>
        <Text style={styles.courseCode}>{course.code}</Text>
      </LinearGradient>

      <View style={styles.body}>
        <View style={styles.titleRow}>
          <Text style={[styles.title, { color: c.text }]} numberOfLines={2}>{course.title}</Text>
          <View style={[styles.diffBadge, { backgroundColor: diffColor + '18' }]}>
            <Text style={[styles.diffText, { color: diffColor }]}>Difficulty: {course.difficulty}</Text>
          </View>
        </View>

        <View style={styles.statsRow}>
          <Text style={[styles.ratingText, { color: c.text }]}>
            <Text style={{ color: '#F59E0B' }}>★</Text> {course.rating.toFixed(1)} · {course.reviewCount} Reviews
          </Text>
          <Text style={[styles.unitText, { color: c.textSecondary }]}>{course.units} Units</Text>
        </View>

        <View style={[styles.quoteBox, { backgroundColor: c.background }]}>
          <Text style={[styles.quoteIcon, { color: Accent.blue }]}>"</Text>
          <Text style={[styles.quoteText, { color: c.textSecondary }]} numberOfLines={3}>
            {course.reviewSnippet}
          </Text>
        </View>

        <Text style={[styles.swipeHint, { color: c.textMuted }]}>{Copy.swipeToSave} →</Text>

        <View style={styles.instructorRow}>
          <Ionicons name="person-circle-outline" size={28} color={c.textMuted} />
          <View style={{ flex: 1 }}>
            <Text style={[styles.instructorLabel, { color: c.textMuted }]}>Instructor</Text>
            <Text style={[styles.instructorName, { color: c.text }]}>{course.instructorName}</Text>
          </View>
          <Pressable
            onPress={() => Linking.openURL('https://example.com/syllabus')}
            style={styles.syllabusBtn}>
            <Text style={[styles.syllabusText, { color: Accent.blue }]}>Syllabus</Text>
            <Ionicons name="open-outline" size={13} color={Accent.blue} />
          </Pressable>
        </View>

        <View style={styles.tags}>
          {course.tags.map((t) => (
            <View key={t} style={[styles.tag, { backgroundColor: c.background, borderColor: c.border }]}>
              <Text style={[styles.tagText, { color: c.text }]}>{t}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

export function ProfessorSwipeCard({ professor }: { professor: ProfessorProfile }) {
  const c = useAppColors();

  return (
    <View style={styles.root}>
      <View style={styles.imageWrap}>
        <Image source={{ uri: professor.imageUrl }} style={styles.image} contentFit="cover" />
        <LinearGradient colors={['transparent', 'rgba(0,0,0,0.6)']} style={styles.gradient} />
        <View style={styles.ratingBadge}>
          <Text style={{ color: '#F59E0B', fontSize: 12 }}>★</Text>
          <Text style={styles.ratingBadgeText}>{professor.rating.toFixed(1)} Rating</Text>
        </View>
        <View style={styles.overlayInfo}>
          <Text style={styles.overlayName}>{professor.name}</Text>
          <Text style={styles.overlayMeta}>{professor.department} Department</Text>
        </View>
      </View>

      <View style={styles.body}>
        <View style={styles.pillRow}>
          <View style={[styles.pill, { backgroundColor: c.background, borderColor: c.border }]}>
            <Text style={[styles.pillLabel, { color: c.textMuted }]}>TOTAL IMPACT</Text>
            <Text style={[styles.pillValue, { color: c.text }]}>{professor.reviewCount} reviews</Text>
          </View>
          <View style={[styles.pill, { backgroundColor: c.background, borderColor: c.border }]}>
            <Text style={[styles.pillLabel, { color: c.textMuted }]}>ACTIVE TERM</Text>
            <Text style={[styles.pillValue, { color: c.text }]}>{professor.activeTerm}</Text>
          </View>
        </View>

        <View style={[styles.quoteBox, { backgroundColor: c.background }]}>
          <Text style={[styles.quoteIcon, { color: Accent.blue }]}>"</Text>
          <Text style={[styles.quoteText, { color: c.textSecondary }]} numberOfLines={3}>
            {professor.reviewSnippet}
          </Text>
        </View>
      </View>
    </View>
  );
}

export function TASwipeCard({ ta }: { ta: TAProfile }) {
  const c = useAppColors();

  return (
    <View style={styles.root}>
      <View style={styles.imageWrap}>
        <Image source={{ uri: ta.imageUrl }} style={styles.image} contentFit="cover" />
        <LinearGradient colors={['transparent', 'rgba(0,0,0,0.6)']} style={styles.gradient} />
        <View style={styles.overlayBottom}>
          <View style={styles.taNameRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.overlayName}>{ta.name}</Text>
              <Text style={styles.overlayMeta}>{ta.associatedCourseCode} specialist</Text>
            </View>
            <View style={styles.taRatingBadge}>
              <Text style={{ color: '#F59E0B', fontSize: 12 }}>★</Text>
              <Text style={styles.taRatingText}>{ta.rating.toFixed(1)}</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.body}>
        <View style={styles.pillRow}>
          <View style={[styles.pill, { backgroundColor: c.background, borderColor: c.border }]}>
            <Text style={[styles.pillLabel, { color: c.textMuted }]}>DEPARTMENT</Text>
            <Text style={[styles.pillValue, { color: c.text }]}>{ta.department}</Text>
          </View>
          <View style={[styles.pill, { backgroundColor: c.background, borderColor: c.border }]}>
            <Text style={[styles.pillLabel, { color: c.textMuted }]}>AVAILABILITY</Text>
            <Text style={[styles.pillValue, { color: c.text }]} numberOfLines={1}>{ta.officeHours.split(',')[0]}</Text>
          </View>
        </View>

        <View style={[styles.quoteBox, { backgroundColor: c.background }]}>
          <Text style={[styles.quoteIcon, { color: Accent.blue }]}>"</Text>
          <Text style={[styles.quoteText, { color: c.textSecondary }]} numberOfLines={3}>
            {ta.reviewSnippet}
          </Text>
        </View>

        <Text style={[styles.swipeHint, { color: c.textMuted }]}>» {Copy.swipeToSave} →</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },

  // Hero image
  imageWrap: { height: IMAGE_H, position: 'relative' },
  image: { width: '100%', height: '100%', backgroundColor: '#E0E0E0' },
  gradient: { position: 'absolute', bottom: 0, left: 0, right: 0, height: IMAGE_H * 0.5 },
  overlayInfo: { position: 'absolute', bottom: 16, left: 16, right: 16 },
  overlayBottom: { position: 'absolute', bottom: 16, left: 16, right: 16 },
  overlayName: { color: '#FFF', fontSize: 24, fontWeight: '900', letterSpacing: -0.3 },
  overlayMeta: { color: 'rgba(255,255,255,0.8)', fontSize: 13, fontWeight: '600', marginTop: 2 },
  ratingBadge: {
    position: 'absolute',
    bottom: 80,
    left: 16,
    backgroundColor: 'rgba(0,0,0,0.55)',
    borderRadius: 10,
    paddingVertical: 5,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingBadgeText: { color: '#FFF', fontSize: 12, fontWeight: '800' },

  // TA overlay
  taNameRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 12 },
  taRatingBadge: {
    backgroundColor: 'rgba(0,0,0,0.55)',
    borderRadius: 10,
    paddingVertical: 5,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  taRatingText: { color: '#FFF', fontSize: 14, fontWeight: '800' },

  // Course banner
  courseBanner: {
    height: 180,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    gap: 8,
  },
  deptBadge: { borderRadius: 8, paddingVertical: 4, paddingHorizontal: 12 },
  deptBadgeText: { color: '#FFF', fontSize: 10, fontWeight: '800', letterSpacing: 1 },
  courseCode: { color: '#FFF', fontSize: 42, fontWeight: '900', letterSpacing: -1 },

  // Body
  body: { padding: 16, gap: 12 },
  titleRow: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 },
  title: { fontSize: 20, fontWeight: '800', flex: 1 },
  diffBadge: { borderRadius: 20, paddingVertical: 4, paddingHorizontal: 10, flexShrink: 0 },
  diffText: { fontSize: 11, fontWeight: '700' },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  ratingText: { fontSize: 15, fontWeight: '700' },
  unitText: { fontSize: 14, fontWeight: '600' },

  // Quote
  quoteBox: { borderRadius: 14, padding: 14, gap: 4 },
  quoteIcon: { fontSize: 28, fontWeight: '900', lineHeight: 28, marginBottom: -4 },
  quoteText: { fontSize: 14, lineHeight: 21, fontStyle: 'italic' },

  // Instructor row
  instructorRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  instructorLabel: { fontSize: 11, fontWeight: '600' },
  instructorName: { fontSize: 14, fontWeight: '700' },
  syllabusBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  syllabusText: { fontSize: 13, fontWeight: '700' },

  swipeHint: { fontSize: 11, fontWeight: '600', letterSpacing: 0.5, textTransform: 'uppercase', textAlign: 'center' },

  // Pills
  pillRow: { flexDirection: 'row', gap: 10 },
  pill: {
    flex: 1,
    borderRadius: 14,
    borderWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 14,
    gap: 2,
  },
  pillLabel: { fontSize: 10, fontWeight: '700', letterSpacing: 0.8, textTransform: 'uppercase' },
  pillValue: { fontSize: 15, fontWeight: '800' },

  // Tags
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 4 },
  tag: { borderRadius: 20, borderWidth: 1, paddingVertical: 5, paddingHorizontal: 12 },
  tagText: { fontSize: 12, fontWeight: '700' },
});
