import { useState } from 'react';
import { TeacherDashboard } from './components/TeacherDashboard';
import { StudentDashboard } from './components/StudentDashboard';
import { RoleSelection } from './components/RoleSelection';

export type UserRole = 'teacher' | 'student' | null;

export default function App() {
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [userName, setUserName] = useState<string>('');

  const handleRoleSelect = (role: UserRole, name: string) => {
    setUserRole(role);
    setUserName(name);
  };

  const handleLogout = () => {
    setUserRole(null);
    setUserName('');
  };

  if (!userRole) {
    return <RoleSelection onRoleSelect={handleRoleSelect} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {userRole === 'teacher' ? (
        <TeacherDashboard userName={userName} onLogout={handleLogout} />
      ) : (
        <StudentDashboard userName={userName} onLogout={handleLogout} />
      )}
    </div>
  );
}
