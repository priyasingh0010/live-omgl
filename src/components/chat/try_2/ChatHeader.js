// components/ChatHeader.jsx
import { SkipForward } from 'lucide-react';
import VideoCallButton from '../videocall/VideoCall';

export default function ChatHeader({ isWaiting, partnerName, onSkip,socket,username}) {
  if (isWaiting) {
    return (
      <div className="text-center text-gray-600">
        Finding a chat partner...
      </div>
    );
  }

  return (
    <div className="flex justify-between items-center">
      <div className="font-medium text-gray-600">
        Chatting with: {partnerName}
      </div>
      <div className="flex" >
          <VideoCallButton
              socket={socket}
              username={username}
              partnerName={partnerName}
          /> &nbsp;
      <button
        onClick={onSkip}
        className="flex items-center gap-2 px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
      >
        <SkipForward size={16} />
        Skip
      </button>

      </div>
      
    </div>
  );
}