import { useState, useEffect } from "react";
import COLORS from "../constants/colors";

/**
 * Edit note modal dialog.
 */
export default function EditModal({ note, onSave, onClose, loading }) {
  const [form, setForm] = useState({ title: "", content: "", color: COLORS[0], pinned: false });

  useEffect(() => {
    if (note) {
      setForm({ title: note.title, content: note.content, color: note.color || COLORS[0], pinned: note.pinned });
    }
  }, [note]);

  if (!note) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.content.trim()) return;
    await onSave(note._id, form);
  };

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="edit-modal-title" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <h2 className="modal-title" id="edit-modal-title">Edit Note</h2>
          <button id="close-modal-btn" className="btn btn-ghost btn-icon" onClick={onClose} aria-label="Close modal">✕</button>
        </div>

        <form onSubmit={handleSubmit} id="edit-note-form">
          <div className="form-grid">
            <div className="input-group">
              <label className="input-label" htmlFor="edit-title">Title</label>
              <input
                id="edit-title"
                className="input"
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                maxLength={100}
                required
              />
            </div>

            <div className="input-group">
              <label className="input-label" htmlFor="edit-content">Content</label>
              <textarea
                id="edit-content"
                className="input"
                name="content"
                value={form.content}
                onChange={handleChange}
                required
              />
            </div>

            {/* Color picker */}
            <div className="color-picker-group">
              <span className="input-label">Accent Color</span>
              <div className="color-swatches">
                {COLORS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    className={`color-swatch ${form.color === c ? "selected" : ""}`}
                    style={{ background: c }}
                    aria-label={`Color ${c}`}
                    onClick={() => setForm((prev) => ({ ...prev, color: c }))}
                  />
                ))}
              </div>
            </div>

            {/* Pin toggle */}
            <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", color: "var(--text-secondary)", fontSize: "0.88rem" }}>
              <input
                type="checkbox"
                name="pinned"
                id="edit-pinned"
                checked={form.pinned}
                onChange={handleChange}
                style={{ accentColor: "var(--accent)" }}
              />
              Pin note
            </label>
          </div>

          <div className="modal-actions">
            <button type="button" id="cancel-edit-btn" className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button
              type="submit"
              id="save-edit-btn"
              className="btn btn-primary"
              disabled={loading || !form.title.trim() || !form.content.trim()}
            >
              {loading ? "Saving…" : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
