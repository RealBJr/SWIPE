import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { PrimaryButton } from '@/components/ui/primary-button';
import { Screen } from '@/components/ui/screen';
import { Copy } from '@/constants/copy';
import { Accent } from '@/constants/theme';
import { studentById } from '@/data/seed';
import { threadIdForPeer } from '@/services/matching';
import { useAppColors } from '@/hooks/use-app-colors';

export default function MatchModal() {
  const { peerId } = useLocalSearchParams<{ peerId: string }>();
  const c = useAppColors();
  const peer = peerId ? studentById(peerId) : undefined;
  const name = peer?.fullName ?? 'Your classmate';
  const threadId = peerId ? threadIdForPeer(peerId) : '';

  return (
    <Screen>
      <View style={styles.center}>
        {peer?.imageUrl ? (
          <View style={[styles.avatarRing, { borderColor: Accent.blue }]}>
            <Image source={{ uri: peer.imageUrl }} style={styles.avatar} />
          </View>
        ) : null}
        <Text style={[styles.emoji]}>🎉</Text>
        <Text style={[styles.title, { color: c.text }]}>{Copy.mutualConnectTitle}</Text>
        <Text style={[styles.sub, { color: c.textSecondary }]}>{Copy.mutualConnectSubtitle(name)}</Text>
        <View style={styles.actions}>
          <PrimaryButton
            label={Copy.startChat}
            onPress={() => {
              router.replace({ pathname: '/(tabs)/chat/[threadId]', params: { threadId } });
            }}
          />
          <PrimaryButton label={Copy.keepExploring} variant="outline" onPress={() => router.back()} />
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32, gap: 10 },
  avatarRing: { width: 88, height: 88, borderRadius: 44, borderWidth: 2.5, alignItems: 'center', justifyContent: 'center' },
  avatar: { width: 80, height: 80, borderRadius: 40 },
  emoji: { fontSize: 40, marginTop: 12 },
  title: { fontSize: 26, fontWeight: '900', textAlign: 'center', letterSpacing: -0.3 },
  sub: { fontSize: 16, lineHeight: 23, fontWeight: '600', textAlign: 'center' },
  actions: { gap: 12, marginTop: 16, width: '100%' },
});
