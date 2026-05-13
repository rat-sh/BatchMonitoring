import { useState } from 'react';
import { Plus, Check, Trash2, Lightbulb } from 'lucide-react';

interface Todo {
  id: string;
  title: string;
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
  dueDate: string;
}

const MOCK_TODOS: Todo[] = [
  {
    id: '1',
    title: 'Grade Batch A midterm exams',
    completed: false,
    priority: 'high',
    dueDate: '2025-12-12',
  },
  {
    id: '2',
    title: 'Prepare Quantum Mechanics lecture slides',
    completed: false,
    priority: 'medium',
    dueDate: '2025-12-13',
  },
  {
    id: '3',
    title: 'Update course syllabus',
    completed: true,
    priority: 'low',
    dueDate: '2025-12-10',
  },
];

const RECOMMENDATIONS = [
  'Review student performance trends from last week',
  'Schedule office hours for struggling students',
  'Update attendance records for all batches',
  'Prepare practice questions for upcoming exam',
  'Send reminder about assignment deadline',
];

export function TeacherTodo() {
  const [todos, setTodos] = useState<Todo[]>(MOCK_TODOS);
  const [showModal, setShowModal] = useState(false);
  const [newTodo, setNewTodo] = useState({
    title: '',
    priority: 'medium' as 'high' | 'medium' | 'low',
    dueDate: '',
  });

  const handleAddTodo = () => {
    if (newTodo.title && newTodo.dueDate) {
      const todo: Todo = {
        id: Date.now().toString(),
        ...newTodo,
        completed: false,
      };
      setTodos([...todos, todo]);
      setShowModal(false);
      setNewTodo({ title: '', priority: 'medium', dueDate: '' });
    }
  };

  const handleToggleTodo = (id: string) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const handleDeleteTodo = (id: string) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const addRecommendation = (recommendation: string) => {
    const todo: Todo = {
      id: Date.now().toString(),
      title: recommendation,
      completed: false,
      priority: 'medium',
      dueDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    };
    setTodos([...todos, todo]);
  };

  const priorityColors = {
    high: 'bg-red-100 text-red-700',
    medium: 'bg-yellow-100 text-yellow-700',
    low: 'bg-green-100 text-green-700',
  };

  const activeTodos = todos.filter(t => !t.completed);
  const completedTodos = todos.filter(t => t.completed);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-gray-900">To-Do List</h2>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          <Plus className="w-4 h-4" />
          Add Task
        </button>
      </div>

      {/* Recommendations */}
      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl border border-purple-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Lightbulb className="w-5 h-5 text-purple-600" />
          <h3 className="text-gray-900">Smart Recommendations</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {RECOMMENDATIONS.map((rec, index) => (
            <div
              key={index}
              className="bg-white rounded-lg p-3 flex items-start justify-between gap-2 hover:shadow-sm transition-shadow"
            >
              <p className="text-gray-700 flex-1">{rec}</p>
              <button
                onClick={() => addRecommendation(rec)}
                className="text-purple-600 hover:text-purple-700 shrink-0"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Active Todos */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-gray-900 mb-4">Active Tasks ({activeTodos.length})</h3>
        <div className="space-y-3">
          {activeTodos.map((todo) => (
            <div
              key={todo.id}
              className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <button
                onClick={() => handleToggleTodo(todo.id)}
                className="w-5 h-5 border-2 border-gray-400 rounded hover:border-indigo-600 flex items-center justify-center"
              >
                {todo.completed && <Check className="w-4 h-4 text-indigo-600" />}
              </button>
              <div className="flex-1">
                <p className="text-gray-900">{todo.title}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${priorityColors[todo.priority]}`}>
                    {todo.priority}
                  </span>
                  <span className="text-gray-500">Due: {todo.dueDate}</span>
                </div>
              </div>
              <button
                onClick={() => handleDeleteTodo(todo.id)}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
          {activeTodos.length === 0 && (
            <p className="text-center text-gray-500 py-8">No active tasks. Great job!</p>
          )}
        </div>
      </div>

      {/* Completed Todos */}
      {completedTodos.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-gray-900 mb-4">Completed Tasks ({completedTodos.length})</h3>
          <div className="space-y-3">
            {completedTodos.map((todo) => (
              <div
                key={todo.id}
                className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg opacity-60"
              >
                <button
                  onClick={() => handleToggleTodo(todo.id)}
                  className="w-5 h-5 border-2 border-green-600 rounded bg-green-600 flex items-center justify-center"
                >
                  <Check className="w-4 h-4 text-white" />
                </button>
                <div className="flex-1">
                  <p className="text-gray-900 line-through">{todo.title}</p>
                  <span className="text-gray-500">Completed</span>
                </div>
                <button
                  onClick={() => handleDeleteTodo(todo.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Todo Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
            <h3 className="text-gray-900 mb-4">Add New Task</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-1">Task Title</label>
                <input
                  type="text"
                  value={newTodo.title}
                  onChange={(e) => setNewTodo({ ...newTodo, title: e.target.value })}
                  placeholder="e.g., Grade assignments"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 mb-1">Priority</label>
                  <select
                    value={newTodo.priority}
                    onChange={(e) => setNewTodo({ ...newTodo, priority: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 mb-1">Due Date</label>
                  <input
                    type="date"
                    value={newTodo.dueDate}
                    onChange={(e) => setNewTodo({ ...newTodo, dueDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleAddTodo}
                  className="flex-1 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700"
                >
                  Add Task
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300"
                >
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
