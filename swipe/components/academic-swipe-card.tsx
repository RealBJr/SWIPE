import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Linking, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { Extrapolation, interpolate, useAnimatedStyle } from 'react-native-reanimated';
import type { SharedValue } from 'react-native-reanimated';

import { Copy } from '@/constants/copy';
import { Fonts, Layout } from '@/constants/theme';
import { useAppColors } from '@/hooks/use-app-colors';
import type { CourseOffering, ProfessorProfile, TAProfile } from '@/types';

const ACTION_BOX_WIDTH = 96;
const ACTION_CONFIRM_X = 56;

export function ClassSwipeCard({
  course,
  sliderX,
}: {
  course: CourseOffering;
  sliderX: SharedValue<number>;
}) {
  const c = useAppColors();
  const leftBodyStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: interpolate(
          sliderX.value,
          [0, ACTION_CONFIRM_X],
          [0, ACTION_BOX_WIDTH],
          Extrapolation.CLAMP
        ),
      },
    ],
  }));
  const railStyle = useAnimatedStyle(() => ({
    width: interpolate(
      sliderX.value,
      [0, ACTION_CONFIRM_X],
      [ACTION_BOX_WIDTH, 0],
      Extrapolation.CLAMP
    ),
  }));
  const railTextStyle = useAnimatedStyle(() => ({
    opacity: interpolate(sliderX.value, [0, ACTION_CONFIRM_X * 0.6], [1, 0], Extrapolation.CLAMP),
  }));

  return (
    <View style={styles.root}>
      <Image
        source={{
          uri: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=1200&auto=format&fit=crop',
        }}
        style={StyleSheet.absoluteFill}
        contentFit="cover"
      />
      <LinearGradient
        colors={['rgba(0,0,0,0.05)', 'rgba(0,0,0,0.42)']}
        style={StyleSheet.absoluteFill}
      />

      <View style={styles.plateWrap}>
        <View style={[styles.plate, { backgroundColor: 'rgba(246,240,234,0.86)' }]}>
          <Animated.View style={[styles.leftBody, leftBodyStyle]}>
            <Text style={[styles.label, { color: c.primary }]}>
              {course.department.toUpperCase()}
            </Text>
            <Text style={styles.title} numberOfLines={2}>{`${course.code}: ${course.title}`}</Text>
            <View style={styles.ratingRow}>
              <Ionicons name="star" size={20} color={c.primary} />
              <Text style={styles.ratingValue}>{course.rating.toFixed(1)}</Text>
              <Text style={styles.reviewCount}>({course.reviewCount} reviews)</Text>
            </View>
            <View style={styles.pillRow}>
              {course.traits.slice(0, 3).map((trait) => (
                <View key={trait} style={[styles.pill, { backgroundColor: c.seaGreenSoft }]}>
                  <Text style={[styles.pillText, { color: c.primary }]}>{trait}</Text>
                </View>
              ))}
            </View>
            <Pressable
              onPress={() =>
                router.push({
                  pathname: '/reviews/[kind]/[id]',
                  params: { kind: 'class', id: course.id },
                })
              }
              style={({ pressed }) => [
                styles.reviewBtn,
                { backgroundColor: c.primary },
                Layout.seaGlowLight,
                pressed && { opacity: 0.9, transform: [{ scale: 0.98 }] },
              ]}
            >
              <View style={styles.reviewBtnContent}>
                <Ionicons name="chatbubble-ellipses" size={14} color="#FFFFFF" />
                <Text style={styles.reviewBtnText}>REVIEWS</Text>
              </View>
            </Pressable>
          </Animated.View>

          <Animated.View style={[styles.actionRail, { backgroundColor: c.primary }, railStyle]}>
            <Ionicons name="chevron-forward" size={34} color="#FFFFFF" />
            <Animated.Text style={[styles.actionLabel, railTextStyle]}>
              {Copy.save.toUpperCase()}
            </Animated.Text>
          </Animated.View>
        </View>
      </View>
    </View>
  );
}

