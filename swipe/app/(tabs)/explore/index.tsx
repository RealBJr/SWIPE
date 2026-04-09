import { useQuery, useQueryClient } from '@tanstack/react-query';
import * as Haptics from 'expo-haptics';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { ClassSwipeCard, ProfessorSwipeCard, TASwipeCard } from '@/components/academic-swipe-card';
import { StudentSwipeCard } from '@/components/student-swipe-card';
import { SwipeDeck } from '@/components/swipe-deck';
import { LoadingIndicator } from '@/components/ui/loading-indicator';
import { SegmentedControl } from '@/components/ui/segmented-control';
import { Screen } from '@/components/ui/screen';
import { Fonts } from '@/constants/theme';
import { courseById, professorById, studentById, taById } from '@/data/seed';
import { fetchExploreQueue } from '@/services/mockApi';
import { useAppStore } from '@/store/app-store';
import type {
  CourseOffering,
  ExploreSegment,
  ProfessorProfile,
  StudentProfile,
  TAProfile,
} from '@/types';

const SEGMENTS: ExploreSegment[] = ['students', 'classes', 'tas', 'professors'];

const LABELS: Record<ExploreSegment, string> = {
  students: 'People',
  classes: 'Classes',
  professors: 'Prof',
  tas: 'TA',
};

export default function ExploreScreen() {
  const qc = useQueryClient();
  const [segment, setSegment] = useState<ExploreSegment>('students');
  const profile = useAppStore((s) => s.profile);
  const swipeStudent = useAppStore((s) => s.swipeStudent);
  const swipeClass = useAppStore((s) => s.swipeClass);
  const swipeProfessor = useAppStore((s) => s.swipeProfessor);
  const swipeTA = useAppStore((s) => s.swipeTA);

  const firstName = profile?.fullName.split(' ')[0] ?? '';

  const {
    data: queue = [],
    refetch,
    isLoading,
  } = useQuery({
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

  function nextSegment(current: ExploreSegment): ExploreSegment {
    const i = SEGMENTS.indexOf(current);
    return SEGMENTS[(i + 1) % SEGMENTS.length];
  }

  function switchToNextCategory() {
    setSegment((prev) => nextSegment(prev));
    void Haptics.selectionAsync();
  }

  return (
    <Screen padded={false}>
      <View style={styles.deck}>
        {isLoading ? <LoadingIndicator /> : null}

        {!isLoading && segment === 'students' ? (
          <SwipeDeck
            data={studentCards}
            mode="connect"
            onSwipeCategoryNext={switchToNextCategory}
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
            renderCard={(s, sliderX) => <StudentSwipeCard student={s} sliderX={sliderX} />}
          />
        ) : null}

        {!isLoading && segment === 'classes' ? (
          <SwipeDeck
            data={classCards}
            mode="save"
            onSwipeCategoryNext={switchToNextCategory}
            onSwipeLeft={(item) => {
              swipeClass('left', item.id);
              void invalidate();
            }}
            onSwipeRight={(item) => {
              swipeClass('right', item.id);
              void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              void invalidate();
            }}
            renderCard={(co, sliderX) => <ClassSwipeCard course={co} sliderX={sliderX} />}
          />
        ) : null}

        {!isLoading && segment === 'professors' ? (
          <SwipeDeck
            data={profCards}
            mode="save"
            onSwipeCategoryNext={switchToNextCategory}
            onSwipeLeft={(item) => {
              swipeProfessor('left', item.id);
              void invalidate();
            }}
            onSwipeRight={(item) => {
              swipeProfessor('right', item.id);
              void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              void invalidate();
            }}
            renderCard={(p, sliderX) => <ProfessorSwipeCard professor={p} sliderX={sliderX} />}
          />
        ) : null}

        {!isLoading && segment === 'tas' ? (
          <SwipeDeck
            data={taCards}
            mode="save"
            onSwipeCategoryNext={switchToNextCategory}
            onSwipeLeft={(item) => {
              swipeTA('left', item.id);
              void invalidate();
            }}
            onSwipeRight={(item) => {
              swipeTA('right', item.id);
              void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              void invalidate();
            }}
            renderCard={(t, sliderX) => <TASwipeCard ta={t} sliderX={sliderX} />}
          />
        ) : null}
      </View>

      <View style={styles.header}>
        <View style={styles.brandRow}>
          <Text style={[styles.screenTitle, { color: '#FFFFFF' }]}>SWIPE</Text>
          {profile?.imageUrl ? (
            <View style={styles.avatarRing}>
              <Image source={{ uri: profile.imageUrl }} style={styles.avatar} />
            </View>
          ) : null}
        </View>
        {firstName ? (
          <Text style={[styles.greeting, { color: 'rgba(255,255,255,0.78)' }]}>
            Hey {firstName}
          </Text>
        ) : null}
        <SegmentedControl values={SEGMENTS} labels={LABELS} value={segment} onChange={setSegment} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 18,
    paddingTop: 14,
    paddingBottom: 10,
    gap: 8,
    zIndex: 10,
  },
  brandRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  screenTitle: {
    fontSize: 38,
    fontWeight: '900',
    letterSpacing: 5,
    fontFamily: Fonts.sans,
  },
  avatarRing: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    overflow: 'hidden',
  },
  avatar: { width: '100%', height: '100%' },
  greeting: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 4,
    marginLeft: 2,
    fontFamily: Fonts.sans,
  },
  deck: { flex: 1, paddingHorizontal: 0, paddingBottom: 0 },
});
