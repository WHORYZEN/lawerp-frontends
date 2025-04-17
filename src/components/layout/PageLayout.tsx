import React from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import MainContent from './MainContent';
import { useLayoutSize } from '@/hooks/useLayoutSize';

interface PageLayoutProps {
  children: React.ReactNode;
}

const PageLayout: React.FC<PageLayoutProps> = ({ children }) => {
  const { isSidebarOpen, isMobile, setIsSidebarOpen, toggleSidebar } = useLayoutSize();

  return (
    <div className="min-h-screen flex flex-col">
      <div className="sticky top-0 z-50 w-full">
        <Navbar toggleSidebar={toggleSidebar} />
      </div>
      <div className="flex flex-1 h-[calc(100vh-4rem)]">
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        <MainContent isSidebarOpen={isSidebarOpen} isMobile={isMobile}>
          {children}
        </MainContent>
      </div>
    </div>
  );
};

export default PageLayout;
