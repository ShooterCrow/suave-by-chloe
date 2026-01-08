import React, { useState } from 'react';
import {
    ArrowLeft,
    Star,
    MapPin,
    Wifi,
    Tv,
    Wind,
    Coffee,
    Users,
    Maximize,
    Check,
    X,
    Calendar,
    ChevronLeft,
    ChevronRight,
    CreditCard,
    User,
    Mail,
    Phone,
    CheckCircle,
    FileText,
    Printer,
    Loader2
} from 'lucide-react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import SpotlightCard from '../../../components/ui/SpotlightCard';
import { Helmet } from 'react-helmet-async';

// Define booking steps
const BOOKING_STEPS = {
    CHECK_AVAILABILITY: 'check_availability',
    EXTRAS: 'extras',
    GUEST_DETAILS: 'guest_details',
    PAYMENT: 'payment',
    REVIEW: 'review',
    CONFIRMATION: 'confirmation'
};

const roomData = {
    id: 1,
    name: "Deluxe City Suite",
    location: "Main Wing, Floor 12",
    rating: 4.9,
    reviews: 215,
    price: 399000,
    size: "450 sq ft",
    maxGuests: 2,
    images: [
        "https://images.unsplash.com/photo-1590490360182-c33d57733427?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1566665797739-1674de7a421a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
    ],
    amenities: [
        { icon: Wifi, name: "High-Speed WiFi" },
        { icon: Tv, name: "Smart TV 55\"" },
        { icon: Wind, name: "Climate Control" },
        { icon: Coffee, name: "Coffee Maker" },
        { icon: Users, name: "Up to 2 Guests" },
        { icon: Maximize, name: "450 sq ft" }
    ],
    features: [
        "King-size bed with premium linens",
        "Marble bathroom with rain shower",
        "Private balcony with city view",
        "King size bed",
        "Marble bathroom with rain shower",
        "Smart room controls",
        "High-speed Wi-Fi"
    ],
    description: "Experience unparalleled luxury in our Deluxe City Suite, where sophisticated design meets breathtaking city views. This spacious retreat features floor-to-ceiling windows, premium furnishings, and a private balcony perfect for watching the sunset. Every detail has been carefully curated to ensure your stay is nothing short of extraordinary."
};

const similarRooms = [
    {
        id: 2,
        name: "Executive Penthouse",
        price: 450000,
        image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        rating: 5.0
    },
    {
        id: 3,
        name: "Garden Villa",
        price: 220000,
        image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        rating: 4.8
    },
    {
        id: 4,
        name: "Urban Loft",
        price: 159000,
        image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        rating: 4.7
    }
];

// Extras options
const extrasOptions = [
    { id: 'breakfast', name: 'Breakfast Buffet', price: 25000, description: 'Daily breakfast for two' },
    { id: 'airport', name: 'Airport Pickup', price: 45000, description: 'Private car service' },
    { id: 'spa', name: 'Spa Package', price: 120000, description: 'Couples massage & access' }
];

