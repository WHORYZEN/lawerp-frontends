
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import UsersManagement from './UsersManagement';
import RolesManagement from './RolesManagement';
import AuditLogs from './AuditLogs';
import { UserCog, Shield, ClipboardList } from 'lucide-react';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('users');

  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
          <p className="text-gray-500 mt-1">Manage system users, roles and monitor system activity</p>
        </div>
      </div>
      
      <Card className="border-none shadow-md bg-white overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-purple-100 to-indigo-100 pb-8">
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Shield className="h-6 w-6 text-purple-600" />
            System Administration
          </CardTitle>
          <CardDescription>
            Comprehensive tools to manage system access, permissions and security
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="border-b">
              <div className="px-6">
                <TabsList className="h-14 w-full bg-transparent justify-start gap-8 mb-[-1px]">
                  <TabsTrigger 
                    value="users" 
                    className="data-[state=active]:border-b-2 data-[state=active]:border-purple-500 data-[state=active]:text-purple-700 data-[state=active]:bg-transparent rounded-none h-14 px-4 py-2 font-medium"
                  >
                    <UserCog className="mr-2 h-5 w-5" />
                    <span>Users & Permissions</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="roles" 
                    className="data-[state=active]:border-b-2 data-[state=active]:border-purple-500 data-[state=active]:text-purple-700 data-[state=active]:bg-transparent rounded-none h-14 px-4 py-2 font-medium"
                  >
                    <Shield className="mr-2 h-5 w-5" />
                    <span>Roles</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="logs" 
                    className="data-[state=active]:border-b-2 data-[state=active]:border-purple-500 data-[state=active]:text-purple-700 data-[state=active]:bg-transparent rounded-none h-14 px-4 py-2 font-medium"
                  >
                    <ClipboardList className="mr-2 h-5 w-5" />
                    <span>Audit Logs</span>
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
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
