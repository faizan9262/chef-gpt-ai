import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Dish from "./pages/Dish";
import MyFavourites from "./pages/MyFavourites";
import Login from "./pages/Login";
import { useAuth } from "./Context/AuthContext";
import React from "react";
import FavoriteDish from "./pages/FavoriteDish";

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const auth = useAuth();
  return auth.isLoggedIn ? <>{children}</> : <Navigate to="/login" replace />;
};

const App = () => {
  const auth = useAuth();
  return (
    <div className="max-w-screen w-full bg-blue-100 min-h-screen">
      <Router>
        <Navbar />
        <Routes>
          {/* Public Route */}
          <Route
            path="/login"
            element={
              auth.isLoggedIn ? <Navigate to="/" replace /> : <Login />
            }
          />

          {/* Protected Routes */}
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Home />
              </PrivateRoute>
            }
          />
          <Route
            path="/favourites"
            element={
              <PrivateRoute>
                <MyFavourites />
              </PrivateRoute>
            }
          />
          <Route
            path="/:name"
            element={
              <PrivateRoute>
                <Dish />
              </PrivateRoute>
            }
          />

          <Route
            path="/favorite-dish/:name"
            element={
              <PrivateRoute>
                <FavoriteDish />
              </PrivateRoute>
            }
          />

          {/* Catch-all fallback */}
          <Route
            path="*"
            element={
              <Navigate to={auth.isLoggedIn ? "/" : "/login"} replace />
            }
          />
        </Routes>
      </Router>
    </div>
  );
};

export default App;
