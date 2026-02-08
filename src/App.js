import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
// import ServerListPage from "./pages/ServerListPage";
import ServerLobby from "./pages/ServerLobby";
import MePage from "./pages/MePage";
import DmChatView from "./components/DmChatView";
import InvitePage from "./pages/InvitePage";
import "./styles/Variables.css";
import ServerSettings from "./components/ServerSettings";
import ServerSidebar from "./components/ServerSidebar";

const PrivateRoute = ({ children }) =>
  isAuthenticated() ? children : <Navigate to="/login" replace />;

const isAuthenticated = () => {
  const token = localStorage.getItem("accessToken");
  return token && token !== "undefined";
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/invite/:code" element={<InvitePage />} />
        <Route path="/channels/:serverId/settings" element={<ServerSettings />} />


        {/* 서버 목록 */}
        <Route
          path="/channels"
          element={
            <PrivateRoute>
              <ServerSidebar />
            </PrivateRoute>
          }
        />
        
        <Route path="/channels/@me" element={
          <PrivateRoute>
            <MePage />
          </PrivateRoute>}>
        
        <Route path=":roomId" element={<DmChatView />} /></Route>

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
