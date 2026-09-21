import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, ArrowRight } from 'lucide-react';
import GuideCard from '../search/GuideCard';

const FeaturedGuides = ({ guides = [], onBookNow }) => {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 text-purple-800 text-xs font-bold uppercase tracking-wider mb-2 border border-purple-200">
              <Compass className="w-3.5 h-3.5 text-purple-600" /> Private Curators
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 font-display tracking-tight">
              Meet Our Certified Local Guides
            </h2>
            <p className="text-sm text-slate-500 mt-2 max-w-xl">
              Unlock secret wine cellars, private art collections, and sunrise mountain trails with resident experts.
            </p>
          </div>
          <Link
            to="/search?type=guide"
            className="mt-4 md:mt-0 inline-flex items-center gap-1.5 text-sm font-bold text-brand-600 hover:text-brand-700 group"
          >
            Browse all certified guides <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Guides Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {guides.slice(0, 4).map((guide) => (
            <GuideCard key={guide.id} guide={guide} onBookNow={onBookNow} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedGuides;
