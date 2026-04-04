import { useQuery, useQueryClient } from '@tanstack/react-query';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { ClassSwipeCard, ProfessorSwipeCard, TASwipeCard } from '@/components/academic-swipe-card';
import { StudentSwipeCard } from '@/components/student-swipe-card';
import { SwipeDeck } from '@/components/swipe-deck';
import { SegmentedControl } from '@/components/ui/segmented-control';
import { Screen } from '@/components/ui/screen';
import { courseById, professorById, studentById, taById } from '@/data/seed';
import { useAppColors } from '@/hooks/use-app-colors';
import { fetchExploreQueue } from '@/services/mockApi';
import { useAppStore } from '@/store/app-store';
import type { CourseOffering, ExploreSegment, ProfessorProfile, StudentProfile, TAProfile } from '@/types';

const SEGMENTS: ExploreSegment[] = ['students', 'classes', 'professors', 'tas'];

const LABELS: Record<ExploreSegment, string> = {
  students: 'Students',
  classes: 'Classes',
  professors: 'Professors',
  tas: 'TAs',
};

export default function ExploreScreen() {
  const c = useAppColors();
  const qc = useQueryClient();
  const [segment, setSegment] = useState<ExploreSegment>('students');
  const profile = useAppStore((s) => s.profile);
  const swipeStudent = useAppStore((s) => s.swipeStudent);
  const swipeClass = useAppStore((s) => s.swipeClass);
  const swipeProfessor = useAppStore((s) => s.swipeProfessor);
  const swipeTA = useAppStore((s) => s.swipeTA);

  const firstName = profile?.fullName.split(' ')[0] ?? '';

  const { data: queue = [], refetch } = useQuery({
    queryKey: ['explore', segment],
    queryFn: () => fetchExploreQueue(segment),
  });

  const studentCards: StudentProfile[] = useMemo(() => {
    if (segment !== 'students') return [];
    return queue.map((id) => studentById(id)).filter(Boolean) as StudentProfile[];
  }, [queue, segment]);

  const classCards: CourseOffering[] = useMemo(() => {
    if (segment !== 'classes') return [];
    return queue.map((id) => courseById(id)).filter(Boolean) as CourseOffering[];
  }, [queue, segment]);

  const profCards: ProfessorProfile[] = useMemo(() => {
    if (segment !== 'professors') return [];
    return queue.map((id) => professorById(id)).filter(Boolean) as ProfessorProfile[];
  }, [queue, segment]);

  const taCards: TAProfile[] = useMemo(() => {
    if (segment !== 'tas') return [];
    return queue.map((id) => taById(id)).filter(Boolean) as TAProfile[];
  }, [queue, segment]);

  async function invalidate() {
    await qc.invalidateQueries({ queryKey: ['explore', segment] });
    await refetch();
  }

  return (
    <Screen padded={false}>
      <View style={styles.header}>
        <Text style={[styles.screenTitle, { color: c.text }]}>Explore</Text>
        {firstName ? (
          <Text style={[styles.greeting, { color: c.textSecondary }]}>Hey {firstName} 👋</Text>
        ) : null}
        <SegmentedControl values={SEGMENTS} labels={LABELS} value={segment} onChange={setSegment} />
      </View>

      <View style={styles.deck}>
      {segment === 'students' ? (
        <SwipeDeck
          data={studentCards}
          mode="connect"
          onSwipeLeft={(item) => {
            swipeStudent('left', item.id);
            void Haptics.selectionAsync();
            void invalidate();
          }}
          onSwipeRight={(item) => {
            const res = swipeStudent('right', item.id);
            void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            void invalidate();
            if (res.match && res.peerId) {
              router.push({ pathname: '/match/[peerId]', params: { peerId: res.peerId } });
            }
          }}
          renderCard={(s) => <StudentSwipeCard student={s} viewerClassIds={profile?.classIds ?? []} />}
        />
      ) : null}

      {segment === 'classes' ? (
        <SwipeDeck
          data={classCards}
          mode="save"
          onSwipeLeft={(item) => {
            swipeClass('left', item.id);
            void invalidate();
          }}
          onSwipeRight={(item) => {
            swipeClass('right', item.id);
            void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            void invalidate();
          }}
          renderCard={(co) => <ClassSwipeCard course={co} />}
        />
      ) : null}

      {segment === 'professors' ? (
        <SwipeDeck
          data={profCards}
          mode="save"
          onSwipeLeft={(item) => {
            swipeProfessor('left', item.id);
            void invalidate();
          }}
          onSwipeRight={(item) => {
            swipeProfessor('right', item.id);
            void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            void invalidate();
          }}
          renderCard={(p) => <ProfessorSwipeCard professor={p} />}
        />
      ) : null}

      {segment === 'tas' ? (
        <SwipeDeck
          data={taCards}
          mode="save"
          onSwipeLeft={(item) => {
            swipeTA('left', item.id);
            void invalidate();
          }}
          onSwipeRight={(item) => {
            swipeTA('right', item.id);
            void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            void invalidate();
          }}
          renderCard={(t) => <TASwipeCard ta={t} />}
        />
      ) : null}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { paddingHorizontal: 20, paddingTop: 14, paddingBottom: 12, gap: 6 },
  screenTitle: { fontSize: 30, fontWeight: '900', letterSpacing: -0.5 },
  greeting: { fontSize: 15, fontWeight: '600', marginBottom: 6 },
  deck: { flex: 1, paddingHorizontal: 20, paddingBottom: 12 },
});
