import { useState, useEffect } from 'react';
import { Clock, FileText, CheckCircle, AlertCircle, Lock, Key, Users, ChevronLeft, Shield } from 'lucide-react';

interface Exam {
  id: string;
  title: string;
  batch: string;
  batchCode: string;
  duration: string;
  durationMinutes: number;
  totalQuestions: number;
  status: 'upcoming' | 'active' | 'completed';
  scheduledAt: string;
  examKey: string;
  score?: number;
  totalScore?: number;
}

interface Question {
  id: string;
  type: 'mcq' | 'theoretical' | 'truefalse' | 'numerical';
  question: string;
  options?: string[];
}

const MOCK_EXAMS: Exam[] = [
  {
    id: '1',
    title: 'Midterm Physics Test',
    batch: 'Batch A - Physics',
    batchCode: 'PHY-A-2026',
    duration: '60 minutes',
    durationMinutes: 60,
    totalQuestions: 20,
    status: 'active',
    scheduledAt: '2026-05-13 10:00 AM',
    examKey: 'PHYS-A4K9',
  },
  {
    id: '2',
    title: 'Calculus Quiz',
    batch: 'Batch B - Mathematics',
    batchCode: 'MATH-B-2026',
    duration: '30 minutes',
    durationMinutes: 30,
    totalQuestions: 10,
    status: 'upcoming',
    scheduledAt: '2026-05-20 02:00 PM',
    examKey: 'MATH-7XP2',
  },
  {
    id: '3',
    title: 'Chemistry Final',
    batch: 'Batch A - Physics',
    batchCode: 'PHY-A-2026',
    duration: '90 minutes',
    durationMinutes: 90,
    totalQuestions: 30,
    status: 'completed',
    scheduledAt: '2026-04-20 10:00 AM',
    examKey: 'CHEM-Z9M3',
    score: 85,
    totalScore: 100,
  },
];

const SAMPLE_QUESTIONS: Question[] = [
  { id: '1', type: 'mcq', question: 'What is the speed of light in vacuum?', options: ['3 × 10⁸ m/s', '3 × 10⁶ m/s', '3 × 10⁷ m/s', '3 × 10⁹ m/s'] },
  { id: '2', type: 'mcq', question: 'Which law states that energy cannot be created or destroyed?', options: ['First Law of Thermodynamics', "Newton's First Law", 'Law of Conservation of Momentum', "Ohm's Law"] },
  { id: '3', type: 'truefalse', question: 'The Heisenberg Uncertainty Principle states that we cannot know both position and momentum of a particle with arbitrary precision.' },
  { id: '4', type: 'numerical', question: 'What is the atomic number of Carbon?' },
  { id: '5', type: 'theoretical', question: 'Explain the concept of quantum entanglement and its significance in quantum mechanics.' },
];

type EntryStep = 'list' | 'enter-batch' | 'enter-pin' | 'ready' | 'exam' | 'submitted';

