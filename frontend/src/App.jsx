import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { IdentityProvider } from './hooks/useIdentity';
import { ToastProvider } from './components/Toast';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Discover from './pages/Discover';
import CreateProfile from './pages/CreateProfile';
import HelpWanted from './pages/HelpWanted';
import PostProject from './pages/PostProject';
import ProfileDetail from './pages/ProfileDetail';
import NoticeBoard from './pages/NoticeBoard';
import Leaderboard from './pages/Leaderboard';
import DevToolkit from './pages/DevToolkit';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import EditProfile from './pages/EditProfile';
import Showcase from './pages/Showcase';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <IdentityProvider>
      <ToastProvider>
        <BrowserRouter>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/discover" element={<Discover />} />
            <Route path="/create-profile" element={<CreateProfile />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/projects" element={<HelpWanted />} />
            <Route path="/post-project" element={<ProtectedRoute><PostProject /></ProtectedRoute>} />
            <Route path="/profile/:id" element={<ProfileDetail />} />
            <Route path="/edit-profile" element={<ProtectedRoute><EditProfile /></ProtectedRoute>} />
            <Route path="/notices" element={<NoticeBoard />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/toolkit" element={<DevToolkit />} />
            <Route path="/showcase" element={<Showcase />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </IdentityProvider>
  );
}
