import { Search, Calendar, MapPin, Users, ArrowRight } from 'lucide-react';
import { useState } from 'react';



const Hero = () => {
    const [searchParams, setSearchParams] = useState({
        checkIn: '',
        checkOut: '',
        adults: 1,
        children: 0
    });
    const [showGuestPicker, setShowGuestPicker] = useState(false);

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
                    Conveniently located in Kubwa, Abuja, Suave By Chloe offers <br className='hidden md:block' /> a refined hospitality experience. Book your stay today.
                </p>

                {/* Search Bar Container */}
                <div className="w-full max-w-5xl rounded-3xl p-4 md:p-6 backdrop-blur-xl border shadow-2xl animate-fade-in-up delay-200 bg-white/30 border-white/40 shadow-xl dark:bg-black/50 dark:border-white/10 dark:shadow-blue-900/10">
                    <form onSubmit={handleSearch} className="flex flex-col md:flex-row items-center gap-4">

                        {/* Date Inputs */}
                        <div className="flex w-full md:w-auto gap-3">
                            <div className="relative w-full md:w-48 group">
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors">
                                    <Calendar size={18} />
                                </div>
                                <input
                                    type="text"
                                    onFocus={(e) => e.target.type = 'date'}
                                    onBlur={(e) => e.target.type = 'text'}
                                    placeholder="Check-in"
                                    className="w-full pl-10 pr-3 py-2.5 rounded-xl outline-none transition-all text-sm bg-white border border-gray-200 text-gray-900 placeholder-gray-400 focus:border-blue-400 dark:bg-white/5 dark:border border-white/10 dark:text-white dark:placeholder-gray-500 dark:focus:bg-white/10 dark:focus:border-blue-500/50 [color-scheme:dark]"
                                    value={searchParams.checkIn}
                                    onChange={(e) => setSearchParams({ ...searchParams, checkIn: e.target.value })}
                                />
                            </div>
                            <div className="relative w-full md:w-48 group">
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors">
                                    <Calendar size={18} />
                                </div>
                                <input
                                    type="text"
                                    onFocus={(e) => e.target.type = 'date'}
                                    onBlur={(e) => e.target.type = 'text'}
                                    placeholder="Check-out"
                                    className="w-full pl-10 pr-3 py-2.5 rounded-xl outline-none transition-all text-sm bg-white border border-gray-200 text-gray-900 placeholder-gray-400 focus:border-blue-400 dark:bg-white/5 dark:border border-white/10 dark:text-white dark:placeholder-gray-500 dark:focus:bg-white/10 dark:focus:border-blue-500/50 [color-scheme:dark]"
                                    value={searchParams.checkOut}
                                    onChange={(e) => setSearchParams({ ...searchParams, checkOut: e.target.value })}
                                />
                            </div>
                        </div>

                        {/* Guests Input */}
                        <div className="relative w-full md:w-56 group">
                            <div
                                onClick={() => setShowGuestPicker(!showGuestPicker)}
                                className="w-full pl-10 pr-3 py-2.5 rounded-xl outline-none transition-all text-sm bg-white border border-gray-200 text-gray-900 cursor-pointer flex items-center dark:bg-white/5 dark:border border-white/10 dark:text-white dark:focus:bg-white/10 dark:focus:border-blue-500/50"
                            >
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors">
                                    <Users size={18} />
                                </div>
                                <span>
                                    {searchParams.adults} Adults, {searchParams.children} Children
                                </span>
                            </div>

                            {showGuestPicker && (
                                <div className="absolute top-full left-0 mt-2 w-full p-4 bg-white dark:bg-panel border border-gray-200 dark:border-white/10 rounded-2xl shadow-xl z-50 animate-in fade-in slide-in-from-top-2">
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="font-semibold text-sm dark:text-white">Adults</p>
                                                <p className="text-xs text-gray-500">Ages 13+</p>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <button
                                                    type="button"
                                                    disabled={searchParams.adults <= 1}
                                                    onClick={() => setSearchParams(prev => ({ ...prev, adults: Math.max(1, prev.adults - 1) }))}
                                                    className="w-8 h-8 rounded-full border border-gray-300 dark:border-white/20 flex items-center justify-center text-gray-600 dark:text-white hover:bg-gray-100 dark:hover:bg-white/5 disabled:opacity-50"
                                                >
                                                    -
                                                </button>
                                                <span className="w-4 text-center dark:text-white text-sm">{searchParams.adults}</span>
                                                <button
                                                    type="button"
                                                    onClick={() => setSearchParams(prev => ({ ...prev, adults: prev.adults + 1 }))}
                                                    className="w-8 h-8 rounded-full border border-gray-300 dark:border-white/20 flex items-center justify-center text-gray-600 dark:text-white hover:bg-gray-100 dark:hover:bg-white/5"
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="font-semibold text-sm dark:text-white">Children</p>
                                                <p className="text-xs text-gray-500">Ages 0-12</p>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <button
                                                    type="button"
                                                    disabled={searchParams.children <= 0}
                                                    onClick={() => setSearchParams(prev => ({ ...prev, children: Math.max(0, prev.children - 1) }))}
                                                    className="w-8 h-8 rounded-full border border-gray-300 dark:border-white/20 flex items-center justify-center text-gray-600 dark:text-white hover:bg-gray-100 dark:hover:bg-white/5 disabled:opacity-50"
                                                >
                                                    -
                                                </button>
                                                <span className="w-4 text-center dark:text-white text-sm">{searchParams.children}</span>
                                                <button
                                                    type="button"
                                                    onClick={() => setSearchParams(prev => ({ ...prev, children: prev.children + 1 }))}
                                                    className="w-8 h-8 rounded-full border border-gray-300 dark:border-white/20 flex items-center justify-center text-gray-600 dark:text-white hover:bg-gray-100 dark:hover:bg-white/5"
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setShowGuestPicker(false)}
                                            className="w-full mt-2 py-2 text-blue-500 font-medium text-sm hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-lg transition-colors"
                                        >
                                            Done
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Search Button */}
                        <button
                            type="submit"
                            className="w-full md:w-auto px-10 py-2.5 rounded-xl font-medium shadow-sm hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white transform hover:-translate-y-0.5"
                        >
                            <Search size={18} />
                            <span>Check Availability</span>
                        </button>

                    </form>
                </div>

            </div>
        </div>
    );
};

export default Hero;
