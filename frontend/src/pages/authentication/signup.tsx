import {
  Avatar,
  Box,
  Button,
  Paper,
  TextField,
  Typography,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material";
import { LockOutlined } from "@mui/icons-material";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthenticationStore } from "../../store/useAuthenticationStore";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const {
    registerUser,
    error,
    loading,
    clearError,
  } = useAuthenticationStore();

  const navigate = useNavigate();

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">("success");

  const handleRegister = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (!name || !email || !password) {
      showSnackbar("Please fill in all fields.", "error");
      return;
    }

    try {
      clearError();
      await registerUser({ username: name, email, password });
      showSnackbar("User registered successfully!", "success");
      clearInputs();
      setTimeout(() => navigate("/login"), 1500);
    } catch {
      showSnackbar(error || "Registration failed.", "error");
    }
  };

  const clearInputs = () => {
    setName("");
    setEmail("");
    setPassword("");
  };

  const showSnackbar = (message: string, severity: "success" | "error") => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleCloseSnackbar = (
    _event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") return;
    setSnackbarOpen(false);
  };

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
      }}
    >
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
        <Box display="flex" flexDirection="column" alignItems="center">
          <Avatar sx={{ m: 1, bgcolor: "primary.light" }}>
            <LockOutlined />
          </Avatar>
          <Typography component="h1" variant="h5" gutterBottom>
            Register
          </Typography>
        </Box>

        <Box component="form" sx={{ mt: 3 }}>
          <TextField
            name="name"
            fullWidth
            label="Name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            margin="normal"
            InputProps={{ sx: { color: "#fff" } }}
            InputLabelProps={{ sx: { color: "#ccc" } }}
          />
          <TextField
            name="email"
            fullWidth
            label="Email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            margin="normal"
            InputProps={{ sx: { color: "#fff" } }}
            InputLabelProps={{ sx: { color: "#ccc" } }}
          />
          <TextField
            name="password"
            fullWidth
            label="Password"
            required
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            margin="normal"
            InputProps={{ sx: { color: "#fff" } }}
            InputLabelProps={{ sx: { color: "#ccc" } }}
          />

          <Button
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            onClick={handleRegister}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} sx={{ color: "#fff" }} /> : "Register"}
          </Button>

          <Typography variant="body2" sx={{ textAlign: "center", color: "#ccc" }}>
            Already have an account?{" "}
            <Link to="/login" style={{ color: "#90caf9" }}>
              Login
            </Link>
          </Typography>
        </Box>

        <Snackbar
          open={snackbarOpen}
          autoHideDuration={3000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={snackbarSeverity}
            sx={{ width: "100%" }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Paper>
    </Box>
  );
};

export default Register;
