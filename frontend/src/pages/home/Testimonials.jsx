import React from 'react';
import HorizontalScrollCarousel, { MobileHorizontalScroll } from '../../components/motion/HorizontalScrollCarousel';
import { Quote } from 'lucide-react';

import SpotlightCard from '../../components/ui/SpotlightCard';

const testimonialsData = [
    {
        name: "Sarah Thompson",
        role: "Luxury Traveler",
        text: "Suave By Chloe exceeded all my expectations. From the moment we arrived, the service was impeccable. The island suite was breathtaking, offering views I'll never forget.",
        image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
        background: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
    },
    {
        name: "James Carter",
        role: "Business Executive",
        text: "I travel frequently for business, and this is by far the best hotel I've stayed in. The high-speed internet, quiet workspace, and premium amenities made my trip both productive and relaxing.",
        image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
        background: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
    },
    {
        name: "Emily Rodriguez",
        role: "Honeymooner",
        text: "We chose this hotel for our honeymoon, and it was perfect. The romantic dinner by the pool, the couple's spa treatment, and the privacy of our villa were magical.",
        image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
        background: "https://images.unsplash.com/photo-1540541338287-41700207dee6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
    },
    {
        name: "David Miller",
        role: "Family Vacation",
        text: "Traveling with kids can be stressful, but the staff here made it so easy. The kids' club was fantastic, and the family suite gave us plenty of space. We will definitely be back.",
        image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
        background: "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
    },
    {
        name: "Michael Chen",
        role: "Solo Traveler",
        text: "A true sanctuary. The attention to detail in the design and the curated experiences made my solo trip incredibly fulfilling and rejuvenating.",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
        background: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
    }
];

const Testimonials = () => {
    const renderCard = (testimonial) => (
        <SpotlightCard
            className="max-h-[400px] min-h-[350px] w-[350px] p-8 flex flex-col justify-between group bg-white border-gray-300 dark:bg-gray-900 dark:border-white/20"
        >
            {/* Subtle Background Image with hover zoom */}
            {/* <div
                className="absolute inset-0 opacity-[0.04] group-hover:opacity-[0.08] transition-all duration-700 bg-cover bg-center group-hover:scale-110"
                style={{ backgroundImage: `url(${testimonial.background})` }}
            /> */}

            {/* Content */}
            <div className="relative z-10">
                <Quote className="mb-6 text-blue-500" size={40} strokeWidth={1.5} />
                <p className="text-lg leading-relaxed mb-6 font-light font-sans line-clamp-4 text-gray-800 dark:text-gray-200">
                    "{testimonial.text}"
                </p>
            </div>

            <div className="relative z-10 flex items-center gap-4 mt-auto">
                <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-blue-500"
                />
                <div>
                    <h4 className="font-serif font-bold text-gray-900 dark:text-white">
                        {testimonial.name}
                    </h4>
                    <span className="text-sm font-mono text-gray-600 dark:text-gray-400">
                        {testimonial.role}
                    </span>
                </div>
            </div>
        </SpotlightCard>
    );

    return (
        <div className="py-5 bg-gray-50 dark:bg-void">
            <div className="mt-12 text-center">
                <span className="font-mono text-sm text-blue-500 tracking-widest uppercase mb-2 block">
                    03 // SOCIAL PROOF
                </span>
            </div>
            <HorizontalScrollCarousel
                title="Client Testimonials"
                items={testimonialsData}
                renderItem={renderCard}
            />
            <MobileHorizontalScroll
                title="Client Testimonials"
                items={testimonialsData}
                renderItem={renderCard}
            />
        </div>
    );
};

export default Testimonials;

