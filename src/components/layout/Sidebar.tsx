import React, { useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  LayoutDashboard, 
  Users, 
  Folder, 
  FileText, 
  Calculator, 
  Calendar, 
  MessageSquare, 
  ClipboardCheck, 
  Settings,
  Stethoscope,
  DollarSign,
  FileStack,
  Video,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation();
  const { currentUser } = useAuth();

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  const menuItems = useMemo(() => {
    const allItems = [
      { 
        path: '/dashboard', 
        label: 'Dashboard', 
        icon: <LayoutDashboard className="h-5 w-5" />,
        roles: ['admin', 'attorney', 'paralegal', 'staff', 'pending_admin']
      },
      { 
        path: '/clients', 
        label: 'Clients', 
        icon: <Users className="h-5 w-5" />,
        roles: ['admin', 'attorney', 'paralegal']
      },
      { 
        path: '/cases', 
        label: 'Cases', 
        icon: <Folder className="h-5 w-5" />,
        roles: ['admin', 'attorney', 'paralegal']
      },
      { 
        path: '/documents', 
        label: 'Documents', 
        icon: <FileText className="h-5 w-5" />,
        roles: ['admin', 'attorney', 'paralegal']
      },
      { 
        path: '/files', 
        label: 'Files', 
        icon: <FileStack className="h-5 w-5" />,
        roles: ['admin', 'attorney', 'paralegal']
      },
      { 
        path: '/medical', 
        label: 'Medical', 
        icon: <Stethoscope className="h-5 w-5" />,
        roles: ['admin', 'attorney', 'paralegal']
      },
      { 
        path: '/billing', 
        label: 'Billing', 
        icon: <DollarSign className="h-5 w-5" />,
        roles: ['admin', 'attorney']
      },
      { 
        path: '/calculator', 
        label: 'Calculator', 
        icon: <Calculator className="h-5 w-5" />,
        roles: ['admin', 'attorney', 'paralegal']
      },
      { 
        path: '/reports', 
        label: 'Reports', 
        icon: <ClipboardCheck className="h-5 w-5" />,
        roles: ['admin', 'attorney']
      },
      { 
        path: '/calendar', 
        label: 'Calendar', 
        icon: <Calendar className="h-5 w-5" />,
        roles: ['admin', 'attorney', 'paralegal', 'staff']
      },
      { 
        path: '/messages', 
        label: 'Messages', 
        icon: <MessageSquare className="h-5 w-5" />,
        roles: ['admin', 'attorney', 'paralegal', 'staff']
      },
      { 
        path: '/depositions', 
        label: 'Depositions', 
        icon: <Video className="h-5 w-5" />,
        roles: ['admin', 'attorney', 'paralegal']
      },
      { 
        path: '/admin', 
        label: 'Admin', 
        icon: <ShieldCheck className="h-5 w-5" />,
        roles: ['admin']
      },
      { 
        path: '/settings', 
        label: 'Settings', 
        icon: <Settings className="h-5 w-5" />,
        roles: ['admin', 'attorney', 'paralegal', 'staff', 'pending_admin']
      },
    ];

    if (!currentUser) return allItems;

    // Filter menu items based on user role
    return allItems.filter(item => {
      // Admin sees everything
      if (currentUser.role === 'admin') return true;
      
      // Other roles see only what they're allowed to
      return item.roles.includes(currentUser.role);
    });
  }, [currentUser]);

  const renderMenuItems = () => {
    return menuItems.map((item) => (
      <Link
        key={item.path}
        to={item.path}
        onClick={() => onClose()}
      >
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-start mb-1",
            isActive(item.path) ? "bg-purple-100 text-purple-900" : "text-gray-600 hover:text-purple-900 hover:bg-purple-50"
          )}
        >
          {item.icon}
          <span className="ml-2">{item.label}</span>
        </Button>
      </Link>
    ));
  };

  return (
    <>
      {/* Backdrop for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
          onClick={onClose}
        />
      )}
      
      <aside
        className={cn(
          "fixed top-0 bottom-0 left-0 z-40 pt-16 w-64 border-r bg-white transition-transform md:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          <div className="px-3 py-2">
            <div className="mb-2 flex items-center px-2">
              <h2 className="text-xl font-semibold text-gray-800">Law ERP</h2>
            </div>
            
            {currentUser && (
              <div className="mb-4 px-2">
                <div className="font-medium text-sm text-gray-500">Logged in as:</div>
                <div className="font-semibold">{currentUser.email}</div>
                <div className="text-xs bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full inline-block mt-1">
                  {currentUser.role === 'pending_admin' 
                    ? 'Pending Admin Approval' 
                    : currentUser.role.charAt(0).toUpperCase() + currentUser.role.slice(1)}
                </div>
              </div>
            )}
          </div>
          
          <ScrollArea className="flex-1 px-3">
            <div className="py-2">{renderMenuItems()}</div>
          </ScrollArea>
          
          <div className="p-3 mt-auto border-t">
            <Button
              variant="outline"
              className="w-full text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
              onClick={onClose}
            >
              <span>Close Sidebar</span>
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
