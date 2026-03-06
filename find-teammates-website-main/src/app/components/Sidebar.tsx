import { Link, useLocation, useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import {
  LayoutDashboard,
  Users,
  BookOpen,
  Sparkles,
  User,
  LogOut,
  Zap,
  MessageCircle,
  Trophy,
  Calendar,
  UserCircle,
  Bell,
  Bot,
  Settings,
  Code2,
  Video,
  Award,
  Rocket,
  Circle
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { cn } from '../lib/utils';
import { useLanguage } from '../contexts/LanguageContext';
import { useState } from 'react';

const navigation = [
  { nameKey: 'nav.findTeam', href: '/match', icon: Users },
  { nameKey: 'nav.dashboard', href: '/dashboard', icon: LayoutDashboard },
  { nameKey: 'nav.aiAssistant', href: '/ai-assistant', icon: Bot },
  { nameKey: 'nav.teams', href: '/teams', icon: UserCircle },
  { nameKey: 'nav.messages', href: '/messages', icon: MessageCircle, badge: 2 },
  { nameKey: 'nav.notifications', href: '/notifications', icon: Bell, badge: 3 },
  { nameKey: 'nav.events', href: '/events', icon: Calendar },
  { nameKey: 'nav.eventOrganizer', href: '/event-organizer', icon: Settings },
  { nameKey: 'nav.resources', href: '/resources', icon: BookOpen },
  { nameKey: 'nav.leaderboard', href: '/leaderboard', icon: Trophy },
  { nameKey: 'nav.projects', href: '/ai-tools', icon: Sparkles },
  { nameKey: 'nav.codeChallenge', href: '/code-challenge', icon: Code2 },
  { nameKey: 'nav.videoMeeting', href: '/meeting-room', icon: Video },
  { nameKey: 'nav.achievements', href: '/achievements', icon: Award },
  { nameKey: 'nav.superFeatures', href: '/super-features', icon: Rocket },
  { nameKey: 'nav.profile', href: '/profile', icon: User },
];

export function Sidebar({ forceExpanded = false }: { forceExpanded?: boolean }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { t } = useLanguage();
  const [isHovered, setIsHovered] = useState(false);

  const isExpanded = forceExpanded || isHovered;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const onlineUsers = [
    { id: 1, color: 'bg-blue-500', initials: 'AJ' },
    { id: 2, color: 'bg-green-500', initials: 'RK' },
    { id: 3, color: 'bg-purple-500', initials: 'SM' },
    { id: 4, color: 'bg-orange-500', initials: 'TD' },
  ];

  return (
    <motion.div
      initial={false}
      animate={{ width: isExpanded ? 280 : 88 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="flex h-screen flex-col border-r border-gray-200/50 bg-white/70 backdrop-blur-xl shadow-xl relative z-40 transition-shadow duration-300 group/sidebar overflow-hidden"
    >
      {/* Decorative Gradient Glow */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Logo Section */}
      <div className="flex h-20 items-center px-6">
        <div className="flex min-w-[40px] h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 shadow-lg shadow-blue-500/20">
          <Zap className="h-6 w-6 text-white" />
        </div>
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="ml-4 whitespace-nowrap"
            >
              <h1 className="text-xl font-bold text-gray-900 tracking-tight">CollabNest</h1>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">AI Intelligence Hub</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto no-scrollbar custom-scrollbar">
        {/* New Prompt Button */}
        <motion.button
          onClick={() => navigate('/ai-assistant')}
          className={cn(
            "w-full flex items-center h-12 rounded-xl border border-blue-100 bg-blue-50/50 text-blue-600 group hover:bg-blue-600 hover:text-white transition-all overflow-hidden",
            !isExpanded ? "justify-center px-0" : "px-4 mb-6"
          )}
        >
          <div className="flex min-w-[24px] items-center justify-center">
            <Sparkles className="h-5 w-5" />
          </div>
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="ml-3 flex flex-col items-start whitespace-nowrap"
              >
                <span className="text-xs font-black uppercase tracking-wider">New Prompt</span>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>

        {navigation.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.nameKey}
              to={item.href}
              className={cn(
                'group relative flex items-center h-12 rounded-xl transition-all duration-300 overflow-hidden',
                !isExpanded ? "justify-center px-0" : "px-4",
                isActive
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                  : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
              )}
            >
              <div className="flex min-w-[24px] items-center justify-center">
                <item.icon className={cn("h-5 w-5 transition-transform group-hover:scale-110", isActive ? "text-white" : "text-gray-400 group-hover:text-blue-600")} />
              </div>

              <AnimatePresence>
                {isExpanded && (
                  <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="ml-3 text-sm font-bold whitespace-nowrap tracking-tight"
                  >
                    {t(item.nameKey)}
                  </motion.span>
                )}
              </AnimatePresence>

              {item.badge && isExpanded && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="ml-auto flex h-5 min-w-[18px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-black text-white"
                >
                  {item.badge}
                </motion.span>
              )}

              {isActive && isExpanded && (
                <motion.div
                  layoutId="activeIndicator"
                  className="absolute right-2 h-1 w-1 rounded-full bg-white"
                />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Footer Section */}
      <div className={cn(
        "p-4 border-t border-gray-100 bg-white/50 backdrop-blur-md transition-all",
        !isExpanded && "flex flex-col items-center"
      )}>
        {/* Online Now Section */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6 px-2 overflow-hidden"
            >
              <div className="flex items-center justify-between mb-3 px-1">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Active Pilots</span>
                <div className="flex items-center gap-1">
                  <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-[9px] font-bold text-green-500">Online Now</span>
                </div>
              </div>
              <div className="flex -space-x-2">
                {onlineUsers.map((u) => (
                  <motion.div
                    key={u.id}
                    whileHover={{ y: -5, zIndex: 10 }}
                    className={cn(
                      "h-8 w-8 rounded-full border-2 border-white flex items-center justify-center text-[10px] font-black text-white cursor-pointer shadow-md",
                      u.color
                    )}
                  >
                    {u.initials}
                  </motion.div>
                ))}
                <div className="h-8 w-8 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-[10px] font-black text-gray-400">
                  +12
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Profile Card */}
        <div className={cn(
          "flex items-center rounded-xl transition-all cursor-pointer",
          isExpanded ? "bg-gray-50 border border-gray-100 p-3 w-full" : "w-12 h-12 justify-center"
        )}>
          <div className="relative">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 text-sm font-black text-white shadow-md">
              {user?.name.charAt(0).toUpperCase()}
            </div>
            <div className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full bg-green-500 border-2 border-white" />
          </div>

          <AnimatePresence mode="wait">
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="ml-3 flex-1 min-w-0"
              >
                <p className="text-sm font-bold text-gray-900 truncate uppercase tracking-tight">{user?.name}</p>
                <p className="text-[10px] text-gray-500 truncate font-semibold">{user?.college}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <AnimatePresence>
          {isExpanded && (
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              onClick={handleLogout}
              className="mt-3 flex w-full items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold text-red-500 hover:bg-red-50 transition-all"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}