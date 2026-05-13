import { useState } from 'react';
import { Search, Download, Eye } from 'lucide-react';

interface StudentResult {
  id: string;
  studentName: string;
  examTitle: string;
  batch: string;
  score: number;
  totalScore: number;
  percentage: number;
  submittedAt: string;
  status: 'passed' | 'failed';
}

const MOCK_RESULTS: StudentResult[] = [
  {
    id: '1',
    studentName: 'John Doe',
    examTitle: 'Midterm Physics',
    batch: 'Batch A',
    score: 85,
    totalScore: 100,
    percentage: 85,
    submittedAt: '2025-12-08 10:30 AM',
    status: 'passed',
  },
  {
    id: '2',
    studentName: 'Jane Smith',
    examTitle: 'Midterm Physics',
    batch: 'Batch A',
    score: 92,
    totalScore: 100,
    percentage: 92,
    submittedAt: '2025-12-08 10:25 AM',
    status: 'passed',
  },
  {
    id: '3',
    studentName: 'Mike Johnson',
    examTitle: 'Calculus Quiz',
    batch: 'Batch B',
    score: 45,
    totalScore: 100,
    percentage: 45,
    submittedAt: '2025-12-09 02:15 PM',
    status: 'failed',
  },
  {
    id: '4',
    studentName: 'Sarah Williams',
    examTitle: 'Calculus Quiz',
    batch: 'Batch B',
    score: 78,
    totalScore: 100,
    percentage: 78,
    submittedAt: '2025-12-09 02:20 PM',
    status: 'passed',
  },
];

export function ResultsViewer() {
  const [results] = useState<StudentResult[]>(MOCK_RESULTS);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBatch, setSelectedBatch] = useState('all');

  const batches = ['all', ...new Set(results.map(r => r.batch))];

  const filteredResults = results.filter(result => {
    const matchesSearch = result.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         result.examTitle.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBatch = selectedBatch === 'all' || result.batch === selectedBatch;
    return matchesSearch && matchesBatch;
  });

  const averageScore = filteredResults.reduce((sum, r) => sum + r.percentage, 0) / filteredResults.length || 0;
  const passRate = (filteredResults.filter(r => r.status === 'passed').length / filteredResults.length * 100) || 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-gray-900">Student Results</h2>
        <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
          <Download className="w-4 h-4" />
          Export Results
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <p className="text-gray-600 mb-2">Total Submissions</p>
          <p className="text-gray-900">{filteredResults.length}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <p className="text-gray-600 mb-2">Average Score</p>
          <p className="text-gray-900">{averageScore.toFixed(1)}%</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <p className="text-gray-600 mb-2">Pass Rate</p>
          <p className="text-gray-900">{passRate.toFixed(1)}%</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by student or exam name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <select
            value={selectedBatch}
            onChange={(e) => setSelectedBatch(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {batches.map(batch => (
              <option key={batch} value={batch}>
                {batch === 'all' ? 'All Batches' : batch}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Results Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-gray-600">Student Name</th>
                <th className="px-6 py-3 text-left text-gray-600">Exam</th>
                <th className="px-6 py-3 text-left text-gray-600">Batch</th>
                <th className="px-6 py-3 text-left text-gray-600">Score</th>
                <th className="px-6 py-3 text-left text-gray-600">Status</th>
                <th className="px-6 py-3 text-left text-gray-600">Submitted</th>
                <th className="px-6 py-3 text-left text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredResults.map((result) => (
                <tr key={result.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-gray-900">{result.studentName}</td>
                  <td className="px-6 py-4 text-gray-900">{result.examTitle}</td>
                  <td className="px-6 py-4 text-gray-600">{result.batch}</td>
                  <td className="px-6 py-4 text-gray-900">
                    {result.score}/{result.totalScore} ({result.percentage}%)
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full ${
                      result.status === 'passed'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {result.status === 'passed' ? 'Passed' : 'Failed'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{result.submittedAt}</td>
                  <td className="px-6 py-4">
                    <button className="text-indigo-600 hover:text-indigo-700">
                      <Eye className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredResults.length === 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <p className="text-gray-500">No results found matching your criteria.</p>
        </div>
      )}
    </div>
  );
}
