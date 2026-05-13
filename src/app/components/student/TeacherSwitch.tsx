import { useState } from 'react';
import { Users, ChevronRight, LogOut, AlertTriangle, CheckCircle, Lock, X, Bell } from 'lucide-react';

interface TeacherEntry {
  id: string;
  name: string;
  subject: string;
  batch: string;
  batchCode: string;
  avatar: string;
  isActive: boolean;
}

interface Notification {
  id: string;
  message: string;
  type: 'info' | 'warning' | 'success';
  time: string;
}

const MOCK_TEACHERS: TeacherEntry[] = [
  {
    id: '1',
    name: 'Dr. Rajeev Sharma',
    subject: 'Physics',
    batch: 'Batch A - Physics',
    batchCode: 'PHY-A-2026',
    avatar: 'RS',
    isActive: true,
  },
  {
    id: '2',
    name: 'Mrs. Anita Verma',
    subject: 'Mathematics',
    batch: 'Batch B - Mathematics',
    batchCode: 'MATH-B-2026',
    avatar: 'AV',
    isActive: false,
  },
];

const CORRECT_PIN = '123456';

export function TeacherSwitch() {
  const [teachers, setTeachers] = useState<TeacherEntry[]>(MOCK_TEACHERS);
  const [notifications, setNotifications] = useState<Notification[]>([
    { id: '1', message: 'You joined Batch A - Physics (Dr. Rajeev Sharma)', type: 'success', time: '2 days ago' },
  ]);
  const [showSwitchModal, setShowSwitchModal] = useState(false);
  const [showLeaveModal, setShowLeaveModal] = useState<TeacherEntry | null>(null);
  const [showJoinModal, setShowJoinModal] = useState(false);

  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');
  const [batchCode, setBatchCode] = useState('');
  const [joinStep, setJoinStep] = useState<'code' | 'pin' | 'done'>('code');
  const [leaveStep, setLeaveStep] = useState<'confirm' | 'pin'>('confirm');
  const [leavePinInput, setLeavePinInput] = useState('');
  const [leavePinError, setLeavePinError] = useState('');

  const addNotification = (message: string, type: Notification['type']) => {
    const notif: Notification = {
      id: Date.now().toString(),
      message,
      type,
      time: 'Just now',
    };
    setNotifications(prev => [notif, ...prev]);
  };

  const handleJoinNewBatch = () => {
    if (joinStep === 'code') {
      if (!batchCode.trim()) return;
      setJoinStep('pin');
      return;
    }
    if (joinStep === 'pin') {
      if (pinInput !== CORRECT_PIN) {
        setPinError('Incorrect PIN. Please try again.');
        return;
      }
      const newTeacher: TeacherEntry = {
        id: Date.now().toString(),
        name: 'New Teacher',
        subject: 'Science',
        batch: batchCode,
        batchCode: batchCode,
        avatar: 'NT',
        isActive: false,
      };
      setTeachers(prev => [...prev, newTeacher]);
      addNotification(`You joined batch ${batchCode}`, 'success');
      setJoinStep('done');
    }
  };

  const closeJoinModal = () => {
    setShowJoinModal(false);
    setJoinStep('code');
    setBatchCode('');
    setPinInput('');
    setPinError('');
  };

  const handleLeaveConfirm = () => {
    if (leaveStep === 'confirm') {
      setLeaveStep('pin');
      return;
    }
    if (leavePinInput !== CORRECT_PIN) {
      setLeavePinError('Incorrect PIN. Please try again.');
      return;
    }
    if (showLeaveModal) {
      const name = showLeaveModal.name;
      const batch = showLeaveModal.batch;
      setTeachers(prev => prev.filter(t => t.id !== showLeaveModal.id));
      addNotification(`You left ${batch} (${name}). Teacher has been notified.`, 'warning');
      setShowLeaveModal(null);
      setLeaveStep('confirm');
      setLeavePinInput('');
      setLeavePinError('');
    }
  };

  const closeLeaveModal = () => {
    setShowLeaveModal(null);
    setLeaveStep('confirm');
    setLeavePinInput('');
    setLeavePinError('');
  };

  const setActiveTeacher = (id: string) => {
    setTeachers(prev => prev.map(t => ({ ...t, isActive: t.id === id })));
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-gray-900">My Teachers</h2>
        <button
          onClick={() => setShowJoinModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm"
        >
          <Users className="w-4 h-4" />
          Join Batch
        </button>
      </div>

      {/* Info Banner */}
      <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4 text-sm text-indigo-800">
        You can join multiple teacher batches. Use the batch code from your teacher to join. Switching requires your PIN.
      </div>

      {/* Teacher Cards */}
      <div className="space-y-3">
        {teachers.length === 0 && (
          <div className="bg-white rounded-xl border border-gray-200 p-10 text-center text-gray-500">
            <Users className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p>No teachers joined yet. Use a batch code to join.</p>
          </div>
        )}
        {teachers.map(teacher => (
          <div
            key={teacher.id}
            className={`bg-white rounded-xl border-2 p-4 sm:p-5 ${teacher.isActive ? 'border-indigo-400 bg-indigo-50' : 'border-gray-200'}`}
          >
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 text-white ${teacher.isActive ? 'bg-indigo-600' : 'bg-gray-400'}`}>
                <span className="text-sm">{teacher.avatar}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-gray-900">{teacher.name}</p>
                  {teacher.isActive && (
                    <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded-full text-xs">Active</span>
                  )}
                </div>
                <p className="text-gray-600 text-sm">{teacher.subject}</p>
                <p className="text-gray-500 text-xs">{teacher.batch} · Code: <span className="font-mono">{teacher.batchCode}</span></p>
              </div>
              <div className="flex flex-col gap-2 shrink-0">
                {!teacher.isActive && (
                  <button
                    onClick={() => setActiveTeacher(teacher.id)}
                    className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-xs"
                  >
                    Set Active
                  </button>
                )}
                <button
                  onClick={() => setShowLeaveModal(teacher)}
                  className="flex items-center gap-1 px-3 py-1.5 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 text-xs"
                >
                  <LogOut className="w-3 h-3" />
                  Leave
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Notifications Log */}
      {notifications.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-4 sm:px-5 py-4 border-b border-gray-200 flex items-center gap-2">
            <Bell className="w-4 h-4 text-indigo-600" />
            <h3 className="text-gray-900">Activity Log</h3>
          </div>
          <div className="divide-y divide-gray-100">
            {notifications.map(notif => (
              <div key={notif.id} className="px-4 sm:px-5 py-3 flex items-start gap-3">
                <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${notif.type === 'success' ? 'bg-green-500' : notif.type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'}`} />
                <div className="flex-1">
                  <p className="text-gray-700 text-sm">{notif.message}</p>
                  <p className="text-gray-400 text-xs">{notif.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Join Batch Modal */}
      {showJoinModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end sm:items-center justify-center p-0 sm:p-4 z-50">
          <div className="bg-white rounded-t-2xl sm:rounded-xl shadow-xl w-full sm:max-w-sm">
            <div className="p-5">
              {joinStep === 'done' ? (
                <div className="text-center py-4">
                  <CheckCircle className="w-14 h-14 text-green-500 mx-auto mb-3" />
                  <h3 className="text-gray-900 mb-1">Joined Successfully!</h3>
                  <p className="text-gray-600 text-sm mb-4">You've joined the batch. Your teacher can see you now.</p>
                  <button onClick={closeJoinModal} className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700">Done</button>
                </div>
              ) : joinStep === 'code' ? (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-gray-900">Join Batch</h3>
                    <button onClick={closeJoinModal} className="p-1 hover:bg-gray-100 rounded"><X className="w-5 h-5" /></button>
                  </div>
                  <p className="text-gray-600 text-sm mb-4">Enter the batch code provided by your teacher.</p>
                  <input
                    type="text"
                    value={batchCode}
                    onChange={(e) => setBatchCode(e.target.value.toUpperCase())}
                    placeholder="e.g., PHY-A-2026"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm mb-3 font-mono"
                  />
                  <button
                    onClick={handleJoinNewBatch}
                    disabled={!batchCode.trim()}
                    className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                  >
                    Continue
                  </button>
                </>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-gray-900">Enter Your PIN</h3>
                    <button onClick={closeJoinModal} className="p-1 hover:bg-gray-100 rounded"><X className="w-5 h-5" /></button>
                  </div>
                  <div className="flex items-center gap-2 mb-4 p-3 bg-indigo-50 rounded-lg">
                    <Lock className="w-4 h-4 text-indigo-600" />
                    <p className="text-indigo-800 text-sm">Joining batch: <strong>{batchCode}</strong></p>
                  </div>
                  <p className="text-gray-600 text-sm mb-3">Enter your account PIN to confirm.</p>
                  <input
                    type="password"
                    inputMode="numeric"
                    maxLength={6}
                    value={pinInput}
                    onChange={(e) => { setPinInput(e.target.value.replace(/\D/g, '')); setPinError(''); }}
                    placeholder="Enter 6-digit PIN"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm text-center tracking-widest mb-1"
                  />
                  {pinError && <p className="text-red-600 text-xs mb-3">{pinError}</p>}
                  <button
                    onClick={handleJoinNewBatch}
                    disabled={pinInput.length < 4}
                    className="w-full mt-2 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                  >
                    Confirm & Join
                  </button>
                  <button onClick={() => { setJoinStep('code'); setPinInput(''); setPinError(''); }} className="w-full mt-2 bg-gray-200 text-gray-700 py-2 rounded-lg text-sm">
                    Back
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Leave Batch Modal */}
      {showLeaveModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end sm:items-center justify-center p-0 sm:p-4 z-50">
          <div className="bg-white rounded-t-2xl sm:rounded-xl shadow-xl w-full sm:max-w-sm">
            <div className="p-5">
              {leaveStep === 'confirm' ? (
                <>
                  <div className="flex items-start gap-3 mb-4">
                    <AlertTriangle className="w-6 h-6 text-yellow-500 shrink-0 mt-0.5" />
                    <div>
                      <h3 className="text-gray-900 mb-1">Leave Batch?</h3>
                      <p className="text-gray-600 text-sm">You're about to leave <strong>{showLeaveModal.batch}</strong> ({showLeaveModal.name}). Your teacher will be notified.</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={closeLeaveModal} className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 text-sm">Cancel</button>
                    <button onClick={handleLeaveConfirm} className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 text-sm">Continue</button>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-gray-900">Confirm with PIN</h3>
                    <button onClick={closeLeaveModal} className="p-1 hover:bg-gray-100 rounded"><X className="w-5 h-5" /></button>
                  </div>
                  <p className="text-gray-600 text-sm mb-3">Enter your PIN to leave {showLeaveModal.batch}.</p>
                  <input
                    type="password"
                    inputMode="numeric"
                    maxLength={6}
                    value={leavePinInput}
                    onChange={(e) => { setLeavePinInput(e.target.value.replace(/\D/g, '')); setLeavePinError(''); }}
                    placeholder="Enter 6-digit PIN"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm text-center tracking-widest mb-1"
                  />
                  {leavePinError && <p className="text-red-600 text-xs mb-2">{leavePinError}</p>}
                  <button
                    onClick={handleLeaveConfirm}
                    disabled={leavePinInput.length < 4}
                    className="w-full mt-2 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 disabled:opacity-50"
                  >
                    Leave Batch
                  </button>
                  <button onClick={() => { setLeaveStep('confirm'); setLeavePinInput(''); setLeavePinError(''); }} className="w-full mt-2 bg-gray-200 text-gray-700 py-2 rounded-lg text-sm">
                    Back
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
