import { Star } from "lucide-react";
import { useState } from "react";

interface StarRatingProps {
  value: number;
  onChange: (v: number) => void;
}

export function StarRating({ value, onChange }: StarRatingProps) {
  const [hovered, setHovered] = useState(0);
  const active = hovered || value;

  return (
    <div className="flex gap-1" onMouseLeave={() => setHovered(0)}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          data-ocid={`survey.star.${star}` as string}
          className="p-0.5 transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
          onMouseEnter={() => setHovered(star)}
          onClick={() => onChange(star)}
          aria-label={`Rate ${star} out of 5`}
        >
          <Star
            className={`w-9 h-9 transition-colors ${
              star <= active
                ? "fill-star text-star"
                : "fill-transparent text-star-empty"
            }`}
          />
        </button>
      ))}
    </div>
  );
}
