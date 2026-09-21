import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, ArrowRight, Star } from 'lucide-react';

const FeaturedDestinations = ({ destinations = [] }) => {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 text-brand-700 text-xs font-bold uppercase tracking-wider mb-2">
              <MapPin className="w-3.5 h-3.5" /> Iconic Escapes
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 font-display tracking-tight">
              Popular Global Destinations
            </h2>
            <p className="text-sm text-slate-500 mt-2 max-w-xl">
              From romantic cobblestone alleys to secluded volcanic beaches and snowcapped alpine summits.
            </p>
          </div>
          <Link
            to="/search"
            className="mt-4 md:mt-0 inline-flex items-center gap-1.5 text-sm font-bold text-brand-600 hover:text-brand-700 group"
          >
            Explore all destinations <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Destination Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {destinations.slice(0, 6).map((dest) => (
            <Link
              key={dest.id}
              to={`/search?destination=${encodeURIComponent(dest.name)}`}
              className="group relative h-80 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col justify-end p-6 border border-slate-100"
            >
              {/* Background Image */}
              <img
                src={dest.image_url}
                alt={dest.name}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
              />
              {/* Dark Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent" />

              {/* Badges on Top */}
              <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-10">
                <span className="px-2.5 py-1 rounded-full bg-white/80 backdrop-blur-md text-slate-900 text-xs font-bold shadow-sm">
                  {dest.country}
                </span>
                <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-md text-amber-400 text-xs font-bold">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  <span>{dest.rating}</span>
                </div>
              </div>

              {/* Content */}
              <div className="relative z-10 text-white">
                <h3 className="text-2xl font-black font-display tracking-tight group-hover:text-brand-300 transition-colors">
                  {dest.name}
                </h3>
                <p className="text-xs text-slate-300 line-clamp-2 mt-1 leading-relaxed">
                  {dest.description}
                </p>
                <div className="mt-3 pt-3 border-t border-white/20 flex items-center justify-between text-xs text-slate-300 font-medium">
                  <span>{dest.hotel_count || 4} Luxury Stays</span>
                  <span className="flex items-center gap-1 text-brand-300 font-semibold group-hover:translate-x-0.5 transition-transform">
                    Explore <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedDestinations;
