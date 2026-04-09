import type { ReactNode } from 'react';
import { useCallback, useEffect, useRef } from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
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
import type { SharedValue } from 'react-native-reanimated';

import { Copy } from '@/constants/copy';
import { Fonts } from '@/constants/theme';
import { useAppColors } from '@/hooks/use-app-colors';

const { width: SCREEN_W } = Dimensions.get('window');
const { height: SCREEN_H } = Dimensions.get('window');
const THRESHOLD_X = Math.min(90, SCREEN_W * 0.2);
const THRESHOLD_Y = Math.min(120, SCREEN_H * 0.15);
const ACTION_BOX_WIDTH = 96;
const ACTION_CONFIRM_X = 56;

export function SwipeDeck<T extends { id: string }>({
  data,
  renderCard,
  onSwipeLeft,
  onSwipeRight,
  onSwipeCategoryNext,
  onSwipeCategoryPrev,
  mode,
}: {
  data: T[];
  renderCard: (item: T, sliderX: SharedValue<number>) => ReactNode;
  onSwipeLeft: (item: T) => void;
  onSwipeRight: (item: T) => void;
  onSwipeCategoryNext?: () => void;
  onSwipeCategoryPrev?: () => void;
  mode: 'connect' | 'save';
}) {
  const c = useAppColors();
  const top = data[0];
  const itemRef = useRef(top);
  itemRef.current = top;

  const sliderMode = useSharedValue(0);
  const cardX = useSharedValue(0);
  const cardY = useSharedValue(0);
  const sliderX = useSharedValue(0);
  const overlayColor = mode === 'connect' ? c.overlayConnect : c.overlaySkip;

  useEffect(() => {
    sliderMode.value = 0;
    cardX.value = 0;
    cardY.value = 0;
    sliderX.value = 0;
  }, [top?.id, sliderMode, cardX, cardY, sliderX]);

  const finish = useCallback(
    (dir: 'up' | 'right') => {
      const item = itemRef.current;
      if (!item) return;
      if (dir === 'right') onSwipeRight(item);
      else onSwipeLeft(item);
    },
    [onSwipeLeft, onSwipeRight]
  );

  const goCategoryNext = useCallback(() => onSwipeCategoryNext?.(), [onSwipeCategoryNext]);
  const goCategoryPrev = useCallback(() => onSwipeCategoryPrev?.(), [onSwipeCategoryPrev]);
  const resetCard = useCallback(() => {
    sliderMode.value = 0;
    cardX.value = 0;
    cardY.value = 0;
    sliderX.value = 0;
  }, [sliderMode, cardX, cardY, sliderX]);

  const pan = Gesture.Pan()
    .onBegin((e) => {
      sliderMode.value = e.x <= SCREEN_W - ACTION_BOX_WIDTH ? 1 : 0;
    })
    .onUpdate((e) => {
      cardY.value = Math.min(0, e.translationY);

      if (sliderMode.value) {
        sliderX.value = Math.max(0, e.translationX);
      } else {
        cardX.value = e.translationX;
      }
    })
    .onEnd(() => {
      if (cardY.value < -THRESHOLD_Y) {
        cardY.value = withTiming(-SCREEN_H * 1.1, { duration: 220 }, (done) => {
          if (done) {
            runOnJS(finish)('up');
            runOnJS(resetCard)();
          }
        });
        return;
      } else if (sliderMode.value && sliderX.value > ACTION_CONFIRM_X) {
        sliderX.value = withTiming(ACTION_BOX_WIDTH, { duration: 160 }, (done) => {
          if (done) {
            runOnJS(finish)('right');
            runOnJS(resetCard)();
          }
        });
        return;
      } else if (!sliderMode.value && cardX.value < -THRESHOLD_X) {
        cardX.value = withTiming(-SCREEN_W * 1.1, { duration: 220 }, (done) => {
          if (done) {
            runOnJS(goCategoryNext)();
            runOnJS(resetCard)();
          }
        });
        cardY.value = withTiming(0, { duration: 180 });
        return;
      } else if (!sliderMode.value && cardX.value > THRESHOLD_X) {
        cardX.value = withTiming(SCREEN_W * 1.1, { duration: 220 }, (done) => {
          if (done) {
            runOnJS(goCategoryPrev)();
            runOnJS(resetCard)();
          }
        });
        cardY.value = withTiming(0, { duration: 180 });
        return;
      }

      sliderMode.value = 0;
      cardX.value = withSpring(0, { damping: 18 });
      cardY.value = withSpring(0, { damping: 18 });
      sliderX.value = withSpring(0, { damping: 18 });
    });

  const cardStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: cardX.value },
      { translateY: cardY.value },
      {
        rotateZ: `${interpolate(cardX.value, [-SCREEN_W, 0, SCREEN_W], [-6, 0, 6], Extrapolation.CLAMP)}deg`,
      },
    ],
  }));

  const swipeFade = useAnimatedStyle(() => ({
    opacity: interpolate(
      Math.abs(cardX.value) + Math.abs(cardY.value),
      [0, 120],
      [0, 0.12],
      Extrapolation.CLAMP
    ),
  }));

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
        <Animated.View style={[styles.card, cardStyle]}>
          <View style={styles.cardInner}>{renderCard(top, sliderX)}</View>

          <Animated.View
            style={[styles.fullOverlay, { backgroundColor: overlayColor }, swipeFade]}
            pointerEvents="none"
          />
        </Animated.View>
      </GestureDetector>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  card: { flex: 1 },
  cardInner: { flex: 1 },
  fullOverlay: { ...StyleSheet.absoluteFill },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 },
  emptyText: { textAlign: 'center', fontSize: 15, lineHeight: 24, fontFamily: Fonts.sans },
});
