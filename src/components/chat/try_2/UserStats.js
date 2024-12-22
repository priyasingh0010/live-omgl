
// components/UserStats.jsx
export default function UserStats({ userCount, username }) {
  return (
    <div className="flex justify-between items-center">
      <div className="text-sm text-gray-600">
        Online: {userCount.total} | 
        Chatting: {userCount.chatting * 2} | 
        Waiting: {userCount.waiting}
      </div>
      <div className="text-sm font-medium text-gray-900">
        {username}
      </div>
    </div>
  );
}
