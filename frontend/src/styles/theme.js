// Professional Design System
export const theme = {
    // Colors
    colors: {
      primary: '#2563eb',      // Professional blue
      primaryDark: '#1d4ed8',
      primaryLight: '#3b82f6',
      secondary: '#64748b',    // Professional gray
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
      background: '#f8fafc',
      surface: '#ffffff',
      text: {
        primary: '#1e293b',
        secondary: '#64748b',
        light: '#94a3b8'
      },
      border: '#e2e8f0'
    },
  
    // Typography
    typography: {
      h1: {
        fontSize: '2.5rem',
        fontWeight: '700',
        lineHeight: '1.2'
      },
      h2: {
        fontSize: '2rem',
        fontWeight: '600',
        lineHeight: '1.3'
      },
      h3: {
        fontSize: '1.5rem',
        fontWeight: '600',
        lineHeight: '1.4'
      },
      h4: {
        fontSize: '1.25rem',
        fontWeight: '600',
        lineHeight: '1.4'
      },
      body: {
        fontSize: '1rem',
        lineHeight: '1.6'
      },
      small: {
        fontSize: '0.875rem',
        lineHeight: '1.5'
      }
    },
  
    // Spacing (8px grid system)
    spacing: {
      xs: '0.5rem',   // 8px
      sm: '1rem',     // 16px
      md: '1.5rem',   // 24px
      lg: '2rem',     // 32px
      xl: '3rem',     // 48px
      xxl: '4rem'     // 64px
    },
  
    // Border Radius
    borderRadius: {
      sm: '0.375rem',
      md: '0.5rem',
      lg: '0.75rem',
      xl: '1rem'
    },
  
    // Shadows
    shadows: {
      sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
      md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
      lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
      xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)'
    },
  
    // Breakpoints
    breakpoints: {
      mobile: '640px',
      tablet: '768px',
      desktop: '1024px'
    }
  };
  
  // Utility functions
  export const getSpacing = (size) => theme.spacing[size] || size;
  export const getColor = (color) => theme.colors[color] || color;