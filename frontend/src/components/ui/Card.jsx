import React from 'react';

const Card = ({ 
  children, 
  padding = 'lg',
  shadow = 'md',
  borderRadius = 'lg',
  className = '',
  style = {},
  ...props 
}) => {
  const paddingMap = {
    none: '0',
    sm: '1rem',
    md: '1.5rem',
    lg: '2rem',
    xl: '3rem'
  };

  const shadowMap = {
    none: 'none',
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)'
  };

  const borderRadiusMap = {
    sm: '0.375rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem'
  };

  const cardStyles = {
    backgroundColor: '#ffffff',
    borderRadius: borderRadiusMap[borderRadius],
    boxShadow: shadowMap[shadow],
    padding: paddingMap[padding],
    border: '1px solid #e2e8f0',
    ...style
  };

  return (
    <div style={cardStyles} className={className} {...props}>
      {children}
    </div>
  );
};

export default Card;