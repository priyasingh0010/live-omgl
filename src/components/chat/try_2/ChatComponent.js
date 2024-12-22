'use client'



import { useState,useEffect } from 'react';
import Layout from './Layout';
import RegisterForm from './RegisterForm';
import ChatWindow from './ChatWindow';
import ChatHeader from './ChatHeader';
import MessageList from './MessageList';
import ChatInput from './ChatInput';
import useSocket from './useSocket';
import VideoCallButton from '../videocall/VideoCall';

export default function ChatComponent() {
  const { socket, isConnected } = useSocket();
  const [isRegistered, setIsRegistered] = useState(false);
  const [username, setUsername] = useState('');
  const [messages, setMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [partnerName, setPartnerName] = useState(null);
  const [isWaiting, setIsWaiting] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [userCount, setUserCount] = useState({ total: 0, waiting: 0, chatting: 0 });

  useEffect(() => {
    if (!socket) return;

    socket.on('chat-start', ({ partnerName }) => {
      setPartnerName(partnerName);
      setIsWaiting(false);
      setMessages([]);
    });

    socket.on('chat-message', ({ message, username }) => {
      setMessages(prev => [...prev, { text: message, sender: username }]);
    });

    socket.on('waiting', () => {
      setIsWaiting(true);
      setPartnerName(null);
    });

    socket.on('partner-disconnected', () => {
      setMessages(prev => [...prev, { text: 'Your partner has disconnected', system: true }]);
      setPartnerName(null);
    });

    socket.on('partner-skipped', () => {
      setMessages([]);
      setPartnerName(null);
      setIsWaiting(true);
    });

    socket.on('partner-typing', () => {
      setIsTyping(true);
      setTimeout(() => setIsTyping(false), 1000);
    });

    socket.on('user-count', (counts) => {
      setUserCount(counts);
    });

    return () => {
      socket.off('chat-start');
      socket.off('chat-message');
      socket.off('waiting');
      socket.off('partner-disconnected');
      socket.off('partner-skipped');
      socket.off('partner-typing');
      socket.off('user-count');
    };
  }, [socket]);

  const handleRegister = ({ username, interests }) => {
    if (!socket) return;
    
    socket.emit('register', { username, interests });
    setUsername(username);
    setIsRegistered(true);
    setIsWaiting(true);
  };

  const handleSendMessage = (message) => {
    if (!socket || !partnerName) return;

    socket.emit('chat-message', { message });
    setMessages(prev => [...prev, { text: message, sender: username }]);
  };

  const handleSkip = () => {
    if (!socket) return;

    socket.emit('skip');
    setMessages([]);
    setIsWaiting(true);
    setPartnerName(null);
  };

  const handleTyping = () => {
    if (!socket) return;
    socket.emit('typing');
  };

  if (!isRegistered) {
    return <RegisterForm onRegister={handleRegister} />;
  }

  return (
    <Layout userCount={userCount} username={username}>
      <ChatWindow isWaiting={isWaiting}>
        <div className="p-4 border-b">
          <ChatHeader 
            isWaiting={isWaiting}
            partnerName={partnerName}
            onSkip={handleSkip}
          />
            <VideoCallButton
                    socket={socket}
                    username={username}
                    partnerName={partnerName}
                />
        </div>
        <MessageList 
          messages={messages}
          username={username}
          isTyping={isTyping}
          partnerName={partnerName}
        />
        <ChatInput 
          currentMessage={currentMessage}
          setCurrentMessage={setCurrentMessage}
          onSend={handleSendMessage}
          onTyping={handleTyping}
          isWaiting={isWaiting}
        />
      </ChatWindow>
    </Layout>
  );
}