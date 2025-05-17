/**
 * A React component that acts as a protected route wrapper for child components.
 * It ensures that only authenticated users can access the wrapped content.
 * If the authentication status is still being verified, it displays a loading screen.
 * If the user is not authenticated, it redirects them to the login page.
 *
 * @param {Object} props - The component props.
 * @param {React.ReactElement} props.children - The child component(s) to render if the user is authenticated.
 *
 * @returns {React.ReactElement} The rendered component based on the authentication state.
 *
 * @remarks
 * - This component uses the `useAuthenticationStore` hook to access the authentication state.
 * - While the authentication status is being checked (`checkingAuth`), a loading spinner and message are displayed.
 * - If the user is authenticated, the child components are rendered.
 * - If the user is not authenticated, they are redirected to the `/login` route.
 *
 */
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthenticationStore } from '../../store/useAuthenticationStore';
import { Box, CircularProgress, Typography } from "@mui/material";

export default function ProtectedRoute({ children }: { children: React.ReactElement }) {
  const { authenticated, checkingAuth } = useAuthenticationStore();

  if (checkingAuth) {
    return (
      <Box
        sx={{
          height: "100vh",
          backgroundColor: "#1e1e2f",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress color="inherit" />
        <Typography sx={{ mt: 2, color: "#ccc" }}>
          Verifying session...
        </Typography>
      </Box>
    );
  }

  return authenticated ? children : <Navigate to="/login" />;
}
