/**
 * Single note card — shows title, content, date, pin badge.
 * Action buttons appear on hover.
 */
export default function NoteCard({ note, onEdit, onDelete }) {
  const formattedDate = new Date(note.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <article
      className={`note-card ${note.pinned ? "pinned" : ""}`}
      style={{ "--note-accent": note.color || "var(--accent)" }}
    >
      <div className="note-header">
        <h2 className="note-title">{note.title}</h2>
        {note.pinned && <span className="note-pin-badge">📌 Pinned</span>}
      </div>

      <p className="note-content">{note.content}</p>

      <div className="note-footer">
        <span className="note-date">{formattedDate}</span>
        <div className="note-actions">
          <button
            id={`edit-note-${note._id}`}
            className="btn btn-ghost btn-icon"
            onClick={() => onEdit(note)}
            title="Edit note"
            aria-label="Edit note"
          >
            ✏️
          </button>
          <button
            id={`delete-note-${note._id}`}
            className="btn btn-danger btn-icon"
            onClick={() => onDelete(note._id)}
            title="Delete note"
            aria-label="Delete note"
          >
            🗑️
          </button>
        </div>
      </div>
    </article>
  );
}
