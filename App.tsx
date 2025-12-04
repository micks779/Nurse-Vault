import React, { useState } from 'react';
import { HashRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Passport from './pages/Passport';
import Training from './pages/Training';
import CareerPathway from './pages/CareerPathway';
import Learning from './pages/Learning';
import Competencies from './pages/Competencies';
import Login from './pages/Login';
import Security from './pages/Security';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import { Menu } from 'lucide-react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import Footer from './components/Footer';

// Layout component for the protected area (Sidebar + Content)
const MainLayout: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { logout, user } = useAuth();

  return (
    <div className="flex h-screen w-full bg-brand-background font-sans text-brand-charcoal">
      {/* Navigation */}
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto w-full flex flex-col">
        {/* Mobile Header */}
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 shadow-sm md:hidden">
          <div className="flex items-center">
            <button 
              onClick={() => setMobileOpen(true)}
              className="mr-4 text-slate-500 hover:text-brand-primary"
            >
              <Menu size={24} />
            </button>
            <span className="text-lg font-bold text-brand-primary">NurseVault</span>
          </div>
        </header>

        {/* Desktop Header / User Info Bar */}
        <div className="hidden md:flex h-16 items-center justify-end px-8 border-b border-slate-200 bg-white">
          <div className="flex items-center gap-4">
             <div className="text-right">
                <p className="text-sm font-medium text-brand-charcoal">{user?.name}</p>
                <p className="text-xs text-slate-500">{user?.currentRole}</p>
             </div>
             <div className="h-8 w-8 rounded-full bg-brand-primary text-white flex items-center justify-center font-bold">
               {user?.name.charAt(0)}
             </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full pb-20">
          <Outlet />
        </div>
        
        {/* Footer */}
        <Footer />
      </main>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <HashRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/security" element={<Security />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsOfService />} />

          {/* Protected Routes */}
          <Route element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }>
            <Route path="/" element={<Dashboard />} />
            <Route path="/passport" element={<Passport />} />
            <Route path="/training" element={<Training />} />
            <Route path="/career" element={<CareerPathway />} />
            <Route path="/learning" element={<Learning />} />
            <Route path="/competencies" element={<Competencies />} />
            <Route path="/share" element={<div className="p-10 text-center text-slate-400">Share functionality coming soon</div>} />
          </Route>
          
          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </HashRouter>
    </AuthProvider>
  );
};

export default App;