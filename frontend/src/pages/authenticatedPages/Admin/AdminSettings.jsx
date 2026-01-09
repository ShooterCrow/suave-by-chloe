import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import {
    Save,
    Building,
    Phone,
    CreditCard,
    Shield,
    FileText,
    Users,
    Lock,
    Database,
    Upload,
    Download,
    Copy,
    Eye,
    Check,
    X,
    AlertCircle,
    Edit,
    Trash2,
    Plus,
    Clock,
    Percent,
    Receipt,
    Mail as MailIcon,
    Code,
    Palette,
} from 'lucide-react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Badge from '../../../components/ui/Badge';
import SpotlightCard from '../../../components/ui/SpotlightCard';
import Loader from '../../../components/ui/Loader';
import {
    useGetSettingsQuery,
    useUpdateSettingsMutation,
    useUploadLogoMutation,
    useUploadGalleryImagesMutation,
    useDeleteGalleryImageMutation
} from '../settingsApiSlice';
import { toast } from 'react-hot-toast';

// Toggle Switch Component

const ToggleSwitch = ({ enabled, onChange, label }) => {
    return (
        <div className="flex items-center justify-between">
            <span className="text-sm font-sans font-medium text-gray-900 dark:text-white">{label}</span>
            <button
                type="button"
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${enabled ? 'bg-blue-600' : 'bg-gray-300 dark:bg-white/20'}`}
                onClick={() => onChange(!enabled)}
            >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${enabled ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
        </div>
    );
};

// Hotel Info Component
const HotelInfoSettings = ({ data, onUpdate, isSaving }) => {
    const [hotelInfo, setHotelInfo] = useState(data || {
        name: '',
        tagline: '',
        description: '',
        address: '',
        city: '',
        state: '',
        country: '',
        postalCode: '',
        phone: '',
        email: '',
        website: '',
        checkInTime: '',
        checkOutTime: '',
        timezone: '',
        currency: '',
        currencySign: '',
        totalRooms: 0,
        starRating: 0,
        logo: { url: '', publicId: '' },
        gallery: []
    });

    const [logoFile, setLogoFile] = useState(null);
    const [galleryFiles, setGalleryFiles] = useState([]);
    const [logoPreview, setLogoPreview] = useState(data?.logo?.url || '');

    useEffect(() => {
        if (data) {
            setHotelInfo(data);
            setLogoPreview(data.logo?.url || '');
        }
    }, [data]);

    const [deleteImage] = useDeleteGalleryImageMutation();

    const handleLogoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setLogoFile(file);
            setLogoPreview(URL.createObjectURL(file));
        }
    };

    const handleGalleryChange = (e) => {
        const files = Array.from(e.target.files || []);
        setGalleryFiles(prev => [...prev, ...files]);
    };

    const handleSave = () => {
        onUpdate({
            hotelInfo,
            logo: logoFile,
            gallery: galleryFiles
        });
        // Clear local file state after save (optional, depend on preference)
        setLogoFile(null);
        setGalleryFiles([]);
    };

    const handleDeleteGalleryImage = async (publicId) => {
        if (!window.confirm('Are you sure you want to delete this image?')) return;
        try {
            await deleteImage(publicId).unwrap();
            toast.success('Image deleted successfully');
        } catch (err) {
            toast.error(err?.data?.message || 'Failed to delete image');
        }
    };

    // Images from data (already on server)
    const existingImages = hotelInfo.gallery || [];
    // Newly selected images (not yet uploaded)
    const previewImages = galleryFiles.map(file => URL.createObjectURL(file));

    // const logo = logoPreview; // Using logoPreview directly in JSX
    // const images = hotelInfo.gallery || []; // Using existingImages/previewImages

    return (
        <div className="rounded-2xl border bg-white border-gray-200 dark:bg-dark-800 dark:border-white/10 p-6">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="font-serif text-xl font-bold text-gray-900 dark:text-white">
                        Hotel Information
                    </h3>
                    <p className="text-sm font-sans text-gray-600 dark:text-gray-400">
                        Update your hotel's basic information and branding
                    </p>
                </div>
                <Button
                    onClick={handleSave}
                    disabled={isSaving}
                    isLoading={isSaving}
                    className="flex items-center gap-2"
                >
                    <Save size={18} />
                    Save Changes
                </Button>
            </div>

            <div className="space-y-8">
                {/* Logo Upload */}
                <div>
                    <label className="block text-sm font-sans font-medium text-gray-900 dark:text-white mb-3">
                        Hotel Logo
                    </label>
                    <div className="flex items-center gap-6">
                        <div className="w-32 h-32 rounded-lg border-2 border-dashed border-gray-300 dark:border-white/20 flex items-center justify-center overflow-hidden relative">
                            {logoPreview ? (
                                <img src={logoPreview} alt="Hotel Logo" className="w-full h-full object-contain p-2" />
                            ) : (
                                <div className="text-center p-4">
                                    <Building size={32} className="mx-auto text-gray-400 mb-2" />
                                    <span className="text-xs font-sans text-gray-500 dark:text-gray-400">Upload Logo</span>
                                </div>
                            )}
                        </div>
                        <div>
                            <input
                                type="file"
                                id="logo-upload"
                                className="hidden"
                                accept="image/*"
                                onChange={handleLogoChange}
                            />
                            <label
                                htmlFor="logo-upload"
                                className="px-4 py-2 rounded-lg font-sans font-medium transition-colors border border-gray-300 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 cursor-pointer inline-flex items-center gap-2"
                            >
                                <Upload size={16} />
                                {logoPreview ? 'Change Logo' : 'Upload Logo'}
                            </label>
                            <p className="text-xs font-sans text-gray-500 dark:text-gray-400 mt-2">
                                Recommended: 300×300px, PNG or SVG format
                            </p>
                        </div>
                    </div>
                </div>

                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-sans font-medium text-gray-900 dark:text-white mb-2">
                            Hotel Name *
                        </label>
                        <Input
                            type="text"
                            value={hotelInfo.name}
                            onChange={(e) => setHotelInfo({ ...hotelInfo, name: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-sans font-medium text-gray-900 dark:text-white mb-2">
                            Tagline
                        </label>
                        <Input
                            type="text"
                            value={hotelInfo.tagline}
                            onChange={(e) => setHotelInfo({ ...hotelInfo, tagline: e.target.value })}
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-sans font-medium text-gray-900 dark:text-white mb-2">
                        Description
                    </label>
                    <textarea
                        value={hotelInfo.description}
                        onChange={(e) => setHotelInfo({ ...hotelInfo, description: e.target.value })}
                        rows="3"
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-white/10 bg-white dark:bg-dark-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>

                {/* Contact Information */}
                <div>
                    <h4 className="font-serif text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                        <Phone size={20} />
                        Contact Information
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-sans font-medium text-gray-900 dark:text-white mb-2">
                                Address *
                            </label>
                            <Input
                                type="text"
                                value={hotelInfo.address}
                                onChange={(e) => setHotelInfo({ ...hotelInfo, address: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-sans font-medium text-gray-900 dark:text-white mb-2">
                                Phone Number *
                            </label>
                            <Input
                                type="tel"
                                value={hotelInfo.phone}
                                onChange={(e) => setHotelInfo({ ...hotelInfo, phone: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-sans font-medium text-gray-900 dark:text-white mb-2">
                                Email Address *
                            </label>
                            <Input
                                type="email"
                                value={hotelInfo.email}
                                onChange={(e) => setHotelInfo({ ...hotelInfo, email: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-sans font-medium text-gray-900 dark:text-white mb-2">
                                Website
                            </label>
                            <Input
                                type="url"
                                value={hotelInfo.website}
                                onChange={(e) => setHotelInfo({ ...hotelInfo, website: e.target.value })}
                            />
                        </div>
                    </div>
                </div>

                {/* Hotel Settings */}
                <div>
                    <h4 className="font-serif text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                        <Clock size={20} />
                        Hotel Settings
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div>
                            <label className="block text-sm font-sans font-medium text-gray-900 dark:text-white mb-2">
                                Check-in Time
                            </label>
                            <Input
                                type="time"
                                value={hotelInfo.checkInTime}
                                onChange={(e) => setHotelInfo({ ...hotelInfo, checkInTime: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-sans font-medium text-gray-900 dark:text-white mb-2">
                                Check-out Time
                            </label>
                            <Input
                                type="time"
                                value={hotelInfo.checkOutTime}
                                onChange={(e) => setHotelInfo({ ...hotelInfo, checkOutTime: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-sans font-medium text-gray-900 dark:text-white mb-2">
                                Timezone
                            </label>
                            <select
                                value={hotelInfo.timezone}
                                onChange={(e) => setHotelInfo({ ...hotelInfo, timezone: e.target.value })}
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-white/10 bg-white dark:bg-dark-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="Africa/Lagos">West Africa Time (WAT)</option>
                                <option value="Africa/Cairo">Central Africa Time (CAT)</option>
                                <option value="Africa/Nairobi">East Africa Time (EAT)</option>
                                <option value="Europe/London">London (GMT)</option>
                                <option value="America/New_York">Eastern Time (ET)</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-sans font-medium text-gray-900 dark:text-white mb-2">
                                Currency
                            </label>
                            <select
                                value={hotelInfo.currency}
                                onChange={(e) => setHotelInfo({ ...hotelInfo, currency: e.target.value })}
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-white/10 bg-white dark:bg-dark-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="NGN">Nigerian Naira (₦)</option>
                                <option value="USD">US Dollar ($)</option>
                                <option value="EUR">Euro (€)</option>
                                <option value="GBP">British Pound (£)</option>
                                <option value="CAD">Canadian Dollar (C$)</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Hotel Gallery */}
                <div>
                    <h4 className="font-serif text-lg font-bold text-gray-900 dark:text-white mb-4">
                        Hotel Gallery
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {existingImages.map((image, index) => (
                            <div key={`existing-${index}`} className="relative aspect-video rounded-lg overflow-hidden border border-gray-300 dark:border-white/10">
                                <img src={image.url} alt={`Gallery ${index + 1}`} className="w-full h-full object-cover" />
                                <button
                                    onClick={() => handleDeleteGalleryImage(image.publicId)}
                                    className="absolute top-2 right-2 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-colors"
                                >
                                    <X size={14} />
                                </button>
                            </div>
                        ))}
                        {previewImages.map((url, index) => (
                            <div key={`preview-${index}`} className="relative aspect-video rounded-lg overflow-hidden border border-blue-300 dark:border-blue-500/30">
                                <img src={url} alt={`New Preview ${index + 1}`} className="w-full h-full object-cover opacity-70" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="text-xs font-sans text-blue-600 dark:text-blue-400 font-bold bg-white/80 px-2 py-1 rounded">Pending</span>
                                </div>
                            </div>
                        ))}
                        <label className="aspect-video rounded-lg border-2 border-dashed border-gray-300 dark:border-white/20 flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 transition-colors relative">
                            <Upload size={24} className="text-gray-400 mb-2" />
                            <span className="text-sm font-sans text-gray-500 dark:text-gray-400">Add Image</span>
                            <input
                                type="file"
                                className="hidden"
                                accept="image/*"
                                onChange={handleGalleryChange}
                                multiple
                            />
                        </label>
                    </div>
                    <p className="text-xs font-sans text-gray-500 dark:text-gray-400 mt-2">
                        Upload hotel photos for your gallery. Recommended size: 1200×800px
                    </p>
                </div>
            </div>
        </div>
    );
};

// Taxes & Fees Component
const TaxesFeesSettings = ({ data, onUpdate, isSaving }) => {
    const [taxes, setTaxes] = useState(data || []);

    useEffect(() => {
        if (data) setTaxes(data);
    }, [data]);

    const [newTax, setNewTax] = useState({
        name: '',
        type: 'percentage',
        rate: 0,
        amount: 0,
        description: '',
        appliesTo: 'all',
        enabled: true
    });

    const addTax = () => {
        if (!newTax.name) return;
        const tax = {
            ...newTax,
            id: taxes.length + 1
        };
        setTaxes([...taxes, tax]);
        setNewTax({
            name: '',
            type: 'percentage',
            rate: 0,
            amount: 0,
            description: '',
            appliesTo: 'all',
            enabled: true
        });
    };

    const removeTax = (id) => {
        setTaxes(taxes.filter(tax => tax.id !== id));
    };

    const toggleTax = (id) => {
        setTaxes(taxes.map(tax =>
            tax.id === id ? { ...tax, enabled: !tax.enabled } : tax
        ));
    };

    const handleSave = () => {
        onUpdate({ taxesAndFees: taxes });
    };

    return (
        <SpotlightCard className="rounded-2xl border bg-white border-gray-200 dark:bg-dark-800 dark:border-white/10 p-6">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="font-serif text-xl font-bold text-gray-900 dark:text-white">
                        Taxes & Fees
                    </h3>
                    <p className="text-sm font-sans text-gray-600 dark:text-gray-400">
                        Configure taxes, fees, and additional charges
                    </p>
                </div>
                <Button
                    onClick={handleSave}
                    disabled={isSaving}
                    isLoading={isSaving}
                    className="px-4 py-2 rounded-lg font-sans font-medium transition-colors bg-blue-600 dark:bg-blue-500 text-white hover:bg-blue-700 dark:hover:bg-blue-600 flex items-center gap-2"
                >
                    <Save size={18} />
                    Save Changes
                </Button>
            </div>

            <div className="space-y-6">
                {/* Add New Tax */}
                <div className="p-4 rounded-lg border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5">
                    <h4 className="font-serif text-lg font-bold text-gray-900 dark:text-white mb-4">
                        Add New Tax or Fee
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block text-sm font-sans font-medium text-gray-900 dark:text-white mb-2">
                                Name *
                            </label>
                            <Input
                                type="text"
                                value={newTax.name}
                                onChange={(e) => setNewTax({ ...newTax, name: e.target.value })}
                                placeholder="e.g., Service Fee"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-sans font-medium text-gray-900 dark:text-white mb-2">
                                Type
                            </label>
                            <select
                                value={newTax.type}
                                onChange={(e) => setNewTax({ ...newTax, type: e.target.value })}
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-white/10 bg-white dark:bg-dark-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="percentage">Percentage (%)</option>
                                <option value="fixed">Fixed Amount ($)</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-sans font-medium text-gray-900 dark:text-white mb-2">
                                {newTax.type === 'percentage' ? 'Rate (%)' : 'Amount ($)'}
                            </label>
                            <Input
                                type="number"
                                value={newTax.type === 'percentage' ? newTax.rate : newTax.amount}
                                onChange={(e) => setNewTax({
                                    ...newTax,
                                    [newTax.type === 'percentage' ? 'rate' : 'amount']: parseFloat(e.target.value)
                                })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-sans font-medium text-gray-900 dark:text-white mb-2">
                                Applies To
                            </label>
                            <select
                                value={newTax.appliesTo}
                                onChange={(e) => setNewTax({ ...newTax, appliesTo: e.target.value })}
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-white/10 bg-white dark:bg-dark-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="all">All Bookings</option>
                                <option value="per_night">Per Night</option>
                                <option value="per_stay">Per Stay</option>
                                <option value="services">Additional Services</option>
                            </select>
                        </div>
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-sans font-medium text-gray-900 dark:text-white mb-2">
                            Description
                        </label>
                        <Input
                            type="text"
                            value={newTax.description}
                            onChange={(e) => setNewTax({ ...newTax, description: e.target.value })}
                            placeholder="Describe this tax or fee"
                        />
                    </div>
                    <Button
                        onClick={addTax}
                        variant="success"
                        className="flex items-center gap-2"
                    >
                        <Plus size={18} />
                        Add Tax/Fee
                    </Button>
                </div>

                {/* Taxes List */}
                <div>
                    <h4 className="font-serif text-lg font-bold text-gray-900 dark:text-white mb-4">
                        Current Taxes & Fees
                    </h4>
                    <div className="space-y-4">
                        {taxes.map((tax, idx) => (
                            <div key={idx} className="p-4 rounded-lg border border-gray-200 dark:border-white/10 hover:border-blue-300 dark:hover:border-blue-500/50 transition-colors">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${tax.enabled ? 'bg-green-100 dark:bg-green-900/30' : 'bg-gray-100 dark:bg-white/10'}`}>
                                            {tax.type === 'percentage' ? (
                                                <Percent size={20} className={tax.enabled ? 'text-green-600 dark:text-green-400' : 'text-gray-400'} />
                                            ) : (
                                                <Banknote size={20} className={tax.enabled ? 'text-green-600 dark:text-green-400' : 'text-gray-400'} />
                                            )}
                                        </div>
                                        <div>
                                            <h5 className="font-sans font-medium text-gray-900 dark:text-white">
                                                {tax.name}
                                            </h5>
                                            <p className="text-sm font-sans text-gray-600 dark:text-gray-400">
                                                {tax.description}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className={`px-3 py-1 rounded-full text-sm font-mono font-medium ${tax.enabled ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-gray-100 text-gray-800 dark:bg-white/10 dark:text-gray-400'}`}>
                                            {tax.type === 'percentage' ? `${tax.rate}%` : `₦${tax.amount.toLocaleString()}`}
                                        </span>
                                        <ToggleSwitch
                                            enabled={tax.enabled}
                                            onChange={() => toggleTax(tax.id)}
                                            label=""
                                        />
                                    </div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-sans text-gray-500 dark:text-gray-400">
                                        Applies to: {tax.appliesTo.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                    </span>
                                    <Button
                                        onClick={() => removeTax(tax.id)}
                                        variant="ghostDestructive"
                                        size="icon"
                                    >
                                        <Trash2 size={16} />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Tax Preview */}
                <div className="p-4 rounded-lg border border-gray-200 dark:border-white/10 bg-blue-50 dark:bg-blue-900/20">
                    <h4 className="font-serif text-lg font-bold text-gray-900 dark:text-white mb-4">
                        Tax Preview
                    </h4>
                    <div className="space-y-3">
                        <div className="flex justify-between">
                            <span className="font-sans text-gray-700 dark:text-gray-300">Room Rate (3 nights)</span>
                            <span className="font-sans font-medium text-gray-900 dark:text-white">₦897,000</span>
                        </div>
                        {taxes.filter(t => t.enabled).map((tax, idx) => (
                            <div key={idx} className="flex justify-between text-sm">
                                <span className="text-gray-600 dark:text-gray-400">{tax.name}</span>
                                <span className="font-medium text-gray-900 dark:text-white">
                                    {tax.type === 'percentage'
                                        ? `₦${(897000 * (tax.rate / 100)).toLocaleString()}`
                                        : tax.appliesTo === 'per_night'
                                            ? `₦${(tax.amount * 3).toLocaleString()}`
                                            : `₦${tax.amount.toLocaleString()}`
                                    }
                                </span>
                            </div>
                        ))}
                        <div className="flex justify-between pt-3 border-t border-gray-300 dark:border-white/10">
                            <span className="font-serif font-bold text-gray-900 dark:text-white">Total with Taxes</span>
                            <span className="font-serif text-xl font-bold text-gray-900 dark:text-white">₦1,124,250</span>
                        </div>
                    </div>
                </div>
            </div>
        </SpotlightCard>
    );
};

