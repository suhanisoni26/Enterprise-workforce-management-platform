/**
 * Main Layout wrapper — renders the persistent Sidebar + Header shell
 * around every authenticated route, with a responsive mobile drawer.
 */

import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

const MainLayout = ({ isAdmin = false }) => {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div className="min-h-screen relative" style={{ backgroundColor: '#0F172A' }}>
      {/* Ambient background glow, quiet and enterprise-appropriate */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            radial-gradient(circle at 15% 0%, rgba(59, 130, 246, 0.08), transparent 40%),
            radial-gradient(circle at 85% 20%, rgba(139, 92, 246, 0.06), transparent 40%)
          `,
        }}
      />

      <Sidebar isAdmin={isAdmin} isOpen={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />

      <div className="lg:pl-64 relative z-10">
        <Header onMenuClick={() => setMobileNavOpen(true)} />
        <main className="w-full text-[#F8FAFC]">
          <div className="p-4 sm:p-6 lg:p-10 max-w-[1600px] mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
