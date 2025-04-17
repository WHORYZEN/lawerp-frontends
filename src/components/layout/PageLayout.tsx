
import React from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import MainContent from './MainContent';
import { useSidebar } from '@/hooks/use-sidebar';

interface PageLayoutProps {
  children: React.ReactNode;
}

const PageLayout: React.FC<PageLayoutProps> = ({ children }) => {
  const { isSidebarOpen, isMobile, toggleSidebar, closeSidebar } = useSidebar();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar toggleSidebar={toggleSidebar} />
      <div className="flex flex-1">
        <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
        <MainContent isSidebarOpen={isSidebarOpen} isMobile={isMobile}>
          {children}
        </MainContent>
      </div>
    </div>
  );
};

export default PageLayout;
