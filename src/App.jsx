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

  /* ── Fetch all notes ── */
  const fetchNotes = async () => {
    try {
      setLoading((l) => ({ ...l, fetch: true }));
      const res = await notesApi.getAll();
      setNotes(res.data);
    } catch (err) {
      addToast(err.message || "Failed to load notes", "error");
    } finally {
      setLoading((l) => ({ ...l, fetch: false }));
    }
  };

  useEffect(() => { fetchNotes(); }, []);

  /* ── Create note ── */
  const handleCreate = async (formData) => {
    try {
      setLoading((l) => ({ ...l, save: true }));
      const res = await notesApi.create(formData);
      setNotes((prev) => [res.data, ...prev]);
      addToast("Note created! 🎉");
    } catch (err) {
      addToast(err.message || "Failed to create note", "error");
    } finally {
      setLoading((l) => ({ ...l, save: false }));
    }
  };

  /* ── Update note ── */
  const handleUpdate = async (id, formData) => {
    try {
      setLoading((l) => ({ ...l, save: true }));
      const res = await notesApi.update(id, formData);
      setNotes((prev) => prev.map((n) => (n._id === id ? res.data : n)));
      setEditNote(null);
      addToast("Note updated! ✅");
    } catch (err) {
      addToast(err.message || "Failed to update note", "error");
    } finally {
      setLoading((l) => ({ ...l, save: false }));
    }
  };

  /* ── Delete note ── */
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this note?")) return;
    try {
      await notesApi.delete(id);
      setNotes((prev) => prev.filter((n) => n._id !== id));
      addToast("Note deleted 🗑️");
    } catch (err) {
      addToast(err.message || "Failed to delete note", "error");
    }
  };

  /* ── Filter by search ── */
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
      {/* ── Header ── */}
      <header className="header">
        <div className="container header-inner">
          <div className="logo">
            <div className="logo-icon">📝</div>
            <span>NoteStack</span>
          </div>
          <span className="note-count-badge">{notes.length} notes</span>
        </div>
      </header>

      <main>
        <div className="container">
          {/* ── Hero ── */}
          <section className="hero">
            <h1>Capture your ideas</h1>
            <p>A full-stack MERN notes app with complete CRUD operations — built for learning deployment.</p>
          </section>

          {/* ── Create form ── */}
          <NoteForm onSave={handleCreate} loading={loading.save} />

          {/* ── Search ── */}
          <div className="search-bar">
            <span className="search-icon">🔍</span>
            <input
              id="search-notes"
              className="input"
              type="search"
              placeholder="Search notes by title or content…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Search notes"
            />
          </div>

          {/* ── Notes list ── */}
          <div className="section-header">
            <span className="section-title">
              {search ? `Results (${filtered.length})` : "All Notes"}
            </span>
          </div>

          {loading.fetch ? (
            <div className="loading-spinner">
              <div className="spinner" />
              <span>Loading notes…</span>
            </div>
          ) : filtered.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🗒️</div>
              <h3>{search ? "No notes match your search" : "No notes yet"}</h3>
              <p>{search ? "Try a different keyword" : "Create your first note above!"}</p>
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

      {/* ── Edit Modal ── */}
      <EditModal
        note={editNote}
        onSave={handleUpdate}
        onClose={() => setEditNote(null)}
        loading={loading.save}
      />

      {/* ── Toasts ── */}
      <ToastContainer toasts={toasts} />
    </div>
  );
}