const RoomDetails = () => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [roomAvailable, setRoomAvailable] = useState(false);
    const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);
    const [currentStep, setCurrentStep] = useState(BOOKING_STEPS.CHECK_AVAILABILITY);
    const [bookingData, setBookingData] = useState({
        checkIn: '',
        checkOut: '',
        guests: 1,
        extras: [],
        guestDetails: {
            name: '',
            email: '',
            phone: '',
            specialRequests: ''
        },
        payment: {
            cardNumber: '',
            expiry: '',
            cvv: '',
            nameOnCard: ''
        }
    });
    const [reservationNumber, setReservationNumber] = useState('');

    const nextImage = () => {
        setCurrentImageIndex((prev) =>
            prev === roomData.images.length - 1 ? 0 : prev + 1
        );
    };

    const prevImage = () => {
        setCurrentImageIndex((prev) =>
            prev === 0 ? roomData.images.length - 1 : prev - 1
        );
    };

    const handleCheckAvailability = async (e) => {
        e.preventDefault();
        setIsCheckingAvailability(true);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));

        setIsCheckingAvailability(false);

        if (roomAvailable) {
            setCurrentStep(BOOKING_STEPS.EXTRAS);
        }
    };

    const toggleExtra = (extraId) => {
        setBookingData(prev => ({
            ...prev,
            extras: prev.extras.includes(extraId)
                ? prev.extras.filter(id => id !== extraId)
                : [...prev.extras, extraId]
        }));
    };

    const calculateTotal = () => {
        const basePrice = roomData.price;
        const extrasTotal = extrasOptions
            .filter(extra => bookingData.extras.includes(extra.id))
            .reduce((sum, extra) => sum + extra.price, 0);
        return basePrice + extrasTotal;
    };

    const handleNextStep = () => {
        const steps = Object.values(BOOKING_STEPS);
        const currentIndex = steps.indexOf(currentStep);
        if (currentIndex < steps.length - 1) {
            setCurrentStep(steps[currentIndex + 1]);
        }
    };

    const handlePreviousStep = () => {
        const steps = Object.values(BOOKING_STEPS);
        const currentIndex = steps.indexOf(currentStep);
        if (currentIndex > 0) {
            setCurrentStep(steps[currentIndex - 1]);
        }
    };

    const handleSubmitPayment = async (e) => {
        e.preventDefault();
        setCurrentStep(BOOKING_STEPS.REVIEW);
    };

    const handleConfirmBooking = async () => {
        // Generate random reservation number
        const reservation = 'RES-' + Math.random().toString(36).substr(2, 9).toUpperCase();
        setReservationNumber(reservation);
        setCurrentStep(BOOKING_STEPS.CONFIRMATION);
    };

    const handlePrintReceipt = () => {
        window.print();
    };

    // Render different sidebar content based on current step
    const renderSidebarContent = () => {
        switch (currentStep) {
            case BOOKING_STEPS.CHECK_AVAILABILITY:
                return (
                    <SpotlightCard className="p-6 rounded-2xl border bg-white border-gray-300 shadow-lg dark:bg-dark-800 dark:border-white/10 dark:shadow-xl dark:shadow-blue-900/5">
                        <div className="mb-6 pb-6 border-b border-gray-200 dark:border-white/10">
                            <div className="flex items-baseline gap-2 mb-2">
                                <span className="font-serif text-3xl font-bold text-gray-900 dark:text-white">
                                    ₦{roomData.price.toLocaleString()}
                                </span>
                                <span className="font-sans text-sm text-gray-600 dark:text-gray-400">
                                    / night
                                </span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                <MapPin size={14} />
                                <span className="font-sans">{roomData.location}</span>
                            </div>
                        </div>

                        <form onSubmit={handleCheckAvailability} className="space-y-4">
                            <div>
                                <label className="block font-sans text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                                    Check-in
                                </label>
                                <div className="relative">
                                    <Input
                                        type="date"
                                        required
                                        className="[color-scheme:dark]"
                                        value={bookingData.checkIn}
                                        onChange={(e) => setBookingData({ ...bookingData, checkIn: e.target.value })}
                                        icon={Calendar}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block font-sans text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                                    Check-out
                                </label>
                                <div className="relative">
                                    <Input
                                        type="date"
                                        required
                                        className="[color-scheme:dark]"
                                        value={bookingData.checkOut}
                                        onChange={(e) => setBookingData({ ...bookingData, checkOut: e.target.value })}
                                        icon={Calendar}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block font-sans text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                                    Guests
                                </label>
                                <div className="relative">
                                    <Input
                                        type="number"
                                        min="1"
                                        max={roomData.maxGuests}
                                        required
                                        value={bookingData.guests}
                                        onChange={(e) => setBookingData({ ...bookingData, guests: parseInt(e.target.value) || 1 })}
                                        icon={Users}
                                    />
                                </div>
                            </div>

                            <Button
                                type="submit"
                                disabled={isCheckingAvailability}
                                className="w-full py-3"
                            >
                                {isCheckingAvailability ? (
                                    <div className="flex items-center justify-center gap-2">
                                        <Loader2 size={18} className="animate-spin" />
                                        CHECKING...
                                    </div>
                                ) : (
                                    "CHECK_AVAILABILITY"
                                )}
                            </Button>
                        </form>

                        <p className="mt-4 text-xs text-center font-sans text-gray-500 dark:text-gray-500">
                            You won't be charged yet
                        </p>
                    </SpotlightCard>
                );

            case BOOKING_STEPS.EXTRAS:
                return (
                    <SpotlightCard className="p-6 rounded-2xl border bg-white border-gray-300 shadow-lg dark:bg-dark-800 dark:border-white/10 dark:shadow-xl dark:shadow-blue-900/5">
                        <div className="mb-6">
                            <div className="flex items-baseline gap-2 mb-2">
                                <span className="font-serif text-2xl font-bold text-gray-900 dark:text-white">
                                    Add Extras
                                </span>
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                                Enhance your stay with these optional services
                            </div>
                        </div>

                        <div className="space-y-4 mb-6">
                            {extrasOptions.map((extra) => (
                                <div
                                    key={extra.id}
                                    className={`p-4 rounded-lg border cursor-pointer transition-all ${bookingData.extras.includes(extra.id)
                                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-400'
                                        : 'border-gray-200 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20'
                                        }`}
                                    onClick={() => toggleExtra(extra.id)}
                                >
                                    <div className="flex items-start justify-between mb-2">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${bookingData.extras.includes(extra.id)
                                                ? 'bg-blue-500 border-blue-500 dark:bg-blue-400 dark:border-blue-400'
                                                : 'border-gray-300 dark:border-white/30'
                                                }`}>
                                                {bookingData.extras.includes(extra.id) && (
                                                    <Check size={12} className="text-white" />
                                                )}
                                            </div>
                                            <div>
                                                <h4 className="font-sans font-medium text-gray-900 dark:text-white">
                                                    {extra.name}
                                                </h4>
                                                <p className="text-xs text-gray-600 dark:text-gray-400">
                                                    {extra.description}
                                                </p>
                                            </div>
                                        </div>
                                        <span className="font-mono font-bold text-blue-600 dark:text-blue-400">
                                            +₦{extra.price.toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="flex gap-3">
                            <Button
                                onClick={handlePreviousStep}
                                variant="secondary"
                                className="flex-1 py-3 font-mono text-sm font-bold tracking-widest"
                            >
                                BACK
                            </Button>
                            <Button
                                onClick={handleNextStep}
                                className="flex-1 py-3 font-mono text-sm font-bold tracking-widest"
                            >
                                CONTINUE
                            </Button>
                        </div>
                    </SpotlightCard>
                );

            case BOOKING_STEPS.GUEST_DETAILS:
                return (
                    <SpotlightCard className="p-6 rounded-2xl border bg-white border-gray-300 shadow-lg dark:bg-dark-800 dark:border-white/10 dark:shadow-xl dark:shadow-blue-900/5">
                        <div className="mb-6">
                            <div className="flex items-baseline gap-2 mb-2">
                                <span className="font-serif text-2xl font-bold text-gray-900 dark:text-white">
                                    Guest Details
                                </span>
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                                We'll use this information for your reservation
                            </div>
                        </div>

                        <form onSubmit={(e) => { e.preventDefault(); handleNextStep(); }} className="space-y-4">
                            <div>
                                <label className="block font-sans text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                                    Full Name
                                </label>
                                <div className="relative">
                                    <Input
                                        type="text"
                                        required
                                        value={bookingData.guestDetails.name}
                                        onChange={(e) => setBookingData({
                                            ...bookingData,
                                            guestDetails: { ...bookingData.guestDetails, name: e.target.value }
                                        })}
                                        icon={User}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block font-sans text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <Input
                                        type="email"
                                        required
                                        value={bookingData.guestDetails.email}
                                        onChange={(e) => setBookingData({
                                            ...bookingData,
                                            guestDetails: { ...bookingData.guestDetails, email: e.target.value }
                                        })}
                                        icon={Mail}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block font-sans text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                                    Phone Number
                                </label>
                                <div className="relative">
                                    <Input
                                        type="tel"
                                        required
                                        value={bookingData.guestDetails.phone}
                                        onChange={(e) => setBookingData({
                                            ...bookingData,
                                            guestDetails: { ...bookingData.guestDetails, phone: e.target.value }
                                        })}
                                        icon={Phone}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block font-sans text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                                    Special Requests (Optional)
                                </label>
                                <textarea
                                    className="w-full px-3 py-2.5 rounded-lg border outline-none transition-all text-sm bg-white border-gray-300 text-gray-900 focus:border-blue-400 dark:bg-white/5 dark:border-white/10 dark:text-white dark:focus:bg-white/10 dark:focus:border-blue-500/50"
                                    rows="3"
                                    value={bookingData.guestDetails.specialRequests}
                                    onChange={(e) => setBookingData({
                                        ...bookingData,
                                        guestDetails: { ...bookingData.guestDetails, specialRequests: e.target.value }
                                    })}
                                    placeholder="Any special requirements or requests..."
                                />
                            </div>

                            <div className="flex gap-3 pt-2">
                                <Button
                                    type="button"
                                    onClick={handlePreviousStep}
                                    variant="secondary"
                                    className="flex-1 py-3 font-mono text-sm font-bold tracking-widest"
                                >
                                    BACK
                                </Button>
                                <Button
                                    type="submit"
                                    className="flex-1 py-3 font-mono text-sm font-bold tracking-widest"
                                >
                                    CONTINUE
                                </Button>
                            </div>
                        </form>
                    </SpotlightCard>
                );

            case BOOKING_STEPS.PAYMENT:
                return (
                    <SpotlightCard className="p-6 rounded-2xl border bg-white border-gray-300 shadow-lg dark:bg-dark-800 dark:border-white/10 dark:shadow-xl dark:shadow-blue-900/5">
                        <div className="mb-6">
                            <div className="flex items-baseline gap-2 mb-2">
                                <span className="font-serif text-2xl font-bold text-gray-900 dark:text-white">
                                    Payment Details
                                </span>
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                                Secure payment processed with encryption
                            </div>
                        </div>

                        <form onSubmit={handleSubmitPayment} className="space-y-4">
                            <div>
                                <label className="block font-sans text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                                    Card Number
                                </label>
                                <div className="relative">
                                    <Input
                                        type="text"
                                        required
                                        placeholder="1234 5678 9012 3456"
                                        value={bookingData.payment.cardNumber}
                                        onChange={(e) => setBookingData({
                                            ...bookingData,
                                            payment: { ...bookingData.payment, cardNumber: e.target.value }
                                        })}
                                        icon={CreditCard}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block font-sans text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                                        Expiry Date
                                    </label>
                                    <Input
                                        type="text"
                                        required
                                        placeholder="MM/YY"
                                        value={bookingData.payment.expiry}
                                        onChange={(e) => setBookingData({
                                            ...bookingData,
                                            payment: { ...bookingData.payment, expiry: e.target.value }
                                        })}
                                    />
                                </div>
                                <div>
                                    <label className="block font-sans text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                                        CVV
                                    </label>
                                    <Input
                                        type="text"
                                        required
                                        placeholder="123"
                                        value={bookingData.payment.cvv}
                                        onChange={(e) => setBookingData({
                                            ...bookingData,
                                            payment: { ...bookingData.payment, cvv: e.target.value }
                                        })}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block font-sans text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                                    Name on Card
                                </label>
                                <Input
                                    type="text"
                                    required
                                    value={bookingData.payment.nameOnCard}
                                    onChange={(e) => setBookingData({
                                        ...bookingData,
                                        payment: { ...bookingData.payment, nameOnCard: e.target.value }
                                    })}
                                />
                            </div>

                            <div className="pt-4 border-t border-gray-200 dark:border-white/10">
                                <div className="flex items-center justify-between mb-4">
                                    <span className="font-sans text-gray-700 dark:text-gray-300">Room Total:</span>
                                    <span className="font-mono font-bold">₦{roomData.price.toLocaleString()}</span>
                                </div>
                                <div className="flex items-center justify-between mb-4">
                                    <span className="font-sans text-gray-700 dark:text-gray-300">Extras:</span>
                                    <span className="font-mono font-bold">
                                        +₦{bookingData.extras.reduce((sum, id) => {
                                            const extra = extrasOptions.find(e => e.id === id);
                                            return sum + (extra ? extra.price : 0);
                                        }, 0)}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between text-lg font-bold pt-4 border-t border-gray-200 dark:border-white/10">
                                    <span className="font-serif text-gray-900 dark:text-white">Total Amount:</span>
                                    <span className="font-mono text-blue-600 dark:text-blue-400">
                                        ₦{calculateTotal().toLocaleString()}
                                    </span>
                                </div>
                            </div>

                            <div className="flex gap-3 pt-2">
                                <Button
                                    type="button"
                                    onClick={handlePreviousStep}
                                    variant="secondary"
                                    className="flex-1 py-3 font-mono text-sm font-bold tracking-widest"
                                >
                                    BACK
                                </Button>
                                <Button
                                    type="submit"
                                    className="flex-1 py-3 font-mono text-sm font-bold tracking-widest"
                                >
                                    REVIEW BOOKING
                                </Button>
                            </div>
                        </form>
                    </SpotlightCard>
                );

            case BOOKING_STEPS.REVIEW:
                return (
                    <SpotlightCard className="p-6 rounded-2xl border bg-white border-gray-300 shadow-lg dark:bg-dark-800 dark:border-white/10 dark:shadow-xl dark:shadow-blue-900/5">
                        <div className="mb-6">
                            <div className="flex items-baseline gap-2 mb-2">
                                <span className="font-serif text-2xl font-bold text-gray-900 dark:text-white">
                                    Booking Summary
                                </span>
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                                Please review your reservation details
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="space-y-3">
                                <h4 className="font-sans font-bold text-gray-900 dark:text-white">Room Details</h4>
                                <div className="flex justify-between">
                                    <span className="text-gray-600 dark:text-gray-400">{roomData.name}</span>
                                    <span className="font-mono font-bold">₦{roomData.price.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600 dark:text-gray-400">Dates: {bookingData.checkIn} to {bookingData.checkOut}</span>
                                    <span className="font-mono">{bookingData.guests} guest{bookingData.guests > 1 ? 's' : ''}</span>
                                </div>
                            </div>

                            {bookingData.extras.length > 0 && (
                                <div className="space-y-3">
                                    <h4 className="font-sans font-bold text-gray-900 dark:text-white">Selected Extras</h4>
                                    {extrasOptions
                                        .filter(extra => bookingData.extras.includes(extra.id))
                                        .map(extra => (
                                            <div key={extra.id} className="flex justify-between">
                                                <span className="text-gray-600 dark:text-gray-400">{extra.name}</span>
                                                <span className="font-mono font-bold">+₦{extra.price.toLocaleString()}</span>
                                            </div>
                                        ))}
                                </div>
                            )}

                            <div className="space-y-3">
                                <h4 className="font-sans font-bold text-gray-900 dark:text-white">Guest Information</h4>
                                <div className="text-gray-600 dark:text-gray-400 space-y-1">
                                    <div>{bookingData.guestDetails.name}</div>
                                    <div>{bookingData.guestDetails.email}</div>
                                    <div>{bookingData.guestDetails.phone}</div>
                                    {bookingData.guestDetails.specialRequests && (
                                        <div className="pt-2">
                                            <div className="font-medium">Special Requests:</div>
                                            <div className="text-sm">{bookingData.guestDetails.specialRequests}</div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="pt-4 border-t border-gray-200 dark:border-white/10">
                                <div className="flex items-center justify-between text-xl font-bold">
                                    <span className="font-serif text-gray-900 dark:text-white">Total Amount:</span>
                                    <span className="font-mono text-blue-600 dark:text-blue-400">
                                        ₦{calculateTotal().toLocaleString()}
                                    </span>
                                </div>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <Button
                                    onClick={handlePreviousStep}
                                    variant="secondary"
                                    className="flex-1 py-3 font-mono text-sm font-bold tracking-widest"
                                >
                                    EDIT
                                </Button>
                                <Button
                                    onClick={handleConfirmBooking}
                                    variant="success"
                                    className="flex-1 py-3 font-mono text-sm font-bold tracking-widest"
                                >
                                    CONFIRM BOOKING
                                </Button>
                            </div>
                        </div>
                    </SpotlightCard>
                );

            case BOOKING_STEPS.CONFIRMATION:
                return (
                    <SpotlightCard className="p-6 rounded-2xl border bg-white border-gray-300 shadow-lg dark:bg-dark-800 dark:border-white/10 dark:shadow-xl dark:shadow-blue-900/5">
                        <div className="text-center mb-6">
                            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4 dark:bg-green-900/30">
                                <CheckCircle size={32} className="text-green-600 dark:text-green-400" />
                            </div>
                            <h3 className="font-serif text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                Booking Confirmed!
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Your reservation has been successfully completed
                            </p>
                        </div>

                        <div className="space-y-6">
                            <div className="p-4 rounded-lg bg-gray-50 dark:bg-white/5">
                                <div className="text-center mb-4">
                                    <div className="font-mono text-sm text-gray-500 dark:text-gray-400 mb-1">
                                        RESERVATION NUMBER
                                    </div>
                                    <div className="font-mono text-2xl font-bold text-blue-600 dark:text-blue-400 tracking-wider">
                                        {reservationNumber}
                                    </div>
                                </div>
                                <div className="text-center text-sm text-gray-600 dark:text-gray-400">
                                    Keep this number for your records
                                </div>
                            </div>

                            <div className="space-y-3">
                                <h4 className="font-sans font-bold text-gray-900 dark:text-white">What's Next?</h4>
                                <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                                    <Mail size={16} />
                                    <span>Email confirmation sent to {bookingData.guestDetails.email}</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                                    <FileText size={16} />
                                    <span>Detailed receipt available for download</span>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <Button
                                    onClick={handlePrintReceipt}
                                    variant="secondary"
                                    className="flex-1 py-3 font-mono text-sm font-bold tracking-widest flex items-center justify-center gap-2"
                                >
                                    <Printer size={16} />
                                    PRINT RECEIPT
                                </Button>
                                <Button
                                    onClick={() => {
                                        setCurrentStep(BOOKING_STEPS.CHECK_AVAILABILITY);
                                        setBookingData({
                                            checkIn: '',
                                            checkOut: '',
                                            guests: 1,
                                            extras: [],
                                            guestDetails: {
                                                name: '',
                                                email: '',
                                                phone: '',
                                                specialRequests: ''
                                            },
                                            payment: {
                                                cardNumber: '',
                                                expiry: '',
                                                cvv: '',
                                                nameOnCard: ''
                                            }
                                        });
                                    }}
                                    className="flex-1 py-3 font-mono text-sm font-bold tracking-widest"
                                >
                                    NEW BOOKING
                                </Button>
                            </div>
                        </div>
                    </SpotlightCard>
                );

            default:
                return null;
        }
    };

    // Add room availability banner
    const renderAvailabilityBanner = () => {
        if (currentStep === BOOKING_STEPS.CHECK_AVAILABILITY && !isCheckingAvailability) {
            return (
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
                    <div className={`p-4 rounded-lg ${roomAvailable ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800' : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'}`}>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${roomAvailable ? 'bg-green-100 dark:bg-green-900/40' : 'bg-red-100 dark:bg-red-900/40'}`}>
                                    {roomAvailable ? (
                                        <Check size={18} className="text-green-600 dark:text-green-400" />
                                    ) : (
                                        <X size={18} className="text-red-600 dark:text-red-400" />
                                    )}
                                </div>
                                <div>
                                    <h4 className="font-sans font-semibold text-gray-900 dark:text-white">
                                        {roomAvailable ? 'Room Available' : 'Room Not Available'}
                                    </h4>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        {roomAvailable
                                            ? 'This room is available for your selected dates'
                                            : 'Please try different dates or check similar rooms'}
                                    </p>
                                </div>
                            </div>
                            {!roomAvailable && (
                                <button
                                    onClick={() => setRoomAvailable(true)}
                                    className="px-4 py-2 text-sm font-sans font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                                >
                                    SIMULATE AVAILABLE
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="min-h-screen pt-20 pb-16 bg-gray-50 dark:bg-void transition-colors duration-300">
            <Helmet>
                <title>{`${roomData.name} | Suave By Chloe`}</title>
                <meta
                    name="description"
                    content={`Book your stay in the ${roomData.name} at Suave By Chloe. ${roomData.description.substring(0, 150)}...`}
                />
                <meta property="og:title" content={`${roomData.name} | Suave By Chloe`} />
                <meta
                    property="og:description"
                    content={`Book your stay in the ${roomData.name} at Suave By Chloe. ${roomData.description.substring(0, 150)}...`}
                />
                <meta property="og:type" content="website" />
            </Helmet>

            {/* Back Button */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-4">
                <button className="flex items-center gap-2 font-mono text-sm font-medium transition-colors text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                    <ArrowLeft size={18} />
                    BACK_TO_ROOMS
                </button>
            </div>

            {/* Room Availability Banner */}
            {renderAvailabilityBanner()}

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* Main Content */}
                    <div className="lg:col-span-8 space-y-8">

                        {/* Image Gallery */}
                        <div className="relative h-[400px] md:h-[500px] rounded-2xl overflow-hidden group bg-gray-900">
                            <img
                                src={roomData.images[currentImageIndex]}
                                alt={roomData.name}
                                className="w-full h-full object-cover"
                            />

                            {/* Navigation Arrows */}
                            <button
                                onClick={prevImage}
                                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 bg-black/50 hover:bg-black/70 backdrop-blur-sm text-white"
                            >
                                <ChevronLeft size={24} />
                            </button>
                            <button
                                onClick={nextImage}
                                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 bg-black/50 hover:bg-black/70 backdrop-blur-sm text-white"
                            >
                                <ChevronRight size={24} />
                            </button>

                            {/* Image Counter */}
                            <div className="absolute bottom-4 right-4 px-3 py-1.5 rounded-lg font-mono text-xs backdrop-blur-md bg-black/50 text-white">
                                {currentImageIndex + 1} / {roomData.images.length}
                            </div>
                        </div>

                        {/* Thumbnail Gallery */}
                        <div className="grid grid-cols-4 gap-3">
                            {roomData.images.map((img, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setCurrentImageIndex(idx)}
                                    className={`relative h-20 rounded-lg overflow-hidden transition-all ${currentImageIndex === idx
                                        ? 'ring-2 ring-blue-500 dark:ring-blue-400'
                                        : 'opacity-60 hover:opacity-100'
                                        }`}
                                >
                                    <img
                                        src={img}
                                        alt={`View ${idx + 1}`}
                                        className="w-full h-full object-cover"
                                    />
                                </button>
                            ))}
                        </div>

                        {/* Room Info */}
                        <div className="p-8 rounded-2xl border bg-white border-gray-300 dark:bg-dark-800 dark:border-white/10">
                            <div className="flex items-start justify-between mb-6">
                                <div>
                                    <span className="text-sm font-sans mb-2 block text-gray-600 dark:text-gray-400">
                                        {roomData.location}
                                    </span>
                                    <h1 className="font-serif text-3xl md:text-4xl font-bold mb-3 text-gray-900 dark:text-white">
                                        {roomData.name}
                                    </h1>
                                    <div className="flex items-center gap-3">
                                        <div className="flex items-center gap-1 text-yellow-500">
                                            <Star size={18} fill="currentColor" />
                                            <span className="font-sans text-sm font-semibold text-gray-900 dark:text-white">
                                                {roomData.rating}
                                            </span>
                                        </div>
                                        <span className="text-sm font-sans text-gray-600 dark:text-gray-400">
                                            ({roomData.reviews} reviews)
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <h3 className="font-serif text-xl font-bold mb-3 text-gray-900 dark:text-white">
                                        About This Room
                                    </h3>
                                    <p className="font-sans text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                                        {roomData.description}
                                    </p>
                                </div>

                                {/* Amenities Grid */}
                                <div>
                                    <h3 className="font-serif text-xl font-bold mb-4 text-gray-900 dark:text-white">
                                        Amenities
                                    </h3>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                        {roomData.amenities.map((amenity, idx) => (
                                            <div
                                                key={idx}
                                                className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-dark-900"
                                            >
                                                <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-blue-500/15 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400">
                                                    <amenity.icon size={20} strokeWidth={1.5} />
                                                </div>
                                                <span className="font-sans text-sm text-gray-700 dark:text-gray-300">
                                                    {amenity.name}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Features List */}
                                <div>
                                    <h3 className="font-serif text-xl font-bold mb-4 text-gray-900 dark:text-white">
                                        Room Features
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {roomData.features.map((feature, idx) => (
                                            <div
                                                key={idx}
                                                className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300"
                                            >
                                                <Check size={16} className="text-blue-600 dark:text-blue-400 shrink-0" />
                                                <span className="font-sans">{feature}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Similar Rooms */}
                        <div>
                            <div className="mb-6">
                                <span className="font-mono text-sm text-blue-500 tracking-widest uppercase mb-2 block">
                                    SIMILAR_ROOMS
                                </span>
                                <h2 className="font-serif text-3xl font-bold text-gray-900 dark:text-white">
                                    You Might Also Like
                                </h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {similarRooms.map((room) => (
                                    <SpotlightCard
                                        key={room.id}
                                        className="group cursor-pointer rounded-xl border overflow-hidden bg-white border-gray-300 dark:bg-dark-800 dark:border-white/10"
                                    >
                                        <div className="relative h-48 overflow-hidden">
                                            <img
                                                src={room.image}
                                                alt={room.name}
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                            />
                                        </div>
                                        <div className="p-5">
                                            <h3 className="font-serif text-lg font-bold mb-2 text-gray-900 dark:text-white">
                                                {room.name}
                                            </h3>
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-1">
                                                    <Star size={14} fill="currentColor" className="text-yellow-500" />
                                                    <span className="font-sans text-sm text-gray-700 dark:text-gray-300">
                                                        {room.rating}
                                                    </span>
                                                </div>
                                                <span className="font-mono text-lg font-bold text-blue-600 dark:text-blue-400">
                                                    ₦{room.price}
                                                </span>
                                            </div>
                                        </div>
                                    </SpotlightCard>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Booking Sidebar */}
                    <div className="lg:col-span-4">
                        <div className="sticky top-24">
                            {renderSidebarContent()}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RoomDetails;