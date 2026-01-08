import React, { useState, useEffect } from 'react';
import {
    Calendar,
    Clock,
    Users,
    Home,
    Shield,
    AlertCircle,
    Check,
    X,
    DollarSign,
    Percent,
    Star,
    Phone,
    Wifi,
    Coffee,
    Car,
    Dumbbell,
    Waves,
    Baby,
    PawPrint,
    Wind,
    Tv,
    Bed,
    Bath,
    Lock,
    Eye,
    EyeOff,
    Edit,
    Save,
    Copy,
    Share2,
    Printer,
    Download,
    Link as LinkIcon,
    ChevronRight,
    ChevronLeft,
    FileText,
    Bell,
    Heart,
    Sparkles,
    Award
} from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import Button from '../../components/ui/Button';
import SpotlightCard from '../../components/ui/SpotlightCard';

// Policy Badge Component
const PolicyBadge = ({ type, children }) => {
    const getTypeConfig = (type) => {
        const configs = {
            'cancellation': {
                color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
                icon: <Calendar size={14} />
            },
            'check-in': {
                color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
                icon: <Clock size={14} />
            },
            'house': {
                color: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
                icon: <Home size={14} />
            },
            'children': {
                color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
                icon: <Users size={14} />
            },
            'pets': {
                color: 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-400',
                icon: <PawPrint size={14} />
            },
            'important': {
                color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
                icon: <AlertCircle size={14} />
            }
        };
        return configs[type] || configs.important;
    };

    const config = getTypeConfig(type);

    return (
        <span className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg ${config.color} text-sm font-sans font-medium`}>
            {config.icon}
            {children}
        </span>
    );
};

// Policy Section Component with anchor links
const PolicySection = ({ id, title, description, icon: Icon, badge, children, onCopyLink }) => {
    const scrollToSection = () => {
        const element = document.getElementById(id);
        if (element) {
            const offset = 100; // Account for fixed header
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });

            // Update URL hash without scrolling
            window.history.pushState(null, null, `#${id}`);
        }
    };

    return (
        <div id={id} className="scroll-mt-24">
            <SpotlightCard className="rounded-2xl border bg-white border-gray-200 dark:bg-dark-800 dark:border-white/10 p-6 mb-6">
                <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 flex items-center justify-center">
                            <Icon size={24} className="text-white" />
                        </div>
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <h2 className="font-serif text-2xl font-bold text-gray-900 dark:text-white">
                                    {title}
                                </h2>
                                {badge && <PolicyBadge type={badge.type}>{badge.text}</PolicyBadge>}
                            </div>
                            <p className="text-sm font-sans text-gray-600 dark:text-gray-400">
                                {description}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            onClick={() => onCopyLink(id)}
                            variant="ghost"
                            size="icon"
                            className="text-gray-900 dark:text-white"
                            title="Copy link to this policy"
                        >
                            <LinkIcon size={18} />
                        </Button>
                    </div>
                </div>

                {children}
            </SpotlightCard>
        </div>
    );
};

