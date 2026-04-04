import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { Accent } from '@/constants/theme';

export function LoadingIndicator({ size = 'large' }: { size?: 'small' | 'large' }) {
  return (
    <View style={styles.root}>
      <ActivityIndicator size={size} color={Accent.blue} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 },
});
