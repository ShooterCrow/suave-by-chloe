import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';


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
                    ? `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, 
                        var(--spotlight-color), 
                        transparent 40%)`
                    : 'transparent',
            }}
        >
            {children}
        </div>
    );
};

const rooms = [
    {
        id: 1,
        name: "City View Deluxe",
        price: "₦450,000",
        image: "https://images.unsplash.com/photo-1590490360182-c33d57733427?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        features: ["King Size Bed", "City Balcony", "Smart Room Control"]
    },
    {
        id: 2,
        name: "Executive Suite",
        price: "₦750,000",
        image: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        features: ["Separate Living Area", "Executive Lounge Access", "Jacuzzi"]
    },
    {
        id: 3,
        name: "Presidential Villa",
        price: "₦2,500,000",
        image: "https://images.unsplash.com/photo-1590490360182-c33d57733427?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        features: ["Private Pool", "Butler Service", "3 Bedrooms"]
    }
];

const RoomHighlights = () => {
    return (
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-100 dark:bg-void transition-colors duration-300">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between mb-12">
                    <div>
                        <span className="font-mono text-sm text-blue-500 tracking-widest uppercase mb-2 block">
                            01 // YOUR SANCTUARY
                        </span>
                        <h2 className="font-serif text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white transition-colors duration-300">
                            Top Rated Rooms
                        </h2>
                    </div>
                    <button className="hidden md:flex items-center gap-2 font-mono font-medium transition-colors text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300">
                        VIEW_ALL <ArrowRight size={20} />
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {rooms.map((room) => (
                        <Link
                            to={`/rooms/${room.id}`}
                            key={room.id}>
                            <SpotlightCard
                                className="h-[500px] group cursor-pointer border-gray-200 bg-white dark:border-white/10 dark:bg-void transition-colors duration-300"
                            >
                                {/* Image Background */}
                                <img
                                    src={room.image}
                                    alt={room.name}
                                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />

                                {/* Bottom 40% Gradient Overlay */}
                                <div
                                    className="absolute inset-0 transition-opacity duration-300 
                                    bg-gradient-to-t from-white via-white/85 to-transparent group-hover:from-white group-hover:via-white/95 
                                    dark:from-void dark:via-void/80 dark:to-transparent dark:group-hover:from-void dark:group-hover:via-void/90"
                                    style={{
                                        maskImage: 'linear-gradient(to top, black 0%, black 40%, transparent 100%)',
                                        WebkitMaskImage: 'linear-gradient(to top, black 0%, black 40%, transparent 100%)'
                                    }}
                                />

                                {/* Content */}
                                <div className="absolute bottom-0 left-0 w-full p-8 transition-transform duration-300">
                                    <h3 className="font-serif text-2xl mb-2 drop-shadow-lg text-gray-900 dark:text-white transition-colors duration-300">
                                        {room.name}
                                    </h3>
                                    <div className="flex items-center gap-2 mb-4">
                                        <span className="font-mono text-xl text-blue-600 dark:text-blue-400 drop-shadow-lg">
                                            {room.price}
                                        </span>
                                        <span className="text-sm font-sans drop-shadow-lg text-gray-700 dark:text-gray-300 transition-colors duration-300">
                                            / night
                                        </span>
                                    </div>

                                    <div className="space-y-2 mb-6">
                                        {room.features.map((feature, i) => (
                                            <div key={i} className="flex items-center gap-2 text-sm text-gray-800 dark:text-gray-200 transition-colors duration-300">
                                                <div className="w-1.5 h-1.5 rounded-full bg-blue-600 shadow-blue-600/50 shadow-lg dark:bg-blue-400 dark:shadow-blue-400/50" />
                                                <span className="font-sans drop-shadow-lg">{feature}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="w-full flex justify-center items-center gap-2 px-6 py-3 rounded-lg font-mono text-sm font-bold transition-all duration-300 bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/40 active:scale-95">
                                        BOOK NOW <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </div>
                            </SpotlightCard>
                        </Link>
                    ))}
                </div>

                {/* Mobile View All Button */}
                <div className="mt-12 md:hidden flex justify-center">
                    <button className="flex items-center gap-2 px-6 py-3 rounded-lg font-mono text-sm font-semibold transition-colors bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-200 dark:bg-white/10 dark:text-white dark:hover:bg-white/20 dark:border-white/20">
                        VIEW ALL ROOMS <ArrowRight size={16} />
                    </button>
                </div>
            </div>
        </section>
    );
};

export default RoomHighlights;
