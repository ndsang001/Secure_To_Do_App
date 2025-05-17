import { useEffect, useState } from "react";
import { useAuthenticationStore } from "../../store/useAuthenticationStore";
import { useNavigate } from "react-router-dom";
import { Snackbar, Alert } from "@mui/material";

/**
 * @file Logout.tsx
 * @description This component handles the user logout process. It utilizes the `useAuthenticationStore` 
 * to perform the logout operation and redirects the user to the login page after a short delay. 
 * A success message is displayed using a `Snackbar` component during the logout process.
 * 
 * @component
 * @returns {JSX.Element} The Logout component.
 * 
 */
const Logout = () => {
  const { logoutUser } = useAuthenticationStore();
  const navigate = useNavigate();
  const [open, setOpen] = useState(true);

  useEffect(() => {
    logoutUser().then(() => {
      navigate("/login");
      // setTimeout(() => {
      //   navigate("/login");
      // }, 2000); // Wait 2 seconds before redirecting
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
