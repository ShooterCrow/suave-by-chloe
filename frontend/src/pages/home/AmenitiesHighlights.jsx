import React from 'react';
import { Utensils, Wifi, Waves, Dumbbell, Coffee, Martini } from 'lucide-react';

// SpotlightCard Component
const SpotlightCard = ({ children, className = "" }) => {
    const cardRef = React.useRef(null);
    const [mousePosition, setMousePosition] = React.useState({ x: 0, y: 0 });
    const [isHovering, setIsHovering] = React.useState(false);

    const handleMouseMove = (e) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        setMousePosition({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        });
    };

    return (
        <div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            className={`relative overflow-hidden rounded-lg border ${className}`}
            style={{
                background: isHovering
                    ? `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, var(--spotlight-color), transparent 40%)`
                    : 'transparent',
            }}
        >
            {children}
        </div>
    );
};

const amenities = [
    {
        icon: Waves,
        name: "Infinity Pool",
        desc: "Panoramic city views",
        detail: "Temperature controlled year-round with poolside service",
        image: "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
    },
    {
        icon: Utensils,
        name: "Fine Dining",
        desc: "Michelin-starred chefs",
        detail: "Farm-to-table cuisine with seasonal tasting menus",
        image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
    },
    {
        icon: Dumbbell,
        name: "Fitness Center",
        desc: "24/7 state-of-the-art gym",
        detail: "Personal trainers and wellness classes included",
        image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
    },
    {
        icon: Wifi,
        name: "High-Speed Wifi",
        desc: "Seamless connectivity",
        detail: "Fiber optic network throughout the property",
        image: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
    },
    {
        icon: Coffee,
        name: "Executive Lounge",
        desc: "Private workspace & drinks",
        detail: "Complimentary refreshments and business facilities",
        image: "https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
    },
    {
        icon: Martini,
        name: "Rooftop Bar",
        desc: "Sunset cocktails",
        detail: "Live music every Friday with signature mixology",
        image: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
    },
];

const AmenitiesHighlights = () => {
    return (
        <section className="py-24 bg-white dark:bg-void">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <span className="font-mono text-sm text-blue-500 tracking-widest uppercase mb-2 block">
                        02 // EXPERIENCES
                    </span>
                    <h2 className="font-serif text-3xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-white">
                        World Class Amenities
                    </h2>
                    <p className="text-lg font-sans text-gray-600 dark:text-gray-400">
                        Experience a new level of luxury with our carefully curated services designed for your ultimate comfort.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {amenities.map((item, index) => (
                        <SpotlightCard
                            key={index}
                            className="p-8 h-full relative overflow-hidden group bg-white border-gray-300 dark:bg-gray-900 dark:border-white/20"
                        >
                            {/* Subtle Background Image - Increases visibility and zooms on hover */}
                            <div
                                className="absolute inset-0 opacity-[0.07] group-hover:opacity-[0.12] transition-all duration-2000 bg-cover bg-center group-hover:scale-110 dark:opacity-[0.08]"
                                style={{ backgroundImage: `url(${item.image})` }}
                            />

                            {/* Content */}
                            <div className="relative z-10">
                                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 bg-blue-500/15 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400">
                                    <item.icon size={28} strokeWidth={1.5} />
                                </div>
                                <h3 className="font-serif text-xl font-bold mb-2 text-gray-900 dark:text-white">
                                    {item.name}
                                </h3>
                                <p className="font-sans mb-3 text-sm text-gray-600 dark:text-gray-400">
                                    {item.desc}
                                </p>
                                <p className="font-sans text-sm leading-relaxed text-gray-500 dark:text-gray-500">
                                    {item.detail}
                                </p>
                            </div>
                        </SpotlightCard>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default AmenitiesHighlights;
