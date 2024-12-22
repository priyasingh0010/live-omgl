// components/MessageList.jsx
import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';


export default function MessageList({ messages, username, isTyping, partnerName }) {
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
<div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 rounded-md shadow-inner">
      {messages.map((message, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
          className={`flex ${
            message.sender === username ? 'justify-end' : 'justify-start'
          }`}
        >
          {message.system ? (
            <div className="text-center text-gray-500 text-sm w-full italic">
              <p>{message.text}</p>
            </div>
          ) : (
            <div
              className={`relative max-w-[70%] px-4 py-3 rounded-xl shadow-md ${
                message.sender === username
                  ? 'bg-blue-500 text-white'
                  : 'bg-white border border-gray-200'
              }`}
            >
              <div className="text-xs text-gray-900 mb-1 flex justify-between">
                <span>{message.sender}</span>
                {/* <span>{new Date().toLocaleTimeString()}</span> */}
              </div>
              <p className="text-lg leading-relaxed text-black">{message.text}</p>
              {message.sender === username && (
                <span
                  className="absolute top-full left-full -mt-1 -ml-1 w-2.5 h-2.5 bg-blue-500 rounded-full"
                  aria-hidden="true"
                ></span>
              )}
            </div>
          )}
        </motion.div>
      ))}

      {isTyping && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="text-gray-500 text-sm flex items-center space-x-2"
        >
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-150"></div>
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-300"></div>
          <span>{partnerName} is typing...</span>
        </motion.div>
      )}

      <div ref={messagesEndRef} />
    </div>
  );
}
