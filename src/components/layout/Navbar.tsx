
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, Plus, Mail, User, Settings, Search, Menu, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface NavbarProps {
  toggleSidebar: () => void;
}

// Define searchable content types
type SearchableItem = {
  id: string;
  type: 'client' | 'case' | 'attorney' | 'document';
  title: string;
  subtitle?: string;
  route: string;
};

const Navbar: React.FC<NavbarProps> = ({ toggleSidebar }) => {
  const [searchValue, setSearchValue] = useState("");
  const [searchResults, setSearchResults] = useState<SearchableItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const { logout } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Mock search data - in a real app, this would come from your API
  const mockSearchData: SearchableItem[] = [
    { id: '1', type: 'client', title: 'James Peterson', subtitle: 'Personal Injury', route: '/clients/1' },
    { id: '2', type: 'client', title: 'Maria Rodriguez', subtitle: 'Corporate Law', route: '/clients/2' },
    { id: '3', type: 'case', title: 'Peterson vs. Insurance Co', subtitle: 'Active', route: '/cases/1' },
    { id: '4', type: 'attorney', title: 'Rachel Green', subtitle: 'Partner', route: '/attorneys?tab=all' },
    { id: '5', type: 'attorney', title: 'Mark Johnson', subtitle: 'Associate', route: '/attorneys?tab=all' },
    { id: '6', type: 'document', title: 'Insurance Policy #123', subtitle: 'Peterson case', route: '/documents?tab=insurance' },
  ];

  // Search functionality
  useEffect(() => {
    if (searchValue.trim().length > 0) {
      setIsSearching(true);
      // Simulate API delay
      const timer = setTimeout(() => {
        const results = mockSearchData.filter(item => 
          item.title.toLowerCase().includes(searchValue.toLowerCase()) || 
          item.subtitle?.toLowerCase().includes(searchValue.toLowerCase())
        );
        setSearchResults(results);
        setIsSearching(false);
        setShowSearchResults(true);
      }, 300);
      
      return () => clearTimeout(timer);
    } else {
      setShowSearchResults(false);
      setSearchResults([]);
    }
  }, [searchValue]);

  const handleSearchSelect = (item: SearchableItem) => {
    setSearchValue("");
    setShowSearchResults(false);
    navigate(item.route);
    toast({
      title: `Navigating to ${item.title}`,
      description: `Opening ${item.type}: ${item.title}`,
    });
  };

  const notifications = [
    { id: 1, title: "New client added", description: "James Peterson was added as a client", time: "10 min ago", unread: true },
    { id: 2, title: "Document update", description: "Insurance document for Maria Rodriguez was updated", time: "30 min ago", unread: true },
    { id: 3, title: "Billing reminder", description: "Client billing for May is due tomorrow", time: "1 hour ago", unread: false },
  ];

  const messages = [
    { id: 1, from: "Robert Johnson", message: "Can you send me the latest case details?", time: "15 min ago", unread: true },
    { id: 2, from: "Sarah Williams", message: "Thanks for the update on my case.", time: "1 hour ago", unread: true },
    { id: 3, from: "David Miller", message: "When will the medical report be ready?", time: "3 hours ago", unread: false },
  ];

  const handleReadAllNotifications = () => {
    toast({
      title: "Marked all as read",
      description: "All notifications have been marked as read"
    });
  };

  const handleReadAllMessages = () => {
    toast({
      title: "Marked all as read",
      description: "All messages have been marked as read"
    });
  };
  
  const handleQuickAction = (action: string) => {
    toast({
      title: action,
      description: `${action} feature has been triggered`,
    });
    
    // Navigate based on the action
    switch(action) {
      case "Add new client":
        navigate("/clients/new");
        break;
      case "Create new billing":
        navigate("/billing/new");
        break;
      case "Upload document":
        navigate("/documents?tab=upload");
        break;
      case "Generate report":
        navigate("/reports");
        break;
      default:
        break;
    }
  };

  const handleReplyToMessage = (from: string) => {
    toast({ 
      title: `Replied to ${from}`,
      description: `Your reply has been sent to ${from}`
    });
  };

  const handleSettingsAction = (setting: string) => {
    toast({ 
      title: `${setting} opened`,
      description: `Opening ${setting.toLowerCase()} preferences`
    });
    navigate("/settings");
  };

  return (
    <header 
      className="fixed top-0 left-0 right-0 z-50 w-full border-b border-border/40 bg-[#8A2BE2] backdrop-blur supports-[backdrop-filter]:bg-[#8A2BE2]/60"
      style={{ backgroundColor: '#8A2BE2' }}
    >
      <div className="flex h-16 items-center justify-between px-4 md:px-6 text-white">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={toggleSidebar} className="md:hidden text-white hover:bg-[#9F5AE0]">
            <Menu className="h-5 w-5 text-white" />
            <span className="sr-only">Toggle menu</span>
          </Button>
          <div className="font-semibold text-xl flex items-center gap-2">
            <div className="w-8 h-8 bg-white/20 rounded-md flex items-center justify-center text-white">
              LYZ
            </div>
            <div className="flex flex-col">
              <span className="hidden md:inline-block leading-tight text-white">LYZ LAW FIRM</span>
              <span className="hidden md:inline-block text-xs text-white/70">LAW ERP 500</span>
            </div>
          </div>
        </div>
        
        <div className="hidden md:flex flex-1 mx-8 relative">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-white/70" />
            <Input
              type="search"
              placeholder="Search cases, clients, documents..."
              className="w-full bg-white/20 text-white placeholder:text-white pl-8 md:w-[300px] lg:w-[400px] border-white/30 focus:border-white/40 hover:bg-white/30"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onFocus={() => { if (searchResults.length > 0) setShowSearchResults(true) }}
              onBlur={() => {
                // Delay hiding results to allow for clicks
                setTimeout(() => setShowSearchResults(false), 200)
              }}
            />
            
            {showSearchResults && (
              <div className="absolute top-full left-0 right-0 mt-1 p-2 bg-white rounded-md shadow-lg z-50 max-h-[300px] overflow-y-auto">
                {isSearching ? (
                  <div className="flex justify-center items-center py-4">
                    <p className="text-sm text-gray-500">Searching...</p>
                  </div>
                ) : searchResults.length > 0 ? (
                  <div className="space-y-1">
                    {searchResults.map((result) => (
                      <div
                        key={`${result.type}-${result.id}`}
                        className="flex items-center p-2 hover:bg-gray-100 rounded cursor-pointer"
                        onClick={() => handleSearchSelect(result)}
                      >
                        <div className="w-8 flex-shrink-0">
                          {result.type === 'client' && <User className="h-4 w-4 text-blue-500" />}
                          {result.type === 'case' && <Settings className="h-4 w-4 text-green-500" />}
                          {result.type === 'attorney' && <Mail className="h-4 w-4 text-purple-500" />}
                          {result.type === 'document' && <Bell className="h-4 w-4 text-orange-500" />}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{result.title}</p>
                          {result.subtitle && (
                            <p className="text-xs text-gray-500">{result.subtitle}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex justify-center items-center py-4">
                    <p className="text-sm text-gray-500">No results found</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-2 md:gap-4">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-white hover:bg-[#9F5AE0]">
                <Plus className="h-5 w-5 text-white" />
                <span className="sr-only">Quick Actions</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader>
                <SheetTitle>Quick Actions</SheetTitle>
              </SheetHeader>
              <div className="grid gap-4 py-4">
                <Button className="w-full" onClick={() => handleQuickAction("Add new client")}>
                  Add New Client
                </Button>
                <Button className="w-full" onClick={() => handleQuickAction("Create new billing")}>
                  Create New Billing
                </Button>
                <Button className="w-full" onClick={() => handleQuickAction("Upload document")}>
                  Upload Document
                </Button>
                <Button className="w-full" onClick={() => handleQuickAction("Generate report")}>
                  Generate Report
                </Button>
              </div>
            </SheetContent>
          </Sheet>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-white hover:bg-[#9F5AE0] relative">
                <Bell className="h-5 w-5 text-white" />
                {notifications.filter(n => n.unread).length > 0 && (
                  <Badge variant="destructive" className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-[10px]">
                    {notifications.filter(n => n.unread).length}
                  </Badge>
                )}
                <span className="sr-only">Notifications</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader>
                <div className="flex items-center justify-between">
                  <SheetTitle>Notifications</SheetTitle>
                  <Button variant="ghost" size="sm" onClick={handleReadAllNotifications}>
                    Mark all as read
                  </Button>
                </div>
              </SheetHeader>
              <div className="mt-4 space-y-4">
                {notifications.length > 0 ? (
                  notifications.map((notification) => (
                    <div 
                      key={notification.id} 
                      className={cn(
                        "p-3 rounded-lg border",
                        notification.unread ? "bg-muted/50 border-muted-foreground/20" : "border-transparent"
                      )}
                    >
                      <div className="flex justify-between items-start">
                        <h4 className={cn("text-sm font-medium", notification.unread && "font-semibold")}>
                          {notification.title}
                        </h4>
                        <span className="text-xs text-muted-foreground">{notification.time}</span>
                      </div>
                      <p className="text-sm mt-1 text-muted-foreground">{notification.description}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-muted-foreground py-8">No notifications</p>
                )}
              </div>
            </SheetContent>
          </Sheet>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-white hover:bg-[#9F5AE0] relative">
                <Mail className="h-5 w-5 text-white" />
                {messages.filter(m => m.unread).length > 0 && (
                  <Badge variant="destructive" className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-[10px]">
                    {messages.filter(m => m.unread).length}
                  </Badge>
                )}
                <span className="sr-only">Messages</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader>
                <div className="flex items-center justify-between">
                  <SheetTitle>Messages</SheetTitle>
                  <Button variant="ghost" size="sm" onClick={handleReadAllMessages}>
                    Mark all as read
                  </Button>
                </div>
              </SheetHeader>
              <div className="mt-4 space-y-4">
                {messages.length > 0 ? (
                  messages.map((message) => (
                    <div 
                      key={message.id} 
                      className={cn(
                        "p-3 rounded-lg border",
                        message.unread ? "bg-muted/50 border-muted-foreground/20" : "border-transparent"
                      )}
                    >
                      <div className="flex justify-between items-start">
                        <h4 className={cn("text-sm font-medium", message.unread && "font-semibold")}>
                          {message.from}
                        </h4>
                        <span className="text-xs text-muted-foreground">{message.time}</span>
                      </div>
                      <p className="text-sm mt-1 text-muted-foreground">{message.message}</p>
                      <div className="mt-2 flex justify-end gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleReplyToMessage(message.from)}
                        >
                          Reply
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-muted-foreground py-8">No messages</p>
                )}
              </div>
            </SheetContent>
          </Sheet>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-white hover:bg-[#9F5AE0]">
                <Settings className="h-5 w-5 text-white" />
                <span className="sr-only">Settings</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader>
                <SheetTitle>Settings</SheetTitle>
              </SheetHeader>
              <div className="py-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Account Settings</h4>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start" 
                      onClick={() => handleSettingsAction("Profile settings")}
                    >
                      Profile Settings
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start" 
                      onClick={() => handleSettingsAction("Notification preferences")}
                    >
                      Notification Preferences
                    </Button>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">System Settings</h4>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start" 
                      onClick={() => handleSettingsAction("Display settings")}
                    >
                      Display & Accessibility
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start" 
                      onClick={() => handleSettingsAction("Security settings")}
                    >
                      Security & Privacy
                    </Button>
                  </div>
                  
                  <div className="pt-4">
                    <Button 
                      variant="destructive" 
                      className="w-full" 
                      onClick={logout}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Log Out
                    </Button>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-9 w-9 rounded-full hover:bg-[#9F5AE0]">
                <Avatar className="h-9 w-9">
                  <AvatarImage src="" />
                  <AvatarFallback className="bg-white/20 text-white">AT</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleSettingsAction("Profile")}>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleSettingsAction("Settings")}>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      <div className="md:hidden px-4 pb-4">
        <div className="relative w-full">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-white/70" />
          <Input
            type="search"
            placeholder="Search..."
            className="w-full pl-8 bg-white/20 text-white placeholder:text-white border-white/30 focus:border-white/40 hover:bg-white/30"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
          
          {showSearchResults && searchValue.trim() !== "" && (
            <div className="absolute top-full left-0 right-0 mt-1 p-2 bg-white rounded-md shadow-lg z-50 max-h-[300px] overflow-y-auto">
              {isSearching ? (
                <div className="flex justify-center items-center py-4">
                  <p className="text-sm text-gray-500">Searching...</p>
                </div>
              ) : searchResults.length > 0 ? (
                <div className="space-y-1">
                  {searchResults.map((result) => (
                    <div
                      key={`${result.type}-${result.id}`}
                      className="flex items-center p-2 hover:bg-gray-100 rounded cursor-pointer"
                      onClick={() => handleSearchSelect(result)}
                    >
                      <div className="w-8 flex-shrink-0">
                        {result.type === 'client' && <User className="h-4 w-4 text-blue-500" />}
                        {result.type === 'case' && <Settings className="h-4 w-4 text-green-500" />}
                        {result.type === 'attorney' && <Mail className="h-4 w-4 text-purple-500" />}
                        {result.type === 'document' && <Bell className="h-4 w-4 text-orange-500" />}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{result.title}</p>
                        {result.subtitle && (
                          <p className="text-xs text-gray-500">{result.subtitle}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex justify-center items-center py-4">
                  <p className="text-sm text-gray-500">No results found</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
