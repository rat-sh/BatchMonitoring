import { useState } from 'react';
import { Plus, Upload, Download, Clock, CheckCircle, AlertCircle } from 'lucide-react';

interface Assignment {
  id: string;
  title: string;
  description: string;
  batch: string;
  deadline: string;
  maxMarks: number;
  attachments?: string[];
  submissions: number;
  totalStudents: number;
}

interface Submission {
  id: string;
  studentName: string;
  assignmentId: string;
  submittedAt: string;
  isLate: boolean;
  file: string;
  feedback?: string;
  marks?: number;
}

const MOCK_ASSIGNMENTS: Assignment[] = [
  {
    id: '1',
    title: 'Quantum Mechanics Problem Set 1',
    description: 'Solve problems 1-10 from Chapter 3',
    batch: 'Batch A',
    deadline: '2025-12-15',
    maxMarks: 50,
    submissions: 18,
    totalStudents: 25,
  },
  {
    id: '2',
    title: 'Thermodynamics Lab Report',
    description: 'Write a detailed report on the heat engine experiment',
    batch: 'Batch A',
    deadline: '2025-12-20',
    maxMarks: 100,
    submissions: 12,
    totalStudents: 25,
  },
];

const MOCK_SUBMISSIONS: Submission[] = [
  {
    id: '1',
    studentName: 'John Doe',
    assignmentId: '1',
    submittedAt: '2025-12-10 10:30 AM',
    isLate: false,
    file: 'john_assignment1.pdf',
  },
  {
    id: '2',
    studentName: 'Jane Smith',
    assignmentId: '1',
    submittedAt: '2025-12-16 02:15 PM',
    isLate: true,
    file: 'jane_assignment1.pdf',
  },
];

