export default function Modal({ children, onClose }) {
  return (
    <>
      <div className="modal-overlay" onClick={onClose}></div>
      <div className="modal">{children}</div>
    </>
  );
}