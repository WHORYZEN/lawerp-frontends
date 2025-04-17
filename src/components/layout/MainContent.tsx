
import React from 'react';

interface MainContentProps {
  children: React.ReactNode;
  isSidebarOpen: boolean;
  isMobile: boolean;
}

const MainContent: React.FC<MainContentProps> = ({ 
  children, 
  isSidebarOpen, 
  isMobile 
}) => {
  return (
    <main 
      className={`flex-1 pt-16 bg-gray-50 transition-all duration-300 ${
        isSidebarOpen && !isMobile ? 'ml-64' : 'ml-0'
      }`}
    >
      <div className="container mx-auto p-4">
        {children}
      </div>
    </main>
  );
};

export default MainContent;
