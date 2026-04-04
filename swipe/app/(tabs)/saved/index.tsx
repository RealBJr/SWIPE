import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { CompactAcademicRow } from '@/components/compact-academic-row';
import { SectionHeader } from '@/components/section-header';
import { EmptyState } from '@/components/ui/empty-state';
import { Screen } from '@/components/ui/screen';
import { Copy } from '@/constants/copy';
import { Accent } from '@/constants/theme';
import { courseById, professorById, seedCourses, seedProfessors, seedTAs, taById } from '@/data/seed';
import { useAppColors } from '@/hooks/use-app-colors';
import { useAppStore } from '@/store/app-store';

type ReviewTab = 'classes' | 'professors' | 'tas';

export default function SavedScreen() {
  const c = useAppColors();
  const savedClasses = useAppStore((s) => s.savedClasses);
  const savedProfessors = useAppStore((s) => s.savedProfessors);
  const savedTAs = useAppStore((s) => s.savedTAs);
  const unsaveClass = useAppStore((s) => s.unsaveClass);
  const unsaveProfessor = useAppStore((s) => s.unsaveProfessor);
  const unsaveTA = useAppStore((s) => s.unsaveTA);
  const [reviewTab, setReviewTab] = useState<ReviewTab>('classes');

  const totalSaved = savedClasses.length + savedProfessors.length + savedTAs.length;

  return (
    <Screen scroll>
      <Text style={[styles.title, { color: c.text }]}>Saved</Text>
      <Text style={[styles.sub, { color: c.textSecondary }]}>{Copy.academicRegistry}</Text>

      {totalSaved === 0 ? (
        <EmptyState
          icon="bookmark-outline"
          title="Nothing saved yet"
          subtitle={Copy.emptySaved}
        />
      ) : null}

      {savedClasses.length > 0 ? (
        <View>
          <SectionHeader title="Classes" />
          {savedClasses.map((id) => {
            const co = courseById(id);
            if (!co) return null;
            return (
              <CompactAcademicRow
                key={id}
                title={`${co.code} · ${co.title}`}
                subtitle={co.department}
                meta={`★ ${co.rating.toFixed(1)} · ${co.reviewCount} reviews`}
                onPress={() => router.push(`/class/${id}`)}
                onRemove={() => unsaveClass(id)}
              />
            );
          })}
        </View>
      ) : null}

      {savedProfessors.length > 0 ? (
        <View>
          <SectionHeader title="Professors" />
          {savedProfessors.map((id) => {
            const p = professorById(id);
            if (!p) return null;
            return (
              <CompactAcademicRow
                key={id}
                title={p.name}
                subtitle={p.department}
                meta={`★ ${p.rating.toFixed(1)} · ${p.reviewCount} reviews`}
                onPress={() => router.push(`/professor/${id}`)}
                onRemove={() => unsaveProfessor(id)}
              />
            );
          })}
        </View>
      ) : null}

      {savedTAs.length > 0 ? (
        <View>
          <SectionHeader title="TAs" />
          {savedTAs.map((id) => {
            const t = taById(id);
            if (!t) return null;
            return (
              <CompactAcademicRow
                key={id}
                title={t.name}
                subtitle={t.associatedCourseCode}
                meta={t.officeHours}
                onPress={() => router.push(`/ta/${id}`)}
                onRemove={() => unsaveTA(id)}
              />
            );
          })}
        </View>
      ) : null}

      <View style={styles.reviewSection}>
        <SectionHeader title="Rate & Review" />
        <Text style={[styles.reviewHint, { color: c.textSecondary }]}>
          Help fellow students by reviewing classes, professors, and TAs.
        </Text>

        <View style={[styles.tabRow, { backgroundColor: c.border }]}>
          {(['classes', 'professors', 'tas'] as const).map((tab) => {
            const active = reviewTab === tab;
            const label = tab === 'tas' ? 'TAs' : tab.charAt(0).toUpperCase() + tab.slice(1);
            return (
              <Pressable
                key={tab}
                onPress={() => setReviewTab(tab)}
                style={[styles.tab, active && { backgroundColor: c.surface }]}>
                <Text style={[styles.tabText, { color: active ? Accent.blue : c.textSecondary }, active && { fontWeight: '700' }]}>
                  {label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {reviewTab === 'classes' ? (
          seedCourses.map((co) => (
            <ReviewRow
              key={co.id}
              icon="school-outline"
              title={`${co.code} · ${co.title}`}
              subtitle={`★ ${co.rating.toFixed(1)} · ${co.department}`}
              onReview={() => router.push(`/review/class/${co.id}`)}
              onDetail={() => router.push(`/class/${co.id}`)}
            />
          ))
        ) : null}

        {reviewTab === 'professors' ? (
          seedProfessors.map((p) => (
            <ReviewRow
              key={p.id}
              icon="person-outline"
              title={p.name}
              subtitle={`★ ${p.rating.toFixed(1)} · ${p.department}`}
              onReview={() => router.push(`/review/professor/${p.id}`)}
              onDetail={() => router.push(`/professor/${p.id}`)}
            />
          ))
        ) : null}

        {reviewTab === 'tas' ? (
          seedTAs.map((t) => (
            <ReviewRow
              key={t.id}
              icon="person-outline"
              title={t.name}
              subtitle={`★ ${t.rating.toFixed(1)} · ${t.associatedCourseCode}`}
              onReview={() => router.push(`/review/ta/${t.id}`)}
              onDetail={() => router.push(`/ta/${t.id}`)}
            />
          ))
        ) : null}
      </View>
    </Screen>
  );
}

function ReviewRow({
  icon,
  title,
  subtitle,
  onReview,
  onDetail,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle: string;
  onReview: () => void;
  onDetail: () => void;
}) {
  const c = useAppColors();
  return (
    <View style={[styles.reviewRow, { backgroundColor: c.surface }]}>
      <Pressable onPress={onDetail} style={({ pressed }) => [styles.reviewInfo, pressed && { opacity: 0.8 }]}>
        <Ionicons name={icon} size={20} color={c.textMuted} />
        <View style={styles.reviewTextWrap}>
          <Text style={[styles.reviewTitle, { color: c.text }]} numberOfLines={1}>{title}</Text>
          <Text style={[styles.reviewSub, { color: c.textSecondary }]}>{subtitle}</Text>
        </View>
      </Pressable>
      <Pressable
        onPress={onReview}
        style={({ pressed }) => [styles.reviewBtn, { backgroundColor: Accent.blueMuted }, pressed && { opacity: 0.8 }]}>
        <Ionicons name="star-outline" size={14} color={Accent.blue} />
        <Text style={[styles.reviewBtnText, { color: Accent.blue }]}>Review</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 30, fontWeight: '900', letterSpacing: -0.5, paddingTop: 6 },
  sub: { fontSize: 13, fontWeight: '600', marginTop: 4, marginBottom: 8 },

  reviewSection: { marginTop: 8 },
  reviewHint: { fontSize: 13, fontWeight: '500', lineHeight: 19, marginBottom: 12 },

  tabRow: { flexDirection: 'row', borderRadius: 14, padding: 3, gap: 2, marginBottom: 14 },
  tab: { flex: 1, paddingVertical: 10, borderRadius: 12, alignItems: 'center' },
  tabText: { fontSize: 13, fontWeight: '600' },

  reviewRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    paddingVertical: 12,
    paddingLeft: 14,
    paddingRight: 10,
    marginBottom: 8,
    gap: 10,
  },
  reviewInfo: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 10 },
  reviewTextWrap: { flex: 1 },
  reviewTitle: { fontSize: 14, fontWeight: '700' },
  reviewSub: { fontSize: 12, fontWeight: '500', marginTop: 2 },
  reviewBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderRadius: 20,
    paddingVertical: 7,
    paddingHorizontal: 12,
  },
  reviewBtnText: { fontSize: 12, fontWeight: '700' },
});