// Policies Component
const PoliciesSettings = ({ data, onUpdate, isSaving }) => {
    const [policies, setPolicies] = useState(data || {
        cancellation: {
            freeCancellationHours: 48,
            cancellationFee: 50,
            noShowFee: 100,
            description: ''
        },
        deposit: {
            required: true,
            amountType: 'percentage',
            amount: 30,
            dueHours: 24,
            description: ''
        },
        checkIn: {
            earlyCheckIn: true,
            earlyCheckInFee: 15000,
            lateCheckIn: true,
            latestCheckInTime: '22:00',
            description: ''
        },
        children: {
            childrenAllowed: true,
            maxChildrenAge: 12,
            extraBedFee: 25000,
            cribAvailable: true,
            cribFee: 10000,
            description: ''
        },
        pets: {
            petsAllowed: false,
            petFee: 25000,
            maxPets: 1,
            description: ''
        },
        smoking: {
            smokingAllowed: false,
            smokingFee: 150000,
            description: ''
        }
    });

    useEffect(() => {
        if (data) setPolicies(data);
    }, [data]);

    const [editingPolicy, setEditingPolicy] = useState(null);

    const handleSave = () => {
        onUpdate({ policies });
    };

    const PolicyCard = ({ title, policy, fields, icon: Icon }) => (
        <SpotlightCard className="p-4 rounded-lg border border-gray-200 dark:border-white/10">
            <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                        <Icon size={20} className="text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                        <h5 className="font-serif font-bold text-gray-900 dark:text-white">{title}</h5>
                        <p className="text-sm font-sans text-gray-600 dark:text-gray-400">
                            {policy.description}
                        </p>
                    </div>
                </div>
                <Button
                    onClick={() => setEditingPolicy(title.toLowerCase())}
                    variant="ghost"
                    size="icon"
                    className="text-gray-900 dark:text-white"
                >
                    <Edit size={16} />
                </Button>
            </div>
            <div className="grid grid-cols-2 gap-4">
                {fields.map(field => (
                    <div key={field.key}>
                        <p className="text-xs font-sans text-gray-500 dark:text-gray-400 mb-1">
                            {field.label}
                        </p>
                        <p className="font-sans font-medium text-gray-900 dark:text-white">
                            {typeof policy[field.key] === 'boolean'
                                ? policy[field.key] ? 'Yes' : 'No'
                                : field.key.toLowerCase().includes('fee') || field.key.toLowerCase().includes('amount')
                                    ? policy.amountType === 'percentage' && field.key === 'amount'
                                        ? `${policy[field.key]}%`
                                        : `₦${policy[field.key].toLocaleString()}`
                                    : policy[field.key]
                            }
                        </p>
                    </div>
                ))}
            </div>
        </SpotlightCard>
    );

    const EditPolicyModal = () => {
        if (!editingPolicy) return null;

        const policyKey = editingPolicy;
        const currentPolicy = policies[policyKey];

        const handleSaveChanges = () => {
            setPolicies({ ...policies, [policyKey]: currentPolicy });
            setEditingPolicy(null);
        };

        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                <div className="bg-white dark:bg-dark-800 rounded-2xl w-full max-w-2xl">
                    <div className="p-6 border-b border-gray-200 dark:border-white/10">
                        <div className="flex items-center justify-between">
                            <h3 className="font-serif text-xl font-bold text-gray-900 dark:text-white">
                                Edit {editingPolicy.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} Policy
                            </h3>
                            <Button
                                onClick={() => setEditingPolicy(null)}
                                variant="ghost"
                                size="icon"
                                className="text-gray-900 dark:text-white"
                            >
                                <X size={24} />
                            </Button>
                        </div>
                    </div>
                    <div className="p-6">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-sans font-medium text-gray-900 dark:text-white mb-2">
                                    Description
                                </label>
                                <textarea
                                    value={currentPolicy?.description}
                                    onChange={(e) => {
                                        const updated = { ...currentPolicy, description: e.target.value };
                                        setPolicies({ ...policies, [policyKey]: updated });
                                    }}
                                    rows="3"
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-white/10 bg-white dark:bg-dark-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                            {editingPolicy === 'cancellation' && (
                                <>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-sans font-medium text-gray-900 dark:text-white mb-2">
                                                Free Cancellation (hours)
                                            </label>
                                            <input
                                                type="number"
                                                value={currentPolicy.freeCancellationHours}
                                                onChange={(e) => {
                                                    const updated = { ...currentPolicy, freeCancellationHours: parseInt(e.target.value) };
                                                    setPolicies({ ...policies, [policyKey]: updated });
                                                }}
                                                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-white/10 bg-white dark:bg-dark-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-sans font-medium text-gray-900 dark:text-white mb-2">
                                                Cancellation Fee (%)
                                            </label>
                                            <input
                                                type="number"
                                                value={currentPolicy.cancellationFee}
                                                onChange={(e) => {
                                                    const updated = { ...currentPolicy, cancellationFee: parseInt(e.target.value) };
                                                    setPolicies({ ...policies, [policyKey]: updated });
                                                }}
                                                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-white/10 bg-white dark:bg-dark-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-sans font-medium text-gray-900 dark:text-white mb-2">
                                            No-Show Fee (%)
                                        </label>
                                        <input
                                            type="number"
                                            value={currentPolicy.noShowFee}
                                            onChange={(e) => {
                                                const updated = { ...currentPolicy, noShowFee: parseInt(e.target.value) };
                                                setPolicies({ ...policies, [policyKey]: updated });
                                            }}
                                            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-white/10 bg-white dark:bg-dark-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>
                                </>
                            )}
                            {/* Add other policy fields similarly */}
                        </div>
                        <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-200 dark:border-white/10">
                            <Button
                                onClick={() => setEditingPolicy(null)}
                                variant="secondary"
                            >
                                Cancel
                            </Button>
                            <Button
                                className='cursor-pointer'
                                onClick={handleSaveChanges}
                                disabled={isSaving}
                                isLoading={isSaving}
                            >
                                Save Changes
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="rounded-2xl border bg-white border-gray-200 dark:bg-dark-800 dark:border-white/10 p-6">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="font-serif text-xl font-bold text-gray-900 dark:text-white">
                        Hotel Policies
                    </h3>
                    <p className="text-sm font-sans text-gray-600 dark:text-gray-400">
                        Configure cancellation, check-in, and other policies
                    </p>
                </div>
                <Button
                    onClick={handleSave}
                    disabled={isSaving}
                    isLoading={isSaving}
                    className="flex items-center gap-2"
                >
                    <Save size={18} />
                    Save Changes
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <PolicyCard
                    title="Cancellation Policy"
                    policy={policies.cancellation}
                    icon={X}
                    fields={[
                        { key: 'freeCancellationHours', label: 'Free Cancellation' },
                        { key: 'cancellationFee', label: 'Cancellation Fee' },
                        { key: 'noShowFee', label: 'No-Show Fee' }
                    ]}
                />
                <PolicyCard
                    title="Deposit Policy"
                    policy={policies.deposit}
                    icon={CreditCard}
                    fields={[
                        { key: 'required', label: 'Deposit Required' },
                        { key: 'amount', label: 'Deposit Amount' },
                        { key: 'dueHours', label: 'Due Within' }
                    ]}
                />
                <PolicyCard
                    title="Check-in Policy"
                    policy={policies.checkIn}
                    icon={Clock}
                    fields={[
                        { key: 'earlyCheckIn', label: 'Early Check-in' },
                        { key: 'earlyCheckInFee', label: 'Early Check-in Fee' },
                        { key: 'lateCheckIn', label: 'Late Check-in' }
                    ]}
                />
                <PolicyCard
                    title="Children Policy"
                    policy={policies.children}
                    icon={Users}
                    fields={[
                        { key: 'childrenAllowed', label: 'Children Allowed' },
                        { key: 'maxChildrenAge', label: 'Max Age Free' },
                        { key: 'extraBedFee', label: 'Extra Bed Fee' }
                    ]}
                />
                <PolicyCard
                    title="Pet Policy"
                    policy={policies.pets}
                    icon={Shield}
                    fields={[
                        { key: 'petsAllowed', label: 'Pets Allowed' },
                        { key: 'petFee', label: 'Pet Fee' },
                        { key: 'maxPets', label: 'Max Pets' }
                    ]}
                />
                <PolicyCard
                    title="Smoking Policy"
                    policy={policies.smoking}
                    icon={AlertCircle}
                    fields={[
                        { key: 'smokingAllowed', label: 'Smoking Allowed' },
                        { key: 'smokingFee', label: 'Smoking Fee' }
                    ]}
                />
            </div>

            {/* Additional Policy Settings */}
            <div className="mt-6 p-4 rounded-lg border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5">
                <h4 className="font-serif text-lg font-bold text-gray-900 dark:text-white mb-4">
                    Additional Settings
                </h4>
                <div className="space-y-4">
                    <ToggleSwitch
                        enabled={policies.sendPolicyConfirmation}
                        onChange={(val) => setPolicies({ ...policies, sendPolicyConfirmation: val })}
                        label="Send policy confirmation emails"
                    />
                    <ToggleSwitch
                        enabled={policies.requirePolicyAcceptance}
                        onChange={(val) => setPolicies({ ...policies, requirePolicyAcceptance: val })}
                        label="Require policy acceptance at booking"
                    />
                    <ToggleSwitch
                        enabled={policies.displayPolicies}
                        onChange={(val) => setPolicies({ ...policies, displayPolicies: val })}
                        label="Display policies on booking page"
                    />
                </div>
            </div>

            {editingPolicy && <EditPolicyModal />}
        </div>
    );
};

