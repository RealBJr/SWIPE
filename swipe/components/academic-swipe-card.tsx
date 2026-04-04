import { StyleSheet, Text, View } from 'react-native';

import { Copy } from '@/constants/copy';
import { Accent } from '@/constants/theme';
import { useAppColors } from '@/hooks/use-app-colors';
import type { CourseOffering, ProfessorProfile, TAProfile } from '@/types';

export function ClassSwipeCard({ course }: { course: CourseOffering }) {
  const c = useAppColors();
  return (
    <View style={styles.pad}>
      <Text style={[styles.kicker, { color: c.textMuted }]}>{course.department}</Text>
      <Text style={[styles.title, { color: c.text }]}>
        {course.code} · {course.title}
      </Text>
      <View style={styles.row}>
        <Badge label={course.difficulty} />
        <Text style={[styles.meta, { color: c.textSecondary }]}>
          {course.units} units · {course.semester}
        </Text>
      </View>
      <Text style={[styles.rating, { color: c.text }]}>
        ★ {course.rating.toFixed(1)}  ·  {course.reviewCount} reviews
      </Text>
      <Text style={[styles.snippet, { color: c.textSecondary }]} numberOfLines={4}>
        {course.reviewSnippet}
      </Text>
      <Text style={[styles.footer, { color: c.textMuted }]}>Instructor: {course.instructorName}</Text>
      <View style={styles.tags}>
        {course.tags.map((t) => (
          <View key={t} style={[styles.tag, { backgroundColor: Accent.blueMuted }]}>
            <Text style={[styles.tagText, { color: Accent.blue }]}>{t}</Text>
          </View>
        ))}
      </View>
      <Text style={[styles.instruction, { color: c.textMuted }]}>{Copy.swipeToSave}</Text>
    </View>
  );
}

export function ProfessorSwipeCard({ professor }: { professor: ProfessorProfile }) {
  const c = useAppColors();
  return (
    <View style={styles.pad}>
      <Text style={[styles.kicker, { color: c.textMuted }]}>{professor.department}</Text>
      <Text style={[styles.title, { color: c.text }]}>{professor.name}</Text>
      <Text style={[styles.rating, { color: c.text }]}>
        ★ {professor.rating.toFixed(1)}  ·  {professor.reviewCount} reviews
      </Text>
      <Text style={[styles.meta, { color: c.textSecondary }]}>Recent term: {professor.activeTerm}</Text>
      <Text style={[styles.snippet, { color: c.textSecondary }]} numberOfLines={5}>
        {professor.reviewSnippet}
      </Text>
      <Text style={[styles.sub, { color: c.text }]}>Courses</Text>
      <Text style={[styles.footer, { color: c.textSecondary }]}>{professor.coursesTaught.join(', ')}</Text>
      <Text style={[styles.instruction, { color: c.textMuted }]}>{Copy.swipeToSave}</Text>
    </View>
  );
}

export function TASwipeCard({ ta }: { ta: TAProfile }) {
  const c = useAppColors();
  return (
    <View style={styles.pad}>
      <Text style={[styles.kicker, { color: c.textMuted }]}>{ta.department}</Text>
      <Text style={[styles.title, { color: c.text }]}>{ta.name}</Text>
      <Text style={[styles.meta, { color: c.textSecondary }]}>Course: {ta.associatedCourseCode}</Text>
      <Text style={[styles.meta, { color: c.textSecondary }]}>Availability: {ta.officeHours}</Text>
      <Text style={[styles.rating, { color: c.text }]}>★ {ta.rating.toFixed(1)} average</Text>
      <Text style={[styles.snippet, { color: c.textSecondary }]} numberOfLines={5}>
        {ta.reviewSnippet}
      </Text>
      <Text style={[styles.instruction, { color: c.textMuted }]}>{Copy.swipeToSave}</Text>
    </View>
  );
}

function Badge({ label }: { label: string }) {
  return (
    <View style={[styles.badge, { backgroundColor: Accent.blueMuted }]}>
      <Text style={[styles.badgeText, { color: Accent.blue }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pad: { padding: 18, gap: 10 },
  kicker: { fontSize: 11, fontWeight: '700', letterSpacing: 0.8, textTransform: 'uppercase' },
  title: { fontSize: 22, fontWeight: '800', lineHeight: 28, letterSpacing: -0.3 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 10, flexWrap: 'wrap' },
  meta: { fontSize: 13, fontWeight: '600' },
  rating: { fontSize: 16, fontWeight: '800' },
  snippet: { fontSize: 14, lineHeight: 21 },
  footer: { fontSize: 13, fontWeight: '600' },
  sub: { fontSize: 13, fontWeight: '800' },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 4 },
  tag: { borderRadius: 20, paddingVertical: 6, paddingHorizontal: 12 },
  tagText: { fontSize: 12, fontWeight: '700' },
  instruction: { fontSize: 12, fontWeight: '600' },
  badge: { borderRadius: 20, paddingVertical: 5, paddingHorizontal: 12 },
  badgeText: { fontSize: 12, fontWeight: '700' },
});
