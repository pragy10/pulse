import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
// 1. Rename the API call so it doesn't conflict with the context function
import { login as loginService } from '../services/auth'; 
// 2. Import the AuthContext
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();
  // 3. Pull the context login function to update global state
  const { login: contextLogin } = useAuth(); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // 4. Call the backend API
      const response = await loginService(email, password);
      
      if (response.success) {
        // 5. CRITICAL FIX: Save the user to React state BEFORE navigating
        contextLogin(response.data.user, response.data.token);
        navigate('/');
      } else {
        setError(response.message || 'Login failed. Please check your credentials.');
      }
    } catch (err) {
      // Added smart error handling here just like we did for Register
      const errorMessage = err.response?.data?.message || 'An error occurred while logging in. Please try again.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl w-full flex flex-col lg:flex-row items-center lg:items-stretch shadow-2xl rounded-3xl overflow-hidden">
        {/* Left Panel - Form */}
        <div className="w-full lg:w-1/2 bg-white p-12 flex flex-col justify-center">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-2">
              Welcome Back!
            </h2>
            <p className="text-sm text-gray-500">
              Enter your credentials to access your account
            </p>
          </div>
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-200 p-4 rounded-xl text-red-700 text-sm">
                {error}
              </div>
            )}
            
            <div className="space-y-4">
              <div>
                <label htmlFor="email-address" className="block text-sm font-medium text-gray-700 mb-2">
                  Email address
                </label>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 px-4 rounded-xl text-sm font-semibold text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all ${
                isLoading 
                  ? 'bg-green-400 cursor-not-allowed' 
                  : 'bg-green-500 hover:bg-green-600'
              }`}
            >
              {isLoading ? 'Signing in...' : 'Log in'}
            </button>
          </form>

          <div className="text-center mt-8 pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <Link to="/register" className="font-semibold text-green-600 hover:text-green-500">
                Create account
              </Link>
            </p>
          </div>
        </div>

        {/* Right Panel - Image */}
        <div 
          className="w-full lg:w-1/2 bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-700 relative overflow-hidden lg:min-h-[488px]"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1519046904884-53103b34b206?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80')",
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          {/* Overlay for text readability */}
          <div className="absolute inset-0 bg-black/20" />
          <div className="absolute bottom-8 left-8 text-white">
            <p className="text-lg font-semibold mb-1 opacity-90">Discover Beauty</p>
            <p className="text-sm opacity-75">Nature awaits</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;