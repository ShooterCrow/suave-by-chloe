import React, { useRef } from 'react';



const SpotlightCard = ({ children, className = "", onClick }) => {
    const divRef = useRef(null);

    const handleMouseMove = (e) => {
        const div = divRef.current;
        if (!div) return;

        const rect = div.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        div.style.setProperty('--mouse-x', `${x}px`);
        div.style.setProperty('--mouse-y', `${y}px`);
    };

    return (
        <div
            ref={divRef}
            onMouseMove={handleMouseMove}
            onClick={onClick}
            className={`
                relative bg-white dark:bg-panel border border-gray-200 dark:border-white/5 rounded-2xl overflow-hidden
                before:content-[''] before:absolute before:inset-0 before:rounded-[inherit] before:border before:border-transparent before:z-[2] before:opacity-0 before:transition-opacity before:duration-500 hover:before:opacity-100
                before:[background:radial-gradient(600px_circle_at_var(--mouse-x)_var(--mouse-y),var(--spotlight-border),transparent_40%)]
                before:[mask:linear-gradient(#fff_0_0)_content-box,linear-gradient(#fff_0_0)]
                before:[mask-composite:exclude]
                after:content-[''] after:absolute after:inset-0 after:z-[1] after:opacity-0 after:transition-opacity after:duration-500 hover:after:opacity-100
                after:[background:radial-gradient(800px_circle_at_var(--mouse-x)_var(--mouse-y),var(--spotlight-bg),transparent_40%)]
                ${className}
            `}
            style={{
                '--spotlight-border': 'var(--spotlight-border-color)',
                '--spotlight-bg': 'var(--spotlight-bg-color)',
            }}
        >
            <div className="relative z-10 w-full h-full">
                {children}
            </div>
        </div>
    );
};

export default SpotlightCard;

