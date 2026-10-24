/**
 * Toast notification display component.
 */
export default function ToastContainer({ toasts }) {
  return (
    <div className="toast-container" aria-live="polite">
      {toasts.map((t) => (
        <div key={t.id} className={`toast ${t.type}`} role="alert">
          <span>{t.message}</span>
        </div>
      ))}
    </div>
  );
}
