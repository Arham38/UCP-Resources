import React, { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { addReview, deleteReview, getCourseReviews, updateReview } from '../services/reviewService';
import StarRating from './StarRating';
import ReviewCard from './ReviewCard';

const PAGE_SIZE = 10;

const ReviewSection = ({ courseId, isEnrolled }) => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedRating, setSelectedRating] = useState(0);
  const [editingReview, setEditingReview] = useState(null);
  const [page, setPage] = useState(1);
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: { comment: '' },
  });

  const loadReviews = async () => {
    try {
      setLoading(true);
      const { data } = await getCourseReviews(courseId);
      setReviews(data.reviews || []);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!courseId) return;
    loadReviews();
  }, [courseId]);

  const ownReview = useMemo(
    () => reviews.find((r) => r.student?._id === user?._id),
    [reviews, user?._id]
  );

  const ratingSummary = useMemo(() => {
    const count = reviews.length;
    const avg = count ? reviews.reduce((sum, r) => sum + Number(r.rating || 0), 0) / count : 0;
    const breakdown = [5, 4, 3, 2, 1].map((star) => {
      const total = reviews.filter((r) => Number(r.rating) === star).length;
      return { star, total, pct: count ? Math.round((total / count) * 100) : 0 };
    });
    return { count, avg, breakdown };
  }, [reviews]);

  const paginated = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return reviews.slice(start, start + PAGE_SIZE);
  }, [reviews, page]);
  const totalPages = Math.max(1, Math.ceil(reviews.length / PAGE_SIZE));

  const onSubmit = async (values) => {
    if (!selectedRating) {
      toast.error('Please select rating');
      return;
    }
    setSaving(true);
    try {
      if (editingReview) {
        await updateReview(editingReview._id, { rating: selectedRating, comment: values.comment });
        toast.success('Review updated');
      } else {
        await addReview({ courseId, rating: selectedRating, comment: values.comment });
        toast.success('Review submitted');
      }
      reset({ comment: '' });
      setSelectedRating(0);
      setEditingReview(null);
      await loadReviews();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save review');
    } finally {
      setSaving(false);
    }
  };

  const onEdit = (review) => {
    setEditingReview(review);
    setSelectedRating(Number(review.rating || 0));
    reset({ comment: review.comment || '' });
  };

  const onDelete = async (review) => {
    if (!window.confirm('Delete your review?')) return;
    try {
      await deleteReview(review._id);
      toast.success('Review deleted');
      await loadReviews();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed');
    }
  };

  return (
    <section className="mt-5">
      <h4 className="fw-bold mb-3">Ratings & Reviews</h4>
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body">
          <div className="row g-3 align-items-center">
            <div className="col-md-4 text-center">
              <div className="display-6 fw-bold text-primary">{ratingSummary.avg.toFixed(1)}</div>
              <StarRating rating={ratingSummary.avg} readOnly size={20} />
              <div className="small text-muted mt-1">{ratingSummary.count} review(s)</div>
            </div>
            <div className="col-md-8">
              {ratingSummary.breakdown.map((b) => (
                <div key={b.star} className="d-flex align-items-center gap-2 mb-2">
                  <span className="small" style={{ width: 26 }}>{b.star}★</span>
                  <div className="progress flex-grow-1" style={{ height: 8 }}>
                    <div className="progress-bar bg-primary" style={{ width: `${b.pct}%` }} />
                  </div>
                  <span className="small text-muted" style={{ width: 40 }}>{b.pct}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {isEnrolled && (!ownReview || editingReview) && (
        <div className="card border-0 shadow-sm mb-4">
          <div className="card-body">
            <h6 className="fw-semibold mb-3">{editingReview ? 'Edit your review' : 'Add your review'}</h6>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="mb-3">
                <label className="form-label small">Rating</label>
                <div><StarRating rating={selectedRating} onRate={setSelectedRating} readOnly={false} size={22} /></div>
              </div>
              <div className="mb-3">
                <label className="form-label small">Comment</label>
                <textarea
                  className={`form-control ${errors.comment ? 'is-invalid' : ''}`}
                  rows={3}
                  {...register('comment', { maxLength: { value: 500, message: 'Maximum 500 characters' } })}
                />
                {errors.comment && <div className="invalid-feedback">{errors.comment.message}</div>}
              </div>
              <div className="d-flex gap-2">
                <button type="submit" className="btn btn-primary btn-sm" disabled={saving}>
                  {saving ? 'Saving...' : editingReview ? 'Update Review' : 'Submit Review'}
                </button>
                {editingReview && (
                  <button
                    type="button"
                    className="btn btn-outline-secondary btn-sm"
                    onClick={() => {
                      setEditingReview(null);
                      setSelectedRating(0);
                      reset({ comment: '' });
                    }}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}

      {!isEnrolled && <div className="alert alert-info small">Enroll in this course to add a review.</div>}

      {loading ? (
        <div className="text-center py-4"><div className="spinner-border text-primary" /></div>
      ) : paginated.length === 0 ? (
        <div className="alert alert-light border">No reviews yet.</div>
      ) : (
        <>
          {paginated.map((review) => (
            <ReviewCard key={review._id} review={review} onEdit={onEdit} onDelete={onDelete} />
          ))}
          {totalPages > 1 && (
            <div className="d-flex justify-content-center gap-2 mt-2">
              <button
                type="button"
                className="btn btn-sm btn-outline-secondary"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                Prev
              </button>
              <span className="small align-self-center text-muted">Page {page} / {totalPages}</span>
              <button
                type="button"
                className="btn btn-sm btn-outline-secondary"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
};

export default ReviewSection;
