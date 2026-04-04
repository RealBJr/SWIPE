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

  const leftOverlay = useAnimatedStyle(() => ({
    opacity: interpolate(translateX.value, [-THRESHOLD * 2, 0], [1, 0], Extrapolation.CLAMP),
  }));

  const rightOverlay = useAnimatedStyle(() => ({
    opacity: interpolate(translateX.value, [0, THRESHOLD * 2], [0, 1], Extrapolation.CLAMP),
  }));

  const rightLabel = mode === 'connect' ? Copy.connect : Copy.save;

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
          <View style={styles.cardInner}>{renderCard(top)}</View>
          <Animated.View style={[styles.overlay, styles.overlayLeft, { backgroundColor: c.overlaySkip }, leftOverlay]}>
            <Text style={[styles.overlayText, { color: c.textSecondary }]}>{Copy.skip}</Text>
          </Animated.View>
          <Animated.View style={[styles.overlay, styles.overlayRight, { backgroundColor: Accent.blueMuted }, rightOverlay]}>
            <Text style={[styles.overlayText, { color: Accent.blue }]}>{rightLabel}</Text>
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
          <Text style={[styles.btnText, { color: c.textSecondary }]}>{Copy.skip}</Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          onPress={() => exit('right')}
          style={({ pressed }) => [
            styles.btn,
            { backgroundColor: Accent.blue },
            pressed && { opacity: 0.88, transform: [{ scale: 0.97 }] },
          ]}>
          <Text style={[styles.btnText, { color: '#FFF' }]}>{rightLabel}</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  card: { borderRadius: 24, minHeight: 420, overflow: 'hidden' },
  cardInner: { flex: 1 },
  overlay: {
    position: 'absolute',
    top: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  overlayLeft: { left: 20 },
  overlayRight: { right: 20 },
  overlayText: { fontSize: 14, fontWeight: '800', letterSpacing: 0.3 },
  actions: { flexDirection: 'row', justifyContent: 'center', gap: 12, paddingTop: 16 },
  btn: {
    flex: 1,
    maxWidth: 160,
    height: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnText: { fontSize: 16, fontWeight: '700' },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 },
  emptyText: { textAlign: 'center', fontSize: 15, lineHeight: 22 },
});
