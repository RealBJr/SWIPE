import { useQuery } from '@tanstack/react-query';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useCallback } from 'react';
import {
  Dimensions,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { EmptyState } from '@/components/ui/empty-state';
import { PrimaryButton } from '@/components/ui/primary-button';
import { Copy } from '@/constants/copy';
import { Layout } from '@/constants/theme';
import { courseById, professorById, taById } from '@/data/seed';
import { useAppColors } from '@/hooks/use-app-colors';
import { fetchEntityReviews } from '@/services/mockApi';
import type { ReviewEntityKind } from '@/types';

const { height: SCREEN_H } = Dimensions.get('window');

export default function ReviewsModal() {
  const { kind, id } = useLocalSearchParams<{ kind: string; id: string }>();
  const entityKind = kind as ReviewEntityKind;
  const c = useAppColors();
  const insets = useSafeAreaInsets();
  const sheetY = useSharedValue(0);
  const close = useCallback(() => router.back(), []);

  const course = entityKind === 'class' && id ? courseById(id) : undefined;
  const professor = entityKind === 'professor' && id ? professorById(id) : undefined;
  const ta = entityKind === 'ta' && id ? taById(id) : undefined;

  const title = course?.code ?? professor?.name ?? ta?.name ?? 'Reviews';
  const subtitle = course
    ? `${course.department} - ${course.semester}`
    : professor
      ? `${professor.department} - ${professor.activeTerm}`
      : ta
        ? `${ta.department} - ${ta.associatedCourseCode}`
        : '';

  const { data: reviews = [] } = useQuery({
    queryKey: ['reviews', entityKind, id],
    queryFn: () => fetchEntityReviews(entityKind, id!),
    enabled: Boolean(id && entityKind),
  });

  const drag = Gesture.Pan()
    .onUpdate((e) => {
      sheetY.value = Math.max(0, e.translationY);
    })
    .onEnd(() => {
      if (sheetY.value > 120) {
        runOnJS(close)();
        sheetY.value = withTiming(SCREEN_H, { duration: 200 });
        return;
      }
      sheetY.value = withSpring(0, { damping: 18 });
    });

  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: sheetY.value }],
  }));

  if (!id || (!course && !professor && !ta)) {
    return (
      <View style={styles.emptyWrap}>
        <EmptyState icon="chatbubble-outline" title="Reviews not found" />
      </View>
    );
  }

  return (
    <View style={styles.backdropWrap}>
      <Pressable style={styles.backdrop} onPress={close} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.sheetWrap}
      >
        <Animated.View
          style={[
            styles.sheet,
            sheetStyle,
            { backgroundColor: c.surface, paddingBottom: Math.max(16, insets.bottom + 8) },
            Layout.shadowLight,
          ]}
        >
          <GestureDetector gesture={drag}>
            <View style={styles.handleRow}>
              <View style={styles.handle} />
              <Pressable
                onPress={close}
                style={({ pressed }) => [styles.closeBtn, pressed && { opacity: 0.75 }]}
              >
                <Ionicons name="close" size={18} color={c.onSurface} />
              </Pressable>
            </View>
          </GestureDetector>
          <FlatList
            data={reviews}
            keyExtractor={(r) => r.id}
            contentContainerStyle={styles.list}
            ListHeaderComponent={
              <View style={styles.header}>
                <Text style={[styles.title, { color: c.text }]}>{title}</Text>
                {subtitle ? (
                  <Text style={[styles.sub, { color: c.textSecondary }]}>{subtitle}</Text>
                ) : null}
                <View style={styles.headerActions}>
                  <PrimaryButton
                    label={Copy.addReview}
                    onPress={() =>
                      router.push({
                        pathname: '/review/[kind]/[id]',
                        params: { kind: entityKind, id },
                      })
                    }
                  />
                </View>
                <Text style={[styles.section, { color: c.text }]}>{Copy.reviews}</Text>
              </View>
            }
            ListEmptyComponent={
              <EmptyState
                icon="chatbubbles-outline"
                title="No reviews yet"
                subtitle="Be the first to share a grade, rating, and comment."
              />
            }
            renderItem={({ item }) => {
              const author = item.isAnonymous === false ? item.authorName : 'Anonymous';
              const grade = item.grade ?? 'Not specified';
              return (
                <View style={[styles.card, { backgroundColor: c.surface }, Layout.shadowLight]}>
                  <View style={styles.cardTitleRow}>
                    <Ionicons name="star" size={14} color={c.primary} />
                    <Text style={[styles.cardTitle, { color: c.text }]}>
                      {item.rating.toFixed(1)} - Grade {grade} - {author}
                    </Text>
                  </View>
                  <Text style={[styles.cardBody, { color: c.textSecondary }]}>{item.body}</Text>
                  {item.tags.length > 0 ? (
                    <Text style={[styles.cardTags, { color: c.textMuted }]}>
                      {item.tags.join(' - ')}
                    </Text>
                  ) : null}
                </View>
              );
            }}
          />
        </Animated.View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  backdropWrap: { flex: 1, justifyContent: 'flex-end' },
  backdrop: { ...StyleSheet.absoluteFill, backgroundColor: 'rgba(0,0,0,0.35)' },
  sheetWrap: { paddingHorizontal: 12, paddingBottom: 10 },
  sheet: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingTop: 12,
    paddingHorizontal: 20,
    maxHeight: '86%',
  },
  handleRow: { alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  handle: {
    width: 52,
    height: 5,
    borderRadius: 999,
    backgroundColor: 'rgba(0,0,0,0.18)',
  },
  closeBtn: {
    position: 'absolute',
    right: 2,
    top: -6,
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.06)',
  },
  list: { paddingTop: 8, paddingBottom: 24 },
  header: { marginBottom: 10 },
  title: { fontSize: 26, fontWeight: '900', letterSpacing: -0.4 },
  sub: { marginTop: 6, fontWeight: '600', fontSize: 13 },
  headerActions: { marginTop: 16 },
  section: { marginTop: 22, marginBottom: 12, fontSize: 18, fontWeight: '800' },
  card: { borderRadius: 16, padding: 14, marginBottom: 12 },
  cardTitle: { fontWeight: '800', fontSize: 15 },
  cardTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  cardBody: { marginTop: 6, fontSize: 14, lineHeight: 20 },
  cardTags: { marginTop: 8, fontSize: 12, fontWeight: '700' },
  emptyWrap: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
