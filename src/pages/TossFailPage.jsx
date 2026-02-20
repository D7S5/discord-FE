import React from "react";
import { useSearchParams } from "react-router-dom";

export default function TossFailPage() {
  const [params] = useSearchParams();
  const code = params.get("code");
  const message = params.get("message");

  return (
    <div style={{ padding: 16 }}>
      <h2>결제 실패</h2>
      <p>code: {code || "(none)"}</p>
      <p>message: {message || "(none)"}</p>
      <p style={{ opacity: 0.8 }}>
        PAY_PROCESS_CANCELED 같은 경우는 사용자가 결제창을 닫았을 때 발생할 수 있습니다.
      </p>
    </div>
  );
}
