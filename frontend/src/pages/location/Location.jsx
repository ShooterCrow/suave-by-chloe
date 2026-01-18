import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Navigation, Car, Plane, Copy, Check, ExternalLink } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import SpotlightCard from '../../components/ui/SpotlightCard';
import { useGetSettingsQuery } from '../authenticatedPages/settingsApiSlice';
import Loader from '../../components/ui/Loader';

const Location = () => {
    const [copiedItem, setCopiedItem] = useState(null);

    // Fetch hotel settings from backend
    const {
        data: settings,
        isLoading: isSettingsLoading,
        isError: isSettingsError,
        error: settingsError,
        refetch: refetchSettings
    } = useGetSettingsQuery();

    // Extract hotel info from settings, with fallback to defaults
    const hotelInfo = settings?.hotelInfo || {
        address: "Kubwa, Abuja, Nigeria",
        phone: "+234 800 123 4567",
        email: "reservations@suavebychloe.com",
        hours: "24/7 Front Desk",
        coordinates: { lat: 9.1550, lng: 7.3221 },
        googleEmbedLink: ""
    };

    const transportOptions = [
        {
            icon: Plane,
            title: "From Airport",
            distance: "35 km",
            time: "40 min drive",
            description: "Nnamdi Azikiwe International Airport (ABV)"
        },
        {
            icon: Car,
            title: "By Car",
            distance: "Direct access",
            time: "Secure parking",
            description: "Dedicated guest parking available"
        },
        {
            icon: Navigation,
            title: "Local Access",
            distance: "Central",
            time: "Easy transit",
            description: "Conveniently located near Kubwa Express"
        }
    ];

    const nearbyAttractions = [
        { name: "Zuma Rock", distance: "25 km", time: "30 min drive" },
        { name: "Jabi Lake Mall", distance: "15 km", time: "20 min drive" },
        { name: "Millennium Park", distance: "18 km", time: "25 min drive" },
        { name: "National Children's Park", distance: "20 km", time: "25 min drive" },
        { name: "Aso Rock", distance: "22 km", time: "30 min drive" },
        { name: "Abuja National Mosque", distance: "17 km", time: "20 min drive" }
    ];

    const directions = [
        {
            title: "By Car (From Abuja City Centre)",
            steps: [
                "Head northwest on Ahmadu Bello Way",
                "Continue onto Kubwa Express Road",
                "Take the exit towards Kubwa",
                "Turn right into the main Kubwa residential area",
                "Follow signs to Suave By Chloe"
            ]
        },
        {
            title: "By Taxi",
            steps: [
                "Request a trip to Kubwa",
                "Specify 'Suave By Chloe' as the destination",
                "The hotel is well-known to local drivers",
                "Approximate fare: ₦3,000 - ₦5,000 from Central Area"
            ]
        },
        {
            title: "From Airport",
            steps: [
                "Exit Nnamdi Azikiwe International Airport",
                "Follow the Airport Road towards City Centre",
                "Merge onto the Outer Southern Expressway",
                "Take the junction towards Kubwa Express Road",
                "Follow signs to Suave By Chloe in Kubwa"
            ]
        }
    ];

    const handleCopy = (text, item) => {
        navigator.clipboard.writeText(text);
        setCopiedItem(item);
        setTimeout(() => setCopiedItem(null), 2000);
    };

    // Generate map URL based on available data
    const generateMapUrl = () => {
        // If we have a direct Google embed link from backend, use it
        if (hotelInfo.googleEmbedLink) {
            return hotelInfo.googleEmbedLink;
        }

        // If we have coordinates, generate embed URL
        if (hotelInfo.coordinates?.lat && hotelInfo.coordinates?.lng) {
            return `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3963.952912260219!2d${hotelInfo.coordinates.lng}!3d${hotelInfo.coordinates.lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2z${hotelInfo.coordinates.lat}%2C${hotelInfo.coordinates.lng}!5e0!3m2!1sen!2sng!4v${Date.now()}!5m2!1sen!2sng`;
        }

        // Fallback to static map with Kubwa location
        return "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3963.952912260219!2d7.3221!3d9.1550!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x104dd94dfdfa18b5%3A0x63b8cabfc117c098!2sTK%20Mall%20Kubwa!5e0!3m2!1sen!2sng!4v1768758512469!5m2!1sen!2sng";
    };

    return (
        <div className="min-h-screen pt-28 pb-16 px-4 md:px-8 bg-gray-50 dark:bg-void">
            <Helmet>
                <title>Location & Directions | Suave By Chloe</title>
                <meta
                    name="description"
                    content="Find Suave By Chloe in Abuja. Easy access from the airport and city center. Detailed directions and map available."
                />
                <meta property="og:title" content="Location & Directions | Suave By Chloe" />
                <meta
                    property="og:description"
                    content="Find Suave By Chloe in Abuja. Easy access from the airport and city center. Detailed directions and map available."
                />
                <meta property="og:type" content="website" />
            </Helmet>
            <div className="max-w-7xl mx-auto">

                {/* Header */}
                <div className="mb-12 text-center">
                    <span className="font-mono text-sm text-blue-500 tracking-widest uppercase mb-2 block">
                        04 // FIND US
                    </span>
                    <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
                        Location & Directions
                    </h1>
                    <p className="max-w-2xl mx-auto font-sans text-sm text-gray-700 dark:text-gray-400">
                        We're located in the heart of Kubwa, Abuja, offering a perfect blend of urban convenience and serene comfort.
                    </p>
                </div>

                {/* Map Section */}
                <SpotlightCard className="mb-12 overflow-hidden bg-white dark:bg-gray-800 border-gray-300 dark:border-white/10">
                    <div className="relative w-full h-[400px] md:h-[500px] bg-gray-200 dark:bg-gray-700">
                        {isSettingsLoading ? (
                            <div className="absolute inset-0 flex items-center justify-center">
                                <Loader />
                            </div>
                        ) : isSettingsError ? (
                            <div className="flex items-center justify-center h-full">
                                <div className="text-center p-6">
                                    <p className="text-red-500 mb-2">Failed to load map location</p>
                                    <button
                                        onClick={() => refetchSettings()}
                                        className="text-sm text-blue-500 hover:underline"
                                    >
                                        Try again
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <>
                                <iframe
                                    title="Suave by Chloe Location Map"
                                    src={generateMapUrl()}
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0 }}
                                    allowFullScreen=""
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                    className="absolute inset-0"
                                />
                                <div className="absolute bottom-4 right-4 flex gap-2">
                                    <a
                                        href={`https://www.google.com/maps/dir/?api=1&destination=${hotelInfo.coordinates?.lat || 9.1550},${hotelInfo.coordinates?.lng || 7.3221}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="px-4 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg shadow-lg border border-gray-300 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-sans text-sm font-medium"
                                    >
                                        Get Directions
                                    </a>
                                </div>
                            </>
                        )}
                    </div>
                </SpotlightCard>

                {/* Quick Contact Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
                    {/* Address */}
                    <SpotlightCard className="p-5 bg-white dark:bg-gray-800 border-gray-300 dark:border-white/10 group">
                        <div className="flex items-start gap-3">
                            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
                                <MapPin size={20} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="font-serif font-bold text-sm mb-1 text-gray-900 dark:text-white">
                                    Address
                                </h3>
                                <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                                    {hotelInfo.address}
                                </p>
                                <button
                                    onClick={() => handleCopy(hotelInfo.address, 'address')}
                                    className="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                                >
                                    {copiedItem === 'address' ? (
                                        <>
                                            <Check size={12} />
                                            <span>Copied!</span>
                                        </>
                                    ) : (
                                        <>
                                            <Copy size={12} />
                                            <span>Copy</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </SpotlightCard>

                    {/* Phone */}
                    <SpotlightCard className="p-5 bg-white dark:bg-gray-800 border-gray-300 dark:border-white/10">
                        <div className="flex items-start gap-3">
                            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
                                <Phone size={20} />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-serif font-bold text-sm mb-1 text-gray-900 dark:text-white">
                                    Phone
                                </h3>
                                <a
                                    href={`tel:${hotelInfo.phone}`}
                                    className="text-xs text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors block mb-2"
                                >
                                    {hotelInfo.phone}
                                </a>
                                <button
                                    onClick={() => handleCopy(hotelInfo.phone, 'phone')}
                                    className="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                                >
                                    {copiedItem === 'phone' ? (
                                        <>
                                            <Check size={12} />
                                            <span>Copied!</span>
                                        </>
                                    ) : (
                                        <>
                                            <Copy size={12} />
                                            <span>Copy</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </SpotlightCard>

                    {/* Email */}
                    <SpotlightCard className="p-5 bg-white dark:bg-gray-800 border-gray-300 dark:border-white/10">
                        <div className="flex items-start gap-3">
                            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
                                <Mail size={20} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="font-serif font-bold text-sm mb-1 text-gray-900 dark:text-white">
                                    Email
                                </h3>
                                <a
                                    href={`mailto:${hotelInfo.email}`}
                                    className="text-xs text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors block mb-2 truncate"
                                >
                                    {hotelInfo.email}
                                </a>
                                <button
                                    onClick={() => handleCopy(hotelInfo.email, 'email')}
                                    className="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                                >
                                    {copiedItem === 'email' ? (
                                        <>
                                            <Check size={12} />
                                            <span>Copied!</span>
                                        </>
                                    ) : (
                                        <>
                                            <Copy size={12} />
                                            <span>Copy</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </SpotlightCard>

                    {/* Hours */}
                    <SpotlightCard className="p-5 bg-white dark:bg-gray-800 border-gray-300 dark:border-white/10">
                        <div className="flex items-start gap-3">
                            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
                                <Clock size={20} />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-serif font-bold text-sm mb-1 text-gray-900 dark:text-white">
                                    Hours
                                </h3>
                                <p className="text-xs text-gray-600 dark:text-gray-400">
                                    {hotelInfo.hours}
                                </p>
                                <p className="text-xs text-green-600 dark:text-green-400 mt-2 font-medium">
                                    • Currently Open
                                </p>
                            </div>
                        </div>
                    </SpotlightCard>
                </div>

                {/* Transportation Options */}
                <div className="mb-12">
                    <h2 className="font-serif text-2xl md:text-3xl font-bold mb-6 text-gray-900 dark:text-white">
                        How to Get Here
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {transportOptions.map((option, index) => (
                            <SpotlightCard
                                key={index}
                                className="p-6 bg-white dark:bg-gray-800 border-gray-300 dark:border-white/10"
                            >
                                <div className="p-3 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 w-fit mb-4">
                                    <option.icon size={24} />
                                </div>
                                <h3 className="font-serif text-xl font-bold mb-2 text-gray-900 dark:text-white">
                                    {option.title}
                                </h3>
                                <div className="flex items-center gap-3 mb-3 text-sm">
                                    <span className="text-blue-600 dark:text-blue-400 font-medium">
                                        {option.distance}
                                    </span>
                                    <span className="text-gray-400">•</span>
                                    <span className="text-gray-600 dark:text-gray-400">
                                        {option.time}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {option.description}
                                </p>
                            </SpotlightCard>
                        ))}
                    </div>
                </div>

                {/* Detailed Directions */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                    <div>
                        <h2 className="font-serif text-2xl md:text-3xl font-bold mb-6 text-gray-900 dark:text-white">
                            Detailed Directions
                        </h2>
                        <div className="space-y-6">
                            {directions.map((direction, index) => (
                                <SpotlightCard
                                    key={index}
                                    className="p-6 bg-white dark:bg-gray-800 border-gray-300 dark:border-white/10"
                                >
                                    <h3 className="font-serif text-lg font-bold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
                                        <Navigation size={20} className="text-blue-600 dark:text-blue-400" />
                                        {direction.title}
                                    </h3>
                                    <ol className="space-y-2">
                                        {direction.steps.map((step, stepIndex) => (
                                            <li
                                                key={stepIndex}
                                                className="flex gap-3 text-sm text-gray-600 dark:text-gray-400"
                                            >
                                                <span className="font-mono text-blue-600 dark:text-blue-400 font-medium">
                                                    {stepIndex + 1}.
                                                </span>
                                                <span>{step}</span>
                                            </li>
                                        ))}
                                    </ol>
                                </SpotlightCard>
                            ))}
                        </div>
                    </div>

                    {/* Nearby Attractions */}
                    <div>
                        <h2 className="font-serif text-2xl md:text-3xl font-bold mb-6 text-gray-900 dark:text-white">
                            Nearby Attractions
                        </h2>
                        <SpotlightCard className="p-6 bg-white dark:bg-gray-800 border-gray-300 dark:border-white/10">
                            <div className="space-y-4">
                                {nearbyAttractions.map((attraction, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-white/10 last:border-0 last:pb-0"
                                    >
                                        <div className="flex-1">
                                            <h4 className="font-serif font-bold text-gray-900 dark:text-white mb-1">
                                                {attraction.name}
                                            </h4>
                                            <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                                                <span>{attraction.distance}</span>
                                                <span>•</span>
                                                <span>{attraction.time}</span>
                                            </div>
                                        </div>
                                        <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-blue-600 dark:text-blue-400">
                                            <ExternalLink size={16} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </SpotlightCard>

                        {/* Additional Info */}
                        <SpotlightCard className="p-6 mt-6 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800/30">
                            <h3 className="font-serif text-lg font-bold mb-3 text-gray-900 dark:text-white">
                                Need Help Finding Us?
                            </h3>
                            <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
                                Our concierge team is available 24/7 to provide detailed directions and arrange transportation.
                            </p>
                            <button className="w-full py-2.5 rounded-lg bg-blue-600 text-white font-mono text-xs font-bold tracking-widest hover:bg-blue-700 transition-colors">
                                CONTACT CONCIERGE
                            </button>
                        </SpotlightCard>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Location;