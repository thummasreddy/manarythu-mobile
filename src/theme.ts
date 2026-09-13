// Single source of truth: ../design-tokens.json (mirrored from manarythu-docs).
// Do not hand-edit color values — update the token file and re-sync.
import tokens from "../design-tokens.json";

const c = tokens.colors;

export const colors = {
  background: c.semantic.background,
  surface: c.semantic.surface,
  cream: c.cream["100"],
  primary: c.brand["500"],
  primaryDark: c.brand["900"],
  primarySoft: c.brand["50"],
  border: c.semantic.border,
  clay: c.clay["500"],
  text: c.semantic.textPrimary,
  muted: c.semantic.textSecondary,
  white: "#FFFFFF",
  warning: c.semantic.warning,
  error: c.semantic.error,
  success: c.semantic.success,
  info: c.semantic.info,
  disabled: c.semantic.disabled,
} as const;

export const radius = {
  sm: 10,
  md: 16,
  lg: 24,
  pill: 999,
} as const;

export const shadow = {
  shadowColor: c.brand["900"],
  shadowOpacity: 0.08,
  shadowRadius: 12,
  shadowOffset: { width: 0, height: 5 },
  elevation: 3,
} as const;
