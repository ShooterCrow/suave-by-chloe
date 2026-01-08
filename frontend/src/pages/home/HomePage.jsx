import React from 'react'
import Hero from './Hero'
import RoomHighlights from './RoomHighlights'
import AmenitiesHighlights from './AmenitiesHighlights'
import SpecialOffers from './SpecialOffers'
import Testimonials from './Testimonials'
import { Helmet } from 'react-helmet-async'


const HomePage = () => {
    return (
        <>
            <Helmet>
                <title>Suave By Chloe Hotel</title>
                <meta
                    name="description"
                    content="Suave By Chloe is a luxury hotel in Kubwa, Abuja, offering stylish rooms, fine dining, event spaces, and exceptional comfort in Nigeria’s capital."
                />
                <meta property="og:title" content="Suave By Chloe" />
                <meta
                    property="og:description"
                    content="Suave By Chloe is a luxury hotel in Kubwa, Abuja, offering stylish rooms, fine dining, event spaces, and exceptional comfort in Nigeria’s capital."
                />
                <meta property="og:type" content="website" />
            </Helmet>

            <Hero />
            <div className="relative min-h-screen bg-gray-50 dark:bg-black">
                <RoomHighlights />
                <AmenitiesHighlights />
                <Testimonials />
                <SpecialOffers />
            </div>
        </>
    )
}

export default HomePage
