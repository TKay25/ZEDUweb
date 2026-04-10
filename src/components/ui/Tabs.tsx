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
        px-4 py-2 text-sm font-medium
        ${isActive 
          ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400 -mb-px' 
          : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
        }
        ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        transition-colors duration-200
      `,
    },
    pills: {
      container: 'flex space-x-2',
      tab: (isActive: boolean, isDisabled: boolean) => `
        px-4 py-2 text-sm font-medium rounded-lg
        ${isActive 
          ? 'bg-blue-600 text-white' 
          : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-700 dark:hover:text-gray-300'
        }
        ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        transition-all duration-200
      `,
    },
    underline: {
      container: 'border-b border-gray-200 dark:border-gray-700',
      tab: (isActive: boolean, isDisabled: boolean) => `
        px-4 py-2 text-sm font-medium relative
        ${isActive 
          ? 'text-blue-600 dark:text-blue-400' 
          : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
        }
        ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        transition-colors duration-200
        after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5
        after:bg-blue-600 dark:after:bg-blue-400
        after:transform after:scale-x-0 after:transition-transform after:duration-200
        ${isActive ? 'after:scale-x-100' : ''}
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