import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { addToWishlist, getMyWishlist, removeFromWishlist } from '../services/wishlistService';

const WishlistButton = ({ courseId, className = '' }) => {
  const { user } = useAuth();
  const [wishlisted, setWishlisted] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      if (!user || user.role !== 'student' || !courseId) return;
      try {
        const { data } = await getMyWishlist();
        setWishlisted((data.courses || []).some((c) => c._id === courseId));
      } catch {
        // silently ignore
      }
    };
    load();
  }, [courseId, user]);

  if (!user || user.role !== 'student') return null;

  const toggle = async () => {
    if (loading) return;
    const next = !wishlisted;
    setWishlisted(next);
    setLoading(true);
    try {
      if (next) {
        await addToWishlist(courseId);
        toast.success('Added to wishlist');
      } else {
        await removeFromWishlist(courseId);
        toast.success('Removed from wishlist');
      }
    } catch (err) {
      setWishlisted(!next);
      toast.error(err.response?.data?.message || 'Wishlist update failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      className={`btn btn-sm ${wishlisted ? 'btn-primary' : 'btn-outline-secondary'} ${className}`}
      onClick={toggle}
      disabled={loading}
      title={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
    >
      <i className={`bi ${wishlisted ? 'bi-heart-fill' : 'bi-heart'}`} />
    </button>
  );
};

export default WishlistButton;
