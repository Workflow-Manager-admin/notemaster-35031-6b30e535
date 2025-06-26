import React, { useState, useEffect } from 'react';
import './App.css';

const COLORS = {
  primary: '#1976d2',
  secondary: '#424242',
  accent: '#ffc107'
};

// PUBLIC_INTERFACE
function App() {
  // Notes state: { id, title, content }
  const [notes, setNotes] = useState(() => {
    // Load from localStorage for persistence
    const saved = window.localStorage.getItem('notes');
    return saved ? JSON.parse(saved) : [];
  });
  const [form, setForm] = useState({ id: '', title: '', content: '' });
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState('');

  // Persist notes to localStorage for demo (no backend)
  useEffect(() => {
    window.localStorage.setItem('notes', JSON.stringify(notes));
  }, [notes]);

  // PUBLIC_INTERFACE
  function handleInputChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  // PUBLIC_INTERFACE
  function handleEdit(note) {
    setForm({ ...note });
    setEditingId(note.id);
  }

  // PUBLIC_INTERFACE
  function handleDelete(id) {
    if (window.confirm('Are you sure you want to delete this note?')) {
      setNotes(notes => notes.filter(n => n.id !== id));
      if (editingId === id) {
        setForm({ id: '', title: '', content: '' });
        setEditingId(null);
      }
    }
  }

  // PUBLIC_INTERFACE
  function handleFormSubmit(e) {
    e.preventDefault();
    if (!form.title.trim() && !form.content.trim()) return;
    if (editingId) {
      // Edit
      setNotes(notes =>
        notes.map(n => (n.id === editingId ? { ...n, ...form } : n))
      );
    } else {
      // Create
      setNotes([
        ...notes,
        {
          id: Date.now().toString(),
          title: form.title,
          content: form.content
        }
      ]);
    }
    setForm({ id: '', title: '', content: '' });
    setEditingId(null);
  }

  // PUBLIC_INTERFACE
  function handleCancelEdit() {
    setForm({ id: '', title: '', content: '' });
    setEditingId(null);
  }

  // PUBLIC_INTERFACE
  function handleSearchChange(e) {
    setSearch(e.target.value);
  }

  const filteredNotes = notes.filter(
    n =>
      n.title.toLowerCase().includes(search.toLowerCase()) ||
      n.content.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="notes-app-outer">
      <NavBar />
      <main className="main-section">
        <section className="notes-panel">
          <div className="notes-header-row">
            <h2 className="notes-title">Notes</h2>
            <input
              className="notes-search"
              type="text"
              placeholder="Search notes..."
              value={search}
              onChange={handleSearchChange}
              aria-label="Search notes"
            />
          </div>
          <div className="notes-list" data-testid="notes-list">
            {filteredNotes.length === 0 ? (
              <div className="zero-message">No notes found.</div>
            ) : (
              filteredNotes
                .sort((a, b) => b.id - a.id)
                .map(note => (
                  <NoteItem
                    key={note.id}
                    note={note}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    isEditing={editingId === note.id}
                  />
                ))
            )}
          </div>
        </section>
        <section className="form-panel">
          <NoteForm
            form={form}
            onChange={handleInputChange}
            onCancel={handleCancelEdit}
            onSubmit={handleFormSubmit}
            isEditing={!!editingId}
          />
        </section>
      </main>
    </div>
  );
}

// Navigation Bar Component
// PUBLIC_INTERFACE
function NavBar() {
  return (
    <nav
      className="navbar"
      style={{
        background: COLORS.primary,
        color: '#fff',
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
      }}
    >
      <div className="navbar-content">
        <span className="navbar-title">
          <span role="img" aria-label="memo" className="memo-icon">
            🗒️
          </span>
          Notes App
        </span>
      </div>
    </nav>
  );
}

// Individual Note Display Component
// PUBLIC_INTERFACE
function NoteItem({ note, onEdit, onDelete, isEditing }) {
  return (
    <div
      className={`note-item${isEditing ? ' editing' : ''}`}
      style={{
        borderLeft: `4px solid ${isEditing ? COLORS.accent : COLORS.primary}`,
        background: isEditing ? '#fff9e0' : '#fff'
      }}
      tabIndex={0}
      aria-label={`Note: ${note.title}`}
    >
      <div className="note-item-head">
        <strong className="note-title">{note.title}</strong>
      </div>
      <div className="note-content">{note.content}</div>
      <div className="note-actions">
        <button
          className="btn btn-edit"
          style={{ background: COLORS.primary }}
          onClick={() => onEdit(note)}
          aria-label="Edit note"
        >
          Edit
        </button>
        <button
          className="btn btn-delete"
          style={{ background: COLORS.secondary, color: '#fff' }}
          onClick={() => onDelete(note.id)}
          aria-label="Delete note"
        >
          Delete
        </button>
      </div>
    </div>
  );
}

// Note Form (Create/Edit)
// PUBLIC_INTERFACE
function NoteForm({ form, onChange, onSubmit, onCancel, isEditing }) {
  return (
    <form className="note-form" onSubmit={onSubmit} aria-label="Note form">
      <h2 style={{ color: COLORS.primary }}>
        {isEditing ? 'Edit Note' : 'Create a Note'}
      </h2>
      <label className="form-label">
        Title
        <input
          type="text"
          name="title"
          className="form-input"
          autoComplete="off"
          value={form.title}
          onChange={onChange}
          required
        />
      </label>
      <label className="form-label">
        Content
        <textarea
          name="content"
          className="form-input"
          value={form.content}
          onChange={onChange}
          rows={4}
          required
        ></textarea>
      </label>
      <div className="form-actions">
        <button
          className="btn btn-save"
          type="submit"
          style={{ background: COLORS.accent, color: COLORS.secondary }}
        >
          {isEditing ? 'Update' : 'Create'}
        </button>
        {isEditing && (
          <button
            className="btn btn-cancel"
            type="button"
            onClick={onCancel}
            style={{
              marginLeft: 8,
              background: COLORS.secondary,
              color: COLORS.accent,
              border: `1px solid ${COLORS.accent}`
            }}
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

export default App;
