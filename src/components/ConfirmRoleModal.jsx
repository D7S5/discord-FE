import "../styles/ConfirmRoleModal.css";

export default function ConfirmRoleModal({
  open,
  onClose,
  onConfirm,
  username,
}) {
  if (!open) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h3>관리자 권한 부여</h3>
        <p>
          <b>{username}</b> 님에게 <b>관리자 권한</b>을 부여하시겠습니까?
        </p>

        <div className="modal-actions">
          <button className="cancel" onClick={onClose}>
            취소
          </button>
          <button className="confirm" onClick={onConfirm}>
            확인
          </button>
        </div>
      </div>
    </div>
  );
}
