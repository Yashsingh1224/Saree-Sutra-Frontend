import React, { useState, useEffect, useRef } from 'react';

// A custom hook to detect when an element is in the viewport (same as before)
const useInView = (options) => {
    const ref = useRef(null);
    const [isInView, setIsInView] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                setIsInView(true);
                observer.unobserve(entry.target);
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

// SVG Icons for the Contact Page
const MailIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
);

const PhoneIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
    </svg>
);

const LocationIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);


export default function ContactUs() {
    // Refs for animating sections
    const [headerRef, headerInView] = useInView({ threshold: 0.1 });
    const [formCardRef, formCardInView] = useInView({ threshold: 0.1 });
    const [mapRef, mapInView] = useInView({ threshold: 0.1 });

    const handleSubmit = (e) => {
        e.preventDefault();
        // In a real application, you would handle form submission here.
        // For example, using a service like Formspree, or sending data to your backend API.
        alert("Thank you for your message! We will get back to you shortly.");
        e.target.reset();
    };

    return (
        <div className="bg-gradient-to-br from-amber-50 via-white to-pink-50 min-h-screen font-['Poppins']">
            {/* --- Page Header --- */}
            <div ref={headerRef} className={`transition-all duration-1000 ${headerInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'} text-center pt-24 pb-16 md:pt-32 md:pb-20`}>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold font-['Yatra One'] tracking-wide text-amber-800">
                    Get In Touch
                </h1>
                <p className="mt-4 text-lg text-gray-700 max-w-2xl mx-auto">
                    We'd love to hear from you! Whether you have a question about our sarees, an order, or just want to say hello, feel free to reach out.
                </p>
            </div>

            {/* --- Main Contact Section --- */}
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-16 md:pb-24">
                <div ref={formCardRef} className={`transition-all duration-1000 ${formCardInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'} bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-amber-100 overflow-hidden`}>
                    <div className="grid md:grid-cols-2">
                        {/* --- Contact Information Column --- */}
                        <div className="p-8 md:p-12 bg-amber-50/50">
                            <h2 className="text-3xl font-bold font-['Yatra One'] text-amber-800">Contact Information</h2>
                            <p className="mt-3 text-gray-600">Fill up the form and our team will get back to you within 24 hours.</p>

                            <div className="mt-8 space-y-6">
                                <div className="flex items-center gap-4 text-pink-800 hover:text-amber-700 transition-colors">
                                    <PhoneIcon />
                                    <a href="tel:+911234567890" className="text-gray-700 font-semibold">+91 12345 67890</a>
                                </div>
                                <div className="flex items-center gap-4 text-pink-800 hover:text-amber-700 transition-colors">
                                    <MailIcon />
                                    <a href="mailto:hello@fabrix.com" className="text-gray-700 font-semibold">hello@fabrix.com</a>
                                </div>
                                <div className="flex items-start gap-4 text-pink-800">
                                    <LocationIcon className="mt-1 flex-shrink-0" />
                                    <p className="text-gray-700 font-semibold">
                                        Misraspatti, Uttarakhand,<br />
                                        India, 249201
                                    </p>
                                </div>
                            </div>

                            <div className="mt-8 pt-6 border-t border-amber-200">
                                <h3 className="font-bold text-lg text-pink-800">Business Hours</h3>
                                <p className="mt-2 text-gray-600">Monday - Friday: 10am - 6pm</p>
                                <p className="text-gray-600">Saturday: 11am - 4pm</p>
                                <p className="text-gray-600">Sunday: Closed</p>
                            </div>

                        </div>

                        {/* --- Contact Form Column --- */}
                        <div className="p-8 md:p-12">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                                    <input type="text" id="name" name="name" required className="w-full p-3 bg-white/50 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 transition-shadow" />
                                </div>
                                <div>
                                    <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                                    <input type="email" id="email" name="email" required className="w-full p-3 bg-white/50 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 transition-shadow" />
                                </div>
                                <div>
                                    <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2">Message</label>
                                    <textarea id="message" name="message" rows="5" required className="w-full p-3 bg-white/50 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 transition-shadow"></textarea>
                                </div>
                                <div>
                                    <button
                                        type="submit"
                                        className="w-full bg-pink-600 text-white px-6 py-3 rounded-full text-lg hover:bg-pink-700 transition-transform hover:scale-105 duration-300 font-semibold select-none shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2"
                                    >
                                        Send Message
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}