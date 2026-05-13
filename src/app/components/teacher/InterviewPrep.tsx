import { useState } from 'react';
import { Plus, Users, Target, TrendingUp, Video, Calendar } from 'lucide-react';

interface InterviewQuestion {
  id: string;
  title: string;
  type: 'coding' | 'mcq' | 'behavioral' | 'discussion';
  difficulty: 'easy' | 'medium' | 'hard';
  company?: string;
  topic: string;
  question: string;
  modelAnswer?: string;
}

interface InterviewSession {
  id: string;
  student1: string;
  student2: string;
  scheduledAt: string;
  status: 'scheduled' | 'completed';
  feedback?: string;
}

const COMPANIES = ['Infosys', 'TCS', 'Wipro', 'Accenture', 'Cognizant', 'Amazon', 'Google', 'Microsoft'];

const MOCK_QUESTIONS: InterviewQuestion[] = [
  {
    id: '1',
    title: 'Reverse a Linked List',
    type: 'coding',
    difficulty: 'medium',
    company: 'Amazon',
    topic: 'Data Structures',
    question: 'Write a function to reverse a singly linked list',
    modelAnswer: 'Use three pointers: prev, current, and next...',
  },
  {
    id: '2',
    title: 'Tell me about yourself',
    type: 'behavioral',
    difficulty: 'easy',
    topic: 'HR Round',
    question: 'Introduce yourself professionally',
  },
];

const MOCK_SESSIONS: InterviewSession[] = [
  {
    id: '1',
    student1: 'John Doe',
    student2: 'Jane Smith',
    scheduledAt: '2025-12-12 10:00 AM',
    status: 'scheduled',
  },
];

