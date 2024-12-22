// components/MessageList.jsx
import { useEffect, useRef } from 'react';

export default function MessageList({ messages, username, isTyping, partnerName }) {
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((message, index) => (
        <div
          key={index}
          className={`flex ${
            message.sender === username ? 'justify-end' : 'justify-start'
          }`}
        >
          {message.system ? (
            <div className="text-center text-gray-500 text-sm w-full">
              <p className='text-gray-500' >{message.text}</p>
            </div>
          ) : (
            <div
              className={`max-w-[70%] px-4 py-2 rounded-lg ${
                message.sender === username
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100'
              }`}
            >
              <div className="text-xs text-gray-600 mb-1">
                {message.sender}
              </div>
              <p className='text-black'>{message.text}</p>
            </div>
          )}
        </div>
      ))}
      {isTyping && (
        <div className="text-gray-500 text-sm">
          {partnerName} is typing...
        </div>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
}
