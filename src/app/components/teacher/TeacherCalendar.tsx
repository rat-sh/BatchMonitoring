import { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, X, Clock, BookOpen, FileText, Users } from 'lucide-react';

interface ClassSchedule {
  id: string;
  batch: string;
  subject: string;
  time: string;
  duration: string;
  date: Date;
  type: 'class' | 'exam';
}

const MOCK_SCHEDULES: ClassSchedule[] = [
  {
    id: '1',
    batch: 'Batch A - Physics',
    subject: 'Quantum Mechanics',
    time: '09:00 AM',
    duration: '2 hours',
    date: new Date(),
    type: 'class',
  },
  {
    id: '2',
    batch: 'Batch B - Mathematics',
    subject: 'Calculus',
    time: '02:00 PM',
    duration: '1.5 hours',
    date: new Date(),
    type: 'class',
  },
  {
    id: '3',
    batch: 'Batch A - Physics',
    subject: 'Midterm Physics Exam',
    time: '10:00 AM',
    duration: '2 hours',
    date: new Date(new Date().setDate(new Date().getDate() + 2)),
    type: 'exam',
  },
  {
    id: '4',
    batch: 'Batch B - Mathematics',
    subject: 'Thermodynamics',
    time: '11:00 AM',
    duration: '2 hours',
    date: new Date(new Date().setDate(new Date().getDate() - 1)),
    type: 'class',
  },
];

