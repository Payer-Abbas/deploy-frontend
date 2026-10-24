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
        {note.pinned && <span className="note-pin-badge">Pinned</span>}
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
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M4 20h4l10.5-10.5a2.1 2.1 0 0 0-3-3L5 17v3z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
              <path d="M13.5 6.5l3 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
          <button
            id={`delete-note-${note._id}`}
            className="btn btn-danger btn-icon"
            onClick={() => onDelete(note._id)}
            title="Delete note"
            aria-label="Delete note"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M5 7h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <path d="M10 11v6M14 11v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <path d="M8 7l1-2h6l1 2v12a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1V7z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>
    </article>
  );
}
