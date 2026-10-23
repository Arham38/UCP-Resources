import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import Loader from '../../../components/Loader';
import { getMyWishlist, removeFromWishlist } from '../../../services/wishlistService';

const MyWishlist = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removing, setRemoving] = useState(null);

  const load = async () => {
    try {
      const { data } = await getMyWishlist();
      setCourses(data.courses || []);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to load wishlist');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const removeItem = async (courseId) => {
    setRemoving(courseId);
    try {
      await removeFromWishlist(courseId);
      setCourses((prev) => prev.filter((c) => c._id !== courseId));
      toast.success('Removed from wishlist');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to remove');
    } finally {
      setRemoving(null);
    }
  };

  if (loading) return <Loader />;

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
      <h2 className="fw-bold mb-4">My Wishlist</h2>
      {courses.length === 0 ? (
        <div className="card border-0 shadow-sm text-center py-5">
          <div className="card-body">
            <i className="bi bi-heart display-4 text-muted mb-3 d-block" />
            <h5 className="fw-bold">Wishlist is empty</h5>
            <p className="text-muted">Save courses to revisit later.</p>
            <Link to="/courses" className="btn btn-primary">Browse Courses</Link>
          </div>
        </div>
      ) : (
        <div className="row g-3">
          {courses.map((course) => (
            <div key={course._id} className="col-md-6 col-lg-4">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body d-flex flex-column">
                  <h6 className="fw-bold">{course.title}</h6>
                  <p className="small text-muted mb-2">{course.category} · ${course.price}</p>
                  <p className="small text-muted mb-3">Instructor: {course.instructor?.name || 'N/A'}</p>
                  <div className="mt-auto d-flex gap-2">
                    <Link to={`/course/${course._id}`} className="btn btn-primary btn-sm flex-grow-1">
                      View & Enroll
                    </Link>
                    <button
                      className="btn btn-outline-danger btn-sm"
                      disabled={removing === course._id}
                      onClick={() => removeItem(course._id)}
                    >
                      {removing === course._id ? '...' : 'Remove'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default MyWishlist;
