import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthenticationStore } from '../../store/useAuthenticationStore';

export default function ProtectedRoute({ children }: { children: React.ReactElement }) {
  const { authenticated } = useAuthenticationStore();

  return authenticated ? children : <Navigate to="/login" />;
}