export function TeacherCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [schedules, setSchedules] = useState<ClassSchedule[]>(MOCK_SCHEDULES);
  const [showModal, setShowModal] = useState(false);
  const [newSchedule, setNewSchedule] = useState({
    batch: '',
    subject: '',
    time: '',
    duration: '',
    date: '',
    type: 'class' as 'class' | 'exam',
  });

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const getSchedulesForDate = (day: number) => {
    return schedules.filter(schedule => {
      const d = schedule.date;
      return d.getDate() === day &&
        d.getMonth() === currentDate.getMonth() &&
        d.getFullYear() === currentDate.getFullYear();
    });
  };

  const today = new Date();
  const todaySchedules = schedules.filter(s => {
    const d = s.date;
    return d.getDate() === today.getDate() &&
      d.getMonth() === today.getMonth() &&
      d.getFullYear() === today.getFullYear();
  });

  const todayClasses = todaySchedules.filter(s => s.type === 'class');
  const todayExams = todaySchedules.filter(s => s.type === 'exam');
  const todayBatches = [...new Set(todaySchedules.map(s => s.batch))];

  const handleAddSchedule = () => {
    if (newSchedule.batch && newSchedule.subject && newSchedule.time && newSchedule.date) {
      const schedule: ClassSchedule = {
        id: Date.now().toString(),
        batch: newSchedule.batch,
        subject: newSchedule.subject,
        time: newSchedule.time,
        duration: newSchedule.duration || '1 hour',
        date: new Date(newSchedule.date + 'T00:00:00'),
        type: newSchedule.type,
      };
      setSchedules([...schedules, schedule]);
      setShowModal(false);
      setNewSchedule({ batch: '', subject: '', time: '', duration: '', date: '', type: 'class' });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-gray-900">Class Schedule</h2>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          <Plus className="w-4 h-4" />
          Add Schedule
        </button>
      </div>

      {/* Calendar */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-gray-900">{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</h3>
          <div className="flex gap-2">
            <button onClick={previousMonth} className="p-2 hover:bg-gray-100 rounded-lg">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button onClick={nextMonth} className="p-2 hover:bg-gray-100 rounded-lg">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-1 sm:gap-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-center text-gray-600 py-2 text-xs sm:text-sm">
              <span className="hidden sm:inline">{day}</span>
              <span className="sm:hidden">{day.charAt(0)}</span>
            </div>
          ))}

          {Array.from({ length: firstDayOfMonth }).map((_, index) => (
            <div key={`empty-${index}`} className="aspect-square" />
          ))}

          {Array.from({ length: daysInMonth }).map((_, index) => {
            const day = index + 1;
            const daySchedules = getSchedulesForDate(day);
            const isToday = today.getDate() === day &&
              today.getMonth() === currentDate.getMonth() &&
              today.getFullYear() === currentDate.getFullYear();

            return (
              <div
                key={day}
                className={`aspect-square border rounded-lg p-1 sm:p-2 ${isToday ? 'bg-indigo-50 border-indigo-300' : 'bg-white border-gray-200'}`}
              >
                <div className={`text-center mb-1 text-xs sm:text-sm ${isToday ? 'text-indigo-600' : 'text-gray-900'}`}>
                  {day}
                </div>
                {daySchedules.length > 0 && (
                  <div className="space-y-0.5">
                    {daySchedules.slice(0, 2).map(schedule => (
                      <div
                        key={schedule.id}
                        className={`text-xs px-1 py-0.5 rounded truncate hidden sm:block ${schedule.type === 'exam' ? 'bg-red-100 text-red-700' : 'bg-indigo-100 text-indigo-700'}`}
                        title={`${schedule.batch} - ${schedule.time}`}
                      >
                        {schedule.subject.length > 8 ? schedule.subject.substring(0, 8) + '...' : schedule.subject}
                      </div>
                    ))}
                    <div className={`w-1.5 h-1.5 rounded-full mx-auto sm:hidden ${daySchedules.some(s => s.type === 'exam') ? 'bg-red-500' : 'bg-indigo-500'}`} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Today's Quick Reminder */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-4 sm:px-6 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center gap-2">
          <Clock className="w-5 h-5 text-white" />
          <h3 className="text-white">Today's Quick Reminder</h3>
          <span className="ml-auto text-indigo-200 text-sm">
            {today.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
          </span>
        </div>

        {todaySchedules.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            <Clock className="w-10 h-10 text-gray-300 mx-auto mb-2" />
            <p>No classes or exams scheduled for today</p>
          </div>
        ) : (
          <div className="p-4 sm:p-6 space-y-4">
            {/* Today's Batches */}
            {todayBatches.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Users className="w-4 h-4 text-indigo-600" />
                  <p className="text-gray-700">Active Batches Today</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {todayBatches.map((batch, i) => (
                    <span key={i} className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm">
                      {batch}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Today's Classes */}
            {todayClasses.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <BookOpen className="w-4 h-4 text-green-600" />
                  <p className="text-gray-700">Classes Today</p>
                </div>
                <div className="space-y-2">
                  {todayClasses.map(cls => (
                    <div key={cls.id} className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center shrink-0">
                        <Clock className="w-5 h-5 text-green-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-gray-900 truncate">{cls.subject}</p>
                        <p className="text-gray-600 text-sm truncate">{cls.batch}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-green-700 text-sm">{cls.time}</p>
                        <p className="text-gray-500 text-xs">{cls.duration}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Today's Exams */}
            {todayExams.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <FileText className="w-4 h-4 text-red-600" />
                  <p className="text-gray-700">Exams Today</p>
                </div>
                <div className="space-y-2">
                  {todayExams.map(exam => (
                    <div key={exam.id} className="flex items-center gap-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                      <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center shrink-0">
                        <FileText className="w-5 h-5 text-red-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-gray-900 truncate">{exam.subject}</p>
                        <p className="text-gray-600 text-sm truncate">{exam.batch}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-red-700 text-sm">{exam.time}</p>
                        <p className="text-gray-500 text-xs">{exam.duration}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Add Schedule Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-900">Add Schedule</h3>
              <button onClick={() => setShowModal(false)} className="p-1 hover:bg-gray-100 rounded">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-1">Type</label>
                <div className="flex gap-2">
                  {(['class', 'exam'] as const).map(t => (
                    <button
                      key={t}
                      onClick={() => setNewSchedule({ ...newSchedule, type: t })}
                      className={`flex-1 py-2 rounded-lg border-2 capitalize ${newSchedule.type === t ? 'border-indigo-600 text-indigo-600 bg-indigo-50' : 'border-gray-200 text-gray-600'}`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-gray-700 mb-1">Batch Name</label>
                <input
                  type="text"
                  value={newSchedule.batch}
                  onChange={(e) => setNewSchedule({ ...newSchedule, batch: e.target.value })}
                  placeholder="e.g., Batch A - Physics"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-1">Subject / Title</label>
                <input
                  type="text"
                  value={newSchedule.subject}
                  onChange={(e) => setNewSchedule({ ...newSchedule, subject: e.target.value })}
                  placeholder="e.g., Quantum Mechanics"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 mb-1">Time</label>
                  <input
                    type="time"
                    value={newSchedule.time}
                    onChange={(e) => setNewSchedule({ ...newSchedule, time: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-1">Duration</label>
                  <input
                    type="text"
                    value={newSchedule.duration}
                    onChange={(e) => setNewSchedule({ ...newSchedule, duration: e.target.value })}
                    placeholder="e.g., 2 hours"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-gray-700 mb-1">Date</label>
                <input
                  type="date"
                  value={newSchedule.date}
                  onChange={(e) => setNewSchedule({ ...newSchedule, date: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <button
                onClick={handleAddSchedule}
                className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700"
              >
                Add Schedule
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
