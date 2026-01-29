import { useState } from "react";
import { createInvite } from "../api/invite";
import "../styles/InviteModal.css";

export default function InviteModal({ serverId, onClose }) {
  const [expireMinutes, setExpireMinutes] = useState(1440); // 24h
  const [maxUses, setMaxUses] = useState(null); // 무제한
  const [inviteUrl, setInviteUrl] = useState("");

  const handleCreate = async () => {
    const res = await createInvite(serverId, {
      expireMinutes,
      maxUses,
    });
    setInviteUrl(`${window.location.origin}/invite/${res.code}`);
  };

  const copyLink = async () => {
    await navigator.clipboard.writeText(inviteUrl);
    alert("초대 링크 복사됨");
  };

  return (
    <div className="modal-overlay">
      <div className="invite-modal">
        <h2>서버에 친구 초대</h2>

        {inviteUrl ? (
          <div className="invite-result">
            <input value={inviteUrl} readOnly />
            <button onClick={copyLink}>복사</button>
          </div>
        ) : (
          <>
            <div className="option">
              <label>만료 시간</label>
              <select
                value={expireMinutes}
                onChange={(e) => setExpireMinutes(Number(e.target.value))}
              >
                <option value={30}>30분</option>
                <option value={60}>1시간</option>
                <option value={1440}>24시간</option>
                <option value={null}>무제한</option>
              </select>
            </div>

            <div className="option">
              <label>최대 사용 횟수</label>
              <select
                value={maxUses}
                onChange={(e) =>
                  setMaxUses(e.target.value === "null" ? null : Number(e.target.value))
                }
              >
                <option value={1}>1회</option>
                <option value={5}>5회</option>
                <option value="null">무제한</option>
              </select>
            </div>

            <button className="primary" onClick={handleCreate}>
              초대 링크 생성
            </button>
          </>
        )}

        <button className="close" onClick={onClose}>
          닫기
        </button>
      </div>
    </div>
  );
}
