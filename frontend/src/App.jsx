import { BrowserRouter as Router, Routes, Route, Outlet } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CreatePost from "./pages/CreatePost";
import BrowseCommunities from "./pages/BrowseCommunities";
import CommunityView from "./pages/CommunityView";
import Layout from "./components/Layout";
import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";
import Leaderboard from "./pages/Leaderboard";
import Settings from "./pages/Settings";

// 1. We create a wrapper that tells React Router where to put the page content inside your Layout
const LayoutWrapper = () => {
  return (
    <Layout>
      <Outlet /> 
    </Layout>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          
          {/* ========================================= */}
          {/* ZONE 1: PUBLIC ROUTES (No Layout/Sidebars) */}
          {/* ========================================= */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* ========================================= */}
          {/* ZONE 2: PROTECTED ROUTES (With Layout)     */}
          {/* ========================================= */}
          <Route element={<LayoutWrapper />}>
            <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
            <Route path="/explore" element={<ProtectedRoute><BrowseCommunities /></ProtectedRoute>} />
            <Route path="/community/:id" element={<ProtectedRoute><CommunityView /></ProtectedRoute>} />
            <Route path="/post" element={<ProtectedRoute><CreatePost /></ProtectedRoute>} />
            <Route path="/leaderboard" element={<ProtectedRoute><Leaderboard /></ProtectedRoute>} />
            
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/profile/edit" element={<ProtectedRoute><EditProfile /></ProtectedRoute>} />
            <Route path="/profile/:userId" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
          </Route>

        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;