/**
 * RilyBricoule Theme Configuration
 * 
 * Professional color scheme: Blue (primary), Orange (accent), Grey (neutral), Cyan (fresh)
 * Use this file to maintain consistent theming across the application
 */

export const theme = {
  colors: {
    // Primary Blues - Deep and Professional
    primary: {
      50: '#eff6ff',
      100: '#dbeafe',
      200: '#bfdbfe',
      300: '#93c5fd',
      400: '#60a5fa',
      500: '#2563eb',  // Main professional blue
      600: '#1d4ed8',
      700: '#1e40af',
      800: '#1e3a8a',
      900: '#172554',
    },
    // Accent Orange - Vibrant and energetic
    orange: {
      50: '#fff7ed',
      100: '#ffedd5',
      200: '#fed7aa',
      300: '#fdba74',
      400: '#fb923c',
      500: '#f97316',  // Main vibrant orange
      600: '#ea580c',
      700: '#c2410c',
      800: '#9a3412',
      900: '#7c2d12',
    },
    // Cyan - Fresh and modern
    cyan: {
      50: '#ecfeff',
      100: '#cffafe',
      200: '#a5f3fc',
      300: '#67e8f9',
      400: '#22d3ee',
      500: '#06b6d4',
      600: '#0891b2',
      700: '#0e7490',
      800: '#155e75',
      900: '#164e63',
    },
    // Greys - Clean and professional (Enhanced)
    grey: {
      50: '#f8fafc',
      100: '#f1f5f9',
      200: '#e2e8f0',
      300: '#cbd5e1',
      400: '#94a3b8',
      500: '#64748b',
      600: '#475569',
      700: '#334155',
      800: '#1e293b',
      900: '#0f172a',
    },
  },
  gradients: {
    primary: 'from-blue-600 via-blue-500 to-cyan-500',
    secondary: 'from-blue-700 via-blue-600 to-blue-500',
    accent: 'from-orange-500 to-orange-600',
    combined: 'from-blue-600 via-orange-500 to-cyan-500',
    hero: 'from-blue-50 via-orange-50 to-grey-50',
    card: 'from-blue-500 to-cyan-500',
    warm: 'from-orange-400 to-orange-600',
    neutral: 'from-grey-100 to-grey-200',
  },
  shadows: {
    primary: '0 10px 40px rgba(37, 99, 235, 0.25)',
    secondary: '0 20px 60px rgba(37, 99, 235, 0.3)',
    accent: '0 10px 40px rgba(249, 115, 22, 0.2)',
    grey: '0 10px 30px rgba(100, 116, 139, 0.15)',
    combined: '0 10px 40px rgba(37, 99, 235, 0.2), 0 5px 20px rgba(249, 115, 22, 0.1)',
    hover: '0 20px 60px rgba(37, 99, 235, 0.35)',
  },
};

export default theme;
