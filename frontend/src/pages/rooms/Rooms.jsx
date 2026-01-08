import React, { useState } from 'react';
import SpotlightCard from '../../components/ui/SpotlightCard';
import { Link } from 'react-router-dom';

import { Star, Check, X, SlidersHorizontal } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

const roomsData = [
    {
        id: 1,
        name: "Deluxe City Suite",
        location: "Main Wing, Floor 12",
        rating: 4.9,
        reviews: 215,
        price: 399000,
        image: "https://images.unsplash.com/photo-1590490360182-c33d57733427?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        amenities: ["City View", "King Bed", "Mini Bar", "Free Wifi"]
    },
    {
        id: 2,
        name: "Executive Penthouse",
        location: "Sky Tower, Floor 45",
        rating: 5.0,
        reviews: 140,
        price: 850000,
        image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        amenities: ["Panoramic View", "Jacuzzi", "Private Butler", "Lounge Access"]
    },
    {
        id: 3,
        name: "Garden Villa",
        location: "North Garden, Ground Floor",
        rating: 4.8,
        reviews: 98,
        price: 520000,
        image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        amenities: ["Private Pool", "Patio", "Garden View", "Kitchenette"]
    },
    {
        id: 4,
        name: "Urban Loft",
        location: "City Wing, Floor 8",
        rating: 4.7,
        reviews: 320,
        price: 299000,
        image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        amenities: ["City View", "Work Desk", "Rain Shower", "Smart TV"]
    },
];

