import { useState } from 'react';
import { Upload, Clock, CheckCircle, AlertCircle, MessageSquare, AlertTriangle } from 'lucide-react';

interface Assignment {
  id: string;
  title: string;
  description: string;
  subject: string;
  deadline: string;
  maxMarks: number;
  status: 'pending' | 'submitted' | 'graded';
  submittedAt?: string;
  isLate?: boolean;
  marks?: number;
  feedback?: string;
}

const MOCK_ASSIGNMENTS: Assignment[] = [
  {
    id: '1',
    title: 'Quantum Mechanics Problem Set 1',
    description: 'Solve problems 1-10 from Chapter 3',
    subject: 'Physics',
    deadline: '2026-06-15',
    maxMarks: 50,
    status: 'graded',
    submittedAt: '2026-05-10 10:30 AM',
    isLate: false,
    marks: 45,
    feedback: 'Excellent work! Minor errors in problem 7.',
  },
  {
    id: '2',
    title: 'Thermodynamics Lab Report',
    description: 'Write a detailed report on the heat engine experiment',
    subject: 'Physics',
    deadline: '2026-05-20',
    maxMarks: 100,
    status: 'pending',
  },
  {
    id: '3',
    title: 'Calculus Assignment 3',
    description: 'Integration and differentiation problems',
    subject: 'Mathematics',
    deadline: '2026-05-18',
    maxMarks: 75,
    status: 'submitted',
    submittedAt: '2026-05-12 08:45 AM',
    isLate: false,
  },
];

