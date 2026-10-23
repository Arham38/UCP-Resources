import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import Loader from '../../../components/Loader';
import CertificateTemplate from '../../../components/CertificateTemplate';
import { getMyCertificates } from '../../../services/certificateService';

const MyCertificates = () => {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await getMyCertificates();
        setCertificates(data.certificates || []);
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to load certificates');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <Loader />;

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
      <h2 className="fw-bold mb-4">My Certificates</h2>
      {certificates.length === 0 ? (
        <div className="card border-0 shadow-sm text-center py-5">
          <div className="card-body">
            <i className="bi bi-award display-4 text-muted mb-3 d-block" />
            <h5 className="fw-bold">No certificates yet</h5>
            <p className="text-muted mb-0">Complete a course to unlock certificates.</p>
          </div>
        </div>
      ) : (
        <div className="row g-3">
          {certificates.map((cert) => (
            <div key={cert._id} className="col-md-6">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body">
                  <h6 className="fw-bold mb-1">{cert.course?.title}</h6>
                  <p className="text-muted small mb-2">Issued: {new Date(cert.issuedAt).toLocaleDateString()}</p>
                  <p className="small mb-3">ID: <code>{cert.certificateId}</code></p>
                  <div className="d-flex gap-2">
                    <button className="btn btn-primary btn-sm" onClick={() => setSelected(cert)}>View</button>
                    <a className="btn btn-outline-secondary btn-sm" href={`/verify/${cert.certificateId}`}>Verify</a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {selected && (
        <div className="mt-4">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <h5 className="fw-bold mb-0">Certificate Preview</h5>
            <button className="btn btn-outline-secondary btn-sm" onClick={() => setSelected(null)}>Close</button>
          </div>
          <CertificateTemplate certificate={selected} />
        </div>
      )}
    </motion.div>
  );
};

export default MyCertificates;
