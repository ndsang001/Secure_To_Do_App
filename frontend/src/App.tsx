import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signin from "./pages/authentication/Signin";
import Register from "./pages/authentication/Signup";
import Dashboard from "./pages/routes/Dashboard";
import ProtectedRoute from './pages/routes/ProtectedRoute';
import Logout from "./pages/authentication/Logout";
import ErrorPage from "./pages/routes/ErrorPage";
import { useEffect } from "react";
import { useAuthenticationStore } from "./store/useAuthenticationStore";
import { Box, CircularProgress, Typography } from "@mui/material";

function App() {
  // Fetch functions from the authentication store
  const fetchCSRFToken = useAuthenticationStore(state => state.fetchCSRFToken);
  const checkAuth = useAuthenticationStore(state => state.checkAuth);
  const checkingAuth = useAuthenticationStore(state => state.checkingAuth);

  useEffect(() => {
    // Fetch CSRF token and check authentication status on component mount
    fetchCSRFToken(); // Set CSRF cookie on first load
    checkAuth(); // Restore session if possible
  }, [fetchCSRFToken, checkAuth]);

  // Show a loading screen while checking authentication status
  if (checkingAuth) {
    return (
      <Box
        sx={{
          height: "100vh",
          width: "100vw",
          backgroundColor: "#1e1e2f",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress color="inherit" />
        <Typography sx={{ mt: 2, color: "#ccc" }}>
          Checking authentication...
        </Typography>
      </Box>
    );
  }  

  return (
    <Router>
      <Routes>
        {/* Route for the Sign-In page */}
        <Route path="/" element={<Signin />} /> {/* Redirect users to Sign-In first */}
        <Route path="/login" element={<Signin />} />

        {/* Route for the Sign-Up page */}
        <Route path="/signup" element={<Register />} />

        {/* Route for the Logout page */}
        <Route path="/logout" element={<Logout />} />

        {/* Protected route for the Dashboard page */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />

        {/* Fallback route for undefined paths */}
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </Router>
  );
}

export default App;
