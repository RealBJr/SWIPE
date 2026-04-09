import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { Extrapolation, interpolate, useAnimatedStyle } from 'react-native-reanimated';
import type { SharedValue } from 'react-native-reanimated';

import { Copy } from '@/constants/copy';
import { Fonts } from '@/constants/theme';
import { useAppColors } from '@/hooks/use-app-colors';
import type { StudentProfile } from '@/types';

const ACTION_BOX_WIDTH = 96;
const ACTION_CONFIRM_X = 56;

export function StudentSwipeCard({
  student,
  sliderX,
}: {
  student: StudentProfile;
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
        source={{ uri: student.imageUrl }}
        style={StyleSheet.absoluteFill}
        contentFit="cover"
      />
      <LinearGradient
        colors={['rgba(0,0,0,0.08)', 'rgba(0,0,0,0.38)']}
        style={StyleSheet.absoluteFill}
      />

      <View style={styles.plateWrap}>
        <View style={[styles.plate, { backgroundColor: 'rgba(246,240,234,0.84)' }]}>
          <Animated.View style={[styles.leftBody, leftBodyStyle]}>
            <View style={styles.titleRow}>
              <Text style={styles.name} numberOfLines={1}>
                {student.fullName}
              </Text>
              <View style={styles.yearBadge}>
                <Text style={styles.yearText}>{student.yearLabel}</Text>
              </View>
            </View>

            <View style={styles.metaRow}>
              <View style={[styles.metaPill, { backgroundColor: c.seaGreenSoft }]}>
                <Text style={[styles.metaPillText, { color: c.primary }]} numberOfLines={1}>
                  {student.program}
                </Text>
              </View>
              <View style={styles.metaPill}>
                <Text style={styles.metaPillText} numberOfLines={1}>
                  {student.university}
                </Text>
              </View>
            </View>

            <Text style={styles.bio} numberOfLines={3}>
              {student.bio}
            </Text>
          </Animated.View>

          <Animated.View style={[styles.actionRail, { backgroundColor: c.primary }, railStyle]}>
            <Ionicons name="chevron-forward" size={34} color="#FFFFFF" />
            <Animated.Text style={[styles.actionLabel, railTextStyle]}>
              {Copy.connect.toUpperCase()}
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
  leftBody: { flex: 1, padding: 18, gap: 12 },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 10,
  },
  name: {
    fontSize: 40,
    fontWeight: '800',
    color: '#232525',
    letterSpacing: -0.8,
    fontFamily: Fonts.sans,
    flex: 1,
  },
  yearBadge: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 1.5,
    borderColor: 'rgba(28, 30, 30, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.35)',
  },
  yearText: { fontSize: 14, fontWeight: '700', color: '#2B2E2B', fontFamily: Fonts.sans },
  metaRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  metaPill: {
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.7)',
    paddingVertical: 5,
    paddingHorizontal: 12,
  },
  metaPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#3A3F3B',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    fontFamily: Fonts.sans,
  },
  bio: {
    fontSize: 17,
    lineHeight: 28,
    color: '#353A35',
    fontFamily: Fonts.sans,
  },
  actionRail: { width: ACTION_BOX_WIDTH, alignItems: 'center', justifyContent: 'center', gap: 12 },
  actionLabel: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.1,
    fontFamily: Fonts.sans,
  },
});
