import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { verifyCertificate } from '../services/certificateService';

const VerifyCertificate = () => {
  const { certificateId } = useParams();
  const navigate = useNavigate();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, setValue, formState: { errors } } = useForm({
    defaultValues: { certificateId: certificateId || '' },
  });

  const doVerify = async (id) => {
    if (!id) return;
    setLoading(true);
    try {
      const { data } = await verifyCertificate(id);
      setResult({ valid: true, certificate: data.certificate });
    } catch (err) {
      setResult({ valid: false, message: err.response?.data?.message || 'Invalid certificate' });
      toast.error('Certificate not found');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (certificateId) doVerify(certificateId);
  }, [certificateId]);

  const onSubmit = ({ certificateId: id }) => {
    navigate(`/verify/${id.trim()}`);
  };

  return (
    <div className="container py-5" style={{ maxWidth: 760 }}>
      <h2 className="fw-bold mb-3">Verify Certificate</h2>
      <form className="card border-0 shadow-sm mb-4" onSubmit={handleSubmit(onSubmit)}>
        <div className="card-body">
          <label className="form-label">Certificate ID</label>
          <div className="input-group">
            <input
              className={`form-control ${errors.certificateId ? 'is-invalid' : ''}`}
              {...register('certificateId', { required: 'Certificate ID is required' })}
              placeholder="Enter certificate ID"
            />
            <button className="btn btn-primary" type="submit" disabled={loading}>
              {loading ? 'Verifying...' : 'Verify'}
            </button>
          </div>
          {errors.certificateId && <div className="text-danger small mt-1">{errors.certificateId.message}</div>}
        </div>
      </form>

      {result && (
        <div className={`alert ${result.valid ? 'alert-success' : 'alert-danger'}`}>
          <h6 className="fw-bold mb-2">
            {result.valid ? 'Valid Certificate' : 'Invalid Certificate'}
          </h6>
          {result.valid ? (
            <div className="small">
              <div><strong>Student:</strong> {result.certificate?.student?.name}</div>
              <div><strong>Course:</strong> {result.certificate?.course?.title}</div>
              <div><strong>Issued:</strong> {new Date(result.certificate?.issuedAt).toLocaleDateString()}</div>
              <div><strong>Certificate ID:</strong> {result.certificate?.certificateId}</div>
            </div>
          ) : (
            <div className="small">{result.message}</div>
          )}
        </div>
      )}
    </div>
  );
};

export default VerifyCertificate;