export function InterviewPrep() {
  const [questions, setQuestions] = useState<InterviewQuestion[]>(MOCK_QUESTIONS);
  const [sessions, setSessions] = useState<InterviewSession[]>(MOCK_SESSIONS);
  const [showAddQuestion, setShowAddQuestion] = useState(false);
  const [showScheduleSession, setShowScheduleSession] = useState(false);
  const [selectedPack, setSelectedPack] = useState('all');
  const [newQuestion, setNewQuestion] = useState<Partial<InterviewQuestion>>({
    title: '',
    type: 'mcq',
    difficulty: 'medium',
    topic: '',
    question: '',
  });

  const handleAddQuestion = () => {
    if (newQuestion.title && newQuestion.question) {
      const question: InterviewQuestion = {
        id: Date.now().toString(),
        title: newQuestion.title,
        type: newQuestion.type!,
        difficulty: newQuestion.difficulty!,
        company: newQuestion.company,
        topic: newQuestion.topic!,
        question: newQuestion.question,
        modelAnswer: newQuestion.modelAnswer,
      };
      setQuestions([...questions, question]);
      setShowAddQuestion(false);
      setNewQuestion({ title: '', type: 'mcq', difficulty: 'medium', topic: '', question: '' });
    }
  };

  const filteredQuestions = selectedPack === 'all'
    ? questions
    : questions.filter(q => q.company === selectedPack);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-gray-900">Interview Preparation</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setShowScheduleSession(true)}
            className="flex items-center gap-2 px-4 py-2 border border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50"
          >
            <Calendar className="w-4 h-4" />
            Schedule Mock Interview
          </button>
          <button
            onClick={() => setShowAddQuestion(true)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            <Plus className="w-4 h-4" />
            Add Question
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-2">
            <Target className="w-8 h-8 text-indigo-600" />
            <div>
              <p className="text-gray-600">Total Questions</p>
              <p className="text-gray-900">{questions.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-2">
            <Users className="w-8 h-8 text-green-600" />
            <div>
              <p className="text-gray-600">Active Students</p>
              <p className="text-gray-900">45</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-8 h-8 text-blue-600" />
            <div>
              <p className="text-gray-600">Avg Readiness</p>
              <p className="text-gray-900">72%</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-2">
            <Video className="w-8 h-8 text-purple-600" />
            <div>
              <p className="text-gray-600">Mock Sessions</p>
              <p className="text-gray-900">{sessions.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Company Packs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-gray-900 mb-4">Company Preparation Packs</h3>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedPack('all')}
            className={`px-4 py-2 rounded-lg ${
              selectedPack === 'all'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All Questions
          </button>
          {COMPANIES.map(company => (
            <button
              key={company}
              onClick={() => setSelectedPack(company)}
              className={`px-4 py-2 rounded-lg ${
                selectedPack === company
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {company}
            </button>
          ))}
        </div>
      </div>

      {/* Questions List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredQuestions.map((question) => (
          <div key={question.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-3">
              <h3 className="text-gray-900">{question.title}</h3>
              <span className={`px-2 py-0.5 rounded text-xs ${
                question.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
                question.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                'bg-red-100 text-red-700'
              }`}>
                {question.difficulty}
              </span>
            </div>
            <div className="space-y-2 mb-3">
              <div className="flex items-center gap-2 text-sm">
                <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded">
                  {question.type}
                </span>
                {question.company && (
                  <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded">
                    {question.company}
                  </span>
                )}
              </div>
              <p className="text-gray-600">{question.topic}</p>
              <p className="text-gray-700 line-clamp-2">{question.question}</p>
            </div>
            <button className="text-indigo-600 hover:text-indigo-700">View Details</button>
          </div>
        ))}
      </div>

      {/* Scheduled Sessions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-gray-900 mb-4">Scheduled Mock Interviews</h3>
        <div className="space-y-3">
          {sessions.map((session) => (
            <div key={session.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="text-gray-900">{session.student1} ↔ {session.student2}</p>
                <p className="text-gray-600">Scheduled: {session.scheduledAt}</p>
              </div>
              <span className={`px-3 py-1 rounded ${
                session.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
              }`}>
                {session.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Add Question Modal */}
      {showAddQuestion && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-2xl my-8">
            <h3 className="text-gray-900 mb-4">Add Interview Question</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-1">Question Title</label>
                <input
                  type="text"
                  value={newQuestion.title}
                  onChange={(e) => setNewQuestion({ ...newQuestion, title: e.target.value })}
                  placeholder="e.g., Reverse a Linked List"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 mb-1">Type</label>
                  <select
                    value={newQuestion.type}
                    onChange={(e) => setNewQuestion({ ...newQuestion, type: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="coding">Coding</option>
                    <option value="mcq">MCQ</option>
                    <option value="behavioral">Behavioral</option>
                    <option value="discussion">Discussion</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 mb-1">Difficulty</label>
                  <select
                    value={newQuestion.difficulty}
                    onChange={(e) => setNewQuestion({ ...newQuestion, difficulty: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 mb-1">Company (Optional)</label>
                  <select
                    value={newQuestion.company || ''}
                    onChange={(e) => setNewQuestion({ ...newQuestion, company: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">Select Company</option>
                    {COMPANIES.map(company => (
                      <option key={company} value={company}>{company}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 mb-1">Topic</label>
                  <input
                    type="text"
                    value={newQuestion.topic}
                    onChange={(e) => setNewQuestion({ ...newQuestion, topic: e.target.value })}
                    placeholder="e.g., Data Structures"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-gray-700 mb-1">Question</label>
                <textarea
                  value={newQuestion.question}
                  onChange={(e) => setNewQuestion({ ...newQuestion, question: e.target.value })}
                  placeholder="Enter the question..."
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-1">Model Answer (Optional)</label>
                <textarea
                  value={newQuestion.modelAnswer}
                  onChange={(e) => setNewQuestion({ ...newQuestion, modelAnswer: e.target.value })}
                  placeholder="Provide a model answer..."
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleAddQuestion}
                  className="flex-1 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700"
                >
                  Add Question
                </button>
                <button
                  onClick={() => setShowAddQuestion(false)}
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
