const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const handleResponse = async (res) => {
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Something went wrong");
  return data;
};

export const notesApi = {
  getAll: () =>
    fetch(`${API_URL}/notes`).then(handleResponse),

  getById: (id) =>
    fetch(`${API_URL}/notes/${id}`).then(handleResponse),

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

  delete: (id) =>
    fetch(`${API_URL}/notes/${id}`, { method: "DELETE" }).then(handleResponse),
};