export function StudentAssignments() {
  const [assignments] = useState<Assignment[]>(MOCK_ASSIGNMENTS);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [activeFilter, setActiveFilter] = useState<'all' | 'pending' | 'submitted' | 'graded'>('all');

  const handleSubmit = (assignment: Assignment) => {
    setSelectedAssignment(assignment);
    setShowSubmitModal(true);
  };

  const confirmSubmit = () => {
    alert('Assignment submitted successfully!');
    setShowSubmitModal(false);
    setSelectedAssignment(null);
  };

  const getDeadlineStatus = (deadline: string) => {
    const now = new Date();
    const deadlineDate = new Date(deadline);
    const diff = deadlineDate.getTime() - now.getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));

    if (days < 0) return { text: 'Overdue', color: 'text-red-600', bgColor: 'bg-red-50', borderColor: 'border-red-300' };
    if (days === 0) return { text: 'Due today', color: 'text-orange-600', bgColor: 'bg-orange-50', borderColor: 'border-orange-300' };
    if (days <= 3) return { text: `${days}d left`, color: 'text-yellow-600', bgColor: 'bg-yellow-50', borderColor: 'border-yellow-300' };
    return { text: `${days}d left`, color: 'text-green-600', bgColor: 'bg-green-50', borderColor: 'border-green-300' };
  };

  const pendingAssignments = assignments.filter(a => a.status === 'pending');
  const submittedAssignments = assignments.filter(a => a.status === 'submitted');
  const gradedAssignments = assignments.filter(a => a.status === 'graded');

  const filteredAssignments = activeFilter === 'all'
    ? assignments
    : assignments.filter(a => a.status === activeFilter);

  return (
    <div className="space-y-5">
      <h2 className="text-gray-900">My Assignments</h2>

      {/* Stats — 3 boxes in a row always */}
      <div className="grid grid-cols-3 gap-3">
        <button
          onClick={() => setActiveFilter(activeFilter === 'pending' ? 'all' : 'pending')}
          className={`rounded-xl border-2 p-3 sm:p-4 text-center transition-all ${activeFilter === 'pending' ? 'border-yellow-400 bg-yellow-50' : 'bg-white border-gray-200 hover:border-yellow-300'}`}
        >
          <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto mb-2">
            <AlertTriangle className="w-4 h-4 text-yellow-600" />
          </div>
          <p className="text-gray-900 text-lg sm:text-2xl">{pendingAssignments.length}</p>
          <p className="text-gray-600 text-xs sm:text-sm">Pending</p>
        </button>

        <button
          onClick={() => setActiveFilter(activeFilter === 'submitted' ? 'all' : 'submitted')}
          className={`rounded-xl border-2 p-3 sm:p-4 text-center transition-all ${activeFilter === 'submitted' ? 'border-blue-400 bg-blue-50' : 'bg-white border-gray-200 hover:border-blue-300'}`}
        >
          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2">
            <CheckCircle className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-gray-900 text-lg sm:text-2xl">{submittedAssignments.length}</p>
          <p className="text-gray-600 text-xs sm:text-sm">Submitted</p>
        </button>

        <button
          onClick={() => setActiveFilter(activeFilter === 'graded' ? 'all' : 'graded')}
          className={`rounded-xl border-2 p-3 sm:p-4 text-center transition-all ${activeFilter === 'graded' ? 'border-green-400 bg-green-50' : 'bg-white border-gray-200 hover:border-green-300'}`}
        >
          <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-2">
            <MessageSquare className="w-4 h-4 text-green-600" />
          </div>
          <p className="text-gray-900 text-lg sm:text-2xl">{gradedAssignments.length}</p>
          <p className="text-gray-600 text-xs sm:text-sm">Graded</p>
        </button>
      </div>

      {/* Assignment List */}
      <div className="space-y-4">
        {filteredAssignments.length === 0 && (
          <div className="bg-white rounded-xl border border-gray-200 p-10 text-center text-gray-500">
            No assignments in this category.
          </div>
        )}

        {filteredAssignments.map((assignment) => {
          if (assignment.status === 'pending') {
            const ds = getDeadlineStatus(assignment.deadline);
            return (
              <div key={assignment.id} className={`${ds.bgColor} border-2 ${ds.borderColor} rounded-xl p-4 sm:p-6`}>
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
                  <div className="flex-1">
                    <h4 className="text-gray-900 mb-1">{assignment.title}</h4>
                    <p className="text-gray-600 text-sm mb-2">{assignment.description}</p>
                    <div className="flex flex-wrap items-center gap-2 text-sm">
                      <span className="text-gray-600">{assignment.subject}</span>
                      <span className="text-gray-400">•</span>
                      <span className="text-gray-600">Max: {assignment.maxMarks} marks</span>
                      <span className="text-gray-400">•</span>
                      <span className={`flex items-center gap-1 ${ds.color}`}>
                        <Clock className="w-3.5 h-3.5" />
                        {ds.text}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleSubmit(assignment)}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm shrink-0"
                  >
                    Submit
                  </button>
                </div>
              </div>
            );
          }

          if (assignment.status === 'submitted') {
            return (
              <div key={assignment.id} className="bg-white rounded-xl border border-blue-200 p-4 sm:p-6">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
                  <div className="flex-1">
                    <h4 className="text-gray-900 mb-1">{assignment.title}</h4>
                    <p className="text-gray-600 text-sm mb-2">{assignment.description}</p>
                    <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600">
                      <span>{assignment.subject}</span>
                      <span>•</span>
                      <span>Submitted: {assignment.submittedAt}</span>
                      {assignment.isLate && (
                        <span className="px-2 py-0.5 bg-red-100 text-red-700 rounded text-xs">Late</span>
                      )}
                    </div>
                    <span className="inline-block mt-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                      Awaiting Grade
                    </span>
                  </div>
                </div>
              </div>
            );
          }

          // graded
          return (
            <div key={assignment.id} className="bg-white rounded-xl border border-green-200 p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3">
                <div className="flex-1">
                  <h4 className="text-gray-900 mb-1">{assignment.title}</h4>
                  <p className="text-gray-600 text-sm mb-2">{assignment.description}</p>
                  <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600 mb-2">
                    <span>{assignment.subject}</span>
                    <span>•</span>
                    <span>Submitted: {assignment.submittedAt}</span>
                  </div>
                </div>
                <div className={`px-4 py-2 rounded-lg shrink-0 text-center ${
                  (assignment.marks! / assignment.maxMarks) >= 0.8
                    ? 'bg-green-100 text-green-800'
                    : (assignment.marks! / assignment.maxMarks) >= 0.6
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  <p className="text-sm">Score</p>
                  <p>{assignment.marks}/{assignment.maxMarks}</p>
                  <p className="text-xs">({((assignment.marks! / assignment.maxMarks) * 100).toFixed(0)}%)</p>
                </div>
              </div>
              {assignment.feedback && (
                <div className="border-t border-gray-200 pt-3">
                  <div className="flex items-start gap-2">
                    <MessageSquare className="w-4 h-4 text-indigo-600 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-gray-700 text-sm mb-0.5">Teacher Feedback:</p>
                      <p className="text-gray-600 text-sm">{assignment.feedback}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Submit Modal */}
      {showSubmitModal && selectedAssignment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
            <h3 className="text-gray-900 mb-4">Submit Assignment</h3>
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-900 mb-1">{selectedAssignment.title}</p>
                <p className="text-gray-600 text-sm">{selectedAssignment.subject}</p>
                <p className="text-gray-600 text-sm">Max Marks: {selectedAssignment.maxMarks}</p>
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Upload Your Work</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-indigo-400 cursor-pointer">
                  <Upload className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-700">Click to upload or drag and drop</p>
                  <p className="text-gray-500 text-sm">PDF, JPEG, PNG (max 10MB)</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={confirmSubmit} className="flex-1 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700">
                  Submit
                </button>
                <button onClick={() => setShowSubmitModal(false)} className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300">
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
