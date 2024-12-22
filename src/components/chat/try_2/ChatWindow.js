
// components/ChatWindow.jsx
export default function ChatWindow({ children, isWaiting }) {
    return (
      <div className="bg-white rounded-lg shadow-md h-[calc(100vh-12rem)] flex flex-col">
        {children}
      </div>
    );
  }