import { useState } from 'react';
import { Calendar, Check, X, MapPin, Clock } from 'lucide-react';

interface Class {
  id: string;
  subject: string;
  batch: string;
  date: string;
  time: string;
  location: string;
  status: 'upcoming' | 'ongoing' | 'completed';
  attended?: boolean;
}

const MOCK_CLASSES: Class[] = [
  {
    id: '1',
    subject: 'Quantum Mechanics',
    batch: 'Batch A',
    date: '2025-12-10',
    time: '09:00 AM',
    location: 'Room 101',
    status: 'ongoing',
  },
  {
    id: '2',
    subject: 'Calculus',
    batch: 'Batch B',
    date: '2025-12-10',
    time: '02:00 PM',
    location: 'Room 205',
    status: 'upcoming',
  },
  {
    id: '3',
    subject: 'Thermodynamics',
    batch: 'Batch A',
    date: '2025-12-09',
    time: '10:00 AM',
    location: 'Room 101',
    status: 'completed',
    attended: true,
  },
  {
    id: '4',
    subject: 'Organic Chemistry',
    batch: 'Batch A',
    date: '2025-12-08',
    time: '11:00 AM',
    location: 'Lab 3',
    status: 'completed',
    attended: true,
  },
  {
    id: '5',
    subject: 'Linear Algebra',
    batch: 'Batch B',
    date: '2025-12-07',
    time: '03:00 PM',
    location: 'Room 205',
    status: 'completed',
    attended: false,
  },
];

export function AttendanceMarker() {
  const [classes, setClasses] = useState<Class[]>(MOCK_CLASSES);
  const [showMarkModal, setShowMarkModal] = useState(false);
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);

  const markAttendance = (classItem: Class) => {
    setSelectedClass(classItem);
    setShowMarkModal(true);
  };

  const confirmAttendance = () => {
    if (selectedClass) {
      setClasses(classes.map(c =>
        c.id === selectedClass.id ? { ...c, attended: true, status: 'completed' } : c
      ));
      setShowMarkModal(false);
      setSelectedClass(null);
    }
  };

  const attendedClasses = classes.filter(c => c.status === 'completed' && c.attended).length;
  const totalClasses = classes.filter(c => c.status === 'completed').length;
  const attendanceRate = totalClasses > 0 ? (attendedClasses / totalClasses * 100) : 0;

  return (
    <div className="space-y-6">
      <h2 className="text-gray-900">Attendance</h2>

      {/* Attendance Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <p className="text-gray-600 mb-2">Total Classes</p>
          <p className="text-gray-900">{totalClasses}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <p className="text-gray-600 mb-2">Classes Attended</p>
          <p className="text-gray-900">{attendedClasses}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <p className="text-gray-600 mb-2">Attendance Rate</p>
          <div className="flex items-center gap-2">
            <p className="text-gray-900">{attendanceRate.toFixed(1)}%</p>
            <div className="flex-1 bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${
                  attendanceRate >= 75 ? 'bg-green-500' : attendanceRate >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{ width: `${attendanceRate}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Ongoing Classes */}
      {classes.filter(c => c.status === 'ongoing').length > 0 && (
        <div>
          <h3 className="text-gray-900 mb-4">Ongoing Classes</h3>
          <div className="space-y-4">
            {classes.filter(c => c.status === 'ongoing').map((classItem) => (
              <div key={classItem.id} className="bg-green-50 border-2 border-green-200 rounded-xl p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="text-gray-900">{classItem.subject}</h4>
                      <span className="px-2 py-0.5 bg-green-600 text-white rounded-full">Live</span>
                    </div>
                    <div className="space-y-1 text-gray-600">
                      <p>{classItem.batch}</p>
                      <p className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        {classItem.time}
                      </p>
                      <p className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        {classItem.location}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => markAttendance(classItem)}
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    Mark Present
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upcoming Classes */}
      {classes.filter(c => c.status === 'upcoming').length > 0 && (
        <div>
          <h3 className="text-gray-900 mb-4">Upcoming Classes</h3>
          <div className="space-y-4">
            {classes.filter(c => c.status === 'upcoming').map((classItem) => (
              <div key={classItem.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="text-gray-900 mb-2">{classItem.subject}</h4>
                    <div className="space-y-1 text-gray-600">
                      <p>{classItem.batch}</p>
                      <p className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {classItem.date} at {classItem.time}
                      </p>
                      <p className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        {classItem.location}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Attendance History */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-gray-900">Attendance History</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-gray-600">Subject</th>
                <th className="px-6 py-3 text-left text-gray-600">Batch</th>
                <th className="px-6 py-3 text-left text-gray-600">Date</th>
                <th className="px-6 py-3 text-left text-gray-600">Time</th>
                <th className="px-6 py-3 text-left text-gray-600">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {classes.filter(c => c.status === 'completed').map((classItem) => (
                <tr key={classItem.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-gray-900">{classItem.subject}</td>
                  <td className="px-6 py-4 text-gray-600">{classItem.batch}</td>
                  <td className="px-6 py-4 text-gray-600">{classItem.date}</td>
                  <td className="px-6 py-4 text-gray-600">{classItem.time}</td>
                  <td className="px-6 py-4">
                    {classItem.attended ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-green-100 text-green-800">
                        <Check className="w-4 h-4" />
                        Present
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-red-100 text-red-800">
                        <X className="w-4 h-4" />
                        Absent
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mark Attendance Modal */}
      {showMarkModal && selectedClass && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
            <h3 className="text-gray-900 mb-4">Mark Attendance</h3>
            <div className="space-y-4 mb-6">
              <p className="text-gray-700">
                Are you attending <span className="text-gray-900">{selectedClass.subject}</span>?
              </p>
              <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-gray-600">
                <p>Batch: {selectedClass.batch}</p>
                <p>Time: {selectedClass.time}</p>
                <p>Location: {selectedClass.location}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={confirmAttendance}
                className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
              >
                Confirm
              </button>
              <button
                onClick={() => setShowMarkModal(false)}
                className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
