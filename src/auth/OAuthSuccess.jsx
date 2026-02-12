import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function OAuthSuccess() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);

    const token = params.get("token");
    const userId = params.get("userId");
    const redirect = params.get("redirect") || "/channels";

    if (token) {
      localStorage.setItem("accessToken", token);
      localStorage.setItem("userId", userId);
      navigate(redirect);
    } else {
      navigate("/login");
    }
  }, [location, navigate]);

  return <div>로그인 처리중...</div>;
}
