import { useState } from 'react';
import { FileText, Download, Search, Filter } from 'lucide-react';

interface Note {
  id: string;
  title: string;
  subject: string;
  batch: string;
  description: string;
  uploadedAt: string;
  fileSize: string;
  teacher: string;
}

const MOCK_NOTES: Note[] = [
  {
    id: '1',
    title: 'Quantum Mechanics - Chapter 1',
    subject: 'Physics',
    batch: 'Batch A',
    description: 'Introduction to quantum mechanics and wave functions',
    uploadedAt: '2025-12-05',
    fileSize: '2.5 MB',
    teacher: 'Dr. Smith',
  },
  {
    id: '2',
    title: 'Calculus Formulas Reference',
    subject: 'Mathematics',
    batch: 'Batch B',
    description: 'Complete list of integration and differentiation formulas',
    uploadedAt: '2025-12-07',
    fileSize: '1.8 MB',
    teacher: 'Prof. Johnson',
  },
  {
    id: '3',
    title: 'Thermodynamics Lecture Notes',
    subject: 'Physics',
    batch: 'Batch A',
    description: 'Laws of thermodynamics and heat engines',
    uploadedAt: '2025-12-08',
    fileSize: '3.2 MB',
    teacher: 'Dr. Smith',
  },
  {
    id: '4',
    title: 'Organic Chemistry Reactions',
    subject: 'Chemistry',
    batch: 'Batch A',
    description: 'Common organic reactions and mechanisms',
    uploadedAt: '2025-12-09',
    fileSize: '4.1 MB',
    teacher: 'Dr. Williams',
  },
];

export function NotesViewer() {
  const [notes] = useState<Note[]>(MOCK_NOTES);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('all');

  const subjects = ['all', ...new Set(notes.map(n => n.subject))];

  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         note.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject = selectedSubject === 'all' || note.subject === selectedSubject;
    return matchesSearch && matchesSubject;
  });

  return (
    <div className="space-y-6">
      <h2 className="text-gray-900">Study Notes</h2>

      {/* Search and Filter */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search notes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none"
            >
              {subjects.map(subject => (
                <option key={subject} value={subject}>
                  {subject === 'all' ? 'All Subjects' : subject}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Notes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredNotes.map((note) => (
          <div key={note.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
              <FileText className="w-6 h-6 text-indigo-600" />
            </div>
            <h3 className="text-gray-900 mb-2">{note.title}</h3>
            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded text-sm">
                  {note.subject}
                </span>
                <span className="text-gray-500">{note.batch}</span>
              </div>
              <p className="text-gray-600">{note.description}</p>
              <p className="text-gray-500">By {note.teacher}</p>
              <div className="flex items-center justify-between text-gray-500">
                <span>{note.fileSize}</span>
                <span>{note.uploadedAt}</span>
              </div>
            </div>
            <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
              <Download className="w-4 h-4" />
              Download
            </button>
          </div>
        ))}
      </div>

      {filteredNotes.length === 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No notes found matching your search.</p>
        </div>
      )}
    </div>
  );
}
