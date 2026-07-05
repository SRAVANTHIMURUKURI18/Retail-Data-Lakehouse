import React, { useState, useEffect } from 'react';
import { Sun, Moon, Bell, Search, Menu, User, ChevronDown, CheckCircle, Database } from 'lucide-react';

export const Navbar = ({ toggleSidebar, theme, toggleTheme }) => {
  const [userEmail, setUserEmail] = useState('admin@retail.com');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  useEffect(() => {
    const email = localStorage.getItem('user_email');
    if (email) setUserEmail(email);
  }, []);

  const notifications = [
    { id: 1, title: 'Gold Tables Refreshed', desc: 'ETL pipeline run #842 completed successfully', time: '10 mins ago', type: 'success' },
    { id: 2, title: 'CSV Schema Ingested', desc: 'SampleSuperstore.csv loaded into bronze layer', time: '1 hr ago', type: 'info' }
  ];

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-fabric-border-light bg-fabric-card-light/80 px-6 backdrop-blur-md dark:border-fabric-border-dark dark:bg-fabric-card-dark/80 transition-all duration-300">
      
      {/* Left side: Hamburger & Section Indicator */}
      <div className="flex items-center space-x-4">
        <button
          onClick={() => toggleSidebar(prev => !prev)}
          className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-fabric-border-dark/55 lg:hidden transition-colors"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Global Search Bar (Inspired by Microsoft Fabric search) */}
        <div className="relative hidden max-w-xs md:block">
          <Search className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search reports, pipeline jobs, datasets..."
            className="h-9 w-64 rounded-xl border border-fabric-border-light bg-gray-50/50 pl-10 pr-4 text-xs text-fabric-text-light placeholder-gray-400 outline-none transition-all focus:border-brand-blue/50 focus:bg-white focus:w-80 dark:border-fabric-border-dark dark:bg-fabric-bg-dark/40 dark:text-fabric-text-dark dark:focus:border-brand-orange/50 dark:focus:bg-fabric-bg-dark"
          />
        </div>
      </div>

      {/* Right side controls */}
      <div className="flex items-center space-x-3.5">
        
        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-fabric-border-light text-gray-500 hover:bg-gray-50 dark:border-fabric-border-dark dark:text-gray-400 dark:hover:bg-fabric-border-dark/55 transition-all duration-300 hover:scale-105 active:scale-95"
          title="Toggle Light/Dark Theme"
        >
          {theme === 'dark' ? (
            <Sun className="h-4.5 w-4.5 text-brand-orange animate-pulse" />
          ) : (
            <Moon className="h-4.5 w-4.5 text-brand-blue" />
          )}
        </button>

        {/* Notifications Panel */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowProfile(false);
            }}
            className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-fabric-border-light text-gray-500 hover:bg-gray-50 dark:border-fabric-border-dark dark:text-gray-400 dark:hover:bg-fabric-border-dark/55 transition-all duration-300 hover:scale-105 active:scale-95"
          >
            <Bell className="h-4.5 w-4.5" />
            <span className="absolute top-1 right-1 flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-orange opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-orange"></span>
            </span>
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-3 w-80 rounded-2xl border border-fabric-border-light bg-fabric-card-light p-4 shadow-xl dark:border-fabric-border-dark dark:bg-fabric-card-dark animate-fade-in">
              <div className="flex items-center justify-between border-b border-fabric-border-light pb-2.5 dark:border-fabric-border-dark">
                <span className="font-display text-xs font-bold text-fabric-text-light dark:text-fabric-text-dark">Recent Notifications</span>
                <span className="rounded-full bg-brand-blue/10 dark:bg-brand-orange/15 px-2 py-0.5 text-[10px] font-bold text-brand-blue dark:text-brand-orange">2 new</span>
              </div>
              <div className="mt-3 space-y-3">
                {notifications.map(item => (
                  <div key={item.id} className="flex space-x-3 text-xs leading-normal">
                    {item.type === 'success' ? (
                      <CheckCircle className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                    ) : (
                      <Database className="h-5 w-5 text-brand-blue dark:text-brand-orange shrink-0 mt-0.5" />
                    )}
                    <div className="flex-1">
                      <p className="font-bold text-fabric-text-light dark:text-fabric-text-dark">{item.title}</p>
                      <p className="text-fabric-text-secondary-light dark:text-fabric-text-secondary-dark text-[11px] mt-0.5">{item.desc}</p>
                      <span className="text-[10px] text-gray-400 mt-1 block">{item.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Profile */}
        <div className="relative">
          <button
            onClick={() => {
              setShowProfile(!showProfile);
              setShowNotifications(false);
            }}
            className="flex items-center space-x-2 rounded-xl border border-fabric-border-light p-1.5 hover:bg-gray-50 dark:border-fabric-border-dark dark:hover:bg-fabric-border-dark/55 transition-all duration-300"
          >
            <div className="flex h-6.5 w-6.5 items-center justify-center rounded-lg bg-brand-blue/15 text-brand-blue dark:bg-brand-orange/15 dark:text-brand-orange">
              <User className="h-4 w-4" />
            </div>
            <span className="hidden text-xs font-semibold text-fabric-text-light dark:text-fabric-text-dark md:block max-w-[100px] truncate">
              {userEmail.split('@')[0]}
            </span>
            <ChevronDown className="hidden h-3.5 w-3.5 text-gray-400 md:block" />
          </button>

          {showProfile && (
            <div className="absolute right-0 mt-3 w-56 rounded-2xl border border-fabric-border-light bg-fabric-card-light p-4 shadow-xl dark:border-fabric-border-dark dark:bg-fabric-card-dark animate-fade-in">
              <div className="flex flex-col border-b border-fabric-border-light pb-2.5 dark:border-fabric-border-dark">
                <span className="text-xs font-bold text-fabric-text-light dark:text-fabric-text-dark">Signed in as</span>
                <span className="text-[11px] text-fabric-text-secondary-light dark:text-fabric-text-secondary-dark truncate font-medium mt-0.5">
                  {userEmail}
                </span>
              </div>
              <div className="mt-2.5">
                <div className="rounded-lg bg-emerald-50 dark:bg-emerald-950/20 p-2 text-center text-[10px] font-bold text-emerald-700 dark:text-emerald-400 flex items-center justify-center space-x-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>Lakehouse Connected</span>
                </div>
              </div>
            </div>
          )}
        </div>

      </div>
    </header>
  );
};
export default Navbar;
