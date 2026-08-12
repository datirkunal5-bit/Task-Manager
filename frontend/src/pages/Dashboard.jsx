import { useAuth } from '../context/AuthContext';

function Dashboard() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <button
            onClick={logout}
            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-gray-700">Welcome, {user?.name}!</p>
          <p className="text-gray-500 text-sm mt-1">{user?.email}</p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;