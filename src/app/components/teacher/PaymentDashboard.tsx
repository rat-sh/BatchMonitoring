import { useState } from 'react';
import { QrCode, Upload, CheckCircle, XCircle, Clock, IndianRupee, Users, Image, AlertCircle } from 'lucide-react';

interface PaymentRequest {
  id: string;
  studentName: string;
  batch: string;
  amount: number;
  date: string;
  method: 'upi' | 'cash';
  status: 'pending' | 'verified' | 'rejected';
  screenshotUrl?: string;
  utrRef?: string;
}

const MOCK_REQUESTS: PaymentRequest[] = [
  {
    id: '1',
    studentName: 'Rahul Sharma',
    batch: 'Batch A - Physics',
    amount: 2500,
    date: '2026-05-12',
    method: 'upi',
    status: 'pending',
    screenshotUrl: 'screenshot',
    utrRef: 'UPI123456789',
  },
  {
    id: '2',
    studentName: 'Priya Singh',
    batch: 'Batch B - Mathematics',
    amount: 2500,
    date: '2026-05-11',
    method: 'upi',
    status: 'verified',
    screenshotUrl: 'screenshot',
    utrRef: 'UPI987654321',
  },
  {
    id: '3',
    studentName: 'Amit Kumar',
    batch: 'Batch A - Physics',
    amount: 2500,
    date: '2026-05-10',
    method: 'cash',
    status: 'pending',
  },
  {
    id: '4',
    studentName: 'Sneha Patel',
    batch: 'Batch B - Mathematics',
    amount: 2500,
    date: '2026-05-09',
    method: 'upi',
    status: 'rejected',
    screenshotUrl: 'screenshot',
    utrRef: 'UPI111222333',
  },
];

