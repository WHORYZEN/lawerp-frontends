
import React from 'react';

interface MainContentProps {
  children: React.ReactNode;
  isSidebarOpen: boolean;
  isMobile: boolean;
}

const MainContent: React.FC<MainContentProps> = ({ children, isSidebarOpen, isMobile }) => {
  return (
    <main 
      className={`flex-1 bg-gray-50 overflow-y-auto transition-all duration-300 ${
        isSidebarOpen && !isMobile ? 'ml-64' : 'ml-0'
      }`}
    >
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {children}
      </div>
    </main>
  );
};

export default MainContent;
