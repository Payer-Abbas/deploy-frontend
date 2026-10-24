import { useState } from "react";
import COLORS from "../constants/colors";

const INITIAL = {
  title: "",
  content: "",
  color: COLORS[0],
  pinned: false,
  tags: "",
};

/**
 * Form for creating a new note.
 */
export default function NoteForm({ onSave, loading }) {
  const [form, setForm] = useState(INITIAL);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.content.trim()) return;

    const tags = form.tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    await onSave({
      title: form.title.trim(),
      content: form.content.trim(),
      color: form.color,
      pinned: form.pinned,
      tags,
    });
    setForm(INITIAL);
  };

  return (
    <div className="form-panel">
      <p className="form-title">New note</p>
      <form onSubmit={handleSubmit} id="create-note-form">
        <div className="form-grid">
          <div className="input-group">
            <label className="input-label" htmlFor="note-title">
              Title
            </label>
            <input
              id="note-title"
              className="input"
              type="text"
              name="title"
              placeholder="Note title…"
              value={form.title}
              onChange={handleChange}
              maxLength={100}
              required
            />
            <span className="char-count">{form.title.length}/100</span>
          </div>

          <div className="input-group">
            <label className="input-label" htmlFor="note-content">
              Content
            </label>
            <textarea
              id="note-content"
              className="input"
              name="content"
              placeholder="Write your note here…"
              value={form.content}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <label className="input-label" htmlFor="note-tags">
              Tags
            </label>
            <input
              id="note-tags"
              className="input"
              type="text"
              name="tags"
              placeholder="work, ideas, personal (comma-separated)"
              value={form.tags}
              onChange={handleChange}
            />
          </div>

          <div className="form-row">
            <div className="color-picker-group">
              <span className="input-label">Accent</span>
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

            <div className="form-aside">
              <label className="pin-toggle" htmlFor="note-pinned">
                <input
                  type="checkbox"
                  name="pinned"
                  id="note-pinned"
                  checked={form.pinned}
                  onChange={handleChange}
                />
                Pin note
              </label>
              <button
                id="create-note-btn"
                type="submit"
                className="btn btn-primary"
                disabled={loading || !form.title.trim() || !form.content.trim()}
              >
                {loading ? "Saving…" : "Add note"}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
