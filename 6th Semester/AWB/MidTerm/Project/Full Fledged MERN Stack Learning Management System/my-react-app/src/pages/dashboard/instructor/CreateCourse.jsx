import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { createCourse } from '../../../services/courseService';
import toast from 'react-hot-toast';

const CATEGORIES = ['Programming', 'Design', 'Marketing', 'Business', 'Data Science', 'Other'];

const compressImageFile = (file, maxWidth = 1280, quality = 0.8) =>
  new Promise((resolve, reject) => {
    const img = new Image();
    const reader = new FileReader();
    reader.onload = (e) => { img.src = e.target.result; };
    reader.onerror = () => reject(new Error('Failed to read image'));
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const scale = Math.min(1, maxWidth / img.width);
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      canvas.toBlob(
        (blob) => {
          if (!blob) return reject(new Error('Failed to compress image'));
          const compressed = new File([blob], file.name.replace(/\.(png|jpg|jpeg|gif)$/i, '.jpg'), {
            type: 'image/jpeg',
          });
          resolve(compressed);
        },
        'image/jpeg',
        quality
      );
    };
    img.onerror = () => reject(new Error('Invalid image file'));
    reader.readAsDataURL(file);
  });

const CreateCourse = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Programming',
    price: '',
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleImageChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!/^image\/(jpeg|jpg|png|gif|webp)$/i.test(file.type)) {
      setError('Please upload a valid image (jpg, png, gif, webp).');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be less than 5MB.');
      return;
    }
    try {
      const optimizedFile = await compressImageFile(file);
      setImageFile(optimizedFile);
      setImagePreview(URL.createObjectURL(optimizedFile));
      setError('');
    } catch {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description || !formData.category || formData.price === '') {
      setError('All fields are required');
      return;
    }
    setLoading(true);
    setUploadProgress(0);
    setError('');
    try {
      const data = new FormData();
      data.append('title', formData.title);
      data.append('description', formData.description);
      data.append('category', formData.category);
      data.append('price', formData.price);
      if (imageFile) data.append('image', imageFile);
      await createCourse(data, {
        onUploadProgress: (evt) => {
          if (!evt.total) return;
          setUploadProgress(Math.round((evt.loaded * 100) / evt.total));
        },
      });
      toast.success('Course created successfully!');
      navigate('/instructor/courses');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create course');
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <h2 className="fw-bold mb-4">Create New Course</h2>

      <div className="row g-4">
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm">
            <div className="card-body p-4">
              {error && <div className="alert alert-danger">{error}</div>}
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="title" className="form-label fw-semibold">Course Title <span className="text-danger">*</span></label>
                  <input
                    type="text"
                    className="form-control"
                    id="title"
                    name="title"
                    placeholder="e.g. Complete React Developer Course"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    minLength={5}
                    maxLength={100}
                  />
                  <div className="form-text">{formData.title.length}/100</div>
                </div>

                <div className="mb-3">
                  <label htmlFor="description" className="form-label fw-semibold">Description <span className="text-danger">*</span></label>
                  <textarea
                    className="form-control"
                    id="description"
                    name="description"
                    rows={6}
                    placeholder="Describe what students will learn in this course..."
                    value={formData.description}
                    onChange={handleChange}
                    required
                    minLength={20}
                  />
                  <div className="form-text">{formData.description.length} characters (min 20)</div>
                </div>

                <div className="row g-3 mb-3">
                  <div className="col-md-6">
                    <label htmlFor="category" className="form-label fw-semibold">Category <span className="text-danger">*</span></label>
                    <select
                      className="form-select"
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                    >
                      {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="price" className="form-label fw-semibold">Price (USD) <span className="text-danger">*</span></label>
                    <div className="input-group">
                      <span className="input-group-text">$</span>
                      <input
                        type="number"
                        className="form-control"
                        id="price"
                        name="price"
                        min={0}
                        step={0.01}
                        placeholder="0.00"
                        value={formData.price}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="form-text">Set to 0 for a free course</div>
                  </div>
                </div>

                <div className="mb-4">
                  <label htmlFor="image" className="form-label fw-semibold">Course Thumbnail</label>
                  <input
                    type="file"
                    className="form-control"
                    id="image"
                    accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                    onChange={handleImageChange}
                  />
                  <div className="form-text">Max 5MB. JPG, PNG, GIF, or WebP.</div>
                </div>

                <div className="d-flex gap-2">
                  <button type="submit" className="btn btn-primary px-4" disabled={loading}>
                    {loading ? (
                      <><span className="spinner-border spinner-border-sm me-2" />Creating...</>
                    ) : (
                      <><i className="bi bi-check-circle me-2" />Create Course</>
                    )}
                  </button>
                  <button type="button" className="btn btn-outline-secondary" onClick={() => navigate('/instructor/courses')}>
                    Cancel
                  </button>
                </div>
                {loading && (
                  <div className="mt-3">
                    <div className="progress" style={{ height: 8 }}>
                      <div className="progress-bar progress-bar-striped progress-bar-animated" style={{ width: `${uploadProgress}%` }} />
                    </div>
                    <div className="form-text text-center">Uploading... {uploadProgress}%</div>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>

        {/* Preview */}
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-transparent fw-semibold">Preview</div>
            <div
              className="bg-secondary d-flex align-items-center justify-content-center overflow-hidden"
              style={{ height: 180 }}
            >
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <i className="bi bi-image text-white" style={{ fontSize: '3rem', opacity: 0.4 }} />
              )}
            </div>
            <div className="card-body">
              <h6 className="fw-bold mb-1">{formData.title || 'Course Title'}</h6>
              <p className="text-muted small mb-2">{formData.category}</p>
              <p className="text-muted small mb-3" style={{ fontSize: 12 }}>
                {formData.description
                  ? formData.description.slice(0, 100) + (formData.description.length > 100 ? '...' : '')
                  : 'Course description will appear here...'}
              </p>
              <span className="fw-bold text-primary fs-5">
                {formData.price !== '' ? `$${formData.price}` : '$0.00'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CreateCourse;
