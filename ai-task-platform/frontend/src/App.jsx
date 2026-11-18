import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <h2 style={{ textAlign: "center", marginTop: "100px" }}>
      Loading...
    </h2>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return <h2 style={{ textAlign: "center", marginTop: "100px" }}>
      Loading...
    </h2>;
  }

  return (
    <Routes>
      <Route
        path="/"
        element={
          <Navigate to={user ? "/dashboard" : "/login"} replace />
        }
      />

      <Route
        path="/login"
        element={user ? <Navigate to="/dashboard" replace /> : <Login />}
      />

      <Route
        path="/register"
        element={user ? <Navigate to="/dashboard" replace /> : <Register />}
      />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
