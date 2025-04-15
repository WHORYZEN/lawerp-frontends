
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import {
  Home,
  FolderOpen,
  FileText,
  Users,
  BarChart4,
  Calculator,
  ChevronDown,
  ChevronRight,
  FileBarChart,
  FileDigit,
  FileCog,
  Calendar,
  MessageSquare,
  Bell,
  Settings,
  FileCheck,
  FileHeart,
  DollarSign,
  ClipboardList,
  UserCog,
  Building,
  Briefcase,
  Scale,
  Mail,
  LogOut
} from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  to?: string;
  active?: boolean;
  hasSubmenu?: boolean;
  children?: React.ReactNode;
  onClick?: () => void;
}

const NavItem = ({
  icon,
  label,
  to,
  active = false,
  hasSubmenu = false,
  children,
  onClick,
}: NavItemProps) => {
  const [isSubmenuOpen, setIsSubmenuOpen] = useState(false);

  const handleClick = () => {
    if (hasSubmenu) {
      setIsSubmenuOpen(!isSubmenuOpen);
    } else if (onClick) {
      onClick();
    }
  };

  const buttonContent = (
    <>
      {icon}
      <span className="text-sm">{label}</span>
      {hasSubmenu && (
        <span className="ml-auto">
          {isSubmenuOpen ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </span>
      )}
    </>
  );

  return (
    <div className="mb-1">
      {to ? (
        <Button
          asChild
          variant="ghost"
          className={cn(
            "w-full justify-start gap-3 px-3 font-normal",
            active && "bg-lawfirm-blue text-lawfirm-dark-purple"
          )}
        >
          <Link to={to}>{buttonContent}</Link>
        </Button>
      ) : (
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-start gap-3 px-3 font-normal",
            active && "bg-lawfirm-blue text-lawfirm-dark-purple",
            !hasSubmenu && "hover:bg-lawfirm-blue hover:text-lawfirm-dark-purple"
          )}
          onClick={handleClick}
        >
          {buttonContent}
        </Button>
      )}
      {hasSubmenu && isSubmenuOpen && (
        <div className="ml-9 mt-1 space-y-1">{children}</div>
      )}
    </div>
  );
};

