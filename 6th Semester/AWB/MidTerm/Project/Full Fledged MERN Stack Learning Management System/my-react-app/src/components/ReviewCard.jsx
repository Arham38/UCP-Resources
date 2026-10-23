import React from 'react';
import { useAuth } from '../context/AuthContext';
import StarRating from './StarRating';

const ReviewCard = ({ review, onEdit, onDelete }) => {
  const { user } = useAuth();
  const own = user?._id === review?.student?._id;

  return (
    <div className="card border-0 shadow-sm mb-3">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-start gap-3">
          <div className="d-flex gap-2 align-items-center">
            <div
              className="rounded-circle d-flex align-items-center justify-content-center bg-primary text-white"
              style={{ width: 36, height: 36, fontWeight: 700 }}
            >
              {(review?.student?.name || 'U').charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="fw-semibold small">{review?.student?.name || 'Student'}</div>
              <div className="small text-muted">
                {review?.createdAt ? new Date(review.createdAt).toLocaleDateString() : ''}
              </div>
            </div>
          </div>
          <StarRating rating={review?.rating || 0} readOnly size={14} />
        </div>
        {review?.comment && <p className="mt-2 mb-0 small">{review.comment}</p>}
        {own && (
          <div className="d-flex gap-2 mt-3">
            <button type="button" className="btn btn-sm btn-outline-primary" onClick={() => onEdit?.(review)}>
              Edit
            </button>
            <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => onDelete?.(review)}>
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewCard;
