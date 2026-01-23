import { useState } from "react";
import api from "../api";
import "../styles/AddFriendModal.css";

export default function AddFriendModal({ onClose }) {
  const [username, setUsername] = useState("");
  const [msg, setMsg] = useState(null);

  const submit = async () => {
    try {
      await api.post("/friends/request", { username });
      setMsg("✅ Friend request sent!");
    } catch (e) {
      setMsg(e.response?.data?.message || "❌ Failed");
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h2>Add Friend</h2>

        <input
          placeholder="Username#1234"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        {msg && <p className="msg">{msg}</p>}

        <div className="actions">
          <button onClick={submit}>Send Request</button>
          <button className="cancel" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
