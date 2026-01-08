import React, { useState } from 'react';
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
const HomepageEditor = () => {
    const [sections, setSections] = useState([
        {
            id: 'hero',
            title: 'Hero Section',
            type: 'hero',
            enabled: true,
            content: {
                title: 'Luxury Redefined',
                subtitle: 'Experience unparalleled comfort and service',
                buttonText: 'Book Your Stay',
                image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
                overlayOpacity: 0.3,
                textColor: 'white'
            }
        },
        {
            id: 'features',
            title: 'Features Section',
            type: 'features',
            enabled: true,
            content: {
                title: 'Our Amenities',
                subtitle: 'Everything you need for a perfect stay',
                features: [
                    { icon: 'wifi', title: 'High-Speed WiFi', description: 'Free high-speed internet throughout' },
                    { icon: 'pool', title: 'Infinity Pool', description: 'Stunning city-view infinity pool' },
                    { icon: 'spa', title: 'Luxury Spa', description: 'World-class spa treatments' },
                    { icon: 'dining', title: 'Fine Dining', description: 'Award-winning restaurants' }
                ]
            }
        },
        {
            id: 'testimonials',
            title: 'Testimonials',
            type: 'testimonials',
            enabled: true,
            content: {
                title: 'Guest Reviews',
                subtitle: 'What our guests say about us',
                testimonials: [
                    { name: 'Sarah M.', quote: 'Best hotel experience ever!', rating: 5 },
                    { name: 'John D.', quote: 'Absolutely stunning views.', rating: 5 },
                    { name: 'Lisa R.', quote: 'Service was exceptional.', rating: 4 }
                ]
            }
        },
        {
            id: 'cta',
            title: 'Call to Action',
            type: 'cta',
            enabled: true,
            content: {
                title: 'Ready for Your Dream Vacation?',
                subtitle: 'Book now and get 20% off your first stay',
                buttonText: 'Book Now',
                backgroundColor: 'blue'
            }
        }
    ]);

    const [editingSection, setEditingSection] = useState(null);

    const handleSectionToggle = (id) => {
        setSections(sections.map(section =>
            section.id === id ? { ...section, enabled: !section.enabled } : section
        ));
    };

    const handleSave = () => {
        alert('Homepage changes saved successfully!');
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
                        className="px-4 py-2 rounded-lg font-sans font-medium transition-colors bg-blue-600 dark:bg-blue-500 text-white hover:bg-blue-700 dark:hover:bg-blue-600 flex items-center gap-2"
                    >
                        <Save size={16} />
                        Save Changes
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
                                <div className="aspect-video rounded-lg overflow-hidden mb-2">
                                    <img
                                        src={editingSection.content.image}
                                        alt="Hero Preview"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <input
                                    type="text"
                                    value={editingSection.content.image}
                                    onChange={(e) => {
                                        const updated = {
                                            ...editingSection,
                                            content: { ...editingSection.content, image: e.target.value }
                                        };
                                        setEditingSection(updated);
                                    }}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-white/10 bg-white dark:bg-dark-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
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
                                    src={sections.find(s => s.id === 'hero')?.content.image}
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
const GalleryManager = () => {
    const [galleries, setGalleries] = useState([
        {
            id: 1,
            title: 'Rooms & Suites',
            type: 'rooms',
            imageCount: 24,
            coverImage: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
            status: 'published',
            updatedAt: '2024-01-15',
            description: 'Luxury rooms and suites with city views'
        },
        {
            id: 2,
            title: 'Amenities',
            type: 'amenities',
            imageCount: 18,
            coverImage: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
            status: 'published',
            updatedAt: '2024-01-10',
            description: 'Hotel facilities and amenities'
        },
        {
            id: 3,
            title: 'Dining',
            type: 'dining',
            imageCount: 12,
            coverImage: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
            status: 'published',
            updatedAt: '2024-01-05',
            description: 'Restaurants and dining experiences'
        },
        {
            id: 4,
            title: 'Events & Weddings',
            type: 'events',
            imageCount: 32,
            coverImage: 'https://images.unsplash.com/photo-1519167758481-83f29da8c9a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
            status: 'draft',
            updatedAt: '2024-01-01',
            description: 'Venues and event spaces'
        }
    ]);

    const [selectedGallery, setSelectedGallery] = useState(null);
    const [images, setImages] = useState([
        {
            id: 1,
            url: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
            title: 'City View Suite',
            description: 'Luxury suite with panoramic city views',
            category: 'rooms',
            order: 1,
            featured: true
        },
        {
            id: 2,
            url: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
            title: 'Presidential Suite',
            description: 'Our most luxurious accommodation',
            category: 'rooms',
            order: 2,
            featured: true
        }
    ]);

    const handleUploadImages = (files) => {
        const newImages = Array.from(files).map((file, index) => ({
            id: images.length + index + 1,
            url: URL.createObjectURL(file),
            title: `Image ${images.length + index + 1}`,
            description: '',
            category: selectedGallery?.type || 'uncategorized',
            order: images.length + index + 1,
            featured: false
        }));
        setImages([...images, ...newImages]);
    };

    const handleDeleteImage = (id) => {
        setImages(images.filter(img => img.id !== id));
    };

    const handleSetFeatured = (id) => {
        setImages(images.map(img => ({
            ...img,
            featured: img.id === id
        })));
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
                <button className="px-4 py-2 rounded-lg font-sans font-medium transition-colors bg-blue-600 dark:bg-blue-500 text-white hover:bg-blue-700 dark:hover:bg-blue-600 flex items-center gap-2">
                    <Plus size={16} />
                    New Gallery
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Galleries List */}
                <div className="lg:col-span-1">
                    <div className="space-y-4">
                        {galleries.map(gallery => (
                            <div
                                key={gallery.id}
                                onClick={() => setSelectedGallery(gallery)}
                                className={`p-4 rounded-lg border cursor-pointer transition-colors ${selectedGallery?.id === gallery.id
                                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                    : 'border-gray-200 dark:border-white/10 hover:border-blue-300 dark:hover:border-blue-500/50'
                                    }`}
                            >
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-12 h-12 rounded-lg overflow-hidden">
                                        <img
                                            src={gallery.coverImage}
                                            alt={gallery.title}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div>
                                        <h4 className="font-sans font-medium text-gray-900 dark:text-white">
                                            {gallery.title}
                                        </h4>
                                        <div className="flex items-center gap-2">
                                            <StatusBadge status={gallery.status} />
                                            <span className="text-xs font-sans text-gray-500 dark:text-gray-400">
                                                {gallery.imageCount} images
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <p className="text-sm font-sans text-gray-600 dark:text-gray-400">
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
                                        className="px-4 py-2 rounded-lg font-sans font-medium transition-colors border border-gray-300 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 cursor-pointer flex items-center gap-2"
                                    >
                                        <Upload size={16} />
                                        Upload Images
                                    </label>
                                </div>
                            </div>

                            {/* Gallery Images */}
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {images.map(image => (
                                    <div key={image.id} className="group relative aspect-square rounded-lg overflow-hidden border border-gray-200 dark:border-white/10">
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
                                                    className="w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                            <div className="text-white">
                                                <h5 className="font-sans font-medium mb-1">{image.title}</h5>
                                                <p className="text-xs opacity-80">{image.description}</p>
                                            </div>
                                        </div>
                                        <div className="absolute top-2 right-2 flex gap-2">
                                            <button
                                                onClick={() => handleSetFeatured(image.id)}
                                                className={`w-8 h-8 rounded-full flex items-center justify-center ${image.featured ? 'bg-yellow-500' : 'bg-white/20 backdrop-blur-sm'}`}
                                            >
                                                <Star size={14} className={image.featured ? 'text-white' : 'text-white/80'} fill={image.featured ? 'white' : 'none'} />
                                            </button>
                                            <button className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                                                <Edit size={14} className="text-white/80" />
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
                                            defaultValue={selectedGallery.title}
                                            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-white/10 bg-white dark:bg-dark-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-sans font-medium text-gray-900 dark:text-white mb-2">
                                            Description
                                        </label>
                                        <textarea
                                            defaultValue={selectedGallery.description}
                                            rows="3"
                                            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-white/10 bg-white dark:bg-dark-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>
                                    <div className="flex justify-end">
                                        <button className="px-4 py-2 rounded-lg font-sans font-medium transition-colors bg-blue-600 dark:bg-blue-500 text-white hover:bg-blue-700 dark:hover:bg-blue-600">
                                            Save Gallery
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
const OffersManager = () => {
    const [offers, setOffers] = useState([
        {
            id: 1,
            title: 'Summer Escape Package',
            code: 'SUMMER24',
            discount: 20,
            type: 'percentage',
            description: 'Get 20% off your summer stay',
            startDate: '2024-06-01',
            endDate: '2024-08-31',
            status: 'active',
            usage: 142,
            revenue: 28400,
            image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
            updatedAt: '2024-05-15'
        },
        {
            id: 2,
            title: 'Early Bird Special',
            code: 'EARLYBIRD',
            discount: 15,
            type: 'percentage',
            description: 'Book 30 days in advance and save 15%',
            startDate: '2024-01-01',
            endDate: '2024-12-31',
            status: 'active',
            usage: 89,
            revenue: 17800,
            image: 'https://images.unsplash.com/photo-1564501049418-3c27787d01e8?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
            updatedAt: '2024-05-10'
        },
        {
            id: 3,
            title: 'Weekend Getaway',
            code: 'WEEKEND',
            discount: 100,
            type: 'fixed',
            description: '$100 off weekend stays',
            startDate: '2024-05-01',
            endDate: '2024-07-31',
            status: 'active',
            usage: 56,
            revenue: 11200,
            image: 'https://images.unsplash.com/photo-1564501049418-3c27787d01e8?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
            updatedAt: '2024-05-05'
        },
        {
            id: 4,
            title: 'Honeymoon Package',
            code: 'HONEYMOON',
            discount: 25,
            type: 'percentage',
            description: 'Special package for honeymooners',
            startDate: '2024-01-01',
            endDate: '2024-12-31',
            status: 'draft',
            usage: 0,
            revenue: 0,
            image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
            updatedAt: '2024-05-01'
        }
    ]);

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

    const handleCreateOffer = () => {
        if (!newOffer.title || !newOffer.code) return;
        const offer = {
            ...newOffer,
            id: offers.length + 1,
            usage: 0,
            revenue: 0,
            image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
            updatedAt: new Date().toISOString().split('T')[0]
        };
        setOffers([...offers, offer]);
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

    const handleToggleStatus = (id) => {
        setOffers(offers.map(offer =>
            offer.id === id
                ? { ...offer, status: offer.status === 'active' ? 'inactive' : 'active' }
                : offer
        ));
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
                <button className="px-4 py-2 rounded-lg font-sans font-medium transition-colors bg-blue-600 dark:bg-blue-500 text-white hover:bg-blue-700 dark:hover:bg-blue-600 flex items-center gap-2">
                    <Plus size={16} />
                    Create Offer
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
                        {offers.map(offer => (
                            <div key={offer.id} className="p-4 rounded-lg border border-gray-200 dark:border-white/10 hover:border-blue-300 dark:hover:border-blue-500/50 transition-colors">
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
                                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${offer.status === 'active' ? 'bg-green-600' : 'bg-gray-300 dark:bg-white/20'}`}
                                        >
                                            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${offer.status === 'active' ? 'translate-x-6' : 'translate-x-1'}`} />
                                        </button>
                                        <button className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 text-gray-900 dark:text-white">
                                            <MoreVertical size={16} />
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
                                            ${offer.revenue.toLocaleString()}
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
const BlogManager = () => {
    const [posts, setPosts] = useState([
        {
            id: 1,
            title: 'Top 10 Luxury Hotels in Abuja',
            slug: 'top-10-luxury-hotels-abuja',
            excerpt: 'Discover the most luxurious hotels offering breathtaking city views and world-class amenities.',
            category: 'Travel',
            author: 'Sarah Johnson',
            status: 'published',
            views: 12450,
            likes: 842,
            comments: 56,
            featured: true,
            image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
            publishedAt: '2024-05-20',
            updatedAt: '2024-05-20'
        },
        {
            id: 2,
            title: 'Best Restaurants Near Suave By Chloe',
            slug: 'best-restaurants-near-suave-by-chloe',
            excerpt: 'Explore the culinary delights surrounding our luxury hotel.',
            category: 'Food',
            author: 'Michael Chen',
            status: 'published',
            views: 8560,
            likes: 521,
            comments: 32,
            featured: false,
            image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
            publishedAt: '2024-05-15',
            updatedAt: '2024-05-15'
        },
        {
            id: 3,
            title: 'Summer Travel Tips 2024',
            slug: 'summer-travel-tips-2024',
            excerpt: 'Make the most of your summer vacation with these expert tips.',
            category: 'Travel Tips',
            author: 'Robert Davis',
            status: 'draft',
            views: 0,
            likes: 0,
            comments: 0,
            featured: false,
            image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
            publishedAt: '',
            updatedAt: '2024-05-10'
        },
        {
            id: 4,
            title: 'Wedding Planning at Luxury Hotels',
            slug: 'wedding-planning-luxury-hotels',
            excerpt: 'Everything you need to know about planning your dream wedding.',
            category: 'Events',
            author: 'Emily Wilson',
            status: 'scheduled',
            views: 0,
            likes: 0,
            comments: 0,
            featured: false,
            image: 'https://images.unsplash.com/photo-1519167758481-83f29da8c9a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
            publishedAt: '2024-06-01',
            updatedAt: '2024-05-05'
        }
    ]);

    const [editingPost, setEditingPost] = useState(null);

    const handleCreatePost = () => {
        const newPost = {
            id: posts.length + 1,
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
        setPosts([newPost, ...posts]);
        setEditingPost(newPost);
    };

    const handleDeletePost = (id) => {
        if (window.confirm('Are you sure you want to delete this blog post?')) {
            setPosts(posts.filter(post => post.id !== id));
        }
    };

    const handleToggleFeatured = (id) => {
        setPosts(posts.map(post => ({
            ...post,
            featured: post.id === id ? !post.featured : false
        })));
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
                    className="px-4 py-2 rounded-lg font-sans font-medium transition-colors bg-blue-600 dark:bg-blue-500 text-white hover:bg-blue-700 dark:hover:bg-blue-600 flex items-center gap-2"
                >
                    <Plus size={16} />
                    New Post
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
                                        {post.category} • {post.views.toLocaleString()} views
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
                                            className="p-1 text-red-500"
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
                                        onClick={() => window.open(`/blog/${editingPost.slug}`, '_blank')}
                                        className="px-3 py-1.5 rounded-lg text-sm font-sans font-medium transition-colors border border-gray-300 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 flex items-center gap-2"
                                    >
                                        <Eye size={14} />
                                        Preview
                                    </button>
                                    <button className="px-4 py-2 rounded-lg font-sans font-medium transition-colors bg-blue-600 dark:bg-blue-500 text-white hover:bg-blue-700 dark:hover:bg-blue-600">
                                        Save Changes
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
                                        defaultValue={editingPost.title}
                                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-white/10 bg-white dark:bg-dark-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-sans font-medium text-gray-900 dark:text-white mb-2">
                                        Slug *
                                    </label>
                                    <input
                                        type="text"
                                        defaultValue={editingPost.slug}
                                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-white/10 bg-white dark:bg-dark-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-sans font-medium text-gray-900 dark:text-white mb-2">
                                            Category
                                        </label>
                                        <select
                                            defaultValue={editingPost.category}
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
                                            defaultValue={editingPost.status}
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
                                            src={editingPost.image}
                                            alt="Post Preview"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <input
                                        type="text"
                                        defaultValue={editingPost.image}
                                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-white/10 bg-white dark:bg-dark-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-sans font-medium text-gray-900 dark:text-white mb-2">
                                        Excerpt
                                    </label>
                                    <textarea
                                        defaultValue={editingPost.excerpt}
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

// Main AdminContentManagement Component
const AdminContentManagement = () => {
    const [activeTab, setActiveTab] = useState('homepage');
    const [searchTerm, setSearchTerm] = useState('');

    const tabs = [
        { id: 'homepage', label: 'Homepage', icon: Layout },
        { id: 'gallery', label: 'Gallery', icon: Image },
        { id: 'offers', label: 'Offers & Deals', icon: Tag },
        { id: 'blog', label: 'Blog', icon: FileText },
        { id: 'pages', label: 'Pages', icon: Globe },
        { id: 'media', label: 'Media Library', icon: Film },
        { id: 'seo', label: 'SEO', icon: TrendingUp },
        { id: 'analytics', label: 'Analytics', icon: BarChart }
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
                    {activeTab === 'homepage' && <HomepageEditor />}
                    {activeTab === 'gallery' && <GalleryManager />}
                    {activeTab === 'offers' && <OffersManager />}
                    {activeTab === 'blog' && <BlogManager />}
                    {activeTab === 'pages' && (
                        <SpotlightCard className="rounded-2xl border bg-white border-gray-200 dark:bg-dark-800 dark:border-white/10 p-6">
                            <div className="text-center py-12">
                                <Globe size={48} className="mx-auto text-gray-400 mb-4" />
                                <h3 className="font-serif text-xl font-bold text-gray-900 dark:text-white mb-2">
                                    Pages Management
                                </h3>
                                <p className="text-sm font-sans text-gray-600 dark:text-gray-400 mb-4">
                                    Manage static pages like About Us, Contact, Terms, etc.
                                </p>
                                <button className="px-4 py-2 rounded-lg font-sans font-medium transition-colors bg-blue-600 dark:bg-blue-500 text-white hover:bg-blue-700 dark:hover:bg-blue-600">
                                    Manage Pages
                                </button>
                            </div>
                        </SpotlightCard>
                    )}
                    {activeTab === 'media' && (
                        <SpotlightCard className="rounded-2xl border bg-white border-gray-200 dark:bg-dark-800 dark:border-white/10 p-6">
                            <div className="text-center py-12">
                                <Film size={48} className="mx-auto text-gray-400 mb-4" />
                                <h3 className="font-serif text-xl font-bold text-gray-900 dark:text-white mb-2">
                                    Media Library
                                </h3>
                                <p className="text-sm font-sans text-gray-600 dark:text-gray-400 mb-4">
                                    Upload and manage all media files
                                </p>
                                <button className="px-4 py-2 rounded-lg font-sans font-medium transition-colors bg-blue-600 dark:bg-blue-500 text-white hover:bg-blue-700 dark:hover:bg-blue-600">
                                    Open Media Library
                                </button>
                            </div>
                        </SpotlightCard>
                    )}
                </div>

                {/* Content Analytics */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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
                </div>
            </div>
        </div>
    );
};

export default AdminContentManagement;