const Rooms = () => {
    const [isFilterOpen, setIsFilterOpen] = useState(false);


    const FilterContent = () => (
        <div className="p-5 rounded-xl border bg-white border-gray-300 shadow-sm dark:bg-dark-900 dark:border-white/10 dark:shadow-none">
            <div className="flex justify-between items-center mb-5 pb-4 border-gray-200 dark:border-white/10">
                <h3 className="font-mono text-sm font-bold uppercase tracking-wider text-gray-900 dark:text-white">
                    Filters
                </h3>
                <button
                    onClick={() => setIsFilterOpen(false)}
                    className="lg:hidden text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                >
                    <X size={20} />
                </button>
            </div>

            {/* Popular Filters */}
            <div className="mb-5">
                <h4 className="font-serif font-bold text-sm mb-3 text-gray-800 dark:text-gray-200">
                    Popular Filters
                </h4>
                <div className="space-y-2">
                    {['Single Bed', 'Double Bed', 'Luxury Room', 'Family Suite'].map(filter => (
                        <label key={filter} className="flex items-center gap-2 cursor-pointer group">
                            <input
                                type="checkbox"
                                className="w-4 h-4 rounded border cursor-pointer appearance-none checked:bg-blue-500 checked:border-blue-500 bg-transparent transition-all duration-200 border-gray-300 dark:border-gray-600"
                            />
                            <span className="font-sans text-sm text-gray-600 group-hover:text-blue-500 dark:text-gray-400 dark:group-hover:text-blue-400 transition-colors">
                                {filter}
                            </span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Price Range */}
            <div className="mb-5">
                <h4 className="font-serif font-bold text-sm mb-3 text-gray-800 dark:text-gray-200">
                    Price Range
                </h4>
                <div className="space-y-2">
                    {['₦0 to ₦500,000', '₦500,000 to ₦1,000,000', '₦1,000,000 to ₦2,000,000', '₦2,000,000+'].map(range => (
                        <label key={range} className="flex items-center gap-2 cursor-pointer group">
                            <input
                                type="checkbox"
                                className="w-4 h-4 rounded border cursor-pointer appearance-none checked:bg-blue-500 checked:border-blue-500 bg-transparent transition-all duration-200 border-gray-300 dark:border-gray-600"
                            />
                            <span className="font-sans text-sm text-gray-600 group-hover:text-blue-500 dark:text-gray-400 dark:group-hover:text-blue-400 transition-colors">
                                {range}
                            </span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Sort By */}
            <div className="mb-5">
                <h4 className="font-serif font-bold text-sm mb-3 text-gray-800 dark:text-gray-200">
                    Sort By
                </h4>
                <div className="space-y-2">
                    {['Price Low to High', 'Price High to Low', 'Newest First'].map(sort => (
                        <label key={sort} className="flex items-center gap-2 cursor-pointer group">
                            <input
                                type="radio"
                                name="sort"
                                className="w-4 h-4 rounded-full border cursor-pointer appearance-none checked:bg-blue-500 checked:border-blue-500 bg-transparent transition-all duration-200 border-gray-300 dark:border-gray-600"
                            />
                            <span className="font-sans text-sm text-gray-600 group-hover:text-blue-500 dark:text-gray-400 dark:group-hover:text-blue-400 transition-colors">
                                {sort}
                            </span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Apply Button - Mobile Only */}
            <button
                onClick={() => setIsFilterOpen(false)}
                className="lg:hidden w-full py-2.5 rounded-lg font-mono text-xs font-bold tracking-widest transition-all bg-blue-600 dark:bg-blue-500 text-white hover:bg-blue-700 dark:hover:bg-blue-600"
            >
                APPLY FILTERS
            </button>
        </div>
    );

    return (
        <div className="min-h-screen pt-28 pb-16 px-4 md:px-8 bg-gray-50 dark:bg-void">
            <Helmet>
                <title>Luxury Rooms & Suites | Suave By Chloe</title>
                <meta
                    name="description"
                    content="Explore our luxurious rooms and suites at Suave By Chloe. From Deluxe City Suites to Executive Penthouses, find your perfect stay in Abuja."
                />
                <meta property="og:title" content="Luxury Rooms & Suites | Suave By Chloe" />
                <meta
                    property="og:description"
                    content="Explore our luxurious rooms and suites at Suave By Chloe. From Deluxe City Suites to Executive Penthouses, find your perfect stay in Abuja."
                />
                <meta property="og:type" content="website" />
            </Helmet>
            <div className="max-w-7xl mx-auto">

                {/* Header */}
                <div className="mb-8">
                    <h1 className="font-serif text-4xl md:text-5xl font-bold mb-3 text-gray-900 dark:text-white">
                        Hotel Rooms
                    </h1>
                    <p className="max-w-2xl font-sans text-sm text-gray-700 dark:text-gray-400">
                        Take advantage of our limited-time offers and special packages to enhance your stay.
                    </p>
                </div>

                {/* Mobile Filter Toggle */}
                <button
                    onClick={() => setIsFilterOpen(true)}
                    className="lg:hidden w-full flex items-center gap-2 mb-6 px-4 py-2 rounded-lg border font-mono text-xs font-bold tracking-wider transition-colors bg-white border-gray-300 text-gray-900 hover:bg-gray-50 shadow-sm dark:bg-void dark:border-white/10 dark:text-white dark:hover:bg-white/5"
                >
                    <SlidersHorizontal size={16} />
                    FILTERS
                </button>

                {/* Mobile Filter Drawer */}
                {isFilterOpen && (
                    <div className="lg:hidden fixed inset-0 z-50" onClick={() => setIsFilterOpen(false)}>
                        {/* Backdrop */}
                        <div className="absolute inset-0 bg-black/40 dark:bg-black/70 backdrop-blur-sm" />

                        {/* Drawer Content */}
                        <div className="absolute inset-x-0 bottom-0">
                            <div
                                className="rounded-t-xl p-4 max-h-[85vh] overflow-y-auto bg-white dark:bg-void"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <FilterContent />
                            </div>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

                    {/* Main Content (Rooms List) */}
                    <div className="lg:col-span-8 space-y-5">
                        {roomsData.map((room) => (
                            <Link
                                to={`${room.id}`}
                                key={room.id}
                                className="flex flex-col md:flex-row gap-0 md:gap-6 overflow-hidden rounded-xl group transition-all duration-300 bg-white border-gray-300 hover:border-gray-400 hover:shadow-lg dark:bg-dark-800 dark:hover:bg-dark-700 dark:border-white/10 dark:hover:border-white/20 dark:hover:shadow-xl dark:hover:shadow-blue-900/5"
                            >
                                {/* Image Section */}
                                <div className="w-full md:w-[45%] h-56 md:h-64 relative shrink-0 overflow-hidden">
                                    <img
                                        src={room.image}
                                        alt={room.name}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    {/* Dark overlay for better text contrast */}
                                    <div className="hidden dark:block absolute inset-0 bg-gradient-to-r from-void/80 via-void/40 to-transparent" />

                                </div>

                                {/* Content Section */}
                                <div className="flex-1 flex flex-col p-5 md:py-6 md:pr-6 md:pl-0">
                                    {/* Location Tag */}
                                    <span className="text-xs font-sans mb-2 text-gray-600 dark:text-gray-400">
                                        {room.location.split(',')[0]}
                                    </span>

                                    {/* Title */}
                                    <h2 className="font-serif text-2xl md:text-3xl font-bold mb-3 text-gray-900 dark:text-white">
                                        {room.name}
                                    </h2>

                                    {/* Rating */}
                                    <div className="flex items-center gap-2 mb-4">
                                        <div className="flex text-yellow-500">
                                            {[...Array(5)].map((_, i) => (
                                                <Star
                                                    key={i}
                                                    size={16}
                                                    fill={i < Math.floor(room.rating) ? "currentColor" : "none"}
                                                />
                                            ))}
                                        </div>
                                        <span className="text-sm font-sans text-gray-600 dark:text-gray-400">
                                            {room.reviews}+ reviews
                                        </span>
                                    </div>

                                    {/* Address */}
                                    <div className="flex items-start gap-2 mb-5">
                                        <svg className="w-4 h-4 mt-0.5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        <span className="text-sm font-sans text-gray-600 dark:text-gray-400">
                                            {room.location}
                                        </span>
                                    </div>

                                    {/* Amenities Icons */}
                                    <div className="flex flex-wrap gap-3 mb-6">
                                        {room.amenities.slice(0, 3).map(item => (
                                            <div
                                                key={item}
                                                className="flex items-center gap-2 text-sm font-sans text-gray-700 dark:text-gray-300"
                                            >
                                                <Check size={16} className="text-blue-600 dark:text-blue-400" />
                                                <span>{item}</span>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Price */}
                                    <div className="mt-auto">
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-2xl font-serif font-bold text-gray-900 dark:text-white">
                                                ₦{room.price.toLocaleString()}
                                            </span>
                                            <span className="text-sm font-sans text-gray-600 dark:text-gray-400">
                                                /night
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>

                    {/* Desktop Sidebar (Filters) */}
                    <div className="hidden lg:block lg:col-span-4">
                        <div className="sticky top-28">
                            <FilterContent />
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Rooms;