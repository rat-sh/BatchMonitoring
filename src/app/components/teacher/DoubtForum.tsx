import { useState } from 'react';
import { MessageCircle, Tag, Send } from 'lucide-react';

interface Doubt {
  id: string;
  studentName: string;
  question: string;
  chapter: string;
  batch: string;
  postedAt: string;
  replies: Reply[];
  resolved: boolean;
}

interface Reply {
  id: string;
  author: string;
  message: string;
  postedAt: string;
  isTeacher: boolean;
}

const MOCK_DOUBTS: Doubt[] = [
  {
    id: '1',
    studentName: 'John Doe',
    question: 'Can you explain the Heisenberg Uncertainty Principle in simpler terms?',
    chapter: 'Chapter 3 - Quantum Mechanics',
    batch: 'Batch A',
    postedAt: '2025-12-09 10:30 AM',
    resolved: false,
    replies: [
      {
        id: 'r1',
        author: 'Jane Smith',
        message: 'I think it means we cannot measure both position and momentum precisely at the same time.',
        postedAt: '2025-12-09 11:00 AM',
        isTeacher: false,
      },
    ],
  },
  {
    id: '2',
    studentName: 'Mike Johnson',
    question: 'What is the difference between heat and temperature?',
    chapter: 'Chapter 2 - Thermodynamics',
    batch: 'Batch A',
    postedAt: '2025-12-08 02:15 PM',
    resolved: true,
    replies: [
      {
        id: 'r2',
        author: 'Dr. Smith',
        message: 'Heat is the energy transferred between objects, while temperature is a measure of the average kinetic energy of particles.',
        postedAt: '2025-12-08 03:00 PM',
        isTeacher: true,
      },
    ],
  },
];

export function DoubtForum() {
  const [doubts, setDoubts] = useState<Doubt[]>(MOCK_DOUBTS);
  const [selectedDoubt, setSelectedDoubt] = useState<Doubt | null>(null);
  const [replyText, setReplyText] = useState('');
  const [filter, setFilter] = useState<'all' | 'unresolved' | 'resolved'>('all');

  const handleReply = () => {
    if (selectedDoubt && replyText.trim()) {
      const newReply: Reply = {
        id: Date.now().toString(),
        author: 'Teacher',
        message: replyText,
        postedAt: new Date().toLocaleString(),
        isTeacher: true,
      };

      setDoubts(doubts.map(doubt =>
        doubt.id === selectedDoubt.id
          ? { ...doubt, replies: [...doubt.replies, newReply] }
          : doubt
      ));

      setReplyText('');
    }
  };

  const markAsResolved = (doubtId: string) => {
    setDoubts(doubts.map(doubt =>
      doubt.id === doubtId ? { ...doubt, resolved: true } : doubt
    ));
  };

  const filteredDoubts = doubts.filter(doubt => {
    if (filter === 'unresolved') return !doubt.resolved;
    if (filter === 'resolved') return doubt.resolved;
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-gray-900">Doubt Forum</h2>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as any)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="all">All Doubts</option>
          <option value="unresolved">Unresolved</option>
          <option value="resolved">Resolved</option>
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Doubts List */}
        <div className="lg:col-span-1 space-y-3">
          {filteredDoubts.map((doubt) => (
            <div
              key={doubt.id}
              onClick={() => setSelectedDoubt(doubt)}
              className={`bg-white rounded-lg border p-4 cursor-pointer hover:border-indigo-300 transition-colors ${
                selectedDoubt?.id === doubt.id ? 'border-indigo-600' : 'border-gray-200'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <h4 className="text-gray-900 line-clamp-2">{doubt.question}</h4>
                {doubt.resolved ? (
                  <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs shrink-0 ml-2">
                    Resolved
                  </span>
                ) : (
                  <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded text-xs shrink-0 ml-2">
                    Open
                  </span>
                )}
              </div>
              <p className="text-gray-600 mb-2">{doubt.studentName}</p>
              <div className="flex items-center gap-2 text-sm">
                <Tag className="w-4 h-4 text-gray-500" />
                <span className="text-gray-500">{doubt.chapter}</span>
              </div>
              <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                <MessageCircle className="w-4 h-4" />
                <span>{doubt.replies.length} replies</span>
              </div>
            </div>
          ))}

          {filteredDoubts.length === 0 && (
            <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
              <p className="text-gray-500">No doubts found</p>
            </div>
          )}
        </div>

        {/* Doubt Details */}
        <div className="lg:col-span-2">
          {selectedDoubt ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="mb-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-gray-900 mb-2">{selectedDoubt.question}</h3>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span>{selectedDoubt.studentName}</span>
                      <span>•</span>
                      <span>{selectedDoubt.batch}</span>
                      <span>•</span>
                      <span>{selectedDoubt.postedAt}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <Tag className="w-4 h-4 text-indigo-600" />
                      <span className="text-indigo-600">{selectedDoubt.chapter}</span>
                    </div>
                  </div>
                  {!selectedDoubt.resolved && (
                    <button
                      onClick={() => markAsResolved(selectedDoubt.id)}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                      Mark Resolved
                    </button>
                  )}
                </div>
              </div>

              {/* Replies */}
              <div className="border-t border-gray-200 pt-6 mb-6 space-y-4">
                <h4 className="text-gray-900">Replies ({selectedDoubt.replies.length})</h4>
                {selectedDoubt.replies.map((reply) => (
                  <div
                    key={reply.id}
                    className={`rounded-lg p-4 ${
                      reply.isTeacher ? 'bg-indigo-50 border border-indigo-200' : 'bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-gray-900">{reply.author}</span>
                      {reply.isTeacher && (
                        <span className="px-2 py-0.5 bg-indigo-600 text-white rounded text-xs">
                          Teacher
                        </span>
                      )}
                      <span className="text-gray-500 text-sm">• {reply.postedAt}</span>
                    </div>
                    <p className="text-gray-700">{reply.message}</p>
                  </div>
                ))}
              </div>

              {/* Reply Input */}
              <div className="border-t border-gray-200 pt-6">
                <label className="block text-gray-700 mb-2">Your Reply</label>
                <textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Type your answer here..."
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-3"
                />
                <button
                  onClick={handleReply}
                  className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  <Send className="w-4 h-4" />
                  Send Reply
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
              <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Select a doubt to view details and reply</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
