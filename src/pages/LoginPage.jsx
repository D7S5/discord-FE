import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

import "../styles/AuthLayout.css";
import "../styles/Form.css";
import "../styles/Button.css";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await api.post("/auth/login", {
        email,
        password,
      });
      // localStorage.setItem("userId", res.data.userId);
      localStorage.setItem("accessToken", res.data.accessToken);
      navigate("/channels");
    } catch (err) {
      setError("이메일 또는 비밀번호가 올바르지 않습니다.");
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-card" onSubmit={handleLogin}>
        <div className="auth-title">다시 오신 것을 환영해요!</div>
        <div className="auth-subtitle">
          Discord 클론에 로그인하세요
        </div>

        <div className="form-group">
          <label className="form-label">이메일</label>
          <input
            className="form-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="email@example.com"
          />
        </div>

        <div className="form-group">
          <label className="form-label">비밀번호</label>
          <input
            type="password"
            className="form-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {error && (
          <div style={{ color: "#ed4245", fontSize: "12px", marginBottom: "12px" }}>
            {error}
          </div>
        )}

        <button className="btn btn-primary">로그인</button>

        <button
          type="button"
          className="btn btn-link"
          onClick={() => navigate("/register")}
        >
          계정이 없으신가요? 회원가입
        </button>
      </form>
    </div>
  );
}
