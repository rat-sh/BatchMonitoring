import { useState } from 'react';
import { BookOpen, ClipboardCheck, FileText, CheckSquare, CreditCard, LogOut, Menu, X, Briefcase, Video, Users } from 'lucide-react';
import { ExamViewer } from './student/ExamViewer';
import { NotesViewer } from './student/NotesViewer';
import { AttendanceMarker } from './student/AttendanceMarker';
import { StudentTodo } from './student/StudentTodo';
import { StudentPayment } from './student/StudentPayment';
import { StudentAssignments } from './student/StudentAssignments';
import { StudentInterviewPractice } from './student/StudentInterviewPractice';
import { StudentRecordings } from './student/StudentRecordings';
import { TeacherSwitch } from './student/TeacherSwitch';

interface StudentDashboardProps {
  userName: string;
  onLogout: () => void;
}

type TabType = 'exams' | 'assignments' | 'notes' | 'recordings' | 'attendance' | 'teachers' | 'interview' | 'todo' | 'payment';

export function StudentDashboard({ userName, onLogout }: StudentDashboardProps) {
  const [activeTab, setActiveTab] = useState<TabType>('exams');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const tabs = [
    { id: 'exams' as TabType, label: 'Exams', icon: ClipboardCheck },
    { id: 'assignments' as TabType, label: 'Assignments', icon: BookOpen },
    { id: 'notes' as TabType, label: 'Notes', icon: FileText },
    { id: 'recordings' as TabType, label: 'Recordings', icon: Video },
    { id: 'attendance' as TabType, label: 'Attendance', icon: BookOpen },
    { id: 'teachers' as TabType, label: 'My Teachers', icon: Users },
    { id: 'interview' as TabType, label: 'Interview Prep', icon: Briefcase },
    { id: 'todo' as TabType, label: 'To-Do', icon: CheckSquare },
    { id: 'payment' as TabType, label: 'Payments', icon: CreditCard },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-gray-900">Student Dashboard</h1>
                <p className="text-gray-600 text-sm">Welcome, {userName}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden p-2 hover:bg-gray-100 rounded-lg">
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
              <button onClick={onLogout} className="hidden lg:flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className={`bg-white border-b border-gray-200 ${mobileMenuOpen ? 'block' : 'hidden'} lg:block overflow-x-auto`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:space-x-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => { setActiveTab(tab.id); setMobileMenuOpen(false); }}
                  className={`flex items-center gap-2 px-3 py-4 border-b-2 transition-colors whitespace-nowrap text-sm ${activeTab === tab.id ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'}`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
            <button onClick={onLogout} className="lg:hidden flex items-center gap-2 px-3 py-4 text-gray-600 hover:text-gray-900">
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'exams' && <ExamViewer />}
        {activeTab === 'assignments' && <StudentAssignments />}
        {activeTab === 'notes' && <NotesViewer />}
        {activeTab === 'recordings' && <StudentRecordings />}
        {activeTab === 'attendance' && <AttendanceMarker />}
        {activeTab === 'teachers' && <TeacherSwitch />}
        {activeTab === 'interview' && <StudentInterviewPractice />}
        {activeTab === 'todo' && <StudentTodo />}
        {activeTab === 'payment' && <StudentPayment />}
      </main>
    </div>
  );
}
