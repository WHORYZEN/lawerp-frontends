
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import UsersManagement from './UsersManagement';
import RolesManagement from './RolesManagement';
import AuditLogs from './AuditLogs';
import SystemSettings from './SystemSettings';
import { UserCog, Shield, ClipboardList, Settings, Users, FileText, Receipt, Calculator } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('users');
  const { toast } = useToast();

  const featureLinks = [
    { id: 'patients', label: 'Patients Portal', icon: Users, path: '/patients', description: 'Manage the patient portal experience' },
    { id: 'clients', label: 'Clients', icon: Users, path: '/clients', description: 'Oversee client information and cases' },
    { id: 'attorneys', label: 'Attorneys', icon: Users, path: '/attorneys', description: 'Manage attorney profiles and assignments' },
    { id: 'depositions', label: 'Depositions', icon: FileText, path: '/depositions', description: 'Coordinate deposition schedules and records' },
    { id: 'billing', label: 'Billing & Settlements', icon: Receipt, path: '/billing', description: 'Review billing status and settlement details' },
    { id: 'calculator', label: 'AI Lien Reduction Calculator', icon: Calculator, path: '/calculator', description: 'Configure AI-powered lien reduction tools' },
  ];

  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-lawfirm-dark-purple">Admin Panel</h1>
          <p className="text-lawfirm-neutral-gray mt-1">Manage system users, roles and monitor system activity</p>
        </div>
        <div className="mt-4 md:mt-0">
          <button 
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-md hover:from-purple-600 hover:to-indigo-700 transition-all shadow-md"
            onClick={() => toast({
              title: "Coming Soon",
              description: "User creation will be available in the next update.",
            })}
          >
            <UserCog className="h-5 w-5" />
            <span>Add User</span>
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {featureLinks.map((feature) => (
          <Link to={feature.path} key={feature.id} className="no-underline">
            <Card className="h-full hover:shadow-lg transition-shadow border border-purple-100 hover:border-purple-200">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2">
                  <feature.icon className="h-5 w-5 text-purple-600" />
                  <span>{feature.label}</span>
                </CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-right">
                  <span className="text-purple-600 font-medium">Manage →</span>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
      
      <Card className="border-none shadow-lg bg-white overflow-hidden rounded-xl">
        <CardHeader className="bg-gradient-to-r from-purple-100 to-indigo-100 pb-8 border-b border-purple-200">
          <CardTitle className="flex items-center gap-2 text-2xl text-indigo-800">
            <Shield className="h-6 w-6 text-purple-600" />
            System Administration
          </CardTitle>
          <CardDescription className="text-indigo-700/80">
            Comprehensive tools to manage system access, permissions and security
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="border-b border-gray-200">
              <div className="px-6">
                <TabsList className="h-14 w-full bg-transparent justify-start gap-8 mb-[-1px]">
                  <TabsTrigger 
                    value="users" 
                    className="data-[state=active]:border-b-2 data-[state=active]:border-purple-500 data-[state=active]:text-purple-700 data-[state=active]:bg-transparent rounded-none h-14 px-4 py-2 font-medium transition-all"
                  >
                    <UserCog className="mr-2 h-5 w-5" />
                    <span>Users & Permissions</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="roles" 
                    className="data-[state=active]:border-b-2 data-[state=active]:border-purple-500 data-[state=active]:text-purple-700 data-[state=active]:bg-transparent rounded-none h-14 px-4 py-2 font-medium transition-all"
                  >
                    <Shield className="mr-2 h-5 w-5" />
                    <span>Roles</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="logs" 
                    className="data-[state=active]:border-b-2 data-[state=active]:border-purple-500 data-[state=active]:text-purple-700 data-[state=active]:bg-transparent rounded-none h-14 px-4 py-2 font-medium transition-all"
                  >
                    <ClipboardList className="mr-2 h-5 w-5" />
                    <span>Audit Logs</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="settings" 
                    className="data-[state=active]:border-b-2 data-[state=active]:border-purple-500 data-[state=active]:text-purple-700 data-[state=active]:bg-transparent rounded-none h-14 px-4 py-2 font-medium transition-all"
                  >
                    <Settings className="mr-2 h-5 w-5" />
                    <span>System Settings</span>
                  </TabsTrigger>
                </TabsList>
              </div>
            </div>
            
            <div>
              <TabsContent value="users" className="m-0 p-6">
                <UsersManagement />
              </TabsContent>
              
              <TabsContent value="roles" className="m-0 p-6">
                <RolesManagement />
              </TabsContent>
              
              <TabsContent value="logs" className="m-0 p-6">
                <AuditLogs />
              </TabsContent>
              
              <TabsContent value="settings" className="m-0 p-6">
                <SystemSettings />
              </TabsContent>
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
