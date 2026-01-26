/**
 * RPP AUTO - "RECESSION PROOF" DARK MODE DESIGN SYSTEM
 * ==========================================================
 * Strict adherence to Black/Green/Yellow brand identity
 * Based on the "Recession Proof" logo and PRD Fixture
 */

export const colors = {
  // PRIMARY BRAND COLORS (The Logo)
  background: {
    primary: '#000000',        // Pure Black - The Void (main background)
    surface: '#121212',        // Dark Gunmetal - Cards/elevated surfaces
    elevated: '#1A1A1A',       // Slightly elevated elements
  },
  
  brand: {
    green: '#00FF41',          // RPP Neon Green - Main brand color
    yellow: '#FFD700',         // Safety Yellow - Secondary brand color
    greenDark: '#00CC34',      // Darker green for pressed states
    yellowDark: '#CCAC00',     // Darker yellow for pressed states
  },
  
  text: {
    primary: '#FFFFFF',        // Pure White - Headings
    secondary: '#E5E7EB',      // Light Grey - Body text
    tertiary: '#9CA3AF',       // Mid Grey - Subtle text
    disabled: '#6B7280',       // Dark Grey - Disabled text
  },
  
  border: {
    default: '#333333',        // Subtle Grey - Default borders
    active: '#00FF41',         // Green - Active/focused borders
    inactive: '#1F1F1F',       // Very dark grey - Inactive borders
  },
  
  semantic: {
    success: '#00FF41',        // Green - Success states
    warning: '#FFD700',        // Yellow - Warnings/cautions
    error: '#FF4444',          // Red - Errors
    info: '#00BFFF',           // Blue - Info states
  },
  
  // UI STATES
  interactive: {
    default: '#00FF41',        // Green - Default interactive elements
    hover: '#00CC34',          // Darker green - Hover state
    pressed: '#009928',        // Even darker green - Pressed state
    disabled: '#6B7280',       // Grey - Disabled state
  },
  
  // OVERLAYS & SHADOWS
  overlay: {
    light: 'rgba(0, 255, 65, 0.1)',     // Green tint
    medium: 'rgba(0, 255, 65, 0.2)',    
    dark: 'rgba(0, 0, 0, 0.8)',
  },
};

export const typography = {
  // FONT FAMILIES
  fonts: {
    primary: 'System',                   // iOS: SF Pro, Android: Roboto
    mono: 'Menlo',                       // Monospace for data/codes
  },
  
  // TYPE SCALE
  sizes: {
    h1: 32,
    h2: 24,
    h3: 20,
    h4: 18,
    body: 16,
    bodySmall: 14,
    caption: 12,
    tiny: 10,
  },
  
  weights: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
  
  lineHeights: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  },
};

export const spacing = {
  // 4pt grid system
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
};

export const borderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  pill: 25,
  circle: 9999,
};

export const shadows = {
  sm: {
    shadowColor: colors.brand.green,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: colors.brand.green,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: colors.brand.green,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
};

// COMPONENT STYLES
export const components = {
  button: {
    primary: {
      backgroundColor: colors.brand.green,
      color: colors.background.primary,
      borderRadius: borderRadius.pill,
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.xl,
      fontWeight: typography.weights.semibold,
    },
    secondary: {
      backgroundColor: 'transparent',
      color: colors.brand.yellow,
      borderWidth: 2,
      borderColor: colors.brand.yellow,
      borderRadius: borderRadius.pill,
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.xl,
      fontWeight: typography.weights.semibold,
    },
    ghost: {
      backgroundColor: 'transparent',
      color: colors.text.secondary,
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.xl,
      fontWeight: typography.weights.medium,
    },
  },
  
  input: {
    default: {
      backgroundColor: colors.background.surface,
      borderWidth: 2,
      borderColor: colors.border.default,
      borderRadius: borderRadius.md,
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.md,
      color: colors.text.primary,
      fontSize: typography.sizes.body,
    },
    focused: {
      borderColor: colors.brand.green,
    },
    error: {
      borderColor: colors.semantic.error,
    },
  },
  
  card: {
    default: {
      backgroundColor: colors.background.surface,
      borderRadius: borderRadius.lg,
      padding: spacing.md,
      borderWidth: 1,
      borderColor: colors.border.default,
    },
    elevated: {
      backgroundColor: colors.background.elevated,
      borderRadius: borderRadius.lg,
      padding: spacing.md,
      ...shadows.md,
    },
    active: {
      backgroundColor: colors.background.surface,
      borderRadius: borderRadius.lg,
      padding: spacing.md,
      borderWidth: 2,
      borderColor: colors.brand.green,
    },
  },
  
  tabBar: {
    container: {
      backgroundColor: colors.background.surface,
      borderTopWidth: 1,
      borderTopColor: colors.border.default,
      height: 60,
    },
    icon: {
      active: colors.brand.green,
      inactive: '#666666',
    },
    label: {
      active: colors.brand.green,
      inactive: colors.text.tertiary,
    },
  },
};

// ANIMATION DURATIONS
export const animations = {
  fast: 150,
  normal: 250,
  slow: 350,
};

// EXPORT DEFAULT THEME
export const theme = {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
  components,
  animations,
} as const;

export type Theme = typeof theme;
export default theme;