export function ExamViewer() {
  const [exams] = useState<Exam[]>(MOCK_EXAMS);
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);
  const [entryStep, setEntryStep] = useState<EntryStep>('list');
  const [batchCodeInput, setBatchCodeInput] = useState('');
  const [pinInput, setPinInput] = useState('');
  const [batchError, setBatchError] = useState('');
  const [pinError, setPinError] = useState('');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isLocked, setIsLocked] = useState(false);

  useEffect(() => {
    if (entryStep !== 'exam' || !selectedExam) return;
    let t = selectedExam.durationMinutes * 60;
    setTimeRemaining(t);
    const interval = setInterval(() => {
      t -= 1;
      setTimeRemaining(t);
      if (t <= 0) {
        clearInterval(interval);
        handleSubmitExam();
      }
    }, 1000);
    setIsLocked(true);
    return () => clearInterval(interval);
  }, [entryStep]);

  const handleSelectExam = (exam: Exam) => {
    setSelectedExam(exam);
    setBatchCodeInput('');
    setPinInput('');
    setBatchError('');
    setPinError('');
    setEntryStep('enter-batch');
  };

  const handleBatchCodeSubmit = () => {
    if (!selectedExam) return;
    if (batchCodeInput.trim().toUpperCase() === selectedExam.batchCode) {
      setBatchError('');
      setEntryStep('enter-pin');
    } else {
      setBatchError('Invalid batch code. Ask your teacher for the correct code.');
    }
  };

  const handlePinSubmit = () => {
    if (!selectedExam) return;
    if (pinInput.trim().toUpperCase() === selectedExam.examKey) {
      setPinError('');
      setEntryStep('ready');
    } else {
      setPinError('Incorrect exam key. Ask your teacher if you forgot it.');
    }
  };

  const handleStartExam = () => {
    setCurrentQuestionIndex(0);
    setAnswers({});
    setEntryStep('exam');
  };

  const handleAnswer = (questionId: string, answer: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const handleSubmitExam = () => {
    setIsLocked(false);
    setEntryStep('submitted');
  };

  const handleBackToList = () => {
    setSelectedExam(null);
    setEntryStep('list');
    setBatchCodeInput('');
    setPinInput('');
    setBatchError('');
    setPinError('');
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  // EXAM IN PROGRESS — full screen lock
  if (entryStep === 'exam' && selectedExam) {
    const currentQuestion = SAMPLE_QUESTIONS[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / SAMPLE_QUESTIONS.length) * 100;
    const timeWarning = timeRemaining < 300;

    return (
      <div className="fixed inset-0 bg-gray-50 z-40 overflow-y-auto">
        {/* Lock Banner */}
        <div className="bg-red-600 text-white px-4 py-2 flex items-center justify-center gap-2 text-sm">
          <Lock className="w-4 h-4" />
          Exam in progress — do not close or switch tabs
          <Shield className="w-4 h-4" />
        </div>

        {/* Exam Header */}
        <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4">
          <div className="max-w-3xl mx-auto flex items-center justify-between">
            <div>
              <h2 className="text-gray-900">{selectedExam.title}</h2>
              <p className="text-gray-600 text-sm">{selectedExam.batch}</p>
            </div>
            <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${timeWarning ? 'bg-red-100 text-red-700' : 'bg-indigo-100 text-indigo-700'}`}>
              <Clock className="w-5 h-5" />
              <span className="font-mono">{formatTime(timeRemaining)}</span>
            </div>
          </div>
          <div className="max-w-3xl mx-auto mt-3">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-indigo-600 h-2 rounded-full transition-all" style={{ width: `${progress}%` }} />
            </div>
            <p className="text-gray-500 text-xs mt-1">Question {currentQuestionIndex + 1} of {SAMPLE_QUESTIONS.length}</p>
          </div>
        </div>

        {/* Question */}
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 space-y-5">
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center gap-2 mb-4">
              <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs">
                {currentQuestion.type === 'mcq' ? 'Multiple Choice' : currentQuestion.type === 'truefalse' ? 'True / False' : currentQuestion.type === 'numerical' ? 'Numerical' : 'Theoretical'}
              </span>
            </div>
            <p className="text-gray-900">{currentQuestion.question}</p>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-5">
            {currentQuestion.type === 'mcq' && currentQuestion.options ? (
              <div className="space-y-3">
                {currentQuestion.options.map((option, index) => (
                  <label key={index} className={`flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition-colors ${answers[currentQuestion.id] === option ? 'border-indigo-600 bg-indigo-50' : 'border-gray-200 hover:border-indigo-300'}`}>
                    <input type="radio" name={`q-${currentQuestion.id}`} value={option} checked={answers[currentQuestion.id] === option} onChange={(e) => handleAnswer(currentQuestion.id, e.target.value)} className="w-5 h-5 text-indigo-600" />
                    <span className="text-gray-900">{option}</span>
                  </label>
                ))}
              </div>
            ) : currentQuestion.type === 'truefalse' ? (
              <div className="flex gap-3">
                {['True', 'False'].map(val => (
                  <label key={val} className={`flex-1 flex items-center justify-center gap-2 p-4 border-2 rounded-xl cursor-pointer ${answers[currentQuestion.id] === val ? 'border-indigo-600 bg-indigo-50' : 'border-gray-200 hover:border-indigo-300'}`}>
                    <input type="radio" name={`q-${currentQuestion.id}`} value={val} checked={answers[currentQuestion.id] === val} onChange={(e) => handleAnswer(currentQuestion.id, e.target.value)} className="w-4 h-4" />
                    <span>{val}</span>
                  </label>
                ))}
              </div>
            ) : currentQuestion.type === 'numerical' ? (
              <input type="number" value={answers[currentQuestion.id] || ''} onChange={(e) => handleAnswer(currentQuestion.id, e.target.value)} placeholder="Enter your answer..." className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            ) : (
              <textarea value={answers[currentQuestion.id] || ''} onChange={(e) => handleAnswer(currentQuestion.id, e.target.value)} placeholder="Type your answer here..." rows={6} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            )}

            <div className="flex gap-3 mt-5">
              <button onClick={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))} disabled={currentQuestionIndex === 0} className="px-5 py-2.5 border border-gray-300 rounded-xl hover:bg-gray-50 disabled:opacity-40 text-sm">
                Previous
              </button>
              {currentQuestionIndex < SAMPLE_QUESTIONS.length - 1 ? (
                <button onClick={() => setCurrentQuestionIndex(currentQuestionIndex + 1)} className="flex-1 px-5 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 text-sm">
                  Next
                </button>
              ) : (
                <button onClick={handleSubmitExam} className="flex-1 px-5 py-2.5 bg-green-600 text-white rounded-xl hover:bg-green-700 text-sm">
                  Submit Exam
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // SUBMITTED
  if (entryStep === 'submitted') {
    return (
      <div className="flex flex-col items-center justify-center py-16 space-y-4">
        <CheckCircle className="w-20 h-20 text-green-500" />
        <h2 className="text-gray-900">Exam Submitted!</h2>
        <p className="text-gray-600 text-center max-w-xs">Your answers have been submitted. Results will be available once the teacher grades the exam.</p>
        <button onClick={handleBackToList} className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700">
          Back to Exams
        </button>
      </div>
    );
  }

  // ENTRY FLOW (batch code → pin → ready)
  if (entryStep !== 'list' && selectedExam) {
    return (
      <div className="space-y-5 max-w-md mx-auto">
        {/* Exam Info Card */}
        <div className={`bg-white rounded-xl border-2 p-5 ${selectedExam.status === 'active' ? 'border-green-300' : 'border-yellow-300'}`}>
          <div className="flex items-start gap-3 mb-3">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${selectedExam.status === 'active' ? 'bg-green-100' : 'bg-yellow-100'}`}>
              <FileText className={`w-6 h-6 ${selectedExam.status === 'active' ? 'text-green-600' : 'text-yellow-600'}`} />
            </div>
            <div className="flex-1">
              <h3 className="text-gray-900">{selectedExam.title}</h3>
              <p className="text-gray-600 text-sm">{selectedExam.batch}</p>
              <p className="text-gray-500 text-xs">{selectedExam.scheduledAt} · {selectedExam.duration} · {selectedExam.totalQuestions} questions</p>
            </div>
          </div>
        </div>

        {/* Step: Enter Batch Code */}
        {entryStep === 'enter-batch' && (
          <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs">1</div>
              <h3 className="text-gray-900">Enter Batch Code</h3>
            </div>
            <p className="text-gray-600 text-sm">Enter your batch code to verify you belong to this batch.</p>
            <input
              type="text"
              value={batchCodeInput}
              onChange={(e) => { setBatchCodeInput(e.target.value.toUpperCase()); setBatchError(''); }}
              placeholder="e.g., PHY-A-2026"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-center tracking-widest"
            />
            {batchError && <p className="text-red-600 text-sm">{batchError}</p>}
            <div className="flex gap-3">
              <button onClick={handleBackToList} className="flex items-center gap-1 px-4 py-2.5 border border-gray-300 rounded-xl hover:bg-gray-50 text-sm">
                <ChevronLeft className="w-4 h-4" /> Back
              </button>
              <button onClick={handleBatchCodeSubmit} className="flex-1 bg-indigo-600 text-white py-2.5 rounded-xl hover:bg-indigo-700 text-sm">
                Continue
              </button>
            </div>
          </div>
        )}

        {/* Step: Enter Exam PIN */}
        {entryStep === 'enter-pin' && (
          <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs">2</div>
              <h3 className="text-gray-900">Enter Exam Key</h3>
            </div>
            <p className="text-gray-600 text-sm">Enter the exam key provided by your teacher to unlock the exam.</p>
            <div className="flex items-center gap-2 bg-indigo-50 border border-indigo-200 rounded-lg p-3">
              <Key className="w-4 h-4 text-indigo-600 shrink-0" />
              <p className="text-indigo-800 text-sm">Get this key from your teacher before starting.</p>
            </div>
            <input
              type="text"
              value={pinInput}
              onChange={(e) => { setPinInput(e.target.value.toUpperCase()); setPinError(''); }}
              placeholder="e.g., PHYS-A4K9"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-center tracking-widest"
            />
            {pinError && <p className="text-red-600 text-sm">{pinError}</p>}
            <div className="flex gap-3">
              <button onClick={() => { setEntryStep('enter-batch'); setPinInput(''); setPinError(''); }} className="flex items-center gap-1 px-4 py-2.5 border border-gray-300 rounded-xl hover:bg-gray-50 text-sm">
                <ChevronLeft className="w-4 h-4" /> Back
              </button>
              <button onClick={handlePinSubmit} className="flex-1 bg-indigo-600 text-white py-2.5 rounded-xl hover:bg-indigo-700 text-sm">
                Verify
              </button>
            </div>
          </div>
        )}

        {/* Step: Ready to Start */}
        {entryStep === 'ready' && (
          <div className="bg-white rounded-xl border border-green-200 bg-green-50 p-5 space-y-4">
            <div className="text-center">
              <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-2" />
              <h3 className="text-gray-900 mb-1">All Set!</h3>
              <p className="text-gray-600 text-sm">You're verified and ready to start <strong>{selectedExam.title}</strong>.</p>
            </div>
            <div className="bg-white rounded-lg p-4 border border-green-200 text-sm space-y-1">
              <p className="text-gray-700">Duration: <strong>{selectedExam.duration}</strong></p>
              <p className="text-gray-700">Questions: <strong>{selectedExam.totalQuestions}</strong></p>
              <p className="text-red-600 text-xs mt-2">⚠️ Once started, do not close or switch tabs. The exam will auto-submit when time runs out.</p>
            </div>
            <button onClick={handleStartExam} className="w-full bg-green-600 text-white py-3 rounded-xl hover:bg-green-700">
              Start Exam
            </button>
            <button onClick={handleBackToList} className="w-full border border-gray-300 text-gray-700 py-2.5 rounded-xl hover:bg-gray-50 text-sm">
              Back
            </button>
          </div>
        )}
      </div>
    );
  }

  // EXAM LIST
  return (
    <div className="space-y-5">
      <h2 className="text-gray-900">My Exams</h2>

      {/* Active Exams */}
      {exams.filter(e => e.status === 'active').length > 0 && (
        <div>
          <h3 className="text-gray-700 mb-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
            Active Now
          </h3>
          <div className="space-y-3">
            {exams.filter(e => e.status === 'active').map((exam) => (
              <div key={exam.id} className="bg-white rounded-xl border-2 border-green-300 p-4 sm:p-5">
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center shrink-0">
                    <FileText className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-gray-900">{exam.title}</h4>
                      <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs">Active</span>
                    </div>
                    <p className="text-gray-600 text-sm">{exam.batch}</p>
                    <div className="flex flex-wrap items-center gap-x-2 text-xs text-gray-500 mt-1">
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{exam.duration}</span>
                      <span>·</span>
                      <span>{exam.totalQuestions} questions</span>
                      <span>·</span>
                      <span>{exam.scheduledAt}</span>
                    </div>
                  </div>
                </div>
                <button onClick={() => handleSelectExam(exam)} className="w-full bg-green-600 text-white py-2.5 rounded-xl hover:bg-green-700">
                  Enter Exam
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upcoming Exams */}
      {exams.filter(e => e.status === 'upcoming').length > 0 && (
        <div>
          <h3 className="text-gray-700 mb-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-yellow-500 inline-block" />
            Upcoming
          </h3>
          <div className="space-y-3">
            {exams.filter(e => e.status === 'upcoming').map((exam) => (
              <div key={exam.id} className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center shrink-0">
                    <AlertCircle className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-gray-900">{exam.title}</h4>
                      <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded-full text-xs">Upcoming</span>
                    </div>
                    <p className="text-gray-600 text-sm">{exam.batch}</p>
                    <div className="flex flex-wrap items-center gap-x-2 text-xs text-gray-500 mt-1">
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{exam.duration}</span>
                      <span>·</span>
                      <span>{exam.totalQuestions} questions</span>
                      <span>·</span>
                      <span>{exam.scheduledAt}</span>
                    </div>
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-600">
                  <Lock className="w-3.5 h-3.5" />
                  Exam not started yet. Come back at the scheduled time.
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Completed Exams */}
      {exams.filter(e => e.status === 'completed').length > 0 && (
        <div>
          <h3 className="text-gray-700 mb-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-gray-400 inline-block" />
            Completed
          </h3>
          <div className="space-y-3">
            {exams.filter(e => e.status === 'completed').map((exam) => (
              <div key={exam.id} className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center shrink-0">
                    <CheckCircle className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <h4 className="text-gray-900">{exam.title}</h4>
                      {exam.score !== undefined && (
                        <span className={`px-3 py-1 rounded-full text-sm ${(exam.score! / exam.totalScore!) >= 0.7 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {exam.score}/{exam.totalScore} ({Math.round(exam.score! / exam.totalScore! * 100)}%)
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600 text-sm">{exam.batch}</p>
                    <p className="text-gray-500 text-xs">{exam.scheduledAt}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
