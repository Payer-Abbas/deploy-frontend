/**
 * Single note card — title, content, tags, date, quick actions.
 */
export default function NoteCard({
  note,
  onEdit,
  onDelete,
  onTogglePin,
  onToggleArchive,
  onCopy,
  onDuplicate,
  onTagClick,
}) {
  const formattedDate = new Date(note.updatedAt || note.createdAt).toLocaleDateString(
    "en-US",
    {
      month: "short",
      day: "numeric",
      year: "numeric",
    }
  );

  return (
    <article
      className={`note-card ${note.pinned ? "pinned" : ""} ${note.archived ? "archived" : ""}`}
      style={{ "--note-accent": note.color || "var(--accent)" }}
    >
      <div className="note-header">
        <h2 className="note-title">{note.title}</h2>
        <div className="note-badges">
          {note.pinned && <span className="note-pin-badge">Pinned</span>}
          {note.archived && <span className="note-archive-badge">Archived</span>}
        </div>
      </div>

      <p className="note-content">{note.content}</p>

      {Array.isArray(note.tags) && note.tags.length > 0 && (
        <div className="note-tags">
          {note.tags.map((tag) => (
            <button
              key={tag}
              type="button"
              className="tag-chip"
              onClick={() => onTagClick?.(tag)}
              title={`Filter by ${tag}`}
            >
              #{tag}
            </button>
          ))}
        </div>
      )}

      <div className="note-footer">
        <span className="note-date">{formattedDate}</span>
        <div className="note-actions">
          <button
            id={`pin-note-${note._id}`}
            className="btn btn-ghost btn-icon"
            onClick={() => onTogglePin(note._id)}
            title={note.pinned ? "Unpin" : "Pin"}
            aria-label={note.pinned ? "Unpin note" : "Pin note"}
            disabled={note.archived}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M12 2l1.2 5.2L18 9l-4.8 1.8L12 16l-1.2-5.2L6 9l4.8-1.8L12 2z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinejoin="round"
                fill={note.pinned ? "currentColor" : "none"}
              />
            </svg>
          </button>
          <button
            id={`copy-note-${note._id}`}
            className="btn btn-ghost btn-icon"
            onClick={() => onCopy(note)}
            title="Copy content"
            aria-label="Copy note content"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <rect x="9" y="9" width="11" height="11" rx="2" stroke="currentColor" strokeWidth="2" />
              <path
                d="M5 15V5a2 2 0 0 1 2-2h10"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
          <button
            id={`duplicate-note-${note._id}`}
            className="btn btn-ghost btn-icon"
            onClick={() => onDuplicate(note)}
            title="Duplicate note"
            aria-label="Duplicate note"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <rect x="8" y="8" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="2" />
              <path
                d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"
                stroke="currentColor"
                strokeWidth="2"
              />
            </svg>
          </button>
          <button
            id={`archive-note-${note._id}`}
            className="btn btn-ghost btn-icon"
            onClick={() => onToggleArchive(note._id)}
            title={note.archived ? "Unarchive" : "Archive"}
            aria-label={note.archived ? "Unarchive note" : "Archive note"}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M4 7h16v3H4V7z" stroke="currentColor" strokeWidth="2" />
              <path d="M6 10v8a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1v-8" stroke="currentColor" strokeWidth="2" />
              <path d="M10 14h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
          <button
            id={`edit-note-${note._id}`}
            className="btn btn-ghost btn-icon"
            onClick={() => onEdit(note)}
            title="Edit note"
            aria-label="Edit note"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M4 20h4l10.5-10.5a2.1 2.1 0 0 0-3-3L5 17v3z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinejoin="round"
              />
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
              <path
                d="M8 7l1-2h6l1 2v12a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1V7z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>
    </article>
  );
}
