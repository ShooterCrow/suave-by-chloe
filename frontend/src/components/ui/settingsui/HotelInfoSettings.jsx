import React, { useState, useEffect } from 'react';
import { Save, Building, Phone, Upload, X, Clock } from 'lucide-react';
import Button from '../Button';
import Input from '../Input';
import {
    useDeleteGalleryImageMutation,
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
        gallery: []
    });

    const [logoFile, setLogoFile] = useState(null);
    const [galleryFiles, setGalleryFiles] = useState([]);
    const [logoPreview, setLogoPreview] = useState(data?.logo?.url || '');

    // Use the new updateSettings mutation
    const [updateSettings, { isLoading: isUpdating }] = useUpdateSettingsMutation();
    const [deleteImage] = useDeleteGalleryImageMutation();

    useEffect(() => {
        if (data) {
            setHotelInfo(data);
            setLogoPreview(data.logo?.url || '');
        }
    }, [data]);

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

    const handleSave = async () => {
        try {
            // Prepare the form data for the API
            const formData = {
                hotelInfo: {
                    ...hotelInfo,
                    // Don't include logo in hotelInfo JSON since we're uploading it separately
                    logo: undefined
                },
                logo: logoFile,
                gallery: galleryFiles
            };

            // Call the updateSettings mutation
            await updateSettings(formData).unwrap();

            toast.success('Settings updated successfully');

            // Clear local file states
            setLogoFile(null);
            setGalleryFiles([]);

            // If parent component needs to know about the update
            if (onUpdate) {
                onUpdate();
            }

        } catch (err) {
            toast.error(err?.data?.message || 'Failed to update settings');
        }
    };

    const handleDeleteGalleryImage = async (publicId) => {
        if (!window.confirm('Are you sure you want to delete this image?')) return;
        try {
            await deleteImage(publicId).unwrap();
            toast.success('Image deleted successfully');

            // Update local state to remove the deleted image
            setHotelInfo(prev => ({
                ...prev,
                gallery: prev.gallery.filter(img => img.publicId !== publicId)
            }));
        } catch (err) {
            toast.error(err?.data?.message || 'Failed to delete image');
        }
    };

    // Images from data (already on server)
    const existingImages = hotelInfo.gallery || [];
    // Newly selected images (not yet uploaded)
    const previewImages = galleryFiles.map(file => URL.createObjectURL(file));

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

export default HotelInfoSettings;