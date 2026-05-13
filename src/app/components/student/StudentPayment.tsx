import { useState } from 'react';
import { QrCode, Upload, Clock, CheckCircle, AlertCircle, IndianRupee, Image, XCircle } from 'lucide-react';

interface PaymentRecord {
  id: string;
  description: string;
  amount: number;
  date: string;
  method: 'upi' | 'cash';
  status: 'verified' | 'pending' | 'rejected';
  utrRef?: string;
}

const MOCK_RECORDS: PaymentRecord[] = [
  {
    id: '1',
    description: 'Batch A - May Tuition',
    amount: 2500,
    date: '2026-05-01',
    method: 'upi',
    status: 'verified',
    utrRef: 'UPI123456789',
  },
  {
    id: '2',
    description: 'Batch A - April Tuition',
    amount: 2500,
    date: '2026-04-01',
    method: 'cash',
    status: 'verified',
  },
];

const PENDING_FEE = {
  description: 'Batch A - June Tuition',
  amount: 2500,
  dueDate: '2026-06-05',
  batch: 'Batch A - Physics',
  teacherName: 'Dr. Rajeev Sharma',
  teacherUpi: 'rajeev.sharma@paytm',
};

export function StudentPayment() {
  const [records] = useState<PaymentRecord[]>(MOCK_RECORDS);
  const [showPayModal, setShowPayModal] = useState(false);
  const [payStep, setPayStep] = useState<'choose' | 'upi' | 'cash' | 'submitted'>('choose');
  const [utrRef, setUtrRef] = useState('');
  const [screenshotUploaded, setScreenshotUploaded] = useState(false);
  const [showScreenshotModal, setShowScreenshotModal] = useState<PaymentRecord | null>(null);

  const totalPaid = records.filter(r => r.status === 'verified').reduce((s, r) => s + r.amount, 0);
  const pendingCount = records.filter(r => r.status === 'pending').length;

  const handleSubmitPayment = () => {
    if (utrRef || screenshotUploaded) {
      setPayStep('submitted');
    }
  };

  const closeModal = () => {
    setShowPayModal(false);
    setPayStep('choose');
    setUtrRef('');
    setScreenshotUploaded(false);
  };

  return (
    <div className="space-y-5 pb-6">
      <h2 className="text-gray-900">Payments</h2>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl p-4 text-white">
          <IndianRupee className="w-4 h-4 opacity-80 mb-1" />
          <p className="text-xl">₹{totalPaid.toLocaleString('en-IN')}</p>
          <p className="text-xs opacity-80">Total Paid</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
          <Clock className="w-5 h-5 text-yellow-500 mx-auto mb-1" />
          <p className="text-gray-900 text-xl">{pendingCount}</p>
          <p className="text-gray-600 text-xs">Pending</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
          <CheckCircle className="w-5 h-5 text-green-500 mx-auto mb-1" />
          <p className="text-gray-900 text-xl">{records.filter(r => r.status === 'verified').length}</p>
          <p className="text-gray-600 text-xs">Verified</p>
        </div>
      </div>

      {/* Pending Fee Card */}
      <div className="bg-yellow-50 border-2 border-yellow-300 rounded-xl p-4 sm:p-6">
        <div className="flex items-start gap-2 mb-3">
          <AlertCircle className="w-5 h-5 text-yellow-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-gray-900">{PENDING_FEE.description}</p>
            <p className="text-gray-600 text-sm">{PENDING_FEE.batch} · {PENDING_FEE.teacherName}</p>
            <p className="text-gray-900 mt-1">₹{PENDING_FEE.amount.toLocaleString('en-IN')}</p>
            <p className="text-gray-500 text-xs mt-0.5">Due: {PENDING_FEE.dueDate}</p>
          </div>
        </div>
        <button
          onClick={() => setShowPayModal(true)}
          className="w-full bg-indigo-600 text-white py-2.5 rounded-lg hover:bg-indigo-700"
        >
          Pay Now
        </button>
      </div>

      {/* Payment History */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
          <h3 className="text-gray-900">Payment History</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {records.map(rec => (
            <div key={rec.id} className="px-4 sm:px-6 py-4 flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${rec.status === 'verified' ? 'bg-green-100' : rec.status === 'pending' ? 'bg-yellow-100' : 'bg-red-100'}`}>
                {rec.status === 'verified' ? <CheckCircle className="w-5 h-5 text-green-600" /> : rec.status === 'pending' ? <Clock className="w-5 h-5 text-yellow-600" /> : <XCircle className="w-5 h-5 text-red-600" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-gray-900 text-sm">{rec.description}</p>
                <div className="flex flex-wrap items-center gap-x-2 text-xs text-gray-500">
                  <span>{rec.date}</span>
                  <span>·</span>
                  <span className="uppercase">{rec.method}</span>
                  {rec.utrRef && <><span>·</span><span>Ref: {rec.utrRef}</span></>}
                </div>
              </div>
              <div className="text-right shrink-0">
                <p className="text-gray-900 text-sm">₹{rec.amount.toLocaleString('en-IN')}</p>
                <span className={`text-xs px-2 py-0.5 rounded-full ${rec.status === 'verified' ? 'bg-green-100 text-green-700' : rec.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                  {rec.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pay Modal */}
      {showPayModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-end sm:items-center justify-center p-0 sm:p-4 z-50">
          <div className="bg-white rounded-t-2xl sm:rounded-xl shadow-xl w-full sm:max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-5">
              {payStep === 'submitted' ? (
                <div className="text-center py-6">
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-3" />
                  <h3 className="text-gray-900 mb-2">Payment Submitted!</h3>
                  <p className="text-gray-600 text-sm mb-4">Your payment screenshot has been sent to your teacher. You'll be notified once verified.</p>
                  <button onClick={closeModal} className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700">
                    Done
                  </button>
                </div>
              ) : payStep === 'choose' ? (
                <>
                  <h3 className="text-gray-900 mb-1">Pay Fee</h3>
                  <p className="text-gray-600 text-sm mb-4">{PENDING_FEE.description} · ₹{PENDING_FEE.amount.toLocaleString('en-IN')}</p>
                  <div className="space-y-3">
                    <button onClick={() => setPayStep('upi')} className="w-full flex items-center gap-4 p-4 border-2 border-indigo-200 rounded-xl hover:border-indigo-500 hover:bg-indigo-50 transition-colors">
                      <QrCode className="w-10 h-10 text-indigo-600" />
                      <div className="text-left">
                        <p className="text-gray-900">Pay via UPI</p>
                        <p className="text-gray-600 text-sm">Scan QR or use UPI ID</p>
                      </div>
                    </button>
                    <button onClick={() => setPayStep('cash')} className="w-full flex items-center gap-4 p-4 border-2 border-gray-200 rounded-xl hover:border-gray-400 hover:bg-gray-50 transition-colors">
                      <IndianRupee className="w-10 h-10 text-gray-600" />
                      <div className="text-left">
                        <p className="text-gray-900">Pay Cash</p>
                        <p className="text-gray-600 text-sm">Pay in person, teacher marks it</p>
                      </div>
                    </button>
                  </div>
                  <button onClick={closeModal} className="w-full mt-3 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 text-sm">
                    Cancel
                  </button>
                </>
              ) : payStep === 'upi' ? (
                <>
                  <h3 className="text-gray-900 mb-4">Pay via UPI</h3>
                  <div className="bg-gray-50 rounded-xl p-4 flex flex-col items-center mb-4">
                    <div className="w-40 h-40 bg-white border-2 border-indigo-200 rounded-xl flex items-center justify-center mb-3">
                      <QrCode className="w-24 h-24 text-indigo-600" />
                    </div>
                    <p className="text-gray-900 text-sm">UPI ID: <span className="font-mono">{PENDING_FEE.teacherUpi}</span></p>
                    <p className="text-gray-900 mt-1">Amount: ₹{PENDING_FEE.amount.toLocaleString('en-IN')}</p>
                    <p className="text-gray-500 text-xs mt-1">Pay to: {PENDING_FEE.teacherName}</p>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-gray-700 text-sm mb-1">UTR / Transaction Reference</label>
                      <input
                        type="text"
                        value={utrRef}
                        onChange={(e) => setUtrRef(e.target.value)}
                        placeholder="e.g., UPI123456789"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 text-sm mb-1">Upload Payment Screenshot</label>
                      <div
                        onClick={() => setScreenshotUploaded(true)}
                        className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${screenshotUploaded ? 'border-green-400 bg-green-50' : 'border-gray-300 hover:border-indigo-400'}`}
                      >
                        {screenshotUploaded ? (
                          <div>
                            <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-1" />
                            <p className="text-green-700 text-sm">Screenshot uploaded!</p>
                          </div>
                        ) : (
                          <>
                            <Image className="w-8 h-8 text-gray-400 mx-auto mb-1" />
                            <p className="text-gray-700 text-sm">Tap to upload screenshot</p>
                            <p className="text-gray-500 text-xs">PNG, JPG</p>
                          </>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={handleSubmitPayment}
                      disabled={!utrRef && !screenshotUploaded}
                      className="w-full bg-indigo-600 text-white py-2.5 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Submit Payment
                    </button>
                    <button onClick={() => setPayStep('choose')} className="w-full bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 text-sm">
                      Back
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <h3 className="text-gray-900 mb-2">Cash Payment</h3>
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4">
                    <p className="text-blue-800 text-sm">Pay ₹{PENDING_FEE.amount.toLocaleString('en-IN')} cash to <strong>{PENDING_FEE.teacherName}</strong> in person. Your teacher will mark the payment as received.</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4 text-sm space-y-1 mb-4">
                    <p className="text-gray-900">{PENDING_FEE.description}</p>
                    <p className="text-gray-600">{PENDING_FEE.batch}</p>
                    <p className="text-gray-900">Amount: ₹{PENDING_FEE.amount.toLocaleString('en-IN')}</p>
                  </div>
                  <button onClick={() => setPayStep('choose')} className="w-full bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 text-sm">
                    Back
                  </button>
                  <button onClick={closeModal} className="w-full mt-2 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 text-sm">
                    Ok, Got It
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
