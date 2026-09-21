import React from 'react';
import { Award, Languages, MapPin, ArrowRight, ShieldCheck } from 'lucide-react';
import RatingStars from '../common/RatingStars';

const GuideCard = ({ guide, onBookNow }) => {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-md transition-all duration-300 p-5 flex flex-col sm:flex-row gap-5 group">
      {/* Guide Portrait */}
      <div className="sm:w-36 h-40 sm:h-auto relative overflow-hidden rounded-xl bg-slate-100 shrink-0">
        <img
          src={guide.photo_url}
          alt={guide.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {guide.is_verified && (
          <div className="absolute top-2 right-2 p-1 rounded-full bg-emerald-500 text-white shadow-md" title="Verified Certified Guide">
            <ShieldCheck className="w-3.5 h-3.5" />
          </div>
        )}
      </div>

      {/* Guide Info */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-2 mb-1">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-brand-600 mb-0.5">
                <MapPin className="w-3.5 h-3.5" />
                <span>{guide.destination_name || 'Local Expert'}, {guide.country}</span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 group-hover:text-brand-600 transition-colors font-display">
                {guide.name}
              </h3>
              <p className="text-xs font-medium text-slate-600 mb-2">{guide.title}</p>
            </div>
            <RatingStars rating={guide.rating} count={guide.review_count} />
          </div>

          <p className="text-xs text-slate-500 line-clamp-2 mb-3 leading-relaxed">
            {guide.bio}
          </p>

          {/* Languages & Specialties */}
          <div className="space-y-1.5 mb-3">
            <div className="flex items-center gap-1.5 text-xs text-slate-600">
              <Languages className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="truncate">{guide.languages?.join(', ')}</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {guide.specialties?.map((spec, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 text-[11px] font-medium border border-purple-200/60"
                >
                  {spec}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Pricing & CTA */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
          <div>
            <span className="text-[11px] text-slate-400 block">Full day tour rate</span>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black text-slate-900 font-display">
                ${guide.daily_rate}
              </span>
              <span className="text-xs text-slate-500">/ day</span>
            </div>
          </div>

          <button
            onClick={() => onBookNow && onBookNow(guide, 'guide')}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-brand-600 hover:bg-brand-700 text-white shadow-sm shadow-brand-500/20 transition-all flex items-center gap-1.5"
          >
            Book Guide <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default GuideCard;
