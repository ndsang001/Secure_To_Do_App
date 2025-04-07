import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signin from "./pages/authentication/Signin";
import Register from "./pages/authentication/Signup";
import Dashboard from "./pages/dashboard";
import ProtectedRoute from './pages/routes/ProtectedRoute';
//import Logout from "./pages/authentication/Logout";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Signin />} /> {/* Redirect users to Sign-In first */}
        <Route path="/signin" element={<Signin />} />
        <Route path="/signup" element={<Register />} />
        {/* <Route path="/logout" element={<Logout />} /> */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;
