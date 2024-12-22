
'use client';
import ChatComponent from '@/components/chat/try_2/ChatComponent';

export default function Home() {
 

  return (
    <main className="min-h-screen p-4 bg-gray-100">
      <div className="max-w-4xl mx-auto">
        <ChatComponent/>
      </div>
    </main>
  );
}