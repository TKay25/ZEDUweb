// src/components/ui/Card.tsx
import React, { forwardRef } from 'react';
//import type { BaseProps } from '../../types/ui.types';
//import type { CardProps as UICardProps } from '../../types/ui.types';

// Define local BaseProps since the imported one might be different
interface LocalBaseProps {
  children?: React.ReactNode;
  className?: string;
}

// Define local CardProps that extends LocalBaseProps
interface LocalCardProps extends LocalBaseProps {
  variant?: 'default' | 'elevated' | 'outlined' | 'glass';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  onClick?: () => void;
  hoverable?: boolean;
}

type CardComponent = React.ForwardRefExoticComponent<
  LocalCardProps & React.RefAttributes<HTMLDivElement>
> & {
  Header: typeof CardHeader;
  Body: typeof CardBody;
  Footer: typeof CardFooter;
};

const Card = forwardRef<HTMLDivElement, LocalCardProps>(({
  children,
  variant = 'default',
  padding = 'md',
  hoverable = false,
  onClick,
  className = '',
  ...props
}, ref) => {
  const variantClasses = {
    default: 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow duration-300',
    elevated: 'bg-white dark:bg-gray-800 shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-gray-700',
    outlined: 'bg-gradient-to-br from-blue-50/50 to-indigo-50/30 dark:from-gray-900/50 dark:to-gray-800/50 border-2 border-blue-200 dark:border-blue-900/50 backdrop-blur-xs',
    glass: 'bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-white/30 dark:border-gray-700/50 shadow-lg hover:shadow-xl transition-all duration-300',
  };

  const paddingClasses = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  const hoverClasses = hoverable ? 'transform hover:scale-102 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300 cursor-pointer' : '';

  return (
    <div
      ref={ref}
      className={`
        rounded-2xl
        ${variantClasses[variant]}
        ${paddingClasses[padding]}
        ${hoverClasses}
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
}) as CardComponent;

Card.displayName = 'Card';

interface CardHeaderProps extends LocalBaseProps {
  title?: string;
  subtitle?: string;
  action?: React.ReactNode;
}

const CardHeader: React.FC<CardHeaderProps> = ({
  title,
  subtitle,
  action,
  children,
  className = '',
}) => {
  return (
    <div className={`flex items-start justify-between mb-4 ${className}`}>
      <div className="flex-1">
        {title && <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>}
        {subtitle && <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{subtitle}</p>}
        {children}
      </div>
      {action && <div className="ml-4">{action}</div>}
    </div>
  );
};

interface CardBodyProps extends LocalBaseProps {}

const CardBody: React.FC<CardBodyProps> = ({ children, className = '' }) => {
  return <div className={className}>{children}</div>;
};

interface CardFooterProps extends LocalBaseProps {
  divider?: boolean;
}

const CardFooter: React.FC<CardFooterProps> = ({ children, divider = false, className = '' }) => {
  return (
    <div
      className={`
        mt-4 pt-4
        ${divider ? 'border-t border-gray-200 dark:border-gray-700' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
};

Card.Header = CardHeader;
Card.Body = CardBody;
Card.Footer = CardFooter;

// Add named export
export { Card, CardHeader, CardBody, CardFooter };

// Keep default export
export default Card;