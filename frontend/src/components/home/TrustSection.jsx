import React from 'react';
import { Star, ShieldCheck, HeartHandshake, Zap, Globe2 } from 'lucide-react';

const TrustSection = () => {
  const testimonials = [
    {
      name: 'Victoria Hastings',
      location: 'London, United Kingdom',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      role: 'Luxury Travel Journalist',
      quote: 'Wanderlust transformed how we booked our anniversary in Paris. The hotel balcony view was beyond breathtaking, and booking the private Louvre art guide was seamless.',
      rating: 5
    },
    {
      name: 'Daisuke Takahashi',
      location: 'Tokyo, Japan',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      role: 'Architect & Explorer',
      quote: 'Being able to book both high-speed Shinkansen tickets and an intimate ryokan stay in Kyoto with one single checkout saved me hours of coordination.',
      rating: 5
    },
    {
      name: 'Clara Mendez',
      location: 'Barcelona, Spain',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
      role: 'Photographer',
      quote: 'The interactive map preview and transparent itemized pricing gave me complete confidence. No hidden fees, instant confirmations, and responsive support.',
      rating: 5
    }
  ];

  return (
    <section className="py-20 bg-slate-900 text-white relative overflow-hidden">
      {/* Background Subtle Glows */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Statistics Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pb-16 border-b border-slate-800 text-center">
          <div>
            <p className="text-3xl sm:text-4xl font-black font-display text-white">120K+</p>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">Trips Confirmed</p>
          </div>
          <div>
            <p className="text-3xl sm:text-4xl font-black font-display text-brand-400">4.9 / 5.0</p>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">Verified Traveler Reviews</p>
          </div>
          <div>
            <p className="text-3xl sm:text-4xl font-black font-display text-emerald-400">100%</p>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">Direct & Atomic Booking</p>
          </div>
          <div>
            <p className="text-3xl sm:text-4xl font-black font-display text-white">24 / 7</p>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">Human Concierge Desk</p>
          </div>
        </div>

        {/* Testimonials Header */}
        <div className="text-center mt-16 mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-400 bg-brand-500/10 px-3 py-1 rounded-full border border-brand-500/20">
            Real Stories
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-white font-display mt-3">
            Loved by Travelers Globally
          </h2>
        </div>

        {/* Testimonial Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, idx) => (
            <div
              key={idx}
              className="p-6 rounded-3xl bg-slate-800/60 border border-slate-700/80 backdrop-blur-md flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-1 text-amber-400 mb-4">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-slate-300 italic leading-relaxed mb-6">
                  "{t.quote}"
                </p>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-slate-700/50">
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="w-10 h-10 rounded-full object-cover border border-slate-600"
                />
                <div>
                  <h4 className="text-sm font-bold text-white">{t.name}</h4>
                  <p className="text-xs text-slate-400">{t.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustSection;
