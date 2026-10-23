import React from 'react';

const StarRating = ({ rating = 0, onRate, size = 16, readOnly = true }) => {
  const stars = [1, 2, 3, 4, 5];

  return (
    <div className="d-inline-flex align-items-center gap-1">
      {stars.map((value) => {
        const filled = rating >= value;
        const half = !filled && rating >= value - 0.5;
        return (
          <button
            key={value}
            type="button"
            className="btn p-0 border-0 bg-transparent"
            style={{
              cursor: readOnly || !onRate ? 'default' : 'pointer',
              fontSize: size,
              lineHeight: 1,
              color: filled || half ? '#7C3AED' : '#9CA3AF',
            }}
            onClick={() => (!readOnly && onRate ? onRate(value) : null)}
            disabled={readOnly || !onRate}
            aria-label={`${value} star`}
          >
            <i className={`bi ${half ? 'bi-star-half' : filled ? 'bi-star-fill' : 'bi-star'}`} />
          </button>
        );
      })}
    </div>
  );
};

export default StarRating;
