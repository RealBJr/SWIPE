import { Image } from 'expo-image';
import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { CompactAcademicRow } from '@/components/compact-academic-row';
import { SectionHeader } from '@/components/section-header';
import { PrimaryButton } from '@/components/ui/primary-button';
import { Screen } from '@/components/ui/screen';
import { Copy } from '@/constants/copy';
import { Fonts, Layout } from '@/constants/theme';
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
      <View
        style={[styles.headerCard, { backgroundColor: c.glass }, Layout.seaGlow, Layout.webGlass]}
      >
        <View
          style={[
            styles.avatarRing,
            { backgroundColor: c.surfaceContainerLow, borderColor: c.ghostBorderFocus },
          ]}
        >
          <Image source={{ uri: profile.imageUrl }} style={styles.avatar} />
        </View>
        <Text style={[styles.name, { color: c.onSurface }]}>{profile.fullName}</Text>
        <Text style={[styles.meta, { color: c.onSurfaceVariant }]}>
          {profile.program} - {profile.yearLabel}
        </Text>
        <Text style={[styles.bio, { color: c.onSurfaceVariant }]}>{profile.bio}</Text>
        <View style={styles.btnRow}>
          <View style={styles.btnHalf}>
            <PrimaryButton
              label={Copy.editProfile}
              onPress={() => router.push('/(tabs)/profile/edit')}
            />
          </View>
          <View style={styles.btnHalf}>
            <PrimaryButton
              label={Copy.findConnections}
              variant="secondary"
              onPress={() => router.push('/(tabs)/explore')}
            />
          </View>
        </View>
      </View>

      <SectionHeader title={Copy.recentConnections} />
      {recent.length === 0 ? (
        <Text style={[styles.emptyHint, { color: c.textMuted }]}>No recent connections yet.</Text>
      ) : (
        recent.map((m) => {
          const peer = studentById(m.peerId);
          const shared = m.sharedClassHint
            ? `Shared: ${m.sharedClassHint}`
            : 'Suggested connection';
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
      <Text style={[styles.previewHint, { color: c.onSurfaceVariant }]}>
        {savedClasses.length + savedProfessors.length + savedTAs.length} saved items
      </Text>
      <PrimaryButton
        label="Open saved registry"
        variant="tertiary"
        onPress={() => router.push('/(tabs)/saved')}
      />

      <SectionHeader title={Copy.myClasses} />
      {profile.classIds.map((id) => {
        const co = courseById(id);
        if (!co) return null;
        return (
          <CompactAcademicRow
            key={id}
            title={`${co.code} - ${co.title}`}
            subtitle={co.department}
          />
        );
      })}

      <SectionHeader title={Copy.collaborationFeedback} />
      <Text style={[styles.score, { color: c.onSurface }]}>
        {Copy.collaborationScore}: <Text style={{ color: c.primary }}>{collabScore}/100</Text>
      </Text>
      <Text style={[styles.endorseLabel, { color: c.onSurfaceVariant }]}>{Copy.endorsements}</Text>
      {seedCollaboration.map((e) => (
        <CompactAcademicRow
          key={e.id}
          title={e.trait}
          subtitle={`From ${e.fromName}`}
          meta={e.context}
        />
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  headerCard: {
    borderRadius: Layout.radiusXl,
    padding: 22,
    gap: 6,
    marginTop: 8,
    alignItems: 'center',
  },
  avatarRing: {
    width: 104,
    height: 104,
    borderRadius: 52,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatar: { width: 94, height: 94, borderRadius: 47 },
  name: {
    fontSize: 24,
    fontWeight: '900',
    textAlign: 'center',
    marginTop: 8,
    letterSpacing: -0.4,
    fontFamily: Fonts.sans,
  },
  meta: {
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    fontFamily: Fonts.sans,
  },
  bio: { fontSize: 15, lineHeight: 24, textAlign: 'center', marginTop: 6, fontFamily: Fonts.sans },
  btnRow: { flexDirection: 'row', gap: 10, marginTop: 14, width: '100%' },
  btnHalf: { flex: 1 },
  emptyHint: { fontWeight: '600', fontSize: 14, fontFamily: Fonts.sans },
  previewHint: { marginBottom: 10, fontWeight: '600', fontFamily: Fonts.sans },
  score: { fontSize: 22, fontWeight: '900', fontFamily: Fonts.sans },
  endorseLabel: { marginTop: 6, marginBottom: 10, fontWeight: '600', fontFamily: Fonts.sans },
});
