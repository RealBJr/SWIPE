import { Platform, StyleSheet } from 'react-native';

export const Accent = {
  blue: '#3B82F6',
  blueMuted: '#EFF6FF',
};

export const Colors = {
  light: {
    text: '#1A1A1A',
    textSecondary: '#6B6B6B',
    textMuted: '#A3A3A3',
    background: '#FAFAFA',
    surface: '#FFFFFF',
    border: '#EBEBEB',
    tint: Accent.blue,
    icon: '#8C8C8C',
    tabIconDefault: '#B0B0B0',
    tabIconSelected: Accent.blue,
    overlayConnect: 'rgba(59, 130, 246, 0.10)',
    overlaySkip: 'rgba(0, 0, 0, 0.05)',
    success: '#22C55E',
  },
  dark: {
    text: '#F5F5F5',
    textSecondary: '#A1A1A1',
    textMuted: '#666666',
    background: '#111111',
    surface: '#1C1C1E',
    border: '#2C2C2E',
    tint: '#60A5FA',
    icon: '#888888',
    tabIconDefault: '#555555',
    tabIconSelected: '#60A5FA',
    overlayConnect: 'rgba(96, 165, 250, 0.15)',
    overlaySkip: 'rgba(255, 255, 255, 0.05)',
    success: '#4ADE80',
  },
};

export const Layout = {
  radiusMd: 14,
  radiusLg: 18,
  radiusXl: 24,
  shadow: Platform.select({
    ios: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.06,
      shadowRadius: 16,
    },
    android: { elevation: 3 },
    default: {},
  }),
  shadowLight: Platform.select({
    ios: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.04,
      shadowRadius: 8,
    },
    android: { elevation: 2 },
    default: {},
  }),
};

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});

export function createThemedStyles<T extends StyleSheet.NamedStyles<T> | StyleSheet.NamedStyles<any>>(
  factory: (c: typeof Colors.light | typeof Colors.dark) => T
) {
  return {
    light: factory(Colors.light),
    dark: factory(Colors.dark),
  };
}
