import React from 'react';
import { Navigate } from 'react-router-dom';

const isAuthenticated = () => !!localStorage.getItem('access');

export default function ProtectedRoute({ children }: { children: React.ReactElement }) {
  return isAuthenticated() ? children : <Navigate to="/login" />;
}
