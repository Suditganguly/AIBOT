import React, { useState, useEffect } from 'react';
import { useUser } from '../context/UserContext';
import { FaFileMedicalAlt, FaSpinner, FaExclamationCircle, FaCalendarAlt } from 'react-icons/fa';

// A robust card for displaying structured medical data
const StructuredDataCard = ({ data }) => {
  if (!data || Object.keys(data).length === 0) {
    return <p className="text-neutral-500 text-sm">No structured data could be extracted.</p>;
  }

  return (
    <div className="text-sm space-y-2">
      {data.patientName && <div><span className="font-bold">Patient:</span> {data.patientName}</div>}
      {data.date && <div><span className="font-bold">Date:</span> {data.date}</div>}
      {data.diagnosis && (
        <div>
          <span className="font-bold">Diagnosis:</span>{' '}
          {/* Make rendering robust: handle both string and object for diagnosis */}
          {typeof data.diagnosis === 'object' && data.diagnosis !== null
            ? [data.diagnosis.condition, data.diagnosis.description].filter(Boolean).join(' - ') || 'N/A'
            : data.diagnosis || 'N/A'}
        </div>
      )}
      {data.prescribedMedicines && data.prescribedMedicines.length > 0 && (
        <div>
          <span className="font-bold">Medicines:</span>
          <ul className="list-disc pl-6 mt-1">
            {data.prescribedMedicines.map((med, i) => (
              <li key={i}>
                {med.name || 'Unknown Medicine'}
                {med.dosage && ` - ${med.dosage}`}
                {med.frequency && ` (${med.frequency})`}
              </li>
            ))}
          </ul>
        </div>
      )}
      {data.followUpInstructions && <div><span className="font-bold">Follow-up:</span> {data.followUpInstructions}</div>}
    </div>
  );
};

const MedicalHistory = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedDocument, setSelectedDocument] = useState(null); // New state for modal
  const { userData } = useUser();

  useEffect(() => {
    const fetchRecords = async () => {
      if (!userData?.profile?.email) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        setError('');
        const res = await fetch(`http://localhost:5000/api/documents/user/${userData.profile.email}`);
        const data = await res.json();

        if (res.ok && data.success) {
          console.log('Fetched medical history:', data.documents);
          setDocuments(data.documents);
        } else {
          throw new Error(data.error || 'Failed to fetch medical history.');
        }
      } catch (err) {
        console.error('Error fetching medical history:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRecords();
  }, [userData.profile.email]); // Dependency on user's email

  if (loading) {
    return <div className="flex items-center justify-center p-4 text-neutral-500"><FaSpinner className="animate-spin mr-2" /> Loading history...</div>;
  }

  if (error) {
    return <div className="flex items-center p-4 text-red-600"><FaExclamationCircle className="mr-2" /> Error: {error}</div>;
  }

  if (documents.length === 0) {
    return <p className="text-center text-neutral-500 p-4">No medical documents found. Upload a document to see your history.</p>;
  }

  return (
    <>
      <div className="space-y-3">
        {documents.map(doc => (
          <div
            key={doc.id}
            className="p-3 rounded-lg border bg-neutral-50 hover:bg-blue-50 hover:border-primary cursor-pointer transition-all"
            onClick={() => setSelectedDocument(doc)} // Set selected doc on click
          >
            <div className="flex justify-between items-center">
              <h5 className="font-semibold text-md text-primary truncate flex items-center gap-2">
                <FaFileMedicalAlt /> {doc.originalFilename}
              </h5>
              <span className="text-xs text-neutral-500 flex items-center gap-1">
                <FaCalendarAlt />{' '}
                {doc.createdAt && doc.createdAt._seconds
                  ? new Date(doc.createdAt._seconds * 1000).toLocaleDateString()
                  : doc.createdAt
                  ? new Date(doc.createdAt).toLocaleDateString()
                  : 'No date'}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Detail View Modal */}
      {selectedDocument && (
        <div
          className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 animate-fadeIn"
          onClick={() => setSelectedDocument(null)} // Close on overlay click
        >
          <div
            className="card card-gradient max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 animate-slideInUp"
            onClick={e => e.stopPropagation()} // Prevent closing when clicking inside the card
          >
            <div className="flex justify-between items-center border-b pb-3 mb-4">
              <h3 className="text-xl font-bold text-primary truncate">{selectedDocument.originalFilename}</h3>
              <button onClick={() => setSelectedDocument(null)} className="text-neutral-500 hover:text-red-500 text-2xl">&times;</button>
            </div>
            <StructuredDataCard data={selectedDocument} />
          </div>
        </div>
      )}
    </>
  );
};

export default MedicalHistory;