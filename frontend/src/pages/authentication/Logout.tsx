// src/pages/Logout.tsx
import { useEffect, useState } from "react";
import { useAuthenticationStore } from "../../store/useAuthenticationStore";
import { useNavigate } from "react-router-dom";
import { Snackbar, Alert } from "@mui/material";

const Logout = () => {
  const { logoutUser } = useAuthenticationStore();
  const navigate = useNavigate();
  const [open, setOpen] = useState(true);

  useEffect(() => {
    logoutUser().then(() => {
      setTimeout(() => {
        navigate("/login");
      }, 2000); // Wait 2 seconds before redirecting
    });
  }, [logoutUser, navigate]);

  const handleClose = (
    _event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") return;
    setOpen(false);
  };

  return (
    <Snackbar
      open={open}
      autoHideDuration={2000}
      onClose={handleClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
    >
      <Alert onClose={handleClose} severity="success" sx={{ width: "100%" }}>
        Successfully logged out!
      </Alert>
    </Snackbar>
  );
};

export default Logout;
