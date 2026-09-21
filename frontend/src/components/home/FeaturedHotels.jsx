import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight } from 'lucide-react';
import HotelCard from '../search/HotelCard';

const FeaturedHotels = ({ hotels = [], onBookNow }) => {
  return (
    <section className="py-20 bg-slate-50 border-y border-slate-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-bold uppercase tracking-wider mb-2 border border-amber-200">
              <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-500" /> Handpicked Luxury
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 font-display tracking-tight">
              Featured Stays & World-Class Resorts
            </h2>
            <p className="text-sm text-slate-500 mt-2 max-w-xl">
              Immerse yourself in extraordinary architecture, private infinity pools, and Michelin-starred dining.
            </p>
          </div>
          <Link
            to="/search?type=hotel"
            className="mt-4 md:mt-0 inline-flex items-center gap-1.5 text-sm font-bold text-brand-600 hover:text-brand-700 group"
          >
            View all 20+ hotels <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Hotels Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {hotels.slice(0, 4).map((hotel) => (
            <HotelCard key={hotel.id} hotel={hotel} onBookNow={onBookNow} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedHotels;
