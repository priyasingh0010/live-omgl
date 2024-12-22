
// components/ChatInput.jsx
import { Send } from 'lucide-react';

export default function ChatInput({ 
  currentMessage, 
  setCurrentMessage, 
  onSend, 
  onTyping, 
  isWaiting 
}) {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!currentMessage.trim() || isWaiting) return;
    onSend(currentMessage.trim());
    setCurrentMessage('');
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border-t">
      <div className="flex gap-2">
        <input
          type="text"
          value={currentMessage}
          onChange={(e) => setCurrentMessage(e.target.value)}
          onKeyDown={onTyping}
          placeholder={
            isWaiting
              ? "Waiting for partner..."
              : "Type your message..."
          }
          disabled={isWaiting}
          className="flex-1 px-3 py-2 border text-gray-800 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          disabled={isWaiting}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send size={20} />
        </button>
      </div>
    </form>
  );
}