export function PaymentDashboard() {
  const [requests, setRequests] = useState<PaymentRequest[]>(MOCK_REQUESTS);
  const [qrUploaded, setQrUploaded] = useState(false);
  const [upiId, setUpiId] = useState('teacher@upi');
  const [showQrSetup, setShowQrSetup] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<PaymentRequest | null>(null);
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'verified' | 'rejected'>('all');

  const verifyPayment = (id: string) => {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'verified' } : r));
    setSelectedRequest(null);
    alert('✅ Payment verified! Student has been notified.');
  };

  const rejectPayment = (id: string) => {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'rejected' } : r));
    setSelectedRequest(null);
    alert('❌ Payment rejected. Student has been notified.');
  };

  const markCashReceived = (id: string) => {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'verified' } : r));
    alert('✅ Cash payment marked as received!');
  };

  const filtered = filterStatus === 'all' ? requests : requests.filter(r => r.status === filterStatus);
  const pendingCount = requests.filter(r => r.status === 'pending').length;
  const totalVerified = requests.filter(r => r.status === 'verified').reduce((s, r) => s + r.amount, 0);

  return (
    <div className="space-y-5 pb-6">
      <div className="flex items-center justify-between">
        <h2 className="text-gray-900">Payments</h2>
        <button onClick={() => setShowQrSetup(true)} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm">
          <QrCode className="w-4 h-4" />
          {qrUploaded ? 'Update QR' : 'Setup QR'}
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-4 text-white">
          <div className="flex items-center gap-1 mb-1">
            <IndianRupee className="w-4 h-4 opacity-80" />
            <p className="text-xs opacity-80">Collected</p>
          </div>
          <p className="text-xl">₹{totalVerified.toLocaleString('en-IN')}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Clock className="w-4 h-4 text-yellow-500" />
          </div>
          <p className="text-gray-900 text-xl">{pendingCount}</p>
          <p className="text-gray-600 text-xs">Pending</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Users className="w-4 h-4 text-indigo-500" />
          </div>
          <p className="text-gray-900 text-xl">{new Set(requests.map(r => r.studentName)).size}</p>
          <p className="text-gray-600 text-xs">Students</p>
        </div>
      </div>

      {/* QR Code Section */}
      <div className={`rounded-xl border-2 p-4 sm:p-6 ${qrUploaded ? 'border-green-200 bg-green-50' : 'border-dashed border-indigo-300 bg-indigo-50'}`}>
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="w-24 h-24 bg-white border-2 border-indigo-200 rounded-xl flex items-center justify-center shrink-0">
            {qrUploaded ? (
              <div className="text-center">
                <QrCode className="w-10 h-10 text-indigo-600 mx-auto" />
                <p className="text-xs text-green-600 mt-1">Active</p>
              </div>
            ) : (
              <QrCode className="w-10 h-10 text-indigo-300" />
            )}
          </div>
          <div className="flex-1 text-center sm:text-left">
            <h3 className="text-gray-900 mb-1">{qrUploaded ? 'UPI QR Code Active' : 'Setup Your UPI QR Code'}</h3>
            <p className="text-gray-600 text-sm mb-2">
              {qrUploaded ? `UPI ID: ${upiId}` : 'Upload your UPI QR code so students can scan and pay you directly.'}
            </p>
            {!qrUploaded && (
              <button
                onClick={() => setShowQrSetup(true)}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm"
              >
                Upload QR Code
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto">
        {(['all', 'pending', 'verified', 'rejected'] as const).map(status => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-4 py-2 rounded-lg text-sm capitalize whitespace-nowrap transition-colors ${filterStatus === status ? 'bg-indigo-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}
          >
            {status === 'all' ? 'All Payments' : status}
            {status === 'pending' && pendingCount > 0 && (
              <span className="ml-1 bg-red-500 text-white text-xs rounded-full px-1.5">{pendingCount}</span>
            )}
          </button>
        ))}
      </div>

      {/* Payment Requests */}
      <div className="space-y-3">
        {filtered.length === 0 && (
          <div className="bg-white rounded-xl border border-gray-200 p-10 text-center text-gray-500">
            No payments in this category.
          </div>
        )}
        {filtered.map(req => (
          <div key={req.id} className={`bg-white rounded-xl border-2 p-4 ${req.status === 'pending' ? 'border-yellow-200' : req.status === 'verified' ? 'border-green-200' : 'border-red-200'}`}>
            <div className="flex flex-col sm:flex-row sm:items-start gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap mb-2">
                  <p className="text-gray-900">{req.studentName}</p>
                  <span className={`px-2 py-0.5 rounded-full text-xs ${req.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : req.status === 'verified' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {req.status === 'verified' ? '✓ Verified' : req.status === 'rejected' ? '✗ Rejected' : '⏳ Pending'}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-xs ${req.method === 'upi' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}>
                    {req.method === 'upi' ? 'UPI' : 'Cash'}
                  </span>
                </div>
                <p className="text-gray-600 text-sm">{req.batch}</p>
                <p className="text-gray-900 mt-1">₹{req.amount.toLocaleString('en-IN')}</p>
                <p className="text-gray-500 text-xs mt-1">{req.date}</p>
                {req.utrRef && <p className="text-gray-500 text-xs">Ref: {req.utrRef}</p>}
              </div>

              <div className="flex flex-col gap-2 shrink-0">
                {req.method === 'upi' && req.screenshotUrl && (
                  <button
                    onClick={() => setSelectedRequest(req)}
                    className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm"
                  >
                    <Image className="w-4 h-4 text-gray-600" />
                    View Screenshot
                  </button>
                )}
                {req.status === 'pending' && req.method === 'upi' && (
                  <div className="flex gap-2">
                    <button onClick={() => verifyPayment(req.id)} className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm">
                      <CheckCircle className="w-4 h-4" /> Verify
                    </button>
                    <button onClick={() => rejectPayment(req.id)} className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm">
                      <XCircle className="w-4 h-4" /> Reject
                    </button>
                  </div>
                )}
                {req.status === 'pending' && req.method === 'cash' && (
                  <button onClick={() => markCashReceived(req.id)} className="flex items-center justify-center gap-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm">
                    <CheckCircle className="w-4 h-4" /> Mark Cash Received
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Screenshot Viewer Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-sm">
            <h3 className="text-gray-900 mb-4">Payment Screenshot</h3>
            <div className="bg-gray-100 rounded-xl h-64 flex items-center justify-center mb-4">
              <div className="text-center text-gray-500">
                <Image className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                <p className="text-sm">Payment Screenshot</p>
                <p className="text-xs text-gray-400">From {selectedRequest.studentName}</p>
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-3 mb-4 text-sm space-y-1">
              <p className="text-gray-900">{selectedRequest.studentName} — {selectedRequest.batch}</p>
              <p className="text-gray-900">Amount: ₹{selectedRequest.amount.toLocaleString('en-IN')}</p>
              {selectedRequest.utrRef && <p className="text-gray-600">Ref: {selectedRequest.utrRef}</p>}
            </div>
            {selectedRequest.status === 'pending' && (
              <div className="flex gap-2 mb-3">
                <button onClick={() => verifyPayment(selectedRequest.id)} className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 text-sm">
                  ✓ Verify
                </button>
                <button onClick={() => rejectPayment(selectedRequest.id)} className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 text-sm">
                  ✗ Reject
                </button>
              </div>
            )}
            <button onClick={() => setSelectedRequest(null)} className="w-full bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 text-sm">
              Close
            </button>
          </div>
        </div>
      )}

      {/* QR Setup Modal */}
      {showQrSetup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
            <h3 className="text-gray-900 mb-4">Setup UPI Payment</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-1 text-sm">Your UPI ID</label>
                <input
                  type="text"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  placeholder="e.g., yourname@paytm"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-1 text-sm">Upload QR Code Image</label>
                <div
                  onClick={() => { setQrUploaded(true); }}
                  className="border-2 border-dashed border-indigo-300 rounded-xl p-8 text-center hover:border-indigo-500 cursor-pointer bg-indigo-50"
                >
                  <QrCode className="w-12 h-12 text-indigo-400 mx-auto mb-2" />
                  <p className="text-gray-700 text-sm">Click to upload your UPI QR code</p>
                  <p className="text-gray-500 text-xs">PNG, JPG (from any UPI app)</p>
                </div>
                {qrUploaded && (
                  <div className="flex items-center gap-2 mt-2 text-green-700 text-sm">
                    <CheckCircle className="w-4 h-4" />
                    QR code uploaded successfully
                  </div>
                )}
              </div>
              <div className="bg-blue-50 rounded-lg p-3 text-sm text-blue-800 flex gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <p>Students will scan this QR code to pay via UPI. They can also pay cash and you mark it manually.</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setShowQrSetup(false)} className="flex-1 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 text-sm">
                  Save
                </button>
                <button onClick={() => setShowQrSetup(false)} className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 text-sm">
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
