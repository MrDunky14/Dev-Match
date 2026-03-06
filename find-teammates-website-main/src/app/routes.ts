import { createBrowserRouter, Navigate } from 'react-router';
import { Landing } from './pages/Landing';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { Dashboard } from './pages/Dashboard';
import { Profile } from './pages/Profile';
import { Match } from './pages/Match';
import { Resources } from './pages/Resources';
import { AITools } from './pages/AITools';
import { Messages } from './pages/Messages';
import { Leaderboard } from './pages/Leaderboard';
import { Events } from './pages/Events';
import { Teams } from './pages/Teams';
import { Notifications } from './pages/Notifications';
import { AIAssistant } from './pages/AIAssistant';
import { EventOrganizer } from './pages/EventOrganizer';
import { CodeChallenge } from './pages/CodeChallenge';
import { MeetingRoom } from './pages/MeetingRoom';
import { Achievements } from './pages/Achievements';
import { SuperFeatures } from './pages/SuperFeatures';

// NotFound component for 404 pages
const NotFound = () => {
  window.location.href = '/';
  return null;
};

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Landing,
  },
  {
    path: '/login',
    Component: Login,
  },
  {
    path: '/signup',
    Component: Signup,
  },
  {
    path: '/dashboard',
    Component: Dashboard,
  },
  {
    path: '/profile',
    Component: Profile,
  },
  {
    path: '/match',
    Component: Match,
  },
  {
    path: '/resources',
    Component: Resources,
  },
  {
    path: '/ai-tools',
    Component: AITools,
  },
  {
    path: '/messages',
    Component: Messages,
  },
  {
    path: '/leaderboard',
    Component: Leaderboard,
  },
  {
    path: '/events',
    Component: Events,
  },
  {
    path: '/event-organizer',
    Component: EventOrganizer,
  },
  {
    path: '/teams',
    Component: Teams,
  },
  {
    path: '/notifications',
    Component: Notifications,
  },
  {
    path: '/ai-assistant',
    Component: AIAssistant,
  },
  {
    path: '/code-challenge',
    Component: CodeChallenge,
  },
  {
    path: '/meeting-room',
    Component: MeetingRoom,
  },
  {
    path: '/achievements',
    Component: Achievements,
  },
  {
    path: '/super-features',
    Component: SuperFeatures,
  },
  {
    path: '*',
    Component: NotFound,
  },
]);