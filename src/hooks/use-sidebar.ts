
import { useState, useEffect } from 'react';

interface UseSidebarProps {
  initialState?: boolean;
  mobileBreakpoint?: number;
}

export function useSidebar({ 
  initialState = false, 
  mobileBreakpoint = 1024 
}: UseSidebarProps = {}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(initialState);
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkIfMobile = () => {
      const isMobileView = window.innerWidth < mobileBreakpoint;
      setIsMobile(isMobileView);
      
      if (isMobileView) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };
    
    checkIfMobile();
    
    window.addEventListener('resize', checkIfMobile);
    
    return () => window.removeEventListener('resize', checkIfMobile);
  }, [mobileBreakpoint]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  
  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return {
    isSidebarOpen,
    isMobile,
    toggleSidebar,
    closeSidebar
  };
}
