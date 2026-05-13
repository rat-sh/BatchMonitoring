import { useState } from 'react';
import { Plus, Trash2, Download, Upload, FileText } from 'lucide-react';

interface Note {
  id: string;
  title: string;
  batch: string;
  subject: string;
  description: string;
  uploadedAt: string;
  fileSize: string;
}

const MOCK_NOTES: Note[] = [
  {
    id: '1',
    title: 'Quantum Mechanics - Chapter 1',
    batch: 'Batch A',
    subject: 'Physics',
    description: 'Introduction to quantum mechanics and wave functions',
    uploadedAt: '2025-12-05',
    fileSize: '2.5 MB',
  },
  {
    id: '2',
    title: 'Calculus Formulas Reference',
    batch: 'Batch B',
    subject: 'Mathematics',
    description: 'Complete list of integration and differentiation formulas',
    uploadedAt: '2025-12-07',
    fileSize: '1.8 MB',
  },
];

export function NotesManager() {
  const [notes, setNotes] = useState<Note[]>(MOCK_NOTES);
  const [showModal, setShowModal] = useState(false);
  const [newNote, setNewNote] = useState({
    title: '',
    batch: '',
    subject: '',
    description: '',
  });

  const handleAddNote = () => {
    if (newNote.title && newNote.batch && newNote.subject) {
      const note: Note = {
        id: Date.now().toString(),
        ...newNote,
        uploadedAt: new Date().toISOString().split('T')[0],
        fileSize: '1.2 MB',
      };
      setNotes([...notes, note]);
      setShowModal(false);
      setNewNote({ title: '', batch: '', subject: '', description: '' });
    }
  };

  const handleDeleteNote = (id: string) => {
    setNotes(notes.filter(note => note.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-gray-900">Notes Management</h2>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          <Plus className="w-4 h-4" />
          Add Note
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {notes.map((note) => (
          <div key={note.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-indigo-600" />
              </div>
              <button
                onClick={() => handleDeleteNote(note.id)}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <h3 className="text-gray-900 mb-2">{note.title}</h3>
            <div className="space-y-1 mb-4">
              <p className="text-gray-600">
                {note.subject} • {note.batch}
              </p>
              <p className="text-gray-500">{note.description}</p>
              <p className="text-gray-500">
                {note.fileSize} • {note.uploadedAt}
              </p>
            </div>
            <button className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700">
              <Download className="w-4 h-4" />
              Download
            </button>
          </div>
        ))}
      </div>

      {notes.length === 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No notes uploaded yet. Click "Add Note" to upload study materials.</p>
        </div>
      )}

      {/* Add Note Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
            <h3 className="text-gray-900 mb-4">Add Note</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  value={newNote.title}
                  onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
                  placeholder="e.g., Quantum Mechanics - Chapter 1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 mb-1">Batch</label>
                  <input
                    type="text"
                    value={newNote.batch}
                    onChange={(e) => setNewNote({ ...newNote, batch: e.target.value })}
                    placeholder="e.g., Batch A"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-1">Subject</label>
                  <input
                    type="text"
                    value={newNote.subject}
                    onChange={(e) => setNewNote({ ...newNote, subject: e.target.value })}
                    placeholder="e.g., Physics"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-gray-700 mb-1">Description</label>
                <textarea
                  value={newNote.description}
                  onChange={(e) => setNewNote({ ...newNote, description: e.target.value })}
                  placeholder="Brief description of the note..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-1">Upload File</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-indigo-400 cursor-pointer">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600">Click to upload or drag and drop</p>
                  <p className="text-gray-500">PDF, DOC, or DOCX (max 10MB)</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleAddNote}
                  className="flex-1 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700"
                >
                  Add Note
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
