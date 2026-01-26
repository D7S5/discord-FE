import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ServerListPage from "./pages/ServerListPage";
import ServerLobby from "./pages/ServerLobby";
import MePage from "./pages/MePage";
import DmChatView from "./components/DmChatView";
import VoiceChannel from "./webrtc/VoiceChannel";
import "./styles/Variables.css";

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
        
        <Route path="/channels/:serverId/voice/:channelId" element={<VoiceChannel />}/>

        <Route path="/channels/@me" element={<MePage />}>
        <Route path=":roomId" element={<DmChatView />} />
        </Route>

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
