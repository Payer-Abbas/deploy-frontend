/**
 * Toast notification display component.
 */
export default function ToastContainer({ toasts }) {
  const icons = { success: "✅", error: "❌" };

  return (
    <div className="toast-container" aria-live="polite">
      {toasts.map((t) => (
        <div key={t.id} className={`toast ${t.type}`} role="alert">
          <span>{icons[t.type] || "ℹ️"}</span>
          <span>{t.message}</span>
        </div>
      ))}
    </div>
  );
}
