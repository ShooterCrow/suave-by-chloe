import React from 'react';
import { Award, Users, Globe, Heart, TrendingUp, Shield, Sparkles, Target } from 'lucide-react';
import SpotlightCard from '../../components/ui/SpotlightCard';
import { Helmet } from 'react-helmet-async';


const stats = [
    { number: "2026", label: "Grand Opening" },
    { number: "250+", label: "Luxury Suites" },
    { number: "12", label: "World-Class Amenities" },
    { number: "24/7", label: "Concierge Service" }
];

const values = [
    {
        icon: Heart,
        title: "Guest-Centric",
        description: "Every decision we make is driven by our commitment to creating unforgettable experiences for our guests.",
        color: "rose"
    },
    {
        icon: Sparkles,
        title: "Excellence",
        description: "We maintain the highest standards in every aspect of our service, from amenities to hospitality.",
        color: "amber"
    },
    {
        icon: Globe,
        title: "Sustainability",
        description: "We're committed to environmental responsibility and sustainable luxury tourism practices.",
        color: "emerald"
    },
    {
        icon: Shield,
        title: "Integrity",
        description: "Transparency, honesty, and ethical practices guide everything we do in our business.",
        color: "blue"
    }
];

const team = [
    {
        name: "Sarah Mitchell",
        role: "Chief Executive Officer",
        image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        bio: "Visionary leader in modern hospitality"
    },
    {
        name: "James Chen",
        role: "Director of Operations",
        image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        bio: "Expert in luxury property management"
    },
    {
        name: "Emily Rodriguez",
        role: "Head of Guest Experience",
        image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        bio: "Passionate about creating memories"
    },
    {
        name: "Michael Thompson",
        role: "Chief Culinary Officer",
        image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        bio: "Michelin-starred culinary innovator"
    }
];

const milestones = [
    { year: "2022", event: "Groundbreaking ceremony and construction begins" },
    { year: "2023", event: "Structural completion and interior design phase" },
    { year: "2024", event: "Installation of cutting-edge smart room technology" },
    { year: "2025", event: "Staff training and pre-opening preparations" },
    { year: "2026", event: "Grand opening as a premier luxury destination" }
];

