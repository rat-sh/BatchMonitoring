import { useState } from 'react';
import { Target, Clock, TrendingUp, Play, CheckCircle } from 'lucide-react';

interface InterviewQuestion {
  id: string;
  title: string;
  type: 'coding' | 'mcq' | 'behavioral' | 'discussion';
  difficulty: 'easy' | 'medium' | 'hard';
  company?: string;
  topic: string;
  attempted: boolean;
  score?: number;
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
    attempted: true,
    score: 85,
  },
  {
    id: '2',
    title: 'Tell me about yourself',
    type: 'behavioral',
    difficulty: 'easy',
    topic: 'HR Round',
    attempted: false,
  },
  {
    id: '3',
    title: 'OOP Concepts',
    type: 'mcq',
    difficulty: 'easy',
    company: 'TCS',
    topic: 'Programming',
    attempted: true,
    score: 90,
  },
];

export function StudentInterviewPractice() {
  const [questions] = useState<InterviewQuestion[]>(MOCK_QUESTIONS);
  const [selectedPack, setSelectedPack] = useState('all');
  const [showPracticeModal, setShowPracticeModal] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<InterviewQuestion | null>(null);

  const filteredQuestions = selectedPack === 'all'
    ? questions
    : questions.filter(q => q.company === selectedPack);

  const attemptedCount = questions.filter(q => q.attempted).length;
  const avgScore = questions.filter(q => q.score).reduce((sum, q) => sum + q.score!, 0) / attemptedCount || 0;
  const readinessScore = (attemptedCount / questions.length * 100 * 0.5) + (avgScore * 0.5);

  const startPractice = (question: InterviewQuestion) => {
    setSelectedQuestion(question);
    setShowPracticeModal(true);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-gray-900">Interview Preparation</h2>

      {/* Stats Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-2">
            <Target className="w-8 h-8 text-indigo-600" />
            <div>
              <p className="text-gray-600">Questions</p>
              <p className="text-gray-900">{questions.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-2">
            <CheckCircle className="w-8 h-8 text-green-600" />
            <div>
              <p className="text-gray-600">Attempted</p>
              <p className="text-gray-900">{attemptedCount}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-8 h-8 text-blue-600" />
            <div>
              <p className="text-gray-600">Avg Score</p>
              <p className="text-gray-900">{avgScore.toFixed(0)}%</p>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-sm p-6 text-white">
          <div className="flex items-center gap-3 mb-2">
            <Target className="w-8 h-8" />
            <div>
              <p className="opacity-90">Readiness</p>
              <p className="text-white">{readinessScore.toFixed(0)}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Insights */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-gray-900 mb-4">Your Progress</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-gray-600 mb-2">Top Strengths</p>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Data Structures</span>
                <span className="text-green-600">Strong</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Programming</span>
                <span className="text-green-600">Strong</span>
              </div>
            </div>
          </div>
          <div>
            <p className="text-gray-600 mb-2">Areas to Improve</p>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Behavioral Questions</span>
                <span className="text-yellow-600">Practice More</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700">System Design</span>
                <span className="text-red-600">Needs Work</span>
              </div>
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
      <div>
        <h3 className="text-gray-900 mb-4">Practice Questions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredQuestions.map((question) => (
            <div key={question.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-gray-900">{question.title}</h3>
                <div className="flex flex-col gap-1 items-end">
                  <span className={`px-2 py-0.5 rounded text-xs ${
                    question.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
                    question.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {question.difficulty}
                  </span>
                  {question.attempted && (
                    <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded text-xs">
                      {question.score}%
                    </span>
                  )}
                </div>
              </div>
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded">
                    {question.type}
                  </span>
                  {question.company && (
                    <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded">
                      {question.company}
                    </span>
                  )}
                </div>
                <p className="text-gray-600">{question.topic}</p>
              </div>
              <button
                onClick={() => startPractice(question)}
                className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg ${
                  question.attempted
                    ? 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                    : 'bg-indigo-600 text-white hover:bg-indigo-700'
                }`}
              >
                <Play className="w-4 h-4" />
                {question.attempted ? 'Practice Again' : 'Start Practice'}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Practice Modal */}
      {showPracticeModal && selectedQuestion && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-900">{selectedQuestion.title}</h3>
              <div className="flex items-center gap-2 text-gray-600">
                <Clock className="w-5 h-5" />
                <span>30:00</span>
              </div>
            </div>
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-700">This is where the interview question content would appear. Students can practice coding, answer MCQs, or prepare behavioral responses here.</p>
              </div>
              {selectedQuestion.type === 'behavioral' && (
                <div>
                  <label className="block text-gray-700 mb-1">Your Answer (Optional: Record Audio/Video)</label>
                  <textarea
                    rows={6}
                    placeholder="Type your answer or use the record button..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <div className="flex gap-2 mt-2">
                    <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                      🎤 Record Audio
                    </button>
                    <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                      📹 Record Video
                    </button>
                  </div>
                </div>
              )}
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    alert('Answer submitted!');
                    setShowPracticeModal(false);
                  }}
                  className="flex-1 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700"
                >
                  Submit Answer
                </button>
                <button
                  onClick={() => setShowPracticeModal(false)}
                  className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
