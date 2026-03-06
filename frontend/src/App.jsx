import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { IdentityProvider } from './hooks/useIdentity';
import Navbar from './components/Navbar';
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

export default function App() {
  return (
    <IdentityProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/discover" element={<Discover />} />
          <Route path="/create-profile" element={<CreateProfile />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/projects" element={<HelpWanted />} />
          <Route path="/post-project" element={<PostProject />} />
          <Route path="/profile/:id" element={<ProfileDetail />} />
          <Route path="/notices" element={<NoticeBoard />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/toolkit" element={<DevToolkit />} />
        </Routes>
      </BrowserRouter>
    </IdentityProvider>
  );
}
