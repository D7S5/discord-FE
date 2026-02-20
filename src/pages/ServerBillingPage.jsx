import React, { useMemo, useState } from "react";
import { loadTossPayments } from "@tosspayments/tosspayments-sdk";
import api from "../api"; // 너가 쓰는 axios 인스턴스

// 환경변수로 관리 추천
const TOSS_CLIENT_KEY = import.meta.env.VITE_TOSS_CLIENT_KEY; // Vite 기준
// CRA면 process.env.REACT_APP_TOSS_CLIENT_KEY

export default function ServerBillingPage({ serverId }) {
  const [loading, setLoading] = useState(false);

  const origin = useMemo(() => window.location.origin, []);
  const successUrl = `${origin}/billing/toss/success`;
  const failUrl = `${origin}/billing/toss/fail`;

  const plans = [
    { code: "PRO", name: "PRO", desc: "멤버/업로드/음성 제한 증가" },
    { code: "TEAM", name: "TEAM", desc: "더 큰 한도 + 팀 기능" },
  ];

  const startPayment = async (planCode) => {
    setLoading(true);
    try {
      // 1) 서버에 주문 생성 (가격은 서버가 결정)
      const { data } = await api.post(`/servers/${serverId}/billing/orders`, { planCode });
      const { orderId, amount } = data;

      // 2) 토스 SDK 로드
      const tossPayments = await loadTossPayments(TOSS_CLIENT_KEY);

      // 3) 결제창 요청 (Redirect 방식)
      // 결제 성공 시 successUrl로 paymentKey/orderId/amount 쿼리파라미터가 붙어 돌아옴 :contentReference[oaicite:3]{index=3}
      await tossPayments.requestPayment("CARD", {
        amount,
        orderId,
        orderName: `Server Plan Upgrade: ${planCode}`,
        customerName: "Discord Clone User", // 있으면 username 넣기
        successUrl,
        failUrl,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 16 }}>
      <h2>Server Billing</h2>
      <p>서버 플랜을 업그레이드하면 멤버/업로드/음성 제한이 늘어납니다.</p>

      <div style={{ display: "grid", gap: 12, maxWidth: 520 }}>
        {plans.map((p) => (
          <div key={p.code} style={{ border: "1px solid #333", padding: 12, borderRadius: 8 }}>
            <div style={{ fontWeight: 700 }}>{p.name}</div>
            <div style={{ opacity: 0.8, marginTop: 6 }}>{p.desc}</div>
            <button
              disabled={loading}
              onClick={() => startPayment(p.code)}
              style={{ marginTop: 10 }}
            >
              {loading ? "결제창 여는 중..." : `${p.name} 결제하기`}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
