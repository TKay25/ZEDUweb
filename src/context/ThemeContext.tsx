import React, { createContext, useContext, useState, useEffect } from 'react';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  resolvedTheme: 'light' | 'dark';
  toggleTheme: () => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('theme') as Theme;
    return saved || 'system';
  });

  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    localStorage.setItem('theme', theme);
    updateResolvedTheme();
  }, [theme]);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = () => {
      if (theme === 'system') {
        updateResolvedTheme();
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  const updateResolvedTheme = () => {
    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      setResolvedTheme(systemTheme);
      document.documentElement.classList.toggle('dark', systemTheme === 'dark');
    } else {
      setResolvedTheme(theme);
      document.documentElement.classList.toggle('dark', theme === 'dark');
    }
  };

  const toggleTheme = () => {
    setTheme(prev => {
      if (prev === 'light') return 'dark';
      if (prev === 'dark') return 'light';
      return 'system';
    });
  };

  const isDark = resolvedTheme === 'dark';

  const value = {
    theme,
    setTheme,
    resolvedTheme,
    toggleTheme,
    isDark
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// Custom hook for theme-aware styles
export const useThemedStyles = () => {
  const { isDark } = useTheme();

  return {
    bg: isDark ? 'bg-gray-900' : 'bg-gray-50',
    text: isDark ? 'text-gray-100' : 'text-gray-900',
    card: isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200',
    input: isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300',
    button: {
      primary: isDark ? 'bg-primary-700 hover:bg-primary-600' : 'bg-primary-600 hover:bg-primary-700',
      secondary: isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300',
      outline: isDark ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'
    },
    border: isDark ? 'border-gray-700' : 'border-gray-200',
    hover: isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-50',
    muted: isDark ? 'text-gray-400' : 'text-gray-500'
  };
};