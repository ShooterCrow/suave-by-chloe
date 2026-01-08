import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import {
    Search,
    Filter,
    User,
    Mail,
    Phone,
    Calendar,
    MapPin,
    Flag,
    Edit,
    Trash2,
    Eye,
    Clock,
    Star,
    TrendingUp,
    DollarSign,
    Home,
    Users,
    ChevronRight,
    MoreVertical,
    Download,
    Plus,
    Check,
    X,
    AlertCircle,
    MessageSquare,
    CreditCard,
    Shield,
    Award,
    Gift,
    Tag,
    Clock as ClockIcon,
    Calendar as CalendarIcon,
    Heart,
    Coffee,
    Wifi,
    Car,
    Dumbbell,
    Award as AwardIcon,
    Crown,
    Upload // Auto-imported if needed, or I should check if Upload is in imports above. It was used in line 1074.
} from 'lucide-react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Badge from '../../../components/ui/Badge';
import SpotlightCard from '../../../components/ui/SpotlightCard';

// SpotlightCard Component


// Status Badge Component
// Status Badge Component
const StatusBadge = ({ status }) => {
    const getStatusConfig = (status) => {
        const configs = {
            'active': { variant: 'success', icon: <Check size={12} /> },
            'inactive': { variant: 'secondary', icon: <Clock size={12} /> },
            'vip': { variant: 'purple', icon: <Crown size={12} /> },
            'blacklisted': { variant: 'destructive', icon: <X size={12} /> },
            'loyal': { variant: 'blue', icon: <Award size={12} /> }
        };
        return configs[status] || configs.inactive;
    };

    const config = getStatusConfig(status);

    return (
        <Badge variant={config.variant} className="gap-1">
            {config.icon}
            {status.charAt(0).toUpperCase() + status.slice(1)}
        </Badge>
    );
};

// Tier Badge Component
// Tier Badge Component
const TierBadge = ({ tier }) => {
    const getTierConfig = (tier) => {
        const configs = {
            'bronze': { variant: 'warning', icon: <Award size={12} /> }, // Bronze -> Warning/Amber
            'silver': { variant: 'secondary', icon: <Award size={12} /> }, // Silver -> Secondary/Gray
            'gold': { variant: 'warning', icon: <Award size={12} /> }, // Gold -> Warning/Amber
            'platinum': { variant: 'blue', icon: <Crown size={12} /> }, // Platinum -> Blue
            'diamond': { variant: 'purple', icon: <Crown size={12} /> } // Diamond -> Purple (Indigo)
        };
        return configs[tier] || configs.bronze;
    };

    const config = getTierConfig(tier);

    return (
        <Badge variant={config.variant} className="gap-1">
            {config.icon}
            {tier.charAt(0).toUpperCase() + tier.slice(1)}
        </Badge>
    );
};

// Guest Card Component
const GuestCard = ({ guest, onView, onEdit, onDelete }) => {
    const getInitials = (name) => {
        return name.split(' ').map(n => n[0]).join('').toUpperCase();
    };

    return (
        <SpotlightCard className="rounded-2xl border bg-white border-gray-200 dark:bg-dark-800 dark:border-white/10 p-4 hover:border-blue-300 dark:hover:border-blue-500/50 transition-colors">
            <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <div className={`w-14 h-14 rounded-full flex items-center justify-center text-lg font-bold ${guest.status === 'vip'
                            ? 'bg-gradient-to-br from-purple-500 to-pink-500 text-white'
                            : 'bg-blue-600 text-white'
                            }`}>
                            {getInitials(guest.name)}
                        </div>
                        {guest.status === 'vip' && (
                            <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-yellow-500 flex items-center justify-center">
                                <Crown size={12} className="text-white" />
                            </div>
                        )}
                    </div>
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-serif text-lg font-bold text-gray-900 dark:text-white">
                                {guest.name}
                            </h4>
                            <StatusBadge status={guest.status} />
                        </div>
                        <div className="flex items-center gap-2">
                            <TierBadge tier={guest.tier} />
                            <span className="text-sm font-sans text-gray-600 dark:text-gray-400">
                                Member since {guest.memberSince}
                            </span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-1">
                    <Button
                        onClick={() => onView(guest)}
                        variant="ghost"
                        size="icon"
                        className="text-gray-900 dark:text-white"
                    >
                        <Eye size={16} />
                    </Button>
                    <Button
                        onClick={() => onEdit(guest)}
                        variant="ghost"
                        size="icon"
                        className="text-gray-900 dark:text-white"
                    >
                        <Edit size={16} />
                    </Button>
                </div>
            </div>

            {/* Contact Info */}
            <div className="space-y-2 mb-3">
                <div className="flex items-center gap-2">
                    <Mail size={14} className="text-gray-400" />
                    <span className="text-sm font-sans text-gray-600 dark:text-gray-400">
                        {guest.email}
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <Phone size={14} className="text-gray-400" />
                    <span className="text-sm font-sans text-gray-600 dark:text-gray-400">
                        {guest.phone}
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <MapPin size={14} className="text-gray-400" />
                    <span className="text-sm font-sans text-gray-600 dark:text-gray-400">
                        {guest.country}
                    </span>
                </div>
            </div>

            {/* Guest Stats */}
            <div className="grid grid-cols-3 gap-2 mb-3">
                <div className="text-center p-2 rounded-lg bg-gray-50 dark:bg-white/5">
                    <p className="text-xs font-sans text-gray-500 dark:text-gray-400">Stays</p>
                    <p className="font-serif font-bold text-gray-900 dark:text-white">
                        {guest.totalStays}
                    </p>
                </div>
                <div className="text-center p-2 rounded-lg bg-gray-50 dark:bg-white/5">
                    <p className="text-xs font-sans text-gray-500 dark:text-gray-400">Nights</p>
                    <p className="font-serif font-bold text-gray-900 dark:text-white">
                        {guest.totalNights}
                    </p>
                </div>
                <div className="text-center p-2 rounded-lg bg-gray-50 dark:bg-white/5">
                    <p className="text-xs font-sans text-gray-500 dark:text-gray-400">Revenue</p>
                    <p className="font-serif font-bold text-green-600 dark:text-green-400">
                        ${guest.totalSpent}
                    </p>
                </div>
            </div>

            {/* Preferences */}
            <div className="flex flex-wrap gap-2">
                {guest.preferences.slice(0, 3).map((pref, index) => (
                    <Badge key={index} variant="blue">
                        {pref}
                    </Badge>
                ))}
                {guest.preferences.length > 3 && (
                    <Badge variant="secondary">
                        +{guest.preferences.length - 3}
                    </Badge>
                )}
            </div>
        </SpotlightCard>
    );
};

