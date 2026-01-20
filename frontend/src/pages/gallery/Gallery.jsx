import React, { useState, useEffect, useMemo } from 'react';
import { X, Play, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import SpotlightCard from '../../components/ui/SpotlightCard';
import { useGetSiteContentQuery } from '../authenticatedPages/siteContentApiSlice';
import Loader from '../../components/ui/Loader';

const Gallery = () => {
    const { data: siteContentData, isLoading, error } = useGetSiteContentQuery();
    const [activeTab, setActiveTab] = useState('');
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [mediaType, setMediaType] = useState('image');
    const [playingVideo, setPlayingVideo] = useState(null);
    const siteContent = siteContentData?.data;

    // Layout pattern from the original static data to maintain design
    const layoutPattern = [
        "lg:col-span-2 lg:row-span-1",
        "",
        "",
        "lg:col-span-2",
        "lg:col-span-2",
        ""
    ];

    // Process gallery data from API
    const { tabs, currentData } = useMemo(() => {
        if (!siteContent?.gallery || siteContent.gallery.length === 0) {
            return { tabs: [], currentData: null };
        }


        // Map albums to tabs
        const derivedTabs = siteContent.gallery
            .filter(album => album.status === 'published' || album.status === 'draft') // Show published/draft
            .map(album => ({
                id: album.id,
                label: album.title
            }));

        // Get current active album data
        const activeAlbum = siteContent.gallery.find(a => a.id === activeTab) || siteContent.gallery[0];

        if (!activeAlbum) return { tabs: derivedTabs, currentData: null };

        // Process images with layout
        const images = (activeAlbum.images || []).map((img, idx) => ({
            src: img.url,
            title: img.title,
            colSpan: layoutPattern[idx % layoutPattern.length]
        }));

        // Backend currently doesn't have videos in the schema, using empty array effectively hides the section
        // If we wanted to preserve static videos as placeholders, we could mix them in, but "real data" implies purely backend.
        const videos = [];

        return {
            tabs: derivedTabs,
            currentData: { images, videos }
        };
    }, [siteContent, activeTab]);

    // Set initial active tab
    useEffect(() => {
        if (siteContent?.gallery?.length > 0 && !activeTab) {
            setActiveTab(siteContent.gallery[0].id);
        }
    }, [siteContent, activeTab]);

    const allMedia = useMemo(() => {
        if (!currentData) return [];
        return [
            ...currentData.images.map((img, idx) => ({ type: 'image', src: img.src, title: img.title, index: idx })),
            ...currentData.videos.map((vid, idx) => ({ type: 'video', src: vid, index: idx }))
        ];
    }, [currentData]);

    const openLightbox = (index, type) => {
        setCurrentIndex(index);
        setMediaType(type);
        setLightboxOpen(true);
        setPlayingVideo(null);
    };

    const closeLightbox = () => {
        setLightboxOpen(false);
        setPlayingVideo(null);
    };

    const nextMedia = () => {
        setCurrentIndex((prev) => (prev + 1) % allMedia.length);
        setPlayingVideo(null);
    };

    const prevMedia = () => {
        setCurrentIndex((prev) => (prev - 1 + allMedia.length) % allMedia.length);
        setPlayingVideo(null);
    };

    const handleVideoPlay = (videoId) => {
        setPlayingVideo(videoId);
    };

    // Keyboard navigation for lightbox
    useEffect(() => {
        if (!lightboxOpen) return;

        const handleKeyDown = (e) => {
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') prevMedia();
            if (e.key === 'ArrowRight') nextMedia();
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [lightboxOpen, currentIndex, allMedia.length]); // Added allMedia.length dependency

    if (isLoading) return <div className="min-h-screen pt-28 pb-16 bg-gray-50 dark:bg-void flex justify-center items-center"><Loader /></div>;

    // Graceful error or empty state
    if (error || !siteContent) return (
        <div className="min-h-screen pt-28 pb-16 bg-gray-50 dark:bg-void flex justify-center items-center text-gray-500">
            <p>Failed to load gallery content.</p>
        </div>
    );

    return (
        <div className="min-h-screen pt-28 pb-16 bg-gray-50 dark:bg-void">
            <Helmet>
                <title>Gallery | Suave By Chloe</title>
                <meta
                    name="description"
                    content="Take a visual tour of Suave By Chloe. View our stunning rooms, world-class amenities, fine dining, and event spaces in Abuja."
                />
                <meta property="og:title" content="Gallery | Suave By Chloe" />
                <meta
                    property="og:description"
                    content="Take a visual tour of Suave By Chloe. View our stunning rooms, world-class amenities, fine dining, and event spaces in Abuja."
                />
                <meta property="og:type" content="website" />
            </Helmet>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-12">
                    <span className="font-mono text-sm text-blue-500 tracking-widest uppercase mb-4 block">
                        07 // VISUAL EXPERIENCE
                    </span>
                    <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
                        Gallery
                    </h1>
                    <p className="text-sm text-gray-700 dark:text-gray-400 max-w-2xl mx-auto">
                        Explore our stunning spaces through images and videos that showcase the luxury and elegance awaiting you.
                    </p>
                </div>

                {/* Tabs */}
                {tabs.length > 0 ? (
                    <div className="flex flex-wrap justify-center gap-3 mb-12">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => {
                                    setActiveTab(tab.id);
                                    setPlayingVideo(null);
                                }}
                                className={`px-6 py-3 rounded-lg font-mono text-sm font-semibold transition-all ${activeTab === tab.id
                                    ? 'bg-blue-600 text-white dark:bg-blue-500'
                                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-white/10 dark:hover:bg-gray-700'
                                    }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                ) : (
                    <div className="text-center text-gray-500 mb-12">No gallery albums found.</div>
                )}

                {/* Bento Box Images Grid */}
                {currentData?.images?.length > 0 && (
                    <div className="mb-12">
                        <h2 className="font-serif text-2xl font-bold mb-6 text-gray-900 dark:text-white">
                            Photos
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 auto-rows-[300px] lg:auto-rows-[400px] gap-6">
                            {currentData.images.map((image, idx) => (
                                <SpotlightCard
                                    key={idx}
                                    className={`
                                        h-[300px] lg:h-full relative group overflow-hidden cursor-pointer rounded-xl border
                                        ${image.colSpan || ''} 
                                        bg-white border-gray-300 dark:bg-gray-800 dark:border-white/10
                                    `}
                                    onClick={() => openLightbox(idx, 'image')}
                                >
                                    {/* Background Image */}
                                    <div className="absolute inset-0 z-0">
                                        <img
                                            src={image.src}
                                            alt={image.title}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                                    </div>

                                    {/* Expand Icon */}
                                    <div className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/90 dark:bg-black/90">
                                        <Maximize2 size={20} className="text-gray-900 dark:text-white" />
                                    </div>

                                    {/* Title Overlay */}
                                    <div className="absolute bottom-0 left-0 right-0 z-10 p-6">
                                        <h3 className="font-serif text-xl md:text-2xl font-bold text-white">
                                            {image.title}
                                        </h3>
                                    </div>
                                </SpotlightCard>
                            ))}
                        </div>
                    </div>
                )}

                {/* Videos Grid - Only show if videos exist */}
                {currentData?.videos?.length > 0 && (
                    <div>
                        <h2 className="font-serif text-2xl font-bold mb-6 text-gray-900 dark:text-white">
                            Videos
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {currentData.videos.map((video, idx) => (
                                <SpotlightCard
                                    key={idx}
                                    className="group relative h-64 md:h-80 rounded-xl overflow-hidden cursor-pointer border bg-white border-gray-300 dark:bg-gray-800 dark:border-white/10"
                                >
                                    {playingVideo === video.id ? (
                                        <iframe
                                            className="w-full h-full"
                                            src={`https://www.youtube.com/embed/${video.id}?autoplay=1`}
                                            title={video.title}
                                            frameBorder="0"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                        />
                                    ) : (
                                        <>
                                            <img
                                                src={video.thumbnail}
                                                alt={video.title}
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                            />
                                            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors duration-300" />
                                            <button
                                                onClick={() => handleVideoPlay(video.id)}
                                                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 bg-blue-600 hover:bg-blue-700 group-hover:scale-110 shadow-xl"
                                            >
                                                <Play size={28} className="text-white ml-1" fill="currentColor" />
                                            </button>
                                            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
                                                <h3 className="font-serif text-lg font-bold text-white">
                                                    {video.title}
                                                </h3>
                                            </div>
                                        </>
                                    )}
                                </SpotlightCard>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Full-Screen Modal/Lightbox - Only show if images exist */}
            {lightboxOpen && allMedia.length > 0 && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm animate-fadeIn"
                    onClick={closeLightbox}
                >
                    {/* Close Button */}
                    <button
                        onClick={closeLightbox}
                        className="absolute top-4 right-4 md:top-8 md:right-8 w-12 h-12 rounded-full flex items-center justify-center transition-all bg-white/10 hover:bg-white/20 hover:scale-110 text-white z-50"
                        aria-label="Close"
                    >
                        <X size={24} />
                    </button>

                    {/* Previous Button */}
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            prevMedia();
                        }}
                        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full flex items-center justify-center transition-all bg-white/10 hover:bg-white/20 hover:scale-110 text-white z-50"
                        aria-label="Previous"
                    >
                        <ChevronLeft size={28} />
                    </button>

                    {/* Next Button */}
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            nextMedia();
                        }}
                        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full flex items-center justify-center transition-all bg-white/10 hover:bg-white/20 hover:scale-110 text-white z-50"
                        aria-label="Next"
                    >
                        <ChevronRight size={28} />
                    </button>

                    {/* Content Container */}
                    <div
                        className="max-w-7xl w-full h-full flex flex-col items-center justify-center p-4 md:p-8"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Media Display */}
                        <div className="relative w-full h-full flex items-center justify-center mb-4">
                            {allMedia[currentIndex]?.type === 'image' ? (
                                <img
                                    src={allMedia[currentIndex].src}
                                    alt={allMedia[currentIndex].title}
                                    className="max-w-full max-h-[calc(100vh-8rem)] object-contain rounded-xl shadow-2xl"
                                />
                            ) : (
                                <div className="w-full max-w-5xl aspect-video">
                                    <iframe
                                        className="w-full h-full rounded-xl shadow-2xl"
                                        src={`https://www.youtube.com/embed/${allMedia[currentIndex].src.id}?autoplay=1`}
                                        title="Video Player"
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                    />
                                </div>
                            )}
                        </div>

                        {/* Image Info - Title & Counter */}
                        <div className="flex flex-col sm:flex-row items-center justify-between w-full max-w-5xl gap-4">
                            <div className="text-center sm:text-left">
                                <h3 className="font-serif text-xl md:text-2xl font-bold text-white mb-1">
                                    {allMedia[currentIndex]?.title || allMedia[currentIndex]?.src?.title}
                                </h3>
                                <p className="text-sm text-gray-400 font-sans">
                                    {allMedia[currentIndex]?.type === 'image' ? 'Image' : 'Video'}
                                </p>
                            </div>
                            <div className="px-4 py-2 rounded-full font-mono text-sm bg-white/10 backdrop-blur-md text-white">
                                {currentIndex + 1} / {allMedia.length}
                            </div>
                        </div>
                    </div>

                    {/* Keyboard Hint (Desktop only) */}
                    <div className="hidden md:block absolute bottom-8 left-1/2 -translate-x-1/2 text-xs text-gray-400 font-mono">
                        Use ← → arrow keys to navigate • ESC to close
                    </div>
                </div>
            )}
        </div>
    );
};

export default Gallery;