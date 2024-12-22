
// components/VideoCall/IncomingCallModal.jsx
export default function IncomingCallModal({
    callerName,
    onAccept,
    onReject
  }) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm w-full mx-4">
          <h3 className="text-lg font-semibold text-center mb-4">
            Incoming video call from {callerName}
          </h3>
          <div className="flex justify-center gap-4">
            <button
              onClick={onAccept}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              Accept
            </button>
            <button
              onClick={onReject}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              Decline
            </button>
          </div>
        </div>
      </div>
    );
  }