// components/VideoCall/VideoCallModal.jsx
export default function VideoCallModal({
    localStream,
    remoteStream,
    onClose
  }) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl p-4">
          <div className="relative aspect-video mb-4">
            {remoteStream && (
              <video
                ref={video => {
                  if (video && remoteStream) video.srcObject = remoteStream;
                }}
                autoPlay
                playsInline
                className="w-full h-full rounded-lg bg-gray-900"
              />
            )}
            {localStream && (
              <video
                ref={video => {
                  if (video && localStream) video.srcObject = localStream;
                }}
                autoPlay
                playsInline
                muted
                className="absolute bottom-4 right-4 w-48 rounded-lg bg-gray-900"
              />
            )}
          </div>
          <div className="flex justify-center">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              End Call
            </button>
          </div>
        </div>
      </div>
    );
  }
  