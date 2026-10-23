import React, { useState } from 'react';
import { getImageUrl } from '../utils/imageUrl';

/**
 * CourseImage component with built-in error handling
 * Displays a fallback icon if the image fails to load
 */
const CourseImage = ({ 
  src, 
  alt = 'Course', 
  style = {}, 
  className = '',
  fallbackIcon = 'bi-image',
  fallbackSize = '3rem'
}) => {
  const [imageError, setImageError] = useState(false);

  if (!src || imageError) {
    return (
      <i 
        className={`bi ${fallbackIcon} text-white`} 
        style={{ fontSize: fallbackSize, opacity: 0.5 }} 
      />
    );
  }

  return (
    <img
      src={getImageUrl(src)}
      alt={alt}
      style={style}
      className={className}
      onError={() => setImageError(true)}
    />
  );
};

export default CourseImage;
