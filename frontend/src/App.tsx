import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signin from "./pages/authentication/Signin";
import Register from "./pages/authentication/Signup";
import Dashboard from "./pages/routes/Dashboard";
import ProtectedRoute from './pages/routes/ProtectedRoute';
import Logout from "./pages/authentication/Logout";
import ErrorPage from "./pages/routes/ErrorPage";
import { useEffect } from "react";
import { useAuthenticationStore } from "./store/useAuthenticationStore";

function App() {
  const fetchCSRFToken = useAuthenticationStore(state => state.fetchCSRFToken);

  useEffect(() => {
    fetchCSRFToken(); // Set CSRF cookie on first load
  }, [fetchCSRFToken]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Signin />} /> {/* Redirect users to Sign-In first */}
        <Route path="/login" element={<Signin />} />
        <Route path="/signup" element={<Register />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="*" element={<ErrorPage />} /> {/* fallback route */}
      </Routes>
    </Router>
  );
}

export default App;
