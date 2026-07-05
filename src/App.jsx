import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useTheme } from './hooks/useTheme';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Analytics from './pages/Analytics';
import Upload from './pages/Upload';
import PipelineStatus from './pages/PipelineStatus';
import SQLReports from './pages/SQLReports';
import Settings from './pages/Settings';

// Components
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';

// Protected Route Guard Component
const ProtectedRoute = () => {
  const token = localStorage.getItem('auth_token');
  return token ? <Outlet /> : <Navigate to="/login" replace />;
};

// Layout Wrapper Component
const Layout = ({ theme, toggleTheme, isDark }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-fabric-bg-light dark:bg-fabric-bg-dark transition-colors duration-200">
      {/* Navigation Drawer Sidebar */}
      <Sidebar isOpen={sidebarOpen} toggleSidebar={setSidebarOpen} />
      
      {/* Central Content Panel */}
      <div className="flex flex-1 flex-col lg:pl-64 min-w-0">
        <Navbar toggleSidebar={setSidebarOpen} theme={theme} toggleTheme={toggleTheme} />
        
        <main className="flex-1 p-5 md:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export const App = () => {
  const { theme, toggleTheme, isDark } = useTheme();

  return (
    <Router>
      <Routes>
        {/* Public auth route */}
        <Route path="/login" element={<Login />} />

        {/* Protected layout routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout theme={theme} toggleTheme={toggleTheme} isDark={isDark} />}>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard isDark={isDark} />} />
            <Route path="/analytics" element={<Analytics isDark={isDark} />} />
            <Route path="/upload" element={<Upload />} />
            <Route path="/pipeline-status" element={<PipelineStatus />} />
            <Route path="/sql-reports" element={<SQLReports />} />
            <Route path="/settings" element={<Settings theme={theme} toggleTheme={toggleTheme} />} />
          </Route>
        </Route>

        {/* Catch all fallback route */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
