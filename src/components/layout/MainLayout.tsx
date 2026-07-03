import React, { useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

export default function MainLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const isQualified = localStorage.getItem('isQualified') === 'true';

  useEffect(() => {
    // Also allow access to /qualification so they can see their reviewing status
    const allowedPaths = ['/dashboard', '/qualification-wizard', '/qualification'];
    if (!isQualified && !allowedPaths.includes(location.pathname)) {
      navigate('/dashboard');
    }
  }, [isQualified, location.pathname, navigate]);

  return (
    <div className="flex h-screen overflow-hidden bg-[#F8FAFC]">
      <Sidebar />
      <div className="flex-1 flex flex-col relative overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-8 relative">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
