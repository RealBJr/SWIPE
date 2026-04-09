import { Platform, StyleSheet } from 'react-native';

const PRIMARY = '#006A3B';
const PRIMARY_CONTAINER = '#268451';
const OUTLINE_VARIANT = '#BECABE';

export const Accent = {
  seaGreen: PRIMARY,
  seaGreenSoft: '#E6F1EC',
  blue: PRIMARY,
  blueMuted: '#E6F1EC',
};

export const Colors = {
  light: {
    primary: PRIMARY,
    seaGreenSoft: '#E6F1EC',
    primaryContainer: PRIMARY_CONTAINER,
    onPrimary: '#FFFFFF',
    onSurface: '#1A1C1C',
    onSurfaceVariant: '#3F4941',
    background: '#F9F9F9',
    surface: '#F9F9F9',
    surfaceContainer: '#EFEFF0',
    surfaceContainerLow: '#F3F3F4',
    surfaceContainerHigh: '#E8E8E8',
    surfaceContainerHighest: '#E2E2E2',
    surfaceContainerLowest: '#FFFFFF',
    border: 'rgba(190, 202, 190, 0.24)',
    outlineVariant: OUTLINE_VARIANT,
    ghostBorder: 'rgba(190, 202, 190, 0.15)',
    ghostBorderFocus: 'rgba(0, 106, 59, 0.20)',
    glass: 'rgba(255, 255, 255, 0.72)',
    text: '#1A1C1C',
    textSecondary: '#3F4941',
    textMuted: '#5D695F',
    tint: PRIMARY,
    icon: '#4A564D',
    tabIconDefault: '#6A756D',
    tabIconSelected: PRIMARY,
    overlayConnect: 'rgba(0, 106, 59, 0.16)',
    overlaySkip: 'rgba(26, 28, 28, 0.08)',
    success: '#127246',
  },
  dark: {
    primary: '#7ED0A8',
    seaGreenSoft: '#1F3429',
    primaryContainer: '#2F8D5C',
    onPrimary: '#062A17',
    onSurface: '#ECF1ED',
    onSurfaceVariant: '#C3CEC5',
    background: '#111714',
    surface: '#111714',
    surfaceContainer: '#161E1A',
    surfaceContainerLow: '#1A2320',
    surfaceContainerHigh: '#202A26',
    surfaceContainerHighest: '#26312D',
    surfaceContainerLowest: '#22302A',
    border: 'rgba(139, 150, 142, 0.35)',
    outlineVariant: '#8B968E',
    ghostBorder: 'rgba(139, 150, 142, 0.2)',
    ghostBorderFocus: 'rgba(126, 208, 168, 0.3)',
    glass: 'rgba(34, 48, 42, 0.76)',
    text: '#ECF1ED',
    textSecondary: '#C3CEC5',
    textMuted: '#A7B4AA',
    tint: '#7ED0A8',
    icon: '#B9C6BC',
    tabIconDefault: '#9AA79E',
    tabIconSelected: '#7ED0A8',
    overlayConnect: 'rgba(126, 208, 168, 0.2)',
    overlaySkip: 'rgba(236, 241, 237, 0.08)',
    success: '#86DAB0',
  },
};

export const Layout = {
  radiusMd: 12,
  radiusLg: 16,
  radiusXl: 24,
  seaGlow: Platform.select({
    ios: {
      shadowColor: '#006A3B',
      shadowOffset: { width: 0, height: 12 },
      shadowOpacity: 0.06,
      shadowRadius: 32,
    },
    android: { elevation: 6 },
    default: {},
  }),
  seaGlowLight: Platform.select({
    ios: {
      shadowColor: '#006A3B',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.04,
      shadowRadius: 18,
    },
    android: { elevation: 3 },
    default: {},
  }),
  shadow: Platform.select({
    ios: {
      shadowColor: '#006A3B',
      shadowOffset: { width: 0, height: 12 },
      shadowOpacity: 0.06,
      shadowRadius: 32,
    },
    android: { elevation: 6 },
    default: {},
  }),
  shadowLight: Platform.select({
    ios: {
      shadowColor: '#006A3B',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.04,
      shadowRadius: 18,
    },
    android: { elevation: 3 },
    default: {},
  }),
  webGlass: Platform.select({
    web: {
      backdropFilter: 'blur(24px) saturate(120%)',
    } as unknown as object,
    default: {},
  }),
  webGlassStrong: Platform.select({
    web: {
      backdropFilter: 'blur(30px) saturate(120%)',
    } as unknown as object,
    default: {},
  }),
};

export const Fonts = Platform.select({
  ios: {
    sans: 'Plus Jakarta Sans',
    serif: 'Plus Jakarta Sans',
    rounded: 'Plus Jakarta Sans',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'Plus Jakarta Sans',
    serif: 'Plus Jakarta Sans',
    rounded: 'Plus Jakarta Sans',
    mono: 'monospace',
  },
  web: {
    sans: "'Plus Jakarta Sans', 'Segoe UI', system-ui, sans-serif",
    serif: "'Plus Jakarta Sans', 'Segoe UI', system-ui, sans-serif",
    rounded: "'Plus Jakarta Sans', 'Segoe UI', system-ui, sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});

export function createThemedStyles<
  T extends StyleSheet.NamedStyles<T> | StyleSheet.NamedStyles<any>,
>(factory: (c: typeof Colors.light | typeof Colors.dark) => T) {
  return {
    light: factory(Colors.light),
    dark: factory(Colors.dark),
  };
}
