import React from 'react';

const Badge = ({
    children,
    variant = 'neutral',
    className = '',
    ...props
}) => {
    const variants = {
        neutral: "bg-gray-100 text-gray-800 dark:bg-white/10 dark:text-gray-400",
        success: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
        warning: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
        error: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
        blue: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
        purple: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
        rose: "bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-400",
    };

    return (
        <span
            className={`
                inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-mono font-medium
                ${variants[variant] || variants.neutral}
                ${className}
            `}
            {...props}
        >
            {children}
        </span>
    );
};

export default Badge;
