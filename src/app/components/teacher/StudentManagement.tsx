import { useState } from 'react';
import { Users, Copy, Trash2, Plus, CheckCircle, XCircle, Bell, LogOut } from 'lucide-react';

interface Student {
  id: string;
  name: string;
  email: string;
  batch: string;
  joinedDate: string;
  attendance: number;
  assignments: number;
  testAverage: number;
  status: 'active' | 'inactive';
}

interface Batch {
  id: string;
  name: string;
  joinCode: string;
  students: number;
  created: string;
}

interface ActivityLog {
  id: string;
  message: string;
  type: 'removed' | 'left' | 'joined';
  time: string;
}

const MOCK_BATCHES: Batch[] = [
  { id: '1', name: 'Batch A - Physics', joinCode: 'PHY-A-2026', students: 25, created: '2026-01-01' },
  { id: '2', name: 'Batch B - Mathematics', joinCode: 'MATH-B-2026', students: 30, created: '2026-01-01' },
];

const MOCK_STUDENTS: Student[] = [
  { id: '1', name: 'Rahul Sharma', email: 'rahul@example.com', batch: 'Batch A - Physics', joinedDate: '2026-01-05', attendance: 92, assignments: 85, testAverage: 88, status: 'active' },
  { id: '2', name: 'Priya Singh', email: 'priya@example.com', batch: 'Batch A - Physics', joinedDate: '2026-01-05', attendance: 95, assignments: 92, testAverage: 94, status: 'active' },
  { id: '3', name: 'Amit Kumar', email: 'amit@example.com', batch: 'Batch B - Mathematics', joinedDate: '2026-01-06', attendance: 78, assignments: 70, testAverage: 75, status: 'active' },
];

