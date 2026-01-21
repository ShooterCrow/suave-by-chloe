import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, Clock, MessageSquare, User, CheckCircle } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { useGetSettingsQuery } from '../authenticatedPages/settingsApiSlice';
import Loader from '../../components/ui/Loader';

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
            className={`relative overflow-hidden ${className}`}
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

const contactInfo = [
    {
        icon: Phone,
        title: "Call Us",
        details: "+234 800 123 4567",
        subtext: "Mon-Fri 9AM-6PM WAT",
        color: "blue"
    },
    {
        icon: Mail,
        title: "Email Us",
        details: "info@suavebychloe.com",
        subtext: "We'll respond within 24h",
        color: "purple"
    },
    {
        icon: MapPin,
        title: "Visit Us",
        details: "Kubwa, Abuja",
        subtext: "Nigeria",
        color: "green"
    },
    {
        icon: Clock,
        title: "Business Hours",
        details: "24/7 Concierge Service",
        subtext: "Always here for you",
        color: "orange"
    }
];


const ContactUs = () => {
    // Fetch hotel settings
    const {
        data: settings,
        isLoading: isSettingsLoading,
        isError: isSettingsError,
        refetch: refetchSettings
    } = useGetSettingsQuery();

    // Extract hotel info with fallbacks
    const hotelInfo = settings?.hotelInfo || {
        address: "Kubwa, Abuja, Nigeria",
        phone: "+234 800 123 4567",
        email: "reservations@suavebychloe.com",
        hours: "24/7 Front Desk",
        coordinates: { lat: 9.1550, lng: 7.3221 },
        googleEmbedLink: ""
    };

    // Generate map URL
    const generateMapUrl = () => {
        if (hotelInfo.googleEmbedLink) {
            return hotelInfo.googleEmbedLink;
        }
        if (hotelInfo.coordinates?.lat && hotelInfo.coordinates?.lng) {
            return `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3963.952912260219!2d${hotelInfo.coordinates.lng}!3d${hotelInfo.coordinates.lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2z${hotelInfo.coordinates.lat}%2C${hotelInfo.coordinates.lng}!5e0!3m2!1sen!2sng!4v${Date.now()}!5m2!1sen!2sng`;
        }
        return "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3963.952912260219!2d7.3221!3d9.1550!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x104dd94dfdfa18b5%3A0x63b8cabfc117c098!2sTK%20Mall%20Kubwa!5e0!3m2!1sen!2sng!4v1768758512469!5m2!1sen!2sng";
    };

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
    });
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = () => {
        console.log('Form submitted:', formData);
        setIsSubmitted(true);
        setTimeout(() => {
            setIsSubmitted(false);
            setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
        }, 3000);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="min-h-screen pb-16 bg-gray-50 dark:bg-void transition-colors duration-300">
            <Helmet>
                <title>Contact Us | Suave By Chloe</title>
                <meta
                    name="description"
                    content="Contact Suave By Chloe in Abuja. Get in touch for reservations, events, and inquiries. We are here to make your stay unforgettable."
                />
                <meta property="og:title" content="Contact Us | Suave By Chloe" />
                <meta
                    property="og:description"
                    content="Contact Suave By Chloe in Abuja. Get in touch for reservations, events, and inquiries. We are here to make your stay unforgettable."
                />
                <meta property="og:type" content="website" />
            </Helmet>
            {/* Hero Section */}
            <div className="relative h-[430px] overflow-hidden">
                <img
                    src="https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
                    alt="Contact Us"
                    className="w-full h-full object-cover "
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-gray-50 dark:to-void" />
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                        <span className="font-mono text-sm text-blue-400 tracking-widest uppercase mb-4 block">
                            06 // GET IN TOUCH
                        </span>
                        <h1 className="font-serif text-5xl md:text-6xl font-bold text-white mb-4">
                            Contact Us
                        </h1>
                        <p className="text-lg text-gray-200 max-w-2xl mx-auto px-4">
                            We're here to help make your stay unforgettable. Reach out anytime.
                        </p>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20">
                {/* Contact Info Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                    {contactInfo.map((info, idx) => (
                        <SpotlightCard
                            key={idx}
                            className="p-6 rounded-2xl border group cursor-pointer bg-white border-gray-200 dark:bg-dark-800 dark:border-white/10"
                        >
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110 bg-${info.color}-500/15 text-${info.color}-600 dark:bg-${info.color}-500/20 dark:text-${info.color}-400`}>
                                <info.icon size={24} strokeWidth={1.5} />
                            </div>
                            <h3 className="font-serif text-lg font-bold mb-2 text-gray-900 dark:text-white">
                                {info.title}
                            </h3>
                            <p className="font-sans text-sm font-semibold mb-1 text-gray-700 dark:text-gray-300">
                                {info.details}
                            </p>
                            <p className="font-sans text-xs text-gray-500 dark:text-gray-500">
                                {info.subtext}
                            </p>
                        </SpotlightCard>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                    {/* Contact Form */}
                    <div className="lg:col-span-3">
                        <SpotlightCard className="p-8 md:p-10 rounded-2xl border bg-white border-gray-200 dark:bg-dark-800 dark:border-white/10">
                            <div className="mb-8">
                                <span className="font-mono text-sm text-blue-500 tracking-widest uppercase mb-2 block">
                                    SEND_MESSAGE
                                </span>
                                <h2 className="font-serif text-3xl font-bold text-gray-900 dark:text-white">
                                    Drop Us a Line
                                </h2>
                            </div>

                            {isSubmitted ? (
                                <div className="py-16 text-center">
                                    <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center bg-green-500/15 text-green-600 dark:bg-green-500/20 dark:text-green-400">
                                        <CheckCircle size={32} />
                                    </div>
                                    <h3 className="font-serif text-2xl font-bold mb-2 text-gray-900 dark:text-white">
                                        Message Sent!
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-400">
                                        We'll get back to you within 24 hours.
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block font-sans text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                                                Full Name
                                            </label>
                                            <div className="relative">
                                                <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                                <input
                                                    type="text"
                                                    name="name"
                                                    placeholder="John Doe"
                                                    className="w-full pl-10 pr-3 py-3 rounded-lg border outline-none transition-all text-sm bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-blue-400 dark:bg-white/5 dark:border-white/10 dark:text-white dark:placeholder-gray-500 dark:focus:bg-white/10 dark:focus:border-blue-500/50"
                                                    value={formData.name}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block font-sans text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                                                Email Address
                                            </label>
                                            <div className="relative">
                                                <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                                <input
                                                    type="email"
                                                    name="email"
                                                    placeholder="john@example.com"
                                                    className="w-full pl-10 pr-3 py-3 rounded-lg border outline-none transition-all text-sm bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-blue-400 dark:bg-white/5 dark:border-white/10 dark:text-white dark:placeholder-gray-500 dark:focus:bg-white/10 dark:focus:border-blue-500/50"
                                                    value={formData.email}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block font-sans text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                                                Phone Number
                                            </label>
                                            <div className="relative">
                                                <Phone size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                                <input
                                                    type="tel"
                                                    name="phone"
                                                    placeholder="+234 800 123 4567"
                                                    className="w-full pl-10 pr-3 py-3 rounded-lg border outline-none transition-all text-sm bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-blue-400 dark:bg-white/5 dark:border-white/10 dark:text-white dark:placeholder-gray-500 dark:focus:bg-white/10 dark:focus:border-blue-500/50"
                                                    value={formData.phone}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block font-sans text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                                                Subject
                                            </label>
                                            <div className="relative">
                                                <MessageSquare size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                                <input
                                                    type="text"
                                                    name="subject"
                                                    placeholder="Booking Inquiry"
                                                    className="w-full pl-10 pr-3 py-3 rounded-lg border outline-none transition-all text-sm bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-blue-400 dark:bg-white/5 dark:border-white/10 dark:text-white dark:placeholder-gray-500 dark:focus:bg-white/10 dark:focus:border-blue-500/50"
                                                    value={formData.subject}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block font-sans text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                                            Message
                                        </label>
                                        <textarea
                                            name="message"
                                            rows="6"
                                            placeholder="Tell us how we can help you..."
                                            className="w-full px-3 py-3 rounded-lg border outline-none transition-all text-sm resize-none bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-blue-400 dark:bg-white/5 dark:border-white/10 dark:text-white dark:placeholder-gray-500 dark:focus:bg-white/10 dark:focus:border-blue-500/50"
                                            value={formData.message}
                                            onChange={handleChange}
                                        />
                                    </div>

                                    <button
                                        onClick={handleSubmit}
                                        className="w-full py-3.5 rounded-lg font-mono text-sm font-bold tracking-widest transition-all flex items-center justify-center gap-2 bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                                    >
                                        SEND_MESSAGE <Send size={18} />
                                    </button>
                                </div>
                            )}
                        </SpotlightCard>
                    </div>

                    {/* Map & Additional Info */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Map */}
                        <SpotlightCard className="h-[300px] rounded-2xl border overflow-hidden bg-white border-gray-200 dark:bg-dark-800 dark:border-white/10 relative">
                            {isSettingsLoading ? (
                                <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800">
                                    <Loader />
                                </div>
                            ) : isSettingsError ? (
                                <div className="flex items-center justify-center h-full text-center p-4">
                                    <div>
                                        <p className="text-red-500 mb-2">Failed to load map</p>
                                        <button onClick={() => refetchSettings()} className="text-blue-500 hover:underline text-sm">Retry</button>
                                    </div>
                                </div>
                            ) : (
                                <iframe
                                    src={generateMapUrl()}
                                    className="w-full h-full"
                                    style={{ border: 0 }}
                                    allowFullScreen=""
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                />
                            )}
                        </SpotlightCard>

                        {/* FAQ Card */}
                        <SpotlightCard className="p-6 rounded-2xl border bg-white border-gray-200 dark:bg-dark-800 dark:border-white/10">
                            <h3 className="font-serif text-xl font-bold mb-4 text-gray-900 dark:text-white">
                                Quick Answers
                            </h3>
                            <div className="space-y-4">
                                <div>
                                    <p className="font-sans text-sm font-semibold mb-1 text-gray-900 dark:text-white">
                                        What's your cancellation policy?
                                    </p>
                                    <p className="font-sans text-xs text-gray-600 dark:text-gray-400">
                                        Free cancellation up to 48 hours before check-in.
                                    </p>
                                </div>
                                <div>
                                    <p className="font-sans text-sm font-semibold mb-1 text-gray-900 dark:text-white">
                                        Do you offer airport transfers?
                                    </p>
                                    <p className="font-sans text-xs text-gray-600 dark:text-gray-400">
                                        Yes, complimentary for suite bookings, ₦15,000 for standard rooms.
                                    </p>
                                </div>
                                <div>
                                    <p className="font-sans text-sm font-semibold mb-1 text-gray-900 dark:text-white">
                                        Are pets allowed?
                                    </p>
                                    <p className="font-sans text-xs text-gray-600 dark:text-gray-400">
                                        Yes, small pets welcome with ₦25,000 cleaning fee.
                                    </p>
                                </div>
                            </div>
                        </SpotlightCard>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactUs;