import React, { useState, useEffect } from 'react';
import { Save, Building, Phone, Upload, X, Clock, Camera } from 'lucide-react';
import Button from '../Button';
import Input from '../Input';
import {
    useDeleteGalleryImageMutation,
    useUpdateSettingsMutation
} from '../../../pages/authenticatedPages/settingsApiSlice';
import { toast } from 'react-hot-toast';

// Hotel Info Component
const HotelInfoSettings = ({ data, onUpdate, isSaving }) => {
    console.log(data)
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
        gallery: [],
        coordinates: { lat: 0, lng: 0 }
    });

    console.log(data?.logo?.url)

    // Logo state management (single image)
    const [logoFile, setLogoFile] = useState(null);
    const [logoPreview, setLogoPreview] = useState(data?.logo?.url || '');
    const [originalLogo, setOriginalLogo] = useState(data?.logo || null);
    const [logoError, setLogoError] = useState('');

    // Gallery state management (multiple images)
    const [selectedGalleryFiles, setSelectedGalleryFiles] = useState([]);
    const [dragActive, setDragActive] = useState(false);
    const [existingGalleryImages, setExistingGalleryImages] = useState([]);
    const [galleryError, setGalleryError] = useState('');

    // Use the new updateSettings mutation
    const [updateSettings, { isLoading: isUpdating }] = useUpdateSettingsMutation();
    const [deleteImage] = useDeleteGalleryImageMutation();

    useEffect(() => {
        if (data) {
            setHotelInfo(data);
            setLogoPreview(data.logo?.url || '');
            setOriginalLogo(data.logo || null);
            setExistingGalleryImages(data.gallery || []);
        }
    }, [data]);

    // Cleanup preview URLs on unmount
    useEffect(() => {
        return () => {
            selectedGalleryFiles.forEach(file => {
                if (file.preview) {
                    URL.revokeObjectURL(file.preview);
                }
            });
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

    // ==================== GALLERY HANDLERS (Multiple Images) ====================
    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleGalleryFiles(e.dataTransfer.files);
        }
    };

    const handleGalleryFileInput = (e) => {
        if (e.target.files && e.target.files[0]) {
            handleGalleryFiles(e.target.files);
        }
    };

    const handleGalleryFiles = (files) => {
        const validFiles = Array.from(files).filter(file => {
            const isImage = file.type.startsWith('image/');
            const isValidSize = file.size <= 10 * 1024 * 1024; // 10MB limit

            if (!isImage) {
                setGalleryError(`${file.name} is not a valid image file`);
                return false;
            }

            if (!isValidSize) {
                setGalleryError(`${file.name} is too large. Maximum size is 10MB`);
                return false;
            }

            return true;
        });

        if (validFiles.length === 0) return;

        const newFiles = validFiles.map(file => ({
            file,
            id: Date.now() + Math.random(),
            preview: URL.createObjectURL(file)
        }));

        setSelectedGalleryFiles(prev => [...prev, ...newFiles]);

        // Clear gallery error if files are added
        if (galleryError && newFiles.length > 0) {
            setGalleryError('');
        }
    };

    const removeGalleryFile = (fileId) => {
        setSelectedGalleryFiles(prev => {
            const fileToRemove = prev.find(f => f.id === fileId);
            if (fileToRemove && fileToRemove.preview) {
                URL.revokeObjectURL(fileToRemove.preview);
            }
            return prev.filter(f => f.id !== fileId);
        });
    };

    const removeExistingGalleryImage = (publicId) => {
        setExistingGalleryImages(prev => prev.filter(img => img.publicId !== publicId));
    };

    const clearAllGalleryFiles = () => {
        selectedGalleryFiles.forEach(file => {
            if (file.preview) {
                URL.revokeObjectURL(file.preview);
            }
        });
        setSelectedGalleryFiles([]);
        setGalleryError('');
    };

    const handleDeleteGalleryImage = async (publicId) => {
        if (!window.confirm('Are you sure you want to delete this image?')) return;

        try {
            await deleteImage(publicId).unwrap();
            toast.success('Image deleted successfully');
            removeExistingGalleryImage(publicId);
        } catch (err) {
            toast.error(err?.data?.message || 'Failed to delete image');
        }
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
                coordinates: hotelInfo.coordinates || { lat: 0, lng: 0 }
            };

            // Append hotelInfo as JSON string
            formData.append('hotelInfo', JSON.stringify(hotelInfoData));

            // Handle logo (single image)
            if (logoFile instanceof File) {
                formData.append('logo', logoFile);
            } else if (logoFile === 'remove') {
                formData.append('removeLogo', 'true');
            }

            // Handle gallery (multiple images)
            if (existingGalleryImages.length > 0) {
                formData.append('existingGalleryImages', JSON.stringify(existingGalleryImages));
            }

            if (selectedGalleryFiles.length > 0) {
                const galleryMetadata = selectedGalleryFiles.map(f => ({
                    name: f.file.name,
                    size: f.file.size,
                    type: f.file.type
                }));
                formData.append('galleryMetadata', JSON.stringify(galleryMetadata));
            }

            selectedGalleryFiles.forEach((fileObj) => {
                formData.append('gallery', fileObj.file);
            });

            // DEBUGGING: Log what's being sent
            console.log("=== Sending FormData ===");
            for (let [key, value] of formData.entries()) {
                if (value instanceof File) {
                    console.log(`${key}: File(${value.name}, ${(value.size / 1024).toFixed(2)} KB)`);
                } else {
                    console.log(`${key}:`, value);
                }
            }
            console.log("=== End FormData ===");

            // FIX: Pass formData directly, not wrapped in an object
            await updateSettings(formData).unwrap();

            toast.success('Settings updated successfully');

            // Clear local file states
            setLogoFile(null);
            clearAllGalleryFiles();
            setLogoError('');
            setGalleryError('');

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

                {/* Hotel Gallery (Multiple Images) */}
                <div>
                    <h4 className="font-serif text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                        <Camera size={20} />
                        Hotel Gallery
                    </h4>

                    {/* Gallery Error Message */}
                    {galleryError && (
                        <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                            <p className="text-red-800 dark:text-red-200 text-sm">{galleryError}</p>
                        </div>
                    )}

                    {/* Drag and Drop Zone */}
                    <div
                        className={`border-2 border-dashed rounded-lg p-6 text-center transition-all duration-200 mb-4 ${dragActive
                            ? 'border-blue-400 bg-blue-50 dark:bg-blue-900/20 scale-105'
                            : galleryError
                                ? 'border-red-400 bg-red-50 dark:bg-red-900/20'
                                : 'border-gray-300 dark:border-white/20 hover:border-gray-400 dark:hover:border-white/30 hover:bg-gray-50 dark:hover:bg-white/5'
                            }`}
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                    >
                        <div className="flex flex-col items-center">
                            <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
                                <Upload className="w-6 h-6 text-gray-500 dark:text-gray-400" />
                            </div>
                            <p className="text-gray-700 dark:text-gray-300 font-medium mb-2">
                                Drag and drop images here, or click to browse
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                                PNG, JPG, GIF up to 10MB each
                            </p>

                            <input
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={handleGalleryFileInput}
                                className="hidden"
                                id="gallery-upload"
                            />
                            <label
                                htmlFor="gallery-upload"
                                className="cursor-pointer inline-flex items-center px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                            >
                                <Upload className="w-4 h-4 mr-2" />
                                Choose Images
                            </label>
                        </div>
                    </div>

                    {/* Gallery Images Grid */}
                    {(existingGalleryImages.length > 0 || selectedGalleryFiles.length > 0) && (
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Gallery Images ({existingGalleryImages.length + selectedGalleryFiles.length})
                                </h5>
                                {selectedGalleryFiles.length > 0 && (
                                    <button
                                        type="button"
                                        onClick={clearAllGalleryFiles}
                                        className="text-sm text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 font-medium"
                                    >
                                        Clear New Images
                                    </button>
                                )}
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {/* Existing Gallery Images */}
                                {existingGalleryImages.map((image, index) => (
                                    <div key={`existing-${image.publicId}`} className="relative aspect-video rounded-lg overflow-hidden border-2 border-gray-200 dark:border-gray-600 group">
                                        <img
                                            src={image.url}
                                            alt={`Gallery ${index + 1}`}
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <button
                                                type="button"
                                                onClick={() => handleDeleteGalleryImage(image.publicId)}
                                                className="text-white hover:text-red-300 transition-colors p-1 rounded"
                                                title="Delete image"
                                            >
                                                <X className="w-5 h-5" />
                                            </button>
                                        </div>
                                        <div className="absolute top-2 left-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                                            {index + 1}
                                        </div>
                                    </div>
                                ))}

                                {/* New Gallery Images (Pending Upload) */}
                                {selectedGalleryFiles.map((fileObj, index) => (
                                    <div key={fileObj.id} className="relative aspect-video rounded-lg overflow-hidden border-2 border-blue-200 dark:border-blue-600 group">
                                        <img
                                            src={fileObj.preview}
                                            alt={`New ${existingGalleryImages.length + index + 1}`}
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <button
                                                type="button"
                                                onClick={() => removeGalleryFile(fileObj.id)}
                                                className="text-white hover:text-red-300 transition-colors p-1 rounded"
                                                title="Remove image"
                                            >
                                                <X className="w-5 h-5" />
                                            </button>
                                        </div>
                                        <div className="absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">
                                            {existingGalleryImages.length + index + 1}
                                        </div>
                                        <div className="absolute top-2 right-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">
                                            New
                                        </div>
                                        <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                                            {(fileObj.file.size / 1024 / 1024).toFixed(1)}MB
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    <p className="text-xs font-sans text-gray-500 dark:text-gray-400 mt-4">
                        Upload hotel photos for your gallery. Recommended size: 1200×800px. Max 10MB per image.
                    </p>
                </div>
            </div>
        </div>
    );
};
export default HotelInfoSettings;
