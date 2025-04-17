
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
import Attorneys from './pages/Attorneys';
import NotFound from './pages/NotFound';
import ProtectedRoute from './components/auth/ProtectedRoute';

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
                <Route path="/clients/*" element={<ProtectedRoute><Clients /></ProtectedRoute>} />
                <Route path="/cases/*" element={<ProtectedRoute><Cases /></ProtectedRoute>} />
                <Route path="/documents/*" element={<ProtectedRoute><Documents /></ProtectedRoute>} />
                <Route path="/files/*" element={<ProtectedRoute><Files /></ProtectedRoute>} />
                <Route path="/medical/*" element={<ProtectedRoute><Medical /></ProtectedRoute>} />
                <Route path="/billing/*" element={<ProtectedRoute><Billing /></ProtectedRoute>} />
                <Route path="/calculator" element={<ProtectedRoute><Calculator /></ProtectedRoute>} />
                <Route path="/reports/*" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
                <Route path="/calendar/*" element={<ProtectedRoute><Calendar /></ProtectedRoute>} />
                <Route path="/messages/*" element={<ProtectedRoute><Messages /></ProtectedRoute>} />
                <Route path="/admin/*" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
                <Route path="/settings/*" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
                <Route path="/depositions/*" element={<ProtectedRoute><Depositions /></ProtectedRoute>} />
                <Route path="/attorneys/*" element={<ProtectedRoute><Attorneys /></ProtectedRoute>} />
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
