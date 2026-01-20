import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import {
    Search,
    Filter,
    Edit,
    Trash2,
    Eye,
    Plus,
    Save,
    Upload,
    Download,
    Copy,
    X,
    Check,
    Image,
    Film,
    FileText,
    Tag,
    Calendar,
    Clock,
    Users,
    TrendingUp,
    DollarSign,
    Globe,
    EyeOff,
    MoreVertical,
    ChevronRight,
    ChevronDown,
    Maximize2,
    Link,
    Code,
    Palette,
    Type,
    Layout,
    Settings,
    Bell,
    Star,
    Award,
    Gift,
    Percent,
    Clock as ClockIcon,
    Target,
    BarChart,
    PieChart,
    Edit2,
    ExternalLink,
    RefreshCw,
    Lock,
    Unlock,
    Bold,
    Italic,
    List
} from 'lucide-react';
import SpotlightCard from '../../../components/ui/SpotlightCard';
import {
    useGetSiteContentQuery,
    useUpdateHomePageMutation,
    useUpdateGalleryMutation,
    useUpdateOffersMutation,
    useUpdateBlogMutation,
    useUpdateMediaLibraryMutation,
    useDeleteMediaImageMutation
} from '../siteContentApiSlice';
import { toast } from 'react-hot-toast';
import Loader from '../../../components/ui/Loader';