export function StudentManagement() {
  const [batches, setBatches] = useState<Batch[]>(MOCK_BATCHES);
  const [students, setStudents] = useState<Student[]>(MOCK_STUDENTS);
  const [selectedBatch, setSelectedBatch] = useState<string>('all');
  const [showAddBatch, setShowAddBatch] = useState(false);
  const [showAddStudent, setShowAddStudent] = useState(false);
  const [newBatch, setNewBatch] = useState({ name: '' });
  const [newStudent, setNewStudent] = useState({ name: '', email: '', batch: '' });
  const [activityLog, setActivityLog] = useState<ActivityLog[]>([
    { id: '1', message: 'Sneha Patel left Batch A - Physics', type: 'left', time: '2 days ago' },
    { id: '2', message: 'New student Rahul Sharma joined Batch A via join code', type: 'joined', time: '5 days ago' },
  ]);
  const [showLog, setShowLog] = useState(false);

  const addLog = (message: string, type: ActivityLog['type']) => {
    const entry: ActivityLog = { id: Date.now().toString(), message, type, time: 'Just now' };
    setActivityLog(prev => [entry, ...prev]);
  };

  const copyJoinCode = (code: string) => {
    navigator.clipboard.writeText(code);
    alert(`Join code copied: ${code}`);
  };

  const generateJoinCode = (name: string) => {
    return name.substring(0, 3).toUpperCase() + '-' + Math.random().toString(36).substring(2, 6).toUpperCase() + '-2026';
  };

  const handleAddBatch = () => {
    if (newBatch.name) {
      const batch: Batch = {
        id: Date.now().toString(),
        name: newBatch.name,
        joinCode: generateJoinCode(newBatch.name),
        students: 0,
        created: new Date().toISOString().split('T')[0],
      };
      setBatches([...batches, batch]);
      setShowAddBatch(false);
      setNewBatch({ name: '' });
      addLog(`New batch "${batch.name}" created with code ${batch.joinCode}`, 'joined');
    }
  };

  const handleAddStudent = () => {
    if (newStudent.name && newStudent.email && newStudent.batch) {
      const student: Student = {
        id: Date.now().toString(),
        name: newStudent.name,
        email: newStudent.email,
        batch: newStudent.batch,
        joinedDate: new Date().toISOString().split('T')[0],
        attendance: 0,
        assignments: 0,
        testAverage: 0,
        status: 'active',
      };
      setStudents([...students, student]);
      setShowAddStudent(false);
      setNewStudent({ name: '', email: '', batch: '' });
      addLog(`${student.name} added to ${student.batch}`, 'joined');
    }
  };

  const removeStudent = (id: string) => {
    const student = students.find(s => s.id === id);
    if (!student) return;
    if (confirm(`Remove ${student.name} from ${student.batch}? They will be notified.`)) {
      setStudents(students.filter(s => s.id !== id));
      addLog(`${student.name} was removed from ${student.batch}. Student notified.`, 'removed');
      alert(`📢 ${student.name} has been removed from ${student.batch}. A notification has been sent to the student.`);
    }
  };

  const filteredStudents = selectedBatch === 'all' ? students : students.filter(s => s.batch === selectedBatch);

  const getProgressColor = (value: number) => {
    if (value >= 80) return 'text-green-600';
    if (value >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-gray-900">Student Management</h2>
        <div className="flex gap-2">
          <button onClick={() => setShowLog(!showLog)} className="relative p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <Bell className="w-5 h-5 text-gray-600" />
            {activityLog.filter(l => l.time === 'Just now').length > 0 && (
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full" />
            )}
          </button>
          <button onClick={() => setShowAddBatch(true)} className="px-3 py-2 border border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50 text-sm">
            Create Batch
          </button>
          <button onClick={() => setShowAddStudent(true)} className="flex items-center gap-2 px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm">
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Add Student</span>
          </button>
        </div>
      </div>

      {/* Activity Log */}
      {showLog && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-200 flex items-center gap-2">
            <Bell className="w-4 h-4 text-indigo-600" />
            <h3 className="text-gray-900">Activity Log</h3>
          </div>
          <div className="divide-y divide-gray-100 max-h-52 overflow-y-auto">
            {activityLog.map(entry => (
              <div key={entry.id} className="px-4 py-3 flex items-start gap-3">
                <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${entry.type === 'removed' ? 'bg-red-500' : entry.type === 'left' ? 'bg-yellow-500' : 'bg-green-500'}`} />
                <div className="flex-1">
                  <p className="text-gray-700 text-sm">{entry.message}</p>
                  <p className="text-gray-400 text-xs">{entry.time}</p>
                </div>
              </div>
            ))}
            {activityLog.length === 0 && <p className="px-4 py-3 text-gray-500 text-sm">No activity yet.</p>}
          </div>
        </div>
      )}

      {/* Batch Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {batches.map((batch) => (
          <div key={batch.id} className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center shrink-0">
                <Users className="w-5 h-5 text-indigo-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-gray-900 truncate">{batch.name}</p>
                <p className="text-gray-500 text-xs">{batch.students} students</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <code className="flex-1 px-3 py-2 bg-gray-100 rounded text-gray-900 text-sm font-mono truncate">
                {batch.joinCode}
              </code>
              <button onClick={() => copyJoinCode(batch.joinCode)} className="p-2 hover:bg-gray-100 rounded" title="Copy join code">
                <Copy className="w-4 h-4 text-gray-600" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <select value={selectedBatch} onChange={(e) => setSelectedBatch(e.target.value)} className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm">
          <option value="all">All Batches</option>
          {batches.map(batch => <option key={batch.id} value={batch.name}>{batch.name}</option>)}
        </select>
      </div>

      {/* Student List */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-gray-900">Students ({filteredStudents.length})</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-gray-600 text-sm">Name</th>
                <th className="px-4 py-3 text-left text-gray-600 text-sm hidden sm:table-cell">Batch</th>
                <th className="px-4 py-3 text-left text-gray-600 text-sm">Attend.</th>
                <th className="px-4 py-3 text-left text-gray-600 text-sm hidden md:table-cell">Assign.</th>
                <th className="px-4 py-3 text-left text-gray-600 text-sm hidden md:table-cell">Avg</th>
                <th className="px-4 py-3 text-left text-gray-600 text-sm">Status</th>
                <th className="px-4 py-3 text-left text-gray-600 text-sm">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredStudents.map((student) => (
                <tr key={student.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <p className="text-gray-900 text-sm">{student.name}</p>
                    <p className="text-gray-500 text-xs sm:hidden">{student.batch}</p>
                  </td>
                  <td className="px-4 py-3 text-gray-600 text-sm hidden sm:table-cell">{student.batch}</td>
                  <td className="px-4 py-3">
                    <span className={`text-sm ${getProgressColor(student.attendance)}`}>{student.attendance}%</span>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <span className={`text-sm ${getProgressColor(student.assignments)}`}>{student.assignments}%</span>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <span className={`text-sm ${getProgressColor(student.testAverage)}`}>{student.testAverage}%</span>
                  </td>
                  <td className="px-4 py-3">
                    {student.status === 'active' ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-600" />
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => removeStudent(student.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg" title="Remove student">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredStudents.length === 0 && (
            <p className="text-center text-gray-500 text-sm py-8">No students in this batch.</p>
          )}
        </div>
      </div>

      {/* Add Batch Modal */}
      {showAddBatch && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
            <h3 className="text-gray-900 mb-4">Create New Batch</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-1 text-sm">Batch Name</label>
                <input type="text" value={newBatch.name} onChange={(e) => setNewBatch({ name: e.target.value })} placeholder="e.g., Batch A - Physics" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm" />
              </div>
              <p className="text-gray-500 text-xs">A unique join code will be auto-generated for this batch.</p>
              <div className="flex gap-2">
                <button onClick={handleAddBatch} className="flex-1 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 text-sm">Create</button>
                <button onClick={() => setShowAddBatch(false)} className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 text-sm">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Student Modal */}
      {showAddStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
            <h3 className="text-gray-900 mb-4">Add New Student</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-1 text-sm">Student Name</label>
                <input type="text" value={newStudent.name} onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })} placeholder="e.g., Rahul Sharma" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm" />
              </div>
              <div>
                <label className="block text-gray-700 mb-1 text-sm">Email / Phone</label>
                <input type="text" value={newStudent.email} onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })} placeholder="e.g., rahul@example.com" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm" />
              </div>
              <div>
                <label className="block text-gray-700 mb-1 text-sm">Batch</label>
                <select value={newStudent.batch} onChange={(e) => setNewStudent({ ...newStudent, batch: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm">
                  <option value="">Select Batch</option>
                  {batches.map(batch => <option key={batch.id} value={batch.name}>{batch.name}</option>)}
                </select>
              </div>
              <div className="flex gap-2">
                <button onClick={handleAddStudent} className="flex-1 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 text-sm">Add Student</button>
                <button onClick={() => setShowAddStudent(false)} className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 text-sm">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
