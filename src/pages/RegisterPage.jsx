import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

import "../styles/AuthLayout.css";
import "../styles/Form.css";
import "../styles/Button.css";

export default function Register() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await api.post("/auth/register", {
        email,
        username,
        password,
      });

      navigate("/login");
    } catch (err) {
      setError("이미 존재하는 이메일이거나 입력값이 올바르지 않습니다.");
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-card" onSubmit={handleRegister}>
        <div className="auth-title">계정 만들기</div>
        <div className="auth-subtitle">
          Discord 클론에 오신 것을 환영합니다
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
          <label className="form-label">사용자 이름</label>
          <input
            className="form-input"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="닉네임"
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

        <button className="btn btn-primary">회원가입</button>

        <button
          type="button"
          className="btn btn-link"
          onClick={() => navigate("/login")}
        >
          이미 계정이 있으신가요? 로그인
        </button>
      </form>
    </div>
  );
}
