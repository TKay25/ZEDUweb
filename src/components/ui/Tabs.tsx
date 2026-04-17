// src/components/ui/Tabs.tsx
import React, { useState } from 'react';

interface TabItem {
  key: string;
  label: string;
  icon?: React.ReactNode;
  disabled?: boolean;
}

interface TabsProps {
  items: TabItem[];
  activeKey?: string;
  defaultActiveKey?: string;
  onChange?: (key: string) => void;
  variant?: 'default' | 'pills' | 'underline';
  fullWidth?: boolean;
  className?: string;
  children?: React.ReactNode;
}

// Define the props that TabPanel accepts
interface TabPanelProps {
  tabKey: string;
  children: React.ReactNode;
  className?: string;
}

// Define the type for the Tabs component with Panel property
type TabsComponent = React.FC<TabsProps> & {
  Panel: React.FC<TabPanelProps>;
};

const TabPanel: React.FC<TabPanelProps> = ({ children, className = '' }) => {
  return <div className={className}>{children}</div>;
};

const Tabs: TabsComponent = ({
  items,
  activeKey,
  defaultActiveKey,
  onChange,
  variant = 'default',
  fullWidth = false,
  className = '',
  children,
}) => {
  const [internalActiveKey, setInternalActiveKey] = useState(defaultActiveKey || items[0]?.key);

  const currentActiveKey = activeKey !== undefined ? activeKey : internalActiveKey;

  const handleTabClick = (key: string) => {
    if (key !== currentActiveKey) {
      setInternalActiveKey(key);
      onChange?.(key);
    }
  };

  const variantClasses = {
    default: {
      container: 'border-b border-gray-200 dark:border-gray-700',
      tab: (isActive: boolean, isDisabled: boolean) => `
        px-4 py-2 text-sm font-semibold
        ${isActive 
          ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400 -mb-px shadow-blue-glow' 
          : 'text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400'
        }
        ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        transition-all duration-300 hover:-translate-y-0.5
      `,
    },
    pills: {
      container: 'flex space-x-2 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl',
      tab: (isActive: boolean, isDisabled: boolean) => `
        px-4 py-2 text-sm font-semibold rounded-lg
        ${isActive 
          ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30' 
          : 'text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-400'
        }
        ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        transition-all duration-300 transform hover:scale-105
      `,
    },
    underline: {
      container: 'border-b-2 border-gray-200 dark:border-gray-700',
      tab: (isActive: boolean, isDisabled: boolean) => `
        px-4 py-3 text-sm font-semibold relative
        ${isActive 
          ? 'text-blue-600 dark:text-blue-400' 
          : 'text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400'
        }
        ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        transition-colors duration-300
        after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-1
        after:bg-gradient-to-r after:from-blue-600 after:to-indigo-600
        after:transform after:scale-x-0 after:origin-left after:transition-transform after:duration-300
        ${isActive ? 'after:scale-x-100' : 'hover:after:scale-x-50'}
      `,
    },
  };

  const variantConfig = variantClasses[variant];

  // Type-safe function to check if a child is a TabPanel
  const isTabPanel = (child: React.ReactNode): child is React.ReactElement<TabPanelProps> => {
    return React.isValidElement(child) && child.type === TabPanel;
  };

  return (
    <div className={className}>
      <div className={`${variantConfig.container} ${fullWidth ? 'flex' : 'inline-flex'}`}>
        {items.map((item) => (
          <button
            key={item.key}
            onClick={() => !item.disabled && handleTabClick(item.key)}
            disabled={item.disabled}
            className={`
              ${variantConfig.tab(item.key === currentActiveKey, !!item.disabled)}
              ${fullWidth ? 'flex-1' : ''}
              ${item.icon ? 'flex items-center space-x-2' : ''}
            `}
          >
            {item.icon && <span>{item.icon}</span>}
            <span>{item.label}</span>
          </button>
        ))}
      </div>

      {children && (
        <div className="mt-4">
          {React.Children.map(children, (child) => {
            if (isTabPanel(child) && child.props.tabKey === currentActiveKey) {
              return child;
            }
            return null;
          })}
        </div>
      )}
    </div>
  );
};

Tabs.Panel = TabPanel;

// Export both named and default
export { Tabs, TabPanel };
export default Tabs;