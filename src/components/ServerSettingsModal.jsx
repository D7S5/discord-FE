import React, { useState } from "react";
import BillingTab from "./BillingTab";
import "../styles/ServerSettingsModal.css";

export default function ServerSettingsModal({ serverId, serverName, onClose }) {
  const [active, setActive] = useState("OVERVIEW");
   console.log("ServerSettingsModal rendered");

  return (
    <div className="ss-backdrop" onClick={onClose}>
      <div className="ss-modal" onClick={(e) => e.stopPropagation()}>
        <aside className="ss-sidebar">
          <div className="ss-title">Server Settings</div>

          <button
            className={`ss-nav ${active === "OVERVIEW" ? "active" : ""}`}
            onClick={() => setActive("OVERVIEW")}
          >
            Overview
          </button>

          <button
            className={`ss-nav ${active === "BILLING" ? "active" : ""}`}
            onClick={() => setActive("BILLING")}
          >
            Billing
          </button>

          <div className="ss-spacer" />
          <button className="ss-close" onClick={onClose}>
            Close
          </button>
        </aside>

        <main className="ss-content">
          {active === "OVERVIEW" && (
            <div className="ss-panel">
              <h2 className="ss-h2">Overview</h2>
              <p className="ss-muted">Server: <b>{serverName}</b></p>
              <div className="ss-card">
                <div className="ss-card-title">Coming soon</div>
                <div className="ss-card-desc">
                  여기엔 서버 이름/아이콘 변경 같은 설정을 넣으면 돼.
                </div>
              </div>
            </div>
          )}

          {active === "BILLING" && (
            <BillingTab serverId={serverId} serverName={serverName} />
          )}
        </main>
      </div>
    </div>
  );
}
