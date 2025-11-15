import React from 'react';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md',
  disabled = false,
  loading = false,
  onClick,
  type = 'button',
  ...props 
}) => {
  const baseStyles = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    fontWeight: '600',
    border: 'none',
    borderRadius: '0.5rem',
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'all 0.2s ease-in-out',
    fontFamily: 'inherit',
    textDecoration: 'none',
    outline: 'none',
    position: 'relative',
    overflow: 'hidden'
  };

  const variants = {
    primary: {
      backgroundColor: '#2563eb',
      color: 'white',
      '&:hover:not(:disabled)': { backgroundColor: '#1d4ed8' },
      '&:focus': { boxShadow: '0 0 0 3px rgba(37, 99, 235, 0.3)' }
    },
    secondary: {
      backgroundColor: '#64748b',
      color: 'white',
      '&:hover:not(:disabled)': { backgroundColor: '#475569' },
      '&:focus': { boxShadow: '0 0 0 3px rgba(100, 116, 139, 0.3)' }
    },
    success: {
      backgroundColor: '#10b981',
      color: 'white',
      '&:hover:not(:disabled)': { backgroundColor: '#059669' },
      '&:focus': { boxShadow: '0 0 0 3px rgba(16, 185, 129, 0.3)' }
    },
    warning: {
      backgroundColor: '#f59e0b',
      color: 'white',
      '&:hover:not(:disabled)': { backgroundColor: '#d97706' },
      '&:focus': { boxShadow: '0 0 0 3px rgba(245, 158, 11, 0.3)' }
    },
    error: {
      backgroundColor: '#ef4444',
      color: 'white',
      '&:hover:not(:disabled)': { backgroundColor: '#dc2626' },
      '&:focus': { boxShadow: '0 0 0 3px rgba(239, 68, 68, 0.3)' }
    },
    outline: {
      backgroundColor: 'transparent',
      color: '#2563eb',
      border: '2px solid #2563eb',
      '&:hover:not(:disabled)': { 
        backgroundColor: '#2563eb',
        color: 'white'
      }
    },
    ghost: {
      backgroundColor: 'transparent',
      color: '#64748b',
      '&:hover:not(:disabled)': { 
        backgroundColor: '#f1f5f9',
        color: '#1e293b'
      }
    }
  };

  const sizes = {
    sm: {
      padding: '0.5rem 1rem',
      fontSize: '0.875rem'
    },
    md: {
      padding: '0.75rem 1.5rem',
      fontSize: '1rem'
    },
    lg: {
      padding: '1rem 2rem',
      fontSize: '1.125rem'
    }
  };

  const styles = {
    ...baseStyles,
    ...sizes[size],
    ...variants[variant],
    opacity: disabled ? 0.6 : 1
  };

  // Remove pseudo-classes for inline styles (simplified)
  delete styles['&:hover:not(:disabled)'];
  delete styles['&:focus'];

  return (
    <button
      type={type}
      style={styles}
      disabled={disabled || loading}
      onClick={onClick}
      onMouseOver={(e) => {
        if (!disabled && !loading && variants[variant]['&:hover:not(:disabled)']) {
          e.target.style.backgroundColor = variants[variant]['&:hover:not(:disabled)'].backgroundColor;
        }
      }}
      onMouseOut={(e) => {
        if (!disabled && !loading) {
          e.target.style.backgroundColor = variants[variant].backgroundColor;
        }
      }}
      onFocus={(e) => {
        if (variants[variant]['&:focus']) {
          e.target.style.boxShadow = variants[variant]['&:focus'].boxShadow;
        }
      }}
      onBlur={(e) => {
        e.target.style.boxShadow = 'none';
      }}
      {...props}
    >
      {loading && (
        <span style={{ 
          width: '1rem', 
          height: '1rem', 
          border: '2px solid transparent',
          borderTop: '2px solid currentColor',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
      )}
      {children}
    </button>
  );
};

export default Button;