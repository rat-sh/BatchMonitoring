import { useState } from 'react';
import { Plus, MessageCircle, Tag } from 'lucide-react';

interface Doubt {
  id: string;
  question: string;
  chapter: string;
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
    question: 'Can you explain the Heisenberg Uncertainty Principle in simpler terms?',
    chapter: 'Chapter 3 - Quantum Mechanics',
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
];

export function StudentDoubtForum() {
  const [doubts, setDoubts] = useState<Doubt[]>(MOCK_DOUBTS);
  const [showPostModal, setShowPostModal] = useState(false);
  const [selectedDoubt, setSelectedDoubt] = useState<Doubt | null>(null);
  const [replyText, setReplyText] = useState('');
  const [newDoubt, setNewDoubt] = useState({ question: '', chapter: '' });

  const handlePostDoubt = () => {
    if (newDoubt.question && newDoubt.chapter) {
      const doubt: Doubt = {
        id: Date.now().toString(),
        question: newDoubt.question,
        chapter: newDoubt.chapter,
        postedAt: new Date().toLocaleString(),
        replies: [],
        resolved: false,
      };
      setDoubts([doubt, ...doubts]);
      setShowPostModal(false);
      setNewDoubt({ question: '', chapter: '' });
    }
  };

  const handleReply = () => {
    if (selectedDoubt && replyText.trim()) {
      const newReply: Reply = {
        id: Date.now().toString(),
        author: 'You',
        message: replyText,
        postedAt: new Date().toLocaleString(),
        isTeacher: false,
      };

      setDoubts(doubts.map(doubt =>
        doubt.id === selectedDoubt.id
          ? { ...doubt, replies: [...doubt.replies, newReply] }
          : doubt
      ));

      setReplyText('');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-gray-900">Doubt Forum</h2>
        <button
          onClick={() => setShowPostModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          <Plus className="w-4 h-4" />
          Post a Doubt
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Doubts List */}
        <div className="lg:col-span-1 space-y-3">
          {doubts.map((doubt) => (
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

          {doubts.length === 0 && (
            <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
              <p className="text-gray-500">No doubts posted yet</p>
            </div>
          )}
        </div>

        {/* Doubt Details */}
        <div className="lg:col-span-2">
          {selectedDoubt ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="mb-6">
                <h3 className="text-gray-900 mb-2">{selectedDoubt.question}</h3>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span>{selectedDoubt.postedAt}</span>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <Tag className="w-4 h-4 text-indigo-600" />
                  <span className="text-indigo-600">{selectedDoubt.chapter}</span>
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

                {selectedDoubt.replies.length === 0 && (
                  <p className="text-gray-500 text-center py-4">No replies yet</p>
                )}
              </div>

              {/* Reply Input */}
              <div className="border-t border-gray-200 pt-6">
                <label className="block text-gray-700 mb-2">Add a Reply</label>
                <textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Share your thoughts..."
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-3"
                />
                <button
                  onClick={handleReply}
                  className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  Post Reply
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
              <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Select a doubt to view details</p>
            </div>
          )}
        </div>
      </div>

      {/* Post Doubt Modal */}
      {showPostModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
            <h3 className="text-gray-900 mb-4">Post a Doubt</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-1">Your Question</label>
                <textarea
                  value={newDoubt.question}
                  onChange={(e) => setNewDoubt({ ...newDoubt, question: e.target.value })}
                  placeholder="What do you need help with?"
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-1">Chapter/Topic</label>
                <input
                  type="text"
                  value={newDoubt.chapter}
                  onChange={(e) => setNewDoubt({ ...newDoubt, chapter: e.target.value })}
                  placeholder="e.g., Chapter 3 - Quantum Mechanics"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handlePostDoubt}
                  className="flex-1 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700"
                >
                  Post Doubt
                </button>
                <button
                  onClick={() => setShowPostModal(false)}
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
