
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Home,
  FolderOpen,
  FileText,
  Users,
  BarChart4,
  Calculator,
  ChevronDown,
  ChevronRight,
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

  return (
    <>
      {/* Sidebar backdrop for mobile */}
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
              label="Home"
              to="/"
              active={location.pathname === "/"}
            />

            <NavItem
              icon={<FolderOpen className="h-5 w-5" />}
              label="Files"
              hasSubmenu
            >
              <SubNavItem label="Clients" />
              <SubNavItem label="Sheet" />
            </NavItem>

            <NavItem
              icon={<FileText className="h-5 w-5" />}
              label="Documents"
              hasSubmenu
            >
              <SubNavItem label="LOR" />
              <SubNavItem label="LOP" />
              <SubNavItem label="Insurance" />
              <SubNavItem label="Bills" />
            </NavItem>

            <NavItem
              icon={<Users className="h-5 w-5" />}
              label="Clients"
              hasSubmenu
            >
              <SubNavItem label="Commercial" />
              <SubNavItem label="Private" />
              <SubNavItem label="Accident" />
              <SubNavItem label="Personal Injuries" />
              <SubNavItem label="Third Party Injuries" />
            </NavItem>

            <NavItem
              icon={<BarChart4 className="h-5 w-5" />}
              label="Reports"
              hasSubmenu
            >
              <SubNavItem label="Medical Reports" />
              <SubNavItem label="Reduction Statements" />
            </NavItem>

            <NavItem
              icon={<Calculator className="h-5 w-5" />}
              label="AT Lien Reduction Calculator"
              to="/calculator"
              active={location.pathname === "/calculator"}
            />
          </nav>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
