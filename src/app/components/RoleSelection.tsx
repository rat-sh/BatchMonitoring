import { useState } from 'react';
import { GraduationCap, BookOpen } from 'lucide-react';
import { UserRole } from '../App';

interface RoleSelectionProps {
  onRoleSelect: (role: UserRole, name: string) => void;
}

export function RoleSelection({ onRoleSelect }: RoleSelectionProps) {
  const [name, setName] = useState('');
  const [selectedRole, setSelectedRole] = useState<'teacher' | 'student' | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && selectedRole) {
      onRoleSelect(selectedRole, name.trim());
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-full mb-4">
            <BookOpen className="w-8 h-8 text-indigo-600" />
          </div>
          <h1 className="text-indigo-900 mb-2">EduConnect</h1>
          <p className="text-gray-600">Welcome! Please select your role to continue</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-gray-700 mb-2">
              Your Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-3">I am a...</label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setSelectedRole('teacher')}
                className={`p-6 border-2 rounded-xl transition-all ${
                  selectedRole === 'teacher'
                    ? 'border-indigo-600 bg-indigo-50'
                    : 'border-gray-200 hover:border-indigo-300'
                }`}
              >
                <GraduationCap className="w-12 h-12 mx-auto mb-2 text-indigo-600" />
                <div className="text-gray-900">Teacher</div>
              </button>

              <button
                type="button"
                onClick={() => setSelectedRole('student')}
                className={`p-6 border-2 rounded-xl transition-all ${
                  selectedRole === 'student'
                    ? 'border-indigo-600 bg-indigo-50'
                    : 'border-gray-200 hover:border-indigo-300'
                }`}
              >
                <BookOpen className="w-12 h-12 mx-auto mb-2 text-indigo-600" />
                <div className="text-gray-900">Student</div>
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={!name.trim() || !selectedRole}
            className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            Continue
          </button>
        </form>
      </div>
    </div>
  );
}
