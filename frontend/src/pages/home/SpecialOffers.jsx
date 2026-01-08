import React from 'react';
import { ArrowRight, Clock, Star, Gift, Percent } from 'lucide-react';

import SpotlightCard from '../../components/ui/SpotlightCard';

const offers = [
    {
        id: 1,
        title: "Early Bird Saver",
        description: "Plan ahead and secure our best rates. Book 60 days in advance.",
        discount: "20% OFF",
        validity: "Valid until Dec 31",
        image: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        colSpan: "lg:col-span-2",
        icon: Percent
    },
    {
        id: 2,
        title: "Romantic Getaway",
        description: "Couples massage & champagne dinner.",
        discount: "Package",
        validity: "Always Available",
        image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        colSpan: "lg:col-span-1",
        icon: Star
    },
    {
        id: 3,
        title: "Family Fun",
        description: "Kids eat free under 12.",
        discount: "Kids Free",
        validity: "Summer Season",
        image: "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        colSpan: "lg:col-span-1",
        icon: Gift
    },
    {
        id: 4,
        title: "Long Stay Retreat",
        description: "Stay 7+ nights for immersive relaxation and extended savings.",
        discount: "30% OFF",
        validity: "Year Round",
        image: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        colSpan: "lg:col-span-2",
        icon: Clock
    },
    {
        id: 5,
        title: "Spa & Wellness",
        description: "Thermal suites access included.",
        discount: "Wellness",
        validity: "Weekdays Only",
        image: "https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        colSpan: "lg:col-span-3", // Full width bottom
        icon: Star
    }
];

const SpecialOffers = () => {
    return (
        <section className="py-24 bg-gray-50 dark:bg-void">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <span className="font-mono text-sm text-blue-500 tracking-widest uppercase mb-2 block">
                        04 // EXCLUSIVE SAVINGS
                    </span>
                    <h2 className="font-serif text-3xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-white">
                        Curated Packages
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 auto-rows-[300px] lg:auto-rows-[400px] gap-6">
                    {offers.map((offer) => (
                        <SpotlightCard
                            key={offer.id}
                            className={`
                                h-[300px] lg:h-full
                                relative group overflow-hidden ${offer.colSpan}
                                bg-white border-gray-200 dark:bg-panel dark:border-white/10
                            `}
                        >
                            {/* Background Image */}
                            <div className="absolute inset-0 z-0">
                                <img
                                    src={offer.image}
                                    alt={offer.title}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-60 group-hover:opacity-40"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-white via-white/10 to-transparent dark:from-void dark:via-void/50 dark:to-transparent" />
                            </div>

                            {/* Content */}
                            <div className="relative z-10 h-full p-8 flex flex-col justify-between ">
                                <div className="flex justify-between items-start">
                                    <span className="px-3 py-1 rounded-full text-xs font-mono font-bold backdrop-blur-md border bg-white/80 text-blue-600 border-white/50 shadow-sm dark:bg-blue-500/20 dark:text-blue-400 dark:border-blue-500/30">
                                        {offer.discount}
                                    </span>
                                    <div className="p-2 rounded-full backdrop-blur-md bg-white/60 text-gray-900 dark:bg-white/10 dark:text-white">
                                        <offer.icon size={20} />
                                    </div>
                                </div>

                                <div>
                                    <h3 className="font-serif text-3xl font-bold mb-3 text-gray-900 dark:text-white">
                                        {offer.title}
                                    </h3>
                                    <p className="mb-6 max-w-md text-gray-700 dark:text-gray-300 font-sans">
                                        {offer.description}
                                    </p>

                                    <div className="flex items-center justify-between border-t border-white/10 pt-4">
                                        <span className="text-xs font-mono text-gray-500 dark:text-gray-400">
                                            {offer.validity}
                                        </span>
                                        <button className="flex items-center gap-2 font-mono text-sm font-semibold transition-all group-hover:gap-3 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
                                            RESERVE <ArrowRight size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </SpotlightCard>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default SpecialOffers;
