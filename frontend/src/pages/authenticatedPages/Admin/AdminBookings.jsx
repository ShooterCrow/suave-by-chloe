import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import {
    Search,
    Filter,
    Plus,
    Edit,
    Trash2,
    Calendar,
    DollarSign,
    Users,
    Check,
    X,
    MoreVertical,
    ChevronRight,
    ChevronDown,
    Eye,
    EyeOff,
    Clock,
    User,
    Phone,
    Mail,
    CreditCard,
    CheckCircle,
    XCircle,
    AlertCircle,
    TrendingUp,
    Download,
    RefreshCw,
    Receipt,
    Printer,
    Send,
    Copy,
    ExternalLink,
    Tag,
    Shield,
    Star,
    Home,
    Bed,
    Package,
    Coffee,
    Wifi,
    Banknote
} from 'lucide-react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Badge from '../../../components/ui/Badge';
import SpotlightCard from '../../../components/ui/SpotlightCard';

// Status Badge Component
const StatusBadge = ({ status }) => {
    const statusMap = {
        'confirmed': { variant: 'success', icon: CheckCircle },
        'pending': { variant: 'warning', icon: Clock },
        'cancelled': { variant: 'error', icon: XCircle },
        'checked-in': { variant: 'blue', icon: Check },
        'checked-out': { variant: 'neutral', icon: XCircle }, // Using neutral as gray replacement
        'no-show': { variant: 'rose', icon: AlertCircle },
        'modified': { variant: 'purple', icon: Edit }
    };
    const config = statusMap[status] || statusMap.pending;
    const Icon = config.icon;

    return (
        <Badge variant={config.variant} className="gap-1">
            <Icon size={12} />
            {status.charAt(0).toUpperCase() + status.slice(1)}
        </Badge>
    );
};

// PaymentStatusBadge Component
const PaymentStatusBadge = ({ status, amount }) => {
    const statusMap = {
        'paid': { variant: 'success', icon: CheckCircle },
        'pending': { variant: 'warning', icon: Clock },
        'partially_paid': { variant: 'blue', icon: Banknote },
        'refunded': { variant: 'neutral', icon: RefreshCw },
        'failed': { variant: 'error', icon: XCircle }
    };
    const config = statusMap[status] || statusMap.pending;
    const Icon = config.icon;

    return (
        <Badge variant={config.variant} className="gap-1">
            <Icon size={12} />
            {status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
            {amount && <span className="ml-1">₦{amount.toLocaleString()}</span>}
        </Badge>
    );
};

// BookingCard Component
const BookingCard = ({ booking, onView, onEdit, onCancel, onCheckIn }) => {
    const getTimeUntilCheckIn = (checkInDate) => {
        const now = new Date();
        const checkIn = new Date(checkInDate);
        const diffTime = checkIn - now;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays < 0) return 'Past due';
        if (diffDays === 0) return 'Today';
        if (diffDays === 1) return 'Tomorrow';
        return `In ${diffDays} days`;
    };

    return (
        <SpotlightCard className="rounded-2xl border bg-white border-gray-200 dark:bg-dark-800 dark:border-white/10 p-4 hover:border-blue-300 dark:hover:border-blue-500/50 transition-colors">
            <div className="flex items-start justify-between mb-3">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-serif text-lg font-bold text-gray-900 dark:text-white">
                            {booking.bookingId}
                        </h4>
                        <StatusBadge status={booking.status} />
                        <PaymentStatusBadge status={booking.paymentStatus} amount={booking.totalAmount} />
                    </div>
                    <p className="text-sm font-sans text-gray-600 dark:text-gray-400">
                        {booking.guestName} • {booking.roomType}
                    </p>
                </div>
                <div className="flex items-center gap-1">
                    <Button
                        onClick={() => onView(booking)}
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-gray-900 dark:text-white"
                    >
                        <Eye size={16} />
                    </Button>
                    {booking.status === 'confirmed' && (
                        <Button
                            onClick={() => onCheckIn(booking)}
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-gray-900 dark:text-white"
                        >
                            <Check size={16} />
                        </Button>
                    )}
                </div>
            </div>

            {/* Booking Details */}
            <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                    <p className="text-xs font-sans text-gray-500 dark:text-gray-400 mb-1">Dates</p>
                    <p className="text-sm font-sans font-medium text-gray-900 dark:text-white">
                        {booking.checkIn} - {booking.checkOut}
                    </p>
                </div>
                <div>
                    <p className="text-xs font-sans text-gray-500 dark:text-gray-400 mb-1">Nights</p>
                    <p className="text-sm font-sans font-medium text-gray-900 dark:text-white">
                        {booking.nights} nights
                    </p>
                </div>
            </div>

            <div className="flex items-center justify-between">
                <div>
                    <p className="text-xs font-sans text-gray-500 dark:text-gray-400 mb-1">Total Amount</p>
                    <p className="text-xl font-serif font-bold text-gray-900 dark:text-white">
                        ₦{booking.totalAmount.toLocaleString()}
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    {booking.status === 'confirmed' && (
                        <Button
                            onClick={() => onEdit(booking)}
                            size="sm"
                            className="bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 border-none"
                        >
                            Modify
                        </Button>
                    )}
                    {booking.status === 'confirmed' && (
                        <Button
                            onClick={() => onCancel(booking)}
                            variant="ghostDestructive"
                            size="sm"
                        >
                            Cancel
                        </Button>
                    )}
                </div>
            </div>

            {/* Time Indicator */}
            {booking.status === 'confirmed' && (
                <div className="mt-3 pt-3 border-t border-gray-200 dark:border-white/10">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-sans text-gray-500 dark:text-gray-400">
                            Check-in {getTimeUntilCheckIn(booking.checkIn)}
                        </span>
                        <span className="text-xs font-sans font-medium text-gray-900 dark:text-white">
                            Room {booking.roomNumber}
                        </span>
                    </div>
                </div>
            )}
        </SpotlightCard>
    );
};

