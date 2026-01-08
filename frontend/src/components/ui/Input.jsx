import React from 'react';

const Input = ({
    icon: Icon,
    className = '',
    ...props
}) => {
    return (
        <div className="relative">
            {Icon && (
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <Icon size={20} />
                </div>
            )}
            <input
                className={`
                    w-full rounded-lg border border-gray-300 dark:border-white/10 
                    bg-white dark:bg-dark-700 text-gray-900 dark:text-white 
                    focus:ring-2 focus:ring-blue-500 focus:border-transparent
                    transition-all duration-200
                    ${Icon ? 'pl-10' : 'pl-4'} 
                    pr-4 py-2
                    ${className}
                `}
                {...props}
            />
        </div>
    );
};

export default Input;
