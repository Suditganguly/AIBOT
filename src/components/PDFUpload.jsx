import React, { useState, useRef } from 'react';
import { FaFilePdf, FaFileImage, FaUpload, FaTimes, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';

const API_URL = 'http://localhost:5000/api/upload-files';

const isImage = (file) => file.type.startsWith('image/');
const isPDF = (file) => file.type === 'application/pdf';

// Helper to format extracted text
function formatExtractedText(text) {
  if (!text) return <span className="text-neutral-400">No text extracted.</span>;
  // Split into paragraphs by double newlines or line breaks
  const paragraphs = text.split(/\n\s*\n|\r\n\s*\r\n/).filter(Boolean);
  return paragraphs.map((para, idx) => {
    // If looks like a list (lines start with dash, number, or bullet)
    const lines = para.split(/\n|\r\n/).filter(Boolean);
    const isList = lines.length > 1 && lines.every(line => /^[-•\d]/.test(line.trim()));
    if (isList) {
      return (
        <ul key={idx} className="list-disc pl-6 mb-2">
          {lines.map((line, i) => <li key={i}>{line.replace(/^[-•\d.\s]+/, '')}</li>)}
        </ul>
      );
    }
    return <p key={idx} className="mb-2 whitespace-pre-line">{para.trim()}</p>;
  });
}

function extractMedicalInfo(text) {
  const norm = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  const doctor = norm.match(/(?:Dr\.?|Vd\.?|Hakim)\s+[A-Za-z .()]+/i)?.[0]?.trim() || '';
  const qualification = norm.match(/Qualification[:\-]?\s*([A-Za-z0-9.,() ]+)/i)?.[1]?.trim() || '';
  const regNo = norm.match(/Registration No\.?[:\-]?\s*([A-Za-z0-9\/-]+)/i)?.[1]?.trim() || '';
  const patient = norm.match(/patient\s*Full Name\s*([A-Za-z .]+)/i)?.[1]?.trim() || '';
  const sex = norm.match(/Sex[:\-]?\s*([A-Za-z]+)/i)?.[1]?.trim() || '';
  const age = norm.match(/Age[:\-]?\s*(\d{1,3})/i)?.[1]?.trim() || '';
  let medicines = [];
  const rxIndex = norm.search(/\bRx\b/i);
  if (rxIndex !== -1) {
    const afterRx = norm.slice(rxIndex + 2).split('\n').map(l => l.trim()).filter(Boolean);
    medicines = afterRx.slice(0, 5).filter(line => line.length > 2);
  }
  const date = norm.match(/Date(?: of dispensing)?[:\-]?\s*([\d\/\-]+)/i)?.[1]?.trim() || '';
  const signature = norm.match(/signature(?: with date and seal)?/i)?.[0] ? 'Present' : '';
  return { doctor, qualification, regNo, patient, sex, age, medicines, date, signature };
}

const PDFUpload = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [results, setResults] = useState([]);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const dropRef = useRef();

  const handleFiles = (files) => {
    const arr = Array.from(files).filter(f => isPDF(f) || isImage(f));
    if (arr.length === 0) {
      setError('Only PDF and image files are allowed.');
      return;
    }
    setSelectedFiles(arr);
    setError('');
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    handleFiles(e.dataTransfer.files);
    dropRef.current.classList.remove('dragover');
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dropRef.current.classList.add('dragover');
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dropRef.current.classList.remove('dragover');
  };

  const handleFileInput = (e) => {
    handleFiles(e.target.files);
  };

  const removeFile = (idx) => {
    setSelectedFiles(files => files.filter((_, i) => i !== idx));
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      setError('Please select at least one PDF or image file.');
      return;
    }
    setUploading(true);
    setStatus('');
    setError('');
    setResults([]);
    const formData = new FormData();
    selectedFiles.forEach(f => formData.append('files', f));
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (data.success) {
        setResults(data.results);
        setStatus('Upload complete!');
        setSelectedFiles([]);
      } else {
        setError(data.message || 'Upload failed.');
      }
    } catch (err) {
      setError('Network error. Please check if the server is running and try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="card card-alt p-4">
      <h3 className="text-lg font-semibold mb-3 text-primary flex items-center gap-2">
        <FaUpload /> Upload Medical Documents (PDF/Image)
      </h3>
      <p className="text-sm text-neutral-600 mb-4">
        Drag and drop or select multiple PDF/image files. Text will be extracted and saved to your medical history. Files are auto-deleted after upload.
      </p>
      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-100 text-red-800 border border-red-200 flex items-center gap-2">
          <FaExclamationCircle /> {error}
        </div>
      )}
      {status && (
        <div className="mb-4 p-3 rounded-lg bg-green-100 text-green-800 border border-green-200 flex items-center gap-2">
          <FaCheckCircle /> {status}
        </div>
      )}
      {/* Drag and Drop Area */}
      <div
        ref={dropRef}
        className="border-2 border-dashed border-primary rounded-lg p-6 mb-4 text-center cursor-pointer bg-neutral-50 hover:bg-blue-50 transition relative"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => document.getElementById('file-input').click()}
        style={{ minHeight: 120 }}
      >
        <input
          id="file-input"
          type="file"
          accept=".pdf,image/*"
          multiple
          style={{ display: 'none' }}
          onChange={handleFileInput}
        />
        <div className="flex flex-col items-center justify-center h-full gap-2">
          <FaUpload className="text-3xl text-primary mb-2" />
          <span className="text-neutral-500">Drag & drop PDF or image files here, or <span className="text-primary underline">browse</span></span>
        </div>
      </div>
      {/* Selected Files Preview */}
      {selectedFiles.length > 0 && (
        <div className="mb-4">
          <div className="flex flex-wrap gap-3">
            {selectedFiles.map((file, idx) => (
              <div key={idx} className="flex items-center gap-2 bg-neutral-100 rounded px-3 py-2 border">
                {isPDF(file) ? (
                  <FaFilePdf className="text-red-500" />
                ) : (
                  <FaFileImage className="text-blue-500" />
                )}
                <span className="text-sm font-medium truncate max-w-[120px]">{file.name}</span>
                <button className="ml-2 text-red-500 hover:text-red-700" onClick={e => { e.stopPropagation(); removeFile(idx); }}>
                  <FaTimes />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
      {/* Upload Button */}
      <button
        onClick={handleUpload}
        disabled={selectedFiles.length === 0 || uploading}
        className={`btn w-full ${selectedFiles.length === 0 || uploading ? 'btn-disabled cursor-not-allowed' : 'btn-primary'}`}
      >
        {uploading ? (
          <span className="flex items-center gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            Uploading...
          </span>
        ) : (
          <span className="flex items-center gap-2"><FaUpload /> Upload</span>
        )}
      </button>
      {/* Results */}
      {results.length > 0 && (
        <div className="mt-6 space-y-4">
          <h4 className="font-semibold text-primary mb-2">Extracted Medical Info</h4>
          {results.map((res, idx) => {
            const info = extractMedicalInfo(res.text || '');
            return (
              <div key={idx} className="p-4 rounded-lg shadow border bg-white max-w-md mx-auto mb-4">
                <div className="mb-2"><span className="font-bold">Doctor:</span> {info.doctor || <span className="text-neutral-400">Not found</span>}</div>
                <div className="mb-2"><span className="font-bold">Qualification:</span> {info.qualification || <span className="text-neutral-400">Not found</span>}</div>
                <div className="mb-2"><span className="font-bold">Reg. No.:</span> {info.regNo || <span className="text-neutral-400">Not found</span>}</div>
                <div className="mb-2"><span className="font-bold">Patient:</span> {info.patient || <span className="text-neutral-400">Not found</span>}</div>
                <div className="mb-2"><span className="font-bold">Sex:</span> {info.sex || <span className="text-neutral-400">Not found</span>}</div>
                <div className="mb-2"><span className="font-bold">Age:</span> {info.age || <span className="text-neutral-400">Not found</span>}</div>
                <div className="mb-2">
                  <span className="font-bold">Medicines:</span>
                  {info.medicines.length > 0 ? (
                    <ul className="list-disc pl-6">{info.medicines.map((med, i) => <li key={i}>{med}</li>)}</ul>
                  ) : (
                    <span className="text-neutral-400 ml-2">Not found</span>
                  )}
                </div>
                <div className="mb-2"><span className="font-bold">Date:</span> {info.date || <span className="text-neutral-400">Not found</span>}</div>
                <div className="mb-2"><span className="font-bold">Signature:</span> {info.signature || <span className="text-neutral-400">Not found</span>}</div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default PDFUpload;