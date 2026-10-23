import React, { useRef } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const CertificateTemplate = ({ certificate }) => {
  const certRef = useRef(null);

  const downloadPdf = async () => {
    if (!certRef.current) return;
    const canvas = await html2canvas(certRef.current, { scale: 2, backgroundColor: '#ffffff' });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('landscape', 'mm', 'a4');
    pdf.addImage(imgData, 'PNG', 10, 10, 277, 190);
    pdf.save(`certificate-${certificate?.certificateId || 'lms'}.pdf`);
  };

  const verifyUrl = `${window.location.origin}/verify/${certificate?.certificateId}`;

  return (
    <div>
      <div ref={certRef} className="p-4 rounded border bg-white text-dark" style={{ maxWidth: 900 }}>
        <div
          className="rounded p-4"
          style={{ border: '8px solid #7C3AED', background: 'linear-gradient(180deg, #F8F5FF 0%, #FFF7ED 100%)' }}
        >
          <div className="text-center mb-3">
            <h2 className="fw-bold mb-1" style={{ color: '#6D28D9' }}>LMS Certificate of Completion</h2>
            <p className="mb-0">This certifies that</p>
          </div>
          <h3 className="text-center fw-bold mb-2" style={{ color: '#111827' }}>
            {certificate?.student?.name || 'Student'}
          </h3>
          <p className="text-center mb-1">has successfully completed the course</p>
          <h4 className="text-center fw-bold mb-4" style={{ color: '#6D28D9' }}>
            {certificate?.course?.title}
          </h4>
          <div className="row small">
            <div className="col-md-6">
              <div><strong>Completion Date:</strong> {new Date(certificate?.issuedAt).toLocaleDateString()}</div>
              <div><strong>Instructor:</strong> {certificate?.course?.instructor?.name || 'N/A'}</div>
            </div>
            <div className="col-md-6 text-md-end">
              <div><strong>Certificate ID:</strong> {certificate?.certificateId}</div>
              <div><strong>Verify:</strong> {verifyUrl}</div>
            </div>
          </div>
        </div>
      </div>
      <button type="button" className="btn btn-primary mt-3" onClick={downloadPdf}>
        <i className="bi bi-download me-1" />Download as PDF
      </button>
    </div>
  );
};

export default CertificateTemplate;
