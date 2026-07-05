import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { uploadCSV } from '../services/api';
import { Toast } from '../components/Toast';
import { 
  UploadCloud, 
  FileSpreadsheet, 
  CheckCircle2, 
  X, 
  Play, 
  AlertCircle, 
  Loader2,
  FileCheck2,
  Cpu
} from 'lucide-react';

export const Upload = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('idle'); // idle, uploading, success, error
  const [uploadResult, setUploadResult] = useState(null);
  
  const [toastMessage, setToastMessage] = useState(null);
  const [toastType, setToastType] = useState('success');

  const showToast = (msg, type = 'success') => {
    setToastMessage(msg);
    setToastType(type);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndProcessFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      validateAndProcessFile(e.target.files[0]);
    }
  };

  const validateAndProcessFile = async (selectedFile) => {
    // Check extension
    if (!selectedFile.name.endsWith('.csv')) {
      showToast('Unsupported file format. Please upload a valid CSV file.', 'error');
      setUploadStatus('error');
      return;
    }

    setFile(selectedFile);
    setIsUploading(true);
    setUploadStatus('uploading');
    setUploadProgress(0);

    try {
      const result = await uploadCSV(selectedFile, (progress) => {
        setUploadProgress(progress);
      });
      
      setUploadStatus('success');
      setUploadResult(result);
      showToast('Superstore CSV parsed and uploaded successfully!', 'success');
    } catch (err) {
      setUploadStatus('error');
      showToast(err.message || 'File upload failed. Ensure the CSV conforms to the Superstore schema.', 'error');
    } finally {
      setIsUploading(false);
    }
  };

  const clearFile = () => {
    setFile(null);
    setUploadProgress(0);
    setUploadStatus('idle');
    setUploadResult(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const triggerEtlPipeline = () => {
    if (uploadStatus !== 'success') return;
    // Navigate to Pipeline Status page and start it automatically
    navigate('/pipeline-status?start=true');
  };

  return (
    <div className="space-y-7 max-w-4xl mx-auto animate-fade-in">
      
      {/* Page Header */}
      <div className="flex flex-col space-y-1">
        <h1 className="text-2xl font-extrabold tracking-tight text-fabric-text-light dark:text-fabric-text-dark">
          Ingestion Gateway
        </h1>
        <p className="text-xs text-fabric-text-secondary-light dark:text-fabric-text-secondary-dark font-medium">
          Load new retail transaction records into the Lakehouse Bronze tables.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-7 md:grid-cols-3">
        {/* Upload Container (2/3 width on desktop) */}
        <div className="md:col-span-2 space-y-5">
          <div 
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            className={`relative flex flex-col items-center justify-center rounded-3xl border-2 border-dashed p-10 text-center transition-all duration-300 ${
              dragActive 
                ? 'border-brand-blue bg-brand-blue/5 dark:border-brand-orange dark:bg-brand-orange/5' 
                : 'border-fabric-border-light bg-fabric-card-light dark:border-fabric-border-dark dark:bg-fabric-card-dark'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="hidden"
              id="csv-file-upload"
            />

            {uploadStatus === 'idle' && (
              <>
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-blue/10 text-brand-blue dark:bg-brand-orange/10 dark:text-brand-orange mb-5 animate-pulse-slow">
                  <UploadCloud className="h-7 w-7" />
                </div>
                <h3 className="font-display text-sm font-bold text-fabric-text-light dark:text-fabric-text-dark">
                  Drag and drop your superstore CSV here
                </h3>
                <p className="mt-1 text-xs text-fabric-text-secondary-light dark:text-fabric-text-secondary-dark">
                  Files must be formatted as SampleSuperstore data (Max 15MB)
                </p>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="mt-6 rounded-xl bg-brand-blue/10 hover:bg-brand-blue/15 px-5 py-2.5 text-xs font-bold text-brand-blue dark:bg-brand-orange/10 dark:hover:bg-brand-orange/15 dark:text-brand-orange transition-all hover:scale-105 active:scale-95"
                >
                  Select CSV File
                </button>
              </>
            )}

            {uploadStatus === 'uploading' && (
              <div className="w-full max-w-sm py-4 space-y-4">
                <FileSpreadsheet className="mx-auto h-12 w-12 text-brand-blue dark:text-brand-orange animate-bounce" />
                <div className="space-y-1">
                  <p className="text-xs font-bold text-fabric-text-light dark:text-fabric-text-dark truncate">
                    Uploading {file?.name}
                  </p>
                  <p className="text-[10px] text-fabric-text-secondary-light dark:text-fabric-text-secondary-dark">
                    ({(file?.size / 1024).toFixed(1)} KB)
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-fabric-border-dark overflow-hidden">
                    <div 
                      className="h-full rounded-full bg-gradient-to-r from-brand-blue to-brand-teal dark:from-brand-orange dark:to-brand-yellow transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                  <span className="text-[10px] font-bold text-brand-blue dark:text-brand-orange uppercase">
                    {uploadProgress}% Complete
                  </span>
                </div>
              </div>
            )}

            {uploadStatus === 'success' && (
              <div className="py-4 space-y-4">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-500 dark:bg-emerald-950/30 dark:text-emerald-400">
                  <CheckCircle2 className="h-8 w-8" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-display text-sm font-bold text-fabric-text-light dark:text-fabric-text-dark">
                    Upload Successful
                  </h3>
                  <p className="text-xs text-fabric-text-secondary-light dark:text-fabric-text-secondary-dark truncate max-w-md">
                    File: <span className="font-semibold text-fabric-text-light dark:text-fabric-text-dark">{uploadResult?.fileName}</span>
                  </p>
                  <p className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                    {uploadResult?.rowsProcessed} new retail transaction rows parsed and loaded.
                  </p>
                </div>
                <button
                  onClick={clearFile}
                  className="rounded-xl border border-fabric-border-light bg-gray-50 dark:border-fabric-border-dark dark:bg-fabric-bg-dark px-4 py-2 text-xs font-semibold text-fabric-text-light dark:text-fabric-text-dark hover:bg-gray-100 transition-all"
                >
                  Upload Another File
                </button>
              </div>
            )}

            {uploadStatus === 'error' && (
              <div className="py-4 space-y-4">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-rose-50 text-rose-500 dark:bg-rose-950/30 dark:text-rose-400">
                  <AlertCircle className="h-8 w-8" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-display text-sm font-bold text-fabric-text-light dark:text-fabric-text-dark">
                    Format Verification Failed
                  </h3>
                  <p className="text-xs text-rose-600 dark:text-rose-400 max-w-sm mx-auto leading-normal">
                    Invalid CSV headers detected. Schema must precisely map: Region, Category, Sales, Profit, Discount, Quantity, State, City.
                  </p>
                </div>
                <button
                  onClick={clearFile}
                  className="rounded-xl bg-rose-600 hover:bg-rose-500 px-4 py-2 text-xs font-bold text-white shadow-md transition-all"
                >
                  Try Again
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Action Panel (1/3 width on desktop) */}
        <div className="space-y-6">
          {/* ETL execution triggering */}
          <div className="rounded-3xl border border-fabric-border-light bg-fabric-card-light p-6 shadow-sm dark:border-fabric-border-dark dark:bg-fabric-card-dark transition-all duration-300">
            <h3 className="font-display text-sm font-bold text-fabric-text-light dark:text-fabric-text-dark">
              ETL Pipelines
            </h3>
            <p className="mt-2 text-xs leading-normal text-fabric-text-secondary-light dark:text-fabric-text-secondary-dark">
              Once data is uploaded to raw container storage, you must trigger the Databricks ETL Pipeline to build updated Gold aggregate tables.
            </p>

            <div className="mt-6 space-y-3.5">
              <button
                onClick={triggerEtlPipeline}
                disabled={uploadStatus !== 'success'}
                className="flex w-full items-center justify-center space-x-2.5 rounded-xl bg-gradient-to-r from-brand-blue to-brand-teal py-3.5 text-xs font-bold text-white shadow-lg hover:shadow-xl hover:opacity-95 dark:from-brand-orange dark:to-brand-yellow disabled:opacity-40 disabled:cursor-not-allowed transition-all disabled:-translate-y-0 hover:-translate-y-0.5"
              >
                <Cpu className="h-4.5 w-4.5" />
                <span>Trigger ETL Pipeline</span>
              </button>
              
              {uploadStatus !== 'success' && (
                <p className="text-[10px] text-center text-gray-400 dark:text-gray-500 font-semibold">
                  ⚠️ Complete a successful file upload first
                </p>
              )}
            </div>
          </div>

          {/* Superstore CSV Instructions */}
          <div className="rounded-3xl border border-fabric-border-light bg-fabric-card-light p-6 shadow-sm dark:border-fabric-border-dark dark:bg-fabric-card-dark transition-all duration-300">
            <h3 className="font-display text-sm font-bold text-fabric-text-light dark:text-fabric-text-dark">
              Validation Rules
            </h3>
            <ul className="mt-3.5 space-y-2.5 text-xs text-fabric-text-secondary-light dark:text-fabric-text-secondary-dark">
              <li className="flex items-center space-x-2.5">
                <FileCheck2 className="h-4 w-4 text-emerald-500" />
                <span>CSV File Extension (.csv)</span>
              </li>
              <li className="flex items-center space-x-2.5">
                <FileCheck2 className="h-4 w-4 text-emerald-500" />
                <span>Headers (UTF-8 encoding)</span>
              </li>
              <li className="flex items-center space-x-2.5">
                <FileCheck2 className="h-4 w-4 text-emerald-500" />
                <span>Columns conform to Superstore</span>
              </li>
              <li className="flex items-center space-x-2.5">
                <FileCheck2 className="h-4 w-4 text-emerald-500" />
                <span>Max size 15 MB limit</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Toast alert */}
      {toastMessage && (
        <Toast 
          message={toastMessage} 
          type={toastType} 
          onClose={() => setToastMessage(null)} 
        />
      )}
    </div>
  );
};
export default Upload;
