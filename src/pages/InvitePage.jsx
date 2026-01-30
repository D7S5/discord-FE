 import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api";
import "../styles/InvitePage.css";

export default function InvitePage() {
  const { code } = useParams();
  const navigate = useNavigate();

  const [invite, setInvite] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/invites/${code}`)
      .then(res => setInvite(res.data))
      .catch((err) => {
        console.error(err.response?.data);
        setError("유효하지 않거나 만료된 초대입니다")})
      .finally(() => setLoading(false));
  }, [code]);

  const joinServer = async () => {
    try {
      const res = await api.post(`/invites/${code}/join`);
      navigate(`/channels/${res.data.serverId}`);
    } catch (e) {
    if ( e.response?.status === 403) {
        navigate(`/login?redirect=/invite/${code}`)
        return ;
    }
    //   alert("서버 가입 실패");
    }
  };

  if (loading) return <div className="invite-page">Loading...</div>;
  if (error) return <div className="invite-error">{error}</div>;

  return (
    <div className="invite-page">
      <div className="invite-card">
        <p className="invite-label">초대받았습니다</p>
        <h2>{invite.serverName}</h2>
        <p className="invite-members">
          멤버 {invite.memberCount}명
        </p>

        <button className="invite-join-btn" onClick={joinServer}>
          서버 가입
        </button>
      </div>
    </div>
  );
}
