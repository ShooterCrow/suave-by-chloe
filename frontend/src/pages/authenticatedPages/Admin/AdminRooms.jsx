import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import {
    Search,
    Filter,
    Plus,
    Edit,
    Trash2,
    Calendar,
    Banknote,
    Home,
    Check,
    X,
    MoreVertical,
    ChevronRight,
    ChevronDown,
    Star,
    Users,
    Maximize2,
    Eye,
    EyeOff,
    Clock,
    Bed,
    Wifi,
    Coffee,
    Tv,
    Wind,
    Bath,
    Car,
} from 'lucide-react';
import { Calendar as BigCalendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Badge from '../../../components/ui/Badge';
import SpotlightCard from '../../../components/ui/SpotlightCard';

// Room Type Badge Component
const RoomTypeBadge = ({ type }) => {
    const getTypeConfig = (type) => {
        const configs = {
            'deluxe': { variant: 'blue', icon: <Star size={12} /> },
            'executive': { variant: 'purple', icon: <Users size={12} /> },
            'standard': { variant: 'success', icon: <Home size={12} /> },
            'suite': { variant: 'warning', icon: <Maximize2 size={12} /> }, // Using warning/amber for suite
            'villa': { variant: 'rose', icon: <Car size={12} /> }
        };
        return configs[type] || configs.standard;
    };

    const config = getTypeConfig(type);

    return (
        <Badge variant={config.variant} className="gap-1">
            {config.icon}
            {type.charAt(0).toUpperCase() + type.slice(1)}
        </Badge>
    );
};

// Status Badge Component
// Status Badge Component
const StatusBadge = ({ status }) => {
    const getStatusConfig = (status) => {
        const configs = {
            'available': { variant: 'success', icon: <Check size={12} /> },
            'occupied': { variant: 'destructive', icon: <Users size={12} /> },
            'maintenance': { variant: 'warning', icon: <Clock size={12} /> },
            'cleaning': { variant: 'blue', icon: <Clock size={12} /> },
            'reserved': { variant: 'purple', icon: <Eye size={12} /> }
        };
        return configs[status] || configs.available;
    };

    const config = getStatusConfig(status);

    return (
        <Badge variant={config.variant} className="gap-1">
            {config.icon}
            {status.charAt(0).toUpperCase() + status.slice(1)}
        </Badge>
    );
};

// Room Card Component
const RoomCard = ({ room, onEdit, onDelete, onToggleStatus }) => {
    return (
        <SpotlightCard className="rounded-2xl border bg-white border-gray-200 dark:bg-dark-800 dark:border-white/10 p-4 hover:border-blue-300 dark:hover:border-blue-500/50 transition-colors">
            <div className="flex items-start justify-between mb-3">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-serif text-lg font-bold text-gray-900 dark:text-white">
                            {room.number} - {room.name}
                        </h4>
                        <RoomTypeBadge type={room.type} />
                    </div>
                    <p className="text-sm font-sans text-gray-600 dark:text-gray-400">
                        Floor {room.floor} • {room.beds} {room.beds === 1 ? 'bed' : 'beds'} • {room.maxGuests} guests max
                    </p>
                </div>
                <div className="flex items-center gap-1">
                    <StatusBadge status={room.status} />
                    <Button
                        onClick={() => onToggleStatus(room.id)}
                        variant="ghost"
                        size="icon"
                        className="text-gray-900 dark:text-white"
                    >
                        {room.status === 'available' ? <EyeOff size={16} /> : <Eye size={16} />}
                    </Button>
                </div>
            </div>

            {/* Amenities */}
            <div className="flex flex-wrap gap-2 mb-4">
                {room.amenities.slice(0, 4).map((amenity, index) => (
                    <span key={index} className="text-xs font-sans text-gray-500 dark:text-gray-400">
                        • {amenity}
                    </span>
                ))}
                {room.amenities.length > 4 && (
                    <span className="text-xs font-sans text-gray-500 dark:text-gray-400">
                        +{room.amenities.length - 4} more
                    </span>
                )}
            </div>

            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-sans text-gray-600 dark:text-gray-400 mb-1">Current Rate</p>
                    <p className="text-xl font-serif font-bold text-gray-900 dark:text-white">
                        ₦{room.price.toLocaleString()}/night
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        onClick={() => onEdit(room)}
                        variant="ghost"
                        size="icon"
                        className="bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30"
                    >
                        <Edit size={18} />
                    </Button>
                    <Button
                        onClick={() => onDelete(room.id)}
                        variant="ghost"
                        size="icon"
                        className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30"
                    >
                        <Trash2 size={18} />
                    </Button>
                </div>
            </div>
        </SpotlightCard>
    );
};

// Add/Edit Room Modal
const RoomModal = ({ isOpen, onClose, room, onSave }) => {
    const [formData, setFormData] = useState(room || {
        name: '',
        number: '',
        type: 'standard',
        floor: '',
        beds: 1,
        maxGuests: 2,
        price: 0,
        amenities: [],
        description: '',
        status: 'available'
    });

    const allAmenities = [
        { id: 'wifi', label: 'Wi-Fi', icon: <Wifi size={16} /> },
        { id: 'tv', label: 'Smart TV', icon: <Tv size={16} /> },
        { id: 'ac', label: 'Air Conditioning', icon: <Wind size={16} /> },
        { id: 'coffee', label: 'Coffee Maker', icon: <Coffee size={16} /> },
        { id: 'minibar', label: 'Minibar' },
        { id: 'safe', label: 'Safe' },
        { id: 'hairdryer', label: 'Hair Dryer' },
        { id: 'bathtub', label: 'Bathtub', icon: <Bath size={16} /> },
        { id: 'balcony', label: 'Balcony' },
        { id: 'city-view', label: 'City View' },
        { id: 'room-service', label: '24/7 Room Service' },
        { id: 'breakfast', label: 'Breakfast Included' }
    ];

    const roomTypes = [
        { value: 'standard', label: 'Standard Room' },
        { value: 'deluxe', label: 'Deluxe Room' },
        { value: 'executive', label: 'Executive Room' },
        { value: 'suite', label: 'Suite' },
        { value: 'villa', label: 'Villa' }
    ];

    const handleAmenityToggle = (amenity) => {
        setFormData(prev => ({
            ...prev,
            amenities: prev.amenities.includes(amenity)
                ? prev.amenities.filter(a => a !== amenity)
                : [...prev.amenities, amenity]
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white dark:bg-dark-800 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
                <div className="p-6 border-b border-gray-200 dark:border-white/10">
                    <div className="flex items-center justify-between">
                        <h2 className="font-serif text-2xl font-bold text-gray-900 dark:text-white">
                            {room ? 'Edit Room' : 'Add New Room'}
                        </h2>
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

                <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Left Column */}
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-sans font-medium text-gray-900 dark:text-white mb-2">
                                    Room Name *
                                </label>
                                <Input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-sans font-medium text-gray-900 dark:text-white mb-2">
                                    Room Number *
                                </label>
                                <Input
                                    type="text"
                                    value={formData.number}
                                    onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-sans font-medium text-gray-900 dark:text-white mb-2">
                                    Room Type *
                                </label>
                                <select
                                    value={formData.type}
                                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-white/10 bg-white dark:bg-dark-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    {roomTypes.map(type => (
                                        <option key={type.value} value={type.value}>
                                            {type.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-sans font-medium text-gray-900 dark:text-white mb-2">
                                        Floor
                                    </label>
                                    <Input
                                        type="number"
                                        value={formData.floor}
                                        onChange={(e) => setFormData({ ...formData, floor: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-sans font-medium text-gray-900 dark:text-white mb-2">
                                        Number of Beds
                                    </label>
                                    <Input
                                        type="number"
                                        value={formData.beds}
                                        onChange={(e) => setFormData({ ...formData, beds: parseInt(e.target.value) })}
                                        min="1"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Right Column */}
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-sans font-medium text-gray-900 dark:text-white mb-2">
                                    Max Guests *
                                </label>
                                <Input
                                    type="number"
                                    value={formData.maxGuests}
                                    onChange={(e) => setFormData({ ...formData, maxGuests: parseInt(e.target.value) })}
                                    min="1"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-sans font-medium text-gray-900 dark:text-white mb-2">
                                    Base Price (per night) *
                                </label>
                                <Input
                                    type="number"
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                                    min="0"
                                    step="0.01"
                                    icon={Banknote}
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-sans font-medium text-gray-900 dark:text-white mb-2">
                                    Status
                                </label>
                                <select
                                    value={formData.status}
                                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-white/10 bg-white dark:bg-dark-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="available">Available</option>
                                    <option value="occupied">Occupied</option>
                                    <option value="maintenance">Maintenance</option>
                                    <option value="cleaning">Cleaning</option>
                                    <option value="reserved">Reserved</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-sans font-medium text-gray-900 dark:text-white mb-2">
                                    Description
                                </label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    rows="3"
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-white/10 bg-white dark:bg-dark-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Amenities */}
                    <div className="mt-6">
                        <label className="block text-sm font-sans font-medium text-gray-900 dark:text-white mb-3">
                            Amenities
                        </label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                            {allAmenities.map(amenity => (
                                <label
                                    key={amenity.id}
                                    className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-colors ${formData.amenities.includes(amenity.label)
                                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                                        : 'border-gray-300 dark:border-white/10 hover:border-gray-400 dark:hover:border-white/20'
                                        }`}
                                >
                                    <input
                                        type="checkbox"
                                        checked={formData.amenities.includes(amenity.label)}
                                        onChange={() => handleAmenityToggle(amenity.label)}
                                        className="hidden"
                                    />
                                    {amenity.icon && (
                                        <span className="text-gray-600 dark:text-gray-400">
                                            {amenity.icon}
                                        </span>
                                    )}
                                    <span className="text-sm font-sans">
                                        {amenity.label}
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-200 dark:border-white/10">
                        <Button
                            type="button"
                            onClick={onClose}
                            variant="secondary"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                        >
                            {room ? 'Update Room' : 'Add Room'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// Pricing Rules Component
const PricingRules = ({ room }) => {
    const [rules, setRules] = useState([
        { id: 1, name: 'Weekend Rate', type: 'percentage', value: 25, condition: 'weekend', startDate: '2024-01-01', endDate: '2024-12-31' },
        { id: 2, name: 'Summer Peak', type: 'fixed', value: 50000, condition: 'season', startDate: '2024-06-01', endDate: '2024-08-31' },
        { id: 3, name: 'Early Bird', type: 'percentage', value: -15, condition: 'advance_booking', startDate: '2024-01-01', endDate: '2024-12-31' }
    ]);

    const addRule = () => {
        const newRule = {
            id: rules.length + 1,
            name: `Rule ${rules.length + 1}`,
            type: 'percentage',
            value: 0,
            condition: 'custom',
            startDate: '',
            endDate: ''
        };
        setRules([...rules, newRule]);
    };

    return (
        <SpotlightCard className="rounded-2xl border bg-white border-gray-200 dark:bg-dark-800 dark:border-white/10 p-6">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="font-serif text-xl font-bold text-gray-900 dark:text-white">
                        Pricing Rules
                    </h3>
                    <p className="text-sm font-sans text-gray-600 dark:text-gray-400">
                        Manage dynamic pricing for {room?.name || 'selected room'}
                    </p>
                </div>
                <Button
                    onClick={addRule}
                    className="flex items-center gap-2"
                >
                    <Plus size={18} />
                    Add Rule
                </Button>
            </div>

            <div className="space-y-4">
                {rules.map(rule => (
                    <div key={rule.id} className="p-4 rounded-lg border border-gray-200 dark:border-white/10">
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                                <h4 className="font-sans font-medium text-gray-900 dark:text-white">
                                    {rule.name}
                                </h4>
                                <Badge variant={rule.value >= 0 ? 'success' : 'destructive'}>
                                    {rule.value >= 0 ? '+' : ''}{rule.value}{rule.type === 'percentage' ? '%' : '₦'}
                                </Badge>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button size="icon" variant="ghost" className="text-gray-900 dark:text-white">
                                    <Edit size={16} />
                                </Button>
                                <Button size="icon" variant="ghost" className="text-gray-900 dark:text-white">
                                    <Trash2 size={16} />
                                </Button>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div>
                                <p className="text-xs font-sans text-gray-500 dark:text-gray-400 mb-1">Type</p>
                                <p className="font-sans font-medium text-gray-900 dark:text-white">
                                    {rule.type === 'percentage' ? 'Percentage Increase' : 'Fixed Amount'}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs font-sans text-gray-500 dark:text-gray-400 mb-1">Condition</p>
                                <p className="font-sans font-medium text-gray-900 dark:text-white">
                                    {rule.condition.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs font-sans text-gray-500 dark:text-gray-400 mb-1">Valid Period</p>
                                <p className="font-sans font-medium text-gray-900 dark:text-white">
                                    {rule.startDate} - {rule.endDate}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </SpotlightCard>
    );
};

// Availability Calendar Component
const AvailabilityCalendar = ({ room }) => {
    const localizer = momentLocalizer(moment);
    const [view, setView] = useState('month');

    const events = [
        {
            id: 1,
            title: 'Booked',
            start: new Date(2024, 5, 15),
            end: new Date(2024, 5, 20),
            type: 'booking'
        },
        {
            id: 2,
            title: 'Maintenance',
            start: new Date(2024, 5, 22),
            end: new Date(2024, 5, 23),
            type: 'maintenance'
        },
        {
            id: 3,
            title: 'Blocked',
            start: new Date(2024, 5, 25),
            end: new Date(2024, 5, 28),
            type: 'blocked'
        }
    ];

    const eventStyleGetter = (event) => {
        const backgroundColor = event.type === 'booking' ? '#3b82f6' :
            event.type === 'maintenance' ? '#f59e0b' : '#ef4444';
        return {
            style: {
                backgroundColor,
                borderRadius: '6px',
                opacity: 0.8,
                color: 'white',
                border: '0',
                display: 'block'
            }
        };
    };

    return (
        <SpotlightCard className="rounded-2xl border bg-white border-gray-200 dark:bg-dark-800 dark:border-white/10 p-6">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="font-serif text-xl font-bold text-gray-900 dark:text-white">
                        Availability Calendar
                    </h3>
                    <p className="text-sm font-sans text-gray-600 dark:text-gray-400">
                        {room?.name || 'All Rooms'} - June 2024
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="secondary" size="sm">
                        Export
                    </Button>
                    <Button size="sm" className="flex items-center gap-2">
                        <Calendar size={16} />
                        Block Dates
                    </Button>
                </div>
            </div>

            <div className="h-[600px]">
                <BigCalendar
                    localizer={localizer}
                    events={events}
                    startAccessor="start"
                    endAccessor="end"
                    style={{ height: '100%' }}
                    view={view}
                    onView={setView}
                    eventPropGetter={eventStyleGetter}
                    className="dark:bg-dark-700 dark:text-white"
                    components={{
                        toolbar: (props) => (
                            <div className="rbc-toolbar mb-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => props.onNavigate('PREV')}
                                            className="px-3 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5"
                                        >
                                            Back
                                        </button>
                                        <span className="font-sans font-medium">
                                            {moment(props.date).format('MMMM YYYY')}
                                        </span>
                                        <button
                                            onClick={() => props.onNavigate('NEXT')}
                                            className="px-3 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5"
                                        >
                                            Next
                                        </button>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {['month', 'week', 'day', 'agenda'].map(view => (
                                            <button
                                                key={view}
                                                onClick={() => props.onView(view)}
                                                className={`px-3 py-1.5 rounded-lg text-sm font-medium ${props.view === view
                                                    ? 'bg-blue-600 text-white'
                                                    : 'hover:bg-gray-100 dark:hover:bg-white/5'
                                                    }`}
                                            >
                                                {view.charAt(0).toUpperCase() + view.slice(1)}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )
                    }}
                />
            </div>

            {/* Legend */}
            <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-200 dark:border-white/10">
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-blue-500"></div>
                    <span className="text-sm font-sans text-gray-600 dark:text-gray-400">Booked</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-amber-500"></div>
                    <span className="text-sm font-sans text-gray-600 dark:text-gray-400">Maintenance</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-red-500"></div>
                    <span className="text-sm font-sans text-gray-600 dark:text-gray-400">Blocked</span>
                </div>
            </div>
        </SpotlightCard>
    );
};

// Main AdminRooms Component
const AdminRooms = () => {
    const [rooms, setRooms] = useState([
        {
            id: 1,
            number: '304',
            name: 'Deluxe City Suite',
            type: 'deluxe',
            floor: '3',
            beds: 1,
            maxGuests: 2,
            price: 399000,
            status: 'available',
            amenities: ['Wi-Fi', 'Smart TV', 'City View', 'Balcony', 'Coffee Maker'],
            description: 'Beautiful city view with balcony'
        },
        {
            id: 2,
            number: '201',
            name: 'Executive Penthouse',
            type: 'executive',
            floor: '2',
            beds: 1,
            maxGuests: 3,
            price: 850000,
            status: 'occupied',
            amenities: ['Wi-Fi', 'Smart TV', 'Minibar', 'Bathtub', '24/7 Room Service'],
            description: 'Spacious penthouse with separate living area'
        },
        {
            id: 3,
            number: '102',
            name: 'Urban Loft',
            type: 'standard',
            floor: '1',
            beds: 1,
            maxGuests: 2,
            price: 299000,
            status: 'cleaning',
            amenities: ['Wi-Fi', 'TV', 'Air Conditioning', 'Coffee Maker'],
            description: 'Comfortable urban loft'
        },
        {
            id: 4,
            number: '301',
            name: 'Presidential Suite',
            type: 'suite',
            floor: '3',
            beds: 2,
            maxGuests: 4,
            price: 1200000,
            status: 'available',
            amenities: ['Wi-Fi', 'Smart TV', 'Minibar', 'Bathtub', 'Balcony', '24/7 Room Service', 'Breakfast Included'],
            description: 'Luxurious presidential suite with panoramic views'
        },
        {
            id: 5,
            number: '202',
            name: 'Family Executive Room',
            type: 'executive',
            floor: '2',
            beds: 2,
            maxGuests: 4,
            price: 449000,
            status: 'reserved',
            amenities: ['Wi-Fi', 'Smart TV', 'Air Conditioning', 'Coffee Maker', 'Extra Bed Available'],
            description: 'Perfect for families with children'
        },
        {
            id: 6,
            number: 'V01',
            name: 'Garden Villa',
            type: 'villa',
            floor: 'G',
            beds: 2,
            maxGuests: 4,
            price: 520000,
            status: 'cleaning',
            amenities: ['Wi-Fi', 'Smart TV', 'Private Pool', 'Kitchen', 'Garden', 'Security'],
            description: 'Private villa with landscaped garden and pool'
        }
    ]);

    const [selectedRoom, setSelectedRoom] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedType, setSelectedType] = useState('all');
    const [selectedStatus, setSelectedStatus] = useState('all');

    const roomTypes = ['all', 'standard', 'deluxe', 'executive', 'suite', 'villa'];
    const statusTypes = ['all', 'available', 'occupied', 'maintenance', 'cleaning', 'reserved'];

    const handleEdit = (room) => {
        setSelectedRoom(room);
        setIsModalOpen(true);
    };

    const handleDelete = (roomId) => {
        if (window.confirm('Are you sure you want to delete this room?')) {
            setRooms(rooms.filter(room => room.id !== roomId));
        }
    };

    const handleToggleStatus = (roomId) => {
        setRooms(rooms.map(room => {
            if (room.id === roomId) {
                return {
                    ...room,
                    status: room.status === 'available' ? 'occupied' : 'available'
                };
            }
            return room;
        }));
    };

    const handleSaveRoom = (roomData) => {
        if (selectedRoom) {
            // Update existing room
            setRooms(rooms.map(room =>
                room.id === selectedRoom.id ? { ...roomData, id: room.id } : room
            ));
        } else {
            // Add new room
            const newRoom = {
                ...roomData,
                id: Math.max(...rooms.map(r => r.id)) + 1
            };
            setRooms([...rooms, newRoom]);
        }
        setIsModalOpen(false);
        setSelectedRoom(null);
    };

    const filteredRooms = rooms.filter(room => {
        const matchesSearch = room.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            room.number.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = selectedType === 'all' || room.type === selectedType;
        const matchesStatus = selectedStatus === 'all' || room.status === selectedStatus;
        return matchesSearch && matchesType && matchesStatus;
    });

    const stats = {
        total: rooms.length,
        available: rooms.filter(r => r.status === 'available').length,
        occupied: rooms.filter(r => r.status === 'occupied').length,
        revenue: rooms.reduce((sum, room) => sum + room.price, 0)
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-void p-4 sm:p-6 lg:p-8">
            <Helmet>
                <title>Rooms | Suave By Chloe</title>
                <meta name="robots" content="noindex, nofollow" />
            </Helmet>
            <div className="max-w-7xl mx-auto">
                {/* Page Header */}
                <div className="mb-8">
                    <span className="font-mono text-sm text-blue-500 tracking-widest uppercase mb-2 block">
                        ADMIN_ROOMS
                    </span>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <h1 className="font-serif text-3xl font-bold text-gray-900 dark:text-white mb-2">
                                Room Management
                            </h1>
                            <p className="font-sans text-gray-600 dark:text-gray-400">
                                Manage rooms, pricing, and availability
                            </p>
                        </div>
                        <Button
                            onClick={() => {
                                setSelectedRoom(null);
                                setIsModalOpen(true);
                            }}
                            className="px-6 py-3 whitespace-nowrap flex items-center gap-2"
                        >
                            <Plus size={20} />
                            Add New Room
                        </Button>
                    </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <SpotlightCard className="rounded-xl border bg-white border-gray-200 dark:bg-dark-800 dark:border-white/10 p-4">
                        <p className="text-sm font-sans text-gray-600 dark:text-gray-400 mb-1">Total Rooms</p>
                        <p className="text-2xl font-serif font-bold text-gray-900 dark:text-white">{stats.total}</p>
                    </SpotlightCard>
                    <SpotlightCard className="rounded-xl border bg-white border-gray-200 dark:bg-dark-800 dark:border-white/10 p-4">
                        <p className="text-sm font-sans text-gray-600 dark:text-gray-400 mb-1">Available</p>
                        <p className="text-2xl font-serif font-bold text-green-600 dark:text-green-400">{stats.available}</p>
                    </SpotlightCard>
                    <SpotlightCard className="rounded-xl border bg-white border-gray-200 dark:bg-dark-800 dark:border-white/10 p-4">
                        <p className="text-sm font-sans text-gray-600 dark:text-gray-400 mb-1">Occupied</p>
                        <p className="text-2xl font-serif font-bold text-red-600 dark:text-red-400">{stats.occupied}</p>
                    </SpotlightCard>
                    <SpotlightCard className="rounded-xl border bg-white border-gray-200 dark:bg-dark-800 dark:border-white/10 p-4">
                        <p className="text-sm font-sans text-gray-600 dark:text-gray-400 mb-1">Avg. Rate</p>
                        <p className="text-2xl font-serif font-bold text-gray-900 dark:text-white">
                            ${Math.round(stats.revenue / stats.total)}
                        </p>
                    </SpotlightCard>
                </div>

                {/* Search and Filter Bar */}
                <div className="mb-8">
                    <SpotlightCard className="rounded-2xl border bg-white border-gray-200 dark:bg-dark-800 dark:border-white/10 p-4">
                        <div className="flex flex-col md:flex-row md:items-center gap-4">
                            <div className="flex-1">
                                <Input
                                    type="text"
                                    placeholder="Search rooms by name or number..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    icon={Search}
                                />
                            </div>
                            <div className="flex flex-wrap gap-2">
                                <select
                                    value={selectedType}
                                    onChange={(e) => setSelectedType(e.target.value)}
                                    className="px-3 py-2 rounded-lg border border-gray-300 dark:border-white/10 bg-white dark:bg-dark-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    {roomTypes.map(type => (
                                        <option key={type} value={type}>
                                            {type === 'all' ? 'All Types' : type.charAt(0).toUpperCase() + type.slice(1)}
                                        </option>
                                    ))}
                                </select>
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
                                <Button variant="secondary" className="flex items-center gap-2">
                                    <Filter size={18} />
                                    More Filters
                                </Button>
                            </div>
                        </div>
                    </SpotlightCard>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                    {/* Rooms List */}
                    <div className="lg:col-span-2">
                        <SpotlightCard className="rounded-2xl border bg-white border-gray-200 dark:bg-dark-800 dark:border-white/10 p-6">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h3 className="font-serif text-xl font-bold text-gray-900 dark:text-white">
                                        All Rooms ({filteredRooms.length})
                                    </h3>
                                    <p className="text-sm font-sans text-gray-600 dark:text-gray-400">
                                        Click on a room to view details
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-sans text-gray-600 dark:text-gray-400">
                                        Showing {filteredRooms.length} of {rooms.length} rooms
                                    </span>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {filteredRooms.map(room => (
                                    <RoomCard
                                        key={room.id}
                                        room={room}
                                        onEdit={handleEdit}
                                        onDelete={handleDelete}
                                        onToggleStatus={handleToggleStatus}
                                    />
                                ))}
                            </div>

                            {filteredRooms.length === 0 && (
                                <div className="text-center py-12">
                                    <Home size={48} className="mx-auto text-gray-400 mb-4" />
                                    <p className="font-sans text-gray-600 dark:text-gray-400">
                                        No rooms found matching your criteria
                                    </p>
                                </div>
                            )}
                        </SpotlightCard>
                    </div>

                    {/* Room Details Sidebar */}
                    <div>
                        <SpotlightCard className="rounded-2xl border bg-white border-gray-200 dark:bg-dark-800 dark:border-white/10 p-6 sticky top-6">
                            <h3 className="font-serif text-xl font-bold text-gray-900 dark:text-white mb-6">
                                Room Details
                            </h3>

                            {selectedRoom ? (
                                <div className="space-y-6">
                                    <div className="aspect-video rounded-xl overflow-hidden">
                                        <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                                            <Home size={48} className="text-white" />
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="font-serif text-lg font-bold text-gray-900 dark:text-white mb-2">
                                            {selectedRoom.name}
                                        </h4>
                                        <div className="flex items-center gap-2 mb-3">
                                            <RoomTypeBadge type={selectedRoom.type} />
                                            <StatusBadge status={selectedRoom.status} />
                                        </div>
                                        <p className="text-sm font-sans text-gray-600 dark:text-gray-400">
                                            {selectedRoom.description}
                                        </p>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-xs font-sans text-gray-500 dark:text-gray-400 mb-1">Room Number</p>
                                                <p className="font-sans font-medium text-gray-900 dark:text-white">
                                                    {selectedRoom.number}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-xs font-sans text-gray-500 dark:text-gray-400 mb-1">Floor</p>
                                                <p className="font-sans font-medium text-gray-900 dark:text-white">
                                                    {selectedRoom.floor}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-xs font-sans text-gray-500 dark:text-gray-400 mb-1">Beds</p>
                                                <p className="font-sans font-medium text-gray-900 dark:text-white">
                                                    {selectedRoom.beds} {selectedRoom.beds === 1 ? 'Bed' : 'Beds'}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-xs font-sans text-gray-500 dark:text-gray-400 mb-1">Max Guests</p>
                                                <p className="font-sans font-medium text-gray-900 dark:text-white">
                                                    {selectedRoom.maxGuests}
                                                </p>
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-xs font-sans text-gray-500 dark:text-gray-400 mb-1">Nightly Rate</p>
                                            <p className="text-2xl font-serif font-bold text-gray-900 dark:text-white">
                                                ${selectedRoom.price}
                                            </p>
                                        </div>
                                    </div>

                                    <div>
                                        <p className="text-sm font-sans font-medium text-gray-900 dark:text-white mb-2">
                                            Amenities
                                        </p>
                                        <div className="flex flex-wrap gap-2">
                                            {selectedRoom.amenities.map((amenity, index) => (
                                                <span key={index} className="px-2 py-1 rounded-lg text-xs font-sans bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-gray-300">
                                                    {amenity}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="flex gap-3">
                                        <Button
                                            onClick={() => handleEdit(selectedRoom)}
                                            className="flex-1"
                                        >
                                            Edit Room
                                        </Button>
                                        <Button variant="secondary">
                                            View Calendar
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <Home size={48} className="mx-auto text-gray-400 mb-4" />
                                    <p className="font-sans text-gray-600 dark:text-gray-400 mb-4">
                                        Select a room to view details
                                    </p>
                                    <Button
                                        onClick={() => setIsModalOpen(true)}
                                    >
                                        Add New Room
                                    </Button>
                                </div>
                            )}
                        </SpotlightCard>
                    </div>
                </div>

                {/* Pricing Rules & Calendar */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {selectedRoom ? (
                        <>
                            <PricingRules room={selectedRoom} />
                            <AvailabilityCalendar room={selectedRoom} />
                        </>
                    ) : (
                        <>
                            <SpotlightCard className="rounded-2xl border bg-white border-gray-200 dark:bg-dark-800 dark:border-white/10 p-6">
                                <div className="text-center py-12">
                                    <Banknote size={48} className="mx-auto text-gray-400 mb-4" />
                                    <p className="font-sans text-gray-600 dark:text-gray-400">
                                        Select a room to manage pricing rules
                                    </p>
                                </div>
                            </SpotlightCard>
                            <SpotlightCard className="rounded-2xl border bg-white border-gray-200 dark:bg-dark-800 dark:border-white/10 p-6">
                                <div className="text-center py-12">
                                    <Calendar size={48} className="mx-auto text-gray-400 mb-4" />
                                    <p className="font-sans text-gray-600 dark:text-gray-400">
                                        Select a room to view availability calendar
                                    </p>
                                </div>
                            </SpotlightCard>
                        </>
                    )}
                </div>
            </div>

            {/* Room Modal */}
            <RoomModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setSelectedRoom(null);
                }}
                room={selectedRoom}
                onSave={handleSaveRoom}
            />
        </div>
    );
};

export default AdminRooms;