const SubNavItem = ({ label, active = false, to }: { label: string; active?: boolean; to?: string }) => {
  const content = <span>{label}</span>;
  
  return to ? (
    <Button
      asChild
      variant="ghost"
      className={cn(
        "h-8 w-full justify-start px-0 font-normal",
        active && "text-lawfirm-light-blue",
        "hover:bg-transparent hover:text-lawfirm-light-blue text-sm"
      )}
    >
      <Link to={to}>{content}</Link>
    </Button>
  ) : (
    <Button
      variant="ghost"
      className={cn(
        "h-8 w-full justify-start px-0 font-normal",
        active && "text-lawfirm-light-blue",
        "hover:bg-transparent hover:text-lawfirm-light-blue text-sm"
      )}
    >
      {content}
    </Button>
  );
};

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation();
  const pathname = location.pathname;
  const urlParams = new URLSearchParams(location.search);
  const documentsTab = urlParams.get('tab');
  const filesTab = urlParams.get('tab');
  const clientsTab = urlParams.get('tab');
  const caseTab = urlParams.get('tab');
  const medicalTab = urlParams.get('tab');
  const billingTab = urlParams.get('tab');
  const calendarTab = urlParams.get('tab');
  const messagesTab = urlParams.get('tab');
  const adminTab = urlParams.get('tab');
  const { logout } = useAuth();

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
          onClick={onClose}
        />
      )}
      
      <aside
        className={cn(
          "fixed top-0 bottom-0 left-0 z-50 mt-16 w-64 border-r bg-white transition-transform md:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="h-full overflow-auto py-4">
          <nav className="space-y-1 px-3">
            <NavItem
              icon={<Home className="h-5 w-5" />}
              label="Dashboard"
              to="/dashboard"
              active={pathname === "/dashboard"}
            />

            <NavItem
              icon={<Users className="h-5 w-5" />}
              label="Clients"
              to="/clients"
              active={pathname === "/clients" || pathname.startsWith("/clients/")}
              hasSubmenu
            >
              <SubNavItem 
                label="All Clients" 
                to="/clients" 
                active={pathname === "/clients" && !clientsTab} 
              />
              <SubNavItem 
                label="Add Client" 
                to="/clients/add" 
                active={pathname === "/clients/add"} 
              />
              <SubNavItem 
                label="Commercial" 
                to="/clients?filter=commercial" 
                active={pathname === "/clients" && urlParams.get('filter') === "commercial"} 
              />
              <SubNavItem 
                label="Private" 
                to="/clients?filter=private" 
                active={pathname === "/clients" && urlParams.get('filter') === "private"} 
              />
              <SubNavItem 
                label="Accident" 
                to="/clients?filter=accident" 
                active={pathname === "/clients" && urlParams.get('filter') === "accident"} 
              />
              <SubNavItem 
                label="Personal Injuries" 
                to="/clients?filter=personal-injuries" 
                active={pathname === "/clients" && urlParams.get('filter') === "personal-injuries"} 
              />
            </NavItem>

            <NavItem
              icon={<Briefcase className="h-5 w-5" />}
              label="Case Management"
              to="/cases"
              active={pathname === "/cases" || pathname.startsWith("/cases/")}
              hasSubmenu
            >
              <SubNavItem 
                label="All Cases" 
                to="/cases" 
                active={pathname === "/cases" && !caseTab} 
              />
              <SubNavItem 
                label="Create Case" 
                to="/cases/create" 
                active={pathname === "/cases/create"} 
              />
              <SubNavItem 
                label="Timeline" 
                to="/cases?tab=timeline" 
                active={pathname === "/cases" && caseTab === "timeline"} 
              />
              <SubNavItem 
                label="Assigned Staff" 
                to="/cases?tab=staff" 
                active={pathname === "/cases" && caseTab === "staff"} 
              />
            </NavItem>

            <NavItem
              icon={<FileText className="h-5 w-5" />}
              label="Documents"
              to="/documents"
              active={pathname === "/documents" || pathname.startsWith("/documents/")}
              hasSubmenu
            >
              <SubNavItem 
                label="Document Builder" 
                to="/documents/builder" 
                active={pathname === "/documents/builder"} 
              />
              <SubNavItem 
                label="Templates" 
                to="/documents/templates" 
                active={pathname === "/documents/templates"} 
              />
              <SubNavItem 
                label="LOP" 
                to="/documents?tab=lop" 
                active={pathname === "/documents" && documentsTab === "lop"} 
              />
              <SubNavItem 
                label="LOR" 
                to="/documents?tab=lor" 
                active={pathname === "/documents" && documentsTab === "lor"} 
              />
              <SubNavItem 
                label="Insurance" 
                to="/documents?tab=insurance" 
                active={pathname === "/documents" && documentsTab === "insurance"} 
              />
              <SubNavItem 
                label="Bills" 
                to="/documents?tab=bills" 
                active={pathname === "/documents" && documentsTab === "bills"} 
              />
              <SubNavItem 
                label="DocuSign" 
                to="/documents/sign" 
                active={pathname === "/documents/sign"} 
              />
            </NavItem>

            <NavItem
              icon={<FolderOpen className="h-5 w-5" />}
              label="Files"
              to="/files"
              active={pathname === "/files"}
              hasSubmenu
            >
              <SubNavItem 
                label="Master Dependency View" 
                to="/files?tab=dependency" 
                active={pathname === "/files" && (!filesTab || filesTab === "dependency")} 
              />
            </NavItem>

            <NavItem
              icon={<FileHeart className="h-5 w-5" />}
              label="Medical Management"
              to="/medical"
              active={pathname === "/medical" || pathname.startsWith("/medical/")}
              hasSubmenu
            >
              <SubNavItem 
                label="Medical Records" 
                to="/medical/records" 
                active={pathname === "/medical/records"} 
              />
              <SubNavItem 
                label="Upload Documents" 
                to="/medical/upload" 
                active={pathname === "/medical/upload"} 
              />
              <SubNavItem 
                label="Treatment Timeline" 
                to="/medical/timeline" 
                active={pathname === "/medical/timeline"} 
              />
              <SubNavItem 
                label="Providers" 
                to="/medical/providers" 
                active={pathname === "/medical/providers"} 
              />
              <SubNavItem 
                label="Expenses Tracker" 
                to="/medical/expenses" 
                active={pathname === "/medical/expenses"} 
              />
            </NavItem>

            <NavItem
              icon={<DollarSign className="h-5 w-5" />}
              label="Billing & Settlements"
              to="/billing"
              active={pathname === "/billing" || pathname.startsWith("/billing/")}
              hasSubmenu
            >
              <SubNavItem 
                label="Invoices" 
                to="/billing" 
                active={pathname === "/billing" && !billingTab} 
              />
              <SubNavItem 
                label="Add Invoice" 
                to="/billing/add" 
                active={pathname === "/billing/add"} 
              />
              <SubNavItem 
                label="Settlements" 
                to="/billing/settlements" 
                active={pathname === "/billing/settlements"} 
              />
              <SubNavItem 
                label="Letters" 
                to="/billing/letters" 
                active={pathname === "/billing/letters"} 
              />
            </NavItem>

            <NavItem
              icon={<Calculator className="h-5 w-5" />}
              label="AI Lien Reduction Calculator"
              to="/calculator"
              active={pathname === "/calculator"}
            />

            <NavItem
              icon={<BarChart4 className="h-5 w-5" />}
              label="Reports"
              to="/reports"
              active={pathname === "/reports"}
              hasSubmenu
            >
              <SubNavItem 
                label="Medical Reports" 
                to="/reports" 
                active={pathname === "/reports" && (!urlParams.has('tab') || urlParams.get('tab') === 'medical')} 
              />
              <SubNavItem 
                label="Reduction Statements" 
                to="/reports?tab=reduction" 
                active={pathname === "/reports" && urlParams.get('tab') === 'reduction'} 
              />
            </NavItem>

            <NavItem
              icon={<Calendar className="h-5 w-5" />}
              label="Calendar & Tasks"
              to="/calendar"
              active={pathname === "/calendar" || pathname.startsWith("/calendar/")}
              hasSubmenu
            >
              <SubNavItem 
                label="Calendar View" 
                to="/calendar" 
                active={pathname === "/calendar" && !calendarTab} 
              />
              <SubNavItem 
                label="Create Task" 
                to="/calendar/task/create" 
                active={pathname === "/calendar/task/create"} 
              />
              <SubNavItem 
                label="Tasks by Staff" 
                to="/calendar/tasks" 
                active={pathname === "/calendar/tasks"} 
              />
              <SubNavItem 
                label="Google Sync" 
                to="/calendar/sync" 
                active={pathname === "/calendar/sync"} 
              />
            </NavItem>

            <NavItem
              icon={<MessageSquare className="h-5 w-5" />}
              label="Messaging"
              to="/messages"
              active={pathname === "/messages" || pathname.startsWith("/messages/")}
              hasSubmenu
            >
              <SubNavItem 
                label="Chat" 
                to="/messages" 
                active={pathname === "/messages" && !messagesTab} 
              />
              <SubNavItem 
                label="SMS Logs" 
                to="/messages/sms" 
                active={pathname === "/messages/sms"} 
              />
              <SubNavItem 
                label="Email Logs" 
                to="/messages/email" 
                active={pathname === "/messages/email"} 
              />
            </NavItem>

            <NavItem
              icon={<UserCog className="h-5 w-5" />}
              label="Admin Panel"
              to="/admin"
              active={pathname === "/admin" || pathname.startsWith("/admin/")}
              hasSubmenu
            >
              <SubNavItem 
                label="Users & Permissions" 
                to="/admin/users" 
                active={pathname === "/admin/users"} 
              />
              <SubNavItem 
                label="Roles" 
                to="/admin/roles" 
                active={pathname === "/admin/roles"} 
              />
              <SubNavItem 
                label="Audit Logs" 
                to="/admin/logs" 
                active={pathname === "/admin/logs"} 
              />
            </NavItem>

            <div className="pt-6 mt-6 border-t">
              <NavItem
                icon={<Settings className="h-5 w-5" />}
                label="Settings"
                to="/settings"
                active={pathname === "/settings"}
              />
              
              <NavItem
                icon={<LogOut className="h-5 w-5" />}
                label="Sign Out"
                onClick={logout}
              />
            </div>
          </nav>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
