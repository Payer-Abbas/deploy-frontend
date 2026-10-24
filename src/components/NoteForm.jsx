import { useState } from "react";
import COLORS from "../constants/colors";

const INITIAL = { title: "", content: "", color: COLORS[0], pinned: false };

/**
 * Form for creating a new note.
 */
export default function NoteForm({ onSave, loading }) {
  const [form, setForm] = useState(INITIAL);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.content.trim()) return;
    await onSave(form);
    setForm(INITIAL);
  };

  return (
    <div className="form-card">
      <p className="form-title">✏️ New Note</p>
      <form onSubmit={handleSubmit} id="create-note-form">
        <div className="form-grid">
          {/* Title */}
          <div className="input-group">
            <label className="input-label" htmlFor="note-title">Title</label>
            <input
              id="note-title"
              className="input"
              type="text"
              name="title"
              placeholder="Note title..."
              value={form.title}
              onChange={handleChange}
              maxLength={100}
              required
            />
          </div>

          {/* Content */}
          <div className="input-group">
            <label className="input-label" htmlFor="note-content">Content</label>
            <textarea
              id="note-content"
              className="input"
              name="content"
              placeholder="Write your note here..."
              value={form.content}
              onChange={handleChange}
              required
            />
          </div>

          {/* Color + Submit row */}
          <div className="form-row">
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
                    aria-label={`Select color ${c}`}
                    onClick={() => setForm((prev) => ({ ...prev, color: c }))}
                  />
                ))}
              </div>
            </div>

            {/* Pin + submit */}
            <div style={{ display: "flex", flexDirection: "column", gap: 10, alignItems: "flex-end" }}>
              <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", color: "var(--text-secondary)", fontSize: "0.88rem" }}>
                <input
                  type="checkbox"
                  name="pinned"
                  id="note-pinned"
                  checked={form.pinned}
                  onChange={handleChange}
                  style={{ accentColor: "var(--accent)" }}
                />
                Pin note
              </label>
              <button
                id="create-note-btn"
                type="submit"
                className="btn btn-primary"
                disabled={loading || !form.title.trim() || !form.content.trim()}
              >
                {loading ? "Saving…" : "＋ Add Note"}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
