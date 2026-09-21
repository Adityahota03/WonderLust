import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Wifi, Sparkles, Check, ArrowRight } from 'lucide-react';
import RatingStars from '../common/RatingStars';

const HotelCard = ({ hotel, onBookNow }) => {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col sm:flex-row group">
      {/* Hotel Image */}
      <div className="sm:w-2/5 h-56 sm:h-auto relative overflow-hidden bg-slate-100 shrink-0">
        <img
          src={hotel.image_url}
          alt={hotel.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {hotel.featured && (
          <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500 text-white shadow-md flex items-center gap-1">
            <Sparkles className="w-3 h-3 fill-white" /> Featured Stay
          </div>
        )}
        <div className="absolute bottom-3 left-3 px-2 py-1 rounded-lg bg-black/60 backdrop-blur-sm text-white text-xs font-medium">
          {hotel.stars} Star Luxury
        </div>
      </div>

      {/* Hotel Details */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-2 mb-1.5">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-medium text-brand-600 mb-1">
                <MapPin className="w-3.5 h-3.5" />
                <span>{hotel.destination_name || hotel.address}</span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 group-hover:text-brand-600 transition-colors line-clamp-1 font-display">
                {hotel.name}
              </h3>
            </div>
            <RatingStars rating={hotel.rating} count={hotel.review_count} />
          </div>

          <p className="text-xs text-slate-500 line-clamp-2 mb-3 leading-relaxed">
            {hotel.tagline || hotel.description}
          </p>

          {/* Amenities Pills */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {hotel.amenities?.slice(0, 4).map((amenity, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[11px] font-medium border border-slate-200/60"
              >
                {amenity}
              </span>
            ))}
            {hotel.amenities?.length > 4 && (
              <span className="px-2 py-0.5 rounded-md bg-slate-50 text-slate-400 text-[11px] font-medium">
                +{hotel.amenities.length - 4} more
              </span>
            )}
          </div>
        </div>

        {/* Pricing & CTA */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
          <div>
            <span className="text-[11px] text-slate-400 block">Starting from</span>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-extrabold text-slate-900">
                ${hotel.starting_price}
              </span>
              <span className="text-xs text-slate-500">/ night</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to={`/hotels/${hotel.id}`}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/80 transition-colors"
            >
              View Rooms
            </Link>
            <button
              onClick={() => onBookNow && onBookNow(hotel, 'hotel')}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-brand-600 hover:bg-brand-700 text-white shadow-sm shadow-brand-500/20 transition-all flex items-center gap-1"
            >
              Reserve <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelCard;
