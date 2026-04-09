import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { PrimaryButton } from '@/components/ui/primary-button';
import { Screen } from '@/components/ui/screen';
import { Fonts, Layout } from '@/constants/theme';
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
      <Text style={[styles.title, { color: c.onSurface }]}>Edit profile</Text>
      <Field label="Name" value={fullName} onChangeText={setFullName} multiline={false} />
      <Field label="Program" value={program} onChangeText={setProgram} multiline={false} />
      <Field label="Year" value={yearLabel} onChangeText={setYearLabel} multiline={false} />
      <Field label="Bio" value={bio} onChangeText={setBio} multiline />
      <Field
        label="Interests (comma-separated)"
        value={interests}
        onChangeText={setInterests}
        multiline={false}
      />
      <Field
        label="Profile image URL"
        value={imageUrl}
        onChangeText={setImageUrl}
        multiline={false}
      />

      <Text style={[styles.label, { color: c.onSurfaceVariant }]}>Classes</Text>
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
                  ? { backgroundColor: c.seaGreenSoft }
                  : { backgroundColor: c.surfaceContainerLowest },
                !on && Layout.seaGlowLight,
              ]}
            >
              <Text
                style={{
                  color: on ? c.primary : c.onSurface,
                  fontWeight: '700',
                  fontSize: 13,
                  fontFamily: Fonts.sans,
                }}
              >
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
  multiline,
}: {
  label: string;
  value: string;
  onChangeText: (t: string) => void;
  multiline?: boolean;
}) {
  const c = useAppColors();
  const [focused, setFocused] = useState(false);

  return (
    <View style={{ marginBottom: 16 }}>
      <Text style={[styles.label, { color: c.onSurfaceVariant }]}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholderTextColor={c.textMuted}
        multiline={multiline}
        style={[
          styles.input,
          {
            color: c.onSurface,
            backgroundColor: focused ? c.surfaceContainerLowest : c.surfaceContainerLow,
            borderColor: focused ? c.ghostBorderFocus : c.ghostBorder,
          },
          multiline && { minHeight: 96, textAlignVertical: 'top' },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 32,
    fontWeight: '900',
    marginBottom: 18,
    letterSpacing: -0.64,
    fontFamily: Fonts.sans,
    marginLeft: 10,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 7,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    fontFamily: Fonts.sans,
  },
  input: {
    borderRadius: Layout.radiusLg,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    lineHeight: 24,
    fontFamily: Fonts.sans,
  },
  pillWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 24 },
  pill: {
    borderRadius: 999,
    paddingVertical: 8,
    paddingHorizontal: 14,
  },
});
