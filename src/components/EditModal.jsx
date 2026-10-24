import { useState } from "react";
import COLORS from "../constants/colors";

/**
 * Edit note modal dialog.
 * Remount with key={note._id} from the parent so form state resets per note.
 */
export default function EditModal({ note, onSave, onClose, loading }) {
  const [form, setForm] = useState({
    title: note.title,
    content: note.content,
    color: note.color || COLORS[0],
    pinned: Boolean(note.pinned),
    archived: Boolean(note.archived),
    tags: Array.isArray(note.tags) ? note.tags.join(", ") : "",
  });

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

    await onSave(note._id, {
      title: form.title.trim(),
      content: form.content.trim(),
      color: form.color,
      pinned: form.archived ? false : form.pinned,
      archived: form.archived,
      tags,
    });
  };

  return (
    <div
      className="modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-modal-title"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="modal">
        <div className="modal-header">
          <h2 className="modal-title" id="edit-modal-title">
            Edit note
          </h2>
          <button
            id="close-modal-btn"
            className="btn btn-ghost btn-icon"
            onClick={onClose}
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} id="edit-note-form">
          <div className="form-grid">
            <div className="input-group">
              <label className="input-label" htmlFor="edit-title">
                Title
              </label>
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
              <span className="char-count">{form.title.length}/100</span>
            </div>

            <div className="input-group">
              <label className="input-label" htmlFor="edit-content">
                Content
              </label>
              <textarea
                id="edit-content"
                className="input"
                name="content"
                value={form.content}
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-group">
              <label className="input-label" htmlFor="edit-tags">
                Tags
              </label>
              <input
                id="edit-tags"
                className="input"
                type="text"
                name="tags"
                placeholder="work, ideas, personal"
                value={form.tags}
                onChange={handleChange}
              />
            </div>

            <div className="color-picker-group">
              <span className="input-label">Accent</span>
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

            <div className="modal-toggles">
              <label className="pin-toggle" htmlFor="edit-pinned">
                <input
                  type="checkbox"
                  name="pinned"
                  id="edit-pinned"
                  checked={form.pinned}
                  onChange={handleChange}
                  disabled={form.archived}
                />
                Pin note
              </label>
              <label className="pin-toggle" htmlFor="edit-archived">
                <input
                  type="checkbox"
                  name="archived"
                  id="edit-archived"
                  checked={form.archived}
                  onChange={handleChange}
                />
                Archive note
              </label>
            </div>
          </div>

          <div className="modal-actions">
            <button
              type="button"
              id="cancel-edit-btn"
              className="btn btn-ghost"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              id="save-edit-btn"
              className="btn btn-primary"
              disabled={loading || !form.title.trim() || !form.content.trim()}
            >
              {loading ? "Saving…" : "Save changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
