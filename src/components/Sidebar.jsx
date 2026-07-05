import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  BarChart3,
  UploadCloud,
  PlayCircle,
  Database,
  Settings,
  LogOut,
  Sparkles
} from 'lucide-react';

export const Sidebar = ({ isOpen, toggleSidebar }) => {
  const navigate = useNavigate();

  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Analytics', path: '/analytics', icon: BarChart3 },
    { name: 'Upload Data', path: '/upload', icon: UploadCloud },
    { name: 'Pipeline Status', path: '/pipeline-status', icon: PlayCircle },
    { name: 'SQL Reports', path: '/sql-reports', icon: Database },
    { name: 'Settings', path: '/settings', icon: Settings }
  ];

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_email');
    navigate('/login');
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          onClick={toggleSidebar}
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden transition-all"
        />
      )}

      {/* Sidebar container */}
      <aside className={`fixed top-0 bottom-0 left-0 z-40 flex w-64 flex-col border-r border-fabric-border-light bg-fabric-card-light transition-all duration-300 dark:border-fabric-border-dark dark:bg-fabric-card-dark lg:translate-x-0 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        {/* Brand Header */}
        <div className="flex h-16 items-center justify-between px-6 border-b border-fabric-border-light dark:border-fabric-border-dark">
          <div className="flex items-center space-x-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-blue dark:bg-brand-orange text-white shadow-md shadow-brand-blue/10 dark:shadow-brand-orange/10">
              <Sparkles className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-display text-sm font-bold text-fabric-text-light dark:text-fabric-text-dark">
                Retail Analytics
              </span>
              <span className="font-sans text-[10px] font-semibold tracking-wider text-brand-blue dark:text-brand-orange uppercase">
                Data Lakehouse
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 space-y-1.5 px-4 py-6 overflow-y-auto">
          {menuItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              onClick={() => toggleSidebar(false)}
              className={({ isActive }) => `
                group flex items-center space-x-3.5 rounded-xl px-4 py-3 text-xs font-semibold tracking-wide transition-all duration-200
                ${isActive 
                  ? 'bg-brand-blue/10 text-brand-blue dark:bg-brand-orange/15 dark:text-brand-orange' 
                  : 'text-fabric-text-secondary-light hover:bg-gray-100 hover:text-fabric-text-light dark:text-fabric-text-secondary-dark dark:hover:bg-fabric-border-dark/30 dark:hover:text-fabric-text-dark'
                }
              `}
            >
              {({ isActive }) => (
                <>
                  <item.icon className={`h-4.5 w-4.5 transition-transform duration-300 group-hover:scale-110 ${
                    isActive ? 'text-brand-blue dark:text-brand-orange' : 'text-gray-400 group-hover:text-fabric-text-light dark:group-hover:text-fabric-text-dark'
                  }`} />
                  <span>{item.name}</span>
                  {isActive && (
                    <span className="absolute left-0 h-5 w-1 rounded-r bg-brand-blue dark:bg-brand-orange" />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Sidebar Footer / Logout */}
        <div className="border-t border-fabric-border-light p-4 dark:border-fabric-border-dark">
          <button
            onClick={handleLogout}
            className="flex w-full items-center space-x-3.5 rounded-xl px-4 py-3 text-xs font-semibold tracking-wide text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/20 transition-all duration-200 hover:-translate-y-0.5"
          >
            <LogOut className="h-4.5 w-4.5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};
export default Sidebar;
