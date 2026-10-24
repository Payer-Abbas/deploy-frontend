import { useState, useEffect, useMemo } from "react";
import { notesApi } from "./api/notes";
import { useToast } from "./hooks/useToast";
import NoteForm from "./components/NoteForm";
import NoteCard from "./components/NoteCard";
import EditModal from "./components/EditModal";
import ToastContainer from "./components/ToastContainer";

const FILTERS = [
  { id: "active", label: "Active" },
  { id: "pinned", label: "Pinned" },
  { id: "archived", label: "Archived" },
  { id: "all", label: "All" },
];

const SORTS = [
  { id: "newest", label: "Newest" },
  { id: "oldest", label: "Oldest" },
  { id: "title", label: "Title A–Z" },
];

export default function App() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState({ fetch: true, save: false });
  const [editNote, setEditNote] = useState(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("active");
  const [sort, setSort] = useState("newest");
  const [activeTag, setActiveTag] = useState("");
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

  const replaceNote = (updated) => {
    setNotes((prev) => prev.map((n) => (n._id === updated._id ? updated : n)));
  };

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
      replaceNote(res.data);
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

  const handleTogglePin = async (id) => {
    try {
      const res = await notesApi.togglePin(id);
      replaceNote(res.data);
      addToast(res.data.pinned ? "Note pinned" : "Note unpinned");
    } catch (err) {
      addToast(err.message || "Failed to update pin", "error");
    }
  };

  const handleToggleArchive = async (id) => {
    try {
      const res = await notesApi.toggleArchive(id);
      replaceNote(res.data);
      addToast(res.data.archived ? "Note archived" : "Note restored");
    } catch (err) {
      addToast(err.message || "Failed to archive note", "error");
    }
  };

  const handleCopy = async (note) => {
    try {
      const text = `${note.title}\n\n${note.content}`;
      await navigator.clipboard.writeText(text);
      addToast("Copied to clipboard");
    } catch {
      addToast("Could not copy to clipboard", "error");
    }
  };

  const handleDuplicate = async (note) => {
    try {
      const res = await notesApi.create({
        title: note.title.endsWith("(copy)")
          ? note.title
          : `${note.title} (copy)`,
        content: note.content,
        color: note.color,
        pinned: false,
        archived: false,
        tags: note.tags || [],
      });
      setNotes((prev) => [res.data, ...prev]);
      setFilter("active");
      addToast("Note duplicated");
    } catch (err) {
      addToast(err.message || "Failed to duplicate note", "error");
    }
  };

  const allTags = useMemo(() => {
    const set = new Set();
    notes.forEach((n) => (n.tags || []).forEach((t) => set.add(t)));
    return [...set].sort();
  }, [notes]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();

    let list = notes.filter((n) => {
      if (filter === "active" && n.archived) return false;
      if (filter === "pinned" && (!n.pinned || n.archived)) return false;
      if (filter === "archived" && !n.archived) return false;

      if (activeTag && !(n.tags || []).includes(activeTag)) return false;

      if (!q) return true;
      const inTitle = n.title.toLowerCase().includes(q);
      const inContent = n.content.toLowerCase().includes(q);
      const inTags = (n.tags || []).some((t) => t.includes(q));
      return inTitle || inContent || inTags;
    });

    list = [...list].sort((a, b) => {
      if (sort === "title") {
        return a.title.localeCompare(b.title);
      }
      const aTime = new Date(a.updatedAt || a.createdAt).getTime();
      const bTime = new Date(b.updatedAt || b.createdAt).getTime();
      if (sort === "oldest") return aTime - bTime;
      // newest: pinned first within active views, then date
      if (a.pinned !== b.pinned && filter !== "archived") {
        return a.pinned ? -1 : 1;
      }
      return bTime - aTime;
    });

    return list;
  }, [notes, search, filter, sort, activeTag]);

  const activeCount = notes.filter((n) => !n.archived).length;

  return (
    <div className="app">
      <header className="header">
        <div className="container header-inner">
          <div className="logo">
            <div className="logo-mark" aria-hidden="true">
              N
            </div>
            <span>NoteStack</span>
          </div>
          <span className="note-count-badge">
            {activeCount} active · {notes.length} total
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
              Capture ideas fast — tag, pin, archive, and find notes in seconds.
            </p>
          </section>

          <NoteForm onSave={handleCreate} loading={loading.save} />

          <div className="toolbar">
            <div className="search-bar">
              <svg
                className="search-icon"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
              >
                <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
                <path
                  d="M20 20l-3.5-3.5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
              <input
                id="search-notes"
                className="input"
                type="search"
                placeholder="Search title, content, or tags…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                aria-label="Search notes"
              />
            </div>

            <div className="toolbar-row">
              <div className="filter-chips" role="tablist" aria-label="Filter notes">
                {FILTERS.map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    role="tab"
                    aria-selected={filter === f.id}
                    className={`chip ${filter === f.id ? "active" : ""}`}
                    onClick={() => setFilter(f.id)}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              <label className="sort-control" htmlFor="sort-notes">
                <span className="input-label">Sort</span>
                <select
                  id="sort-notes"
                  className="input select-input"
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                >
                  {SORTS.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            {allTags.length > 0 && (
              <div className="tag-filter-row">
                <span className="input-label">Tags</span>
                <div className="filter-chips">
                  <button
                    type="button"
                    className={`chip ${!activeTag ? "active" : ""}`}
                    onClick={() => setActiveTag("")}
                  >
                    Any
                  </button>
                  {allTags.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      className={`chip ${activeTag === tag ? "active" : ""}`}
                      onClick={() =>
                        setActiveTag((prev) => (prev === tag ? "" : tag))
                      }
                    >
                      #{tag}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="section-header">
            <span className="section-title">
              {search || activeTag
                ? `Results (${filtered.length})`
                : filter === "active"
                  ? "Active notes"
                  : filter === "pinned"
                    ? "Pinned notes"
                    : filter === "archived"
                      ? "Archived notes"
                      : "All notes"}
            </span>
          </div>

          {loading.fetch ? (
            <div className="loading-spinner">
              <div className="spinner" />
              <span>Loading notes…</span>
            </div>
          ) : filtered.length === 0 ? (
            <div className="empty-state">
              <div className="empty-mark" aria-hidden="true">
                N
              </div>
              <h3>
                {search || activeTag
                  ? "No notes match your filters"
                  : filter === "archived"
                    ? "No archived notes"
                    : "No notes yet"}
              </h3>
              <p>
                {search || activeTag
                  ? "Try a different keyword or tag"
                  : "Create your first note above"}
              </p>
            </div>
          ) : (
            <div className="notes-grid">
              {filtered.map((note) => (
                <NoteCard
                  key={note._id}
                  note={note}
                  onEdit={setEditNote}
                  onDelete={handleDelete}
                  onTogglePin={handleTogglePin}
                  onToggleArchive={handleToggleArchive}
                  onCopy={handleCopy}
                  onDuplicate={handleDuplicate}
                  onTagClick={setActiveTag}
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
