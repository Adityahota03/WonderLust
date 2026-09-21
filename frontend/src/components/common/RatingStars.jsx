import React from 'react';
import { Star } from 'lucide-react';

const RatingStars = ({ rating = 5, size = 16, showScore = true, count = null }) => {
  const fullStars = Math.floor(rating);
  const hasHalf = rating % 1 >= 0.4;

  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center text-amber-400">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={size}
            className={`${
              i < fullStars
                ? 'fill-amber-400 text-amber-400'
                : i === fullStars && hasHalf
                ? 'fill-amber-400/50 text-amber-400'
                : 'text-slate-300'
            }`}
          />
        ))}
      </div>
      {showScore && (
        <span className="text-xs font-semibold text-slate-800 tracking-tight">
          {Number(rating).toFixed(1)}
        </span>
      )}
      {count !== null && (
        <span className="text-xs text-slate-500">
          ({count})
        </span>
      )}
    </div>
  );
};

export default RatingStars;
