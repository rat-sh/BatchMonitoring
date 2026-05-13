import { useState } from 'react';
import { Plus, Play, Download, Tag, Search, Video, Eye, HardDrive } from 'lucide-react';

interface Recording {
  id: string;
  number: number;
  title: string;
  batch: string;
  subject: string;
  chapter: string;
  duration: string;
  uploadedAt: string;
  views: number;
  size: string;
  tags: string[];
}

const MOCK_RECORDINGS: Recording[] = [
  {
    id: '1',
    number: 1,
    title: 'Introduction to Quantum Mechanics',
    batch: 'Batch A',
    subject: 'Physics',
    chapter: 'Chapter 1',
    duration: '45:30',
    uploadedAt: '2026-05-01',
    views: 23,
    size: '850 MB',
    tags: ['quantum', 'introduction', 'theory'],
  },
  {
    id: '2',
    number: 2,
    title: 'Wave Functions and Operators',
    batch: 'Batch A',
    subject: 'Physics',
    chapter: 'Chapter 2',
    duration: '52:15',
    uploadedAt: '2026-05-05',
    views: 18,
    size: '920 MB',
    tags: ['quantum', 'wave-function', 'operators'],
  },
  {
    id: '3',
    number: 3,
    title: 'Differential Calculus Fundamentals',
    batch: 'Batch B',
    subject: 'Mathematics',
    chapter: 'Chapter 1',
    duration: '38:45',
    uploadedAt: '2026-05-03',
    views: 28,
    size: '680 MB',
    tags: ['calculus', 'differentiation', 'fundamentals'],
  },
];

export function Recordings() {
  const [recordings, setRecordings] = useState<Recording[]>(MOCK_RECORDINGS);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterChapter, setFilterChapter] = useState('all');
  const [newRecording, setNewRecording] = useState({ title: '', batch: '', subject: '', chapter: '', tags: '' });

  const handleUpload = () => {
    if (newRecording.title && newRecording.batch && newRecording.subject) {
      const recording: Recording = {
        id: Date.now().toString(),
        number: recordings.length + 1,
        title: newRecording.title,
        batch: newRecording.batch,
        subject: newRecording.subject,
        chapter: newRecording.chapter || 'General',
        duration: '00:00',
        uploadedAt: new Date().toISOString().split('T')[0],
        views: 0,
        size: '0 MB',
        tags: newRecording.tags.split(',').map(t => t.trim()).filter(t => t),
      };
      setRecordings([...recordings, recording]);
      setShowUploadModal(false);
      setNewRecording({ title: '', batch: '', subject: '', chapter: '', tags: '' });
    }
  };

  const chapters = ['all', ...new Set(recordings.map(r => r.chapter))];
  const filteredRecordings = recordings.filter(recording => {
    const matchesSearch = recording.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      recording.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesChapter = filterChapter === 'all' || recording.chapter === filterChapter;
    return matchesSearch && matchesChapter;
  });

  const totalDuration = '3h 15m';

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-gray-900">Lecture Recordings</h2>
        <button
          onClick={() => setShowUploadModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Upload Recording</span>
          <span className="sm:hidden">Upload</span>
        </button>
      </div>

      {/* Stats — 2 per row on mobile, 4 on lg */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-2 mb-1">
            <Video className="w-4 h-4 text-indigo-600" />
            <p className="text-gray-600 text-xs sm:text-sm">Total</p>
          </div>
          <p className="text-gray-900 text-xl sm:text-2xl">{recordings.length}</p>
          <p className="text-gray-500 text-xs">Recordings</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-2 mb-1">
            <Eye className="w-4 h-4 text-green-600" />
            <p className="text-gray-600 text-xs sm:text-sm">Views</p>
          </div>
          <p className="text-gray-900 text-xl sm:text-2xl">{recordings.reduce((sum, r) => sum + r.views, 0)}</p>
          <p className="text-gray-500 text-xs">Total</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-2 mb-1">
            <Tag className="w-4 h-4 text-purple-600" />
            <p className="text-gray-600 text-xs sm:text-sm">Chapters</p>
          </div>
          <p className="text-gray-900 text-xl sm:text-2xl">{new Set(recordings.map(r => r.chapter)).size}</p>
          <p className="text-gray-500 text-xs">Covered</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-2 mb-1">
            <HardDrive className="w-4 h-4 text-orange-600" />
            <p className="text-gray-600 text-xs sm:text-sm">Duration</p>
          </div>
          <p className="text-gray-900 text-xl sm:text-2xl">{totalDuration}</p>
          <p className="text-gray-500 text-xs">Total</p>
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
          <div key={recording.id} className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center shrink-0">
                <Video className="w-6 h-6 text-indigo-600" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="px-2 py-0.5 bg-gray-200 text-gray-700 rounded text-xs">#{recording.number}</span>
                  <span className="text-gray-900 text-sm">{recording.title}</span>
                </div>
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-gray-600 mb-2">
                  <span>{recording.subject}</span>
                  <span>•</span>
                  <span>{recording.batch}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Tag className="w-3 h-3" />{recording.chapter}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {recording.tags.map((tag, index) => (
                    <span key={index} className="px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded text-xs">{tag}</span>
                  ))}
                </div>
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-gray-500">
                  <span>{recording.duration}</span>
                  <span>•</span>
                  <span>{recording.views} views</span>
                  <span>•</span>
                  <span>{recording.size}</span>
                  <span>•</span>
                  <span>{recording.uploadedAt}</span>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 shrink-0">
                <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                  <Play className="w-4 h-4 text-gray-700" />
                </button>
                <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                  <Download className="w-4 h-4 text-gray-700" />
                </button>
              </div>
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

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h3 className="text-gray-900 mb-4">Upload Recording</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-1 text-sm">Recording Title</label>
                <input
                  type="text"
                  value={newRecording.title}
                  onChange={(e) => setNewRecording({ ...newRecording, title: e.target.value })}
                  placeholder="e.g., Introduction to Quantum Mechanics"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-700 mb-1 text-sm">Batch</label>
                  <input
                    type="text"
                    value={newRecording.batch}
                    onChange={(e) => setNewRecording({ ...newRecording, batch: e.target.value })}
                    placeholder="e.g., Batch A"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-1 text-sm">Subject</label>
                  <input
                    type="text"
                    value={newRecording.subject}
                    onChange={(e) => setNewRecording({ ...newRecording, subject: e.target.value })}
                    placeholder="e.g., Physics"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-gray-700 mb-1 text-sm">Chapter</label>
                <input
                  type="text"
                  value={newRecording.chapter}
                  onChange={(e) => setNewRecording({ ...newRecording, chapter: e.target.value })}
                  placeholder="e.g., Chapter 1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-1 text-sm">Tags (comma separated)</label>
                <input
                  type="text"
                  value={newRecording.tags}
                  onChange={(e) => setNewRecording({ ...newRecording, tags: e.target.value })}
                  placeholder="e.g., quantum, introduction, theory"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-1 text-sm">Video File</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-indigo-400 cursor-pointer">
                  <Video className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-700 text-sm">Click to upload or drag and drop</p>
                  <p className="text-gray-500 text-xs">MP4, AVI, MKV (max 2GB)</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={handleUpload} className="flex-1 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 text-sm">
                  Upload
                </button>
                <button onClick={() => setShowUploadModal(false)} className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 text-sm">
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
