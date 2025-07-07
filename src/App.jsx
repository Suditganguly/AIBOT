import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, Outlet, Navigate } from 'react-router-dom';
import { useUser } from './context/UserContext';
import UserDashboard from './components/UserDashboard';
import Chatbot from './components/Chatbot';
import HealthTips from './components/HealthTips';
import MedicineReminder from './components/MedicineReminder';
import BlogFeed from './components/BlogFeed';
import DoctorFinder from './components/DoctorFinder';
import AdminDashboard from './components/AdminDashboard';
import ProfileSettings from './components/ProfileSettings';
import HealthJournal from './components/HealthJournal';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import Login from './components/Login';
import Register from './components/Register';
import ProtectedRoute from './components/ProtectedRoute';
import UserProfileDropdown from './components/UserProfileDropdown';

const navLinks = [
  { to: '/', label: 'Dashboard' },
  { to: '/chatbot', label: 'AI Chatbot' },
  { to: '/tips', label: 'Health Tips & Goals' },
  { to: '/reminder', label: 'Medicine Reminder' },
  { to: '/journal', label: 'Health Journal' },
  { to: '/blog', label: 'Blog/News Feed' },
  { to: '/doctors', label: 'Doctor Finder' },
  { to: '/analytics', label: 'Analytics' },
  { to: '/profile', label: 'Profile Settings' },
  { to: '/admin', label: 'Admin Dashboard', admin: true },
];

function UserLayout() {
  const location = useLocation();
  const [profileOpen, setProfileOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { userData, logoutUser } = useUser();
  // Get current page name
  const currentPage = navLinks.find(l => l.to === location.pathname)?.label || 'Dashboard';
  
  return (
    <div className="flex">
      {/* Modern Sidebar */}
      <aside className={`sidebar ${!sidebarOpen ? 'sidebar-closed' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-title">
            <span>Smart Health</span>
          </div>
          <button 
            className="sidebar-close-btn"
            onClick={() => setSidebarOpen(false)}
            title="Close Sidebar"
          >
            ✕
          </button>
        </div>
        <nav className="sidebar-nav">
          <ul className="list">
            {navLinks.filter(l => !l.admin).map(link => (
              <li key={link.to} className="nav-item">
                <Link 
                  to={link.to} 
                  className={`nav-link ${location.pathname === link.to ? 'active' : ''}`}
                >
                  <span className="nav-icon">
                    {/* You can add icons here later */}
                    {link.label[0]}
                  </span>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
      
      {/* Main content area */}
      <div className="flex-1 flex flex-col items-center justify-start min-h-screen">
        {/* Modern Header */}
        <header className={`header ${!sidebarOpen ? 'w-full ml-0' : ''}`} style={{marginLeft: sidebarOpen ? 260 : 0, width: `calc(100vw - ${sidebarOpen ? 260 : 0}px)`, maxWidth: `calc(100vw - ${sidebarOpen ? 260 : 0}px)`}}>
          <div className="flex items-center gap-4">
            {!sidebarOpen && (
              <button 
                className="sidebar-toggle-btn"
                onClick={() => setSidebarOpen(true)}
                title="Open Sidebar"
              >
                ☰
              </button>
            )}
            <div className="page-title">{currentPage}</div>
          </div>
          <div className="header-actions">
            <UserProfileDropdown user={userData.profile} onLogout={logoutUser} />
          </div>
        </header>
        {/* Main Content with blurred dark background */}
        <div className="main-bg-blur-dark" style={{width: `calc(100vw - ${sidebarOpen ? 260 : 0}px)`, maxWidth: `calc(100vw - ${sidebarOpen ? 260 : 0}px)`, minHeight: 'calc(100vh - 70px)', marginLeft: sidebarOpen ? 260 : 0}}>
          <main className="main-content flex flex-col items-center justify-center w-full" style={{marginLeft: 0, width: '100%', maxWidth: '100%', background: 'none'}}>
            <div className="content-wrapper animate-slideInUp" style={{margin: 0, width: '100%', maxWidth: '100%', minWidth: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

function App() {
  const { isAuthenticated, authChecked } = useUser();

  return (
    <Router>
      <Routes>
        {/* Root route - redirect based on auth state */}
        <Route path="/" element={
          authChecked ? (
            isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/register" replace />
          ) : (
            <div className="min-h-screen flex items-center justify-center bg-gradient-modern">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-white text-lg">Loading...</p>
              </div>
            </div>
          )
        } />
        
        {/* Login route */}
        <Route path="/login" element={<Login />} />
        
        {/* Register route */}
        <Route path="/register" element={<Register />} />
        
        {/* Protected routes */}
        <Route element={
          <ProtectedRoute>
            <UserLayout />
          </ProtectedRoute>
        }>
          <Route path="/dashboard" element={<UserDashboard />} />
          <Route path="/chatbot" element={<Chatbot />} />
          <Route path="/tips" element={<HealthTips />} />
          <Route path="/reminder" element={<MedicineReminder />} />
          <Route path="/journal" element={<HealthJournal />} />
          <Route path="/blog" element={<BlogFeed />} />
          <Route path="/doctors" element={<DoctorFinder />} />
          <Route path="/analytics" element={<AnalyticsDashboard />} />
          <Route path="/profile" element={<ProfileSettings />} />
        </Route>
        
        {/* Admin route - also protected */}
        <Route path="/admin" element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;