export function Assignments() {
  const [assignments, setAssignments] = useState<Assignment[]>(MOCK_ASSIGNMENTS);
  const [submissions, setSubmissions] = useState<Submission[]>(MOCK_SUBMISSIONS);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [showSubmissions, setShowSubmissions] = useState(false);
  const [newAssignment, setNewAssignment] = useState({
    title: '',
    description: '',
    batch: '',
    deadline: '',
    maxMarks: 100,
  });
  const [feedback, setFeedback] = useState<Record<string, { marks: number; feedback: string }>>({});

  const handleCreateAssignment = () => {
    if (newAssignment.title && newAssignment.batch && newAssignment.deadline) {
      const assignment: Assignment = {
        id: Date.now().toString(),
        ...newAssignment,
        submissions: 0,
        totalStudents: 25,
      };
      setAssignments([...assignments, assignment]);
      setShowCreateModal(false);
      setNewAssignment({ title: '', description: '', batch: '', deadline: '', maxMarks: 100 });
    }
  };

  const handleViewSubmissions = (assignment: Assignment) => {
    setSelectedAssignment(assignment);
    setShowSubmissions(true);
  };

  const handleSaveFeedback = (submissionId: string) => {
    const feedbackData = feedback[submissionId];
    if (feedbackData) {
      setSubmissions(submissions.map(sub =>
        sub.id === submissionId
          ? { ...sub, marks: feedbackData.marks, feedback: feedbackData.feedback }
          : sub
      ));
      alert('Feedback saved successfully!');
    }
  };

  const getDeadlineStatus = (deadline: string) => {
    const now = new Date();
    const deadlineDate = new Date(deadline);
    const diff = deadlineDate.getTime() - now.getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    
    if (days < 0) return { text: 'Overdue', color: 'text-red-600' };
    if (days === 0) return { text: 'Due today', color: 'text-orange-600' };
    if (days <= 3) return { text: `${days} days left`, color: 'text-yellow-600' };
    return { text: `${days} days left`, color: 'text-green-600' };
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-gray-900">Assignments</h2>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          <Plus className="w-4 h-4" />
          Create Assignment
        </button>
      </div>

      {/* Assignments List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {assignments.map((assignment) => {
          const deadlineStatus = getDeadlineStatus(assignment.deadline);
          const submissionRate = (assignment.submissions / assignment.totalStudents * 100).toFixed(0);

          return (
            <div key={assignment.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-gray-900 mb-2">{assignment.title}</h3>
                  <p className="text-gray-600 mb-3">{assignment.description}</p>
                  <div className="space-y-1 text-sm">
                    <p className="text-gray-600">Batch: {assignment.batch}</p>
                    <p className={deadlineStatus.color}>
                      <Clock className="w-4 h-4 inline mr-1" />
                      {deadlineStatus.text} ({assignment.deadline})
                    </p>
                    <p className="text-gray-600">Max Marks: {assignment.maxMarks}</p>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-600">Submissions</span>
                  <span className="text-gray-900">
                    {assignment.submissions}/{assignment.totalStudents} ({submissionRate}%)
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-indigo-600 h-2 rounded-full"
                    style={{ width: `${submissionRate}%` }}
                  />
                </div>
              </div>

              <button
                onClick={() => handleViewSubmissions(assignment)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                View Submissions
              </button>
            </div>
          );
        })}
      </div>

      {assignments.length === 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <p className="text-gray-500">No assignments created yet.</p>
        </div>
      )}

      {/* Create Assignment Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
            <h3 className="text-gray-900 mb-4">Create New Assignment</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-1">Assignment Title</label>
                <input
                  type="text"
                  value={newAssignment.title}
                  onChange={(e) => setNewAssignment({ ...newAssignment, title: e.target.value })}
                  placeholder="e.g., Problem Set 1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-1">Description</label>
                <textarea
                  value={newAssignment.description}
                  onChange={(e) => setNewAssignment({ ...newAssignment, description: e.target.value })}
                  placeholder="Describe the assignment..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 mb-1">Batch</label>
                  <input
                    type="text"
                    value={newAssignment.batch}
                    onChange={(e) => setNewAssignment({ ...newAssignment, batch: e.target.value })}
                    placeholder="e.g., Batch A"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-1">Max Marks</label>
                  <input
                    type="number"
                    value={newAssignment.maxMarks}
                    onChange={(e) => setNewAssignment({ ...newAssignment, maxMarks: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-gray-700 mb-1">Deadline</label>
                <input
                  type="date"
                  value={newAssignment.deadline}
                  onChange={(e) => setNewAssignment({ ...newAssignment, deadline: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-1">Attach Files (Optional)</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-indigo-400 cursor-pointer">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600">Upload assignment materials</p>
                  <p className="text-gray-500">PDF, JPEG, PNG</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleCreateAssignment}
                  className="flex-1 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700"
                >
                  Create
                </button>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Submissions Modal */}
      {showSubmissions && selectedAssignment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-4xl my-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-gray-900">{selectedAssignment.title}</h3>
                <p className="text-gray-600">Submissions</p>
              </div>
              <button
                onClick={() => setShowSubmissions(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              {submissions
                .filter(sub => sub.assignmentId === selectedAssignment.id)
                .map((submission) => (
                  <div key={submission.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="text-gray-900">{submission.studentName}</h4>
                          {submission.isLate && (
                            <span className="px-2 py-0.5 bg-red-100 text-red-700 rounded text-sm">
                              Late Submission
                            </span>
                          )}
                          {submission.marks !== undefined && (
                            <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded text-sm">
                              Graded: {submission.marks}/{selectedAssignment.maxMarks}
                            </span>
                          )}
                        </div>
                        <p className="text-gray-600">Submitted: {submission.submittedAt}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <button className="flex items-center gap-1 px-3 py-1 border border-gray-300 rounded hover:bg-gray-50">
                            <Download className="w-4 h-4" />
                            {submission.file}
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <div>
                        <label className="block text-gray-700 mb-1">Marks</label>
                        <input
                          type="number"
                          max={selectedAssignment.maxMarks}
                          value={feedback[submission.id]?.marks ?? submission.marks ?? ''}
                          onChange={(e) => setFeedback({
                            ...feedback,
                            [submission.id]: {
                              ...feedback[submission.id],
                              marks: Number(e.target.value),
                              feedback: feedback[submission.id]?.feedback || '',
                            }
                          })}
                          placeholder={`Out of ${selectedAssignment.maxMarks}`}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-gray-700 mb-1">Feedback</label>
                        <textarea
                          value={feedback[submission.id]?.feedback ?? submission.feedback ?? ''}
                          onChange={(e) => setFeedback({
                            ...feedback,
                            [submission.id]: {
                              ...feedback[submission.id],
                              marks: feedback[submission.id]?.marks || 0,
                              feedback: e.target.value,
                            }
                          })}
                          placeholder="Provide feedback to the student..."
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                    </div>

                    <button
                      onClick={() => handleSaveFeedback(submission.id)}
                      className="mt-3 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                    >
                      Save Feedback
                    </button>
                  </div>
                ))}

              {submissions.filter(sub => sub.assignmentId === selectedAssignment.id).length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No submissions yet
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
