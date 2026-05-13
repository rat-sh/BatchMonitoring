import { useState } from 'react';
import { Plus, Trash2, Save, Download, Upload, Key, X, Copy, ClipboardList, Clock } from 'lucide-react';

interface Question {
  id: string;
  type: 'mcq' | 'theoretical' | 'truefalse' | 'numerical';
  question: string;
  options?: string[];
  correctAnswer?: number | boolean | string;
  points: number;
  difficulty?: 'easy' | 'medium' | 'hard';
  chapter?: string;
}

interface Exam {
  id: string;
  title: string;
  batch: string;
  batchCode: string;
  duration: string;
  startTime: string;
  questions: Question[];
  totalMarks: number;
  negativeMarking?: number;
  examKey?: string;
  status: 'draft' | 'active' | 'completed';
}

function generateExamKey(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let key = '';
  for (let i = 0; i < 8; i++) {
    if (i === 4) key += '-';
    key += chars[Math.floor(Math.random() * chars.length)];
  }
  return key;
}

export function QuestionCreator() {
  const [exams, setExams] = useState<Exam[]>([
    {
      id: 'sample1',
      title: 'Midterm Physics Test',
      batch: 'Batch A - Physics',
      batchCode: 'PHY-A-2026',
      duration: '60 minutes',
      startTime: '2026-05-13T10:00',
      questions: [],
      totalMarks: 0,
      examKey: 'PHYS-A4K9',
      status: 'active',
    },
  ]);
  const [currentExam, setCurrentExam] = useState<Exam | null>(null);
  const [showExamForm, setShowExamForm] = useState(false);
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [generatedKey, setGeneratedKey] = useState('');
  const [examDetails, setExamDetails] = useState({
    title: '', batch: '', batchCode: '', duration: '', startTime: '', negativeMarking: 0,
  });
  const [currentQuestion, setCurrentQuestion] = useState<Partial<Question>>({
    type: 'mcq', question: '', options: ['', '', '', ''], correctAnswer: 0, points: 1, difficulty: 'medium', chapter: '',
  });
  const [showUploadBank, setShowUploadBank] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCreateExam = () => {
    if (examDetails.title && examDetails.batch && examDetails.duration) {
      const newExam: Exam = {
        id: Date.now().toString(),
        ...examDetails,
        questions: [],
        totalMarks: 0,
        status: 'draft',
      };
      setCurrentExam(newExam);
      setShowExamForm(false);
      setExamDetails({ title: '', batch: '', batchCode: '', duration: '', startTime: '', negativeMarking: 0 });
    }
  };

  const handleAddQuestion = () => {
    if (!currentExam || !currentQuestion.question || !currentQuestion.type) return;
    const question: Question = {
      id: Date.now().toString(),
      type: currentQuestion.type,
      question: currentQuestion.question,
      options: currentQuestion.type === 'mcq' ? currentQuestion.options : undefined,
      correctAnswer: currentQuestion.correctAnswer,
      points: currentQuestion.points || 1,
      difficulty: currentQuestion.difficulty,
      chapter: currentQuestion.chapter,
    };
    setCurrentExam({
      ...currentExam,
      questions: [...currentExam.questions, question],
      totalMarks: currentExam.totalMarks + (currentQuestion.points || 1),
    });
    setCurrentQuestion({ type: 'mcq', question: '', options: ['', '', '', ''], correctAnswer: 0, points: 1, difficulty: 'medium', chapter: '' });
  };

  const handleSaveAndGetKey = () => {
    if (!currentExam) return;
    const key = generateExamKey();
    setGeneratedKey(key);
    const savedExam: Exam = { ...currentExam, examKey: key, status: 'active' };
    setExams(prev => [...prev, savedExam]);
    setCurrentExam(null);
    setShowKeyModal(true);
  };

  const handleCancelExam = () => {
    if (confirm('Cancel this exam? All unsaved questions will be lost.')) {
      setCurrentExam(null);
    }
  };

  const handleDeleteQuestion = (questionId: string) => {
    if (!currentExam) return;
    const deleted = currentExam.questions.find(q => q.id === questionId);
    setCurrentExam({
      ...currentExam,
      questions: currentExam.questions.filter(q => q.id !== questionId),
      totalMarks: currentExam.totalMarks - (deleted?.points || 0),
    });
  };

  const copyToClipboard = (key: string) => {
    navigator.clipboard.writeText(key);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const activeExams = exams.filter(e => e.status === 'active');

  return (
    <div className="space-y-5 pb-32">
      <div className="flex items-center justify-between">
        <h2 className="text-gray-900">Create Questions & Exams</h2>
        <div className="flex gap-2">
          <button onClick={() => setShowUploadBank(true)} className="flex items-center gap-2 px-3 py-2 border border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50 text-sm">
            <Upload className="w-4 h-4" />
            <span className="hidden sm:inline">Upload Bank</span>
          </button>
          {!currentExam && (
            <button onClick={() => setShowExamForm(true)} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm">
              <Plus className="w-4 h-4" />
              New Exam
            </button>
          )}
        </div>
      </div>

      {/* Running Exams with Keys */}
      {activeExams.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-4 sm:px-5 py-4 border-b border-gray-200 flex items-center gap-2">
            <ClipboardList className="w-5 h-5 text-indigo-600" />
            <h3 className="text-gray-900">Active Exams & Keys</h3>
            <span className="ml-auto text-xs text-gray-500">Share keys with students</span>
          </div>
          <div className="divide-y divide-gray-100">
            {activeExams.map(exam => (
              <div key={exam.id} className="px-4 sm:px-5 py-4">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-900">{exam.title}</p>
                    <div className="flex flex-wrap items-center gap-x-2 text-xs text-gray-500 mt-0.5">
                      <span>{exam.batch}</span>
                      {exam.startTime && (
                        <>
                          <span>·</span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {new Date(exam.startTime).toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' })}
                          </span>
                        </>
                      )}
                      <span>·</span>
                      <span>{exam.duration}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2 bg-indigo-50 border border-indigo-200 rounded-lg px-3 py-2">
                      <Key className="w-4 h-4 text-indigo-600" />
                      <span className="font-mono text-indigo-900">{exam.examKey}</span>
                    </div>
                    <button
                      onClick={() => copyToClipboard(exam.examKey!)}
                      className={`p-2 rounded-lg border transition-colors ${copiedKey === exam.examKey ? 'border-green-400 bg-green-50' : 'border-gray-300 hover:bg-gray-50'}`}
                      title="Copy exam key"
                    >
                      <Copy className={`w-4 h-4 ${copiedKey === exam.examKey ? 'text-green-600' : 'text-gray-600'}`} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Exam Form Modal */}
      {showExamForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-900">Create New Exam</h3>
              <button onClick={() => setShowExamForm(false)}><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-1 text-sm">Exam Title</label>
                <input type="text" value={examDetails.title} onChange={(e) => setExamDetails({ ...examDetails, title: e.target.value })} placeholder="e.g., Midterm Physics" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-700 mb-1 text-sm">Batch</label>
                  <input type="text" value={examDetails.batch} onChange={(e) => setExamDetails({ ...examDetails, batch: e.target.value })} placeholder="e.g., Batch A" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm" />
                </div>
                <div>
                  <label className="block text-gray-700 mb-1 text-sm">Batch Code</label>
                  <input type="text" value={examDetails.batchCode} onChange={(e) => setExamDetails({ ...examDetails, batchCode: e.target.value.toUpperCase() })} placeholder="PHY-A-2026" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-mono" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-700 mb-1 text-sm">Duration</label>
                  <input type="text" value={examDetails.duration} onChange={(e) => setExamDetails({ ...examDetails, duration: e.target.value })} placeholder="e.g., 60 minutes" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm" />
                </div>
                <div>
                  <label className="block text-gray-700 mb-1 text-sm">Start Time</label>
                  <input type="datetime-local" value={examDetails.startTime} onChange={(e) => setExamDetails({ ...examDetails, startTime: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm" />
                </div>
              </div>
              <div>
                <label className="block text-gray-700 mb-1 text-sm">Negative Marking</label>
                <input type="number" step="0.25" value={examDetails.negativeMarking} onChange={(e) => setExamDetails({ ...examDetails, negativeMarking: Number(e.target.value) })} placeholder="e.g., 0.25" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm" />
              </div>
              <div className="flex gap-2">
                <button onClick={handleCreateExam} className="flex-1 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 text-sm">Create</button>
                <button onClick={() => setShowExamForm(false)} className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 text-sm">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Current Exam Being Created */}
      {currentExam && (
        <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6">
            <div className="flex-1">
              <h3 className="text-gray-900">{currentExam.title}</h3>
              <p className="text-gray-600 text-sm">
                {currentExam.batch} · {currentExam.duration} · {currentExam.questions.length} questions · {currentExam.totalMarks} marks
                {currentExam.negativeMarking ? ` · Negative: -${currentExam.negativeMarking}` : ''}
              </p>
            </div>
          </div>

          {/* Question Creator */}
          <div className="border-t border-gray-200 pt-5 space-y-4">
            <h4 className="text-gray-900">Add Question</h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-gray-700 mb-1 text-xs">Type</label>
                <select value={currentQuestion.type} onChange={(e) => setCurrentQuestion({ ...currentQuestion, type: e.target.value as any, correctAnswer: e.target.value === 'truefalse' ? true : e.target.value === 'mcq' ? 0 : '' })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm">
                  <option value="mcq">MCQ</option>
                  <option value="truefalse">True/False</option>
                  <option value="numerical">Numerical</option>
                  <option value="theoretical">Theoretical</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-700 mb-1 text-xs">Points</label>
                <input type="number" value={currentQuestion.points} onChange={(e) => setCurrentQuestion({ ...currentQuestion, points: Number(e.target.value) })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm" />
              </div>
              <div>
                <label className="block text-gray-700 mb-1 text-xs">Difficulty</label>
                <select value={currentQuestion.difficulty} onChange={(e) => setCurrentQuestion({ ...currentQuestion, difficulty: e.target.value as any })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm">
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-700 mb-1 text-xs">Chapter</label>
                <input type="text" value={currentQuestion.chapter} onChange={(e) => setCurrentQuestion({ ...currentQuestion, chapter: e.target.value })} placeholder="Ch 5" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm" />
              </div>
            </div>

            <div>
              <label className="block text-gray-700 mb-1 text-sm">Question</label>
              <textarea value={currentQuestion.question} onChange={(e) => setCurrentQuestion({ ...currentQuestion, question: e.target.value })} placeholder="Enter your question here..." rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm" />
            </div>

            {currentQuestion.type === 'mcq' && (
              <div className="space-y-2">
                <label className="block text-gray-700 text-sm">Options</label>
                {currentQuestion.options?.map((option, index) => (
                  <div key={index} className="flex gap-2">
                    <input type="radio" name="correctAnswer" checked={currentQuestion.correctAnswer === index} onChange={() => setCurrentQuestion({ ...currentQuestion, correctAnswer: index })} className="mt-2.5" />
                    <input type="text" value={option} onChange={(e) => { const opts = [...(currentQuestion.options || [])]; opts[index] = e.target.value; setCurrentQuestion({ ...currentQuestion, options: opts }); }} placeholder={`Option ${index + 1}`} className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm" />
                  </div>
                ))}
              </div>
            )}

            {currentQuestion.type === 'truefalse' && (
              <div className="space-y-2">
                <label className="block text-gray-700 text-sm">Correct Answer</label>
                <div className="flex gap-4">
                  {[true, false].map(val => (
                    <label key={String(val)} className="flex items-center gap-2">
                      <input type="radio" checked={currentQuestion.correctAnswer === val} onChange={() => setCurrentQuestion({ ...currentQuestion, correctAnswer: val })} className="w-4 h-4" />
                      <span className="text-sm">{val ? 'True' : 'False'}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {currentQuestion.type === 'numerical' && (
              <div>
                <label className="block text-gray-700 mb-1 text-sm">Correct Answer (Number)</label>
                <input type="text" value={currentQuestion.correctAnswer as string} onChange={(e) => setCurrentQuestion({ ...currentQuestion, correctAnswer: e.target.value })} placeholder="e.g., 42 or 3.14" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm" />
              </div>
            )}

            <button onClick={handleAddQuestion} className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 text-sm">
              Add Question
            </button>
          </div>

          {/* Questions List */}
          {currentExam.questions.length > 0 && (
            <div className="border-t border-gray-200 pt-5 mt-5 space-y-3">
              <h4 className="text-gray-900">Questions ({currentExam.questions.length})</h4>
              {currentExam.questions.map((question, index) => (
                <div key={question.id} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex gap-2 flex-1">
                      <span className="text-gray-500 text-sm shrink-0">Q{index + 1}.</span>
                      <div className="flex-1">
                        <p className="text-gray-900 text-sm">{question.question}</p>
                        <div className="flex flex-wrap gap-2 mt-1.5">
                          <span className="text-xs text-gray-500">{question.type === 'mcq' ? 'MCQ' : question.type === 'truefalse' ? 'True/False' : question.type === 'numerical' ? 'Numerical' : 'Theoretical'}</span>
                          <span className="text-xs text-gray-500">· {question.points} pts</span>
                          {question.difficulty && (
                            <span className={`text-xs px-1.5 py-0.5 rounded ${question.difficulty === 'easy' ? 'bg-green-100 text-green-700' : question.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>{question.difficulty}</span>
                          )}
                          {question.chapter && <span className="text-xs text-gray-500">· {question.chapter}</span>}
                        </div>
                      </div>
                    </div>
                    <button onClick={() => handleDeleteQuestion(question.id)} className="text-red-500 hover:text-red-700 shrink-0">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  {question.type === 'mcq' && question.options && (
                    <div className="ml-6 mt-2 space-y-1">
                      {question.options.map((option, i) => (
                        <div key={i} className={`flex items-center gap-1 text-xs ${i === question.correctAnswer ? 'text-green-600' : 'text-gray-600'}`}>
                          <span>{i === question.correctAnswer ? '✓' : '○'}</span>
                          <span>{option}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  {question.type === 'truefalse' && <div className="ml-6 mt-1 text-xs text-green-600">Answer: {question.correctAnswer ? 'True' : 'False'}</div>}
                  {question.type === 'numerical' && <div className="ml-6 mt-1 text-xs text-green-600">Answer: {question.correctAnswer}</div>}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Saved (non-active) Exams */}
      {!currentExam && exams.filter(e => e.status !== 'active').length > 0 && (
        <div className="space-y-3">
          <h3 className="text-gray-900">Completed Exams</h3>
          {exams.filter(e => e.status !== 'active').map((exam) => (
            <div key={exam.id} className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-gray-900">{exam.title}</h4>
                  <p className="text-gray-600 text-sm">{exam.batch} · {exam.duration} · {exam.questions.length} questions · {exam.totalMarks} marks</p>
                </div>
                <button onClick={() => alert('Exporting...')} className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
                  <Download className="w-4 h-4" />
                  Export
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {!currentExam && exams.length === 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <p className="text-gray-500">No exams created yet. Click "New Exam" to get started.</p>
        </div>
      )}

      {/* Sticky Bottom Bar when creating exam */}
      {currentExam && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-gray-200 px-4 py-3 z-40 shadow-lg">
          <div className="max-w-7xl mx-auto flex items-center gap-3">
            <div className="flex-1">
              <p className="text-xs text-gray-500">{currentExam.title}</p>
              <p className="text-gray-700 text-sm">{currentExam.questions.length} questions · {currentExam.totalMarks} marks</p>
            </div>
            <button
              onClick={handleCancelExam}
              className="flex items-center gap-2 px-4 py-2.5 border-2 border-red-300 text-red-600 rounded-xl hover:bg-red-50 text-sm"
            >
              <X className="w-4 h-4" />
              Cancel
            </button>
            <button
              onClick={handleSaveAndGetKey}
              disabled={currentExam.questions.length === 0}
              className="flex items-center gap-2 px-5 py-2.5 bg-green-600 text-white rounded-xl hover:bg-green-700 disabled:opacity-50 text-sm"
            >
              <Key className="w-4 h-4" />
              Save & Get Key
            </button>
          </div>
        </div>
      )}

      {/* Exam Key Modal */}
      {showKeyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm text-center">
            <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Key className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-gray-900 mb-1">Exam Created!</h3>
            <p className="text-gray-600 text-sm mb-5">Share this key with students to let them enter the exam.</p>
            <div className="bg-indigo-50 border-2 border-indigo-300 rounded-xl p-5 mb-5">
              <p className="text-gray-500 text-xs mb-1">Exam Key</p>
              <p className="font-mono text-2xl text-indigo-900 tracking-widest">{generatedKey}</p>
            </div>
            <button
              onClick={() => copyToClipboard(generatedKey)}
              className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 mb-3 transition-colors ${copiedKey === generatedKey ? 'border-green-400 bg-green-50 text-green-700' : 'border-indigo-300 bg-indigo-50 text-indigo-700 hover:bg-indigo-100'}`}
            >
              <Copy className="w-4 h-4" />
              {copiedKey === generatedKey ? 'Copied!' : 'Copy Key'}
            </button>
            <button onClick={() => setShowKeyModal(false)} className="w-full bg-indigo-600 text-white py-2.5 rounded-xl hover:bg-indigo-700">
              Done
            </button>
          </div>
        </div>
      )}

      {/* Upload Question Bank Modal */}
      {showUploadBank && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
            <h3 className="text-gray-900 mb-4">Upload Question Bank</h3>
            <div className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-indigo-400 cursor-pointer">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-700 mb-1">Click to upload or drag and drop</p>
                <p className="text-gray-500 text-sm">CSV, Excel, or JSON format</p>
              </div>
              <div className="bg-blue-50 rounded-lg p-3 text-blue-800 text-sm">
                <p className="mb-1">Format your file with columns:</p>
                <p className="text-xs">Type, Question, Options (separated by |), Answer, Points, Difficulty, Chapter</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => { alert('Uploading...'); setShowUploadBank(false); }} className="flex-1 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 text-sm">Upload</button>
                <button onClick={() => setShowUploadBank(false)} className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 text-sm">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
