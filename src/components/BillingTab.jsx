import React, { useEffect, useMemo, useState } from "react";
import { loadTossPayments } from "@tosspayments/tosspayments-sdk";
import api from "../api"; // 네 axios 인스턴스 경로에 맞춰 수정

const TOSS_CLIENT_KEY = import.meta.env.VITE_TOSS_CLIENT_KEY; // CRA면 REACT_APP_*

function bytesToMB(bytes) {
  if (bytes == null) return "-";
  return Math.round((bytes / (1024 * 1024)) * 10) / 10;
}

export default function BillingTab({ serverId, serverName }) {
  const [loading, setLoading] = useState(false);
  const [current, setCurrent] = useState(null);
  const [err, setErr] = useState(null);

  const origin = useMemo(() => window.location.origin, []);
  const successUrl = `${origin}/billing/toss/success`;
  const failUrl = `${origin}/billing/toss/fail`;

  // 서버 현재 플랜 조회 (백엔드: GET /api/servers/{id}/billing/plan 같은 거 만들면 좋음)
  useEffect(() => {
    (async () => {
      try {
        setErr(null);
        // 없으면 그냥 FREE로 표시하게 fallback 처리해도 됨
        const { data } = await api.get(`/servers/${serverId}/billing/plan`);
        setCurrent(data);
      } catch (e) {
        // 아직 API 없으면 여기서 FREE 기본값
        setCurrent({
          planCode: "FREE",
          status: "ACTIVE",
          currentPeriodEnd: null,
          limits: { maxMembers: 25, maxUploadBytes: 8 * 1024 * 1024, maxVoiceParticipants: 10, maxEmojis: 0 },
        });
      }
    })();
  }, [serverId]);

  const plans = [
    {
      code: "FREE",
      name: "FREE",
      priceLabel: "₩0 / month",
      perks: [
        ["Members", "25"],
        ["Upload", "8MB"],
        ["Voice", "10"],
        ["Emojis", "0"],
      ],
      cta: "Current",
      disabled: true,
    },
    {
      code: "PRO",
      name: "PRO",
      priceLabel: "₩9,900 / month",
      perks: [
        ["Members", "200"],
        ["Upload", "100MB"],
        ["Voice", "50"],
        ["Emojis", "50"],
      ],
      highlight: true,
    },
    {
      code: "TEAM",
      name: "TEAM",
      priceLabel: "₩29,900 / month",
      perks: [
        ["Members", "1000"],
        ["Upload", "500MB"],
        ["Voice", "200"],
        ["Emojis", "200"],
      ],
    },
  ];

  const startPayment = async (planCode) => {
    setLoading(true);
    setErr(null);
    try {
      // 1) 주문 생성 (서버에서 금액 결정)
      const { data } = await api.post(`/servers/${serverId}/billing/orders`, { planCode });
      const { orderId, amount } = data;

      // 2) 토스 결제창 호출
      const tossPayments = await loadTossPayments(TOSS_CLIENT_KEY);

      await tossPayments.requestPayment("CARD", {
        amount,
        orderId,
        orderName: `${serverName} - ${planCode} Plan`,
        customerName: "Discord Clone User",
        successUrl,
        failUrl,
      });
    } catch (e) {
      setErr(e?.response?.data?.message || e?.message || "결제 시작에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const currentPlanCode = current?.planCode || "FREE";
  const currentLimits = current?.limits;

  return (
    <div className="ss-panel">
      <div className="ss-headerRow">
        <div>
          <h2 className="ss-h2">Billing</h2>
          <div className="ss-muted">
            Server plan controls limits and premium features.
          </div>
        </div>

        <div className="ss-currentPill">
          <span className="dot" />
          Current: <b style={{ marginLeft: 6 }}>{currentPlanCode}</b>
        </div>
      </div>

      {err && <div className="ss-alert">{String(err)}</div>}

      {/* 현재 플랜 정보 카드 */}
      <div className="ss-card">
        <div className="ss-card-title">Current Plan</div>
        <div className="ss-card-desc">
          {current?.currentPeriodEnd
            ? `Renews/ends at: ${current.currentPeriodEnd}`
            : "No renewal date (FREE or not set)."}
        </div>

        <div className="ss-grid4">
          <div className="ss-metric">
            <div className="k">Members</div>
            <div className="v">{currentLimits?.maxMembers ?? "-"}</div>
          </div>
          <div className="ss-metric">
            <div className="k">Upload</div>
            <div className="v">
              {currentLimits?.maxUploadBytes ? `${bytesToMB(currentLimits.maxUploadBytes)}MB` : "-"}
            </div>
          </div>
          <div className="ss-metric">
            <div className="k">Voice</div>
            <div className="v">{currentLimits?.maxVoiceParticipants ?? "-"}</div>
          </div>
          <div className="ss-metric">
            <div className="k">Emojis</div>
            <div className="v">{currentLimits?.maxEmojis ?? "-"}</div>
          </div>
        </div>
      </div>

      {/* 플랜 선택 카드들 */}
      <div className="ss-plans">
        {plans.map((p) => {
          const isCurrent = p.code === currentPlanCode;
          const disabled = loading || p.disabled || isCurrent;

          return (
            <div key={p.code} className={`ss-planCard ${p.highlight ? "highlight" : ""}`}>
              <div className="ss-planTop">
                <div>
                  <div className="ss-planName">{p.name}</div>
                  <div className="ss-planPrice">{p.priceLabel}</div>
                </div>

                {isCurrent && <div className="ss-badge">Current</div>}
                {!isCurrent && p.highlight && <div className="ss-badge purple">Recommended</div>}
              </div>

              <div className="ss-planPerks">
                {p.perks.map(([k, v]) => (
                  <div className="ss-perk" key={k}>
                    <span className="k">{k}</span>
                    <span className="v">{v}</span>
                  </div>
                ))}
              </div>

              <button
                className={`ss-btn ${p.code === "TEAM" ? "secondary" : ""}`}
                disabled={disabled}
                onClick={() => startPayment(p.code)}
              >
                {isCurrent ? "Current Plan" : loading ? "Opening..." : `Upgrade to ${p.name}`}
              </button>

              {p.code !== "FREE" && (
                <div className="ss-planFoot">
                  Owner only. Changes apply to the entire server.
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="ss-muted" style={{ marginTop: 12 }}>
        Tip: “플랜 제한”은 반드시 백엔드에서 강제해야 해요 (멤버 초대/파일 업로드/음성 입장 등).
      </div>
    </div>
  );
}
