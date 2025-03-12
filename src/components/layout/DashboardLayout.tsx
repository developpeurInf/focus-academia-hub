
import React, { useState, useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useIsMobile } from '@/hooks/use-mobile';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { cn } from '@/lib/utils';

const DashboardLayout: React.FC = () => {
  const { user, isLoading } = useAuth();
  const location = useLocation();
  const isMobile = useIsMobile();
  const [isSidebarOpen, setSidebarOpen] = useState(!isMobile);
  
  // Close sidebar on mobile when route changes
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  }, [location.pathname, isMobile]);

  // Toggle sidebar
  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  };

  // If loading, show a loading spinner
  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="h-8 w-8 rounded-full border-4 border-t-focus-600 border-focus-200 animate-spin"></div>
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar onToggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
      <Sidebar isOpen={isSidebarOpen} />

      <main className={cn(
        "flex-1 pt-16 transition-all duration-300",
        isSidebarOpen ? "md:ml-64" : ""
      )}>
        <div className="container mx-auto p-4 md:p-6 max-w-7xl animate-fade-in">
          <Outlet />
        </div>
      </main>
      
      {/* Backdrop for mobile sidebar */}
      {isMobile && isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-10"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default DashboardLayout;
