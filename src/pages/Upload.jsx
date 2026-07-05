import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { uploadCSV, getDatasets, deleteDataset, resetLakehouse } from '../services/api';
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
  Cpu,
  Database,
  Trash2,
  RotateCcw
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
  
  const [datasets, setDatasets] = useState([]);
  const [loadingDatasets, setLoadingDatasets] = useState(false);

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
      fetchDatasets();
    } catch (err) {
      setUploadStatus('error');
      showToast(err.message || 'File upload failed. Ensure the CSV conforms to the Superstore schema.', 'error');
    } finally {
      setIsUploading(false);
    }
  };

  const fetchDatasets = async () => {
    setLoadingDatasets(true);
    try {
      const data = await getDatasets();
      setDatasets(data);
    } catch (err) {
      console.error('Error fetching datasets:', err);
    } finally {
      setLoadingDatasets(false);
    }
  };

  const handleDeleteDataset = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete "${name}" from the Lakehouse? This will delete all its rows from Bronze and Gold tables.`)) {
      try {
        await deleteDataset(id);
        showToast(`Dataset "${name}" successfully deleted from the catalog.`, 'success');
        fetchDatasets();
      } catch (err) {
        showToast('Failed to delete dataset.', 'error');
      }
    }
  };

  const handleResetLakehouse = async () => {
    if (window.confirm('Are you sure you want to restore the Lakehouse to its default baseline? This will delete ALL uploaded datasets and revert the Gold tables to the initial 250 records.')) {
      try {
        await resetLakehouse();
        showToast('Lakehouse successfully restored to system default baseline.', 'success');
        fetchDatasets();
      } catch (err) {
        showToast('Failed to reset Lakehouse.', 'error');
      }
    }
  };

  useEffect(() => {
    fetchDatasets();
  }, []);

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

      {/* Lakehouse Catalog Table */}
      <div className="rounded-3xl border border-fabric-border-light bg-fabric-card-light p-6 shadow-sm dark:border-fabric-border-dark dark:bg-fabric-card-dark transition-all duration-300">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-fabric-border-light pb-4 dark:border-fabric-border-dark mb-5 gap-3">
          <div className="flex items-center space-x-2.5">
            <Database className="h-5 w-5 text-brand-blue dark:text-brand-orange" />
            <div>
              <h3 className="font-display text-sm font-bold text-fabric-text-light dark:text-fabric-text-dark">
                Data Lakehouse Catalog (Delta Tables Status)
              </h3>
              <p className="text-[11px] text-fabric-text-secondary-light dark:text-fabric-text-secondary-dark font-medium mt-0.5">
                Delta Lake status of uploaded transaction files in storage layers.
              </p>
            </div>
          </div>
          <button
            onClick={handleResetLakehouse}
            className="flex items-center space-x-2 rounded-xl border border-rose-200 bg-rose-50/30 hover:bg-rose-50 px-3.5 py-2 text-xs font-semibold text-rose-600 dark:border-rose-950/45 dark:bg-rose-950/10 dark:text-rose-400 dark:hover:bg-rose-950/20 transition-all shadow-sm"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Restore Default Warehouse</span>
          </button>
        </div>

        {loadingDatasets ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-brand-blue dark:text-brand-orange" />
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-fabric-border-light dark:border-fabric-border-dark animate-fade-in">
            <table className="w-full border-collapse text-left text-xs">
              <thead>
                <tr className="border-b border-fabric-border-light bg-gray-50 dark:border-fabric-border-dark dark:bg-fabric-bg-dark/60">
                  <th className="px-5 py-3 font-semibold text-fabric-text-secondary-light dark:text-fabric-text-secondary-dark">Dataset / File</th>
                  <th className="px-5 py-3 font-semibold text-fabric-text-secondary-light dark:text-fabric-text-secondary-dark">Lakehouse Stage</th>
                  <th className="px-5 py-3 font-semibold text-fabric-text-secondary-light dark:text-fabric-text-secondary-dark text-right">Rows</th>
                  <th className="px-5 py-3 font-semibold text-fabric-text-secondary-light dark:text-fabric-text-secondary-dark">Timestamp</th>
                  <th className="px-5 py-3 font-semibold text-fabric-text-secondary-light dark:text-fabric-text-secondary-dark text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-fabric-border-light dark:divide-fabric-border-dark">
                {/* Default Baseline Data Row */}
                <tr className="hover:bg-gray-50/50 dark:hover:bg-fabric-bg-dark/20 transition-colors">
                  <td className="px-5 py-3 font-bold text-fabric-text-light dark:text-fabric-text-dark flex items-center space-x-2">
                    <FileSpreadsheet className="h-4 w-4 text-brand-blue dark:text-brand-orange" />
                    <span>default_baseline_superstore</span>
                  </td>
                  <td className="px-5 py-3">
                    <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400">
                      Gold (System Baseline)
                    </span>
                  </td>
                  <td className="px-5 py-3 text-right font-semibold text-fabric-text-light dark:text-fabric-text-dark">250</td>
                  <td className="px-5 py-3 text-fabric-text-secondary-light dark:text-fabric-text-secondary-dark">System Built-in</td>
                  <td className="px-5 py-3 text-center">
                    <span className="text-gray-400 dark:text-gray-600 text-[10px] font-semibold">Locked</span>
                  </td>
                </tr>
                
                {/* Dynamically Loaded Datasets */}
                {datasets.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-5 py-8 text-center text-fabric-text-secondary-light dark:text-fabric-text-secondary-dark font-medium italic">
                      No custom datasets uploaded yet. Drop a CSV file above to ingest.
                    </td>
                  </tr>
                ) : (
                  datasets.map((dataset) => (
                    <tr key={dataset.id} className="hover:bg-gray-50/50 dark:hover:bg-fabric-bg-dark/20 transition-colors">
                      <td className="px-5 py-3 font-bold text-fabric-text-light dark:text-fabric-text-dark flex items-center space-x-2">
                        <FileSpreadsheet className="h-4 w-4 text-amber-500" />
                        <span className="truncate max-w-[200px]" title={dataset.fileName}>{dataset.fileName}</span>
                      </td>
                      <td className="px-5 py-3">
                        {dataset.status === 'Ingested' ? (
                          <span className="inline-flex items-center rounded-full bg-amber-50 px-2.5 py-0.5 text-[10px] font-bold text-amber-700 dark:bg-amber-950/30 dark:text-amber-400 animate-pulse">
                            Bronze (Pending ETL)
                          </span>
                        ) : (
                          <span className="inline-flex items-center rounded-full bg-indigo-50 px-2.5 py-0.5 text-[10px] font-bold text-indigo-700 dark:bg-indigo-950/30 dark:text-indigo-400">
                            Gold (Processed)
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-3 text-right font-semibold text-fabric-text-light dark:text-fabric-text-dark">{dataset.rowsCount}</td>
                      <td className="px-5 py-3 text-fabric-text-secondary-light dark:text-fabric-text-secondary-dark">{dataset.uploadedAt}</td>
                      <td className="px-5 py-3 text-center">
                        <button
                          onClick={() => handleDeleteDataset(dataset.id, dataset.fileName)}
                          className="rounded-lg p-1 text-gray-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors hover:bg-rose-500/5"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
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
