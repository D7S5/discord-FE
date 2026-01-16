import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./auth/Login";
import Servers from "./pages/Servers";
import RequireAuth from "./auth/RequireAuth";
import Register from "./pages/Register";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/servers" element={<RequireAuth><Servers /></RequireAuth>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
