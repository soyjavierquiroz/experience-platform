import type { CSSProperties } from "react";
import { z } from "zod";

const color = z.string().regex(/^#(?:[\da-f]{3}|[\da-f]{6}|[\da-f]{8})$/i, "Expected a hex color");

export const tenantBrandingSchema = z.object({
  colors: z.object({
    background: color,
    surface: color,
    surfaceMuted: color,
    primary: color,
    primaryForeground: color,
    secondary: color,
    secondaryForeground: color,
    accent: color,
    accentForeground: color,
    text: color,
    textMuted: color,
    border: color,
    success: color,
    warning: color,
    danger: color,
  }),
  typography: z.object({ headingFont: z.string().min(1), bodyFont: z.string().min(1) }),
  radius: z.object({ card: z.string().min(1), button: z.string().min(1) }),
  assets: z.object({ logo: z.string(), icon: z.string(), cover: z.string() }),
  supportEmail: z.email(),
  tagline: z.string().min(1),
});

export type TenantBranding = z.infer<typeof tenantBrandingSchema>;
type ThemeStyle = CSSProperties & Record<`--${string}`, string>;

export function brandingToCssVariables(value: TenantBranding): ThemeStyle {
  const branding = tenantBrandingSchema.parse(value);
  return {
    "--background": branding.colors.background,
    "--surface": branding.colors.surface,
    "--surface-muted": branding.colors.surfaceMuted,
    "--primary": branding.colors.primary,
    "--primary-foreground": branding.colors.primaryForeground,
    "--secondary": branding.colors.secondary,
    "--secondary-foreground": branding.colors.secondaryForeground,
    "--accent": branding.colors.accent,
    "--accent-foreground": branding.colors.accentForeground,
    "--text": branding.colors.text,
    "--muted": branding.colors.textMuted,
    "--border": branding.colors.border,
    "--success": branding.colors.success,
    "--warning": branding.colors.warning,
    "--danger": branding.colors.danger,
    "--font-heading": branding.typography.headingFont,
    "--font-body": branding.typography.bodyFont,
    "--radius-card": branding.radius.card,
    "--radius-button": branding.radius.button,
  };
}