// Guest Details Modal
const GuestDetailsModal = ({ isOpen, onClose, guest, onAction }) => {
    const [activeTab, setActiveTab] = useState('profile');

    if (!isOpen || !guest) return null;

    const tabs = [
        { id: 'profile', label: 'Profile' },
        { id: 'stays', label: 'Stay History' },
        { id: 'preferences', label: 'Preferences' },
        { id: 'notes', label: 'Notes' },
        { id: 'activity', label: 'Activity' }
    ];

    const staysHistory = [
        {
            id: 1,
            bookingId: 'RES-789012',
            room: 'Deluxe City Suite (101)',
            checkIn: '2024-06-15',
            checkOut: '2024-06-20',
            nights: 5,
            status: 'completed',
            total: 1497,
            rating: 5,
            review: 'Excellent stay! The city view was breathtaking.'
        },
        {
            id: 2,
            bookingId: 'RES-785432',
            room: 'Executive Penthouse (201)',
            checkIn: '2024-03-10',
            checkOut: '2024-03-15',
            nights: 5,
            status: 'completed',
            total: 2125,
            rating: 4,
            review: 'Great service, amazing amenities.'
        },
        {
            id: 3,
            bookingId: 'RES-781234',
            room: 'Standard King (102)',
            checkIn: '2023-12-20',
            checkOut: '2023-12-22',
            nights: 2,
            status: 'completed',
            total: 398,
            rating: 5,
            review: 'Perfect for a weekend getaway.'
        }
    ];

    const calculateStats = () => {
        return {
            avgRating: (staysHistory.reduce((sum, stay) => sum + stay.rating, 0) / staysHistory.length).toFixed(1),
            totalSpent: staysHistory.reduce((sum, stay) => sum + stay.total, 0),
            avgNights: (staysHistory.reduce((sum, stay) => sum + stay.nights, 0) / staysHistory.length).toFixed(1)
        };
    };

    const stats = calculateStats();

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white dark:bg-dark-800 rounded-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
                {/* Header */}
                <div className="p-6 border-b border-gray-200 dark:border-white/10">
                    <div className="flex items-start justify-between">
                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <div className={`w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold ${guest.status === 'vip'
                                    ? 'bg-gradient-to-br from-purple-500 to-pink-500 text-white'
                                    : 'bg-blue-600 text-white'
                                    }`}>
                                    {guest.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                                </div>
                                {guest.status === 'vip' && (
                                    <div className="absolute -top-1 -right-1 w-8 h-8 rounded-full bg-yellow-500 flex items-center justify-center">
                                        <Crown size={16} className="text-white" />
                                    </div>
                                )}
                            </div>
                            <div>
                                <div className="flex items-center gap-3 mb-2">
                                    <h2 className="font-serif text-2xl font-bold text-gray-900 dark:text-white">
                                        {guest.name}
                                    </h2>
                                    <StatusBadge status={guest.status} />
                                    <TierBadge tier={guest.tier} />
                                </div>
                                <p className="text-sm font-sans text-gray-600 dark:text-gray-400">
                                    Guest ID: {guest.id} • Member since {guest.memberSince}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button
                                onClick={() => onAction('message', guest)}
                                className="flex items-center gap-2"
                            >
                                <MessageSquare size={16} />
                                Message
                            </Button>
                            <Button
                                onClick={onClose}
                                variant="ghost"
                                size="icon"
                                className="text-gray-900 dark:text-white"
                            >
                                <X size={24} />
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="border-b border-gray-200 dark:border-white/10">
                    <div className="flex space-x-1 px-6">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`px-4 py-3 text-sm font-sans font-medium transition-colors border-b-2 ${activeTab === tab.id
                                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                                    }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
                    {activeTab === 'profile' && (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Left Column - Basic Info */}
                            <div className="lg:col-span-2">
                                <div className="space-y-6">
                                    {/* Contact Information */}
                                    <div>
                                        <h3 className="font-serif text-lg font-bold text-gray-900 dark:text-white mb-4">
                                            Contact Information
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-3">
                                                <div>
                                                    <p className="text-xs font-sans text-gray-500 dark:text-gray-400">Email</p>
                                                    <p className="font-sans font-medium text-gray-900 dark:text-white">{guest.email}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs font-sans text-gray-500 dark:text-gray-400">Phone</p>
                                                    <p className="font-sans font-medium text-gray-900 dark:text-white">{guest.phone}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs font-sans text-gray-500 dark:text-gray-400">Date of Birth</p>
                                                    <p className="font-sans font-medium text-gray-900 dark:text-white">{guest.dateOfBirth || 'Not provided'}</p>
                                                </div>
                                            </div>
                                            <div className="space-y-3">
                                                <div>
                                                    <p className="text-xs font-sans text-gray-500 dark:text-gray-400">Address</p>
                                                    <p className="font-sans font-medium text-gray-900 dark:text-white">{guest.address || 'Not provided'}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs font-sans text-gray-500 dark:text-gray-400">Country</p>
                                                    <p className="font-sans font-medium text-gray-900 dark:text-white">{guest.country}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs font-sans text-gray-500 dark:text-gray-400">Passport/ID</p>
                                                    <p className="font-sans font-medium text-gray-900 dark:text-white">{guest.passportNumber || 'Not provided'}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Loyalty Stats */}
                                    <div>
                                        <h3 className="font-serif text-lg font-bold text-gray-900 dark:text-white mb-4">
                                            Loyalty Statistics
                                        </h3>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                            <div className="p-4 rounded-lg border border-gray-200 dark:border-white/10">
                                                <p className="text-sm font-sans text-gray-500 dark:text-gray-400 mb-1">Total Stays</p>
                                                <p className="text-2xl font-serif font-bold text-gray-900 dark:text-white">{guest.totalStays}</p>
                                            </div>
                                            <div className="p-4 rounded-lg border border-gray-200 dark:border-white/10">
                                                <p className="text-sm font-sans text-gray-500 dark:text-gray-400 mb-1">Total Nights</p>
                                                <p className="text-2xl font-serif font-bold text-gray-900 dark:text-white">{guest.totalNights}</p>
                                            </div>
                                            <div className="p-4 rounded-lg border border-gray-200 dark:border-white/10">
                                                <p className="text-sm font-sans text-gray-500 dark:text-gray-400 mb-1">Total Spent</p>
                                                <p className="text-2xl font-serif font-bold text-green-600 dark:text-green-400">${guest.totalSpent}</p>
                                            </div>
                                            <div className="p-4 rounded-lg border border-gray-200 dark:border-white/10">
                                                <p className="text-sm font-sans text-gray-500 dark:text-gray-400 mb-1">Avg. Rating</p>
                                                <p className="text-2xl font-serif font-bold text-gray-900 dark:text-white">{stats.avgRating}/5</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Recent Activity */}
                                    <div>
                                        <h3 className="font-serif text-lg font-bold text-gray-900 dark:text-white mb-4">
                                            Recent Activity
                                        </h3>
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-white/10">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                                                        <Check size={20} className="text-green-600 dark:text-green-400" />
                                                    </div>
                                                    <div>
                                                        <p className="font-sans font-medium text-gray-900 dark:text-white">Booking Confirmed</p>
                                                        <p className="text-sm font-sans text-gray-500 dark:text-gray-400">RES-789012 • Deluxe City Suite</p>
                                                    </div>
                                                </div>
                                                <span className="text-sm font-sans text-gray-500 dark:text-gray-400">2 days ago</span>
                                            </div>
                                            <div className="flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-white/10">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                                                        <Star size={20} className="text-blue-600 dark:text-blue-400" />
                                                    </div>
                                                    <div>
                                                        <p className="font-sans font-medium text-gray-900 dark:text-white">Review Submitted</p>
                                                        <p className="text-sm font-sans text-gray-500 dark:text-gray-400">5-star rating for previous stay</p>
                                                    </div>
                                                </div>
                                                <span className="text-sm font-sans text-gray-500 dark:text-gray-400">1 week ago</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right Column - Quick Actions & Info */}
                            <div className="space-y-6">
                                {/* Quick Actions */}
                                <div className="p-4 rounded-lg border border-gray-200 dark:border-white/10">
                                    <h3 className="font-serif font-bold text-gray-900 dark:text-white mb-4">
                                        Quick Actions
                                    </h3>
                                    <div className="space-y-3">
                                        <Button
                                            onClick={() => onAction('create-booking', guest)}
                                            className="w-full flex items-center justify-center gap-2"
                                        >
                                            <Plus size={16} />
                                            Create Booking
                                        </Button>
                                        <Button
                                            onClick={() => onAction('send-offer', guest)}
                                            variant="secondary"
                                            className="w-full flex items-center justify-center gap-2 border-purple-300 dark:border-purple-500/50 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20"
                                        >
                                            <Gift size={16} />
                                            Send Special Offer
                                        </Button>
                                        <Button
                                            onClick={() => onAction('upgrade-tier', guest)}
                                            variant="secondary"
                                            className="w-full flex items-center justify-center gap-2 border-yellow-300 dark:border-yellow-500/50 text-yellow-600 dark:text-yellow-400 hover:bg-yellow-50 dark:hover:bg-yellow-900/20"
                                        >
                                            <Award size={16} />
                                            Upgrade Tier
                                        </Button>
                                    </div>
                                </div>

                                {/* Guest Notes */}
                                <div className="p-4 rounded-lg border border-gray-200 dark:border-white/10">
                                    <h3 className="font-serif font-bold text-gray-900 dark:text-white mb-3">
                                        Guest Notes
                                    </h3>
                                    <textarea
                                        className="w-full h-32 px-3 py-2 rounded-lg border border-gray-300 dark:border-white/10 bg-white dark:bg-dark-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                        placeholder="Add internal notes about this guest..."
                                        defaultValue={guest.notes || ''}
                                    />
                                    <Button className="w-full mt-3" variant="secondary">
                                        Save Notes
                                    </Button>
                                </div>

                                {/* Guest Tags */}
                                <div className="p-4 rounded-lg border border-gray-200 dark:border-white/10">
                                    <h3 className="font-serif font-bold text-gray-900 dark:text-white mb-3">
                                        Guest Tags
                                    </h3>
                                    <div className="flex flex-wrap gap-2 mb-3">
                                        {guest.preferences.map((pref, index) => (
                                            <Badge key={index} variant="blue">
                                                {pref}
                                            </Badge>
                                        ))}
                                    </div>
                                    <Button
                                        variant="secondary"
                                        className="w-full flex items-center justify-center gap-2"
                                    >
                                        <Tag size={14} />
                                        Add Tag
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'stays' && (
                        <div className="space-y-6">
                            {/* Stay Statistics */}
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div className="p-4 rounded-lg border border-gray-200 dark:border-white/10">
                                    <p className="text-sm font-sans text-gray-500 dark:text-gray-400 mb-1">Total Stays</p>
                                    <p className="text-2xl font-serif font-bold text-gray-900 dark:text-white">{staysHistory.length}</p>
                                </div>
                                <div className="p-4 rounded-lg border border-gray-200 dark:border-white/10">
                                    <p className="text-sm font-sans text-gray-500 dark:text-gray-400 mb-1">Total Revenue</p>
                                    <p className="text-2xl font-serif font-bold text-green-600 dark:text-green-400">${stats.totalSpent}</p>
                                </div>
                                <div className="p-4 rounded-lg border border-gray-200 dark:border-white/10">
                                    <p className="text-sm font-sans text-gray-500 dark:text-gray-400 mb-1">Avg. Nights</p>
                                    <p className="text-2xl font-serif font-bold text-gray-900 dark:text-white">{stats.avgNights}</p>
                                </div>
                                <div className="p-4 rounded-lg border border-gray-200 dark:border-white/10">
                                    <p className="text-sm font-sans text-gray-500 dark:text-gray-400 mb-1">Avg. Rating</p>
                                    <div className="flex items-center gap-2">
                                        <div className="flex">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <Star
                                                    key={star}
                                                    size={16}
                                                    fill={star <= stats.avgRating ? "#fbbf24" : "#d1d5db"}
                                                    className="text-yellow-400"
                                                />
                                            ))}
                                        </div>
                                        <span className="text-2xl font-serif font-bold text-gray-900 dark:text-white">
                                            {stats.avgRating}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Stays History Table */}
                            <div>
                                <h3 className="font-serif text-lg font-bold text-gray-900 dark:text-white mb-4">
                                    Stay History
                                </h3>
                                <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-white/10">
                                    <table className="min-w-full divide-y divide-gray-200 dark:divide-white/10">
                                        <thead className="bg-gray-50 dark:bg-white/5">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-sans font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                    Booking ID
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-sans font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                    Room
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-sans font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                    Dates
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-sans font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                    Nights
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-sans font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                    Total
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-sans font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                    Rating
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-sans font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                    Actions
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white dark:bg-dark-800 divide-y divide-gray-200 dark:divide-white/10">
                                            {staysHistory.map(stay => (
                                                <tr key={stay.id} className="hover:bg-gray-50 dark:hover:bg-white/5">
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className="font-mono text-sm font-medium text-gray-900 dark:text-white">
                                                            {stay.bookingId}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className="font-sans text-sm text-gray-900 dark:text-white">
                                                            {stay.room}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm font-sans text-gray-900 dark:text-white">
                                                            {stay.checkIn} to {stay.checkOut}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <Badge variant="blue" className="font-mono">
                                                            {stay.nights} nights
                                                        </Badge>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className="font-serif font-bold text-gray-900 dark:text-white">
                                                            ${stay.total}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center gap-1">
                                                            {[1, 2, 3, 4, 5].map((star) => (
                                                                <Star
                                                                    key={star}
                                                                    size={12}
                                                                    fill={star <= stay.rating ? "#fbbf24" : "#d1d5db"}
                                                                    className="text-yellow-400"
                                                                />
                                                            ))}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <Button
                                                            onClick={() => onAction('view-stay', stay)}
                                                            variant="link"
                                                            className="text-blue-600 dark:text-blue-400 p-0 h-auto font-sans font-medium"
                                                        >
                                                            View Details
                                                        </Button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Stay Timeline */}
                            <div>
                                <h3 className="font-serif text-lg font-bold text-gray-900 dark:text-white mb-4">
                                    Stay Timeline
                                </h3>
                                <div className="space-y-4">
                                    {staysHistory.map((stay, index) => (
                                        <div key={stay.id} className="flex items-start gap-4">
                                            <div className="flex flex-col items-center">
                                                <div className="w-8 h-8 rounded-full bg-blue-600 dark:bg-blue-500 flex items-center justify-center">
                                                    <Home size={16} className="text-white" />
                                                </div>
                                                {index < staysHistory.length - 1 && (
                                                    <div className="w-0.5 h-12 bg-gray-300 dark:bg-white/20 mt-2"></div>
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <div className="p-4 rounded-lg border border-gray-200 dark:border-white/10">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <h4 className="font-sans font-medium text-gray-900 dark:text-white">
                                                            {stay.room}
                                                        </h4>
                                                        <span className="text-sm font-sans text-gray-500 dark:text-gray-400">
                                                            {stay.checkIn} - {stay.checkOut}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-4">
                                                            <span className="text-sm font-sans text-gray-600 dark:text-gray-400">
                                                                Booking ID: {stay.bookingId}
                                                            </span>
                                                            <span className="text-sm font-sans text-gray-600 dark:text-gray-400">
                                                                ${stay.total}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <div className="flex">
                                                                {[1, 2, 3, 4, 5].map((star) => (
                                                                    <Star
                                                                        key={star}
                                                                        size={12}
                                                                        fill={star <= stay.rating ? "#fbbf24" : "#d1d5db"}
                                                                        className="text-yellow-400"
                                                                    />
                                                                ))}
                                                            </div>
                                                            <span className="text-sm font-sans font-medium text-gray-900 dark:text-white">
                                                                {stay.rating}/5
                                                            </span>
                                                        </div>
                                                    </div>
                                                    {stay.review && (
                                                        <div className="mt-3 pt-3 border-t border-gray-200 dark:border-white/10">
                                                            <p className="text-sm font-sans text-gray-600 dark:text-gray-400 italic">
                                                                "{stay.review}"
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'preferences' && (
                        <div className="space-y-6">
                            <div>
                                <h3 className="font-serif text-lg font-bold text-gray-900 dark:text-white mb-4">
                                    Room Preferences
                                </h3>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {guest.preferences.map((pref, index) => (
                                        <div key={index} className="p-4 rounded-lg border border-gray-200 dark:border-white/10">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                                                    {pref === 'High Floor' && <TrendingUp size={20} className="text-blue-600 dark:text-blue-400" />}
                                                    {pref === 'City View' && <Waves size={20} className="text-blue-600 dark:text-blue-400" />}
                                                    {pref === 'Near Elevator' && <TrendingUp size={20} className="text-blue-600 dark:text-blue-400" />}
                                                    {pref === 'Quiet Room' && <Shield size={20} className="text-blue-600 dark:text-blue-400" />}
                                                </div>
                                                <span className="font-sans font-medium text-gray-900 dark:text-white">{pref}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <h3 className="font-serif text-lg font-bold text-gray-900 dark:text-white mb-4">
                                    Special Requests
                                </h3>
                                <div className="space-y-3">
                                    <div className="p-4 rounded-lg border border-green-200 dark:border-green-500/30 bg-green-50 dark:bg-green-900/20">
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                                                <Coffee size={16} className="text-green-600 dark:text-green-400" />
                                            </div>
                                            <h4 className="font-sans font-medium text-gray-900 dark:text-white">Coffee Preferences</h4>
                                        </div>
                                        <p className="text-sm font-sans text-gray-600 dark:text-gray-400">
                                            Guest prefers strong black coffee with two sugars in the morning
                                        </p>
                                    </div>
                                    <div className="p-4 rounded-lg border border-blue-200 dark:border-blue-500/30 bg-blue-50 dark:bg-blue-900/20">
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                                                <ClockIcon size={16} className="text-blue-600 dark:text-blue-400" />
                                            </div>
                                            <h4 className="font-sans font-medium text-gray-900 dark:text-white">Check-in Time</h4>
                                        </div>
                                        <p className="text-sm font-sans text-gray-600 dark:text-gray-400">
                                            Prefers late check-in after 8 PM
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// Main AdminGuest Component
const AdminGuest = () => {
    const [guests, setGuests] = useState([
        {
            id: 'GUEST-001',
            name: 'Michael Chen',
            email: 'michael@example.com',
            phone: '+1 (555) 123-4567',
            country: 'United States',
            status: 'vip',
            tier: 'diamond',
            memberSince: '2020',
            totalStays: 12,
            totalNights: 45,
            totalSpent: 18500,
            preferences: ['High Floor', 'City View', 'King Bed', 'Late Check-out'],
            address: '123 Park Ave, New York, NY',
            dateOfBirth: '1985-03-15',
            passportNumber: 'P12345678',
            notes: 'Frequent business traveler. Prefers room service.'
        },
        {
            id: 'GUEST-002',
            name: 'Sarah Wilson',
            email: 'sarah@example.com',
            phone: '+1 (555) 234-5678',
            country: 'Canada',
            status: 'loyal',
            tier: 'platinum',
            memberSince: '2021',
            totalStays: 8,
            totalNights: 32,
            totalSpent: 12500,
            preferences: ['Quiet Room', 'City View', 'Early Check-in'],
            address: '456 Maple Street, Toronto, ON',
            dateOfBirth: '1990-07-22',
            passportNumber: 'C87654321',
            notes: 'Celebrated anniversary last visit. Send welcome champagne.'
        },
        {
            id: 'GUEST-003',
            name: 'Robert Davis',
            email: 'robert@example.com',
            phone: '+1 (555) 345-6789',
            country: 'United Kingdom',
            status: 'active',
            tier: 'gold',
            memberSince: '2022',
            totalStays: 5,
            totalNights: 18,
            totalSpent: 6500,
            preferences: ['Near Elevator', 'Garden View', 'Extra Pillows'],
            address: '789 Oxford Street, London, UK',
            dateOfBirth: '1978-11-30',
            passportNumber: 'GB12345678',
            notes: 'Business traveler. Often requests meeting room.'
        },
        {
            id: 'GUEST-004',
            name: 'Emily Johnson',
            email: 'emily@example.com',
            phone: '+1 (555) 456-7890',
            country: 'Australia',
            status: 'active',
            tier: 'silver',
            memberSince: '2023',
            totalStays: 3,
            totalNights: 10,
            totalSpent: 3500,
            preferences: ['Pool View', 'Family Room', 'Crib Available'],
            address: '101 Maitama District, Abuja, FCT',
            dateOfBirth: '1995-04-18',
            passportNumber: 'A98765432',
            notes: 'Travels with young children. Family vacationer.'
        },
        {
            id: 'GUEST-005',
            name: 'James Miller',
            email: 'james@example.com',
            phone: '+1 (555) 567-8901',
            country: 'Germany',
            status: 'inactive',
            tier: 'bronze',
            memberSince: '2021',
            totalStays: 2,
            totalNights: 6,
            totalSpent: 1800,
            preferences: ['Business Floor', 'Working Desk', 'Fast Wi-Fi'],
            address: '202 Berliner Str, Berlin, DE',
            dateOfBirth: '1988-09-12',
            passportNumber: 'D12349876',
            notes: 'Last stay was 6 months ago. Send re-engagement offer.'
        },
        {
            id: 'GUEST-006',
            name: 'Lisa Thompson',
            email: 'lisa@example.com',
            phone: '+1 (555) 678-9012',
            country: 'France',
            status: 'vip',
            tier: 'diamond',
            memberSince: '2019',
            totalStays: 15,
            totalNights: 62,
            totalSpent: 28500,
            preferences: ['Suite Upgrade', 'Spa Access', 'Private Dining'],
            address: '303 Champs-Élysées, Paris, FR',
            dateOfBirth: '1975-12-05',
            passportNumber: 'F87654321',
            notes: 'VIP guest. Always book presidential suite. Personal concierge required.'
        },
        {
            id: 'GUEST-007',
            name: 'David Wilson',
            email: 'david@example.com',
            phone: '+1 (555) 789-0123',
            country: 'Japan',
            status: 'active',
            tier: 'gold',
            memberSince: '2022',
            totalStays: 6,
            totalNights: 21,
            totalSpent: 8200,
            preferences: ['Traditional Room', 'Tea Set', 'Yukata'],
            address: '404 Ginza Street, Tokyo, JP',
            dateOfBirth: '1982-06-25',
            passportNumber: 'J12345678',
            notes: 'Appreciates traditional Japanese hospitality.'
        },
        {
            id: 'GUEST-008',
            name: 'Maria Garcia',
            email: 'maria@example.com',
            phone: '+1 (555) 890-1234',
            country: 'Spain',
            status: 'blacklisted',
            tier: 'bronze',
            memberSince: '2020',
            totalStays: 4,
            totalNights: 12,
            totalSpent: 0,
            preferences: ['Late Check-out', 'Room Service'],
            address: '505 Barcelona Ave, Madrid, ES',
            dateOfBirth: '1993-02-14',
            passportNumber: 'E98765432',
            notes: 'Payment issues. Multiple chargebacks. Do not accept bookings.'
        }
    ]);

    const [selectedGuest, setSelectedGuest] = useState(null);
    const [detailsModalOpen, setDetailsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('all');
    const [selectedTier, setSelectedTier] = useState('all');
    const [sortBy, setSortBy] = useState('recent');

    const statusTypes = ['all', 'active', 'inactive', 'vip', 'loyal', 'blacklisted'];
    const tiers = ['all', 'bronze', 'silver', 'gold', 'platinum', 'diamond'];

    const handleViewDetails = (guest) => {
        setSelectedGuest(guest);
        setDetailsModalOpen(true);
    };

    const handleEditGuest = (guest) => {
        setSelectedGuest(guest);
        // Open edit modal
        alert('Edit guest: ' + guest.name);
    };

    const handleDeleteGuest = (guest) => {
        if (window.confirm(`Are you sure you want to delete guest ${guest.name}?`)) {
            setGuests(guests.filter(g => g.id !== guest.id));
        }
    };

    const handleAction = (action, guest) => {
        switch (action) {
            case 'create-booking':
                alert('Creating booking for ' + guest.name);
                break;
            case 'send-offer':
                alert('Sending special offer to ' + guest.name);
                break;
            case 'upgrade-tier':
                alert('Upgrading tier for ' + guest.name);
                break;
            case 'message':
                alert('Opening message interface for ' + guest.name);
                break;
            case 'view-stay':
                alert('Viewing stay details');
                break;
        }
    };

    const handleImportGuests = () => {
        alert('Import guests dialog opened...');
    };

    const handleExportGuests = () => {
        alert('Exporting guests data...');
    };

    const filteredGuests = guests.filter(guest => {
        const matchesSearch =
            guest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            guest.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            guest.id.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = selectedStatus === 'all' || guest.status === selectedStatus;
        const matchesTier = selectedTier === 'all' || guest.tier === selectedTier;

        return matchesSearch && matchesStatus && matchesTier;
    }).sort((a, b) => {
        switch (sortBy) {
            case 'recent':
                return new Date(b.memberSince) - new Date(a.memberSince);
            case 'name':
                return a.name.localeCompare(b.name);
            case 'spent':
                return b.totalSpent - a.totalSpent;
            case 'stays':
                return b.totalStays - a.totalStays;
            default:
                return 0;
        }
    });

    const stats = {
        total: guests.length,
        active: guests.filter(g => g.status === 'active').length,
        vip: guests.filter(g => g.status === 'vip').length,
        loyal: guests.filter(g => g.status === 'loyal').length,
        totalRevenue: guests.reduce((sum, g) => sum + g.totalSpent, 0),
        avgStays: (guests.reduce((sum, g) => sum + g.totalStays, 0) / guests.length).toFixed(1)
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-void p-4 sm:p-6 lg:p-8">
            <Helmet>
                <title>Guest Management | Suave By Chloe</title>
                <meta name="robots" content="noindex, nofollow" />
            </Helmet>
            <div className="max-w-7xl mx-auto">
                {/* Page Header */}
                <div className="mb-8">
                    <span className="font-mono text-sm text-blue-500 tracking-widest uppercase mb-2 block">
                        ADMIN_GUESTS
                    </span>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <h1 className="font-serif text-3xl font-bold text-gray-900 dark:text-white mb-2">
                                Guest Management
                            </h1>
                            <p className="font-sans text-gray-600 dark:text-gray-400">
                                Manage guest profiles, preferences, and stay history
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <Button
                                onClick={handleImportGuests}
                                variant="secondary"
                                className="flex items-center gap-2"
                            >
                                <Download size={18} />
                                Import
                            </Button>
                            <Button
                                onClick={handleExportGuests}
                                variant="secondary"
                                className="flex items-center gap-2"
                            >
                                <Upload size={18} />
                                Export
                            </Button>
                            <Button
                                onClick={() => { }}
                                className="px-6 flex items-center gap-2"
                            >
                                <Plus size={20} />
                                Add Guest
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-8">
                    <SpotlightCard className="rounded-xl border bg-white border-gray-200 dark:bg-dark-800 dark:border-white/10 p-4">
                        <p className="text-sm font-sans text-gray-600 dark:text-gray-400 mb-1">Total Guests</p>
                        <p className="text-2xl font-serif font-bold text-gray-900 dark:text-white">{stats.total}</p>
                    </SpotlightCard>
                    <SpotlightCard className="rounded-xl border bg-white border-gray-200 dark:bg-dark-800 dark:border-white/10 p-4">
                        <p className="text-sm font-sans text-gray-600 dark:text-gray-400 mb-1">Active Guests</p>
                        <p className="text-2xl font-serif font-bold text-green-600 dark:text-green-400">{stats.active}</p>
                    </SpotlightCard>
                    <SpotlightCard className="rounded-xl border bg-white border-gray-200 dark:bg-dark-800 dark:border-white/10 p-4">
                        <p className="text-sm font-sans text-gray-600 dark:text-gray-400 mb-1">VIP Guests</p>
                        <p className="text-2xl font-serif font-bold text-purple-600 dark:text-purple-400">{stats.vip}</p>
                    </SpotlightCard>
                    <SpotlightCard className="rounded-xl border bg-white border-gray-200 dark:bg-dark-800 dark:border-white/10 p-4">
                        <p className="text-sm font-sans text-gray-600 dark:text-gray-400 mb-1">Loyal Guests</p>
                        <p className="text-2xl font-serif font-bold text-blue-600 dark:text-blue-400">{stats.loyal}</p>
                    </SpotlightCard>
                    <SpotlightCard className="rounded-xl border bg-white border-gray-200 dark:bg-dark-800 dark:border-white/10 p-4">
                        <p className="text-sm font-sans text-gray-600 dark:text-gray-400 mb-1">Total Revenue</p>
                        <p className="text-2xl font-serif font-bold text-gray-900 dark:text-white">
                            ${(stats.totalRevenue / 1000).toFixed(1)}k
                        </p>
                    </SpotlightCard>
                    <SpotlightCard className="rounded-xl border bg-white border-gray-200 dark:bg-dark-800 dark:border-white/10 p-4">
                        <p className="text-sm font-sans text-gray-600 dark:text-gray-400 mb-1">Avg. Stays</p>
                        <p className="text-2xl font-serif font-bold text-gray-900 dark:text-white">{stats.avgStays}</p>
                    </SpotlightCard>
                </div>

                {/* Search and Filter Bar */}
                <div className="mb-8">
                    <SpotlightCard className="rounded-2xl border bg-white border-gray-200 dark:bg-dark-800 dark:border-white/10 p-4">
                        <div className="flex flex-col md:flex-row md:items-center gap-4">
                            <div className="flex-1">
                                <Input
                                    type="text"
                                    placeholder="Search guests by name, email, or ID..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    icon={Search}
                                />
                            </div>
                            <div className="flex flex-wrap gap-2">
                                <select
                                    value={selectedStatus}
                                    onChange={(e) => setSelectedStatus(e.target.value)}
                                    className="px-3 py-2 rounded-lg border border-gray-300 dark:border-white/10 bg-white dark:bg-dark-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    {statusTypes.map(status => (
                                        <option key={status} value={status}>
                                            {status === 'all' ? 'All Status' : status.charAt(0).toUpperCase() + status.slice(1)}
                                        </option>
                                    ))}
                                </select>
                                <select
                                    value={selectedTier}
                                    onChange={(e) => setSelectedTier(e.target.value)}
                                    className="px-3 py-2 rounded-lg border border-gray-300 dark:border-white/10 bg-white dark:bg-dark-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    {tiers.map(tier => (
                                        <option key={tier} value={tier}>
                                            {tier === 'all' ? 'All Tiers' : tier.charAt(0).toUpperCase() + tier.slice(1)}
                                        </option>
                                    ))}
                                </select>
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="px-3 py-2 rounded-lg border border-gray-300 dark:border-white/10 bg-white dark:bg-dark-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="recent">Recently Added</option>
                                    <option value="name">Name A-Z</option>
                                    <option value="spent">Most Spent</option>
                                    <option value="stays">Most Stays</option>
                                </select>
                                <Button variant="secondary" className="flex items-center gap-2">
                                    <Filter size={18} />
                                    More Filters
                                </Button>
                            </div>
                        </div>
                    </SpotlightCard>
                </div>

                {/* Guests Grid */}
                <div className="mb-8">
                    <SpotlightCard className="rounded-2xl border bg-white border-gray-200 dark:bg-dark-800 dark:border-white/10 p-6">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h3 className="font-serif text-xl font-bold text-gray-900 dark:text-white">
                                    Guest Profiles ({filteredGuests.length})
                                </h3>
                                <p className="text-sm font-sans text-gray-600 dark:text-gray-400">
                                    Click on a guest to view details and stay history
                                </p>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-sans text-gray-600 dark:text-gray-400">
                                    Showing {filteredGuests.length} of {guests.length} guests
                                </span>
                            </div>
                        </div>

                        {filteredGuests.length === 0 ? (
                            <div className="text-center py-12">
                                <User size={48} className="mx-auto text-gray-400 mb-4" />
                                <p className="font-sans text-gray-600 dark:text-gray-400 mb-4">
                                    No guests found matching your criteria
                                </p>
                                <Button
                                    onClick={() => { }}
                                >
                                    Add New Guest
                                </Button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                {filteredGuests.map(guest => (
                                    <GuestCard
                                        key={guest.id}
                                        guest={guest}
                                        onView={handleViewDetails}
                                        onEdit={handleEditGuest}
                                        onDelete={handleDeleteGuest}
                                    />
                                ))}
                            </div>
                        )}
                    </SpotlightCard>
                </div>

                {/* Guest Insights */}
                <SpotlightCard className="rounded-2xl border bg-white border-gray-200 dark:bg-dark-800 dark:border-white/10 p-6">
                    <h3 className="font-serif text-xl font-bold text-gray-900 dark:text-white mb-6">
                        Guest Insights
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h4 className="font-sans font-medium text-gray-900 dark:text-white mb-4">Top Spending Guests</h4>
                            <div className="space-y-3">
                                {guests
                                    .sort((a, b) => b.totalSpent - a.totalSpent)
                                    .slice(0, 5)
                                    .map(guest => (
                                        <div key={guest.id} className="flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-white/10">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-sm font-bold">
                                                    {guest.name.split(' ').map(n => n[0]).join('')}
                                                </div>
                                                <div>
                                                    <p className="font-sans font-medium text-gray-900 dark:text-white">{guest.name}</p>
                                                    <p className="text-xs font-sans text-gray-500 dark:text-gray-400">{guest.totalStays} stays</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-serif font-bold text-green-600 dark:text-green-400">${guest.totalSpent}</p>
                                                <TierBadge tier={guest.tier} />
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        </div>
                        <div>
                            <h4 className="font-sans font-medium text-gray-900 dark:text-white mb-4">Guest Distribution by Country</h4>
                            <div className="space-y-3">
                                {Array.from(new Set(guests.map(g => g.country)))
                                    .map(country => {
                                        const count = guests.filter(g => g.country === country).length;
                                        const percentage = (count / guests.length) * 100;
                                        return { country, count, percentage };
                                    })
                                    .sort((a, b) => b.count - a.count)
                                    .slice(0, 5)
                                    .map(item => (
                                        <div key={item.country} className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <span className="font-sans text-sm text-gray-900 dark:text-white">{item.country}</span>
                                                <span className="text-sm font-sans text-gray-600 dark:text-gray-400">{item.count} guests</span>
                                            </div>
                                            <div className="h-2 bg-gray-200 dark:bg-white/10 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full rounded-full bg-blue-600 dark:bg-blue-500"
                                                    style={{ width: `${item.percentage}%` }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        </div>
                    </div>
                </SpotlightCard>
            </div>

            {/* Guest Details Modal */}
            <GuestDetailsModal
                isOpen={detailsModalOpen}
                onClose={() => setDetailsModalOpen(false)}
                guest={selectedGuest}
                onAction={handleAction}
            />
        </div>
    );
};

export default AdminGuest;