import { useQueryClient } from '@tanstack/react-query';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import {
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
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

import { PrimaryButton } from '@/components/ui/primary-button';
import { Fonts, Layout } from '@/constants/theme';
import { useAppColors } from '@/hooks/use-app-colors';
import { submitReview } from '@/services/mockApi';
import type { ReviewEntityKind } from '@/types';

const TAGS = [
  'Clear',
  'Helpful',
  'Difficult',
  'Engaging',
  'Good explanations',
  'Heavy workload',
  'Important',
];
const GRADES = ['A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D', 'F'];
const { height: SCREEN_H } = Dimensions.get('window');

export default function ReviewModal() {
  const { kind, id } = useLocalSearchParams<{ kind: string; id: string }>();
  const qc = useQueryClient();
  const c = useAppColors();
  const insets = useSafeAreaInsets();
  const entityKind = kind as ReviewEntityKind;
  const [rating, setRating] = useState(5);
  const [grade, setGrade] = useState('A');
  const [body, setBody] = useState('');
  const [selected, setSelected] = useState<string[]>([]);
  const [focused, setFocused] = useState(false);
  const [showName, setShowName] = useState(false);
  const sheetY = useSharedValue(0);
  const close = useCallback(() => router.back(), []);

  const title = useMemo(() => {
    if (entityKind === 'class') return 'Class review';
    if (entityKind === 'professor') return 'Professor review';
    return 'TA review';
  }, [entityKind]);

  async function save() {
    await submitReview({
      entityKind,
      entityId: id,
      rating,
      grade,
      body: body.trim() || 'No comment provided.',
      tags: selected,
      isAnonymous: !showName,
    });
    await qc.invalidateQueries({ queryKey: ['reviews', entityKind, id] });
    router.back();
  }

  function toggle(tag: string) {
    setSelected((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]));
  }

  const drag = Gesture.Pan()
    .onUpdate((e) => {
      sheetY.value = Math.max(0, e.translationY);
    })
    .onEnd(() => {
      if (sheetY.value > 120) {
        sheetY.value = withTiming(SCREEN_H, { duration: 200 }, (done) => {
          if (done) runOnJS(close)();
        });
        return;
      }
      sheetY.value = withSpring(0, { damping: 18 });
    });

  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: sheetY.value }],
  }));

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
          <ScrollView
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <Text style={[styles.title, { color: c.onSurface }]}>Write a review</Text>
            <Text style={[styles.sub, { color: c.onSurfaceVariant }]}>{title}</Text>

            <Text style={[styles.label, { color: c.onSurfaceVariant }]}>Rating</Text>
            <View style={styles.row}>
              {[1, 2, 3, 4, 5].map((n) => {
                const active = n <= rating;
                return (
                  <Pressable
                    key={n}
                    onPress={() => setRating(n)}
                    style={[
                      styles.ratingBtn,
                      active
                        ? { backgroundColor: c.primary }
                        : { backgroundColor: c.surfaceContainerLow },
                    ]}
                  >
                    <Text
                      style={{
                        color: active ? '#FFF' : c.onSurface,
                        fontWeight: '800',
                        fontSize: 16,
                        fontFamily: Fonts.sans,
                      }}
                    >
                      {n}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <Text style={[styles.label, { color: c.onSurfaceVariant }]}>Grade</Text>
            <View style={styles.wrap}>
              {GRADES.map((g) => {
                const on = g === grade;
                return (
                  <Pressable
                    key={g}
                    onPress={() => setGrade(g)}
                    style={[
                      styles.tag,
                      on
                        ? { backgroundColor: c.seaGreenSoft }
                        : { backgroundColor: c.surfaceContainerLowest },
                    ]}
                  >
                    <Text
                      style={{
                        color: on ? c.primary : c.onSurfaceVariant,
                        fontWeight: '700',
                        fontSize: 13,
                        fontFamily: Fonts.sans,
                      }}
                    >
                      {g}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <Text style={[styles.label, { color: c.onSurfaceVariant }]}>Comment</Text>
            <TextInput
              value={body}
              onChangeText={setBody}
              placeholder="Short, constructive feedback"
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              placeholderTextColor={c.textMuted}
              multiline
              style={[
                styles.input,
                {
                  color: c.onSurface,
                  backgroundColor: focused ? c.surfaceContainerLowest : c.surfaceContainerLow,
                  borderColor: focused ? c.ghostBorderFocus : c.ghostBorder,
                },
              ]}
            />

            <Text style={[styles.label, { color: c.onSurfaceVariant }]}>Tags</Text>
            <View style={styles.wrap}>
              {TAGS.map((t) => {
                const on = selected.includes(t);
                return (
                  <Pressable
                    key={t}
                    onPress={() => toggle(t)}
                    style={[
                      styles.tag,
                      on
                        ? { backgroundColor: c.seaGreenSoft }
                        : { backgroundColor: c.surfaceContainerLowest },
                    ]}
                  >
                    <Text
                      style={{
                        color: on ? c.primary : c.onSurfaceVariant,
                        fontWeight: '700',
                        fontSize: 13,
                        fontFamily: Fonts.sans,
                      }}
                    >
                      {t}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <View style={styles.anonRow}>
              <View style={styles.anonText}>
                <Text style={[styles.anonLabel, { color: c.onSurface }]}>Show my name</Text>
                <Text style={[styles.anonSub, { color: c.onSurfaceVariant }]}>
                  Comments are anonymous by default.
                </Text>
              </View>
              <Switch
                value={showName}
                onValueChange={setShowName}
                thumbColor={showName ? c.primary : c.surfaceContainerLowest}
                trackColor={{ false: c.surfaceContainerHigh, true: c.seaGreenSoft }}
              />
            </View>
            <PrimaryButton label="Submit review" onPress={() => void save()} />
          </ScrollView>
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
  content: { paddingBottom: 20 },
  title: {
    fontSize: 32,
    fontWeight: '900',
    marginBottom: 4,
    letterSpacing: -0.64,
    fontFamily: Fonts.sans,
    marginLeft: 10,
  },
  sub: { fontSize: 15, fontWeight: '600', marginBottom: 8, fontFamily: Fonts.sans },
  label: {
    fontSize: 12,
    fontWeight: '700',
    marginTop: 18,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    fontFamily: Fonts.sans,
  },
  row: { flexDirection: 'row', gap: 10 },
  ratingBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    ...Layout.seaGlowLight,
  },
  input: {
    borderRadius: Layout.radiusLg,
    borderWidth: 1,
    padding: 14,
    minHeight: 110,
    textAlignVertical: 'top',
    fontSize: 16,
    lineHeight: 24,
    fontFamily: Fonts.sans,
  },
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 24 },
  tag: { borderRadius: 999, paddingVertical: 8, paddingHorizontal: 14 },
  anonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 18,
  },
  anonText: { flex: 1 },
  anonLabel: { fontSize: 14, fontWeight: '700', fontFamily: Fonts.sans },
  anonSub: { marginTop: 4, fontSize: 12, fontWeight: '500', fontFamily: Fonts.sans },
});
