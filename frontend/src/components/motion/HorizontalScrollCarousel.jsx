import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

import { ArrowLeft, ArrowRight } from 'lucide-react';

const HorizontalScrollCarousel = ({ title, items, renderItem }) => {
    const targetRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: targetRef,
    });

    // Horizontal movement based on vertical scroll
    // Only applies on large screens where we can pin the section
    const x = useTransform(scrollYProgress, [0, 1], ["1%", "-65%"]);

    return (
        <section ref={targetRef} className="relative h-[300vh] hidden lg:block">
            <div className="sticky top-0 flex h-screen items-center overflow-hidden">
                {/* Fade-out gradient masks on left and right edges - z-10 below title */}
                <div className="absolute left-0 top-0 bottom-0 w-[35vw] pointer-events-none z-10 bg-gradient-to-r from-gray-50 via-gray-50/80 to-transparent dark:from-[#030304] dark:via-[#030304]/80 dark:to-transparent" />
                <div className="absolute right-0 top-0 bottom-0 w-[20vw] pointer-events-none z-10 bg-gradient-to-l from-gray-50 via-gray-50/60 to-transparent dark:from-[#030304] dark:via-[#030304]/60 dark:to-transparent" />

                <div className="absolute top-1/5 left-10 lg:left-20 z-20 max-w-md">
                    {/* Radial Blob Backdrop for readability */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[160%] h-[160%] -z-10 blur-3xl rounded-full pointer-events-none bg-[radial-gradient(closest-side,rgba(255,255,255,0.95)_40%,rgba(219,234,254,0.6)_80%,transparent)] dark:bg-[radial-gradient(closest-side,rgba(3,3,4,0.95)_40%,rgba(16,26,51,0.6)_80%,transparent)]" />
                    <h2 className="font-serif text-4xl lg:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
                        {title}
                    </h2>
                    <div className="h-1 w-20 rounded-full bg-blue-600 dark:bg-blue-500" />
                </div>

                <motion.div style={{ x }} className="flex gap-8 pl-[40vw]">
                    {items.map((item, index) => (
                        <div key={index} className="flex-shrink-0">
                            {renderItem(item)}
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

// Fallback component for Mobile/Tablet (Standard CSS Horizontal Scroll)
export const MobileHorizontalScroll = ({ title, items, renderItem }) => {
    const scrollRef = useRef(null);

    const scroll = (direction) => {
        if (scrollRef.current) {
            const { current } = scrollRef;
            const scrollAmount = direction === 'left' ? -300 : 300;
            current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    return (
        <section className="lg:hidden py-16 px-4">
            <div className="flex justify-between items-end mb-8">
                <h2 className="font-serif text-3xl font-bold text-gray-900 dark:text-white">
                    {title}
                </h2>
                <div className="flex gap-2">
                    <button
                        onClick={() => scroll('left')}
                        className="p-2 rounded-full border border-gray-300 text-gray-900 hover:bg-gray-100 dark:border-white/20 dark:text-white dark:hover:bg-white/10 transition-colors"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <button
                        onClick={() => scroll('right')}
                        className="p-2 rounded-full border border-gray-300 text-gray-900 hover:bg-gray-100 dark:border-white/20 dark:text-white dark:hover:bg-white/10 transition-colors"
                    >
                        <ArrowRight size={20} />
                    </button>
                </div>
            </div>

            <div
                ref={scrollRef}
                className="flex overflow-x-auto gap-6 snap-x snap-mandatory pb-8 no-scrollbar touch-pan-x"
                style={{ scrollbarWidth: 'none' }}
            >
                {items.map((item, index) => (
                    <div key={index} className="flex-shrink-0 snap-center w-[85vw] sm:w-[50vw]">
                        {renderItem(item)}
                    </div>
                ))}
            </div>
        </section>
    );
}

export default HorizontalScrollCarousel;
