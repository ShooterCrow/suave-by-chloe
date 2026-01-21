import React, { useState, useEffect } from 'react';
import { Save, Building, Phone, Upload, X, Clock, Camera, MapPin } from 'lucide-react';
import Button from '../Button';
import Input from '../Input';
import {
    useUpdateSettingsMutation
} from '../../../pages/authenticatedPages/settingsApiSlice';
import { toast } from 'react-hot-toast';

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
        coordinates: { lat: 0, lng: 0 },
        googleEmbedLink: ''
    });

    // Logo state management (single image)
    const [logoFile, setLogoFile] = useState(null);
    const [logoPreview, setLogoPreview] = useState("https://res.cloudinary.com/ddjxdvgd5/image/upload/branding/logo" || '');
    const [originalLogo, setOriginalLogo] = useState(data?.logo || null);
    const [logoError, setLogoError] = useState('');

    // Use the new updateSettings mutation
    const [updateSettings, { isLoading: isUpdating }] = useUpdateSettingsMutation();

    useEffect(() => {
        if (data) {
            setHotelInfo(data);
            setLogoPreview(data.logo?.url || "https://res.cloudinary.com/ddjxdvgd5/image/upload/branding/logo");
            setOriginalLogo(data.logo || null);
        }
    }, [data]);

    // Cleanup preview URLs on unmount
    useEffect(() => {
        return () => {
            if (logoFile && logoPreview && !originalLogo?.url) {
                URL.revokeObjectURL(logoPreview);
            }
        };
    }, []);

    // ==================== LOGO HANDLERS (Single Image) ====================
    const handleLogoChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            setLogoError('Please select an image file');
            return;
        }

        // Validate file size (10MB limit)
        if (file.size > 10 * 1024 * 1024) {
            setLogoError('File size must be less than 10MB');
            return;
        }

        // Clean up previous preview if it exists
        if (logoFile && logoPreview && !originalLogo?.url) {
            URL.revokeObjectURL(logoPreview);
        }

        setLogoFile(file);
        setLogoPreview(URL.createObjectURL(file));
        setLogoError('');
    };

    const handleRemoveLogo = () => {
        // Clean up preview URL
        if (logoFile && logoPreview && !originalLogo?.url) {
            URL.revokeObjectURL(logoPreview);
        }

        setLogoFile('remove'); // Flag for deletion
        setLogoPreview('');
        setOriginalLogo(null);
        setLogoError('');
    };

    // ==================== FORM SUBMISSION ====================
    const handleSave = async () => {
        try {
            const formData = new FormData();

            // Create a hotelInfo object with ALL hotel information
            const hotelInfoData = {
                name: hotelInfo.name,
                tagline: hotelInfo.tagline,
                description: hotelInfo.description,
                address: hotelInfo.address,
                city: hotelInfo.city || '',
                state: hotelInfo.state || '',
                country: hotelInfo.country || '',
                postalCode: hotelInfo.postalCode || '',
                phone: hotelInfo.phone,
                email: hotelInfo.email,
                website: hotelInfo.website || '',
                checkInTime: hotelInfo.checkInTime || '',
                checkOutTime: hotelInfo.checkOutTime || '',
                timezone: hotelInfo.timezone || '',
                currency: hotelInfo.currency || '',
                totalRooms: hotelInfo.totalRooms || 0,
                starRating: hotelInfo.starRating || 0,
                coordinates: hotelInfo.coordinates || { lat: 0, lng: 0 },
                googleEmbedLink: hotelInfo.googleEmbedLink || ''
            };

            // Append hotelInfo as JSON string
            formData.append('hotelInfo', JSON.stringify(hotelInfoData));

            // Handle logo (single image)
            if (logoFile instanceof File) {
                formData.append('logo', logoFile);
            } else if (logoFile === 'remove') {
                formData.append('removeLogo', 'true');
            }

            // Pass formData directly
            await updateSettings(formData).unwrap();

            toast.success('Settings updated successfully');

            // Clear local file states
            setLogoFile(null);
            setLogoError('');

        } catch (err) {
            console.error('Update error:', err);
            toast.error(err?.data?.message || 'Failed to update settings');
        }
    };

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
                    disabled={isUpdating}
                    isLoading={isUpdating}
                    className="flex items-center gap-2"
                >
                    <Save size={18} />
                    Save Changes
                </Button>
            </div>

            <div className="space-y-8">
                {/* Logo Upload (Single Image) */}
                <div>
                    <label className="block text-sm font-sans font-medium text-gray-900 dark:text-white mb-3">
                        Hotel Logo
                    </label>
                    <div className="flex items-start gap-6">
                        <div className="w-32 h-32 rounded-lg border-2 border-dashed border-gray-300 dark:border-white/20 flex items-center justify-center overflow-hidden relative">
                            {logoPreview ? (
                                <>
                                    <img src={logoPreview} alt="Hotel Logo" className="w-full h-full object-contain p-2" />
                                    <button
                                        type="button"
                                        onClick={handleRemoveLogo}
                                        className="absolute top-2 right-2 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-colors"
                                        title="Remove logo"
                                    >
                                        <X size={14} />
                                    </button>
                                    {logoFile instanceof File && (
                                        <div className="absolute bottom-2 left-2 bg-blue-600 text-white px-2 py-1 rounded text-xs">
                                            New
                                        </div>
                                    )}
                                </>
                            ) : (
                                <div className="text-center p-4">
                                    <Building size={32} className="mx-auto text-gray-400 mb-2" />
                                    <span className="text-xs font-sans text-gray-500 dark:text-gray-400">Upload Logo</span>
                                </div>
                            )}
                        </div>
                        <div className="flex-1">
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
                                Recommended: 300×300px, PNG or SVG format. Max size: 10MB
                            </p>
                            {logoError && (
                                <p className="text-xs font-sans text-red-500 dark:text-red-400 mt-2">
                                    {logoError}
                                </p>
                            )}
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

                {/* Location Coordinates */}
                <div>
                    <h4 className="font-serif text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                            <circle cx="12" cy="10" r="3" />
                        </svg>
                        Location Coordinates
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-sans font-medium text-gray-900 dark:text-white mb-2">
                                Latitude
                            </label>
                            <Input
                                type="number"
                                step="0.000001"
                                value={hotelInfo.coordinates?.lat || ''}
                                onChange={(e) => setHotelInfo({
                                    ...hotelInfo,
                                    coordinates: {
                                        ...hotelInfo.coordinates,
                                        lat: parseFloat(e.target.value) || 0
                                    }
                                })}
                                placeholder="e.g., 9.1550"
                            />
                            <p className="text-xs font-sans text-gray-500 dark:text-gray-400 mt-1">
                                Used for map location display
                            </p>
                        </div>
                        <div>
                            <label className="block text-sm font-sans font-medium text-gray-900 dark:text-white mb-2">
                                Longitude
                            </label>
                            <Input
                                type="number"
                                step="0.000001"
                                value={hotelInfo.coordinates?.lng || ''}
                                onChange={(e) => setHotelInfo({
                                    ...hotelInfo,
                                    coordinates: {
                                        ...hotelInfo.coordinates,
                                        lng: parseFloat(e.target.value) || 0
                                    }
                                })}
                                placeholder="e.g., 7.3221"
                            />
                            <p className="text-xs font-sans text-gray-500 dark:text-gray-400 mt-1">
                                Used for map location display
                            </p>
                        </div>
                    </div>
                </div>

                {/* Google Maps Embed Link */}
                <div>
                    <h4 className="font-serif text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                        <MapPin size={20} />
                        Google Maps Embed Link
                    </h4>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-sans font-medium text-gray-900 dark:text-white mb-2">
                                Maps Embed URL
                            </label>
                            <Input
                                type="text"
                                value={hotelInfo.googleEmbedLink || ''}
                                onChange={(e) => setHotelInfo({ ...hotelInfo, googleEmbedLink: e.target.value })}
                                placeholder="e.g., https://www.google.com/maps/embed?pb=..."
                            />
                            <p className="text-xs font-sans text-gray-500 dark:text-gray-400 mt-1">
                                Paste the 'src' value from the Google Maps embed code. This will override the coordinate-based map.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HotelInfoSettings;