// Status Badge Component
const StatusBadge = ({ status }) => {
    const getStatusConfig = (status) => {
        const configs = {
            'published': {
                color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
                icon: <Check size={12} />
            },
            'draft': {
                color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
                icon: <Clock size={12} />
            },
            'scheduled': {
                color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
                icon: <Calendar size={12} />
            },
            'archived': {
                color: 'bg-gray-100 text-gray-800 dark:bg-white/10 dark:text-gray-400',
                icon: <EyeOff size={12} />
            },
            'expired': {
                color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
                icon: <X size={12} />
            }
        };
        return configs[status] || configs.draft;
    };

    const config = getStatusConfig(status);

    return (
        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-mono font-medium ${config.color}`}>
            {config.icon}
            {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
    );
};

// Content Card Component
const ContentCard = ({ content, type, onEdit, onDelete, onPreview, onDuplicate }) => {
    const getTypeIcon = (type) => {
        const icons = {
            'hero': <Layout size={16} className="text-blue-500" />,
            'banner': <Image size={16} className="text-purple-500" />,
            'gallery': <Image size={16} className="text-green-500" />,
            'video': <Film size={16} className="text-red-500" />,
            'offer': <Tag size={16} className="text-amber-500" />,
            'blog': <FileText size={16} className="text-indigo-500" />,
            'page': <Globe size={16} className="text-teal-500" />
        };
        return icons[type] || <FileText size={16} className="text-gray-500" />;
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    return (
        <SpotlightCard className="rounded-2xl border bg-white border-gray-200 dark:bg-dark-800 dark:border-white/10 p-4 hover:border-blue-300 dark:hover:border-blue-500/50 transition-colors">
            <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-white/10 flex items-center justify-center">
                        {getTypeIcon(type)}
                    </div>
                    <div>
                        <h4 className="font-serif font-bold text-gray-900 dark:text-white mb-1">
                            {content.title}
                        </h4>
                        <div className="flex items-center gap-2">
                            <StatusBadge status={content.status} />
                            <span className="text-xs font-sans text-gray-500 dark:text-gray-400">
                                {formatDate(content.updatedAt)}
                            </span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-1">
                    <button
                        onClick={() => onPreview(content)}
                        className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 text-gray-900 dark:text-white"
                    >
                        <Eye size={16} />
                    </button>
                    <button
                        onClick={() => onDuplicate(content)}
                        className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 text-gray-900 dark:text-white"
                    >
                        <Copy size={16} />
                    </button>
                    <button
                        onClick={() => onEdit(content)}
                        className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 text-gray-900 dark:text-white"
                    >
                        <Edit size={16} />
                    </button>
                </div>
            </div>

            {/* Content Preview */}
            {content.image && (
                <div className="mb-3 aspect-video rounded-lg overflow-hidden">
                    <img
                        src={content.image}
                        alt={content.title}
                        className="w-full h-full object-cover"
                    />
                </div>
            )}

            {/* Content Info */}
            <div className="space-y-2">
                <p className="text-sm font-sans text-gray-600 dark:text-gray-400 line-clamp-2">
                    {content.description || 'No description'}
                </p>
                <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                        <span className="font-sans text-gray-500 dark:text-gray-400">
                            {type.charAt(0).toUpperCase() + type.slice(1)}
                        </span>
                        {content.category && (
                            <span className="px-2 py-1 rounded bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-gray-300">
                                {content.category}
                            </span>
                        )}
                    </div>
                    {content.views && (
                        <div className="flex items-center gap-1">
                            <Eye size={12} className="text-gray-400" />
                            <span className="font-sans text-gray-500 dark:text-gray-400">
                                {content.views.toLocaleString()} views
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </SpotlightCard>
    );
};

// Homepage Content Editor
const HomepageEditor = ({ data }) => {
    const [updateHomePage, { isLoading }] = useUpdateHomePageMutation();
    const [sections, setSections] = useState([
        {
            id: 'hero',
            title: 'Hero Section',
            type: 'hero',
            enabled: true,
            content: data?.hero || {
                title: '',
                subtitle: '',
                buttonText: '',
                image: '',
            }
        }
    ]);

    useEffect(() => {
        if (data) {
            setSections(prev => prev.map(section => {
                if (section.id === 'hero') return { ...section, content: { ...section.content, ...data.hero } };
                if (section.id === 'features') return { ...section, content: { ...section.content, features: data.features } };
                if (section.id === 'testimonials') return { ...section, content: { ...section.content, testimonials: data.testimonials } };
                if (section.id === 'cta') return { ...section, content: { ...section.content, ...data.cta } };
                return section;
            }));
        }
    }, [data]);

    const [editingSection, setEditingSection] = useState(null);
    const [heroImageFile, setHeroImageFile] = useState(null);
    const [heroImagePreview, setHeroImagePreview] = useState(null);

    const handleHeroImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setHeroImageFile(file);
            setHeroImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSectionToggle = (id) => {
        setSections(sections.map(section =>
            section.id === id ? { ...section, enabled: !section.enabled } : section
        ));
    };

    const handleSave = async () => {
        try {
            const formData = new FormData();

            const homepageData = {
                hero: sections.find(s => s.id === 'hero').content,
                // features: sections.find(s => s.id === 'features').content.features,
                // testimonials: sections.find(s => s.id === 'testimonials').content.testimonials,
                // cta: sections.find(s => s.id === 'cta').content
            };

            formData.append('homepage', JSON.stringify(homepageData));

            if (heroImageFile) {
                formData.append('heroImage', heroImageFile);
            }

            await updateHomePage(formData).unwrap();
            toast.success('Homepage changes saved successfully!');
            setHeroImageFile(null);
            setHeroImagePreview(null);
        } catch (err) {
            toast.error('Failed to save homepage changes');
        }
    };

    const handlePreview = () => {
        window.open('/', '_blank');
    };

    return (
        <SpotlightCard className="rounded-2xl border bg-white border-gray-200 dark:bg-dark-800 dark:border-white/10 p-6">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="font-serif text-xl font-bold text-gray-900 dark:text-white">
                        Homepage Content
                    </h3>
                    <p className="text-sm font-sans text-gray-600 dark:text-gray-400">
                        Customize sections and content on your homepage
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={handlePreview}
                        className="px-4 py-2 rounded-lg font-sans font-medium transition-colors border border-gray-300 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 flex items-center gap-2"
                    >
                        <Eye size={16} />
                        Preview
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={isLoading}
                        className="px-4 py-2 rounded-lg font-sans font-medium transition-colors bg-blue-600 dark:bg-blue-500 text-white hover:bg-blue-700 dark:hover:bg-blue-600 flex items-center gap-2"
                    >
                        <Save size={16} />
                        {isLoading ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </div>

            <div className="space-y-6">
                {/* Section Controls */}
                <div className="p-4 rounded-lg border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5">
                    <h4 className="font-serif font-bold text-gray-900 dark:text-white mb-4">
                        Page Sections
                    </h4>
                    <div className="space-y-3">
                        {sections.map(section => (
                            <div key={section.id} className="flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-white/10">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                                        <Layout size={20} className="text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <div>
                                        <h5 className="font-sans font-medium text-gray-900 dark:text-white">
                                            {section.title}
                                        </h5>
                                        <p className="text-sm font-sans text-gray-500 dark:text-gray-400">
                                            {section.type.charAt(0).toUpperCase() + section.type.slice(1)} Section
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => setEditingSection(section)}
                                        className="px-3 py-1.5 rounded-lg text-sm font-sans font-medium transition-colors border border-gray-300 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleSectionToggle(section.id)}
                                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${section.enabled ? 'bg-blue-600' : 'bg-gray-300 dark:bg-white/20'}`}
                                    >
                                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${section.enabled ? 'translate-x-6' : 'translate-x-1'}`} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Hero Section Editor */}
                {editingSection?.type === 'hero' && (
                    <div className="p-4 rounded-lg border border-blue-200 dark:border-blue-500/30 bg-blue-50 dark:bg-blue-900/20">
                        <div className="flex items-center justify-between mb-4">
                            <h4 className="font-serif font-bold text-gray-900 dark:text-white">
                                Edit Hero Section
                            </h4>
                            <button
                                onClick={() => setEditingSection(null)}
                                className="p-2 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-sans font-medium text-gray-900 dark:text-white mb-2">
                                    Hero Image
                                </label>
                                <div className="aspect-video rounded-lg overflow-hidden mb-2 border border-gray-200 dark:border-white/10 relative group">
                                    <img
                                        src={heroImagePreview || editingSection.content.image}
                                        alt="Hero Preview"
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <label className="cursor-pointer bg-white dark:bg-dark-800 p-2 rounded-full shadow-lg transform hover:scale-110 transition-transform">
                                            <Upload className="text-blue-600 dark:text-blue-400" size={20} />
                                            <input
                                                type="file"
                                                className="hidden"
                                                accept="image/*"
                                                onChange={handleHeroImageChange}
                                            />
                                        </label>
                                    </div>
                                </div>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                                    {heroImageFile ? `Selected: ${heroImageFile.name}` : 'Click the upload icon to change image'}
                                </p>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-sans font-medium text-gray-900 dark:text-white mb-2">
                                        Main Title
                                    </label>
                                    <input
                                        type="text"
                                        value={editingSection.content.title}
                                        onChange={(e) => {
                                            const updated = {
                                                ...editingSection,
                                                content: { ...editingSection.content, title: e.target.value }
                                            };
                                            setEditingSection(updated);
                                        }}
                                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-white/10 bg-white dark:bg-dark-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-sans font-medium text-gray-900 dark:text-white mb-2">
                                        Subtitle
                                    </label>
                                    <input
                                        type="text"
                                        value={editingSection.content.subtitle}
                                        onChange={(e) => {
                                            const updated = {
                                                ...editingSection,
                                                content: { ...editingSection.content, subtitle: e.target.value }
                                            };
                                            setEditingSection(updated);
                                        }}
                                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-white/10 bg-white dark:bg-dark-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end gap-3">
                                <button
                                    onClick={() => setEditingSection(null)}
                                    className="px-4 py-2 rounded-lg font-sans font-medium transition-colors border border-gray-300 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => {
                                        setSections(sections.map(s =>
                                            s.id === editingSection.id ? editingSection : s
                                        ));
                                        setEditingSection(null);
                                    }}
                                    className="px-4 py-2 rounded-lg font-sans font-medium transition-colors bg-blue-600 dark:bg-blue-500 text-white hover:bg-blue-700 dark:hover:bg-blue-600"
                                >
                                    Save Section
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Visual Preview */}
                <div>
                    <h4 className="font-serif font-bold text-gray-900 dark:text-white mb-4">
                        Live Preview
                    </h4>
                    <div className="border border-gray-300 dark:border-white/10 rounded-lg overflow-hidden">
                        <div className="p-4 border-b border-gray-300 dark:border-white/10 bg-gray-100 dark:bg-white/5">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                <span className="text-sm font-sans text-gray-600 dark:text-gray-400 ml-2">
                                    homepage.com
                                </span>
                            </div>
                        </div>
                        <div className="p-6 bg-white dark:bg-gray-900">
                            {/* Hero Preview */}
                            <div className="relative aspect-video rounded-lg overflow-hidden mb-6">
                                <img
                                    src={heroImagePreview || sections.find(s => s.id === 'hero')?.content.image}
                                    alt="Hero Preview"
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                                    <div className="text-center text-white">
                                        <h2 className="font-serif text-3xl font-bold mb-2">
                                            {sections.find(s => s.id === 'hero')?.content.title}
                                        </h2>
                                        <p className="text-lg mb-4">
                                            {sections.find(s => s.id === 'hero')?.content.subtitle}
                                        </p>
                                        <button className="px-6 py-2 bg-blue-600 text-white rounded-lg">
                                            {sections.find(s => s.id === 'hero')?.content.buttonText}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Features Preview */}
                            {sections.find(s => s.id === 'features')?.enabled && (
                                <div className="mb-6">
                                    <h3 className="font-serif text-2xl font-bold text-gray-900 dark:text-white mb-2 text-center">
                                        {sections.find(s => s.id === 'features')?.content.title}
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-400 text-center mb-6">
                                        {sections.find(s => s.id === 'features')?.content.subtitle}
                                    </p>
                                    <div className="grid grid-cols-2 gap-4">
                                        {sections.find(s => s.id === 'features')?.content.features.map((feature, index) => (
                                            <div key={index} className="p-4 rounded-lg border border-gray-200 dark:border-white/10">
                                                <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-3">
                                                    <div className="text-blue-600 dark:text-blue-400">•</div>
                                                </div>
                                                <h4 className="font-sans font-medium text-gray-900 dark:text-white mb-1">
                                                    {feature.title}
                                                </h4>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                                    {feature.description}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </SpotlightCard>
    );
};

// Gallery Manager Component
const GalleryManager = ({ data }) => {
    const [updateGallery, { isLoading }] = useUpdateGalleryMutation();
    const [galleries, setGalleries] = useState(data || []);

    useEffect(() => {
        if (data) {
            setGalleries(data);
        }
    }, [data]);

    const [selectedGallery, setSelectedGallery] = useState(null);

    const handleAddAlbum = () => {
        const newAlbum = {
            id: `album-${Date.now()}`,
            title: 'New Album',
            type: 'general',
            imageCount: 0,
            coverImage: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
            status: 'draft',
            updatedAt: new Date().toISOString(),
            description: 'New photo gallery description',
            images: []
        };
        setGalleries([...galleries, newAlbum]);
        setSelectedGallery(newAlbum);
    };

    const handleDeleteAlbum = (id) => {
        if (window.confirm('Are you sure you want to delete this Entire Album?')) {
            const updated = galleries.filter(g => g.id !== id);
            setGalleries(updated);
            if (selectedGallery?.id === id) setSelectedGallery(null);
        }
    };

    const handleUpdateAlbumInfo = (field, value) => {
        if (!selectedGallery) return;
        setGalleries(galleries.map(g =>
            g.id === selectedGallery.id ? { ...g, [field]: value } : g
        ));
    };

    const handleSetCoverImage = (url) => {
        if (!selectedGallery) return;
        setGalleries(galleries.map(g =>
            g.id === selectedGallery.id ? { ...g, coverImage: url } : g
        ));
    };

    const handleUpdateImage = (imageId, field, value) => {
        if (!selectedGallery) return;
        setGalleries(galleries.map(g =>
            g.id === selectedGallery.id
                ? {
                    ...g,
                    images: g.images.map(img =>
                        img.id === imageId ? { ...img, [field]: value } : img
                    )
                }
                : g
        ));
    };

    const handleSave = async () => {
        try {
            const formData = new FormData();
            formData.append('gallery', JSON.stringify(galleries));

            // Append files matching the new image structure
            galleries.forEach(gallery => {
                if (gallery.images) {
                    gallery.images.forEach(img => {
                        if (img.file) {
                            formData.append('galleryManagement', img.file);
                        }
                    });
                }
            });

            await updateGallery(formData).unwrap();
            toast.success('Gallery changes saved successfully!');
        } catch (err) {
            console.error("Save error:", err);
            toast.error(err?.data?.message || 'Failed to save gallery changes');
        }
    };

    const handleUploadImages = (files) => {
        if (!selectedGallery) return;
        const newImages = Array.from(files).map((file, index) => ({
            id: Date.now() + index,
            url: URL.createObjectURL(file), // Note: Real implementation would upload files
            title: file.name, // Use filename for matching in backend
            description: '',
            category: selectedGallery.type,
            order: galleries.find(g => g.id === selectedGallery.id).images.length + index + 1,
            featured: false,
            file: file // Store the actual file object
        }));

        setGalleries(galleries.map(g =>
            g.id === selectedGallery.id ? { ...g, images: [...g.images, ...newImages], imageCount: g.images.length + newImages.length } : g
        ));
    };
    const handleDeleteImage = (imageId) => {
        if (!selectedGallery) return;
        setGalleries(galleries.map(g =>
            g.id === selectedGallery.id
                ? { ...g, images: g.images.filter(img => img.id !== imageId), imageCount: g.images.length - 1 }
                : g
        ));
    };

    const handleSetFeatured = (imageId) => {
        if (!selectedGallery) return;
        setGalleries(galleries.map(g =>
            g.id === selectedGallery.id
                ? {
                    ...g,
                    images: g.images.map(img => ({
                        ...img,
                        featured: img.id === imageId
                    }))
                }
                : g
        ));
    };

    return (
        <SpotlightCard className="rounded-2xl border bg-white border-gray-200 dark:bg-dark-800 dark:border-white/10 p-6">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="font-serif text-xl font-bold text-gray-900 dark:text-white">
                        Gallery Management
                    </h3>
                    <p className="text-sm font-sans text-gray-600 dark:text-gray-400">
                        Manage photo galleries and images
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={handleSave}
                        disabled={isLoading}
                        className="px-4 py-2 rounded-lg font-sans font-medium transition-colors bg-blue-600 dark:bg-blue-500 text-white hover:bg-blue-700 dark:hover:bg-blue-600 flex items-center gap-2"
                    >
                        <Save size={16} />
                        {isLoading ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button
                        onClick={handleAddAlbum}
                        disabled={isLoading}
                        className="px-4 py-2 rounded-lg font-sans font-medium transition-colors bg-blue-600 dark:bg-blue-500 text-white hover:bg-blue-700 dark:hover:bg-blue-600 flex items-center gap-2 disabled:opacity-50"
                    >
                        <Plus size={16} />
                        New Album
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Galleries List */}
                <div className="lg:col-span-1">
                    <div className="space-y-4 max-h-[700px] overflow-y-auto pr-2">
                        {galleries.map(gallery => (
                            <div
                                key={gallery.id}
                                onClick={() => setSelectedGallery(gallery)}
                                className={`group p-4 rounded-lg border cursor-pointer transition-colors relative ${selectedGallery?.id === gallery.id
                                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                    : 'border-gray-200 dark:border-white/10 hover:border-blue-300 dark:hover:border-blue-500/50'
                                    }`}
                            >
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDeleteAlbum(gallery.id);
                                    }}
                                    disabled={isLoading}
                                    className="absolute top-2 right-2 p-1.5 rounded-lg text-red-500 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50 dark:hover:bg-red-900/20 disabled:cursor-not-allowed"
                                >
                                    <Trash2 size={14} />
                                </button>
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0">
                                        <img
                                            src={gallery.coverImage}
                                            alt={gallery.title}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="min-w-0">
                                        <h4 className="font-sans font-medium text-gray-900 dark:text-white truncate">
                                            {gallery.title}
                                        </h4>
                                        <div className="flex items-center gap-2">
                                            <StatusBadge status={gallery.status} />
                                            <span className="text-xs font-sans text-gray-500 dark:text-gray-400">
                                                {gallery.imageCount || gallery.images?.length || 0} images
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <p className="text-sm font-sans text-gray-600 dark:text-gray-400 line-clamp-2">
                                    {gallery.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Gallery Editor */}
                <div className="lg:col-span-2">
                    {selectedGallery ? (
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="font-serif text-xl font-bold text-gray-900 dark:text-white">
                                        {selectedGallery.title}
                                    </h3>
                                    <p className="text-sm font-sans text-gray-600 dark:text-gray-400">
                                        Manage images in this gallery
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="file"
                                        id="image-upload"
                                        className="hidden"
                                        accept="image/*"
                                        multiple
                                        onChange={(e) => handleUploadImages(e.target.files)}
                                    />
                                    <label
                                        htmlFor="image-upload"
                                        className={`px-4 py-2 rounded-lg font-sans font-medium transition-colors border border-gray-300 dark:border-white/10 text-gray-700 dark:text-gray-300 flex items-center gap-2 ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100 dark:hover:bg-white/5 cursor-pointer'}`}
                                    >
                                        <Upload size={16} />
                                        Upload Images
                                    </label>
                                </div>
                            </div>

                            {/* Gallery Images */}
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {galleries.find(g => g.id === selectedGallery.id)?.images.map((image, idx) => (
                                    <div key={idx} className="group relative aspect-square rounded-lg overflow-hidden border border-gray-200 dark:border-white/10">
                                        <img
                                            src={image.url}
                                            alt={image.title}
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity p-3 flex flex-col justify-between">
                                            <div className="flex justify-between">
                                                {image.featured && (
                                                    <span className="px-2 py-1 rounded-full text-xs font-sans bg-yellow-500 text-white">
                                                        Featured
                                                    </span>
                                                )}
                                                <button
                                                    onClick={() => handleDeleteImage(image.id)}
                                                    disabled={isLoading}
                                                    className="w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                            <div className="text-white">
                                                <input
                                                    type="text"
                                                    value={image.title}
                                                    onChange={(e) => handleUpdateImage(image.id, 'title', e.target.value)}
                                                    className="w-full bg-transparent border-none text-white font-sans font-medium px-0 py-0 focus:ring-0 text-sm mb-1"
                                                    placeholder="Image title"
                                                />
                                                <input
                                                    type="text"
                                                    value={image.description}
                                                    onChange={(e) => handleUpdateImage(image.id, 'description', e.target.value)}
                                                    className="w-full bg-transparent border-none text-white/80 font-sans text-xs px-0 py-0 focus:ring-0"
                                                    placeholder="Add description..."
                                                />
                                            </div>
                                        </div>
                                        <div className="absolute top-2 right-2 flex gap-2">
                                            <button
                                                onClick={() => handleSetFeatured(image.id)}
                                                title="Feature this image"
                                                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${image.featured ? 'bg-yellow-500 text-white' : 'bg-white/20 backdrop-blur-sm text-white/80 hover:bg-white/40'}`}
                                            >
                                                <Star size={14} fill={image.featured ? 'currentColor' : 'none'} />
                                            </button>
                                            <button
                                                onClick={() => handleSetCoverImage(image.url)}
                                                title="Set as cover image"
                                                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${galleries.find(g => g.id === selectedGallery.id)?.coverImage === image.url ? 'bg-blue-500 text-white' : 'bg-white/20 backdrop-blur-sm text-white/80 hover:bg-white/40'}`}
                                            >
                                                <Image size={14} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Gallery Settings */}
                            <div className="p-4 rounded-lg border border-gray-200 dark:border-white/10">
                                <h4 className="font-serif font-bold text-gray-900 dark:text-white mb-4">
                                    Gallery Settings
                                </h4>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-sans font-medium text-gray-900 dark:text-white mb-2">
                                            Gallery Title
                                        </label>
                                        <input
                                            type="text"
                                            value={galleries.find(g => g.id === selectedGallery.id)?.title || ''}
                                            onChange={(e) => handleUpdateAlbumInfo('title', e.target.value)}
                                            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-white/10 bg-white dark:bg-dark-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-sans font-medium text-gray-900 dark:text-white mb-2">
                                            Description
                                        </label>
                                        <textarea
                                            value={galleries.find(g => g.id === selectedGallery.id)?.description || ''}
                                            onChange={(e) => handleUpdateAlbumInfo('description', e.target.value)}
                                            rows="3"
                                            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-white/10 bg-white dark:bg-dark-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-sans font-medium text-gray-900 dark:text-white mb-2">
                                            Status
                                        </label>
                                        <select
                                            value={galleries.find(g => g.id === selectedGallery.id)?.status || 'draft'}
                                            onChange={(e) => handleUpdateAlbumInfo('status', e.target.value)}
                                            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-white/10 bg-white dark:bg-dark-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        >
                                            <option value="draft">Draft</option>
                                            <option value="published">Published</option>
                                            <option value="archived">Archived</option>
                                        </select>
                                    </div>
                                    <div className="flex justify-end">
                                        <button
                                            onClick={handleSave}
                                            disabled={isLoading}
                                            className="px-4 py-2 rounded-lg font-sans font-medium transition-colors bg-blue-600 dark:bg-blue-500 text-white hover:bg-blue-700 dark:hover:bg-blue-600 disabled:opacity-50 flex items-center gap-2"
                                        >
                                            <Save size={16} />
                                            {isLoading ? 'Saving...' : 'Save Gallery'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <Image size={48} className="mx-auto text-gray-400 mb-4" />
                            <p className="font-sans text-gray-600 dark:text-gray-400">
                                Select a gallery to manage images
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </SpotlightCard>
    );
};

// Offers & Deals Manager
const OffersManager = ({ data }) => {
    const [updateOffers, { isLoading }] = useUpdateOffersMutation();
    const [offers, setOffers] = useState(data || []);

    useEffect(() => {
        if (data) setOffers(data);
    }, [data]);

    const handleSave = async (updatedOffers) => {
        try {
            await updateOffers({ offers: updatedOffers || offers }).unwrap();
            toast.success('Offers updated successfully');
        } catch (err) {
            toast.error('Failed to update offers');
        }
    };

    const [newOffer, setNewOffer] = useState({
        title: '',
        code: '',
        discount: 0,
        type: 'percentage',
        description: '',
        startDate: '',
        endDate: '',
        status: 'draft'
    });

    const handleCreateOffer = async () => {
        if (!newOffer.title || !newOffer.code) return;
        const offer = {
            ...newOffer,
            id: Date.now(),
            usage: 0,
            revenue: 0,
            image: '',
            updatedAt: new Date().toISOString().split('T')[0]
        };
        const updated = [...offers, offer];
        setOffers(updated);
        await handleSave(updated);
        setNewOffer({
            title: '',
            code: '',
            discount: 0,
            type: 'percentage',
            description: '',
            startDate: '',
            endDate: '',
            status: 'draft'
        });
    };

    const handleToggleStatus = async (id) => {
        const updated = offers.map(offer =>
            offer.id === id
                ? { ...offer, status: offer.status === 'active' ? 'inactive' : 'active' }
                : offer
        );
        setOffers(updated);
        await handleSave(updated);
    };

    const handleUpdateOffer = (id, field, value) => {
        const updated = offers.map(offer =>
            offer.id === id ? { ...offer, [field]: value } : offer
        );
        setOffers(updated);
    };

    const handleDeleteOffer = async (id) => {
        if (window.confirm('Are you sure you want to delete this offer?')) {
            const updated = offers.filter(offer => offer.id !== id);
            setOffers(updated);
            await handleSave(updated);
        }
    };

    return (
        <SpotlightCard className="rounded-2xl border bg-white border-gray-200 dark:bg-dark-800 dark:border-white/10 p-6">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="font-serif text-xl font-bold text-gray-900 dark:text-white">
                        Offers & Deals
                    </h3>
                    <p className="text-sm font-sans text-gray-600 dark:text-gray-400">
                        Manage special offers and promotions
                    </p>
                </div>
                <button
                    onClick={handleCreateOffer}
                    disabled={isLoading}
                    className="px-4 py-2 rounded-lg font-sans font-medium transition-colors bg-blue-600 dark:bg-blue-500 text-white hover:bg-blue-700 dark:hover:bg-blue-600 flex items-center gap-2 disabled:opacity-50"
                >
                    <Plus size={16} />
                    {isLoading ? 'Creating...' : 'Create Offer'}
                </button>
            </div>

            <div className="space-y-6">
                {/* Create New Offer */}
                <div className="p-4 rounded-lg border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5">
                    <h4 className="font-serif font-bold text-gray-900 dark:text-white mb-4">
                        Create New Offer
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block text-sm font-sans font-medium text-gray-900 dark:text-white mb-2">
                                Offer Title *
                            </label>
                            <input
                                type="text"
                                value={newOffer.title}
                                onChange={(e) => setNewOffer({ ...newOffer, title: e.target.value })}
                                placeholder="e.g., Summer Special"
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-white/10 bg-white dark:bg-dark-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-sans font-medium text-gray-900 dark:text-white mb-2">
                                Promo Code *
                            </label>
                            <input
                                type="text"
                                value={newOffer.code}
                                onChange={(e) => setNewOffer({ ...newOffer, code: e.target.value.toUpperCase() })}
                                placeholder="e.g., SUMMER24"
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-white/10 bg-white dark:bg-dark-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-sans font-medium text-gray-900 dark:text-white mb-2">
                                Discount Type
                            </label>
                            <select
                                value={newOffer.type}
                                onChange={(e) => setNewOffer({ ...newOffer, type: e.target.value })}
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-white/10 bg-white dark:bg-dark-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="percentage">Percentage (%)</option>
                                <option value="fixed">Fixed Amount ($)</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-sans font-medium text-gray-900 dark:text-white mb-2">
                                {newOffer.type === 'percentage' ? 'Discount (%)' : 'Amount ($)'}
                            </label>
                            <input
                                type="number"
                                value={newOffer.discount}
                                onChange={(e) => setNewOffer({ ...newOffer, discount: parseFloat(e.target.value) })}
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-white/10 bg-white dark:bg-dark-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-sans font-medium text-gray-900 dark:text-white mb-2">
                                Start Date
                            </label>
                            <input
                                type="date"
                                value={newOffer.startDate}
                                onChange={(e) => setNewOffer({ ...newOffer, startDate: e.target.value })}
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-white/10 bg-white dark:bg-dark-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-sans font-medium text-gray-900 dark:text-white mb-2">
                                End Date
                            </label>
                            <input
                                type="date"
                                value={newOffer.endDate}
                                onChange={(e) => setNewOffer({ ...newOffer, endDate: e.target.value })}
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-white/10 bg-white dark:bg-dark-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-sans font-medium text-gray-900 dark:text-white mb-2">
                            Description
                        </label>
                        <textarea
                            value={newOffer.description}
                            onChange={(e) => setNewOffer({ ...newOffer, description: e.target.value })}
                            rows="3"
                            placeholder="Describe the offer details..."
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-white/10 bg-white dark:bg-dark-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                    <button
                        onClick={handleCreateOffer}
                        className="px-4 py-2 rounded-lg font-sans font-medium transition-colors bg-green-600 dark:bg-green-500 text-white hover:bg-green-700 dark:hover:bg-green-600 flex items-center gap-2"
                    >
                        <Plus size={16} />
                        Create Offer
                    </button>
                </div>

                {/* Offers List */}
                <div>
                    <h4 className="font-serif font-bold text-gray-900 dark:text-white mb-4">
                        Active Offers
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {offers.map((offer, index) => (
                            <div key={index} className="p-4 rounded-lg border border-gray-200 dark:border-white/10 hover:border-blue-300 dark:hover:border-blue-500/50 transition-colors">
                                <div className="flex items-start justify-between mb-3">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <h5 className="font-serif font-bold text-gray-900 dark:text-white">
                                                {offer.title}
                                            </h5>
                                            <StatusBadge status={offer.status} />
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="px-2 py-1 rounded-full text-xs font-mono bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400">
                                                {offer.code}
                                            </span>
                                            <span className={`text-sm font-sans font-bold ${offer.type === 'percentage' ? 'text-green-600 dark:text-green-400' : 'text-amber-600 dark:text-amber-400'}`}>
                                                {offer.discount}{offer.type === 'percentage' ? '% OFF' : '$ OFF'}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => handleToggleStatus(offer.id)}
                                            disabled={isLoading}
                                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${offer.status === 'active' ? 'bg-green-600' : 'bg-gray-300 dark:bg-white/20'}`}
                                        >
                                            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${offer.status === 'active' ? 'translate-x-6' : 'translate-x-1'}`} />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteOffer(offer.id)}
                                            disabled={isLoading}
                                            className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 transition-colors disabled:opacity-50"
                                            title="Delete Offer"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                                <p className="text-sm font-sans text-gray-600 dark:text-gray-400 mb-3">
                                    {offer.description}
                                </p>
                                <div className="flex items-center justify-between text-sm">
                                    <div>
                                        <p className="text-xs font-sans text-gray-500 dark:text-gray-400">Valid:</p>
                                        <p className="font-sans font-medium text-gray-900 dark:text-white">
                                            {offer.startDate} - {offer.endDate}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs font-sans text-gray-500 dark:text-gray-400">Usage:</p>
                                        <p className="font-sans font-medium text-gray-900 dark:text-white">
                                            {offer.usage} bookings
                                        </p>
                                    </div>
                                </div>
                                <div className="mt-3 pt-3 border-t border-gray-200 dark:border-white/10">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-sans text-gray-500 dark:text-gray-400">Revenue Generated:</span>
                                        <span className="font-serif font-bold text-green-600 dark:text-green-400">
                                            ${offer?.revenue?.toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </SpotlightCard>
    );
};

// Blog Manager Component
const BlogManager = ({ data }) => {
    const [updateBlog, { isLoading }] = useUpdateBlogMutation();
    const [posts, setPosts] = useState(data || []);

    useEffect(() => {
        if (data) setPosts(data);
    }, [data]);

    const handleUpdatePost = (id, field, value) => {
        const updated = posts.map(post =>
            post.id === id ? { ...post, [field]: value } : post
        );
        setPosts(updated);
    };

    const handleSavePost = async () => {
        try {
            await updateBlog({ blogs: posts }).unwrap();
            toast.success('Blog post saved successfully');
        } catch (err) {
            toast.error(err?.data?.message || 'Failed to update blog post');
        }
    };

    const [editingPost, setEditingPost] = useState(null);

    const handleCreatePost = async () => {
        const newPost = {
            id: Date.now(),
            title: 'New Blog Post',
            slug: 'new-blog-post-' + Date.now(),
            excerpt: '',
            category: 'Uncategorized',
            author: 'Admin',
            status: 'draft',
            views: 0,
            likes: 0,
            comments: 0,
            featured: false,
            image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
            publishedAt: '',
            updatedAt: new Date().toISOString().split('T')[0]
        };
        const updated = [newPost, ...posts];
        setPosts(updated);
        setEditingPost(newPost);
        await handleSavePost(updated);
    };

    const handleDeletePost = async (id) => {
        if (window.confirm('Are you sure you want to delete this blog post?')) {
            const updated = posts.filter(post => post.id !== id);
            setPosts(updated);
            await handleSavePost(updated);
        }
    };

    const handleToggleFeatured = async (id) => {
        const updated = posts.map(post => ({
            ...post,
            featured: post.id === id ? !post.featured : false
        }));
        setPosts(updated);
        await handleSavePost(updated);
    };

    return (
        <SpotlightCard className="rounded-2xl border bg-white border-gray-200 dark:bg-dark-800 dark:border-white/10 p-6">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="font-serif text-xl font-bold text-gray-900 dark:text-white">
                        Blog Management
                    </h3>
                    <p className="text-sm font-sans text-gray-600 dark:text-gray-400">
                        Create and manage blog posts and articles
                    </p>
                </div>
                <button
                    onClick={handleCreatePost}
                    disabled={isLoading}
                    className="px-4 py-2 rounded-lg font-sans font-medium transition-colors bg-blue-600 dark:bg-blue-500 text-white hover:bg-blue-700 dark:hover:bg-blue-600 flex items-center gap-2 disabled:opacity-50"
                >
                    <Plus size={16} />
                    {isLoading ? 'Creating...' : 'New Post'}
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Posts List */}
                <div className="lg:col-span-1">
                    <div className="space-y-4">
                        {posts.map(post => (
                            <div
                                key={post.id}
                                onClick={() => setEditingPost(post)}
                                className={`p-4 rounded-lg border cursor-pointer transition-colors ${editingPost?.id === post.id
                                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                    : 'border-gray-200 dark:border-white/10 hover:border-blue-300 dark:hover:border-blue-500/50'
                                    }`}
                            >
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="w-12 h-12 rounded-lg overflow-hidden">
                                        <img
                                            src={post.image}
                                            alt={post.title}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h5 className="font-sans font-medium text-gray-900 dark:text-white truncate">
                                            {post.title}
                                        </h5>
                                        <div className="flex items-center gap-2">
                                            <StatusBadge status={post.status} />
                                            {post.featured && (
                                                <span className="px-2 py-1 rounded-full text-xs font-sans bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400">
                                                    Featured
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between text-xs">
                                    <span className="font-sans text-gray-500 dark:text-gray-400">
                                        {post.category} • {post?.views?.toLocaleString()} views
                                    </span>
                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleToggleFeatured(post.id);
                                            }}
                                            className={`p-1 rounded ${post.featured ? 'text-yellow-500' : 'text-gray-400'}`}
                                        >
                                            <Star size={12} fill={post.featured ? 'currentColor' : 'none'} />
                                        </button>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDeletePost(post.id);
                                            }}
                                            disabled={isLoading}
                                            className="p-1 rounded text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 disabled:opacity-50"
                                        >
                                            <Trash2 size={12} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Post Editor */}
                <div className="lg:col-span-2">
                    {editingPost ? (
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="font-serif text-xl font-bold text-gray-900 dark:text-white">
                                        Edit Blog Post
                                    </h3>
                                    <p className="text-sm font-sans text-gray-600 dark:text-gray-400">
                                        Last updated: {editingPost.updatedAt}
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => window.open(`/blog/${posts.find(p => p.id === editingPost.id)?.slug}`, '_blank')}
                                        className="px-3 py-1.5 rounded-lg text-sm font-sans font-medium transition-colors border border-gray-300 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 flex items-center gap-2"
                                    >
                                        <Eye size={14} />
                                        Preview
                                    </button>
                                    <button
                                        onClick={handleSavePost}
                                        disabled={isLoading}
                                        className="px-4 py-2 rounded-lg font-sans font-medium transition-colors bg-blue-600 dark:bg-blue-500 text-white hover:bg-blue-700 dark:hover:bg-blue-600 disabled:opacity-50"
                                    >
                                        {isLoading ? 'Saving...' : 'Save Post'}
                                    </button>
                                </div>
                            </div>

                            {/* Post Editor Form */}
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-sans font-medium text-gray-900 dark:text-white mb-2">
                                        Post Title *
                                    </label>
                                    <input
                                        type="text"
                                        value={posts.find(p => p.id === editingPost.id)?.title || ''}
                                        onChange={(e) => handleUpdatePost(editingPost.id, 'title', e.target.value)}
                                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-white/10 bg-white dark:bg-dark-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-sans font-medium text-gray-900 dark:text-white mb-2">
                                        Author
                                    </label>
                                    <input
                                        type="text"
                                        value={posts.find(p => p.id === editingPost.id)?.author || ''}
                                        onChange={(e) => handleUpdatePost(editingPost.id, 'author', e.target.value)}
                                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-white/10 bg-white dark:bg-dark-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-sans font-medium text-gray-900 dark:text-white mb-2">
                                        Slug *
                                    </label>
                                    <input
                                        type="text"
                                        value={posts.find(p => p.id === editingPost.id)?.slug || ''}
                                        onChange={(e) => handleUpdatePost(editingPost.id, 'slug', e.target.value)}
                                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-white/10 bg-white dark:bg-dark-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-sans font-medium text-gray-900 dark:text-white mb-2">
                                            Category
                                        </label>
                                        <select
                                            value={posts.find(p => p.id === editingPost.id)?.category || 'Travel'}
                                            onChange={(e) => handleUpdatePost(editingPost.id, 'category', e.target.value)}
                                            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-white/10 bg-white dark:bg-dark-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        >
                                            <option value="Travel">Travel</option>
                                            <option value="Food">Food</option>
                                            <option value="Events">Events</option>
                                            <option value="Tips">Travel Tips</option>
                                            <option value="News">Hotel News</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-sans font-medium text-gray-900 dark:text-white mb-2">
                                            Status
                                        </label>
                                        <select
                                            value={posts.find(p => p.id === editingPost.id)?.status || 'draft'}
                                            onChange={(e) => handleUpdatePost(editingPost.id, 'status', e.target.value)}
                                            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-white/10 bg-white dark:bg-dark-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        >
                                            <option value="draft">Draft</option>
                                            <option value="published">Published</option>
                                            <option value="scheduled">Scheduled</option>
                                            <option value="archived">Archived</option>
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-sans font-medium text-gray-900 dark:text-white mb-2">
                                        Featured Image
                                    </label>
                                    <div className="aspect-video rounded-lg overflow-hidden mb-2">
                                        <img
                                            src={posts.find(p => p.id === editingPost.id)?.image}
                                            alt="Post Preview"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <input
                                        type="text"
                                        value={posts.find(p => p.id === editingPost.id)?.image || ''}
                                        onChange={(e) => handleUpdatePost(editingPost.id, 'image', e.target.value)}
                                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-white/10 bg-white dark:bg-dark-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-sans font-medium text-gray-900 dark:text-white mb-2">
                                        Excerpt
                                    </label>
                                    <textarea
                                        value={posts.find(p => p.id === editingPost.id)?.excerpt || ''}
                                        onChange={(e) => handleUpdatePost(editingPost.id, 'excerpt', e.target.value)}
                                        rows="3"
                                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-white/10 bg-white dark:bg-dark-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-sans font-medium text-gray-900 dark:text-white mb-2">
                                        Content
                                    </label>
                                    <div className="border border-gray-300 dark:border-white/10 rounded-lg min-h-[300px] p-4">
                                        <div className="flex items-center gap-2 mb-4 border-b border-gray-300 dark:border-white/10 pb-2">
                                            <button className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded">
                                                <Type size={16} />
                                            </button>
                                            <button className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded">
                                                <Bold size={16} />
                                            </button>
                                            <button className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded">
                                                <Italic size={16} />
                                            </button>
                                            <button className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded">
                                                <List size={16} />
                                            </button>
                                            <button className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded">
                                                <Link size={16} />
                                            </button>
                                            <button className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded">
                                                <Image size={16} />
                                            </button>
                                        </div>
                                        <textarea
                                            className="w-full h-48 bg-transparent focus:outline-none"
                                            placeholder="Start writing your blog post content here..."
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <FileText size={48} className="mx-auto text-gray-400 mb-4" />
                            <p className="font-sans text-gray-600 dark:text-gray-400">
                                Select a blog post to edit or create a new one
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </SpotlightCard>
    );
};

// Media Library Manager Component
const MediaLibraryManager = ({ data }) => {
    const [updateMediaLibrary, { isLoading: isSaving }] = useUpdateMediaLibraryMutation();
    const [deleteImage, { isLoading: isDeleting }] = useDeleteMediaImageMutation();

    const [selectedFiles, setSelectedFiles] = useState([]);
    const [dragActive, setDragActive] = useState(false);
    const [existingImages, setExistingImages] = useState(data || []);
    const [error, setError] = useState('');

    useEffect(() => {
        if (data) {
            setExistingImages(data);
        }
    }, [data]);

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
        else if (e.type === 'dragleave') setDragActive(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) handleFiles(e.dataTransfer.files);
    };

    const handleFiles = (files) => {
        const validFiles = Array.from(files).filter(file => {
            const isImage = file.type.startsWith('image/');
            const isValidSize = file.size <= 10 * 1024 * 1024;
            if (!isImage) setError(`${file.name} is not a valid image file`);
            if (!isValidSize) setError(`${file.name} is too large. Maximum size is 10MB`);
            return isImage && isValidSize;
        });

        const newFiles = validFiles.map(file => ({
            file,
            id: Date.now() + Math.random(),
            preview: URL.createObjectURL(file)
        }));

        setSelectedFiles(prev => [...prev, ...newFiles]);
        if (error && newFiles.length > 0) setError('');
    };

    const removeFile = (fileId) => {
        setSelectedFiles(prev => {
            const fileToRemove = prev.find(f => f.id === fileId);
            if (fileToRemove?.preview) URL.revokeObjectURL(fileToRemove.preview);
            return prev.filter(f => f.id !== fileId);
        });
    };

    const handleDeleteImage = async (publicId) => {
        if (!window.confirm('Are you sure you want to delete this image?')) return;
        try {
            await deleteImage(publicId).unwrap();
            toast.success('Image deleted successfully');
            setExistingImages(prev => prev.filter(img => img.publicId !== publicId));
        } catch (err) {
            toast.error(err?.data?.message || 'Failed to delete image');
        }
    };

    const handleSave = async () => {
        try {
            const formData = new FormData();
            if (existingImages.length > 0) {
                formData.append('existingMediaImages', JSON.stringify(existingImages));
            }
            selectedFiles.forEach((fileObj) => {
                formData.append('mediaLibrary', fileObj.file);
            });

            await updateMediaLibrary(formData).unwrap();
            toast.success('Media library updated successfully');
            setSelectedFiles([]);
        } catch (err) {
            toast.error(err?.data?.message || 'Failed to update media library');
        }
    };

    return (
        <SpotlightCard className="rounded-2xl border bg-white border-gray-200 dark:bg-dark-800 dark:border-white/10 p-6">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="font-serif text-xl font-bold text-gray-900 dark:text-white">Media Library</h3>
                    <p className="text-sm font-sans text-gray-600 dark:text-gray-400">Manage all your uploaded images and media assets</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={isSaving || selectedFiles.length === 0}
                    className="px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 disabled:opacity-50 flex items-center gap-2"
                >
                    <Save size={18} />
                    {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
            </div>

            <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${dragActive ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/10' : 'border-gray-200 dark:border-white/10'
                    }`}
            >
                <div className="max-w-xs mx-auto">
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-600 dark:text-blue-400">
                        <Upload size={24} />
                    </div>
                    <p className="font-sans font-medium text-gray-900 dark:text-white mb-1">Drag and drop images</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">Support for PNG, JPG, WEBP. Max 10MB.</p>
                    <input
                        type="file"
                        multiple
                        accept="image/*"
                        className="hidden"
                        id="media-upload"
                        onChange={(e) => handleFiles(e.target.files)}
                    />
                    <label
                        htmlFor="media-upload"
                        className="px-4 py-2 bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-white/10 cursor-pointer inline-block"
                    >
                        Browse Files
                    </label>
                </div>
            </div>

            {error && <p className="text-red-500 text-sm mt-4">{error}</p>}

            {(existingImages.length > 0 || selectedFiles.length > 0) && (
                <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {existingImages.map((image) => (
                        <div key={image.publicId} className="relative group aspect-square rounded-lg overflow-hidden border border-gray-200 dark:border-white/10">
                            <img src={image.url} alt="" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                <button
                                    onClick={() => window.open(image.url, '_blank')}
                                    className="p-2 bg-white/20 hover:bg-white/40 rounded-lg text-white"
                                >
                                    <Maximize2 size={16} />
                                </button>
                                <button
                                    onClick={() => handleDeleteImage(image.publicId)}
                                    disabled={isDeleting}
                                    className="p-2 bg-red-500/80 hover:bg-red-500 rounded-lg text-white disabled:opacity-50"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                    {selectedFiles.map((file) => (
                        <div key={file.id} className="relative aspect-square rounded-lg overflow-hidden border-2 border-blue-500">
                            <img src={file.preview} alt="" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                <button
                                    onClick={() => removeFile(file.id)}
                                    className="p-2 bg-red-500/80 hover:bg-red-500 rounded-lg text-white"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                            <div className="absolute top-2 left-2 px-1.5 py-0.5 bg-blue-500 text-white text-[10px] rounded font-bold uppercase">New</div>
                        </div>
                    ))}
                </div>
            )}
        </SpotlightCard>
    );
};

// Main AdminContentManagement Component
const AdminContentManagement = () => {
    const { data: siteContentData, isLoading, isError, refetch } = useGetSiteContentQuery();
    const [activeTab, setActiveTab] = useState('homepage');
    const [searchTerm, setSearchTerm] = useState('');

    if (isLoading) return <div className="flex items-center justify-center min-h-screen"><Loader /></div>;
    if (isError) return <div className="text-center py-20 px-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Failed to load content</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">There was an error fetching the site content.</p>
        <button onClick={refetch} className="px-6 py-2 bg-blue-600 text-white rounded-lg">Try Again</button>
    </div>;

    const content = siteContentData?.data || {};

    const tabs = [
        { id: 'homepage', label: 'Homepage', icon: Layout },
        { id: 'gallery', label: 'Gallery', icon: Image },
        { id: 'offers', label: 'Offers & Deals', icon: Tag },
        { id: 'blog', label: 'Blog', icon: FileText },
        { id: 'media', label: 'Media Library', icon: Film },
    ];

    const handleExportContent = () => {
        alert('Exporting content data...');
    };

    const handleImportContent = () => {
        alert('Import content dialog opened...');
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-void p-4 sm:p-6 lg:p-8">
            <Helmet>
                <title>Content Management | Suave By Chloe</title>
                <meta name="robots" content="noindex, nofollow" />
            </Helmet>
            <div className="max-w-7xl mx-auto">
                {/* Page Header */}
                <div className="mb-8">
                    <span className="font-mono text-sm text-blue-500 tracking-widest uppercase mb-2 block">
                        ADMIN_CONTENT_MANAGEMENT
                    </span>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <h1 className="font-serif text-3xl font-bold text-gray-900 dark:text-white mb-2">
                                Content Management
                            </h1>
                            <p className="font-sans text-gray-600 dark:text-gray-400">
                                Manage all website content, galleries, offers, and blog posts
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={handleImportContent}
                                className="px-4 py-2 rounded-lg font-sans font-medium transition-colors border border-gray-300 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 flex items-center gap-2"
                            >
                                <Download size={18} />
                                Import
                            </button>
                            <button
                                onClick={handleExportContent}
                                className="px-4 py-2 rounded-lg font-sans font-medium transition-colors bg-blue-600 dark:bg-blue-500 text-white hover:bg-blue-700 dark:hover:bg-blue-600 flex items-center gap-2"
                            >
                                <Upload size={18} />
                                Export
                            </button>
                        </div>
                    </div>
                </div>

                {/* Search and Tabs */}
                <div className="mb-8">
                    <SpotlightCard className="rounded-2xl border bg-white border-gray-200 dark:bg-dark-800 dark:border-white/10">
                        <div className="p-4">
                            <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                                <div className="flex-1">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                        <input
                                            type="text"
                                            placeholder="Search content by title, category, or ID..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-white/10 bg-white dark:bg-dark-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {tabs.map(tab => {
                                        const Icon = tab.icon;
                                        return (
                                            <button
                                                key={tab.id}
                                                onClick={() => setActiveTab(tab.id)}
                                                className={`px-4 py-2 rounded-lg font-sans font-medium transition-all flex items-center gap-2 ${activeTab === tab.id
                                                    ? 'bg-blue-600 dark:bg-blue-500 text-white'
                                                    : 'bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/10'
                                                    }`}
                                            >
                                                <Icon size={16} />
                                                {tab.label}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </SpotlightCard>
                </div>

                {/* Content Section */}
                <div className="mb-8">
                    {activeTab === 'homepage' && <HomepageEditor data={content.homepage} />}
                    {activeTab === 'gallery' && <GalleryManager data={content.gallery} />}
                    {activeTab === 'offers' && <OffersManager data={content.offers} />}
                    {activeTab === 'blog' && <BlogManager data={content.blogs} />}
                    {activeTab === 'media' && (
                        <MediaLibraryManager data={content.mediaLibrary} />
                    )}
                </div>

                {/* Content Analytics */}
                {/* <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <SpotlightCard className="rounded-2xl border bg-white border-gray-200 dark:bg-dark-800 dark:border-white/10 p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                                <FileText size={24} className="text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                                <p className="text-sm font-sans text-gray-600 dark:text-gray-400">Total Content</p>
                                <p className="text-2xl font-serif font-bold text-gray-900 dark:text-white">156</p>
                            </div>
                        </div>
                    </SpotlightCard>
                    <SpotlightCard className="rounded-2xl border bg-white border-gray-200 dark:bg-dark-800 dark:border-white/10 p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                                <Eye size={24} className="text-green-600 dark:text-green-400" />
                            </div>
                            <div>
                                <p className="text-sm font-sans text-gray-600 dark:text-gray-400">Total Views</p>
                                <p className="text-2xl font-serif font-bold text-gray-900 dark:text-white">45.2K</p>
                            </div>
                        </div>
                    </SpotlightCard>
                    <SpotlightCard className="rounded-2xl border bg-white border-gray-200 dark:bg-dark-800 dark:border-white/10 p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                                <Image size={24} className="text-purple-600 dark:text-purple-400" />
                            </div>
                            <div>
                                <p className="text-sm font-sans text-gray-600 dark:text-gray-400">Images</p>
                                <p className="text-2xl font-serif font-bold text-gray-900 dark:text-white">324</p>
                            </div>
                        </div>
                    </SpotlightCard>
                    <SpotlightCard className="rounded-2xl border bg-white border-gray-200 dark:bg-dark-800 dark:border-white/10 p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                                <TrendingUp size={24} className="text-amber-600 dark:text-amber-400" />
                            </div>
                            <div>
                                <p className="text-sm font-sans text-gray-600 dark:text-gray-400">Engagement</p>
                                <p className="text-2xl font-serif font-bold text-gray-900 dark:text-white">+24%</p>
                            </div>
                        </div>
                    </SpotlightCard>
                </div> */}
            </div>
        </div>
    );
};

export default AdminContentManagement;