export function ProfessorSwipeCard({
  professor,
  sliderX,
}: {
  professor: ProfessorProfile;
  sliderX: SharedValue<number>;
}) {
  const c = useAppColors();
  const leftBodyStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: interpolate(
          sliderX.value,
          [0, ACTION_CONFIRM_X],
          [0, ACTION_BOX_WIDTH],
          Extrapolation.CLAMP
        ),
      },
    ],
  }));
  const railStyle = useAnimatedStyle(() => ({
    width: interpolate(
      sliderX.value,
      [0, ACTION_CONFIRM_X],
      [ACTION_BOX_WIDTH, 0],
      Extrapolation.CLAMP
    ),
  }));
  const railTextStyle = useAnimatedStyle(() => ({
    opacity: interpolate(sliderX.value, [0, ACTION_CONFIRM_X * 0.6], [1, 0], Extrapolation.CLAMP),
  }));

  return (
    <View style={styles.root}>
      <Image
        source={{ uri: professor.imageUrl }}
        style={StyleSheet.absoluteFill}
        contentFit="cover"
      />
      <LinearGradient
        colors={['rgba(0,0,0,0.08)', 'rgba(0,0,0,0.4)']}
        style={StyleSheet.absoluteFill}
      />

      <View style={styles.plateWrap}>
        <View style={[styles.plate, { backgroundColor: 'rgba(246,240,234,0.86)' }]}>
          <Animated.View style={[styles.leftBody, leftBodyStyle]}>
            <Text style={[styles.label, { color: c.primary }]}>
              {professor.department.toUpperCase()}
            </Text>
            <Text style={styles.title} numberOfLines={2}>
              {professor.name}
            </Text>
            <View style={styles.ratingRow}>
              <Ionicons name="star" size={20} color={c.primary} />
              <Text style={styles.ratingValue}>{professor.rating.toFixed(1)}</Text>
              <Text style={styles.reviewCount}>({professor.reviewCount} reviews)</Text>
            </View>
            <View style={styles.pillRow}>
              {professor.traits.slice(0, 3).map((trait) => (
                <View key={trait} style={[styles.pill, { backgroundColor: c.seaGreenSoft }]}>
                  <Text style={[styles.pillText, { color: c.primary }]}>{trait}</Text>
                </View>
              ))}
            </View>
            <Text style={styles.bio} numberOfLines={2}>
              {professor.reviewSnippet}
            </Text>
            <Pressable
              onPress={() =>
                router.push({
                  pathname: '/reviews/[kind]/[id]',
                  params: { kind: 'professor', id: professor.id },
                })
              }
              style={({ pressed }) => [
                styles.reviewBtn,
                { backgroundColor: c.primary },
                Layout.seaGlowLight,
                pressed && { opacity: 0.9, transform: [{ scale: 0.98 }] },
              ]}
            >
              <View style={styles.reviewBtnContent}>
                <Ionicons name="chatbubble-ellipses" size={14} color="#FFFFFF" />
                <Text style={styles.reviewBtnText}>REVIEWS</Text>
              </View>
            </Pressable>
          </Animated.View>

          <Animated.View style={[styles.actionRail, { backgroundColor: c.primary }, railStyle]}>
            <Ionicons name="chevron-forward" size={34} color="#FFFFFF" />
            <Animated.Text style={[styles.actionLabel, railTextStyle]}>
              {Copy.save.toUpperCase()}
            </Animated.Text>
          </Animated.View>
        </View>
      </View>
    </View>
  );
}

