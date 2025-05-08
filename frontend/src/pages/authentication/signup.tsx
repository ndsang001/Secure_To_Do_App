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
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthenticationStore } from "../../store/useAuthenticationStore";
import logo from "../../assets/freemind_logo.png";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const {
    registerUser,
    loading,
    clearError,
  } = useAuthenticationStore();

  const navigate = useNavigate();

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">("success");

  useEffect(() => {
    clearError();
  }, [clearError]);

  const handleRegister = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (!username || !email || !password) {
      showSnackbar("Please fill in all fields.", "error");
      return;
    }

    try {
      clearError();
      await registerUser({ username: username, email, password });
      showSnackbar("User registered successfully!", "success");
      clearInputs();
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Registration failed.";
      showSnackbar(message, "error");
    }
  };

  const clearInputs = () => {
    setUsername("");
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
            name="username"
            fullWidth
            label="User Name"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            margin="normal"
            InputProps={{ sx: { color: "#fff" } }}
            InputLabelProps={{ sx: { color: "#ccc" } }}
          />
          <TextField
            name="email"
            fullWidth
            label="Email"
            type="email"
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
            autoComplete="off"
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
