import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    // Initialize theme from localStorage or system preference
    const [isDarkMode, setIsDarkMode] = useState(() => {
        // First check localStorage
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            return savedTheme === 'dark';
        }
        // Then check system preference
        if (window.matchMedia) {
            return window.matchMedia('(prefers-color-scheme: dark)').matches;
        }
        // Default to light if no preference can be detected
        return false;
    });

    // Update document class and localStorage when theme changes
    useEffect(() => {
        const root = document.documentElement;
        if (isDarkMode) {
            root.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            root.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [isDarkMode]);

    // Listen for system theme changes
    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

        const handleChange = (e) => {
            // Only update theme if user hasn't set a preference
            if (!localStorage.getItem('theme')) {
                setIsDarkMode(e.matches);
            }
        };

        // Add listener
        if (mediaQuery?.addEventListener) {
            mediaQuery.addEventListener('change', handleChange);
        } else if (mediaQuery?.addListener) {
            // Fallback for older browsers
            mediaQuery.addListener(handleChange);
        }

        // Cleanup
        return () => {
            if (mediaQuery?.removeEventListener) {
                mediaQuery.removeEventListener('change', handleChange);
            } else if (mediaQuery?.removeListener) {
                mediaQuery.removeListener(handleChange);
            }
        };
    }, []);

    const toggleDarkMode = () => {
        setIsDarkMode(prev => !prev);
    };

    // Clear user preference and follow system
    const resetToSystem = () => {
        localStorage.removeItem('theme');
        if (window.matchMedia) {
            setIsDarkMode(window.matchMedia('(prefers-color-scheme: dark)').matches);
        }
    };

    return (
        <ThemeContext.Provider value={{
            isDarkMode,
            toggleDarkMode,
            resetToSystem,
            hasUserPreference: Boolean(localStorage.getItem('theme'))
        }}>
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