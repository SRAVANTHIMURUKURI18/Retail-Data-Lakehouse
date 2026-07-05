import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { triggerPipeline, getDatasets } from '../services/api';
import { Toast } from '../components/Toast';
import { 
  Play, 
  CheckCircle2, 
  Clock, 
  Database, 
  Terminal, 
  AlertCircle,
  TrendingUp,
  Cpu,
  Layers
} from 'lucide-react';

export const PipelineStatus = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const logsEndRef = useRef(null);

  const [isRunning, setIsRunning] = useState(false);
  const [pipelineProgress, setPipelineProgress] = useState(0);
  const [activeStage, setActiveStage] = useState(null);
  const [stageStatus, setStageStatus] = useState('idle'); // idle, running, succeeded, failed
  
  // Default static stages list shown initially
  const [stages, setStages] = useState([
    { key: 'ingestion', name: 'Raw Ingestion', rows: 0, duration: '--', status: 'Pending' },
    { key: 'bronze', name: 'Bronze Ingestion Table', rows: 0, duration: '--', status: 'Pending' },
    { key: 'silver', name: 'Silver Sales Table', rows: 0, duration: '--', status: 'Pending' },
    { key: 'gold', name: 'Gold Analytics Cubes', rows: 0, duration: '--', status: 'Pending' }
  ]);

  const [consoleLogs, setConsoleLogs] = useState([
    'Initializing Databricks PySpark Cluster...',
    'Spark Session ID: spark-session-retail-lakehouse-prod',
    'Lakehouse state: Idle. Awaiting pipeline execution trigger.'
  ]);

  const [toastMessage, setToastMessage] = useState(null);
  const [toastType, setToastType] = useState('success');

  const showToast = (msg, type = 'success') => {
    setToastMessage(msg);
    setToastType(type);
  };

  const addLog = (msg) => {
    const timestamp = new Date().toLocaleTimeString();
    setConsoleLogs(prev => [...prev, `[${timestamp}] ${msg}`]);
  };

  const runPipelineJob = async () => {
    if (isRunning) return;
    
    setIsRunning(true);
    setStageStatus('running');
    setConsoleLogs([]);
    addLog('Starting Retail Analytics Lakehouse ETL Pipeline Job...');
    addLog('Connecting Spark cluster to Volumes/workspace/retail_project/raw_data...');

    try {
      const allDatasets = await getDatasets();
      const pending = allDatasets.filter(d => d.status === 'Ingested');
      
      if (pending.length > 0) {
        addLog(`Discovered ${pending.length} pending raw file(s) in volume storage:`);
        pending.forEach(p => {
          addLog(`  - ${p.fileName} (${p.rowsCount} rows)`);
        });
      } else {
        addLog('No new raw files discovered. Running pipeline to refresh existing schemas.');
      }

      const result = await triggerPipeline((update) => {
        // Callback updates state mid-stage execution
        setActiveStage(update.activeStage);
        setPipelineProgress(update.progress);
        
        // Map updates to our stages view
        setStages(update.stagesList.map(s => {
          let rows = 0;
          if (s.status === 'Completed' || (s.status === 'Running' && update.stageStatus === 'Completed')) {
            rows = s.rows;
          }
          return {
            key: s.key,
            name: s.name,
            rows: rows || (s.status === 'Running' ? Math.max(1, Math.floor(s.rows * 0.7)) : 0),
            duration: s.status === 'Completed' ? s.duration : s.status === 'Running' ? 'Processing...' : '--',
            status: s.status
          };
        }));

        // Log printing matching the active stage
        if (update.stageStatus === 'Running') {
          addLog(`[Stage: ${update.activeStage.toUpperCase()}] Running notebook transformations...`);
        } else if (update.stageStatus === 'Completed') {
          addLog(`[Stage: ${update.activeStage.toUpperCase()}] Execution complete. Delta table schema synchronized.`);
        }
      });

      // Complete
      setPipelineProgress(100);
      setStageStatus('succeeded');
      showToast('ETL Pipeline job completed successfully. Gold tables refreshed!', 'success');
      
      // Calculate total rows
      const totalPendingRows = pending.reduce((sum, d) => sum + d.rowsCount, 0);
      const totalGoldRows = 250 + allDatasets.reduce((sum, d) => sum + (d.status === 'Processed' || d.status === 'Ingested' ? d.rowsCount : 0), 0);

      // Update all stages to actual values
      setStages([
        { key: 'ingestion', name: 'Raw Ingestion', rows: totalPendingRows, duration: '1.2s', status: 'Completed' },
        { key: 'bronze', name: 'Bronze Ingestion Table', rows: totalPendingRows, duration: '2.5s', status: 'Completed' },
        { key: 'silver', name: 'Silver Sales Table', rows: totalPendingRows, duration: '3.1s', status: 'Completed' },
        { key: 'gold', name: 'Gold Analytics Cubes', rows: totalGoldRows, duration: '4.2s', status: 'Completed' }
      ]);

      addLog(`ETL Pipeline job SUCCEEDED in ${result.totalDuration}.`);
      if (result.processedFiles && result.processedFiles.length > 0) {
        addLog(`Successfully processed files: ${result.processedFiles.join(', ')}.`);
        addLog(`Merged ${totalPendingRows} new records into Gold Warehouse tables.`);
      }
      addLog(`Refreshed Gold tables: ${result.goldTablesUpdated.join(', ')}.`);
      addLog(`Total rows active in Gold Layer: ${totalGoldRows}.`);
      addLog('Data Cube aggregates pushed to BI Presentation layer.');

    } catch (err) {
      setStageStatus('failed');
      addLog(`[ERROR] ETL Pipeline job aborted: ${err.message}`);
      showToast('ETL Pipeline execution failed.', 'error');
    } finally {
      setIsRunning(false);
    }
  };

  // Autostart from URL query params (triggered from file uploads)
  useEffect(() => {
    if (searchParams.get('start') === 'true') {
      // Remove query parameter so refreshes don't auto-run
      setSearchParams({});
      runPipelineJob();
    }
  }, [searchParams, setSearchParams]);

  // Scroll terminal logs to bottom automatically
  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [consoleLogs]);

  return (
    <div className="space-y-7 animate-fade-in">
      
      {/* Page Header */}
      <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-fabric-text-light dark:text-fabric-text-dark">
            Lakehouse Pipeline Status
          </h1>
          <p className="text-xs text-fabric-text-secondary-light dark:text-fabric-text-secondary-dark font-medium mt-0.5">
            Monitor PySpark notebooks converting Raw Superstore CSV into Gold analytics cubes.
          </p>
        </div>

        <button
          onClick={runPipelineJob}
          disabled={isRunning}
          className="flex items-center space-x-2 rounded-xl bg-brand-blue px-4 py-2.5 text-xs font-bold text-white shadow-md hover:bg-brand-blue/90 dark:bg-brand-orange dark:hover:bg-brand-orange/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:-translate-y-0.5"
        >
          <Play className="h-4 w-4" />
          <span>Execute Pipeline Job</span>
        </button>
      </div>

      {/* Main Overall Progress bar */}
      <div className="rounded-2xl border border-fabric-border-light bg-fabric-card-light p-6 shadow-sm dark:border-fabric-border-dark dark:bg-fabric-card-dark transition-all duration-300">
        <div className="flex items-center justify-between text-xs font-semibold">
          <div className="flex items-center space-x-2 text-fabric-text-light dark:text-fabric-text-dark">
            <Cpu className="h-4.5 w-4.5 text-brand-blue dark:text-brand-orange" />
            <span>ETL Execution Progress</span>
          </div>
          <span className="text-brand-blue dark:text-brand-orange uppercase text-[10px]">
            {stageStatus === 'running' ? 'JOB RUNNING' : stageStatus === 'succeeded' ? 'SUCCESS' : 'STANDBY'}
          </span>
        </div>
        <div className="mt-4 relative">
          <div className="h-3 w-full rounded-full bg-gray-200 dark:bg-fabric-border-dark overflow-hidden">
            <div 
              className={`h-full rounded-full bg-gradient-to-r from-brand-blue via-brand-teal to-brand-orange transition-all duration-500 ${
                isRunning ? 'animate-pulse' : ''
              }`}
              style={{ width: `${pipelineProgress}%` }}
            />
          </div>
          <span className="absolute right-0 top-4 text-[10px] font-bold text-fabric-text-secondary-light dark:text-fabric-text-secondary-dark uppercase">
            {pipelineProgress}% Total
          </span>
        </div>
      </div>

      {/* Dynamic stage blocks */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-4">
        {stages.map((s, index) => {
          const isCurrent = activeStage === s.key;
          const isDone = s.status === 'Completed';
          
          return (
            <div 
              key={s.key} 
              className={`relative rounded-2xl border p-5 shadow-sm transition-all duration-300 ${
                isCurrent 
                  ? 'border-brand-blue bg-brand-blue/5 dark:border-brand-orange dark:bg-brand-orange/5 animate-pulse'
                  : isDone
                    ? 'border-emerald-200 bg-emerald-50/10 dark:border-emerald-800/40 dark:bg-emerald-950/5'
                    : 'border-fabric-border-light bg-fabric-card-light dark:border-fabric-border-dark dark:bg-fabric-card-dark'
              }`}
            >
              {/* Flowchart connecting arrow dot */}
              {index < 3 && (
                <div className="hidden md:block absolute top-1/2 -right-3 z-10 h-6 w-6 -translate-y-1/2 rounded-full border border-fabric-border-light bg-fabric-card-light dark:border-fabric-border-dark dark:bg-fabric-card-dark shadow-sm">
                  <div className={`h-full w-full rounded-full flex items-center justify-center text-[10px] font-bold ${
                    isDone ? 'text-emerald-500' : 'text-gray-400'
                  }`}>
                    ➔
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-fabric-text-secondary-light dark:text-fabric-text-secondary-dark">
                  Stage 0{index + 1}
                </span>
                
                <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide ${
                  isDone 
                    ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400' 
                    : isCurrent 
                      ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400' 
                      : 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400'
                }`}>
                  {s.status}
                </span>
              </div>

              <h4 className="mt-3.5 font-display text-xs font-bold text-fabric-text-light dark:text-fabric-text-dark">
                {s.name}
              </h4>

              <div className="mt-5 space-y-2 border-t border-fabric-border-light/70 pt-3 dark:border-fabric-border-dark/60 text-[10px] font-medium text-fabric-text-secondary-light dark:text-fabric-text-secondary-dark">
                <div className="flex justify-between">
                  <span>Rows Processed:</span>
                  <span className="font-bold text-fabric-text-light dark:text-fabric-text-dark">{s.rows > 0 ? s.rows : '--'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Duration:</span>
                  <span className="font-bold text-fabric-text-light dark:text-fabric-text-dark">{s.duration}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Terminal logs panel */}
      <div className="rounded-2xl border border-fabric-border-light bg-fabric-card-light shadow-sm dark:border-fabric-border-dark dark:bg-fabric-card-dark overflow-hidden transition-all duration-300">
        <div className="flex items-center space-x-2 border-b border-fabric-border-light bg-gray-50/50 px-5 py-3 dark:border-fabric-border-dark dark:bg-fabric-bg-dark/40">
          <Terminal className="h-4.5 w-4.5 text-gray-400" />
          <h3 className="font-display text-xs font-bold text-fabric-text-light dark:text-fabric-text-dark">
            Databricks PySpark Terminal Logs
          </h3>
        </div>

        <div className="h-48 overflow-y-auto bg-slate-950 p-4 font-mono text-[10px] leading-relaxed text-slate-300 select-text">
          {consoleLogs.map((log, index) => (
            <div key={index} className="whitespace-pre-wrap">
              {log.startsWith('[ERROR]') ? (
                <span className="text-rose-400 font-bold">{log}</span>
              ) : log.includes('SUCCEEDED') || log.startsWith('[SUCCESS]') ? (
                <span className="text-emerald-400 font-bold">{log}</span>
              ) : log.includes('[Stage:') ? (
                <span className="text-amber-400 font-semibold">{log}</span>
              ) : (
                <span>{log}</span>
              )}
            </div>
          ))}
          <div ref={logsEndRef} />
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
export default PipelineStatus;
