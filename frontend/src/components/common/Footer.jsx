import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Compass, ShieldCheck, Headphones, Award, Send, Check } from 'lucide-react';

const Footer = () => {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (newsletterEmail) {
      setSubscribed(true);
      setNewsletterEmail('');
    }
  };

  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Value Proposition Badges */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-12 border-b border-slate-800 text-center md:text-left">
          <div className="flex items-center gap-4 justify-center md:justify-start">
            <div className="w-12 h-12 rounded-2xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-400 shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-semibold text-white text-base">Secure Tokenized Payments</h4>
              <p className="text-xs text-slate-400 mt-0.5">PCI-DSS compliant booking & instant confirmation</p>
            </div>
          </div>

          <div className="flex items-center gap-4 justify-center md:justify-start">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-semibold text-white text-base">Handpicked Stays & Guides</h4>
              <p className="text-xs text-slate-400 mt-0.5">Strict quality audits and verified traveler reviews</p>
            </div>
          </div>

          <div className="flex items-center gap-4 justify-center md:justify-start">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
              <Headphones className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-semibold text-white text-base">24/7 Global Concierge</h4>
              <p className="text-xs text-slate-400 mt-0.5">Dedicated travel support before, during, and after</p>
            </div>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 py-12 border-b border-slate-800">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-brand-600 flex items-center justify-center text-white">
                <Compass className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold font-display text-white tracking-tight">
                WANDERLUST
              </span>
            </Link>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              Curating exceptional journeys across the globe. Search luxury accommodations, book high-speed rail & flights, and connect with certified local guides with ease.
            </p>
            <div className="pt-2">
              <form onSubmit={handleSubscribe} className="flex gap-2 max-w-sm">
                <input
                  type="email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Enter your email for travel deals..."
                  className="bg-slate-800/80 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 flex-1"
                  required
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-sm font-medium transition-colors flex items-center gap-1.5 shrink-0"
                >
                  {subscribed ? <Check className="w-4 h-4" /> : <Send className="w-4 h-4" />}
                  {subscribed ? 'Joined' : 'Join'}
                </button>
              </form>
              {subscribed && (
                <p className="text-xs text-emerald-400 mt-1.5">Welcome! You will receive our weekly travel inspirations.</p>
              )}
            </div>
          </div>

          {/* Column 1: Explore */}
          <div>
            <h5 className="text-sm font-semibold text-white uppercase tracking-wider mb-4 font-display">
              Explore
            </h5>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>
                <Link to="/search?type=hotel" className="hover:text-brand-400 transition-colors">
                  Luxury Hotels & Resorts
                </Link>
              </li>
              <li>
                <Link to="/search?type=ticket" className="hover:text-brand-400 transition-colors">
                  High-Speed Trains & Flights
                </Link>
              </li>
              <li>
                <Link to="/search?type=guide" className="hover:text-brand-400 transition-colors">
                  Certified Local Guides
                </Link>
              </li>
              <li>
                <Link to="/search" className="hover:text-brand-400 transition-colors">
                  Interactive Destination Map
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Popular Destinations */}
          <div>
            <h5 className="text-sm font-semibold text-white uppercase tracking-wider mb-4 font-display">
              Destinations
            </h5>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>
                <Link to="/search?destination=Paris" className="hover:text-brand-400 transition-colors">
                  Paris, France
                </Link>
              </li>
              <li>
                <Link to="/search?destination=Tokyo" className="hover:text-brand-400 transition-colors">
                  Tokyo, Japan
                </Link>
              </li>
              <li>
                <Link to="/search?destination=Bali" className="hover:text-brand-400 transition-colors">
                  Bali, Indonesia
                </Link>
              </li>
              <li>
                <Link to="/search?destination=Swiss+Alps" className="hover:text-brand-400 transition-colors">
                  Swiss Alps (Zermatt)
                </Link>
              </li>
              <li>
                <Link to="/search?destination=Santorini" className="hover:text-brand-400 transition-colors">
                  Santorini, Greece
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Company */}
          <div>
            <h5 className="text-sm font-semibold text-white uppercase tracking-wider mb-4 font-display">
              Company
            </h5>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>
                <Link to="/about" className="hover:text-brand-400 transition-colors">
                  About Our Platform
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-brand-400 transition-colors">
                  Contact Support & FAQs
                </Link>
              </li>
              <li>
                <Link to="/bookings" className="hover:text-brand-400 transition-colors">
                  My Bookings
                </Link>
              </li>
              <li>
                <span className="text-slate-500 cursor-not-allowed">Partner Portal (v2)</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 Wanderlust Travel Inc. All rights reserved. Built with React & Python Flask.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-slate-400 transition-colors cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-400 transition-colors cursor-pointer">Terms of Service</span>
            <span className="hover:text-slate-400 transition-colors cursor-pointer">Security Standards</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
