import {
    Avatar,
    Box,
    Button,
    Container,
    CssBaseline,
    Grid,
    TextField,
    Typography,
    Snackbar,
    Alert,
  } from "@mui/material";
  import { LockOutlined } from "@mui/icons-material";
  import { useState } from "react";
  import { Link } from "react-router-dom";
  import API from '../../api/axios';
  import { AxiosError } from 'axios';
  import { useNavigate } from "react-router-dom";
  
  const Register = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] =
      useState<"success" | "error">("success");
  
    interface RegisterForm {
      username: string;
      email: string;
      password: string;
    }

    const handleRegister = async (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();

      if (!name || !email || !password) {
        showSnackbar("Please fill in all fields.", "error");
        return;
      }
      const form: RegisterForm = {
      username: name,
      email: email,
      password: password,
      };

      try {
        await API.post('/auth/register/', form);
        showSnackbar("User registered successfully!", "success");
        clearInputs();
        // Redirect to Sign In page after a short delay
        setTimeout(() => {
          navigate("/signin");
        }, 1500);
      } catch (err) {
        const error = err as AxiosError<{ error: string }>;
        const errorMsg =
        error.response?.data?.error || "Registration failed.";
        showSnackbar(errorMsg, "error");
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
      <>
        <Container maxWidth="xs">
          <CssBaseline />
          <Box
            sx={{
              mt: 20,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: "primary.light" }}>
              <LockOutlined />
            </Avatar>
            <Typography variant="h5">Register</Typography>
            <Box sx={{ mt: 3 }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    name="name"
                    required
                    fullWidth
                    id="name"
                    label="Name"
                    autoFocus
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </Grid>
  
                <Grid item xs={12} component="div">
                  <TextField
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="off"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="new-password"
                  />
                </Grid>
              </Grid>
              <Button
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                onClick={handleRegister}
              >
                Register
              </Button>
              <Grid container justifyContent="flex-end">
                <Grid item>
                  <Link to="/login">Already have an account? Login</Link>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Container>
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
      </>
    );
  };
  
  export default Register;