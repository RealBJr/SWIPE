import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  FadeIn,
  FadeInDown,
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { Accent } from '@/constants/theme';
import { studentById } from '@/data/seed';
import { sharedClassLabel, threadIdForPeer } from '@/services/matching';
import { useAppColors } from '@/hooks/use-app-colors';
import { useAppStore } from '@/store/app-store';

export default function MatchModal() {
  const { peerId } = useLocalSearchParams<{ peerId: string }>();
  const c = useAppColors();
  const profile = useAppStore((s) => s.profile);
  const peer = peerId ? studentById(peerId) : undefined;
  const name = peer?.fullName?.split(' ')[0] ?? 'Your classmate';
  const threadId = peerId ? threadIdForPeer(peerId) : '';
  const shared = peerId ? sharedClassLabel(profile, peerId) : undefined;

  const pulseScale = useSharedValue(1);
  const boltRotate = useSharedValue(0);

  useEffect(() => {
    void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    pulseScale.value = withRepeat(
      withSequence(
        withTiming(1.08, { duration: 1200, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 1200, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );

    boltRotate.value = withDelay(
      400,
      withSequence(
        withTiming(-8, { duration: 80 }),
        withTiming(8, { duration: 80 }),
        withTiming(-4, { duration: 60 }),
        withTiming(0, { duration: 60 })
      )
    );
  }, [pulseScale, boltRotate]);

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
  }));

  const boltStyle = useAnimatedStyle(() => ({
    transform: [{ rotateZ: `${boltRotate.value}deg` }],
  }));

  return (
    <View style={[styles.container, { backgroundColor: c.background }]}>
      <LinearGradient colors={[Accent.blue + '20', 'transparent']} style={styles.topGlow} />

      <View style={styles.content}>
        <Animated.View entering={FadeIn.duration(600)} style={styles.avatarRow}>
          <Animated.View style={pulseStyle}>
            <View style={styles.avatarStack}>
              {profile?.imageUrl ? (
                <View style={[styles.avatarRing, { borderColor: Accent.blue }]}>
                  <Image source={{ uri: profile.imageUrl }} style={styles.avatar} />
                </View>
              ) : null}
              {peer?.imageUrl ? (
                <View
                  style={[styles.avatarRing, styles.avatarOverlap, { borderColor: Accent.blue }]}
                >
                  <Image source={{ uri: peer.imageUrl }} style={styles.avatar} />
                </View>
              ) : null}
            </View>
          </Animated.View>
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(200).duration(500)} style={styles.boltWrap}>
          <Animated.View style={boltStyle}>
            <View style={[styles.boltCircle, { backgroundColor: Accent.blue }]}>
              <Ionicons name="flash" size={28} color="#FFF" />
            </View>
          </Animated.View>
        </Animated.View>

        <Animated.Text
          entering={FadeInDown.delay(300).duration(500)}
          style={[styles.title, { color: c.text }]}
        >
          It is a match!
        </Animated.Text>

        <Animated.Text
          entering={FadeInDown.delay(450).duration(500)}
          style={[styles.subtitle, { color: c.textSecondary }]}
        >
          You and {name} both want to connect.
        </Animated.Text>

        {shared ? (
          <Animated.View
            entering={FadeInDown.delay(550).duration(400)}
            style={[styles.sharedBadge, { backgroundColor: Accent.blueMuted }]}
          >
            <Ionicons name="school-outline" size={14} color={Accent.blue} />
            <Text style={[styles.sharedText, { color: Accent.blue }]}>{shared}</Text>
          </Animated.View>
        ) : null}

        <Animated.View entering={FadeInDown.delay(650).duration(500)} style={styles.actions}>
          <Pressable
            onPress={() => {
              void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              router.replace({ pathname: '/(tabs)/chat/[threadId]', params: { threadId } });
            }}
            style={({ pressed }) => [
              styles.primaryBtn,
              { backgroundColor: Accent.blue },
              pressed && { opacity: 0.9, transform: [{ scale: 0.97 }] },
            ]}
          >
            <Ionicons name="chatbubble" size={18} color="#FFF" />
            <Text style={styles.primaryBtnText}>Say Hello</Text>
          </Pressable>

          <Pressable
            onPress={() => router.back()}
            style={({ pressed }) => [
              styles.secondaryBtn,
              { borderColor: c.border },
              pressed && { opacity: 0.8 },
            ]}
          >
            <Text style={[styles.secondaryBtnText, { color: c.textSecondary }]}>
              Keep Exploring
            </Text>
          </Pressable>
        </Animated.View>
      </View>
    </View>
  );
}

const AVATAR_SIZE = 90;

const styles = StyleSheet.create({
  container: { flex: 1 },
  topGlow: { position: 'absolute', top: 0, left: 0, right: 0, height: 300 },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    gap: 8,
  },

  avatarRow: { marginBottom: 8 },
  avatarStack: { flexDirection: 'row', alignItems: 'center' },
  avatarRing: {
    width: AVATAR_SIZE + 6,
    height: AVATAR_SIZE + 6,
    borderRadius: (AVATAR_SIZE + 6) / 2,
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000',
  },
  avatar: { width: AVATAR_SIZE, height: AVATAR_SIZE, borderRadius: AVATAR_SIZE / 2 },
  avatarOverlap: { marginLeft: -24 },

  boltWrap: { marginTop: -16, marginBottom: 8 },
  boltCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },

  title: { fontSize: 32, fontWeight: '900', letterSpacing: -0.5, textAlign: 'center' },
  subtitle: { fontSize: 16, fontWeight: '600', lineHeight: 23, textAlign: 'center', marginTop: 4 },

  sharedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 14,
    marginTop: 8,
  },
  sharedText: { fontSize: 13, fontWeight: '700' },

  actions: { width: '100%', gap: 12, marginTop: 28 },
  primaryBtn: {
    height: 54,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  primaryBtnText: { color: '#FFF', fontSize: 17, fontWeight: '800' },
  secondaryBtn: {
    height: 54,
    borderRadius: 16,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryBtnText: { fontSize: 16, fontWeight: '700' },
});
