
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { HelmetProvider } from 'react-helmet-async';
import ProtectedRoute from "./components/auth/ProtectedRoute";
import Index from "./pages/Index";
import Calculator from "./pages/Calculator";
import Clients from "./pages/Clients";
import Cases from "./pages/Cases";
import Reports from "./pages/Reports";
import Documents from "./pages/Documents";
import Files from "./pages/Files";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import Calendar from "./pages/Calendar";
import Billing from "./pages/Billing";
import Messages from "./pages/Messages";
import Admin from "./pages/Admin";
import Settings from "./pages/Settings";
import Medical from "./pages/Medical";

// Create a new QueryClient instance
const queryClient = new QueryClient();

function App() {
  return (
    <React.StrictMode>
      <HelmetProvider>
        <BrowserRouter>
          <QueryClientProvider client={queryClient}>
            <AuthProvider>
              <TooltipProvider>
                <Toaster />
                <Sonner />
                <Routes>
                  {/* Redirect root to dashboard (formerly redirected to login) */}
                  <Route path="/" element={<Navigate to="/dashboard" replace />} />
                  <Route path="/login" element={<Login />} />
                  
                  {/* Dashboard */}
                  <Route path="/dashboard" element={
                    <ProtectedRoute>
                      <Index />
                    </ProtectedRoute>
                  } />
                  
                  {/* Clients Management */}
                  <Route path="/clients" element={
                    <ProtectedRoute>
                      <Clients />
                    </ProtectedRoute>
                  } />
                  <Route path="/clients/add" element={
                    <ProtectedRoute>
                      <Clients />
                    </ProtectedRoute>
                  } />
                  <Route path="/clients/:id" element={
                    <ProtectedRoute>
                      <Clients />
                    </ProtectedRoute>
                  } />
                  
                  {/* Case Management */}
                  <Route path="/cases" element={
                    <ProtectedRoute>
                      <Cases />
                    </ProtectedRoute>
                  } />
                  <Route path="/cases/create" element={
                    <ProtectedRoute>
                      <Cases />
                    </ProtectedRoute>
                  } />
                  <Route path="/cases/:id" element={
                    <ProtectedRoute>
                      <Cases />
                    </ProtectedRoute>
                  } />
                  <Route path="/cases/:id/edit" element={
                    <ProtectedRoute>
                      <Cases />
                    </ProtectedRoute>
                  } />
                  
                  {/* Document Management */}
                  <Route path="/documents" element={
                    <ProtectedRoute>
                      <Documents />
                    </ProtectedRoute>
                  } />
                  <Route path="/documents/builder" element={
                    <ProtectedRoute>
                      <NotFound customMessage="Document Builder page is under development" />
                    </ProtectedRoute>
                  } />
                  <Route path="/documents/templates" element={
                    <ProtectedRoute>
                      <NotFound customMessage="Document Templates page is under development" />
                    </ProtectedRoute>
                  } />
                  <Route path="/documents/sign" element={
                    <ProtectedRoute>
                      <NotFound customMessage="DocuSign Integration page is under development" />
                    </ProtectedRoute>
                  } />
                  
                  {/* Files */}
                  <Route path="/files" element={
                    <ProtectedRoute>
                      <Files />
                    </ProtectedRoute>
                  } />
                  
                  {/* Medical Management */}
                  <Route path="/medical" element={
                    <ProtectedRoute>
                      <Medical />
                    </ProtectedRoute>
                  } />
                  <Route path="/medical/providers" element={
                    <ProtectedRoute>
                      <Medical />
                    </ProtectedRoute>
                  } />
                  <Route path="/medical/records" element={
                    <ProtectedRoute>
                      <Medical />
                    </ProtectedRoute>
                  } />
                  
                  {/* Billing & Settlements */}
                  <Route path="/billing" element={
                    <ProtectedRoute>
                      <Billing />
                    </ProtectedRoute>
                  } />
                  <Route path="/billing/add" element={
                    <ProtectedRoute>
                      <Billing />
                    </ProtectedRoute>
                  } />
                  <Route path="/billing/settlements" element={
                    <ProtectedRoute>
                      <Billing />
                    </ProtectedRoute>
                  } />
                  <Route path="/billing/letters" element={
                    <ProtectedRoute>
                      <Billing />
                    </ProtectedRoute>
                  } />
                  
                  {/* Calculator */}
                  <Route path="/calculator" element={
                    <ProtectedRoute>
                      <Calculator />
                    </ProtectedRoute>
                  } />
                  
                  {/* Reports */}
                  <Route path="/reports" element={
                    <ProtectedRoute>
                      <Reports />
                    </ProtectedRoute>
                  } />
                  
                  {/* Calendar & Tasks */}
                  <Route path="/calendar" element={
                    <ProtectedRoute>
                      <Calendar />
                    </ProtectedRoute>
                  } />
                  <Route path="/calendar/task/create" element={
                    <ProtectedRoute>
                      <Calendar />
                    </ProtectedRoute>
                  } />
                  <Route path="/calendar/tasks" element={
                    <ProtectedRoute>
                      <Calendar />
                    </ProtectedRoute>
                  } />
                  <Route path="/calendar/sync" element={
                    <ProtectedRoute>
                      <NotFound customMessage="Calendar Sync page is under development" />
                    </ProtectedRoute>
                  } />
                  
                  {/* Messaging */}
                  <Route path="/messages" element={
                    <ProtectedRoute>
                      <Messages />
                    </ProtectedRoute>
                  } />
                  <Route path="/messages/sms" element={
                    <ProtectedRoute>
                      <Messages />
                    </ProtectedRoute>
                  } />
                  <Route path="/messages/email" element={
                    <ProtectedRoute>
                      <Messages />
                    </ProtectedRoute>
                  } />
                  
                  {/* Admin Panel */}
                  <Route path="/admin" element={
                    <ProtectedRoute>
                      <Admin />
                    </ProtectedRoute>
                  } />
                  <Route path="/admin/users" element={
                    <ProtectedRoute>
                      <Admin />
                    </ProtectedRoute>
                  } />
                  <Route path="/admin/roles" element={
                    <ProtectedRoute>
                      <Admin />
                    </ProtectedRoute>
                  } />
                  <Route path="/admin/logs" element={
                    <ProtectedRoute>
                      <Admin />
                    </ProtectedRoute>
                  } />
                  
                  {/* Settings */}
                  <Route path="/settings" element={
                    <ProtectedRoute>
                      <Settings />
                    </ProtectedRoute>
                  } />
                  
                  {/* Catch-all route */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </TooltipProvider>
            </AuthProvider>
          </QueryClientProvider>
        </BrowserRouter>
      </HelmetProvider>
    </React.StrictMode>
  );
}

export default App;
