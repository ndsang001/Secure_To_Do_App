/**
 * @file Signin.tsx
 * @description This file contains the Signin component, which provides a user interface for signing into the application.
 * It includes a form for entering email and password, and handles user authentication using the `useAuthenticationStore` hook.
 * The component also manages navigation to the dashboard upon successful authentication and displays error messages if login fails.
 * 
 * @module Signin
 * 
 * @requires react - React library for building user interfaces.
 * @requires @mui/material - Material-UI components for styling and layout.
 * @requires react-router-dom - Provides navigation and routing functionality.
 * @requires ../../store/useAuthenticationStore - Custom hook for managing authentication state.
 * @requires ../../assets/freemind_logo.png - Logo asset for the application.
 */
import { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  CircularProgress,
  Paper,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useAuthenticationStore } from "../../store/useAuthenticationStore";
import logo from "../../assets/freemind_logo.png";

const Signin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { loginUser, authenticated, error, loading, clearError } =
    useAuthenticationStore();

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    await loginUser({
      email,
      password,
    });
  };

  useEffect(() => {
    if (authenticated) {
      navigate("/dashboard");
    }
  }, [authenticated, navigate]);

  useEffect(() => {
    clearError(); // Clear any previous errors when this page loads
  }, [clearError]);

  return (
    <Box
      sx={{
        width: "100vw",
        height: "100vh",
        backgroundColor: "#1e1e2f",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        px: 2,
        boxSizing: "border-box",
        flexDirection: "column", // stack vertically
      }}
    >
      {/* Logo */}
      <Box mb={2}>
          <img src={logo} alt="App Logo" style={{ height: "200px" }} />
      </Box>

      <Paper
        elevation={4}
        sx={{
          width: "100%",
          maxWidth: "500px",
          p: 5,
          borderRadius: "12px",
          bgcolor: "#25273c",
          color: "#fff",
        }}
      >
        <Typography variant="h4" gutterBottom textAlign="center">
          Sign In
        </Typography>

        {error && (
          <Typography color="error" sx={{ mt: 1, textAlign: "center" }}>
            {error}
          </Typography>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            margin="normal"
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            InputProps={{ sx: { color: "#fff" } }}
            InputLabelProps={{ sx: { color: "#ccc" } }}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            InputProps={{ sx: { color: "#fff" } }}
            InputLabelProps={{ sx: { color: "#ccc" } }}
          />
          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{ mt: 3 }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} sx={{ color: "#fff" }} /> : "Sign In"}
          </Button>
        </form>

        <Typography variant="body2" sx={{ mt: 3, textAlign: "center", color: "#ccc" }}>
          Don't have an account? <Link to="/signup" style={{ color: "#90caf9" }}>Sign up</Link>
        </Typography>
      </Paper>
    </Box>
  );
};

export default Signin;