// Policy Rule Component
const PolicyRule = ({ rule, icon: Icon, highlight = false }) => {
    return (
        <div className={`flex items-start gap-4 p-4 rounded-lg ${highlight ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-500/30' : 'bg-gray-50 dark:bg-white/5'}`}>
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${highlight ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' : 'bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-400'}`}>
                <Icon size={20} />
            </div>
            <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-sans font-medium text-gray-900 dark:text-white">
                        {rule.title}
                    </h4>
                    {rule.badge && (
                        <span className="px-2 py-1 rounded-full text-xs font-mono bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400">
                            {rule.badge}
                        </span>
                    )}
                </div>
                <p className="text-sm font-sans text-gray-600 dark:text-gray-400">
                    {rule.description}
                </p>
                {rule.details && (
                    <div className="mt-2 space-y-2">
                        {rule.details.map((detail, idx) => (
                            <div key={idx} className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                                <span className="text-sm font-sans text-gray-600 dark:text-gray-400">
                                    {detail}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            {rule.fee && (
                <div className="text-right">
                    <p className="text-sm font-sans text-gray-500 dark:text-gray-400">Fee</p>
                    <p className="font-serif font-bold text-red-600 dark:text-red-400">
                        {typeof rule.fee === 'number' ? `$${rule.fee}` : rule.fee}
                    </p>
                </div>
            )}
        </div>
    );
};

// Policy Table Component
const PolicyTable = ({ headers, rows }) => {
    return (
        <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-white/10">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-white/10">
                <thead className="bg-gray-50 dark:bg-white/5">
                    <tr>
                        {headers.map((header, index) => (
                            <th
                                key={index}
                                className="px-6 py-3 text-left text-xs font-sans font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                            >
                                {header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="bg-white dark:bg-dark-800 divide-y divide-gray-200 dark:divide-white/10">
                    {rows.map((row, rowIndex) => (
                        <tr key={rowIndex} className="hover:bg-gray-50 dark:hover:bg-white/5">
                            {row.map((cell, cellIndex) => (
                                <td
                                    key={cellIndex}
                                    className={`px-6 py-4 whitespace-nowrap ${cellIndex === 0 ? 'font-sans font-medium text-gray-900 dark:text-white' : 'text-sm text-gray-600 dark:text-gray-400'}`}
                                >
                                    {cell}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

// Main Policies Component
const Policies = () => {
    const [activeSection, setActiveSection] = useState('cancellation');
    const [copiedLink, setCopiedLink] = useState(null);

    // Handle hash changes on page load and navigation
    useEffect(() => {
        const handleHashChange = () => {
            const hash = window.location.hash.substring(1);
            if (hash && ['cancellation', 'check-in-out', 'house-rules'].includes(hash)) {
                setActiveSection(hash);
                scrollToSection(hash);
            }
        };

        // Initial check
        handleHashChange();

        // Listen for hash changes
        window.addEventListener('hashchange', handleHashChange);
        return () => window.removeEventListener('hashchange', handleHashChange);
    }, []);

    const scrollToSection = (sectionId) => {
        const element = document.getElementById(sectionId);
        if (element) {
            const offset = 100; // Account for fixed header
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    };

    const handleCopyLink = (sectionId) => {
        const url = `${window.location.origin}${window.location.pathname}#${sectionId}`;
        navigator.clipboard.writeText(url);
        setCopiedLink(sectionId);
        setTimeout(() => setCopiedLink(null), 2000);
    };

    const handlePrint = () => {
        window.print();
    };

    const handleDownloadPDF = () => {
        alert('Downloading policies as PDF...');
    };

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: 'Hotel Policies',
                text: 'View our hotel policies and house rules',
                url: window.location.href,
            });
        } else {
            navigator.clipboard.writeText(window.location.href);
            alert('Link copied to clipboard!');
        }
    };

    // Navigation items
    const navItems = [
        { id: 'cancellation-policy', label: 'Cancellation Policy', icon: Calendar },
        { id: 'check-in/out-policy', label: 'Check-in/out Policy', icon: Clock },
        { id: 'house-rules', label: 'House Rules', icon: Home }
    ];

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-void p-4 sm:p-6 lg:p-8">
            <Helmet>
                <title>Policies | Suave By Chloe</title>
                <meta name="description" content="Read our policies regarding cancellation, check-in, and house rules." />
                <meta property="og:title" content="Policies | Suave By Chloe" />
                <meta property="og:description" content="Read our policies regarding cancellation, check-in, and house rules." />
            </Helmet>
            <div className="max-w-5xl mx-auto">
                {/* Page Header */}
                <div className="mb-8">
                    <span className="font-mono text-sm text-blue-500 tracking-widest uppercase mb-2 block">
                        HOTEL_POLICIES
                    </span>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                        <div>
                            <h1 className="font-serif text-3xl font-bold text-gray-900 dark:text-white mb-2">
                                Hotel Policies & Rules
                            </h1>
                            <p className="font-sans text-gray-600 dark:text-gray-400">
                                Important information about our cancellation policy, check-in/out times, and house rules
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <Button
                                onClick={handleShare}
                                variant="secondary"
                                className="flex items-center gap-2"
                            >
                                <Share2 size={18} />
                                Share
                            </Button>
                            <Button
                                onClick={handlePrint}
                                variant="secondary"
                                className="flex items-center gap-2"
                            >
                                <Printer size={18} />
                                Print
                            </Button>
                            <Button
                                onClick={handleDownloadPDF}
                                className="flex items-center gap-2"
                            >
                                <Download size={18} />
                                PDF
                            </Button>
                        </div>
                    </div>

                    {/* Quick Navigation */}
                    <div className="mb-8">
                        <SpotlightCard className="rounded-2xl border bg-white border-gray-200 dark:bg-dark-800 dark:border-white/10">
                            <div className="p-4">
                                <div className="flex flex-col sm:flex-row gap-2">
                                    {navItems.map((item) => {
                                        const Icon = item.icon;
                                        return (
                                            <Button
                                                key={item.id}
                                                href={`#${item.id}`} // Helper for anchor behavior if button supports it or wrap in a
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    setActiveSection(item.id);
                                                    scrollToSection(item.id);
                                                }}
                                                variant={activeSection === item.id ? 'primary' : 'secondary'}
                                                className={`flex items-center gap-2 py-3 ${activeSection !== item.id ? 'bg-gray-100 dark:bg-white/5 border-transparent' : ''}`}
                                            >
                                                <Icon size={18} />
                                                {item.label}
                                                {copiedLink === item.id && (
                                                    <span className="text-xs bg-green-500 text-white px-2 py-1 rounded-full ml-2">
                                                        Copied!
                                                    </span>
                                                )}
                                            </Button>
                                        );
                                    })}
                                </div>
                            </div>
                        </SpotlightCard>
                    </div>

                    {/* Policy Last Updated */}
                    <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-6">
                        <div className="flex items-center gap-2">
                            <FileText size={14} />
                            <span>Last updated: June 15, 2024</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Bell size={14} />
                            <span>These policies apply to all bookings</span>
                        </div>
                    </div>
                </div>

                {/* Cancellation Policy Section */}
                <PolicySection
                    id="cancellation-policy"
                    title="Cancellation Policy"
                    description="Our cancellation terms and conditions for all bookings"
                    icon={Calendar}
                    badge={{ type: 'cancellation', text: 'Important' }}
                    onCopyLink={handleCopyLink}
                >
                    <div className="space-y-6">
                        {/* Introduction */}
                        <div className="p-4 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-500/30">
                            <div className="flex items-center gap-3 mb-2">
                                <AlertCircle size={20} className="text-blue-600 dark:text-blue-400" />
                                <h3 className="font-serif font-bold text-gray-900 dark:text-white">
                                    Important Notice
                                </h3>
                            </div>
                            <p className="text-sm font-sans text-gray-600 dark:text-gray-400">
                                All cancellations are subject to the terms below. Please review carefully before booking.
                                We recommend purchasing travel insurance for unexpected circumstances.
                            </p>
                        </div>

                        {/* Main Cancellation Rules */}
                        <div className="space-y-4">
                            <PolicyRule
                                rule={{
                                    title: 'Free Cancellation Period',
                                    description: 'Cancel your booking free of charge up to 48 hours before check-in time.',
                                    details: [
                                        'Full refund of deposit and any payments made',
                                        'No cancellation fees applied',
                                        'Refund processed within 5-7 business days'
                                    ]
                                }}
                                icon={Check}
                                highlight={true}
                            />

                            <PolicyRule
                                rule={{
                                    title: 'Late Cancellation (Within 48 hours)',
                                    description: 'Cancellations made less than 48 hours before check-in.',
                                    badge: '50% Fee',
                                    fee: '50% of total',
                                    details: [
                                        '50% of total booking amount charged as cancellation fee',
                                        'Remaining 50% refunded to original payment method',
                                        'Refund processed within 10-14 business days'
                                    ]
                                }}
                                icon={Calendar}
                            />

                            <PolicyRule
                                rule={{
                                    title: 'No-Show / Failure to Arrive',
                                    description: 'Guest does not arrive and does not cancel reservation.',
                                    badge: '100% Fee',
                                    fee: '100% of total',
                                    details: [
                                        'Full booking amount charged',
                                        'No refund provided',
                                        'Room may be released after 24 hours'
                                    ]
                                }}
                                icon={X}
                            />

                            <PolicyRule
                                rule={{
                                    title: 'Early Departure',
                                    description: 'Guest checks out before scheduled departure date.',
                                    badge: '100% Fee',
                                    fee: 'Remaining nights',
                                    details: [
                                        'No refund for unused nights',
                                        'Full charge for all booked nights',
                                        'Exception for medical emergencies with documentation'
                                    ]
                                }}
                                icon={Clock}
                            />
                        </div>

                        {/* Special Circumstances */}
                        <div>
                            <h3 className="font-serif text-lg font-bold text-gray-900 dark:text-white mb-4">
                                Special Circumstances
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="p-4 rounded-lg border border-green-200 dark:border-green-500/30 bg-green-50 dark:bg-green-900/20">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Heart size={16} className="text-green-600 dark:text-green-400" />
                                        <h4 className="font-sans font-medium text-gray-900 dark:text-white">
                                            Force Majeure
                                        </h4>
                                    </div>
                                    <p className="text-sm font-sans text-gray-600 dark:text-gray-400">
                                        In cases of natural disasters, government restrictions, or other extraordinary
                                        circumstances beyond our control, we offer flexible rebooking options or
                                        credit for future stays.
                                    </p>
                                </div>
                                <div className="p-4 rounded-lg border border-amber-200 dark:border-amber-500/30 bg-amber-50 dark:bg-amber-900/20">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Shield size={16} className="text-amber-600 dark:text-amber-400" />
                                        <h4 className="font-sans font-medium text-gray-900 dark:text-white">
                                            Medical Emergencies
                                        </h4>
                                    </div>
                                    <p className="text-sm font-sans text-gray-600 dark:text-gray-400">
                                        With proper medical documentation, we may offer partial refunds or
                                        credit for future stays. Contact our reservations team within 24 hours
                                        of the emergency.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Refund Timeline */}
                        <div>
                            <h3 className="font-serif text-lg font-bold text-gray-900 dark:text-white mb-4">
                                Refund Processing Timeline
                            </h3>
                            <PolicyTable
                                headers={['Refund Type', 'Processing Time', 'Method']}
                                rows={[
                                    ['Free Cancellation', '5-7 business days', 'Original payment method'],
                                    ['Partial Refund', '10-14 business days', 'Original payment method'],
                                    ['Credit for Future Stay', 'Immediate', 'Hotel credit voucher'],
                                    ['Insurance Claims', 'Varies by provider', 'As per insurance policy']
                                ]}
                            />
                        </div>

                        {/* Contact Information */}
                        <div className="p-4 rounded-lg border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5">
                            <div className="flex items-center gap-3 mb-3">
                                <Phone size={20} className="text-blue-600 dark:text-blue-400" />
                                <h4 className="font-serif font-bold text-gray-900 dark:text-white">
                                    Need Help with Cancellation?
                                </h4>
                            </div>
                            <p className="text-sm font-sans text-gray-600 dark:text-gray-400 mb-2">
                                Contact our reservations team for assistance with cancellations or modifications:
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <p className="text-xs font-sans text-gray-500 dark:text-gray-400">Phone</p>
                                    <p className="font-sans font-medium text-gray-900 dark:text-white">+1 (305) 123-4567</p>
                                </div>
                                <div>
                                    <p className="text-xs font-sans text-gray-500 dark:text-gray-400">Email</p>
                                    <p className="font-sans font-medium text-gray-900 dark:text-white">reservations@hotel.com</p>
                                </div>
                                <div>
                                    <p className="text-xs font-sans text-gray-500 dark:text-gray-400">Hours</p>
                                    <p className="font-sans font-medium text-gray-900 dark:text-white">24/7</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </PolicySection>

                {/* Check-in/out Policy Section */}
                <PolicySection
                    id="check-in/out-policy"
                    title="Check-in & Check-out Policy"
                    description="Information about arrival, departure, and timing"
                    icon={Clock}
                    badge={{ type: 'check-in', text: 'Timing' }}
                    onCopyLink={handleCopyLink}
                >
                    <div className="space-y-6">
                        {/* Timing Overview */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div className="p-6 rounded-xl border-2 border-green-200 dark:border-green-500/30 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-12 h-12 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                                        <Clock size={24} className="text-green-600 dark:text-green-400" />
                                    </div>
                                    <div>
                                        <h3 className="font-serif font-bold text-gray-900 dark:text-white">
                                            Standard Check-in
                                        </h3>
                                        <p className="text-sm font-sans text-gray-600 dark:text-gray-400">
                                            From 3:00 PM
                                        </p>
                                    </div>
                                </div>
                                <ul className="space-y-2">
                                    <li className="flex items-center gap-2 text-sm font-sans text-gray-600 dark:text-gray-400">
                                        <Check size={16} className="text-green-500" />
                                        Early check-in available upon request
                                    </li>
                                    <li className="flex items-center gap-2 text-sm font-sans text-gray-600 dark:text-gray-400">
                                        <Check size={16} className="text-green-500" />
                                        Guaranteed room availability from 3 PM
                                    </li>
                                    <li className="flex items-center gap-2 text-sm font-sans text-gray-600 dark:text-gray-400">
                                        <Check size={16} className="text-green-500" />
                                        Express check-in for online pre-registration
                                    </li>
                                </ul>
                            </div>

                            <div className="p-6 rounded-xl border-2 border-blue-200 dark:border-blue-500/30 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                                        <Clock size={24} className="text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <div>
                                        <h3 className="font-serif font-bold text-gray-900 dark:text-white">
                                            Standard Check-out
                                        </h3>
                                        <p className="text-sm font-sans text-gray-600 dark:text-gray-400">
                                            By 11:00 AM
                                        </p>
                                    </div>
                                </div>
                                <ul className="space-y-2">
                                    <li className="flex items-center gap-2 text-sm font-sans text-gray-600 dark:text-gray-400">
                                        <Check size={16} className="text-blue-500" />
                                        Late check-out available upon request
                                    </li>
                                    <li className="flex items-center gap-2 text-sm font-sans text-gray-600 dark:text-gray-400">
                                        <Check size={16} className="text-blue-500" />
                                        Express check-out via mobile app
                                    </li>
                                    <li className="flex items-center gap-2 text-sm font-sans text-gray-600 dark:text-gray-400">
                                        <Check size={16} className="text-blue-500" />
                                        Luggage storage available post check-out
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* Early & Late Options */}
                        <div>
                            <h3 className="font-serif text-lg font-bold text-gray-900 dark:text-white mb-4">
                                Early Check-in & Late Check-out Options
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="p-4 rounded-lg border border-amber-200 dark:border-amber-500/30 bg-amber-50 dark:bg-amber-900/20">
                                    <div className="flex items-center justify-between mb-3">
                                        <h4 className="font-sans font-medium text-gray-900 dark:text-white">
                                            Early Check-in
                                        </h4>
                                        <span className="px-2 py-1 rounded-full text-xs font-mono bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-400">
                                            $25 per hour
                                        </span>
                                    </div>
                                    <p className="text-sm font-sans text-gray-600 dark:text-gray-400 mb-3">
                                        Available from 11:00 AM, subject to room availability.
                                    </p>
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-gray-600 dark:text-gray-400">11:00 AM - 1:00 PM</span>
                                            <span className="font-sans font-medium text-gray-900 dark:text-white">$25/hour</span>
                                        </div>
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-gray-600 dark:text-gray-400">Before 11:00 AM</span>
                                            <span className="font-sans font-medium text-gray-900 dark:text-white">50% of nightly rate</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-4 rounded-lg border border-purple-200 dark:border-purple-500/30 bg-purple-50 dark:bg-purple-900/20">
                                    <div className="flex items-center justify-between mb-3">
                                        <h4 className="font-sans font-medium text-gray-900 dark:text-white">
                                            Late Check-out
                                        </h4>
                                        <span className="px-2 py-1 rounded-full text-xs font-mono bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-400">
                                            $35 per hour
                                        </span>
                                    </div>
                                    <p className="text-sm font-sans text-gray-600 dark:text-gray-400 mb-3">
                                        Available until 3:00 PM, subject to room availability.
                                    </p>
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-gray-600 dark:text-gray-400">11:00 AM - 2:00 PM</span>
                                            <span className="font-sans font-medium text-gray-900 dark:text-white">$35/hour</span>
                                        </div>
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-gray-600 dark:text-gray-400">After 2:00 PM</span>
                                            <span className="font-sans font-medium text-gray-900 dark:text-white">50% of nightly rate</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Age Requirements */}
                        <div>
                            <h3 className="font-serif text-lg font-bold text-gray-900 dark:text-white mb-4">
                                Age & Identification Requirements
                            </h3>
                            <PolicyTable
                                headers={['Requirement', 'Details', 'Documentation Needed']}
                                rows={[
                                    ['Minimum Check-in Age', '21 years', 'Government-issued photo ID'],
                                    ['International Guests', 'Valid passport required', 'Passport & visa (if applicable)'],
                                    ['Credit Card Holder', 'Must match guest name', 'Credit card & matching ID'],
                                    ['Additional Guests', 'Must be registered at check-in', 'IDs for all adults (18+)']
                                ]}
                            />
                        </div>

                        {/* Special Check-in Situations */}
                        <div className="p-4 rounded-lg border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5">
                            <h4 className="font-serif font-bold text-gray-900 dark:text-white mb-3">
                                Special Check-in Situations
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <h5 className="font-sans font-medium text-gray-900 dark:text-white">After-hours Check-in</h5>
                                    <p className="text-sm font-sans text-gray-600 dark:text-gray-400">
                                        Available 24/7. Contact front desk 1 hour before arrival for after-hours instructions.
                                    </p>
                                </div>
                                <div className="space-y-2">
                                    <h5 className="font-sans font-medium text-gray-900 dark:text-white">Group Check-in</h5>
                                    <p className="text-sm font-sans text-gray-600 dark:text-gray-400">
                                        Groups of 5+ rooms: Contact group reservations for streamlined check-in process.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </PolicySection>

                {/* House Rules Section */}
                <PolicySection
                    id="house-rules"
                    title="House Rules & Policies"
                    description="Important rules for a comfortable stay for all guests"
                    icon={Home}
                    badge={{ type: 'house', text: 'Rules' }}
                    onCopyLink={handleCopyLink}
                >
                    <div className="space-y-6">
                        {/* Introduction */}
                        <div className="p-4 rounded-lg bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border border-amber-200 dark:border-amber-500/30">
                            <div className="flex items-center gap-3">
                                <Sparkles size={20} className="text-amber-600 dark:text-amber-400" />
                                <div>
                                    <h3 className="font-serif font-bold text-gray-900 dark:text-white mb-1">
                                        Creating a Perfect Stay for Everyone
                                    </h3>
                                    <p className="text-sm font-sans text-gray-600 dark:text-gray-400">
                                        These rules ensure a safe, comfortable, and enjoyable experience for all guests.
                                        Violation may result in additional charges or termination of stay without refund.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Main Rules Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Smoking Policy */}
                            <div className="p-4 rounded-lg border border-red-200 dark:border-red-500/30 bg-red-50 dark:bg-red-900/20">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-10 h-10 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                                        <X size={20} className="text-red-600 dark:text-red-400" />
                                    </div>
                                    <div>
                                        <h4 className="font-sans font-medium text-gray-900 dark:text-white">
                                            No Smoking Policy
                                        </h4>
                                        <span className="text-xs font-sans text-red-600 dark:text-red-400">
                                            STRICTLY ENFORCED
                                        </span>
                                    </div>
                                </div>
                                <ul className="space-y-2">
                                    <li className="flex items-start gap-2 text-sm font-sans text-gray-600 dark:text-gray-400">
                                        <X size={14} className="text-red-500 mt-0.5 flex-shrink-0" />
                                        Smoking is prohibited in all rooms and indoor areas
                                    </li>
                                    <li className="flex items-start gap-2 text-sm font-sans text-gray-600 dark:text-gray-400">
                                        <AlertCircle size={14} className="text-red-500 mt-0.5 flex-shrink-0" />
                                        Designated smoking areas available in outdoor spaces
                                    </li>
                                    <li className="flex items-start gap-2 text-sm font-sans text-gray-600 dark:text-gray-400">
                                        <DollarSign size={14} className="text-red-500 mt-0.5 flex-shrink-0" />
                                        $250 cleaning fee for smoking violations
                                    </li>
                                </ul>
                            </div>

                            {/* Pet Policy */}
                            <div className="p-4 rounded-lg border border-pink-200 dark:border-pink-500/30 bg-pink-50 dark:bg-pink-900/20">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-10 h-10 rounded-lg bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center">
                                        <PawPrint size={20} className="text-pink-600 dark:text-pink-400" />
                                    </div>
                                    <div>
                                        <h4 className="font-sans font-medium text-gray-900 dark:text-white">
                                            Pet Policy
                                        </h4>
                                        <span className="text-xs font-sans text-pink-600 dark:text-pink-400">
                                            PET-FRIENDLY ROOMS AVAILABLE
                                        </span>
                                    </div>
                                </div>
                                <ul className="space-y-2">
                                    <li className="flex items-start gap-2 text-sm font-sans text-gray-600 dark:text-gray-400">
                                        <Check size={14} className="text-pink-500 mt-0.5 flex-shrink-0" />
                                        Pets allowed in designated pet-friendly rooms only
                                    </li>
                                    <li className="flex items-start gap-2 text-sm font-sans text-gray-600 dark:text-gray-400">
                                        <DollarSign size={14} className="text-pink-500 mt-0.5 flex-shrink-0" />
                                        $50 per night pet fee (maximum 2 pets)
                                    </li>
                                    <li className="flex items-start gap-2 text-sm font-sans text-gray-600 dark:text-gray-400">
                                        <Shield size={14} className="text-pink-500 mt-0.5 flex-shrink-0" />
                                        Pets must be leashed in public areas and not left unattended
                                    </li>
                                </ul>
                            </div>

                            {/* Children Policy */}
                            <div className="p-4 rounded-lg border border-purple-200 dark:border-purple-500/30 bg-purple-50 dark:bg-purple-900/20">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                                        <Baby size={20} className="text-purple-600 dark:text-purple-400" />
                                    </div>
                                    <div>
                                        <h4 className="font-sans font-medium text-gray-900 dark:text-white">
                                            Children Policy
                                        </h4>
                                        <span className="text-xs font-sans text-purple-600 dark:text-purple-400">
                                            FAMILY-FRIENDLY
                                        </span>
                                    </div>
                                </div>
                                <ul className="space-y-2">
                                    <li className="flex items-start gap-2 text-sm font-sans text-gray-600 dark:text-gray-400">
                                        <Check size={14} className="text-purple-500 mt-0.5 flex-shrink-0" />
                                        Children under 12 stay free when using existing bedding
                                    </li>
                                    <li className="flex items-start gap-2 text-sm font-sans text-gray-600 dark:text-gray-400">
                                        <Bed size={14} className="text-purple-500 mt-0.5 flex-shrink-0" />
                                        Rollaway beds: $35/night (subject to availability)
                                    </li>
                                    <li className="flex items-start gap-2 text-sm font-sans text-gray-600 dark:text-gray-400">
                                        <Baby size={14} className="text-purple-500 mt-0.5 flex-shrink-0" />
                                        Cribs available: $15/night (advance request required)
                                    </li>
                                </ul>
                            </div>

                            {/* Noise Policy */}
                            <div className="p-4 rounded-lg border border-blue-200 dark:border-blue-500/30 bg-blue-50 dark:bg-blue-900/20">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                                        <Volume size={20} className="text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <div>
                                        <h4 className="font-sans font-medium text-gray-900 dark:text-white">
                                            Quiet Hours
                                        </h4>
                                        <span className="text-xs font-sans text-blue-600 dark:text-blue-400">
                                            RESPECT FOR ALL GUESTS
                                        </span>
                                    </div>
                                </div>
                                <ul className="space-y-2">
                                    <li className="flex items-start gap-2 text-sm font-sans text-gray-600 dark:text-gray-400">
                                        <Clock size={14} className="text-blue-500 mt-0.5 flex-shrink-0" />
                                        Quiet hours: 10:00 PM to 7:00 AM daily
                                    </li>
                                    <li className="flex items-start gap-2 text-sm font-sans text-gray-600 dark:text-gray-400">
                                        <AlertCircle size={14} className="text-blue-500 mt-0.5 flex-shrink-0" />
                                        Excessive noise may result in warning or eviction
                                    </li>
                                    <li className="flex items-start gap-2 text-sm font-sans text-gray-600 dark:text-gray-400">
                                        <Phone size={14} className="text-blue-500 mt-0.5 flex-shrink-0" />
                                        For noise complaints, contact front desk (ext. 0)
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* Additional Rules */}
                        <div>
                            <h3 className="font-serif text-lg font-bold text-gray-900 dark:text-white mb-4">
                                Additional Rules & Information
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                <div className="p-4 rounded-lg border border-gray-200 dark:border-white/10">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Wifi size={16} className="text-gray-600 dark:text-gray-400" />
                                        <h5 className="font-sans font-medium text-gray-900 dark:text-white">Wi-Fi Usage</h5>
                                    </div>
                                    <p className="text-sm font-sans text-gray-600 dark:text-gray-400">
                                        Free high-speed Wi-Fi throughout. No illegal downloading or excessive bandwidth usage.
                                    </p>
                                </div>
                                <div className="p-4 rounded-lg border border-gray-200 dark:border-white/10">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Car size={16} className="text-gray-600 dark:text-gray-400" />
                                        <h5 className="font-sans font-medium text-gray-900 dark:text-white">Parking</h5>
                                    </div>
                                    <p className="text-sm font-sans text-gray-600 dark:text-gray-400">
                                        Valet parking: $45/night. Self-parking: $35/night. Limited spaces available.
                                    </p>
                                </div>
                                <div className="p-4 rounded-lg border border-gray-200 dark:border-white/10">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Dumbbell size={16} className="text-gray-600 dark:text-gray-400" />
                                        <h5 className="font-sans font-medium text-gray-900 dark:text-white">Fitness Center</h5>
                                    </div>
                                    <p className="text-sm font-sans text-gray-600 dark:text-gray-400">
                                        Open 5:00 AM - 10:00 PM. Proper athletic attire required. No children under 16.
                                    </p>
                                </div>
                                <div className="p-4 rounded-lg border border-gray-200 dark:border-white/10">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Waves size={16} className="text-gray-600 dark:text-gray-400" />
                                        <h5 className="font-sans font-medium text-gray-900 dark:text-white">Pool Rules</h5>
                                    </div>
                                    <p className="text-sm font-sans text-gray-600 dark:text-gray-400">
                                        Pool hours: 7:00 AM - 9:00 PM. No glass containers. Children must be supervised.
                                    </p>
                                </div>
                                <div className="p-4 rounded-lg border border-gray-200 dark:border-white/10">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Coffee size={16} className="text-gray-600 dark:text-gray-400" />
                                        <h5 className="font-sans font-medium text-gray-900 dark:text-white">Room Service</h5>
                                    </div>
                                    <p className="text-sm font-sans text-gray-600 dark:text-gray-400">
                                        24/7 room service available. 18% service charge and delivery fee apply.
                                    </p>
                                </div>
                                <div className="p-4 rounded-lg border border-gray-200 dark:border-white/10">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Lock size={16} className="text-gray-600 dark:text-gray-400" />
                                        <h5 className="font-sans font-medium text-gray-900 dark:text-white">Security</h5>
                                    </div>
                                    <p className="text-sm font-sans text-gray-600 dark:text-gray-400">
                                        Use safe for valuables. Hotel not responsible for lost or stolen items.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Damage & Liability */}
                        <div className="p-4 rounded-lg border border-red-200 dark:border-red-500/30 bg-red-50 dark:bg-red-900/20">
                            <div className="flex items-center gap-3 mb-3">
                                <AlertCircle size={20} className="text-red-600 dark:text-red-400" />
                                <h4 className="font-serif font-bold text-gray-900 dark:text-white">
                                    Damage & Liability
                                </h4>
                            </div>
                            <div className="space-y-3">
                                <p className="text-sm font-sans text-gray-600 dark:text-gray-400">
                                    Guests are responsible for any damage to hotel property. The credit card on file
                                    will be charged for:
                                </p>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <p className="text-xs font-sans text-gray-500 dark:text-gray-400 mb-1">Minor Damage</p>
                                        <p className="font-sans font-medium text-gray-900 dark:text-white">$100 - $500</p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-sans text-gray-500 dark:text-gray-400 mb-1">Major Damage</p>
                                        <p className="font-sans font-medium text-gray-900 dark:text-white">$500 - $2,500</p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-sans text-gray-500 dark:text-gray-400 mb-1">Smoking Violation</p>
                                        <p className="font-sans font-medium text-gray-900 dark:text-white">$250 flat fee</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </PolicySection>

                {/* Footer Navigation */}
                <div className="flex justify-between items-center mt-12 pt-8 border-t border-gray-200 dark:border-white/10">
                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                        <FileText size={14} />
                        <span>Need help? Contact our guest services team.</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <a
                            href="#cancellation"
                            onClick={(e) => {
                                e.preventDefault();
                                setActiveSection('cancellation');
                                scrollToSection('cancellation');
                            }}
                            className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                        >
                            <ChevronLeft size={16} />
                            Back to Cancellation Policy
                        </a>
                        <Button
                            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                            variant="secondary"
                        >
                            Back to Top
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Helper component for Volume icon (since it's not in lucide-react)
const Volume = ({ size, className }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
        <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
    </svg>
);

export default Policies;