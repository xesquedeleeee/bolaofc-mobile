import { Platform } from 'react-native';

export const Colors = {
  primary: '#2563eb',
  primaryDark: '#1d4ed8',
  secondary: '#7c3aed',
  success: '#16a34a',
  danger: '#dc2626',
  warning: '#d97706',
  background: '#0f172a',
  card: '#1e293b',
  cardLight: '#334155',
  text: '#f8fafc',
  textMuted: '#94a3b8',
  textDark: '#111827',
  inputBackground: '#1e293b',
  inputBorder: '#334155',
  white: '#ffffff',
  border: '#334155',
};

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    mono: 'monospace',
  },
});