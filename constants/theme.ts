import { Platform } from 'react-native';

export const DarkColors = {
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

export const LightColors = {
  primary: '#2563eb',
  primaryDark: '#1d4ed8',
  secondary: '#7c3aed',
  success: '#16a34a',
  danger: '#dc2626',
  warning: '#d97706',
  background: '#f1f5f9',
  card: '#ffffff',
  cardLight: '#e2e8f0',
  text: '#0f172a',
  textMuted: '#64748b',
  textDark: '#111827',
  inputBackground: '#ffffff',
  inputBorder: '#cbd5e1',
  white: '#ffffff',
  border: '#e2e8f0',
};

export const Colors = DarkColors;

export const Fonts = Platform.select({
  ios: { sans: 'system-ui', mono: 'ui-monospace' },
  default: { sans: 'normal', mono: 'monospace' },
});