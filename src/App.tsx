
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
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

// Create a new QueryClient instance
const queryClient = new QueryClient();

function App() {
  return (
    <React.StrictMode>
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
                <Route path="/medical/*" element={
                  <ProtectedRoute>
                    <NotFound customMessage="Medical Management page is under development" />
                  </ProtectedRoute>
                } />
                
                {/* Billing & Settlements */}
                <Route path="/billing/*" element={
                  <ProtectedRoute>
                    <NotFound customMessage="Billing & Settlements page is under development" />
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
                <Route path="/calendar/*" element={
                  <ProtectedRoute>
                    <NotFound customMessage="Calendar & Tasks page is under development" />
                  </ProtectedRoute>
                } />
                
                {/* Messaging */}
                <Route path="/messages/*" element={
                  <ProtectedRoute>
                    <NotFound customMessage="Messaging page is under development" />
                  </ProtectedRoute>
                } />
                
                {/* Admin Panel */}
                <Route path="/admin/*" element={
                  <ProtectedRoute>
                    <NotFound customMessage="Admin Panel is under development" />
                  </ProtectedRoute>
                } />
                
                {/* Catch-all route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </TooltipProvider>
          </AuthProvider>
        </QueryClientProvider>
      </BrowserRouter>
    </React.StrictMode>
  );
}

export default App;
