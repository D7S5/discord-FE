import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../api";
import { FcGoogle } from "react-icons/fc";

import "../styles/AuthLayout.css";
import "../styles/Form.css";
import "../styles/Button.css";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const params = new URLSearchParams(location.search);
  const redirect = params.get("redirect") || "/channels";

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await api.post("/auth/login", {
        email,
        password,
      });

      localStorage.setItem("accessToken", res.data.accessToken);
      localStorage.setItem("userId", res.data.userId);

      navigate(redirect);
    } catch (err) {
      setError("이메일 또는 비밀번호가 올바르지 않습니다.");
    }
  };

  // ✅ OAuth2 로그인
  const handleGoogleLogin = () => {
    window.location.href =
      `http://localhost:8080/oauth2/authorization/google?redirect=${redirect}`;
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
          <div style={{
            color: "#ed4245",
            fontSize: "12px",
            marginBottom: "12px"
          }}>
            {error}
          </div>
        )}

        <button className="btn btn-primary">로그인</button>

        {/* 🔥 구분선 */}
        <div style={{
          margin: "16px 0",
          textAlign: "center",
          color: "#999",
          fontSize: "12px"
        }}>
          또는
        </div>

        {/* 🔥 Google 로그인 버튼 */}
        <button
            type="button"
            className="btn btn-google"
            onClick={handleGoogleLogin}
          >
            <FcGoogle style={{ marginRight: "8px", fontSize: "18px" }} />
            Google로 로그인
          </button>

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