const AboutUs = () => {
    return (
        <div className="min-h-screen pt-20 pb-16 bg-gray-50 dark:bg-void transition-colors duration-300">
            <Helmet>
                <title>About Us | Suave By Chloe</title>
                <meta
                    name="description"
                    content="Learn about Suave By Chloe, a luxury hotel redefining hospitality in Abuja, Nigeria. Discover our history, mission, and commitment to excellence."
                />
                <meta property="og:title" content="About Us | Suave By Chloe" />
                <meta
                    property="og:description"
                    content="Learn about Suave By Chloe, a luxury hotel redefining hospitality in Abuja, Nigeria. Discover our history, mission, and commitment to excellence."
                />
                <meta property="og:type" content="website" />
            </Helmet>
            {/* Split Banner Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center mb-16">
                    <div>
                        <span className="font-mono text-sm text-blue-500 tracking-widest uppercase mb-4 block">
                            05 // OUR STORY
                        </span>
                        <h1 className="font-serif text-5xl md:text-6xl font-bold mb-6 text-gray-900 dark:text-white">
                            A New Era in Luxury Hospitality
                        </h1>
                        <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                            Opened in 2026, our hotel represents the pinnacle of modern luxury and innovation. Built from the ground up with cutting-edge technology and contemporary design, we're setting a new standard for what guests can expect from a world-class hospitality experience.
                        </p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <SpotlightCard className="relative h-64 rounded-2xl overflow-hidden border bg-white border-gray-200 dark:bg-dark-800 dark:border-white/10">
                            <img
                                src="https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                                alt="Luxury Hotel Exterior"
                                className="w-full h-full object-cover"
                            />
                        </SpotlightCard>
                        <SpotlightCard className="relative h-64 rounded-2xl overflow-hidden border mt-8 bg-white border-gray-200 dark:bg-dark-800 dark:border-white/10">
                            <img
                                src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                                alt="Hotel Interior"
                                className="w-full h-full object-cover"
                            />
                        </SpotlightCard>
                    </div>
                </div>

                {/* Stats Section */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-24">
                    {stats.map((stat, idx) => (
                        <SpotlightCard
                            key={idx}
                            className="p-8 rounded-2xl border text-center bg-white border-gray-200 dark:bg-dark-800 dark:border-white/10"
                        >
                            <div className="font-serif text-4xl md:text-5xl font-bold mb-2 text-blue-600 dark:text-blue-400">
                                {stat.number}
                            </div>
                            <div className="font-sans text-sm text-gray-600 dark:text-gray-400">
                                {stat.label}
                            </div>
                        </SpotlightCard>
                    ))}
                </div>

                {/* Mission Section */}
                <div className="mb-24">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <span className="font-mono text-sm text-blue-500 tracking-widest uppercase mb-4 block">
                                OUR_MISSION
                            </span>
                            <h2 className="font-serif text-4xl font-bold mb-6 text-gray-900 dark:text-white">
                                Creating Tomorrow's Hospitality Today
                            </h2>
                            <p className="font-sans text-lg leading-relaxed mb-6 text-gray-600 dark:text-gray-400">
                                As a brand-new property, we've had the unique opportunity to design every aspect of your stay from the ground up. We've integrated the latest smart technology, sustainable materials, and contemporary design principles to create a hotel that feels fresh, forward-thinking, and utterly luxurious.
                            </p>
                            <p className="font-sans text-lg leading-relaxed text-gray-600 dark:text-gray-400">
                                Our mission is to redefine what modern luxury means by combining innovative amenities, personalized service, and environmental consciousness. We're not bound by tradition—we're creating new ones that will shape the future of hospitality.
                            </p>
                        </div>
                        <SpotlightCard className="relative h-[500px] rounded-2xl overflow-hidden border bg-white border-gray-200 dark:bg-dark-800 dark:border-white/10">
                            <img
                                src="https://images.unsplash.com/photo-1445019980597-93fa8acb246c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                                alt="Our Mission"
                                className="w-full h-full object-cover"
                            />
                        </SpotlightCard>
                    </div>
                </div>

                {/* Values Section */}
                <div className="mb-24">
                    <div className="text-center max-w-3xl mx-auto mb-12">
                        <span className="font-mono text-sm text-blue-500 tracking-widest uppercase mb-2 block">
                            CORE_VALUES
                        </span>
                        <h2 className="font-serif text-4xl font-bold text-gray-900 dark:text-white">
                            What Drives Us Forward
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {values.map((value, idx) => (
                            <SpotlightCard
                                key={idx}
                                className="p-8 rounded-2xl border group bg-white border-gray-200 dark:bg-dark-800 dark:border-white/10"
                            >
                                <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110 bg-${value.color}-500/15 text-${value.color}-600 dark:bg-${value.color}-500/20 dark:text-${value.color}-400`}>
                                    <value.icon size={28} strokeWidth={1.5} />
                                </div>
                                <h3 className="font-serif text-2xl font-bold mb-3 text-gray-900 dark:text-white">
                                    {value.title}
                                </h3>
                                <p className="font-sans text-gray-600 dark:text-gray-400 leading-relaxed">
                                    {value.description}
                                </p>
                            </SpotlightCard>
                        ))}
                    </div>
                </div>

                {/* Timeline Section */}
                <div className="mb-24">
                    <div className="text-center max-w-3xl mx-auto mb-12">
                        <span className="font-mono text-sm text-blue-500 tracking-widest uppercase mb-2 block">
                            OUR_JOURNEY
                        </span>
                        <h2 className="font-serif text-4xl font-bold text-gray-900 dark:text-white">
                            From Vision to Reality
                        </h2>
                    </div>

                    <div className="relative">
                        {/* Timeline Line */}
                        <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-blue-500 dark:bg-blue-400" />

                        <div className="space-y-12">
                            {milestones.map((milestone, idx) => (
                                <div
                                    key={idx}
                                    className={`flex items-center gap-8 ${idx % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}
                                >
                                    <div className={`flex-1 ${idx % 2 === 0 ? 'text-right' : 'text-left'}`}>
                                        <SpotlightCard className="inline-block p-6 rounded-2xl border bg-white border-gray-200 dark:bg-dark-800 dark:border-white/10">
                                            <div className="font-mono text-2xl font-bold mb-2 text-blue-600 dark:text-blue-400">
                                                {milestone.year}
                                            </div>
                                            <p className="font-sans text-gray-700 dark:text-gray-300">
                                                {milestone.event}
                                            </p>
                                        </SpotlightCard>
                                    </div>
                                    <div className="w-4 h-4 rounded-full bg-blue-500 dark:bg-blue-400 border-4 border-gray-50 dark:border-void z-10" />
                                    <div className="flex-1" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Team Section */}
                <div className="mb-24">
                    <div className="text-center max-w-3xl mx-auto mb-12">
                        <span className="font-mono text-sm text-blue-500 tracking-widest uppercase mb-2 block">
                            LEADERSHIP
                        </span>
                        <h2 className="font-serif text-4xl font-bold text-gray-900 dark:text-white">
                            Meet Our Visionaries
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {team.map((member, idx) => (
                            <SpotlightCard
                                key={idx}
                                className="group rounded-2xl border overflow-hidden bg-white border-gray-200 dark:bg-dark-800 dark:border-white/10"
                            >
                                <div className="relative h-80 overflow-hidden">
                                    <img
                                        src={member.image}
                                        alt={member.name}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                                </div>
                                <div className="p-6 -mt-24 relative z-10">
                                    <h3 className="font-serif text-xl font-bold mb-1 text-white drop-shadow-lg">
                                        {member.name}
                                    </h3>
                                    <p className="font-mono text-sm mb-2 text-blue-400 drop-shadow-lg">
                                        {member.role}
                                    </p>
                                    <p className="font-sans text-sm text-gray-300 drop-shadow-lg">
                                        {member.bio}
                                    </p>
                                </div>
                            </SpotlightCard>
                        ))}
                    </div>
                </div>

                {/* Awards Section */}
                <SpotlightCard className="p-12 rounded-2xl border text-center bg-white border-gray-200 dark:bg-dark-800 dark:border-white/10">
                    <Award size={48} className="mx-auto mb-6 text-blue-600 dark:text-blue-400" />
                    <h2 className="font-serif text-3xl font-bold mb-4 text-gray-900 dark:text-white">
                        Built for Excellence
                    </h2>
                    <p className="font-sans text-lg max-w-3xl mx-auto text-gray-700 dark:text-gray-300">
                        As a newly opened property in 2026, we've incorporated award-winning design principles, cutting-edge technology, and sustainable building practices. Our commitment to excellence has been recognized during our construction and pre-opening phases by leading architecture and hospitality organizations.
                    </p>
                </SpotlightCard>
            </div>
        </div>
    );
};

export default AboutUs;