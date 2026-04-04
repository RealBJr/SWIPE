import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { PrimaryButton } from '@/components/ui/primary-button';
import { Screen } from '@/components/ui/screen';
import { Accent, Layout } from '@/constants/theme';
import { seedCourses } from '@/data/seed';
import { useAppColors } from '@/hooks/use-app-colors';
import { useAppStore } from '@/store/app-store';

export default function EditProfileScreen() {
  const c = useAppColors();
  const profile = useAppStore((s) => s.profile);
  const setProfile = useAppStore((s) => s.setProfile);

  const [fullName, setFullName] = useState(profile?.fullName ?? '');
  const [program, setProgram] = useState(profile?.program ?? '');
  const [yearLabel, setYearLabel] = useState(profile?.yearLabel ?? '');
  const [bio, setBio] = useState(profile?.bio ?? '');
  const [interests, setInterests] = useState(profile?.interests.join(', ') ?? '');
  const [imageUrl, setImageUrl] = useState(profile?.imageUrl ?? '');
  const [classIds, setClassIds] = useState<string[]>(profile?.classIds ?? []);

  function toggle(id: string) {
    setClassIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }

  function save() {
    if (!profile) return;
    setProfile({
      ...profile,
      fullName: fullName.trim() || profile.fullName,
      program: program.trim() || profile.program,
      yearLabel: yearLabel.trim() || profile.yearLabel,
      bio: bio.trim() || profile.bio,
      interests: interests
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      imageUrl: imageUrl.trim() || profile.imageUrl,
      classIds: classIds.length ? classIds : profile.classIds,
    });
    router.back();
  }

  return (
    <Screen scroll>
      <Text style={[styles.title, { color: c.text }]}>Edit profile</Text>
      <Field label="Name" value={fullName} onChangeText={setFullName} c={c} />
      <Field label="Program" value={program} onChangeText={setProgram} c={c} />
      <Field label="Year" value={yearLabel} onChangeText={setYearLabel} c={c} />
      <Field label="Bio" value={bio} onChangeText={setBio} c={c} multiline />
      <Field label="Interests (comma-separated)" value={interests} onChangeText={setInterests} c={c} />
      <Field label="Profile image URL" value={imageUrl} onChangeText={setImageUrl} c={c} />
      <Text style={[styles.label, { color: c.textSecondary }]}>Classes</Text>
      <View style={styles.pillWrap}>
        {seedCourses.map((course) => {
          const on = classIds.includes(course.id);
          return (
            <Pressable
              key={course.id}
              onPress={() => toggle(course.id)}
              style={[
                styles.pill,
                on
                  ? { backgroundColor: Accent.blueMuted }
                  : { backgroundColor: c.surface, ...Layout.shadowLight },
              ]}>
              <Text style={{ color: on ? Accent.blue : c.text, fontWeight: '700', fontSize: 13 }}>
                {course.code}
              </Text>
            </Pressable>
          );
        })}
      </View>
      <PrimaryButton label="Save" onPress={save} />
    </Screen>
  );
}

function Field({
  label,
  value,
  onChangeText,
  c,
  multiline,
}: {
  label: string;
  value: string;
  onChangeText: (t: string) => void;
  c: ReturnType<typeof useAppColors>;
  multiline?: boolean;
}) {
  return (
    <View style={{ marginBottom: 16 }}>
      <Text style={[styles.label, { color: c.textSecondary }]}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholderTextColor={c.textMuted}
        multiline={multiline}
        style={[
          styles.input,
          { color: c.text, backgroundColor: c.surface },
          multiline && { minHeight: 96, textAlignVertical: 'top' },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 24, fontWeight: '900', marginBottom: 16, letterSpacing: -0.3 },
  label: { fontSize: 12, fontWeight: '700', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 },
  input: {
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
  },
  pillWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 20 },
  pill: {
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 14,
  },
});
