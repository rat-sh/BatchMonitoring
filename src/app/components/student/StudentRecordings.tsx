import { useState } from 'react';
import { Play, Search, Tag, Video, BookOpen } from 'lucide-react';

interface Recording {
  id: string;
  number: number;
  title: string;
  subject: string;
  chapter: string;
  duration: string;
  uploadedAt: string;
  views: number;
  tags: string[];
  watched: boolean;
}

const MOCK_RECORDINGS: Recording[] = [
  {
    id: '1',
    number: 1,
    title: 'Introduction to Quantum Mechanics',
    subject: 'Physics',
    chapter: 'Chapter 1',
    duration: '45:30',
    uploadedAt: '2026-05-01',
    views: 23,
    tags: ['quantum', 'introduction', 'theory'],
    watched: true,
  },
  {
    id: '2',
    number: 2,
    title: 'Wave Functions and Operators',
    subject: 'Physics',
    chapter: 'Chapter 2',
    duration: '52:15',
    uploadedAt: '2026-05-05',
    views: 18,
    tags: ['quantum', 'wave-function', 'operators'],
    watched: false,
  },
  {
    id: '3',
    number: 3,
    title: 'Heisenberg Uncertainty Principle',
    subject: 'Physics',
    chapter: 'Chapter 3',
    duration: '38:20',
    uploadedAt: '2026-05-08',
    views: 15,
    tags: ['quantum', 'uncertainty', 'heisenberg'],
    watched: false,
  },
];

export function StudentRecordings() {
  const [recordings] = useState<Recording[]>(MOCK_RECORDINGS);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterChapter, setFilterChapter] = useState('all');

  const chapters = ['all', ...new Set(recordings.map(r => r.chapter))];

  const filteredRecordings = recordings.filter(recording => {
    const matchesSearch = recording.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      recording.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesChapter = filterChapter === 'all' || recording.chapter === filterChapter;
    return matchesSearch && matchesChapter;
  });

  const watchedCount = recordings.filter(r => r.watched).length;
  const completionPct = recordings.length ? Math.round((watchedCount / recordings.length) * 100) : 0;

  return (
    <div className="space-y-5">
      <h2 className="text-gray-900">Lecture Recordings</h2>

      {/* Stats — Total Lectures + Watched side by side, Completion full width below */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-2 mb-1">
            <Video className="w-4 h-4 text-indigo-600" />
            <p className="text-gray-600 text-sm">Total Lectures</p>
          </div>
          <p className="text-gray-900 text-2xl">{recordings.length}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-2 mb-1">
            <Play className="w-4 h-4 text-green-600" />
            <p className="text-gray-600 text-sm">Watched</p>
          </div>
          <p className="text-gray-900 text-2xl">{watchedCount}<span className="text-gray-500 text-sm"> / {recordings.length}</span></p>
        </div>
      </div>

      {/* Completion — full width */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-purple-600" />
            <p className="text-gray-600 text-sm">Completion</p>
          </div>
          <p className="text-gray-900">{completionPct}%</p>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-indigo-600 h-2.5 rounded-full transition-all"
            style={{ width: `${completionPct}%` }}
          />
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by title or tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            />
          </div>
          <select
            value={filterChapter}
            onChange={(e) => setFilterChapter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
          >
            {chapters.map(chapter => (
              <option key={chapter} value={chapter}>
                {chapter === 'all' ? 'All Chapters' : chapter}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Recordings List */}
      <div className="space-y-3">
        {filteredRecordings.map((recording) => (
          <div
            key={recording.id}
            className={`bg-white rounded-xl border p-4 ${recording.watched ? 'border-gray-200' : 'border-indigo-200'}`}
          >
            <div className="flex items-start gap-3">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center shrink-0 ${recording.watched ? 'bg-gray-100' : 'bg-indigo-100'}`}>
                <Video className={`w-6 h-6 ${recording.watched ? 'text-gray-600' : 'text-indigo-600'}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="px-2 py-0.5 bg-gray-200 text-gray-700 rounded text-xs">#{recording.number}</span>
                  <span className="text-gray-900 text-sm">{recording.title}</span>
                  {recording.watched && (
                    <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs">Watched</span>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-gray-600 mb-2">
                  <span>{recording.subject}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Tag className="w-3 h-3" />{recording.chapter}
                  </span>
                  <span>•</span>
                  <span>{recording.duration}</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {recording.tags.map((tag, index) => (
                    <span key={index} className="px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded text-xs">
                      {tag}
                    </span>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-1">Uploaded: {recording.uploadedAt} · {recording.views} views</p>
              </div>
              <button className={`p-2.5 rounded-lg shrink-0 ${recording.watched ? 'border border-gray-300 hover:bg-gray-50' : 'bg-indigo-600 hover:bg-indigo-700'}`}>
                <Play className={`w-5 h-5 ${recording.watched ? 'text-gray-700' : 'text-white'}`} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredRecordings.length === 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-10 text-center">
          <Video className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No recordings found</p>
        </div>
      )}
    </div>
  );
}
