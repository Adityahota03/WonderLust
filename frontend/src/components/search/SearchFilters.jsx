import React from 'react';
import { Filter, RotateCcw, Star, Hotel, Plane, MapPin } from 'lucide-react';

const SearchFilters = ({
  activeType,
  onTypeChange,
  priceRange,
  onPriceChange,
  minRating,
  onRatingChange,
  selectedAmenities,
  onAmenityToggle,
  sortBy,
  onSortChange,
  onReset
}) => {
  const amenitiesList = [
    'Free High-Speed WiFi',
    'Swimming Pool',
    'Spa & Wellness',
    'Complimentary Breakfast',
    'Eiffel Tower View',
    'Balcony',
    'Pet Friendly',
    'Air Conditioning'
  ];

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
          <Filter className="w-4 h-4 text-brand-600" />
          <span>Filters</span>
        </div>
        <button
          onClick={onReset}
          className="flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-brand-600 transition-colors"
        >
          <RotateCcw className="w-3 h-3" /> Reset
        </button>
      </div>

      {/* Category selector */}
      <div>
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2.5">
          Category
        </label>
        <div className="grid grid-cols-2 gap-2">
          {[
            { id: 'all', label: 'All Items' },
            { id: 'hotel', label: 'Hotels', icon: Hotel },
            { id: 'ticket', label: 'Transport', icon: Plane },
            { id: 'guide', label: 'Local Guides', icon: MapPin },
          ].map((cat) => {
            const Icon = cat.icon;
            const isSelected = activeType === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => onTypeChange(cat.id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
                  isSelected
                    ? 'bg-brand-50 border-brand-500 text-brand-700 shadow-sm'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {Icon && <Icon className="w-3.5 h-3.5 shrink-0" />}
                <span className="truncate">{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Price Range Slider */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Max Price
          </label>
          <span className="text-sm font-extrabold text-brand-600 font-mono">
            ${priceRange}
          </span>
        </div>
        <input
          type="range"
          min="50"
          max="1500"
          step="25"
          value={priceRange}
          onChange={(e) => onPriceChange(Number(e.target.value))}
          className="w-full accent-brand-600 cursor-pointer"
        />
        <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
          <span>$50</span>
          <span>$750</span>
          <span>$1500+</span>
        </div>
      </div>

      {/* Minimum Rating */}
      <div>
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">
          Minimum Rating
        </label>
        <div className="flex items-center gap-1.5">
          {[0, 4.0, 4.5, 4.8].map((score) => (
            <button
              key={score}
              type="button"
              onClick={() => onRatingChange(score)}
              className={`flex-1 py-1.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1 border transition-all ${
                minRating === score
                  ? 'bg-amber-50 border-amber-400 text-amber-800'
                  : 'border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              {score === 0 ? 'All' : `${score}+`}
            </button>
          ))}
        </div>
      </div>

      {/* Amenities (Relevant when hotels are shown) */}
      {activeType !== 'ticket' && activeType !== 'guide' && (
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2.5">
            Key Amenities
          </label>
          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {amenitiesList.map((amenity) => (
              <label
                key={amenity}
                className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer hover:text-slate-900 select-none"
              >
                <input
                  type="checkbox"
                  checked={selectedAmenities.includes(amenity)}
                  onChange={() => onAmenityToggle(amenity)}
                  className="rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                />
                <span className="truncate">{amenity}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Sorting */}
      <div>
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">
          Sort Results By
        </label>
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          className="w-full text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 focus:outline-none focus:border-brand-500"
        >
          <option value="featured">Recommended & Featured</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="rating_desc">Highest Rated</option>
        </select>
      </div>
    </div>
  );
};

export default SearchFilters;
