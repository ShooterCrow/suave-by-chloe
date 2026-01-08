import React, { useRef } from 'react';
import { useScroll, useTransform, motion } from 'framer-motion';


const VerticalStickyScroll = ({ title, titleClassName = "", children }) => {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
    const scale = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.8, 1, 1, 0.8]);

    return (
        <section ref={containerRef} className="relative min-h-[150vh] py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row gap-12 lg:gap-24">

                {/* Sticky Left Column (Desktop) / Top (Mobile) */}
                <div className="lg:w-1/3 lg:h-screen lg:sticky lg:top-32 flex flex-col justify-start lg:pt-20 z-10">
                    <motion.div style={{ opacity, scale }} className="origin-left">
                        <div className="text-sm font-bold tracking-widest uppercase mb-4 text-blue-600 dark:text-blue-400">
                            [ SCROLL TO EXPLORE ]
                        </div>
                        <h2 className={`
                            text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6
                            text-gray-900 dark:text-white
                            ${titleClassName}
                        `}>
                            {title}
                        </h2>
                    </motion.div>
                </div>

                {/* Scrollable Right Column */}
                <div className="lg:w-2/3 flex flex-col gap-12 lg:gap-24 lg:pt-20">
                    {children}
                </div>
            </div>
        </section>
    );
};

export default VerticalStickyScroll;

