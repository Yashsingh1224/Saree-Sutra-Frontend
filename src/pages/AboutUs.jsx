import React, { useState, useEffect, useRef } from 'react';

// A custom hook to detect when an element is in the viewport
const useInView = (options) => {
    const ref = useRef(null);
    const [isInView, setIsInView] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                setIsInView(true);
                observer.unobserve(entry.target); // Stop observing once in view
            }
        }, options);

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => {
            if (ref.current) {
                observer.unobserve(ref.current);
            }
        };
    }, [ref, options]);

    return [ref, isInView];
};


// SVG Icons - no changes needed
const HandIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-amber-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.63 2.18a14.98 14.98 0 00-5.84 7.38m5.84 2.58a6 6 0 01-5.84-7.38m5.84 7.38a6 6 0 015.84 7.38m-5.84-7.38L15.59 14.37" />
    </svg>
);

const HeartIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-amber-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>
);

const SparklesIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-amber-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.293 2.293a1 1 0 010 1.414L10 16l-4-4 6.293-6.293a1 1 0 011.414 0z" />
    </svg>
);

export default function AboutUs() {
    // Refs for each section we want to animate
    const [introSectionRef, introInView] = useInView({ threshold: 0.1 });
    const [missionSectionRef, missionInView] = useInView({ threshold: 0.1 });
    const [valuesSectionRef, valuesInView] = useInView({ threshold: 0.1 });
    const [ctaSectionRef, ctaInView] = useInView({ threshold: 0.1 });

    return (
        <div className="bg-gradient-to-br from-amber-50 via-white to-pink-50 min-h-screen font-['Poppins']">
            {/* --- New Introduction Section (Replaced old Hero) --- */}
            <div className="relative pt-24 pb-16 md:pt-32 md:pb-24 flex items-center justify-center text-center text-gray-800 px-4">
                {/* Background image remains fixed for elegance */}
                <div
                    className="absolute inset-0 bg-cover bg-center bg-fixed"
                    style={{ backgroundImage: "url('https://images.pexels.com/photos/10356950/pexels-photo-10356950.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1')" }}
                ></div>
                {/* A softer overlay for better text readability */}
                <div className="absolute inset-0 bg-white/70 backdrop-blur-sm"></div>

                <div ref={introSectionRef} className={`relative transition-all duration-1000 ${introInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'} max-w-4xl mx-auto`}>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold font-['Yatra One'] tracking-wide text-amber-800">
                        Our Journey of Threads
                    </h1>
                    <p className="mt-6 text-lg md:text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
                        At Fabrix, we believe every saree is a story – a narrative of rich heritage, intricate craftsmanship, and timeless beauty. We are dedicated to bringing these stories from the looms of India directly to your wardrobe.
                    </p>
                    <div className="mt-8 h-2 w-32 bg-gradient-to-r from-pink-400 to-amber-400 rounded-full mx-auto" />
                </div>
            </div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 space-y-20">

                {/* --- Our Story Section --- */}
                <section ref={missionSectionRef} className={`transition-all duration-1000 ${missionInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'} grid grid-cols-1 md:grid-cols-2 gap-12 items-center`}>
                    <div className="order-2 md:order-1">
                        <h2 className="text-3xl md:text-4xl font-bold text-amber-800 font-['Yatra One']">The Heart of Our Craft</h2>
                        <div className="mt-2 h-1.5 w-20 bg-gradient-to-r from-pink-400 to-amber-400 rounded-full" />
                        <p className="mt-6 text-gray-600 leading-relaxed">
                            Our journey began with a simple love for the Saree — a garment that is more than just clothing; it's a canvas of art, a symbol of grace, and a treasured piece of our heritage. We wanted to create a space where every woman could find a Saree that tells her story.
                        </p>
                        <p className="mt-4 text-gray-600 leading-relaxed">
                            We travel to the heart of India's weaving communities, building relationships with master artisans to bring you authentic, handcrafted pieces that you will cherish for a lifetime. Every fold, every pattern, every hue reflects centuries of tradition passed down through generations.
                        </p>
                    </div>
                    <div className="order-1 md:order-2 flex justify-center items-center">
                        <img
                            src="https://images.pexels.com/photos/8118676/pexels-photo-8118676.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                            alt="Hands of a weaver on a loom"
                            // Adjusted image sizing: max-w-md for smaller screens, w-full for flex.
                            // h-auto to maintain aspect ratio, object-cover to fill container without distortion.
                            className="rounded-2xl shadow-2xl max-w-sm md:max-w-md w-full h-auto object-cover transform transition-transform duration-500 hover:scale-105"
                        />
                    </div>
                </section>

                {/* --- Our Values Section --- */}
                <section ref={valuesSectionRef} className={`transition-all duration-1000 ${valuesInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                    <div className="text-center">
                        <h2 className="text-3xl md:text-4xl font-bold text-amber-800 font-['Yatra One']">What We Stand For</h2>
                        <div className="mt-2 h-1.5 w-20 bg-gradient-to-r from-pink-400 to-amber-400 rounded-full mx-auto" />
                    </div>
                    <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                        <div className="bg-white/70 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-amber-100 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">
                            <div className="flex justify-center mb-4"><HandIcon /></div>
                            <h3 className="text-xl font-bold text-pink-800">Authentic Craftsmanship</h3>
                            <p className="mt-2 text-gray-600">Every saree is sourced directly from skilled artisans, ensuring genuine quality and supporting traditional art forms.</p>
                        </div>
                        <div className="bg-white/70 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-amber-100 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">
                            <div className="flex justify-center mb-4"><HeartIcon /></div>
                            <h3 className="text-xl font-bold text-pink-800">Ethical & Sustainable</h3>
                            <p className="mt-2 text-gray-600">We are committed to fair trade practices and sustainable sourcing, empowering our weavers and respecting our planet.</p>
                        </div>
                        <div className="bg-white/70 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-amber-100 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">
                            <div className="flex justify-center mb-4"><SparklesIcon /></div>
                            <h3 className="text-xl font-bold text-pink-800">Timeless Elegance</h3>
                            <p className="mt-2 text-gray-600">We curate collections that blend classic designs with contemporary style, offering sarees that are both beautiful and versatile.</p>
                        </div>
                    </div>
                </section>

                {/* --- Call to Action Section --- */}
                <section ref={ctaSectionRef} className={`transition-all duration-1000 ${ctaInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'} text-center bg-white/50 rounded-2xl shadow-lg p-10 md:p-16 border border-amber-100`}>
                    <h2 className="text-3xl md:text-4xl font-bold text-amber-800 font-['Yatra One']">
                        Discover Your Perfect Saree
                    </h2>
                    <p className="mt-4 max-w-2xl mx-auto text-gray-600">
                        Explore our exquisite collection and find the perfect saree that resonates with your spirit. Experience the magic of handcrafted elegance and become a part of our weaving story.
                    </p>
                    <button
                        onClick={() => window.location.href = '/shop'} // Or use React Router's useNavigate
                        className="mt-8 inline-block bg-pink-600 text-white px-8 py-3 rounded-full text-lg hover:bg-pink-700 transition-transform hover:scale-105 duration-300 font-semibold select-none shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2"
                    >
                        Explore The Collection
                    </button>
                </section>

            </div>
        </div>
    );
}