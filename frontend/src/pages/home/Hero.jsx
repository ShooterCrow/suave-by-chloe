import { Search, Calendar, MapPin, Users, ArrowRight } from 'lucide-react';
import { useState } from 'react';



const Hero = () => {
    const [searchParams, setSearchParams] = useState({
        destination: '',
        checkIn: '',
        checkOut: '',
        guests: 1
    });

    const handleSearch = (e) => {
        e.preventDefault();
        console.log('Searching for:', searchParams);
        // Add search logic here
    };

    return (
        <div className="relative h-screen min-h-[800px] w-full overflow-hidden">
            {/* Background Image with Overlay */}
            <div className="absolute inset-0">
                <img
                    src="https://hb-gs.vercel.app/assets/heroImage-C_C6vYe5.png"
                    alt="Luxury Hotel"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-gray-50 dark:from-black/70 dark:via-black/40 dark:to-black" />
            </div>

            {/* Content Container */}
            <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center pt-10">

                {/* Eyebrow Text */}
                <div className="animate-fade-in-down">
                    <span className="inline-block py-0.5 font-sans text-sm px-6 rounded-full font-semibold tracking-wider backdrop-blur-md border bg-white/20 border-white/30 text-white dark:bg-white/10 dark:border-white/20 dark:text-blue-300">
                        The Ultimate Hotel Experience
                    </span>
                </div>

                {/* Main Headline */}
                <h1 className="font-serif mt-6 text-4xl md:text-6xl font-bold tracking-tight text-white mb-6 animate-fade-in-up">
                    Discover Your Perfect <br />
                    <span className="text-blue-400">
                        Gateway Destination
                    </span>
                </h1>

                {/* Subtext */}
                <p className="text-md md:text-lg text-gray-200 mb-5 animate-fade-in-up delay-100">
                    Conveniently located in Kubwa, Abuja, Suave By Chloe offers <br /> a refined hospitality experience with stylish rooms, fine dining, <br /> modern event spaces, and exceptional comfort in Nigeria’s capital city.
                </p>

                {/* Search Bar Container */}
                <div className="w-full max-w-5xl rounded-3xl p-4 md:p-6 backdrop-blur-xl border shadow-2xl animate-fade-in-up delay-200 bg-white/30 border-white/40 shadow-xl dark:bg-black/50 dark:border-white/10 dark:shadow-blue-900/10">
                    <form onSubmit={handleSearch} className="flex flex-col md:flex-row items-center gap-4">

                        {/* Destination Input */}
                        <div className="relative w-full md:flex-1 group">
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors">
                                <MapPin size={18} />
                            </div>
                            <input
                                type="text"
                                placeholder="Where are you going?"
                                className="w-full pl-10 pr-3 py-2.5 rounded-lg outline-none transition-all text-sm bg-white border border-gray-200 text-gray-900 placeholder-gray-400 focus:border-blue-400 dark:bg-white/5 dark:border border-white/10 dark:text-white dark:placeholder-gray-500 dark:focus:bg-white/10 dark:focus:border-blue-500/50"
                                value={searchParams.destination}
                                onChange={(e) => setSearchParams({ ...searchParams, destination: e.target.value })}
                            />
                        </div>

                        {/* Date Inputs */}
                        <div className="flex w-full md:w-auto gap-3">
                            <div className="relative w-full md:w-40 group">
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors">
                                    <Calendar size={18} />
                                </div>
                                <input
                                    type="text"
                                    onFocus={(e) => e.target.type = 'date'}
                                    onBlur={(e) => e.target.type = 'text'}
                                    placeholder="Check-in"
                                    className="w-full pl-10 pr-3 py-2.5 rounded-lg outline-none transition-all text-sm bg-white border border-gray-200 text-gray-900 placeholder-gray-400 focus:border-blue-400 dark:bg-white/5 dark:border border-white/10 dark:text-white dark:placeholder-gray-500 dark:focus:bg-white/10 dark:focus:border-blue-500/50 [color-scheme:dark]"
                                    value={searchParams.checkIn}
                                    onChange={(e) => setSearchParams({ ...searchParams, checkIn: e.target.value })}
                                />
                            </div>
                            <div className="relative w-full md:w-40 group">
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors">
                                    <Calendar size={18} />
                                </div>
                                <input
                                    type="text"
                                    onFocus={(e) => e.target.type = 'date'}
                                    onBlur={(e) => e.target.type = 'text'}
                                    placeholder="Check-out"
                                    className="w-full pl-10 pr-3 py-2.5 rounded-lg outline-none transition-all text-sm bg-white border border-gray-200 text-gray-900 placeholder-gray-400 focus:border-blue-400 dark:bg-white/5 dark:border border-white/10 dark:text-white dark:placeholder-gray-500 dark:focus:bg-white/10 dark:focus:border-blue-500/50 [color-scheme:dark]"
                                    value={searchParams.checkOut}
                                    onChange={(e) => setSearchParams({ ...searchParams, checkOut: e.target.value })}
                                />
                            </div>
                        </div>

                        {/* Guests Input */}
                        <div className="relative w-full md:w-32 group">
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors">
                                <Users size={18} />
                            </div>
                            <input
                                type="number"
                                min="1"
                                placeholder="Guests"
                                className="w-full pl-10 pr-3 py-2.5 rounded-lg outline-none transition-all text-sm bg-white border border-gray-200 text-gray-900 placeholder-gray-400 focus:border-blue-400 dark:bg-white/5 dark:border border-white/10 dark:text-white dark:placeholder-gray-500 dark:focus:bg-white/10 dark:focus:border-blue-500/50"
                                value={searchParams.guests}
                                onChange={(e) => setSearchParams({ ...searchParams, guests: e.target.value })}
                            />
                        </div>

                        {/* Search Button */}
                        <button
                            type="submit"
                            className="w-full md:w-auto px-6 py-2.5 rounded-lg font-medium shadow-sm hover:shadow transition-all duration-200 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
                        >
                            <Search size={18} />
                            <span className="md:hidden">Search</span>
                        </button>

                    </form>
                </div>

            </div>
        </div>
    );
};

export default Hero;