// Email Templates Component
const EmailTemplatesSettings = ({ data, onUpdate, isSaving }) => {
    const [templates, setTemplates] = useState(data || []);

    useEffect(() => {
        if (data) setTemplates(data);
    }, [data]);

    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const [previewMode, setPreviewMode] = useState('desktop');
    const [emailContent, setEmailContent] = useState(`<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width">
    <title>Booking Confirmation</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; }
        .footer { background: #f5f5f5; padding: 20px; text-align: center; color: #666; font-size: 14px; border-radius: 0 0 10px 10px; }
        .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 10px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>{hotel_name}</h1>
            <p>Booking Confirmation</p>
        </div>
        <div class="content">
            <h2>Dear {guest_name},</h2>
            <p>Thank you for choosing {hotel_name}! Your booking has been confirmed.</p>
            
            <h3>Booking Details:</h3>
            <p><strong>Booking ID:</strong> {booking_id}</p>
            <p><strong>Check-in:</strong> {check_in}</p>
            <p><strong>Check-out:</strong> {check_out}</p>
            <p><strong>Room Type:</strong> {room_type}</p>
            <p><strong>Total Amount:</strong> ₦{total_amount}</p>
            
            <p>We look forward to welcoming you!</p>
            <a href="#" class="button">View Booking Details</a>
        </div>
        <div class="footer">
            <p>{hotel_name}<br>
            {hotel_address}<br>
            {hotel_phone} | {hotel_email}</p>
            <p>If you have any questions, please contact us.</p>
        </div>
    </div>
</body>
</html>`);

    const handleSelectTemplate = (template) => {
        setSelectedTemplate(template);
        // In a real app, you would load the template content from your database
    };

    const handleTestEmail = () => {
        alert('Test email sent to admin@suavebychloe.com');
    };

    const handleSaveTemplate = () => {
        onUpdate({ emailTemplates: templates });
    };

    const handleCopyVariable = (variable) => {
        navigator.clipboard.writeText(`{${variable}}`);
        alert(`Copied: {${variable}}`);
    };

    return (
        <SpotlightCard className="rounded-2xl border bg-white border-gray-200 dark:bg-dark-800 dark:border-white/10 p-6">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="font-serif text-xl font-bold text-gray-900 dark:text-white">
                        Email Templates
                    </h3>
                    <p className="text-sm font-sans text-gray-600 dark:text-gray-400">
                        Customize automated emails sent to guests
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Button
                        onClick={handleTestEmail}
                        variant="secondary"
                        className="flex items-center gap-2"
                    >
                        <MailIcon size={16} />
                        Send Test
                    </Button>
                    <Button
                        onClick={handleSaveTemplate}
                        disabled={isSaving}
                        isLoading={isSaving}
                        className="flex items-center gap-2"
                    >
                        <Save size={18} />
                        Save Template
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Templates List */}
                <div className="lg:col-span-1">
                    <div className="space-y-3">
                        {templates.map(template => (
                            <div
                                key={template.id}
                                onClick={() => handleSelectTemplate(template)}
                                className={`p-4 rounded-lg border cursor-pointer transition-colors ${selectedTemplate?.id === template.id
                                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                    : 'border-gray-200 dark:border-white/10 hover:border-blue-300 dark:hover:border-blue-500/50'
                                    }`}
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <h4 className="font-sans font-medium text-gray-900 dark:text-white">
                                        {template.name}
                                    </h4>
                                    <div className="flex items-center gap-2">
                                        {template.enabled ? (
                                            <Check size={16} className="text-green-500" />
                                        ) : (
                                            <X size={16} className="text-gray-400" />
                                        )}
                                        <span className={`w-2 h-2 rounded-full ${template.enabled ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                                    </div>
                                </div>
                                <p className="text-sm font-sans text-gray-600 dark:text-gray-400 mb-2">
                                    {template.subject}
                                </p>
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-sans text-gray-500 dark:text-gray-400">
                                        Modified: {template.lastModified}
                                    </span>
                                    <span className="text-xs px-2 py-1 rounded bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-gray-300">
                                        {template.type}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Available Variables */}
                    <div className="mt-6 p-4 rounded-lg border border-gray-200 dark:border-white/10">
                        <h4 className="font-serif font-bold text-gray-900 dark:text-white mb-3">
                            Available Variables
                        </h4>
                        <div className="grid grid-cols-2 gap-2">
                            {[
                                'guest_name', 'booking_id', 'check_in', 'check_out',
                                'room_type', 'total_amount', 'hotel_name', 'hotel_address',
                                'hotel_phone', 'hotel_email'
                            ].map(variable => (
                                <button
                                    key={variable}
                                    onClick={() => handleCopyVariable(variable)}
                                    className="px-2 py-1 rounded text-xs font-sans bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/20 flex items-center justify-between"
                                >
                                    <span>{variable}</span>
                                    <Copy size={10} />
                                </button>
                            ))}
                        </div>
                        <p className="text-xs font-sans text-gray-500 dark:text-gray-400 mt-2">
                            Click to copy variable
                        </p>
                    </div>
                </div>

                {/* Template Editor */}
                <div className="lg:col-span-2">
                    {selectedTemplate ? (
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="font-serif text-xl font-bold text-gray-900 dark:text-white">
                                        {selectedTemplate.name}
                                    </h3>
                                    <p className="text-sm font-sans text-gray-600 dark:text-gray-400">
                                        Edit email template content and settings
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="flex bg-gray-100 dark:bg-white/10 rounded-lg p-1">
                                        <button
                                            onClick={() => setPreviewMode('desktop')}
                                            className={`px-3 py-1 rounded text-sm font-sans ${previewMode === 'desktop' ? 'bg-white dark:bg-dark-700 text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-400'}`}
                                        >
                                            Desktop
                                        </button>
                                        <button
                                            onClick={() => setPreviewMode('mobile')}
                                            className={`px-3 py-1 rounded text-sm font-sans ${previewMode === 'mobile' ? 'bg-white dark:bg-dark-700 text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-400'}`}
                                        >
                                            Mobile
                                        </button>
                                        <button
                                            onClick={() => setPreviewMode('code')}
                                            className={`px-3 py-1 rounded text-sm font-sans ${previewMode === 'code' ? 'bg-white dark:bg-dark-700 text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-400'}`}
                                        >
                                            Code
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Email Subject */}
                            <div>
                                <label className="block text-sm font-sans font-medium text-gray-900 dark:text-white mb-2">
                                    Email Subject
                                </label>
                                <Input
                                    type="text"
                                    defaultValue={selectedTemplate.subject}
                                />
                            </div>

                            {/* Template Editor/Preview */}
                            <div>
                                <label className="block text-sm font-sans font-medium text-gray-900 dark:text-white mb-2">
                                    {previewMode === 'code' ? 'HTML Code' : 'Preview'}
                                </label>
                                {previewMode === 'code' ? (
                                    <textarea
                                        value={emailContent}
                                        onChange={(e) => setEmailContent(e.target.value)}
                                        rows="15"
                                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-white/10 bg-gray-900 text-gray-100 font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                ) : (
                                    <div className={`border border-gray-300 dark:border-white/10 rounded-lg overflow-hidden ${previewMode === 'mobile' ? 'max-w-sm' : ''}`}>
                                        <div className="border-b border-gray-300 dark:border-white/10 bg-gray-100 dark:bg-white/5 p-3">
                                            <div className="flex items-center gap-2">
                                                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                                                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                                <span className="text-xs font-sans text-gray-600 dark:text-gray-400 ml-2">
                                                    {selectedTemplate.name} - Preview
                                                </span>
                                            </div>
                                        </div>
                                        <div className="bg-white dark:bg-gray-900 p-4">
                                            <div dangerouslySetInnerHTML={{
                                                __html: emailContent
                                                    .replace(/{guest_name}/g, 'John Smith')
                                                    .replace(/{booking_id}/g, 'RES-789012')
                                                    .replace(/{check_in}/g, 'Jun 15, 2024')
                                                    .replace(/{check_out}/g, 'Jun 20, 2024')
                                                    .replace(/{room_type}/g, 'Deluxe City Suite')
                                                    .replace(/{total_amount}/g, '$1,497')
                                                    .replace(/{hotel_name}/g, 'Suave By Chloe')
                                                    .replace(/{hotel_address}/g, 'Kubwa, Abuja, Nigeria')
                                                    .replace(/{hotel_phone}/g, '+234 800 123 4567')
                                                    .replace(/{hotel_email}/g, 'info@suavebychloe.com')
                                            }} />
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Template Settings */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-sans font-medium text-gray-900 dark:text-white mb-2">
                                        Send Delay (hours before/after)
                                    </label>
                                    <Input
                                        type="number"
                                        defaultValue="24"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-sans font-medium text-gray-900 dark:text-white mb-2">
                                        Email Format
                                    </label>
                                    <select className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-white/10 bg-white dark:bg-dark-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                                        <option value="html">HTML</option>
                                        <option value="plain">Plain Text</option>
                                        <option value="both">Both</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <MailIcon size={48} className="mx-auto text-gray-400 mb-4" />
                            <p className="font-sans text-gray-600 dark:text-gray-400">
                                Select an email template to edit
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </SpotlightCard>
    );
};

// Main AdminSettings Component
const AdminSettings = () => {
    const [activeSection, setActiveSection] = useState('hotel-info');
    const { data: settings, isLoading, isError, error } = useGetSettingsQuery();
    const [updateSettings, { isLoading: isUpdating, reset: resetUpdate }] = useUpdateSettingsMutation();

    const handleUpdate = async (updatedData) => {
        const formData = new FormData();

        // Convert the updatedData object to FormData
        Object.entries(updatedData).forEach(([key, value]) => {
            if (value === undefined || value === null) return;

            // Handle logo (single file)
            if (key === 'logo' && (value instanceof File || value instanceof Blob)) {
                formData.append(key, value);
            }
            // Handle gallery (array of files)
            else if (key === 'gallery' && Array.isArray(value)) {
                value.forEach(file => {
                    if (file instanceof File || file instanceof Blob) {
                        formData.append(key, file);
                    }
                });
            }
            // Handle objects (like hotelInfo)
            else if (typeof value === 'object' && !(value instanceof File) && !(value instanceof Blob)) {
                formData.append(key, JSON.stringify(value));
            }
            // Handle plain values
            else {
                formData.append(key, value);
            }
        });

        try {
            await updateSettings(formData).unwrap();
            toast.success('Settings updated successfully');
            setTimeout(() => resetUpdate(), 3000);
        } catch (err) {
            toast.error(err?.data?.message || 'Failed to update settings');
        }
    };

    const sections = [
        { id: 'hotel-info', label: 'Hotel Information', icon: Building },
        { id: 'taxes-fees', label: 'Taxes & Fees', icon: Receipt },
        { id: 'policies', label: 'Policies', icon: FileText },
        { id: 'email-templates', label: 'Email Templates', icon: MailIcon },
        { id: 'users', label: 'Users & Permissions', icon: Users },
        { id: 'security', label: 'Security', icon: Lock },
        { id: 'integrations', label: 'Integrations', icon: Code },
        { id: 'appearance', label: 'Appearance', icon: Palette }
    ];

    const handleSaveAll = () => {
        // Each sub-component handles its own saving for precision.
        toast.success('All settings are auto-synced on save');
    };

    const handleBackup = () => {
        toast.loading('Settings backup initiated...');
    };

    const handleRestore = () => {
        toast.loading('Settings restore dialog opened...');
    };

    if (isLoading) return <Loader />;
    if (isError) return <div className="p-8 text-center text-red-500">Error loading settings: {error?.data?.message || 'Unknown error'}</div>;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-void p-4 sm:p-6 lg:p-8">
            <Helmet>
                <title>Settings | Suave By Chloe</title>
                <meta name="robots" content="noindex, nofollow" />
            </Helmet>
            <div className="max-w-7xl mx-auto">
                {/* Page Header */}
                <div className="mb-8">
                    <span className="font-mono text-sm text-blue-500 tracking-widest uppercase mb-2 block">
                        ADMIN_SETTINGS
                    </span>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="min-w-0">
                            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                                Hotel Settings
                            </h1>
                            <p className="font-sans text-sm sm:text-base text-gray-600 dark:text-gray-400">
                                Configure hotel information, policies, and system settings
                            </p>
                        </div>
                        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                            <Button
                                onClick={handleBackup}
                                variant="secondary"
                                className="flex items-center gap-2 text-sm sm:text-base px-3 sm:px-4"
                            >
                                <Download size={16} className="sm:w-[18px] sm:h-[18px]" />
                                <span className="hidden sm:inline">Backup</span>
                            </Button>
                            <Button
                                onClick={handleRestore}
                                variant="secondary"
                                className="flex items-center gap-2 text-sm sm:text-base px-3 sm:px-4"
                            >
                                <Upload size={16} className="sm:w-[18px] sm:h-[18px]" />
                                <span className="hidden sm:inline">Restore</span>
                            </Button>
                            <Button
                                onClick={handleSaveAll}
                                isLoading={isUpdating}
                                disabled={isUpdating}
                                className="px-4 sm:px-6 py-2 flex items-center gap-2 text-sm sm:text-base"
                            >
                                {!isUpdating && (
                                    <>
                                        <Save size={16} className="sm:w-[18px] sm:h-[18px]" />
                                        <span className="hidden sm:inline">Save All Changes</span>
                                        <span className="sm:hidden">Save All</span>
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Settings Navigation */}
                <div className="mb-8">
                    <SpotlightCard className="rounded-2xl border bg-white border-gray-200 dark:bg-dark-800 dark:border-white/10">
                        <div className="p-4">
                            <div className="flex flex-wrap gap-2">
                                {sections.map(section => {
                                    const Icon = section.icon;
                                    return (
                                        <button
                                            key={section.id}
                                            onClick={() => setActiveSection(section.id)}
                                            className={`px-3 sm:px-4 py-2 sm:py-3 rounded-lg font-sans text-sm sm:text-base font-medium transition-all flex items-center gap-2 whitespace-nowrap ${activeSection === section.id
                                                ? 'bg-blue-600 dark:bg-blue-500 text-white'
                                                : 'bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/10'
                                                }`}
                                        >
                                            <Icon size={16} className="sm:w-[18px] sm:h-[18px] flex-shrink-0" />
                                            <span className="truncate">{section.label}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </SpotlightCard>
                </div>

                {/* Settings Content */}
                <div className="mb-8">
                    {activeSection === 'hotel-info' && (
                        <HotelInfoSettings
                            data={settings?.hotelInfo}
                            onUpdate={handleUpdate}
                            isSaving={isUpdating}
                        />
                    )}
                    {activeSection === 'taxes-fees' && (
                        <TaxesFeesSettings
                            data={settings?.taxesAndFees}
                            onUpdate={handleUpdate}
                            isSaving={isUpdating}
                        />
                    )}
                    {activeSection === 'policies' && (
                        <PoliciesSettings
                            data={settings?.policies}
                            onUpdate={handleUpdate}
                            isSaving={isUpdating}
                        />
                    )}
                    {activeSection === 'email-templates' && (
                        <EmailTemplatesSettings
                            data={settings?.emailTemplates}
                            onUpdate={handleUpdate}
                            isSaving={isUpdating}
                        />
                    )}
                    {activeSection === 'users' && (
                        <SpotlightCard className="rounded-2xl border bg-white border-gray-200 dark:bg-dark-800 dark:border-white/10 p-6">
                            <div className="text-center py-12">
                                <Users size={48} className="mx-auto text-gray-400 mb-4" />
                                <h3 className="font-serif text-xl font-bold text-gray-900 dark:text-white mb-2">
                                    Users & Permissions
                                </h3>
                                <p className="text-sm font-sans text-gray-600 dark:text-gray-400 mb-4">
                                    Manage staff users and their permissions
                                </p>
                                <Button>
                                    Manage Users
                                </Button>
                            </div>
                        </SpotlightCard>
                    )}
                    {activeSection === 'security' && (
                        <SpotlightCard className="rounded-2xl border bg-white border-gray-200 dark:bg-dark-800 dark:border-white/10 p-6">
                            <div className="text-center py-12">
                                <Lock size={48} className="mx-auto text-gray-400 mb-4" />
                                <h3 className="font-serif text-xl font-bold text-gray-900 dark:text-white mb-2">
                                    Security Settings
                                </h3>
                                <p className="text-sm font-sans text-gray-600 dark:text-gray-400 mb-4">
                                    Configure security preferences and access controls
                                </p>
                                <Button>
                                    Security Settings
                                </Button>
                            </div>
                        </SpotlightCard>
                    )}
                    {activeSection === 'integrations' && (
                        <SpotlightCard className="rounded-2xl border bg-white border-gray-200 dark:bg-dark-800 dark:border-white/10 p-6">
                            <div className="text-center py-12">
                                <Code size={48} className="mx-auto text-gray-400 mb-4" />
                                <h3 className="font-serif text-xl font-bold text-gray-900 dark:text-white mb-2">
                                    Integrations
                                </h3>
                                <p className="text-sm font-sans text-gray-600 dark:text-gray-400 mb-4">
                                    Connect third-party services and APIs
                                </p>
                                <Button>
                                    Manage Integrations
                                </Button>
                            </div>
                        </SpotlightCard>
                    )}
                    {activeSection === 'appearance' && (
                        <SpotlightCard className="rounded-2xl border bg-white border-gray-200 dark:bg-dark-800 dark:border-white/10 p-6">
                            <div className="text-center py-12">
                                <Palette size={48} className="mx-auto text-gray-400 mb-4" />
                                <h3 className="font-serif text-xl font-bold text-gray-900 dark:text-white mb-2">
                                    Appearance
                                </h3>
                                <p className="text-sm font-sans text-gray-600 dark:text-gray-400 mb-4">
                                    Customize colors, themes, and visual settings
                                </p>
                                <Button>
                                    Customize Appearance
                                </Button>
                            </div>
                        </SpotlightCard>
                    )}
                </div>

                {/* Settings Actions */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <SpotlightCard className="rounded-2xl border bg-white border-gray-200 dark:bg-dark-800 dark:border-white/10 p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                                <Trash2 size={24} className="text-red-600 dark:text-red-400" />
                            </div>
                            <div>
                                <h4 className="font-serif font-bold text-gray-900 dark:text-white">
                                    Reset Settings
                                </h4>
                                <p className="text-sm font-sans text-gray-600 dark:text-gray-400">
                                    Reset all settings to default
                                </p>
                            </div>
                        </div>
                        <Button variant="outlineDestructive" className="w-full">
                            Reset to Defaults
                        </Button>
                    </SpotlightCard>

                    <SpotlightCard className="rounded-2xl border bg-white border-gray-200 dark:bg-dark-800 dark:border-white/10 p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                                <Database size={24} className="text-green-600 dark:text-green-400" />
                            </div>
                            <div>
                                <h4 className="font-serif font-bold text-gray-900 dark:text-white">
                                    Export Settings
                                </h4>
                                <p className="text-sm font-sans text-gray-600 dark:text-gray-400">
                                    Export all settings as JSON
                                </p>
                            </div>
                        </div>
                        <Button variant="secondary" className="w-full">
                            Export JSON
                        </Button>
                    </SpotlightCard>

                    <SpotlightCard className="rounded-2xl border bg-white border-gray-200 dark:bg-dark-800 dark:border-white/10 p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                                <Eye size={24} className="text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                                <h4 className="font-serif font-bold text-gray-900 dark:text-white">
                                    Audit Log
                                </h4>
                                <p className="text-sm font-sans text-gray-600 dark:text-gray-400">
                                    View settings change history
                                </p>
                            </div>
                        </div>
                        <Button variant="secondary" className="w-full">
                            View Audit Log
                        </Button>
                    </SpotlightCard>
                </div>
            </div>
        </div>
    );
};

export default AdminSettings;