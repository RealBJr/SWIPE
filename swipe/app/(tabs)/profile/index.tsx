import { Image } from 'expo-image';
import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { CompactAcademicRow } from '@/components/compact-academic-row';
import { SectionHeader } from '@/components/section-header';
import { PrimaryButton } from '@/components/ui/primary-button';
import { Screen } from '@/components/ui/screen';
import { Copy } from '@/constants/copy';
import { Accent, Layout } from '@/constants/theme';
import { courseById, seedCollaboration, studentById } from '@/data/seed';
import { useAppColors } from '@/hooks/use-app-colors';
import { useAppStore } from '@/store/app-store';

export default function ProfileScreen() {
  const c = useAppColors();
  const profile = useAppStore((s) => s.profile);
  const matches = useAppStore((s) => s.matches);
  const savedClasses = useAppStore((s) => s.savedClasses);
  const savedProfessors = useAppStore((s) => s.savedProfessors);
  const savedTAs = useAppStore((s) => s.savedTAs);

  const recent = matches.slice(0, 4);
  const collabScore = 72 + seedCollaboration.length * 3;

  if (!profile) {
    return (
      <Screen>
        <Text style={{ color: c.textSecondary, padding: 20 }}>No profile yet.</Text>
      </Screen>
    );
  }

  return (
    <Screen scroll>
      <View style={[styles.header, { backgroundColor: c.surface }, Layout.shadow]}>
        <View style={[styles.avatarRing, { borderColor: Accent.blue }]}>
          <Image source={{ uri: profile.imageUrl }} style={styles.avatar} />
        </View>
        <Text style={[styles.name, { color: c.text }]}>{profile.fullName}</Text>
        <Text style={[styles.meta, { color: c.textSecondary }]}>
          {profile.program} · {profile.yearLabel}
        </Text>
        <Text style={[styles.bio, { color: c.textSecondary }]}>{profile.bio}</Text>
        <View style={styles.btnRow}>
          <View style={styles.btnHalf}>
            <PrimaryButton label={Copy.editProfile} onPress={() => router.push('/(tabs)/profile/edit')} />
          </View>
          <View style={styles.btnHalf}>
            <PrimaryButton label={Copy.findConnections} variant="outline" onPress={() => router.push('/(tabs)/explore')} />
          </View>
        </View>
      </View>

      <SectionHeader title={Copy.recentConnections} />
      {recent.length === 0 ? (
        <Text style={[styles.emptyHint, { color: c.textMuted }]}>No recent connections yet.</Text>
      ) : (
        recent.map((m) => {
          const peer = studentById(m.peerId);
          const shared = m.sharedClassHint ? `Shared: ${m.sharedClassHint}` : 'Suggested connection';
          return (
            <CompactAcademicRow
              key={m.id}
              title={peer?.fullName ?? 'Classmate'}
              subtitle={shared}
              meta={m.metViaCourseCode ? Copy.metVia(m.metViaCourseCode) : undefined}
            />
          );
        })
      )}

      <SectionHeader title={Copy.academicRegistry} />
      <Text style={[styles.previewHint, { color: c.textSecondary }]}>
        {savedClasses.length + savedProfessors.length + savedTAs.length} saved items
      </Text>
      <PrimaryButton label="Open saved registry" variant="outline" onPress={() => router.push('/(tabs)/saved')} />

      <SectionHeader title={Copy.myClasses} />
      {profile.classIds.map((id) => {
        const co = courseById(id);
        if (!co) return null;
        return (
          <CompactAcademicRow key={id} title={`${co.code} · ${co.title}`} subtitle={co.department} />
        );
      })}

      <SectionHeader title={Copy.collaborationFeedback} />
      <Text style={[styles.score, { color: c.text }]}>
        {Copy.collaborationScore}: {collabScore}/100
      </Text>
      <Text style={[styles.endorseLabel, { color: c.textSecondary }]}>{Copy.endorsements}</Text>
      {seedCollaboration.map((e) => (
        <CompactAcademicRow key={e.id} title={e.trait} subtitle={`From ${e.fromName}`} meta={e.context} />
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    borderRadius: 20,
    padding: 20,
    gap: 6,
    marginTop: 8,
    alignItems: 'center',
  },
  avatarRing: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatar: { width: 92, height: 92, borderRadius: 46 },
  name: { fontSize: 22, fontWeight: '900', textAlign: 'center', marginTop: 8 },
  meta: { fontSize: 14, fontWeight: '700', textAlign: 'center' },
  bio: { fontSize: 14, lineHeight: 21, textAlign: 'center', marginTop: 4 },
  btnRow: { flexDirection: 'row', gap: 10, marginTop: 14, width: '100%' },
  btnHalf: { flex: 1 },
  emptyHint: { fontWeight: '600', fontSize: 14 },
  previewHint: { marginBottom: 10, fontWeight: '600' },
  score: { fontSize: 20, fontWeight: '900' },
  endorseLabel: { marginTop: 4, marginBottom: 10, fontWeight: '600' },
});
