import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, FileText, GraduationCap, Award, TrendingUp, Share2, LogOut, ShieldCheck } from 'lucide-react';

interface SidebarProps {
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

const NAV_ITEMS = [
  { name: 'Dashboard', path: '/', icon: LayoutDashboard },
  { name: 'My Passport', path: '/passport', icon: FileText },
  { name: 'Training & Expiry', path: '/training', icon: ShieldCheck },
  { name: 'Learning & Dev', path: '/learning', icon: GraduationCap },
  { name: 'Competencies', path: '/competencies', icon: Award },
  { name: 'Career Pathway', path: '/career', icon: TrendingUp },
  { name: 'Share Pack', path: '/share', icon: Share2 },
];

const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, setMobileOpen }) => {
  return (
    <>
      {/* Mobile Overlay */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 z-20 bg-brand-charcoal/50 transition-opacity md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar Component - Deep Teal Background */}
      <aside className={`fixed inset-y-0 left-0 z-30 w-64 transform border-r border-brand-primaryDark bg-brand-primary transition-transform duration-300 ease-in-out md:static md:translate-x-0 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex h-16 items-center justify-center border-b border-brand-primaryDark px-6">
          <div className="flex items-center gap-2 font-bold text-white text-xl">
             <ShieldCheck size={28} className="text-brand-mint" />
             <span>NurseVault</span>
          </div>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-4 overflow-y-auto">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `group flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-brand-primaryDark text-white shadow-sm ring-1 ring-white/10'
                    : 'text-brand-mint/80 hover:bg-brand-primaryDark/50 hover:text-white'
                }`
              }
            >
              <item.icon
                className={`mr-3 h-5 w-5 flex-shrink-0 transition-colors ${
                   // Icon color logic inherited from text color above
                   ''
                }`}
              />
              {item.name}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-brand-primaryDark p-4">
          <button className="flex w-full items-center rounded-lg px-3 py-2.5 text-sm font-medium text-brand-mint/80 hover:bg-brand-primaryDark/50 hover:text-white transition-colors">
            <LogOut className="mr-3 h-5 w-5" />
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;