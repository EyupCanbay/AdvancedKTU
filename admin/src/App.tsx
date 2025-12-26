import React from 'react';
import { Toaster } from 'react-hot-toast';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import Sidebar from './components/Sidebar';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Waste from './pages/Waste';
import CollectionMap from './pages/CollectionMap';
import './index.css';

// Protected Route Wrapper - JWT token kontrol
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { token } = useAuthStore();
  if (!token) {
    return <Navigate to="/login" />;
  }
  return <>{children}</>;
};

// Admin Route Wrapper - Admin rolü kontrol
const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { token, user } = useAuthStore();
  if (!token || !user) {
    return <Navigate to="/login" />;
  }
  if (user.role !== 'admin') {
    return <Navigate to="/login" />;
  }
  return <>{children}</>;
};

function App() {
  const { token, user } = useAuthStore();

  return (
    <Router>
      {token && user ? (
        <div className="flex">
          <Sidebar />
          <main className="flex-1 ml-64">
            <Routes>
              <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/users" element={<AdminRoute><Users /></AdminRoute>} />
              <Route path="/waste" element={<ProtectedRoute><Waste /></ProtectedRoute>} />
              <Route path="/collection-map" element={<ProtectedRoute><CollectionMap /></ProtectedRoute>} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </main>
        </div>
      ) : (
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      )}
      <Toaster position="top-right" />
    </Router>
  );
}

export default App;
