import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Discover from './pages/Discover';
import CreateProfile from './pages/CreateProfile';
import HelpWanted from './pages/HelpWanted';
import PostProject from './pages/PostProject';
import ProfileDetail from './pages/ProfileDetail';

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/discover" element={<Discover />} />
        <Route path="/create-profile" element={<CreateProfile />} />
        <Route path="/projects" element={<HelpWanted />} />
        <Route path="/post-project" element={<PostProject />} />
        <Route path="/profile/:id" element={<ProfileDetail />} />
      </Routes>
    </BrowserRouter>
  );
}