// BookingDetailsModal Component
const BookingDetailsModal = ({ isOpen, onClose, booking, onAction }) => {
    const [activeTab, setActiveTab] = useState('details');

    if (!isOpen || !booking) return null;

    const tabs = [
        { id: 'details', label: 'Details' },
        { id: 'payment', label: 'Payment' },
        { id: 'notes', label: 'Notes' },
        { id: 'history', label: 'History' }
    ];

    const handlePrint = () => {
        window.print();
    };

    const handleSendConfirmation = () => {
        alert('Confirmation email sent to ' + booking.guestEmail);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white dark:bg-dark-800 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
                {/* Header */}
                <div className="p-6 border-b border-gray-200 dark:border-white/10">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="font-serif text-2xl font-bold text-gray-900 dark:text-white">
                                Booking Details
                            </h2>
                            <p className="text-sm font-sans text-gray-600 dark:text-gray-400">
                                {booking.bookingId} • {booking.guestName}
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button
                                onClick={handlePrint}
                                variant="ghost"
                                size="icon"
                                className="text-gray-900 dark:text-white"
                            >
                                <Printer size={20} />
                            </Button>
                            <Button
                                onClick={handleSendConfirmation}
                                variant="ghost"
                                size="icon"
                                className="text-gray-900 dark:text-white"
                            >
                                <Send size={20} />
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
                    {activeTab === 'details' && (
                        <div className="space-y-6">
                            {/* Status & Actions */}
                            <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-white/5">
                                <div className="flex items-center gap-4">
                                    <StatusBadge status={booking.status} />
                                    <PaymentStatusBadge status={booking.paymentStatus} />
                                </div>
                                <div className="flex items-center gap-2">
                                    {booking.status === 'confirmed' && (
                                        <Button
                                            onClick={() => onAction('check-in', booking)}
                                            variant="success"
                                        >
                                            Check-in
                                        </Button>
                                    )}
                                    {booking.status === 'checked-in' && (
                                        <Button
                                            onClick={() => onAction('check-out', booking)}
                                            variant="primary"
                                        >
                                            Check-out
                                        </Button>
                                    )}
                                    <Button
                                        onClick={() => onAction('modify', booking)}
                                        variant="secondary"
                                    >
                                        Modify
                                    </Button>
                                </div>
                            </div>

                            {/* Guest Information */}
                            <div>
                                <h3 className="font-serif text-lg font-bold text-gray-900 dark:text-white mb-4">
                                    Guest Information
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-3">
                                        <div>
                                            <p className="text-xs font-sans text-gray-500 dark:text-gray-400">Full Name</p>
                                            <p className="font-sans font-medium text-gray-900 dark:text-white">{booking.guestName}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs font-sans text-gray-500 dark:text-gray-400">Email</p>
                                            <p className="font-sans font-medium text-gray-900 dark:text-white">{booking.guestEmail}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs font-sans text-gray-500 dark:text-gray-400">Phone</p>
                                            <p className="font-sans font-medium text-gray-900 dark:text-white">{booking.guestPhone}</p>
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <div>
                                            <p className="text-xs font-sans text-gray-500 dark:text-gray-400">Nationality</p>
                                            <p className="font-sans font-medium text-gray-900 dark:text-white">{booking.nationality || 'Not specified'}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs font-sans text-gray-500 dark:text-gray-400">Special Requests</p>
                                            <p className="font-sans font-medium text-gray-900 dark:text-white">{booking.specialRequests || 'None'}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs font-sans text-gray-500 dark:text-gray-400">Source</p>
                                            <p className="font-sans font-medium text-gray-900 dark:text-white">{booking.source}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Stay Details */}
                            <div>
                                <h3 className="font-serif text-lg font-bold text-gray-900 dark:text-white mb-4">
                                    Stay Details
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-3">
                                        <div>
                                            <p className="text-xs font-sans text-gray-500 dark:text-gray-400">Check-in</p>
                                            <p className="font-sans font-medium text-gray-900 dark:text-white">{booking.checkIn}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs font-sans text-gray-500 dark:text-gray-400">Check-out</p>
                                            <p className="font-sans font-medium text-gray-900 dark:text-white">{booking.checkOut}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs font-sans text-gray-500 dark:text-gray-400">Nights</p>
                                            <p className="font-sans font-medium text-gray-900 dark:text-white">{booking.nights} nights</p>
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <div>
                                            <p className="text-xs font-sans text-gray-500 dark:text-gray-400">Room</p>
                                            <p className="font-sans font-medium text-gray-900 dark:text-white">{booking.roomType} (Room {booking.roomNumber})</p>
                                        </div>
                                        <div>
                                            <p className="text-xs font-sans text-gray-500 dark:text-gray-400">Guests</p>
                                            <p className="font-sans font-medium text-gray-900 dark:text-white">{booking.adults} adults, {booking.children} children</p>
                                        </div>
                                        <div>
                                            <p className="text-xs font-sans text-gray-500 dark:text-gray-400">Booked On</p>
                                            <p className="font-sans font-medium text-gray-900 dark:text-white">{booking.bookedDate}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'payment' && (
                        <div className="space-y-6">
                            <div>
                                <h3 className="font-serif text-lg font-bold text-gray-900 dark:text-white mb-4">
                                    Payment Summary
                                </h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center p-3 rounded-lg bg-gray-50 dark:bg-white/5">
                                        <span className="font-sans text-gray-700 dark:text-gray-300">Room Rate</span>
                                        <span className="font-sans font-medium text-gray-900 dark:text-white">₦{booking.roomRate.toLocaleString()} × {booking.nights} nights</span>
                                    </div>
                                    <div className="flex justify-between items-center p-3 rounded-lg bg-gray-50 dark:bg-white/5">
                                        <span className="font-sans text-gray-700 dark:text-gray-300">Taxes & Fees</span>
                                        <span className="font-sans font-medium text-gray-900 dark:text-white">₦{booking.taxes.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between items-center p-3 rounded-lg bg-gray-50 dark:bg-white/5">
                                        <span className="font-sans text-gray-700 dark:text-gray-300">Additional Services</span>
                                        <span className="font-sans font-medium text-gray-900 dark:text-white">₦{booking.services.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between items-center p-3 border-t border-gray-200 dark:border-white/10 pt-4">
                                        <span className="font-serif text-lg font-bold text-gray-900 dark:text-white">Total Amount</span>
                                        <span className="font-serif text-2xl font-bold text-gray-900 dark:text-white">₦{booking.totalAmount.toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 className="font-serif text-lg font-bold text-gray-900 dark:text-white mb-4">
                                    Payment History
                                </h3>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-white/10">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                                                <CheckCircle size={20} className="text-green-600 dark:text-green-400" />
                                            </div>
                                            <div>
                                                <p className="font-sans font-medium text-gray-900 dark:text-white">Deposit Payment</p>
                                                <p className="text-xs font-sans text-gray-500 dark:text-gray-400">Paid via Credit Card • {booking.bookedDate}</p>
                                            </div>
                                        </div>
                                        <span className="font-sans font-bold text-green-600 dark:text-green-400">₦{booking.deposit.toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <Button variant="primary">
                                    Process Refund
                                </Button>
                                <Button variant="secondary">
                                    Add Payment
                                </Button>
                            </div>
                        </div>
                    )}

                    {activeTab === 'notes' && (
                        <div className="space-y-6">
                            <div>
                                <h3 className="font-serif text-lg font-bold text-gray-900 dark:text-white mb-4">
                                    Internal Notes
                                </h3>
                                <textarea
                                    className="w-full h-32 px-4 py-3 rounded-lg border border-gray-300 dark:border-white/10 bg-white dark:bg-dark-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Add internal notes about this booking..."
                                    defaultValue={booking.internalNotes || ''}
                                />
                                <button className="mt-3 px-4 py-2 rounded-lg font-sans font-medium transition-colors bg-blue-600 dark:bg-blue-500 text-white hover:bg-blue-700 dark:hover:bg-blue-600">
                                    Save Notes
                                </button>
                            </div>

                            <div>
                                <h3 className="font-serif text-lg font-bold text-gray-900 dark:text-white mb-4">
                                    Previous Notes
                                </h3>
                                <div className="space-y-3">
                                    <div className="p-3 rounded-lg border border-gray-200 dark:border-white/10">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-sm font-sans font-medium text-gray-900 dark:text-white">Sarah Johnson (Front Desk)</span>
                                            <span className="text-xs font-sans text-gray-500 dark:text-gray-400">2 hours ago</span>
                                        </div>
                                        <p className="text-sm font-sans text-gray-600 dark:text-gray-400">
                                            Guest requested early check-in at 12 PM. Room should be ready by 11:30 AM.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'history' && (
                        <div className="space-y-6">
                            <h3 className="font-serif text-lg font-bold text-gray-900 dark:text-white mb-4">
                                Activity History
                            </h3>
                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <div className="w-2 h-2 mt-2 rounded-full bg-blue-500"></div>
                                    <div className="flex-1">
                                        <p className="font-sans font-medium text-gray-900 dark:text-white">Booking created</p>
                                        <p className="text-sm font-sans text-gray-500 dark:text-gray-400">{booking.bookedDate} by {booking.guestName}</p>
                                    </div>
                                    <span className="text-xs font-sans text-gray-500 dark:text-gray-400">{booking.bookedDate}</span>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="w-2 h-2 mt-2 rounded-full bg-green-500"></div>
                                    <div className="flex-1">
                                        <p className="font-sans font-medium text-gray-900 dark:text-white">Deposit paid</p>
                                        <p className="text-sm font-sans text-gray-500 dark:text-gray-400">₦{booking.deposit.toLocaleString()} via Credit Card</p>
                                    </div>
                                    <span className="text-xs font-sans text-gray-500 dark:text-gray-400">{booking.bookedDate}</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-gray-200 dark:border-white/10">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 text-gray-900 dark:text-white">
                                <Copy size={18} />
                            </button>
                            <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 text-gray-900 dark:text-white">
                                <ExternalLink size={18} />
                            </button>
                            <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 text-gray-900 dark:text-white">
                                <Receipt size={18} />
                            </button>
                        </div>
                        <div className="flex gap-3">
                            {booking.status === 'confirmed' && (
                                <button
                                    onClick={() => onAction('cancel', booking)}
                                    className="px-4 py-2 rounded-lg font-sans font-medium transition-colors bg-red-600 dark:bg-red-500 text-white hover:bg-red-700 dark:hover:bg-red-600"
                                >
                                    Cancel Booking
                                </button>
                            )}
                            <button
                                onClick={() => onAction('modify', booking)}
                                className="px-4 py-2 rounded-lg font-sans font-medium transition-colors bg-blue-600 dark:bg-blue-500 text-white hover:bg-blue-700 dark:hover:bg-blue-600"
                            >
                                Modify Booking
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// ManualBookingModal Component
const ManualBookingModal = ({ isOpen, onClose, onSave }) => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        // Step 1: Guest Details
        guestName: '',
        guestEmail: '',
        guestPhone: '',
        nationality: '',
        specialRequests: '',

        // Step 2: Stay Details
        roomType: 'deluxe',
        adults: 2,
        children: 0,
        checkIn: '',
        checkOut: '',
        nights: 1,

        // Step 3: Payment Details
        roomRate: 299000,
        taxes: 45000,
        services: 0,
        deposit: 0,
        paymentMethod: 'credit_card',
        paymentStatus: 'pending'
    });

    const roomTypes = [
        { value: 'deluxe', label: 'Deluxe City View', price: 299000 },
        { value: 'executive', label: 'Executive Suite', price: 399000 },
        { value: 'standard', label: 'Standard King', price: 199000 },
        { value: 'suite', label: 'Presidential Suite', price: 599000 },
        { value: 'villa', label: 'Garden Villa', price: 899000 }
    ];

    const calculateTotal = () => {
        const roomTotal = formData.roomRate * formData.nights;
        const total = roomTotal + formData.taxes + formData.services;
        return {
            roomTotal,
            total
        };
    };

    const handleNext = () => {
        if (step < 3) {
            setStep(step + 1);
        } else {
            // Generate booking ID
            const bookingId = 'RES-' + Math.random().toString(36).substr(2, 9).toUpperCase();
            const bookingData = {
                ...formData,
                bookingId,
                totalAmount: calculateTotal().total,
                status: 'confirmed',
                bookedDate: new Date().toISOString().split('T')[0],
                source: 'manual',
                roomNumber: Math.floor(Math.random() * 100) + 100
            };
            onSave(bookingData);
            onClose();
        }
    };

    const handleBack = () => {
        if (step > 1) {
            setStep(step - 1);
        }
    };

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white dark:bg-dark-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
                {/* Header */}
                <div className="p-6 border-b border-gray-200 dark:border-white/10">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="font-serif text-2xl font-bold text-gray-900 dark:text-white">
                                Create Manual Booking
                            </h2>
                            <p className="text-sm font-sans text-gray-600 dark:text-gray-400">
                                Step {step} of 3 • {step === 1 ? 'Guest Details' : step === 2 ? 'Stay Details' : 'Payment'}
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 text-gray-900 dark:text-white"
                        >
                            <X size={24} />
                        </button>
                    </div>

                    {/* Progress Steps */}
                    <div className="flex items-center justify-between mt-6">
                        {[1, 2, 3].map((stepNum) => (
                            <div key={stepNum} className="flex items-center">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= stepNum
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-200 dark:bg-white/10 text-gray-500 dark:text-gray-400'
                                    }`}>
                                    {stepNum}
                                </div>
                                {stepNum < 3 && (
                                    <div className={`w-16 h-1 mx-2 ${step > stepNum ? 'bg-blue-600' : 'bg-gray-200 dark:bg-white/10'}`}></div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Form Content */}
                <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
                    {step === 1 && (
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-sans font-medium text-gray-900 dark:text-white mb-2">
                                    Guest Name *
                                </label>
                                <Input
                                    type="text"
                                    value={formData.guestName}
                                    onChange={(e) => handleChange('guestName', e.target.value)}
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-sans font-medium text-gray-900 dark:text-white mb-2">
                                        Email *
                                    </label>
                                    <Input
                                        type="email"
                                        value={formData.guestEmail}
                                        onChange={(e) => handleChange('guestEmail', e.target.value)}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-sans font-medium text-gray-900 dark:text-white mb-2">
                                        Phone *
                                    </label>
                                    <Input
                                        type="tel"
                                        value={formData.guestPhone}
                                        onChange={(e) => handleChange('guestPhone', e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-sans font-medium text-gray-900 dark:text-white mb-2">
                                    Nationality
                                </label>
                                <Input
                                    type="text"
                                    value={formData.nationality}
                                    onChange={(e) => handleChange('nationality', e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-sans font-medium text-gray-900 dark:text-white mb-2">
                                    Special Requests
                                </label>
                                <textarea
                                    value={formData.specialRequests}
                                    onChange={(e) => handleChange('specialRequests', e.target.value)}
                                    rows="3"
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-white/10 bg-white dark:bg-dark-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-sans font-medium text-gray-900 dark:text-white mb-2">
                                    Room Type *
                                </label>
                                <select
                                    value={formData.roomType}
                                    onChange={(e) => {
                                        const selected = roomTypes.find(rt => rt.value === e.target.value);
                                        handleChange('roomType', e.target.value);
                                        handleChange('roomRate', selected.price);
                                    }}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-white/10 bg-white dark:bg-dark-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    {roomTypes.map(type => (
                                        <option key={type.value} value={type.value}>
                                            {type.label} - ₦{type.price.toLocaleString()}/night
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-sans font-medium text-gray-900 dark:text-white mb-2">
                                        Adults *
                                    </label>
                                    <input
                                        type="number"
                                        value={formData.adults}
                                        onChange={(e) => handleChange('adults', parseInt(e.target.value))}
                                        min="1"
                                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-white/10 bg-white dark:bg-dark-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-sans font-medium text-gray-900 dark:text-white mb-2">
                                        Children
                                    </label>
                                    <input
                                        type="number"
                                        value={formData.children}
                                        onChange={(e) => handleChange('children', parseInt(e.target.value))}
                                        min="0"
                                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-white/10 bg-white dark:bg-dark-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-sans font-medium text-gray-900 dark:text-white mb-2">
                                        Check-in Date *
                                    </label>
                                    <input
                                        type="date"
                                        value={formData.checkIn}
                                        onChange={(e) => handleChange('checkIn', e.target.value)}
                                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-white/10 bg-white dark:bg-dark-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-sans font-medium text-gray-900 dark:text-white mb-2">
                                        Check-out Date *
                                    </label>
                                    <input
                                        type="date"
                                        value={formData.checkOut}
                                        onChange={(e) => {
                                            const checkIn = new Date(formData.checkIn);
                                            const checkOut = new Date(e.target.value);
                                            const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
                                            handleChange('checkOut', e.target.value);
                                            handleChange('nights', nights > 0 ? nights : 1);
                                        }}
                                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-white/10 bg-white dark:bg-dark-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        required
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-sans font-medium text-gray-900 dark:text-white mb-2">
                                    Nights
                                </label>
                                <input
                                    type="number"
                                    value={formData.nights}
                                    readOnly
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white"
                                />
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="space-y-4">
                            <div className="p-4 rounded-lg bg-gray-50 dark:bg-white/5">
                                <h3 className="font-serif text-lg font-bold text-gray-900 dark:text-white mb-3">
                                    Booking Summary
                                </h3>
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span className="font-sans text-gray-600 dark:text-gray-400">Room Rate</span>
                                        <span className="font-sans font-medium text-gray-900 dark:text-white">
                                            ₦{formData.roomRate.toLocaleString()} × {formData.nights} nights
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="font-sans text-gray-600 dark:text-gray-400">Taxes & Fees</span>
                                        <span className="font-sans font-medium text-gray-900 dark:text-white">₦{formData.taxes.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="font-sans text-gray-600 dark:text-gray-400">Additional Services</span>
                                        <span className="font-sans font-medium text-gray-900 dark:text-white">₦{formData.services.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between pt-2 border-t border-gray-200 dark:border-white/10">
                                        <span className="font-serif font-bold text-gray-900 dark:text-white">Total Amount</span>
                                        <span className="font-serif text-xl font-bold text-gray-900 dark:text-white">
                                            ₦{calculateTotal().total.toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-sans font-medium text-gray-900 dark:text-white mb-2">
                                    Deposit Amount
                                </label>
                                <div className="relative">
                                    <div className="absolute left-3 top-1/2 -translate-y-1/2">
                                        <Banknote size={20} className="text-gray-400" />
                                    </div>
                                    <input
                                        type="number"
                                        value={formData.deposit}
                                        onChange={(e) => handleChange('deposit', parseFloat(e.target.value))}
                                        min="0"
                                        max={calculateTotal().total}
                                        step="0.01"
                                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-white/10 bg-white dark:bg-dark-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-sans font-medium text-gray-900 dark:text-white mb-2">
                                    Payment Method
                                </label>
                                <select
                                    value={formData.paymentMethod}
                                    onChange={(e) => handleChange('paymentMethod', e.target.value)}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-white/10 bg-white dark:bg-dark-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="credit_card">Credit Card</option>
                                    <option value="cash">Cash</option>
                                    <option value="bank_transfer">Bank Transfer</option>
                                    <option value="paypal">PayPal</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-sans font-medium text-gray-900 dark:text-white mb-2">
                                    Payment Status
                                </label>
                                <select
                                    value={formData.paymentStatus}
                                    onChange={(e) => handleChange('paymentStatus', e.target.value)}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-white/10 bg-white dark:bg-dark-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="pending">Pending</option>
                                    <option value="paid">Paid</option>
                                    <option value="partially_paid">Partially Paid</option>
                                </select>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-gray-200 dark:border-white/10">
                    <div className="flex justify-between">
                        <Button
                            onClick={handleBack}
                            disabled={step === 1}
                            variant="secondary"
                            className={step === 1 ? 'opacity-50 cursor-not-allowed' : ''}
                        >
                            Back
                        </Button>
                        <Button
                            onClick={handleNext}
                        >
                            {step === 3 ? 'Create Booking' : 'Continue'}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Main AdminBookings Component
const AdminBookings = () => {
    const [bookings, setBookings] = useState([
        {
            id: 1,
            bookingId: 'RES-789012',
            guestName: 'Michael Chen',
            guestEmail: 'michael@example.com',
            guestPhone: '+1 (555) 123-4567',
            roomType: 'Deluxe City Suite',
            roomNumber: '101',
            checkIn: '2024-06-15',
            checkOut: '2024-06-20',
            nights: 5,
            adults: 2,
            children: 0,
            status: 'confirmed',
            paymentStatus: 'paid',
            totalAmount: 1497,
            roomRate: 299,
            taxes: 45,
            services: 0,
            deposit: 500,
            bookedDate: '2024-05-20',
            source: 'website',
            specialRequests: 'Early check-in requested',
            nationality: 'USA'
        },
        {
            id: 2,
            bookingId: 'RES-789013',
            guestName: 'Sarah Wilson',
            guestEmail: 'sarah@example.com',
            guestPhone: '+1 (555) 234-5678',
            roomType: 'Executive Penthouse',
            roomNumber: '201',
            checkIn: '2024-06-18',
            checkOut: '2024-06-23',
            nights: 5,
            adults: 3,
            children: 1,
            status: 'pending',
            paymentStatus: 'pending',
            totalAmount: 2125,
            roomRate: 399,
            taxes: 50,
            services: 0,
            deposit: 0,
            bookedDate: '2024-06-01',
            source: 'phone',
            specialRequests: 'Extra bed for child',
            nationality: 'Canada'
        },
        {
            id: 3,
            bookingId: 'RES-789014',
            guestName: 'Robert Davis',
            guestEmail: 'robert@example.com',
            guestPhone: '+1 (555) 345-6789',
            roomType: 'Standard King',
            roomNumber: '102',
            checkIn: '2024-06-12',
            checkOut: '2024-06-14',
            nights: 2,
            adults: 1,
            children: 0,
            status: 'checked-in',
            paymentStatus: 'paid',
            totalAmount: 398,
            roomRate: 199,
            taxes: 20,
            services: 0,
            deposit: 200,
            bookedDate: '2024-06-01',
            source: 'booking.com',
            specialRequests: 'None',
            nationality: 'UK'
        },
        {
            id: 4,
            bookingId: 'RES-789015',
            guestName: 'Emily Johnson',
            guestEmail: 'emily@example.com',
            guestPhone: '+1 (555) 456-7890',
            roomType: 'Garden Villa',
            roomNumber: 'V01',
            checkIn: '2024-06-25',
            checkOut: '2024-06-29',
            nights: 4,
            adults: 2,
            children: 2,
            status: 'confirmed',
            paymentStatus: 'partially_paid',
            totalAmount: 3596,
            roomRate: 899,
            taxes: 90,
            services: 0,
            deposit: 1000,
            bookedDate: '2024-05-15',
            source: 'direct',
            specialRequests: 'Anniversary celebration',
            nationality: 'Australia'
        },
        {
            id: 5,
            bookingId: 'RES-789016',
            guestName: 'James Miller',
            guestEmail: 'james@example.com',
            guestPhone: '+1 (555) 567-8901',
            roomType: 'Deluxe City Suite',
            roomNumber: '103',
            checkIn: '2024-06-10',
            checkOut: '2024-06-12',
            nights: 2,
            adults: 2,
            children: 0,
            status: 'cancelled',
            paymentStatus: 'refunded',
            totalAmount: 598,
            roomRate: 299,
            taxes: 30,
            services: 0,
            deposit: 300,
            bookedDate: '2024-05-25',
            source: 'website',
            specialRequests: 'None',
            nationality: 'Germany'
        },
        {
            id: 6,
            bookingId: 'RES-789017',
            guestName: 'Lisa Thompson',
            guestEmail: 'lisa@example.com',
            guestPhone: '+1 (555) 678-9012',
            roomType: 'Presidential Suite',
            roomNumber: '301',
            checkIn: '2024-06-28',
            checkOut: '2024-07-05',
            nights: 7,
            adults: 2,
            children: 0,
            status: 'confirmed',
            paymentStatus: 'paid',
            totalAmount: 4193,
            roomRate: 599,
            taxes: 105,
            services: 0,
            deposit: 1500,
            bookedDate: '2024-06-05',
            source: 'travel_agent',
            specialRequests: 'Champagne on arrival',
            nationality: 'France'
        },
        {
            id: 7,
            bookingId: 'RES-789018',
            guestName: 'David Wilson',
            guestEmail: 'david@example.com',
            guestPhone: '+1 (555) 789-0123',
            roomType: 'Standard Queen',
            roomNumber: '104',
            checkIn: '2024-06-09',
            checkOut: '2024-06-10',
            nights: 1,
            adults: 1,
            children: 0,
            status: 'checked-out',
            paymentStatus: 'paid',
            totalAmount: 199,
            roomRate: 199,
            taxes: 10,
            services: 20,
            deposit: 100,
            bookedDate: '2024-06-01',
            source: 'website',
            specialRequests: 'Late checkout',
            nationality: 'USA'
        },
        {
            id: 8,
            bookingId: 'RES-789019',
            guestName: 'Maria Garcia',
            guestEmail: 'maria@example.com',
            guestPhone: '+1 (555) 890-1234',
            roomType: 'Family Room',
            roomNumber: '202',
            checkIn: '2024-06-22',
            checkOut: '2024-06-27',
            nights: 5,
            adults: 2,
            children: 3,
            status: 'no-show',
            paymentStatus: 'failed',
            totalAmount: 1245,
            roomRate: 249,
            taxes: 50,
            services: 0,
            deposit: 0,
            bookedDate: '2024-06-10',
            source: 'expedia',
            specialRequests: 'Connecting rooms',
            nationality: 'Spain'
        }
    ]);

    const [selectedBooking, setSelectedBooking] = useState(null);
    const [detailsModalOpen, setDetailsModalOpen] = useState(false);
    const [manualBookingModalOpen, setManualBookingModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('all');
    const [selectedSource, setSelectedSource] = useState('all');
    const [dateRange, setDateRange] = useState({ start: '', end: '' });

    const statusTypes = ['all', 'confirmed', 'pending', 'checked-in', 'checked-out', 'cancelled', 'no-show'];
    const sources = ['all', 'website', 'phone', 'booking.com', 'expedia', 'direct', 'travel_agent'];

    const handleViewDetails = (booking) => {
        setSelectedBooking(booking);
        setDetailsModalOpen(true);
    };

    const handleEditBooking = (booking) => {
        setSelectedBooking(booking);
        // Open edit modal or form
        alert('Edit booking: ' + booking.bookingId);
    };

    const handleCancelBooking = (booking) => {
        if (window.confirm(`Are you sure you want to cancel booking ${booking.bookingId}?`)) {
            setBookings(bookings.map(b =>
                b.id === booking.id
                    ? { ...b, status: 'cancelled', paymentStatus: 'refunded' }
                    : b
            ));
        }
    };

    const handleCheckIn = (booking) => {
        setBookings(bookings.map(b =>
            b.id === booking.id
                ? { ...b, status: 'checked-in' }
                : b
        ));
    };

    const handleAction = (action, booking) => {
        switch (action) {
            case 'check-in':
                handleCheckIn(booking);
                break;
            case 'check-out':
                setBookings(bookings.map(b =>
                    b.id === booking.id
                        ? { ...b, status: 'checked-out' }
                        : b
                ));
                break;
            case 'modify':
                handleEditBooking(booking);
                break;
            case 'cancel':
                handleCancelBooking(booking);
                break;
        }
        setDetailsModalOpen(false);
    };

    const handleCreateManualBooking = (bookingData) => {
        const newBooking = {
            ...bookingData,
            id: bookings.length + 1
        };
        setBookings([newBooking, ...bookings]);
    };

    const handleExportBookings = () => {
        alert('Exporting bookings...');
        // Implement CSV/Excel export
    };

    const filteredBookings = bookings.filter(booking => {
        const matchesSearch =
            booking.guestName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            booking.bookingId.toLowerCase().includes(searchTerm.toLowerCase()) ||
            booking.guestEmail.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = selectedStatus === 'all' || booking.status === selectedStatus;
        const matchesSource = selectedSource === 'all' || booking.source === selectedSource;

        const matchesDate = !dateRange.start || !dateRange.end ||
            (booking.checkIn >= dateRange.start && booking.checkIn <= dateRange.end);

        return matchesSearch && matchesStatus && matchesSource && matchesDate;
    });

    const stats = {
        total: bookings.length,
        confirmed: bookings.filter(b => b.status === 'confirmed').length,
        checkedIn: bookings.filter(b => b.status === 'checked-in').length,
        cancelled: bookings.filter(b => b.status === 'cancelled').length,
        revenue: bookings.filter(b => b.status !== 'cancelled').reduce((sum, b) => sum + b.totalAmount, 0),
        occupancy: Math.round((bookings.filter(b => ['checked-in', 'confirmed'].includes(b.status)).length / 45) * 100) // Assuming 45 total rooms
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-void">
            <Helmet>
                <title>Bookings | Suave By Chloe</title>
                <meta name="robots" content="noindex, nofollow" />
            </Helmet>
            <div className="max-w-7xl mx-auto">
                {/* Page Header */}
                <div className="mb-8">
                    <span className="font-mono text-sm text-blue-500 tracking-widest uppercase mb-2 block">
                        ADMIN_BOOKINGS
                    </span>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <h1 className="font-serif text-3xl font-bold text-gray-900 dark:text-white mb-2">
                                Booking Management
                            </h1>
                            <p className="font-sans text-gray-600 dark:text-gray-400">
                                Manage reservations, check-ins, and payments
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <Button
                                onClick={() => setManualBookingModalOpen(true)}
                                variant="success"
                                className="px-6 py-3 whitespace-nowrap flex items-center gap-2"
                            >
                                <Plus size={20} />
                                Manual Booking
                            </Button>
                            <Button
                                onClick={handleExportBookings}
                                variant="secondary"
                                className="px-4 py-3 flex items-center gap-2"
                            >
                                <Download size={18} />
                                Export
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-8">
                    <SpotlightCard className="rounded-xl border bg-white border-gray-200 dark:bg-dark-800 dark:border-white/10 p-4">
                        <p className="text-sm font-sans text-gray-600 dark:text-gray-400 mb-1">Total Bookings</p>
                        <p className="text-2xl font-serif font-bold text-gray-900 dark:text-white">{stats.total}</p>
                    </SpotlightCard>
                    <SpotlightCard className="rounded-xl border bg-white border-gray-200 dark:bg-dark-800 dark:border-white/10 p-4">
                        <p className="text-sm font-sans text-gray-600 dark:text-gray-400 mb-1">Confirmed</p>
                        <p className="text-2xl font-serif font-bold text-blue-600 dark:text-blue-400">{stats.confirmed}</p>
                    </SpotlightCard>
                    <SpotlightCard className="rounded-xl border bg-white border-gray-200 dark:bg-dark-800 dark:border-white/10 p-4">
                        <p className="text-sm font-sans text-gray-600 dark:text-gray-400 mb-1">Checked In</p>
                        <p className="text-2xl font-serif font-bold text-green-600 dark:text-green-400">{stats.checkedIn}</p>
                    </SpotlightCard>
                    <SpotlightCard className="rounded-xl border bg-white border-gray-200 dark:bg-dark-800 dark:border-white/10 p-4">
                        <p className="text-sm font-sans text-gray-600 dark:text-gray-400 mb-1">Cancelled</p>
                        <p className="text-2xl font-serif font-bold text-red-600 dark:text-red-400">{stats.cancelled}</p>
                    </SpotlightCard>
                    <SpotlightCard className="rounded-xl border bg-white border-gray-200 dark:bg-dark-800 dark:border-white/10 p-4">
                        <p className="text-sm font-sans text-gray-600 dark:text-gray-400 mb-1">Revenue</p>
                        <p className="text-2xl font-serif font-bold text-gray-900 dark:text-white">
                            ${(stats.revenue / 1000).toFixed(1)}k
                        </p>
                    </SpotlightCard>
                    <SpotlightCard className="rounded-xl border bg-white border-gray-200 dark:bg-dark-800 dark:border-white/10 p-4">
                        <p className="text-sm font-sans text-gray-600 dark:text-gray-400 mb-1">Occupancy</p>
                        <p className="text-2xl font-serif font-bold text-gray-900 dark:text-white">{stats.occupancy}%</p>
                    </SpotlightCard>
                </div>

                {/* Search and Filter Bar */}
                <div className="mb-8">
                    <SpotlightCard className="rounded-2xl border bg-white border-gray-200 dark:bg-dark-800 dark:border-white/10 p-4">
                        <div className="flex flex-col md:flex-row md:items-center gap-4">
                            <div className="flex-1">
                                <div className="relative">
                                    <Input
                                        type="text"
                                        placeholder="Search by guest name, booking ID, or email..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        icon={Search}
                                    />
                                </div>
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
                                    value={selectedSource}
                                    onChange={(e) => setSelectedSource(e.target.value)}
                                    className="px-3 py-2 rounded-lg border border-gray-300 dark:border-white/10 bg-white dark:bg-dark-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    {sources.map(source => (
                                        <option key={source} value={source}>
                                            {source === 'all' ? 'All Sources' : source.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                        </option>
                                    ))}
                                </select>
                                <div className="flex gap-2">
                                    <input
                                        type="date"
                                        value={dateRange.start}
                                        onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                                        className="px-3 py-2 rounded-lg border border-gray-300 dark:border-white/10 bg-white dark:bg-dark-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Check-in from"
                                    />
                                    <input
                                        type="date"
                                        value={dateRange.end}
                                        onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                                        className="px-3 py-2 rounded-lg border border-gray-300 dark:border-white/10 bg-white dark:bg-dark-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Check-in to"
                                    />
                                </div>
                                <Button variant="secondary" className="flex items-center gap-2">
                                    <Filter size={18} />
                                    More Filters
                                </Button>
                            </div>
                        </div>
                    </SpotlightCard>
                </div>

                {/* Bookings Grid */}
                <div className="mb-8">
                    <SpotlightCard className="rounded-2xl border bg-white border-gray-200 dark:bg-dark-800 dark:border-white/10 p-6">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h3 className="font-serif text-xl font-bold text-gray-900 dark:text-white">
                                    All Bookings ({filteredBookings.length})
                                </h3>
                                <p className="text-sm font-sans text-gray-600 dark:text-gray-400">
                                    Showing bookings matching your criteria
                                </p>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-sans text-gray-600 dark:text-gray-400">
                                    Updated just now
                                </span>
                                <Button variant="ghost" size="icon" className="text-gray-900 dark:text-white">
                                    <RefreshCw size={18} />
                                </Button>
                            </div>
                        </div>

                        {filteredBookings.length === 0 ? (
                            <div className="text-center py-12">
                                <Calendar size={48} className="mx-auto text-gray-400 mb-4" />
                                <p className="font-sans text-gray-600 dark:text-gray-400 mb-4">
                                    No bookings found matching your criteria
                                </p>
                                <button
                                    onClick={() => setManualBookingModalOpen(true)}
                                    className="px-4 py-2 rounded-lg font-sans font-medium transition-colors bg-blue-600 dark:bg-blue-500 text-white hover:bg-blue-700 dark:hover:bg-blue-600"
                                >
                                    Create Your First Booking
                                </button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                {filteredBookings.map(booking => (
                                    <BookingCard
                                        key={booking.id}
                                        booking={booking}
                                        onView={handleViewDetails}
                                        onEdit={handleEditBooking}
                                        onCancel={handleCancelBooking}
                                        onCheckIn={handleCheckIn}
                                    />
                                ))}
                            </div>
                        )}
                    </SpotlightCard>
                </div>

                {/* Recent Activity */}
                <SpotlightCard className="rounded-2xl border bg-white border-gray-200 dark:bg-dark-800 dark:border-white/10 p-6">
                    <h3 className="font-serif text-xl font-bold text-gray-900 dark:text-white mb-6">
                        Today's Activity
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-4">
                            <h4 className="font-sans font-medium text-gray-900 dark:text-white mb-3">Check-ins Today</h4>
                            {bookings
                                .filter(b => b.checkIn === new Date().toISOString().split('T')[0])
                                .slice(0, 3)
                                .map(booking => (
                                    <div key={booking.id} className="flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-white/10">
                                        <div>
                                            <p className="font-sans font-medium text-gray-900 dark:text-white">{booking.guestName}</p>
                                            <p className="text-xs font-sans text-gray-500 dark:text-gray-400">{booking.bookingId}</p>
                                        </div>
                                        <StatusBadge status={booking.status} />
                                    </div>
                                ))}
                        </div>
                        <div className="space-y-4">
                            <h4 className="font-sans font-medium text-gray-900 dark:text-white mb-3">Check-outs Today</h4>
                            {bookings
                                .filter(b => b.checkOut === new Date().toISOString().split('T')[0])
                                .slice(0, 3)
                                .map(booking => (
                                    <div key={booking.id} className="flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-white/10">
                                        <div>
                                            <p className="font-sans font-medium text-gray-900 dark:text-white">{booking.guestName}</p>
                                            <p className="text-xs font-sans text-gray-500 dark:text-gray-400">Room {booking.roomNumber}</p>
                                        </div>
                                        <PaymentStatusBadge status={booking.paymentStatus} />
                                    </div>
                                ))}
                        </div>
                        <div className="space-y-4">
                            <h4 className="font-sans font-medium text-gray-900 dark:text-white mb-3">Recent Cancellations</h4>
                            {bookings
                                .filter(b => b.status === 'cancelled')
                                .slice(0, 3)
                                .map(booking => (
                                    <div key={booking.id} className="flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-white/10">
                                        <div>
                                            <p className="font-sans font-medium text-gray-900 dark:text-white">{booking.guestName}</p>
                                            <p className="text-xs font-sans text-gray-500 dark:text-gray-400">{booking.checkIn} - {booking.checkOut}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-sans text-red-600 dark:text-red-400">${booking.deposit}</p>
                                            <p className="text-xs font-sans text-gray-500 dark:text-gray-400">Refunded</p>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </div>
                </SpotlightCard>
            </div>

            {/* Modals */}
            <BookingDetailsModal
                isOpen={detailsModalOpen}
                onClose={() => setDetailsModalOpen(false)}
                booking={selectedBooking}
                onAction={handleAction}
            />

            <ManualBookingModal
                isOpen={manualBookingModalOpen}
                onClose={() => setManualBookingModalOpen(false)}
                onSave={handleCreateManualBooking}
            />
        </div>
    );
};

export default AdminBookings;