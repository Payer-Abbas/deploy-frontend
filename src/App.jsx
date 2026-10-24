import { useState, useEffect, useMemo } from "react";
import { notesApi } from "./api/notes";
import { useToast } from "./hooks/useToast";
import NoteForm from "./components/NoteForm";
import NoteCard from "./components/NoteCard";
import EditModal from "./components/EditModal";
import ToastContainer from "./components/ToastContainer";

export default function App() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState({ fetch: true, save: false });
  const [editNote, setEditNote] = useState(null);
  const [search, setSearch] = useState("");
  const { toasts, addToast } = useToast();

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const res = await notesApi.getAll();
        if (!cancelled) setNotes(res.data);
      } catch (err) {
        if (!cancelled) addToast(err.message || "Failed to load notes", "error");
      } finally {
        if (!cancelled) setLoading((l) => ({ ...l, fetch: false }));
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [addToast]);

  const handleCreate = async (formData) => {
    try {
      setLoading((l) => ({ ...l, save: true }));
      const res = await notesApi.create(formData);
      setNotes((prev) => [res.data, ...prev]);
      addToast("Note created");
    } catch (err) {
      addToast(err.message || "Failed to create note", "error");
    } finally {
      setLoading((l) => ({ ...l, save: false }));
    }
  };

  const handleUpdate = async (id, formData) => {
    try {
      setLoading((l) => ({ ...l, save: true }));
      const res = await notesApi.update(id, formData);
      setNotes((prev) => prev.map((n) => (n._id === id ? res.data : n)));
      setEditNote(null);
      addToast("Note updated");
    } catch (err) {
      addToast(err.message || "Failed to update note", "error");
    } finally {
      setLoading((l) => ({ ...l, save: false }));
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this note?")) return;
    try {
      await notesApi.delete(id);
      setNotes((prev) => prev.filter((n) => n._id !== id));
      addToast("Note deleted");
    } catch (err) {
      addToast(err.message || "Failed to delete note", "error");
    }
  };

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return notes;
    return notes.filter(
      (n) =>
        n.title.toLowerCase().includes(q) ||
        n.content.toLowerCase().includes(q)
    );
  }, [notes, search]);

  return (
    <div className="app">
      <header className="header">
        <div className="container header-inner">
          <div className="logo">
            <div className="logo-mark" aria-hidden="true">N</div>
            <span>NoteStack</span>
          </div>
          <span className="note-count-badge">
            {notes.length} {notes.length === 1 ? "note" : "notes"}
          </span>
        </div>
      </header>

      <main>
        <div className="container">
          <section className="hero">
            <h1 className="brand-wordmark">
              Note<span>Stack</span>
            </h1>
            <p className="hero-lead">
              Capture ideas fast — create, search, and organize notes with full CRUD.
            </p>
          </section>

          <NoteForm onSave={handleCreate} loading={loading.save} />

          <div className="search-bar">
            <svg className="search-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
              <path d="M20 20l-3.5-3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <input
              id="search-notes"
              className="input"
              type="search"
              placeholder="Search by title or content…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Search notes"
            />
          </div>

          <div className="section-header">
            <span className="section-title">
              {search ? `Results (${filtered.length})` : "All notes"}
            </span>
          </div>

          {loading.fetch ? (
            <div className="loading-spinner">
              <div className="spinner" />
              <span>Loading notes…</span>
            </div>
          ) : filtered.length === 0 ? (
            <div className="empty-state">
              <div className="empty-mark" aria-hidden="true">N</div>
              <h3>{search ? "No notes match your search" : "No notes yet"}</h3>
              <p>{search ? "Try a different keyword" : "Create your first note above"}</p>
            </div>
          ) : (
            <div className="notes-grid">
              {filtered.map((note) => (
                <NoteCard
                  key={note._id}
                  note={note}
                  onEdit={setEditNote}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {editNote && (
        <EditModal
          key={editNote._id}
          note={editNote}
          onSave={handleUpdate}
          onClose={() => setEditNote(null)}
          loading={loading.save}
        />
      )}

      <ToastContainer toasts={toasts} />
    </div>
  );
}
