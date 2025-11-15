import React from 'react';

const Input = ({
  label,
  error,
  helperText,
  size = 'md',
  fullWidth = true,
  ...props
}) => {
  const sizes = {
    sm: {
      padding: '0.5rem 0.75rem',
      fontSize: '0.875rem'
    },
    md: {
      padding: '0.75rem 1rem',
      fontSize: '1rem'
    },
    lg: {
      padding: '1rem 1.25rem',
      fontSize: '1.125rem'
    }
  };

  const inputStyles = {
    width: fullWidth ? '100%' : 'auto',
    padding: sizes[size].padding,
    fontSize: sizes[size].fontSize,
    border: `1px solid ${error ? '#ef4444' : '#d1d5db'}`,
    borderRadius: '0.5rem',
    backgroundColor: '#ffffff',
    transition: 'all 0.2s ease-in-out',
    fontFamily: 'inherit',
    outline: 'none',
    boxSizing: 'border-box'
  };

  return (
    <div style={{ marginBottom: '1rem' }}>
      {label && (
        <label style={{ 
          display: 'block', 
          marginBottom: '0.5rem',
          fontWeight: '600',
          color: '#374151',
          fontSize: sizes[size].fontSize
        }}>
          {label}
          {props.required && <span style={{ color: '#ef4444', marginLeft: '0.25rem' }}>*</span>}
        </label>
      )}
      
      <input
        style={inputStyles}
        onFocus={(e) => {
          e.target.style.borderColor = error ? '#ef4444' : '#2563eb';
          e.target.style.boxShadow = `0 0 0 3px ${error ? 'rgba(239, 68, 68, 0.1)' : 'rgba(37, 99, 235, 0.1)'}`;
        }}
        onBlur={(e) => {
          e.target.style.borderColor = error ? '#ef4444' : '#d1d5db';
          e.target.style.boxShadow = 'none';
        }}
        {...props}
      />
      
      {(error || helperText) && (
        <div style={{ 
          marginTop: '0.5rem',
          fontSize: '0.875rem',
          color: error ? '#ef4444' : '#6b7280'
        }}>
          {error || helperText}
        </div>
      )}
    </div>
  );
};

export default Input;