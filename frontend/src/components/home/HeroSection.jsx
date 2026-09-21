import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Hotel, Plane, MapPin, Calendar, Users, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { fadeUp } from '../../motion/tokens';

const HeroSection = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('hotel'); // 'hotel', 'ticket', 'guide'
  const [destination, setDestination] = useState('');
  const [dates, setDates] = useState('');
  const [guests, setGuests] = useState('2');

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    params.set('type', activeTab);
    if (destination) params.set('query', destination);
    if (guests) params.set('guests', guests);
    navigate(`/search?${params.toString()}`);
  };

  const popularSearches = ['Paris, France', 'Tokyo, Japan', 'Bali, Indonesia', 'Swiss Alps', 'Santorini'];

  return (
    <div className="relative min-h-[620px] flex items-center justify-center overflow-hidden bg-slate-900 py-16 lg:py-24">
      {/* Background Image with Ambient Gradient Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=2000&q=80"
          alt="Luxury Tropical Destination"
          className="w-full h-full object-cover object-center brightness-75 scale-105 transition-transform duration-1000 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-slate-900/60" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Pill Tag */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-semibold mb-6 shadow-glow"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>Award-Winning Global Travel Booking Platform</span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.1 }}
          className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight font-display max-w-4xl mx-auto leading-tight sm:leading-none"
        >
          Curated Stays, Fast Transit, & Authentic Local Guides.
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.2 }}
          className="mt-5 text-base sm:text-lg text-slate-200/90 max-w-2xl mx-auto font-normal leading-relaxed"
        >
          Search luxury hotels, reserve high-speed bullet trains & flights, and explore handpicked destinations with certified private guides.
        </motion.p>

        {/* Floating Search Widget */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.3 }}
          className="mt-8 sm:mt-10 max-w-4xl mx-auto"
        >
          {/* Category Tabs */}
          <div className="flex items-center justify-center sm:justify-start gap-1 p-1 bg-white/20 backdrop-blur-md rounded-2xl w-fit mx-auto sm:mx-0 mb-3 border border-white/20 shadow-lg">
            <button
              type="button"
              onClick={() => setActiveTab('hotel')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'hotel'
                  ? 'bg-white text-slate-900 shadow-md'
                  : 'text-white hover:bg-white/10'
              }`}
            >
              <Hotel className="w-3.5 h-3.5 text-brand-600" /> Hotels & Stays
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('ticket')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'ticket'
                  ? 'bg-white text-slate-900 shadow-md'
                  : 'text-white hover:bg-white/10'
              }`}
            >
              <Plane className="w-3.5 h-3.5 text-emerald-600" /> Flights & Trains
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('guide')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'guide'
                  ? 'bg-white text-slate-900 shadow-md'
                  : 'text-white hover:bg-white/10'
              }`}
            >
              <MapPin className="w-3.5 h-3.5 text-purple-600" /> Local Guides
            </button>
          </div>

          {/* Unified Search Input Form */}
          <form
            onSubmit={handleSearch}
            className="bg-white/95 backdrop-blur-md rounded-3xl p-3 sm:p-4 shadow-2xl border border-white/40 flex flex-col md:flex-row items-center gap-3 text-left"
          >
            {/* Destination Input */}
            <div className="flex-1 w-full px-3 py-1.5 rounded-2xl hover:bg-slate-50 transition-colors">
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                {activeTab === 'ticket' ? 'From or To Destination' : 'Where To?'}
              </span>
              <div className="flex items-center gap-2 mt-0.5">
                <MapPin className="w-4 h-4 text-brand-600 shrink-0" />
                <input
                  type="text"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder={
                    activeTab === 'hotel'
                      ? 'Paris, Tokyo, Bali, New York...'
                      : activeTab === 'ticket'
                      ? 'London, Paris, Tokyo, Kyoto...'
                      : 'Find a certified guide in...'
                  }
                  className="w-full text-sm font-semibold text-slate-800 placeholder-slate-400 bg-transparent focus:outline-none"
                />
              </div>
            </div>

            <div className="hidden md:block w-px h-10 bg-slate-200"></div>

            {/* Dates Input */}
            <div className="w-full md:w-48 px-3 py-1.5 rounded-2xl hover:bg-slate-50 transition-colors">
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                Travel Dates
              </span>
              <div className="flex items-center gap-2 mt-0.5">
                <Calendar className="w-4 h-4 text-brand-600 shrink-0" />
                <input
                  type="text"
                  value={dates}
                  onChange={(e) => setDates(e.target.value)}
                  placeholder="Oct 15 - Oct 20"
                  className="w-full text-sm font-semibold text-slate-800 placeholder-slate-400 bg-transparent focus:outline-none"
                />
              </div>
            </div>

            <div className="hidden md:block w-px h-10 bg-slate-200"></div>

            {/* Guests Input */}
            <div className="w-full md:w-36 px-3 py-1.5 rounded-2xl hover:bg-slate-50 transition-colors">
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                Guests
              </span>
              <div className="flex items-center gap-2 mt-0.5">
                <Users className="w-4 h-4 text-brand-600 shrink-0" />
                <select
                  value={guests}
                  onChange={(e) => setGuests(e.target.value)}
                  className="w-full text-sm font-semibold text-slate-800 bg-transparent focus:outline-none cursor-pointer"
                >
                  <option value="1">1 Guest</option>
                  <option value="2">2 Guests</option>
                  <option value="3">3 Guests</option>
                  <option value="4">4+ Guests</option>
                </select>
              </div>
            </div>

            {/* Search Submit Button */}
            <button
              type="submit"
              className="w-full md:w-auto px-8 py-4 rounded-2xl bg-brand-600 hover:bg-brand-700 active:scale-95 text-white font-bold text-sm shadow-md shadow-brand-500/25 transition-all flex items-center justify-center gap-2 shrink-0"
            >
              <Search className="w-4 h-4" />
              <span>Search</span>
            </button>
          </form>

          {/* Quick Filter Pill Suggestions */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs text-white/80">
            <span className="font-semibold text-white/60">Trending:</span>
            {popularSearches.map((dest, i) => (
              <button
                key={i}
                type="button"
                onClick={() => {
                  setDestination(dest.split(',')[0]);
                  navigate(`/search?type=${activeTab}&query=${encodeURIComponent(dest.split(',')[0])}`);
                }}
                className="px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/10 transition-colors"
              >
                {dest}
              </button>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default HeroSection;
