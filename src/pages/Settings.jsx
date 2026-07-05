import React, { useState, useEffect } from 'react';
import { Toast } from '../components/Toast';
import { 
  User, 
  Settings2, 
  BellRing, 
  Info, 
  Sun, 
  Moon, 
  Check, 
  Database,
  Cpu,
  Mail
} from 'lucide-react';

export const Settings = ({ theme, toggleTheme }) => {
  const [activeTab, setActiveTab] = useState('profile');
  const [displayName, setDisplayName] = useState('Superstore Admin');
  const [jobTitle, setJobTitle] = useState('Lead Data Engineer');
  const [org, setOrg] = useState('Lakehouse Analytics Corp');
  const [email, setEmail] = useState('admin@retail.com');

  // Notification states
  const [pipelineAlerts, setPipelineAlerts] = useState(true);
  const [uploadAlerts, setUploadAlerts] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(false);

  const [toastMessage, setToastMessage] = useState(null);
  const [toastType, setToastType] = useState('success');

  useEffect(() => {
    const savedEmail = localStorage.getItem('user_email');
    if (savedEmail) {
      setEmail(savedEmail);
    }
  }, []);

  const showToast = (msg, type = 'success') => {
    setToastMessage(msg);
    setToastType(type);
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    localStorage.setItem('user_email', email);
    showToast('Profile configuration saved successfully.', 'success');
  };

  const handleSaveNotifications = () => {
    showToast('Notification preferences updated.', 'success');
  };

  const settingsTabs = [
    { id: 'profile', label: 'User Profile', icon: User },
    { id: 'theme', label: 'Theme Selector', icon: Settings2 },
    { id: 'notifications', label: 'Notifications', icon: BellRing },
    { id: 'about', label: 'About System', icon: Info }
  ];

  return (
    <div className="space-y-7 animate-fade-in max-w-4xl mx-auto">
      
      {/* Title */}
      <div className="flex flex-col space-y-1">
        <h1 className="text-2xl font-extrabold tracking-tight text-fabric-text-light dark:text-fabric-text-dark">
          Control Panel Settings
        </h1>
        <p className="text-xs text-fabric-text-secondary-light dark:text-fabric-text-secondary-dark font-medium">
          Manage user profiles, theme toggles, and catalog metadata credentials.
        </p>
      </div>

      <div className="flex flex-col gap-6 md:flex-row">
        {/* Left Side: Navigation Links (1/4 width) */}
        <div className="w-full md:w-56 shrink-0 flex flex-row md:flex-col overflow-x-auto md:overflow-visible gap-1.5 pb-2.5 md:pb-0 border-b md:border-b-0 border-fabric-border-light dark:border-fabric-border-dark">
          {settingsTabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-3 rounded-xl px-4 py-3 text-xs font-semibold whitespace-nowrap transition-all duration-200 hover:-translate-y-0.5 md:hover:translate-x-0.5 ${
                activeTab === tab.id
                  ? 'bg-brand-blue text-white shadow-md dark:bg-brand-orange'
                  : 'text-fabric-text-secondary-light hover:bg-gray-100 hover:text-fabric-text-light dark:text-fabric-text-secondary-dark dark:hover:bg-fabric-border-dark/30 dark:hover:text-fabric-text-dark'
              }`}
            >
              <tab.icon className="h-4.5 w-4.5" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Right Side: Tab Panel Contents (3/4 width) */}
        <div className="flex-1 rounded-3xl border border-fabric-border-light bg-fabric-card-light p-6 shadow-sm dark:border-fabric-border-dark dark:bg-fabric-card-dark transition-all duration-300">
          
          {/* PROFILE EDITOR */}
          {activeTab === 'profile' && (
            <form onSubmit={handleSaveProfile} className="space-y-5">
              <h3 className="font-display text-sm font-bold text-fabric-text-light dark:text-fabric-text-dark border-b border-fabric-border-light pb-2.5 dark:border-fabric-border-dark">
                Profile Configuration
              </h3>
              
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-fabric-text-secondary-light dark:text-fabric-text-secondary-dark">
                    Display Name
                  </label>
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="w-full rounded-xl border border-fabric-border-light bg-gray-50/50 p-2.5 text-xs text-fabric-text-light dark:border-fabric-border-dark dark:bg-fabric-bg-dark/40 dark:text-fabric-text-dark outline-none focus:border-brand-blue/50 dark:focus:border-brand-orange/50 focus:bg-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-fabric-text-secondary-light dark:text-fabric-text-secondary-dark">
                    Job Designation
                  </label>
                  <input
                    type="text"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    className="w-full rounded-xl border border-fabric-border-light bg-gray-50/50 p-2.5 text-xs text-fabric-text-light dark:border-fabric-border-dark dark:bg-fabric-bg-dark/40 dark:text-fabric-text-dark outline-none focus:border-brand-blue/50 dark:focus:border-brand-orange/50 focus:bg-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-fabric-text-secondary-light dark:text-fabric-text-secondary-dark">
                    Organization
                  </label>
                  <input
                    type="text"
                    value={org}
                    onChange={(e) => setOrg(e.target.value)}
                    className="w-full rounded-xl border border-fabric-border-light bg-gray-50/50 p-2.5 text-xs text-fabric-text-light dark:border-fabric-border-dark dark:bg-fabric-bg-dark/40 dark:text-fabric-text-dark outline-none focus:border-brand-blue/50 dark:focus:border-brand-orange/50 focus:bg-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-fabric-text-secondary-light dark:text-fabric-text-secondary-dark">
                    Work Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl border border-fabric-border-light bg-gray-50/50 p-2.5 text-xs text-fabric-text-light dark:border-fabric-border-dark dark:bg-fabric-bg-dark/40 dark:text-fabric-text-dark outline-none focus:border-brand-blue/50 dark:focus:border-brand-orange/50 focus:bg-white"
                  />
                </div>
              </div>

              <div className="pt-3.5 flex justify-end">
                <button
                  type="submit"
                  className="rounded-xl bg-brand-blue hover:bg-brand-blue/90 dark:bg-brand-orange dark:hover:bg-brand-orange/90 px-4 py-2.5 text-xs font-bold text-white shadow transition-all hover:-translate-y-0.5"
                >
                  Save Profile Details
                </button>
              </div>
            </form>
          )}

          {/* THEME TOGGLE VIEW */}
          {activeTab === 'theme' && (
            <div className="space-y-5">
              <h3 className="font-display text-sm font-bold text-fabric-text-light dark:text-fabric-text-dark border-b border-fabric-border-light pb-2.5 dark:border-fabric-border-dark">
                Application Themes
              </h3>
              
              <p className="text-xs text-fabric-text-secondary-light dark:text-fabric-text-secondary-dark leading-normal">
                Choose the visual aesthetics matching your local lighting configuration.
              </p>

              <div className="grid grid-cols-2 gap-4 pt-2">
                {/* Light Mode Selector Card */}
                <div 
                  onClick={() => theme === 'dark' && toggleTheme()}
                  className={`relative flex flex-col justify-between rounded-2xl border p-5 cursor-pointer shadow-sm transition-all duration-300 ${
                    theme === 'light'
                      ? 'border-brand-blue bg-blue-50/10 dark:border-brand-orange'
                      : 'border-fabric-border-light bg-gray-50/20 dark:border-fabric-border-dark hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <Sun className="h-5 w-5 text-amber-500" />
                    {theme === 'light' && (
                      <span className="rounded-full bg-brand-blue/15 text-brand-blue p-0.5">
                        <Check className="h-3 w-3" />
                      </span>
                    )}
                  </div>
                  <div className="mt-8">
                    <p className="font-display text-xs font-bold text-fabric-text-light dark:text-fabric-text-dark">Light Theme</p>
                    <p className="text-[10px] text-gray-400 mt-0.5">Inspired by Power BI Desktop</p>
                  </div>
                </div>

                {/* Dark Mode Selector Card */}
                <div 
                  onClick={() => theme === 'light' && toggleTheme()}
                  className={`relative flex flex-col justify-between rounded-2xl border p-5 cursor-pointer shadow-sm transition-all duration-300 ${
                    theme === 'dark'
                      ? 'border-brand-orange bg-orange-950/5 dark:border-brand-orange'
                      : 'border-fabric-border-light bg-gray-50/20 dark:border-fabric-border-dark hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <Moon className="h-5 w-5 text-brand-orange" />
                    {theme === 'dark' && (
                      <span className="rounded-full bg-brand-orange/15 text-brand-orange p-0.5">
                        <Check className="h-3 w-3" />
                      </span>
                    )}
                  </div>
                  <div className="mt-8">
                    <p className="font-display text-xs font-bold text-fabric-text-light dark:text-fabric-text-dark">Dark Theme</p>
                    <p className="text-[10px] text-gray-400 mt-0.5">Inspired by Databricks Workspace</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* NOTIFICATION SETTINGS */}
          {activeTab === 'notifications' && (
            <div className="space-y-5">
              <h3 className="font-display text-sm font-bold text-fabric-text-light dark:text-fabric-text-dark border-b border-fabric-border-light pb-2.5 dark:border-fabric-border-dark">
                Lakehouse Notifications
              </h3>

              <div className="space-y-4 pt-2">
                {/* 1 */}
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5 max-w-sm">
                    <p className="text-xs font-bold text-fabric-text-light dark:text-fabric-text-dark">Pipeline Completion Alerts</p>
                    <p className="text-[10px] text-fabric-text-secondary-light dark:text-fabric-text-secondary-dark">Notify me instantly in-app when ETL stages succeed or fail.</p>
                  </div>
                  <button 
                    type="button"
                    onClick={() => setPipelineAlerts(!pipelineAlerts)}
                    className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 outline-none ${
                      pipelineAlerts ? 'bg-brand-blue dark:bg-brand-orange' : 'bg-gray-200 dark:bg-gray-800'
                    }`}
                  >
                    <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      pipelineAlerts ? 'translate-x-4' : 'translate-x-0'
                    }`} />
                  </button>
                </div>
                
                {/* 2 */}
                <div className="flex items-center justify-between border-t border-fabric-border-light/70 pt-3.5 dark:border-fabric-border-dark/60">
                  <div className="space-y-0.5 max-w-sm">
                    <p className="text-xs font-bold text-fabric-text-light dark:text-fabric-text-dark">CSV Ingestion Success Warnings</p>
                    <p className="text-[10px] text-fabric-text-secondary-light dark:text-fabric-text-secondary-dark">Alert on invalid CSV header mappings or parsing delays.</p>
                  </div>
                  <button 
                    type="button"
                    onClick={() => setUploadAlerts(!uploadAlerts)}
                    className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 outline-none ${
                      uploadAlerts ? 'bg-brand-blue dark:bg-brand-orange' : 'bg-gray-200 dark:bg-gray-800'
                    }`}
                  >
                    <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      uploadAlerts ? 'translate-x-4' : 'translate-x-0'
                    }`} />
                  </button>
                </div>

                {/* 3 */}
                <div className="flex items-center justify-between border-t border-fabric-border-light/70 pt-3.5 dark:border-fabric-border-dark/60">
                  <div className="space-y-0.5 max-w-sm">
                    <p className="text-xs font-bold text-fabric-text-light dark:text-fabric-text-dark">Weekly Lakehouse Summary Digest</p>
                    <p className="text-[10px] text-fabric-text-secondary-light dark:text-fabric-text-secondary-dark">Send summaries of top performing states to my work email.</p>
                  </div>
                  <button 
                    type="button"
                    onClick={() => setWeeklyDigest(!weeklyDigest)}
                    className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 outline-none ${
                      weeklyDigest ? 'bg-brand-blue dark:bg-brand-orange' : 'bg-gray-200 dark:bg-gray-800'
                    }`}
                  >
                    <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      weeklyDigest ? 'translate-x-4' : 'translate-x-0'
                    }`} />
                  </button>
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  onClick={handleSaveNotifications}
                  className="rounded-xl bg-brand-blue hover:bg-brand-blue/90 dark:bg-brand-orange dark:hover:bg-brand-orange/90 px-4 py-2.5 text-xs font-bold text-white shadow transition-all"
                >
                  Save Alerts Preferences
                </button>
              </div>
            </div>
          )}

          {/* ABOUT PLATFORM */}
          {activeTab === 'about' && (
            <div className="space-y-5">
              <h3 className="font-display text-sm font-bold text-fabric-text-light dark:text-fabric-text-dark border-b border-fabric-border-light pb-2.5 dark:border-fabric-border-dark">
                Retail Analytics Infrastructure
              </h3>

              <div className="space-y-4 text-xs leading-relaxed text-fabric-text-secondary-light dark:text-fabric-text-secondary-dark">
                <p>
                  This production-ready gateway serves as the primary visual client for the **Sample Superstore Lakehouse Architecture**.
                </p>

                <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 pt-2">
                  <div className="rounded-2xl border border-fabric-border-light bg-gray-50/50 p-4 dark:border-fabric-border-dark dark:bg-fabric-bg-dark/40 flex items-start space-x-3">
                    <Database className="h-5 w-5 text-brand-blue dark:text-brand-orange shrink-0" />
                    <div>
                      <p className="font-bold text-fabric-text-light dark:text-fabric-text-dark text-[11px]">Databricks Gold catalogs</p>
                      <ul className="mt-1 space-y-1 text-[10px] list-disc list-inside">
                        <li>gold_region_sales</li>
                        <li>gold_category_sales</li>
                        <li>gold_top_states</li>
                        <li>gold_discount_analysis</li>
                      </ul>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-fabric-border-light bg-gray-50/50 p-4 dark:border-fabric-border-dark dark:bg-fabric-bg-dark/40 flex items-start space-x-3">
                    <Cpu className="h-5 w-5 text-brand-blue dark:text-brand-orange shrink-0" />
                    <div>
                      <p className="font-bold text-fabric-text-light dark:text-fabric-text-dark text-[11px]">Associated PySpark notebooks</p>
                      <ul className="mt-1 space-y-1 text-[10px] list-disc list-inside">
                        <li>01_Ingestion.py</li>
                        <li>03_Silver.py</li>
                        <li>04_Gold.py</li>
                        <li>07_Dashboard.py</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="pt-2 text-[10px] text-gray-400 dark:text-gray-500 flex justify-between">
                  <span>App Version: 1.0.0-PROD</span>
                  <span>Environment: FastAPI Staging Hub</span>
                </div>
              </div>
            </div>
          )}

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
export default Settings;