export function TASwipeCard({ ta, sliderX }: { ta: TAProfile; sliderX: SharedValue<number> }) {
  const c = useAppColors();
  const leftBodyStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: interpolate(
          sliderX.value,
          [0, ACTION_CONFIRM_X],
          [0, ACTION_BOX_WIDTH],
          Extrapolation.CLAMP
        ),
      },
    ],
  }));
  const railStyle = useAnimatedStyle(() => ({
    width: interpolate(
      sliderX.value,
      [0, ACTION_CONFIRM_X],
      [ACTION_BOX_WIDTH, 0],
      Extrapolation.CLAMP
    ),
  }));
  const railTextStyle = useAnimatedStyle(() => ({
    opacity: interpolate(sliderX.value, [0, ACTION_CONFIRM_X * 0.6], [1, 0], Extrapolation.CLAMP),
  }));

  return (
    <View style={styles.root}>
      <Image source={{ uri: ta.imageUrl }} style={StyleSheet.absoluteFill} contentFit="cover" />
      <LinearGradient
        colors={['rgba(0,0,0,0.08)', 'rgba(0,0,0,0.4)']}
        style={StyleSheet.absoluteFill}
      />

      <View style={styles.plateWrap}>
        <View style={[styles.plate, { backgroundColor: 'rgba(246,240,234,0.86)' }]}>
          <Animated.View style={[styles.leftBody, leftBodyStyle]}>
            <Text style={[styles.label, { color: c.primary }]}>{ta.department.toUpperCase()}</Text>
            <Text style={styles.title} numberOfLines={2}>
              {ta.name}
            </Text>
            <View style={styles.ratingRow}>
              <Ionicons name="star" size={20} color={c.primary} />
              <Text style={styles.ratingValue}>{ta.rating.toFixed(1)}</Text>
              <Text style={styles.reviewCount}>{ta.associatedCourseCode}</Text>
            </View>
            <View style={styles.pillRow}>
              {ta.traits.slice(0, 3).map((trait) => (
                <View key={trait} style={[styles.pill, { backgroundColor: c.seaGreenSoft }]}>
                  <Text style={[styles.pillText, { color: c.primary }]}>{trait}</Text>
                </View>
              ))}
            </View>
            <Text style={styles.bio} numberOfLines={2}>
              {ta.reviewSnippet}
            </Text>
            <Pressable
              onPress={() =>
                router.push({ pathname: '/reviews/[kind]/[id]', params: { kind: 'ta', id: ta.id } })
              }
              style={({ pressed }) => [
                styles.reviewBtn,
                { backgroundColor: c.primary },
                Layout.seaGlowLight,
                pressed && { opacity: 0.9, transform: [{ scale: 0.98 }] },
              ]}
            >
              <View style={styles.reviewBtnContent}>
                <Ionicons name="chatbubble-ellipses" size={14} color="#FFFFFF" />
                <Text style={styles.reviewBtnText}>REVIEWS</Text>
              </View>
            </Pressable>
            <Text
              onPress={() => Linking.openURL('https://example.com')}
              style={[styles.link, { color: c.primary }]}
            >
              View profile
            </Text>
          </Animated.View>

          <Animated.View style={[styles.actionRail, { backgroundColor: c.primary }, railStyle]}>
            <Ionicons name="chevron-forward" size={34} color="#FFFFFF" />
            <Animated.Text style={[styles.actionLabel, railTextStyle]}>
              {Copy.save.toUpperCase()}
            </Animated.Text>
          </Animated.View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, justifyContent: 'flex-end' },
  plateWrap: { paddingHorizontal: 14, paddingBottom: 80 },
  plate: {
    borderRadius: 24,
    overflow: 'hidden',
    flexDirection: 'row',
    minHeight: 220,
  },
  leftBody: { flex: 1, padding: 18, gap: 9, justifyContent: 'center' },
  label: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1,
    textTransform: 'uppercase',
    fontFamily: Fonts.sans,
  },
  title: {
    fontSize: 42,
    lineHeight: 48,
    fontWeight: '800',
    letterSpacing: -0.9,
    color: '#1F2321',
    fontFamily: Fonts.sans,
  },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  ratingValue: { fontSize: 35, fontWeight: '700', color: '#1F2321', fontFamily: Fonts.sans },
  reviewCount: { fontSize: 28, fontWeight: '500', color: '#59605A', fontFamily: Fonts.sans },
  pillRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  pill: { borderRadius: 999, paddingVertical: 6, paddingHorizontal: 12 },
  pillText: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    fontFamily: Fonts.sans,
  },
  reviewBtn: {
    alignSelf: 'flex-start',
    borderRadius: 999,
    paddingVertical: 9,
    paddingHorizontal: 16,
    marginTop: 4,
  },
  reviewBtnContent: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  reviewBtnText: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.6,
    fontFamily: Fonts.sans,
    color: '#FFFFFF',
  },
  bio: { fontSize: 17, lineHeight: 26, color: '#353A35', fontFamily: Fonts.sans },
  link: { fontSize: 14, fontWeight: '700', fontFamily: Fonts.sans },
  actionRail: { width: ACTION_BOX_WIDTH, alignItems: 'center', justifyContent: 'center', gap: 12 },
  actionLabel: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.1,
    fontFamily: Fonts.sans,
  },
});
