import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ServerListPage from "./pages/ServerListPage";
import ServerLobby from "./pages/ServerLobby";

const isAuthenticated = () => {
  return !!localStorage.getItem("accessToken");
};

// 🔒 인증 보호 라우트
const PrivateRoute = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/login" replace />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 🔓 Public */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* 🔒 Private */}
        <Route
          path="/channels"
          element={
            <PrivateRoute>
              <ServerListPage />
            </PrivateRoute>
          }
        />

        <Route
          path="/channels/:serverId"
          element={
            <PrivateRoute>
              <ServerLobby />
            </PrivateRoute>
          }
        />

        {/* 기본 진입 */}
        <Route
          path="/"
          element={
            isAuthenticated() ? (
              <Navigate to="/servers" replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
