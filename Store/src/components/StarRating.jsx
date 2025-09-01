import React from "react";
import { Star } from "lucide-react";

const StarRating = ({
  rating,
  onRate,
  readonly = false,
  size = 20,
  showValue = true,
  className = "",
}) => {
  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => !readonly && onRate && onRate(star)}
          disabled={readonly}
          className={`transition-all duration-300 transform hover:scale-110 ${
            readonly ? "cursor-default" : "cursor-pointer hover:drop-shadow-lg"
          } ${
            star <= rating
              ? "text-amber-400 drop-shadow-md hover:text-amber-300"
              : "text-slate-300 hover:text-amber-300"
          }`}
        >
          <Star size={size} className={star <= rating ? "fill-current" : ""} />
        </button>
      ))}
      {showValue && rating > 0 && (
        <span className="ml-2 text-sm font-semibold text-slate-700 bg-slate-100 px-2 py-1 rounded-lg">
          {rating}/5
        </span>
      )}
    </div>
  );
};

export default StarRating;
