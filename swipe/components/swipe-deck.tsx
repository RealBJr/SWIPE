import { Ionicons } from '@expo/vector-icons';
import type { ReactNode } from 'react';
import { useCallback, useEffect, useRef } from 'react';
import { Dimensions, Pressable, StyleSheet, Text, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  Extrapolation,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { Copy } from '@/constants/copy';
import { Accent, Layout } from '@/constants/theme';
import { useAppColors } from '@/hooks/use-app-colors';

const { width: SCREEN_W } = Dimensions.get('window');
const THRESHOLD = Math.min(100, SCREEN_W * 0.22);

export function SwipeDeck<T extends { id: string }>({
  data,
  renderCard,
  onSwipeLeft,
  onSwipeRight,
  mode,
}: {
  data: T[];
  renderCard: (item: T) => ReactNode;
  onSwipeLeft: (item: T) => void;
  onSwipeRight: (item: T) => void;
  mode: 'connect' | 'save';
}) {
  const c = useAppColors();
  const top = data[0];
  const itemRef = useRef(top);
  itemRef.current = top;

  const translateX = useSharedValue(0);
  const rotateZ = useSharedValue(0);

  useEffect(() => {
    translateX.value = 0;
    rotateZ.value = 0;
  }, [top?.id, translateX, rotateZ]);

  const finish = useCallback(
    (dir: 'left' | 'right') => {
      const item = itemRef.current;
      if (!item) return;
      if (dir === 'right') onSwipeRight(item);
      else onSwipeLeft(item);
    },
    [onSwipeLeft, onSwipeRight]
  );

  const exit = useCallback(
    (dir: 'left' | 'right') => {
      const target = dir === 'right' ? SCREEN_W * 1.4 : -SCREEN_W * 1.4;
      translateX.value = withTiming(target, { duration: 260 }, (done) => {
        if (done) runOnJS(finish)(dir);
      });
    },
    [finish, translateX]
  );

  const pan = Gesture.Pan()
    .onUpdate((e) => {
      translateX.value = e.translationX;
      rotateZ.value = interpolate(
        e.translationX,
        [-SCREEN_W / 2, SCREEN_W / 2],
        [-10, 10],
        Extrapolation.CLAMP
      );
    })
    .onEnd(() => {
      if (translateX.value > THRESHOLD) {
        translateX.value = withTiming(SCREEN_W * 1.4, { duration: 260 }, (done) => {
          if (done) runOnJS(finish)('right');
        });
      } else if (translateX.value < -THRESHOLD) {
        translateX.value = withTiming(-SCREEN_W * 1.4, { duration: 260 }, (done) => {
          if (done) runOnJS(finish)('left');
        });
      } else {
        translateX.value = withSpring(0, { damping: 18 });
        rotateZ.value = withSpring(0, { damping: 18 });
      }
    });

  const cardStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }, { rotateZ: `${rotateZ.value}deg` }],
  }));

  const skipOverlay = useAnimatedStyle(() => ({
    opacity: interpolate(translateX.value, [-THRESHOLD * 1.8, -20, 0], [0.7, 0.2, 0], Extrapolation.CLAMP),
  }));

  const acceptOverlay = useAnimatedStyle(() => ({
    opacity: interpolate(translateX.value, [0, 20, THRESHOLD * 1.8], [0, 0.2, 0.7], Extrapolation.CLAMP),
  }));

  const skipBadge = useAnimatedStyle(() => ({
    opacity: interpolate(translateX.value, [-THRESHOLD * 1.5, -30, 0], [1, 0.4, 0], Extrapolation.CLAMP),
    transform: [
      { scale: interpolate(translateX.value, [-THRESHOLD * 1.5, 0], [1, 0.5], Extrapolation.CLAMP) },
    ],
  }));

  const acceptBadge = useAnimatedStyle(() => ({
    opacity: interpolate(translateX.value, [0, 30, THRESHOLD * 1.5], [0, 0.4, 1], Extrapolation.CLAMP),
    transform: [
      { scale: interpolate(translateX.value, [0, THRESHOLD * 1.5], [0.5, 1], Extrapolation.CLAMP) },
    ],
  }));

  const rightLabel = mode === 'connect' ? Copy.connect : Copy.save;
  const rightIcon: keyof typeof Ionicons.glyphMap = mode === 'connect' ? 'flash' : 'bookmark';

  if (!top) {
    return (
      <View style={styles.empty}>
        <Text style={[styles.emptyText, { color: c.textMuted }]}>{Copy.emptyExplore}</Text>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <GestureDetector gesture={pan}>
        <Animated.View style={[styles.card, { backgroundColor: c.surface }, Layout.shadow, cardStyle]}>
          <View style={styles.cardInner}>
            {renderCard(top)}
          </View>

          <Animated.View style={[styles.fullOverlay, { backgroundColor: '#000' }, skipOverlay]} pointerEvents="none" />
          <Animated.View style={[styles.fullOverlay, { backgroundColor: Accent.blue }, acceptOverlay]} pointerEvents="none" />

          <Animated.View style={[styles.stampWrap, styles.stampLeft, skipBadge]} pointerEvents="none">
            <View style={[styles.stampCircle, { borderColor: '#FF6B6B', backgroundColor: 'rgba(239,68,68,0.15)' }]}>
              <Ionicons name="close" size={36} color="#FF6B6B" />
            </View>
            <Text style={[styles.stampText, { color: '#FFF' }]}>SKIP</Text>
          </Animated.View>

          <Animated.View style={[styles.stampWrap, styles.stampRight, acceptBadge]} pointerEvents="none">
            <View style={[styles.stampCircle, { borderColor: '#4ADE80', backgroundColor: 'rgba(34,197,94,0.15)' }]}>
              <Ionicons name={mode === 'connect' ? 'flash' : 'bookmark'} size={32} color="#4ADE80" />
            </View>
            <Text style={[styles.stampText, { color: '#FFF' }]}>
              {rightLabel.toUpperCase()}
            </Text>
          </Animated.View>
        </Animated.View>
      </GestureDetector>

      <View style={styles.actions}>
        <Pressable
          accessibilityRole="button"
          onPress={() => exit('left')}
          style={({ pressed }) => [
            styles.btn,
            { backgroundColor: c.surface },
            Layout.shadowLight,
            pressed && { opacity: 0.85, transform: [{ scale: 0.97 }] },
          ]}>
          <Ionicons name="close" size={20} color={c.textSecondary} />
          <Text style={[styles.btnText, { color: c.textSecondary }]}>{Copy.skip.toUpperCase()}</Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          onPress={() => exit('right')}
          style={({ pressed }) => [
            styles.btn,
            styles.btnPrimary,
            { backgroundColor: Accent.blue },
            pressed && { opacity: 0.88, transform: [{ scale: 0.97 }] },
          ]}>
          <Ionicons name={rightIcon} size={18} color="#FFF" />
          <Text style={[styles.btnText, { color: '#FFF' }]}>{rightLabel.toUpperCase()}</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  card: { flex: 1, borderRadius: 24, overflow: 'hidden' },
  cardInner: { flex: 1 },

  fullOverlay: {
    ...StyleSheet.absoluteFillObject,
  },

  stampWrap: {
    position: 'absolute',
    top: '35%',
    alignItems: 'center',
    gap: 8,
  },
  stampLeft: { left: 28 },
  stampRight: { right: 28 },
  stampCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stampText: {
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 2,
    textShadowColor: 'rgba(0,0,0,0.6)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 6,
  },

  actions: { flexDirection: 'row', justifyContent: 'center', gap: 12, paddingTop: 16 },
  btn: {
    flex: 1,
    maxWidth: 160,
    height: 52,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  btnPrimary: { flex: 1.4 },
  btnText: { fontSize: 14, fontWeight: '800', letterSpacing: 0.5 },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 },
  emptyText: { textAlign: 'center', fontSize: 15, lineHeight: 22 },
});
