import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getCourses } from '../services/courseService';
import CourseCard from '../components/CourseCard';
import Loader from '../components/Loader';

const CATEGORIES = ['All', 'Programming', 'Design', 'Marketing', 'Business', 'Data Science'];
const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'title', label: 'A–Z' },
];

const Courses = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState(searchParams.get('q') || '');
  const [category, setCategory] = useState(searchParams.get('category') || 'All');
  const [sort, setSort] = useState('newest');
  const [priceMax, setPriceMax] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await getCourses();
        setCourses(data.courses || []);
      } catch {
        setError('Failed to load courses');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // Sync URL params
  useEffect(() => {
    const params = {};
    if (search) params.q = search;
    if (category && category !== 'All') params.category = category;
    setSearchParams(params, { replace: true });
  }, [search, category]);

  const filtered = courses
    .filter((c) => {
      const matchSearch =
        !search ||
        c.title?.toLowerCase().includes(search.toLowerCase()) ||
        c.description?.toLowerCase().includes(search.toLowerCase()) ||
        c.instructor?.name?.toLowerCase().includes(search.toLowerCase());
      const matchCategory = category === 'All' || c.category === category;
      const matchPrice = !priceMax || c.price <= parseFloat(priceMax);
      return matchSearch && matchCategory && matchPrice;
    })
    .sort((a, b) => {
      if (sort === 'price-asc') return a.price - b.price;
      if (sort === 'price-desc') return b.price - a.price;
      if (sort === 'title') return a.title.localeCompare(b.title);
      return new Date(b.createdAt) - new Date(a.createdAt); // newest
    });

  if (loading) return <Loader />;

  return (
    <div className="container py-5">
      {/* Header */}
      <div className="mb-4">
        <h1 className="fw-bold mb-1">All Courses</h1>
        <p className="text-muted">{filtered.length} course{filtered.length !== 1 ? 's' : ''} available</p>
      </div>

      {/* Search + Sort */}
      <div className="row g-3 mb-4">
        <div className="col-md-6">
          <div className="input-group">
            <span className="input-group-text"><i className="bi bi-search" /></span>
            <input
              type="text"
              className="form-control"
              placeholder="Search courses, instructors..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button className="btn btn-outline-secondary" onClick={() => setSearch('')}>
                <i className="bi bi-x" />
              </button>
            )}
          </div>
        </div>
        <div className="col-md-3">
          <select className="form-select" value={sort} onChange={(e) => setSort(e.target.value)}>
            {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
        <div className="col-md-3">
          <div className="input-group">
            <span className="input-group-text">Max $</span>
            <input
              type="number"
              className="form-control"
              placeholder="Any price"
              min={0}
              value={priceMax}
              onChange={(e) => setPriceMax(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Category tabs */}
      <div className="d-flex flex-wrap gap-2 mb-4">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            className={`btn btn-sm ${category === cat ? 'btn-primary' : 'btn-outline-secondary'}`}
            onClick={() => setCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {filtered.length === 0 ? (
        <div className="text-center py-5">
          <i className="bi bi-search display-4 text-muted mb-3 d-block" />
          <h5 className="fw-bold">No courses found</h5>
          <p className="text-muted">Try adjusting your search or filters.</p>
          <button className="btn btn-outline-primary" onClick={() => { setSearch(''); setCategory('All'); setPriceMax(''); }}>
            Clear Filters
          </button>
        </div>
      ) : (
        <motion.div
          className="row g-4"
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
        >
          {filtered.map((course) => (
            <motion.div
              key={course._id}
              className="col-md-6 col-lg-4"
              variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } }}
            >
              <CourseCard course={course} />
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default Courses;
