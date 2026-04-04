import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { CompactAcademicRow } from '@/components/compact-academic-row';
import { SectionHeader } from '@/components/section-header';
import { Screen } from '@/components/ui/screen';
import { Copy } from '@/constants/copy';
import { courseById, professorById, taById } from '@/data/seed';
import { useAppColors } from '@/hooks/use-app-colors';
import { useAppStore } from '@/store/app-store';

export default function SavedScreen() {
  const c = useAppColors();
  const savedClasses = useAppStore((s) => s.savedClasses);
  const savedProfessors = useAppStore((s) => s.savedProfessors);
  const savedTAs = useAppStore((s) => s.savedTAs);
  const unsaveClass = useAppStore((s) => s.unsaveClass);
  const unsaveProfessor = useAppStore((s) => s.unsaveProfessor);
  const unsaveTA = useAppStore((s) => s.unsaveTA);

  const totalSaved = savedClasses.length + savedProfessors.length + savedTAs.length;

  return (
    <Screen scroll>
      <Text style={[styles.title, { color: c.text }]}>Saved</Text>
      <Text style={[styles.sub, { color: c.textSecondary }]}>{Copy.academicRegistry}</Text>

      {totalSaved === 0 ? (
        <Text style={[styles.empty, { color: c.textMuted }]}>{Copy.emptySaved}</Text>
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
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 30, fontWeight: '900', letterSpacing: -0.5, paddingTop: 6 },
  sub: { fontSize: 13, fontWeight: '600', marginTop: 4, marginBottom: 8 },
  empty: { marginTop: 24, textAlign: 'center', fontWeight: '600', fontSize: 14, lineHeight: 21 },
});
