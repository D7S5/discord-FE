import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ServerListPage from "./pages/ServerListPage";
import ServerLayoutPage from "./pages/ServerLayoutPage";
import ServerLobby from "./pages/ServerLobby";
const isAuthenticated = () => !!localStorage.getItem("accessToken");

const PrivateRoute = ({ children }) =>
  isAuthenticated() ? children : <Navigate to="/login" replace />;

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* 서버 목록 */}
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
        <Route
          path="/channels/:serverId/:channelId"
          element={
            <PrivateRoute>
              <ServerLobby />
            </PrivateRoute>
          }
        />
        {/* 서버 + 채널 (디스코드 핵심) */}
        {/* <Route
          path="/channels/:serverId/*"
          element={
            <PrivateRoute>
              <ServerLayoutPage />
            </PrivateRoute>
          }
        /> */}

        {/* 기본 진입 */}
        <Route
          path="/"
          element={
            isAuthenticated()
              ? <Navigate to="/channels" replace />
              : <Navigate to="/login" replace />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
