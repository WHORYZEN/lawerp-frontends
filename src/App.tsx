
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './contexts/AuthContext';
import { UserProvider } from './contexts/UserContext';
import { Toaster } from './components/ui/toaster';

import './App.css';

import Index from './pages/Index';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Clients from './pages/Clients';
import Cases from './pages/Cases';
import Documents from './pages/Documents';
import Files from './pages/Files';
import Medical from './pages/Medical';
import Billing from './pages/Billing';
import Calculator from './pages/Calculator';
import Reports from './pages/Reports';
import Calendar from './pages/Calendar';
import Messages from './pages/Messages';
import Admin from './pages/Admin';
import Settings from './pages/Settings';
import Depositions from './pages/Depositions';
import NotFound from './pages/NotFound';
import ProtectedRoute from './components/auth/ProtectedRoute';
import RoleProtectedRoute from './components/auth/RoleProtectedRoute';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <HelmetProvider>
        <Router>
          <AuthProvider>
            <UserProvider>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<Login />} />
                <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path="/clients/*" element={
                  <RoleProtectedRoute allowedRoles={['admin', 'attorney', 'paralegal']}>
                    <Clients />
                  </RoleProtectedRoute>
                } />
                <Route path="/cases/*" element={
                  <RoleProtectedRoute allowedRoles={['admin', 'attorney', 'paralegal']}>
                    <Cases />
                  </RoleProtectedRoute>
                } />
                <Route path="/documents/*" element={
                  <RoleProtectedRoute allowedRoles={['admin', 'attorney', 'paralegal']}>
                    <Documents />
                  </RoleProtectedRoute>
                } />
                <Route path="/files/*" element={
                  <RoleProtectedRoute allowedRoles={['admin', 'attorney', 'paralegal']}>
                    <Files />
                  </RoleProtectedRoute>
                } />
                <Route path="/medical/*" element={
                  <RoleProtectedRoute allowedRoles={['admin', 'attorney', 'paralegal']}>
                    <Medical />
                  </RoleProtectedRoute>
                } />
                <Route path="/billing/*" element={
                  <RoleProtectedRoute allowedRoles={['admin', 'attorney']}>
                    <Billing />
                  </RoleProtectedRoute>
                } />
                <Route path="/calculator" element={
                  <RoleProtectedRoute allowedRoles={['admin', 'attorney', 'paralegal']}>
                    <Calculator />
                  </RoleProtectedRoute>
                } />
                <Route path="/reports/*" element={
                  <RoleProtectedRoute allowedRoles={['admin', 'attorney']}>
                    <Reports />
                  </RoleProtectedRoute>
                } />
                <Route path="/calendar/*" element={<ProtectedRoute><Calendar /></ProtectedRoute>} />
                <Route path="/messages/*" element={<ProtectedRoute><Messages /></ProtectedRoute>} />
                <Route path="/admin/*" element={
                  <RoleProtectedRoute allowedRoles={['admin']}>
                    <Admin />
                  </RoleProtectedRoute>
                } />
                <Route path="/settings/*" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
                <Route path="/depositions/*" element={
                  <RoleProtectedRoute allowedRoles={['admin', 'attorney', 'paralegal']}>
                    <Depositions />
                  </RoleProtectedRoute>
                } />
                <Route path="*" element={<NotFound />} />
              </Routes>
              <Toaster />
            </UserProvider>
          </AuthProvider>
        </Router>
      </HelmetProvider>
    </QueryClientProvider>
  );
}

export default App;
