import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "../api";

export default function TossSuccessPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("결제 승인 처리 중...");
  const [detail, setDetail] = useState(null);

  useEffect(() => {
    const paymentKey = params.get("paymentKey");
    const orderId = params.get("orderId");
    const amount = params.get("amount");

    // successUrl에는 paymentKey/orderId/amount가 쿼리로 붙음 :contentReference[oaicite:5]{index=5}
    if (!paymentKey || !orderId || !amount) {
      setStatus("필수 파라미터가 없습니다.");
      return;
    }

    (async () => {
      try {
        const { data } = await api.post("/billing/toss/confirm", {
          paymentKey,
          orderId,
          amount: Number(amount),
        });

        setStatus("결제 완료! 플랜이 적용되었습니다.");
        setDetail(data);

        // 예: 2초 후 서버 설정 Billing 탭으로 이동
        setTimeout(() => navigate("/channels"), 2000);
      } catch (e) {
        setStatus("결제 승인(confirm)에 실패했습니다.");
        setDetail(e?.response?.data || e?.message);
      }
    })();
  }, [params, navigate]);

  return (
    <div style={{ padding: 16 }}>
      <h2>결제 결과</h2>
      <p>{status}</p>
      {detail && (
        <pre style={{ background: "#111", padding: 12, borderRadius: 8, overflow: "auto" }}>
          {JSON.stringify(detail, null, 2)}
        </pre>
      )}
    </div>
  );
}
