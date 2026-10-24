// Prefer relative /api (Nginx proxy). Override with VITE_API_URL for local/dev.
const API_URL = import.meta.env.VITE_API_URL || "/api";

const handleResponse = async (res) => {
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Something went wrong");
  return data;
};

export const notesApi = {
  getAll: () => fetch(`${API_URL}/notes`).then(handleResponse),

  getById: (id) => fetch(`${API_URL}/notes/${id}`).then(handleResponse),

  create: (noteData) =>
    fetch(`${API_URL}/notes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(noteData),
    }).then(handleResponse),

  update: (id, noteData) =>
    fetch(`${API_URL}/notes/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(noteData),
    }).then(handleResponse),

  togglePin: (id) =>
    fetch(`${API_URL}/notes/${id}/pin`, { method: "PATCH" }).then(handleResponse),

  toggleArchive: (id) =>
    fetch(`${API_URL}/notes/${id}/archive`, { method: "PATCH" }).then(
      handleResponse
    ),

  delete: (id) =>
    fetch(`${API_URL}/notes/${id}`, { method: "DELETE" }).then(handleResponse),
};
