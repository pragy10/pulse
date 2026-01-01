import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-primary">Pulse</h1>
          <button onClick={logout} className="btn-secondary">
            Logout
          </button>
        </div>
      </nav>
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="card">
          <h2 className="text-3xl font-bold mb-4">
            Welcome, {user.username}! 🌱
          </h2>
          <div className="flex items-center space-x-4">
            <div className="bg-primary text-white px-6 py-3 rounded-lg">
              <p className="text-sm">Green Karma</p>
              <p className="text-3xl font-bold">{user.green_karma}</p>
            </div>
            <div className="bg-secondary text-white px-6 py-3 rounded-lg">
              <p className="text-sm">Role</p>
              <p className="text-xl font-semibold capitalize">{user.role}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
