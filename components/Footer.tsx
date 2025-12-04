import React from 'react';
import { Link } from 'react-router-dom';
import { Shield } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-200 bg-white py-6 mt-auto">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-600">
          <div className="flex items-center gap-2">
            <Shield size={16} className="text-brand-primary" />
            <span>Your data is encrypted and secure</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/security" className="hover:text-brand-primary hover:underline">
              Security
            </Link>
            <Link to="/privacy" className="hover:text-brand-primary hover:underline">
              Privacy Policy
            </Link>
            <Link to="/terms" className="hover:text-brand-primary hover:underline">
              Terms of Service
            </Link>
            <span className="text-slate-400">© 2025 NurseVault</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

