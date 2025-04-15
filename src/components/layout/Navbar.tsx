
import React, { useState } from "react";
import { Bell, Plus, Mail, User, Settings, Search, Menu, LogOut, X } from "lucide-react";
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

const Navbar: React.FC<NavbarProps> = ({ toggleSidebar }) => {
  const [searchValue, setSearchValue] = useState("");
  const { logout } = useAuth();
  const { toast } = useToast();

  // Notification data
  const notifications = [
    { id: 1, title: "New client added", description: "James Peterson was added as a client", time: "10 min ago", unread: true },
    { id: 2, title: "Document update", description: "Insurance document for Maria Rodriguez was updated", time: "30 min ago", unread: true },
    { id: 3, title: "Billing reminder", description: "Client billing for May is due tomorrow", time: "1 hour ago", unread: false },
  ];

  // Messages data
  const messages = [
    { id: 1, from: "Robert Johnson", message: "Can you send me the latest case details?", time: "15 min ago", unread: true },
    { id: 2, from: "Sarah Williams", message: "Thanks for the update on my case.", time: "1 hour ago", unread: true },
    { id: 3, from: "David Miller", message: "When will the medical report be ready?", time: "3 hours ago", unread: false },
  ];

  const handleQuickAction = (action: string) => {
    toast({
      title: action,
      description: `${action} feature has been triggered`,
    });
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={toggleSidebar} className="md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
          <div className="font-semibold text-xl flex items-center gap-2">
            <div className="w-8 h-8 bg-lawfirm-light-blue rounded-md flex items-center justify-center text-white">
              LYZ
            </div>
            <div className="flex flex-col">
              <span className="hidden md:inline-block leading-tight">LYZ LAW FIRM</span>
              <span className="hidden md:inline-block text-xs text-gray-500">LAW EMR 500</span>
            </div>
          </div>
        </div>
        
        <div className="hidden md:flex flex-1 mx-8">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search cases, clients, documents..."
              className="w-full bg-background pl-8 md:w-[300px] lg:w-[400px]"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
          </div>
        </div>
        
        <div className="flex items-center gap-2 md:gap-4">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-lawfirm-neutral-gray relative">
                <Plus className="h-5 w-5" />
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
              <Button variant="ghost" size="icon" className="text-lawfirm-neutral-gray relative">
                <Bell className="h-5 w-5" />
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
                  <Button variant="ghost" size="sm" onClick={() => toast({ title: "Marked all as read" })}>
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
              <Button variant="ghost" size="icon" className="text-lawfirm-neutral-gray relative">
                <Mail className="h-5 w-5" />
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
                  <Button variant="ghost" size="sm" onClick={() => toast({ title: "Marked all as read" })}>
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
                        <Button variant="outline" size="sm" onClick={() => toast({ title: `Replied to ${message.from}` })}>
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
              <Button variant="ghost" size="icon" className="text-lawfirm-neutral-gray">
                <Settings className="h-5 w-5" />
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
                    <Button variant="outline" className="w-full justify-start" onClick={() => toast({ title: "Profile settings opened" })}>
                      Profile Settings
                    </Button>
                    <Button variant="outline" className="w-full justify-start" onClick={() => toast({ title: "Notification preferences opened" })}>
                      Notification Preferences
                    </Button>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">System Settings</h4>
                    <Button variant="outline" className="w-full justify-start" onClick={() => toast({ title: "Display settings opened" })}>
                      Display & Accessibility
                    </Button>
                    <Button variant="outline" className="w-full justify-start" onClick={() => toast({ title: "Security settings opened" })}>
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
              <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                <Avatar className="h-9 w-9">
                  <AvatarImage src="" />
                  <AvatarFallback className="bg-lawfirm-light-blue text-white">AT</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
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
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search..."
            className="w-full pl-8"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </div>
      </div>
    </header>
  );
};

export default Navbar;
