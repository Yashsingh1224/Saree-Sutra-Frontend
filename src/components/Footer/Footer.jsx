import React from 'react';

// --- SVG Icons for Social Links ---
// Using icons is cleaner and more professional than text links.

const InstagramIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

const FacebookIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
  </svg>
);

const WhatsAppIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
  </svg>
);

const ArrowRightIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
  </svg>
);


export default function Footer() {
  return (
    <footer className="bg-gray-800 text-gray-300 font-['Poppins'] select-none">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20">

        {/* --- Newsletter Section --- */}
        <div className="py-12 border-b border-gray-700">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="text-center lg:text-left">
              <h2 className="text-3xl font-['Yatra One'] font-bold text-white">Stay in the Loop</h2>
              <p className="mt-2 text-gray-400">Get the latest on new arrivals, special offers, and saree stories.</p>
            </div>
            <form className="w-full max-w-md flex">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-4 py-3 text-white bg-gray-700 border border-gray-600 rounded-l-full focus:outline-none focus:ring-2 focus:ring-amber-500 placeholder:text-gray-400"
                aria-label="Email for newsletter"
              />
              <button
                type="submit"
                className="bg-amber-600 hover:bg-amber-700 text-white px-5 py-3 rounded-r-full transition-colors"
                aria-label="Subscribe to newsletter"
              >
                <ArrowRightIcon />
              </button>
            </form>
          </div>
        </div>

        {/* --- Main Footer Grid --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 py-12">

          {/* Branding Column */}
          <div className="sm:col-span-2 lg:col-span-2">
            <h1 className="text-2xl font-['Yatra One'] font-extrabold text-white mb-3">
              Fabrix
            </h1>
            <p className="max-w-xs text-gray-400 leading-relaxed font-medium">
              Embrace tradition and celebrate modernity with our exquisite sarees. Handpicked for elegance and style.
            </p>
          </div>

          {/* Navigation Links Columns */}
          <div>
            <h3 className="font-semibold text-white mb-4 tracking-wider">Shop</h3>
            <ul className="space-y-3">
              <li><a href="/shop" className="hover:text-amber-400 transition-colors">All Sarees</a></li>
              <li><a href="/categories/banarasi" className="hover:text-amber-400 transition-colors">Banarasi</a></li>
              <li><a href="/categories/kanjivaram" className="hover:text-amber-400 transition-colors">Kanjivaram</a></li>
              <li><a href="/categories/chiffon" className="hover:text-amber-400 transition-colors">Chiffon</a></li>
              <li><a href="/categories/silk" className="hover:text-amber-400 transition-colors">Silk</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4 tracking-wider">Company</h3>
            <ul className="space-y-3">
              <li><a href="/about" className="hover:text-amber-400 transition-colors">About Us</a></li>
              <li><a href="/contact" className="hover:text-amber-400 transition-colors">Contact</a></li>
              <li><a href="/faq" className="hover:text-amber-400 transition-colors">FAQ</a></li>
              <li><a href="/policies" className="hover:text-amber-400 transition-colors">Policies</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4 tracking-wider">Support</h3>
            <ul className="space-y-3">
              <li><a href="/shipping" className="hover:text-amber-400 transition-colors">Shipping</a></li>
              <li><a href="/returns" className="hover:text-amber-400 transition-colors">Returns</a></li>
              <li><a href="/care-instructions" className="hover:text-amber-400 transition-colors">Care</a></li>
            </ul>
          </div>

        </div>

        {/* --- Bottom Bar with Social Links & Copyright --- */}
        <div className="py-6 border-t border-gray-700 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm font-medium">
            &copy; {new Date().getFullYear()} Fabrix. All Rights Reserved.
          </p>
          <div className="flex gap-5">
            <a href="#" className="text-gray-500 hover:text-amber-400 transition-colors" aria-label="Instagram"><InstagramIcon /></a>
            <a href="#" className="text-gray-500 hover:text-amber-400 transition-colors" aria-label="Facebook"><FacebookIcon /></a>
            <a href="#" className="text-gray-500 hover:text-amber-400 transition-colors" aria-label="WhatsApp"><WhatsAppIcon /></a>
          </div>
        </div>
      </div>
    </footer>
  );
}