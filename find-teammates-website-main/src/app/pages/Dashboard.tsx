import React from 'react';
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import {
  Users,
  BookOpen,
  TrendingUp,
  Target,
  ArrowUp,
  Activity,
  Award,
  Zap,
  Bell,
  Flame,
  Trophy,
  Calendar,
  MessageSquare,
  Sparkles,
  Code2,
  Brain,
  Rocket,
  Star,
  Gift,
  TrendingDown,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  BarChart3,
  PieChart as PieChartIcon,
  LayoutDashboard,
  Video,
  X,
  Mail,
  Phone,
  Building2,
  UserCircle2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { DashboardLayout } from '../components/DashboardLayout';
import { mockAnalytics } from '../lib/mockData';
import { useAuth } from '../contexts/AuthContext';
import { getUserStats, addActivity, initializeMockLeaderboard } from '../lib/userStats';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';

const COLORS = ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444', '#6366F1'];

export function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const analytics = mockAnalytics;
  const [activeTab, setActiveTab] = useState<'overview' | 'activity' | 'insights'>('overview');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const [selectedHackathon, setSelectedHackathon] = useState<any>(null);
  const [realHackathons, setRealHackathons] = useState<any[]>([]);
  const [realMatches, setRealMatches] = useState<any[]>([]);

  // Initialize mock leaderboard data and get user stats
  useEffect(() => {
    initializeMockLeaderboard();
  }, []);

  const [userStats, setUserStats] = useState(() =>
    getUserStats(user?.email || 'default', user?.name || 'User', user?.college || 'College')
  );

  useEffect(() => {
    const handleStatsUpdate = (e: any) => {
      if (e.detail?.userId === user?.email) {
        setUserStats(e.detail);

        // Refresh matches list from localStorage
        const stored = localStorage.getItem(`savedMatches_${user?.email}`);
        if (stored) {
          const parsed = JSON.parse(stored);
          setRecentMatches(parsed.slice(0, 4).map((m: any) => ({
            name: m.user.name,
            college: m.user.college,
            compatibility: m.compatibilityScore,
            avatar: m.user.name.charAt(0),
            image: m.user.profileImage,
            status: Math.random() > 0.5 ? 'online' : 'offline'
          })));
        }
      }
    };

    window.addEventListener('statsUpdated', handleStatsUpdate);
    return () => window.removeEventListener('statsUpdated', handleStatsUpdate);
  }, [user]);

  // Day Streak Logic - Track daily logins
  useEffect(() => {
    const today = new Date().toDateString();
    const lastLoginKey = `lastLogin_${user?.email}`;
    const streakKey = `streak_${user?.email}`;

    const lastLogin = localStorage.getItem(lastLoginKey);
    const savedStreak = parseInt(localStorage.getItem(streakKey) || '0');

    if (lastLogin !== today) {
      // Check if it's consecutive day
      const lastLoginDate = lastLogin ? new Date(lastLogin) : null;
      const todayDate = new Date(today);

      let newStreak = savedStreak;

      if (lastLoginDate) {
        const daysDiff = Math.floor((todayDate.getTime() - lastLoginDate.getTime()) / (1000 * 60 * 60 * 24));

        if (daysDiff === 1) {
          // Consecutive day - increment streak
          newStreak = savedStreak + 1;
        } else if (daysDiff > 1) {
          // Streak broken - reset to 1
          newStreak = 1;
        }
      } else {
        // First login
        newStreak = 1;
      }

      localStorage.setItem(lastLoginKey, today);
      localStorage.setItem(streakKey, newStreak.toString());

      // Update userStats with new streak
      setUserStats(prev => ({ ...prev, streak: newStreak }));
    } else {
      // Same day login - load saved streak
      setUserStats(prev => ({ ...prev, streak: savedStreak || 1 }));
    }
  }, [user]);

  // Handle registration modal
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    college: user?.college || '',
    teamSize: '1',
    experience: 'beginner'
  });

  const handleRegistration = (hackathon: any) => {
    setSelectedHackathon(hackathon);
    setShowRegistrationModal(true);
  };

  const handleSubmitRegistration = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Successfully registered for ${selectedHackathon?.name}! 🎉\n\nWe'll send confirmation details to ${formData.email}`);
    setShowRegistrationModal(false);
    setSelectedHackathon(null);
  };

  const learningStreak = userStats.streak;

  const statCards = [
    {
      title: 'Total Matches',
      value: userStats.matches,
      change: '+12%',
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      trend: 'up'
    },
    {
      title: 'Avg Compatibility',
      value: `${analytics.avgCompatibility}%`,
      change: '+5%',
      icon: Target,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      trend: 'up'
    },
    {
      title: 'Resources Saved',
      value: analytics.resourcesSaved,
      change: '+8',
      icon: BookOpen,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      trend: 'up'
    },
    {
      title: 'Skills Learned',
      value: analytics.skillsLearned,
      change: '+3',
      icon: Award,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      trend: 'up'
    },
  ];

  const trendingSkills = [
    { name: 'AI/ML', growth: '+45%', demand: 'Very High', color: 'bg-red-500' },
    { name: 'React', growth: '+32%', demand: 'High', color: 'bg-blue-500' },
    { name: 'Python', growth: '+28%', demand: 'High', color: 'bg-green-500' },
    { name: 'TypeScript', growth: '+25%', demand: 'High', color: 'bg-purple-500' },
    { name: 'Next.js', growth: '+22%', demand: 'Medium', color: 'bg-yellow-500' },
  ];

  const upcomingHackathons = [
    {
      name: 'DevFest 2026',
      date: 'Mar 15-17',
      prize: '$50,000',
      participants: '2.5K+',
      status: 'Open',
      color: 'blue'
    },
    {
      name: 'AI Innovation Challenge',
      date: 'Mar 22-24',
      prize: '$100,000',
      participants: '5K+',
      status: 'Open',
      color: 'purple'
    },
    {
      name: 'Web3 Builders',
      date: 'Apr 5-7',
      prize: '$75,000',
      participants: '3K+',
      status: 'Soon',
      color: 'green'
    },
  ];

  const achievements = [
    { title: 'First Match', description: 'Found your first teammate', icon: Users, unlocked: true },
    { title: 'Social Butterfly', description: 'Connected with 10+ developers', icon: Sparkles, unlocked: true },
    { title: 'Knowledge Seeker', description: 'Saved 20+ resources', icon: BookOpen, unlocked: true },
    { title: 'Team Builder', description: 'Created your first team', icon: Trophy, unlocked: false },
    { title: 'AI Expert', description: 'Generated 5+ project ideas', icon: Brain, unlocked: false },
    { title: 'Skill Master', description: 'Learned 15+ new skills', icon: Award, unlocked: false },
  ];

  const notifications = [
    {
      type: 'match',
      message: 'You have 3 new potential teammates!',
      time: '5 min ago',
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      unread: true
    },
    {
      type: 'resource',
      message: 'New resource: "Advanced React Patterns"',
      time: '1 hour ago',
      icon: BookOpen,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      unread: true
    },
    {
      type: 'achievement',
      message: 'Achievement unlocked: Social Butterfly 🎉',
      time: '2 hours ago',
      icon: Trophy,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      unread: false
    },
    {
      type: 'hackathon',
      message: 'DevFest 2026 registration closing in 3 days',
      time: '5 hours ago',
      icon: Calendar,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      unread: false
    },
  ];

  const [recentMatches, setRecentMatches] = useState<any[]>(() => {
    const stored = localStorage.getItem(`savedMatches_${user?.email}`);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Map MatchType to the format expected by the dashboard list
      return parsed.slice(0, 4).map((m: any) => ({
        name: m.user.name,
        college: m.user.college,
        compatibility: m.compatibilityScore,
        avatar: m.user.name.charAt(0),
        image: m.user.profileImage,
        status: Math.random() > 0.5 ? 'online' : 'offline' // Status is simulated online/offline
      }));
    }
    return [
      { name: 'Priya Patel', college: 'BITS Pilani', compatibility: 92, avatar: 'P', status: 'online', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=256&h=256&auto=format&fit=crop' },
      { name: 'Rahul Verma', college: 'NIT Trichy', compatibility: 88, avatar: 'R', status: 'offline', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=256&h=256&auto=format&fit=crop' },
      { name: 'Sneha Gupta', college: 'IIT Bombay', compatibility: 85, avatar: 'S', status: 'online', image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=256&h=256&auto=format&fit=crop' },
      { name: 'Karthik Reddy', college: 'VIT Vellore', compatibility: 82, avatar: 'K', status: 'offline', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=256&h=256&auto=format&fit=crop' },
    ];
  });

  const skillProgressData = [
    { skill: 'React', current: 85, target: 100 },
    { skill: 'TypeScript', current: 70, target: 100 },
    { skill: 'Node.js', current: 75, target: 100 },
    { skill: 'Python', current: 60, target: 100 },
  ];

  return (
    <DashboardLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-4xl font-black text-gray-900 tracking-tight">
              Welcome back, {user?.name.split(' ')[0]} ⚡️
            </h1>
            <p className="mt-2 text-gray-600">
              Here's your collaboration intelligence dashboard
            </p>
          </div>

          {/* Learning Streak & Notification Bell */}
          <div className="flex items-center gap-3">
            {/* Notification Bell */}
            <div className="relative">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative"
              >
                <Bell className="h-5 w-5" />
                {notifications.filter(n => n.unread).length > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center font-bold">
                    {notifications.filter(n => n.unread).length}
                  </span>
                )}
              </Button>

              {/* Notification Dropdown */}
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 top-full mt-2 w-80 bg-white rounded-lg shadow-xl border-2 border-blue-200 z-50"
                >
                  <div className="p-4 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-gray-900">Notifications</h3>
                      <Badge variant="warning" className="text-xs">
                        {notifications.filter(n => n.unread).length}
                      </Badge>
                    </div>
                  </div>
                  <div className="max-h-96 overflow-y-auto p-2">
                    {notifications.map((notification, index) => (
                      <div
                        key={index}
                        className={`flex gap-3 p-3 rounded-lg mb-2 ${notification.unread
                          ? 'bg-blue-50 border border-blue-200'
                          : 'bg-white border border-gray-200'
                          }`}
                      >
                        <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${notification.bgColor} flex-shrink-0`}>
                          <notification.icon className={`h-5 w-5 ${notification.color}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-900">{notification.message}</p>
                          <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                        </div>
                        {notification.unread && (
                          <div className="h-2 w-2 rounded-full bg-blue-600 flex-shrink-0 mt-2" />
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="p-3 border-t border-gray-200">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full"
                      onClick={() => {
                        setShowNotifications(false);
                        navigate('/notifications');
                      }}
                    >
                      View All Notifications
                    </Button>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Day Streak */}
            <motion.div whileHover={{ scale: 1.05 }}>
              <Card className="bg-gradient-to-r from-orange-500 to-red-500 border-none premium-shadow">
                <CardContent className="p-4 px-6">
                  <div className="flex items-center gap-3 text-white">
                    <Flame className="h-8 w-8 fill-white/20" />
                    <div>
                      <div className="text-2xl font-black">{learningStreak}</div>
                      <div className="text-[10px] font-black uppercase tracking-widest opacity-80">Day Streak 🔥</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6 flex gap-2">
          {(['overview', 'activity', 'insights'] as const).map((tab) => (
            <Button
              key={tab}
              variant={activeTab === tab ? 'default' : 'outline'}
              onClick={() => setActiveTab(tab)}
              className="capitalize"
            >
              {tab === 'overview' && <LayoutDashboard className="h-4 w-4 mr-2" />}
              {tab === 'activity' && <Activity className="h-4 w-4 mr-2" />}
              {tab === 'insights' && <TrendingUp className="h-4 w-4 mr-2" />}
              {tab}
            </Button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {/* Stats Grid */}
            <div className="grid gap-4 md:gap-6 grid-cols-2 lg:grid-cols-4 mb-8">
              {statCards.map((stat, index) => (
                <motion.div
                  key={stat.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -5, scale: 1.02 }}
                >
                  <Card className="premium-shadow border-none bg-white/80 backdrop-blur-sm cursor-pointer"
                    onClick={() => alert(`Viewing details for: ${stat.title}`)}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.bgColor}`}>
                          <stat.icon className={`h-6 w-6 ${stat.color}`} />
                        </div>
                        <div className="flex items-center gap-1 text-sm font-black text-green-600">
                          <ArrowUp className="h-4 w-4" />
                          {stat.change}
                        </div>
                      </div>
                      <div className="text-3xl font-black text-gray-900 tracking-tight">{stat.value}</div>
                      <div className="text-[10px] uppercase font-black tracking-widest text-gray-400 mt-1">{stat.title}</div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Main Content Grid */}
            <div className="grid gap-6 lg:grid-cols-3 mb-8">
              {/* Left Column - 2 cols */}
              <div className="lg:col-span-2 space-y-6">
                {/* Charts Row */}
                <div className="grid gap-6 lg:grid-cols-2">
                  {/* Weekly Activity Chart */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                  >
                    <Card className="premium-shadow border-none bg-white/80 backdrop-blur-sm">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-base">
                          <Activity className="h-5 w-5 text-blue-600" />
                          Weekly Activity
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ResponsiveContainer width="100%" height={250}>
                          <AreaChart data={analytics.weeklyActivity}>
                            <defs>
                              <linearGradient id="colorMatches" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                              </linearGradient>
                              <linearGradient id="colorResources" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                            <XAxis dataKey="day" stroke="#6B7280" style={{ fontSize: '12px' }} />
                            <YAxis stroke="#6B7280" style={{ fontSize: '12px' }} />
                            <Tooltip
                              contentStyle={{
                                backgroundColor: 'white',
                                border: '1px solid #E5E7EB',
                                borderRadius: '8px',
                              }}
                            />
                            <Area
                              type="monotone"
                              dataKey="matches"
                              stroke="#3B82F6"
                              strokeWidth={2}
                              fillOpacity={1}
                              fill="url(#colorMatches)"
                              name="Matches"
                            />
                            <Area
                              type="monotone"
                              dataKey="resources"
                              stroke="#8B5CF6"
                              strokeWidth={2}
                              fillOpacity={1}
                              fill="url(#colorResources)"
                              name="Resources"
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>
                  </motion.div>

                  {/* Skill Distribution Chart */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                  >
                    <Card className="premium-shadow border-none bg-white/80 backdrop-blur-sm">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-base">
                          <TrendingUp className="h-5 w-5 text-purple-600" />
                          Skill Distribution
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ResponsiveContainer width="100%" height={250}>
                          <PieChart>
                            <Pie
                              data={analytics.skillDistribution}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              label={(entry) => `${entry.skill}: ${((entry.count / analytics.skillDistribution.reduce((sum, item) => sum + item.count, 0)) * 100).toFixed(0)}%`}
                              outerRadius={80}
                              fill="#8884d8"
                              dataKey="count"
                              nameKey="skill"
                            >
                              {analytics.skillDistribution.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip />
                          </PieChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>
                  </motion.div>
                </div>

                {/* Trending Skills */}
                <Card className="premium-shadow border-none bg-gradient-to-br from-orange-50/50 to-yellow-50/50 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-orange-600" />
                      Trending Skills in Your Network
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {trendingSkills.map((skill, index) => (
                        <motion.div
                          key={skill.name}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-center gap-3 bg-white rounded-lg p-3 border border-orange-200"
                        >
                          <div className={`h-2 w-2 rounded-full ${skill.color}`} />
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-gray-900">{skill.name}</span>
                              <Badge variant="secondary" className="text-xs">
                                {skill.demand}
                              </Badge>
                            </div>
                          </div>
                          <div className="flex items-center gap-1 text-sm font-medium text-green-600">
                            <ArrowUp className="h-4 w-4" />
                            {skill.growth}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                    <Button
                      className="w-full mt-4"
                      variant="outline"
                      onClick={() => navigate('/ai-tools')}
                    >
                      <Sparkles className="h-4 w-4 mr-2" />
                      Get AI Skill Recommendations
                    </Button>
                  </CardContent>
                </Card>

                {/* Upcoming Hackathons */}
                <Card className="premium-shadow border-none bg-gradient-to-br from-purple-50/50 to-pink-50/50 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-purple-600" />
                      Upcoming Hackathons
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {upcomingHackathons.map((hackathon, index) => (
                        <motion.div
                          key={hackathon.name}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="bg-white rounded-lg p-4 border border-purple-200"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h4 className="font-semibold text-gray-900">{hackathon.name}</h4>
                              <p className="text-sm text-gray-600 flex items-center gap-2 mt-1">
                                <Clock className="h-3 w-3" />
                                {hackathon.date}
                              </p>
                            </div>
                            <Badge className={`bg-${hackathon.color}-100 text-${hackathon.color}-700`}>
                              {hackathon.status}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                            <span className="flex items-center gap-1">
                              <Trophy className="h-4 w-4 text-yellow-600" />
                              {hackathon.prize}
                            </span>
                            <span className="flex items-center gap-1">
                              <Users className="h-4 w-4 text-blue-600" />
                              {hackathon.participants}
                            </span>
                          </div>
                          <Button size="sm" className="w-full" onClick={() => handleRegistration(hackathon)}>
                            <Rocket className="h-3 w-3 mr-2" />
                            Register Now
                          </Button>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Skill Progress */}
                <Card className="premium-shadow border-none bg-white/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5 text-blue-600" />
                      Your Skill Progress
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {skillProgressData.map((item) => (
                        <div key={item.skill}>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-700">{item.skill}</span>
                            <span className="text-sm font-semibold text-gray-900">{item.current}%</span>
                          </div>
                          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${item.current}%` }}
                              transition={{ duration: 1, delay: 0.2 }}
                              className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Right Column - 1 col */}
              <div className="space-y-6">
                {/* Recent Matches */}
                <Card className="premium-shadow border-none bg-white/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Users className="h-5 w-5 text-green-600" />
                      Recent Matches
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {recentMatches.map((match, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                        >
                          <div className="relative">
                            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold overflow-hidden border-2 border-white shadow-sm">
                              {match.image ? (
                                <img src={match.image} alt={match.name} className="w-full h-full object-cover" />
                              ) : (
                                match.avatar
                              )}
                            </div>
                            <div className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white ${match.status === 'online' ? 'bg-green-500' : 'bg-gray-400'
                              }`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-sm text-gray-900 truncate">{match.name}</div>
                            <div className="text-xs text-gray-600 truncate">{match.college}</div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-bold text-green-600">{match.compatibility}%</div>
                            <div className="text-xs text-gray-500">match</div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                    <Button variant="outline" className="w-full mt-4">
                      View All Matches
                    </Button>
                  </CardContent>
                </Card>

                {/* Achievements */}
                <Card className="premium-shadow border-none bg-gradient-to-br from-yellow-50/80 to-orange-50/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Trophy className="h-5 w-5 text-yellow-600" />
                      Achievements
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-3">
                      {achievements.map((achievement, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.1 }}
                          className={`relative flex flex-col items-center justify-center p-3 rounded-lg border-2 ${achievement.unlocked
                            ? 'bg-white border-yellow-300'
                            : 'bg-gray-100 border-gray-300 opacity-50'
                            }`}
                          title={achievement.description}
                        >
                          <achievement.icon className={`h-6 w-6 mb-1 ${achievement.unlocked ? 'text-yellow-600' : 'text-gray-400'
                            }`} />
                          <span className="text-xs text-center font-medium text-gray-700 line-clamp-2">
                            {achievement.title}
                          </span>
                          {achievement.unlocked && (
                            <div className="absolute -top-1 -right-1">
                              <CheckCircle2 className="h-4 w-4 text-green-600 bg-white rounded-full" />
                            </div>
                          )}
                        </motion.div>
                      ))}
                    </div>
                    <div className="mt-4 text-center">
                      <p className="text-sm text-gray-600">
                        <span className="font-bold text-gray-900">3/6</span> achievements unlocked
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* AI Recommendation Banner */}
                <Card className="bg-gradient-to-r from-blue-600 to-purple-600 border-0 text-white">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-3 mb-3">
                      <Brain className="h-8 w-8 flex-shrink-0" />
                      <div>
                        <h3 className="font-bold mb-1">AI Powered Insights</h3>
                        <p className="text-sm text-blue-100">
                          Get personalized project ideas and skill recommendations
                        </p>
                      </div>
                    </div>
                    <Button
                      className="w-full bg-white text-blue-600 hover:bg-gray-100"
                      onClick={() => navigate('/ai-tools')}
                    >
                      <Sparkles className="h-4 w-4 mr-2" />
                      Get AI Skill Recommendations
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </motion.div>
        )}

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-blue-600" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 md:gap-4 grid-cols-2 lg:grid-cols-4">
                <a
                  href="/match"
                  className="flex items-center gap-3 md:gap-4 rounded-lg border-2 border-gray-200 p-3 md:p-4 transition-all hover:border-blue-600 hover:bg-blue-50 hover:scale-105"
                >
                  <div className="flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                    <Users className="h-5 w-5 md:h-6 md:w-6" />
                  </div>
                  <div>
                    <div className="font-bold text-xs md:text-sm text-gray-900">Find Teammates</div>
                    <div className="text-[10px] md:text-sm text-gray-600">Browse matches</div>
                  </div>
                </a>

                <a
                  href="/resources"
                  className="flex items-center gap-3 md:gap-4 rounded-lg border-2 border-gray-200 p-3 md:p-4 transition-all hover:border-purple-600 hover:bg-purple-50 hover:scale-105"
                >
                  <div className="flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-lg bg-purple-100 text-purple-600">
                    <BookOpen className="h-5 w-5 md:h-6 md:w-6" />
                  </div>
                  <div>
                    <div className="font-bold text-xs md:text-sm text-gray-900">Resources</div>
                    <div className="text-[10px] md:text-sm text-gray-600">Learn skills</div>
                  </div>
                </a>

                <a
                  href="/ai-tools"
                  className="flex items-center gap-3 md:gap-4 rounded-lg border-2 border-gray-200 p-3 md:p-4 transition-all hover:border-green-600 hover:bg-green-50 hover:scale-105"
                >
                  <div className="flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-lg bg-green-100 text-green-600">
                    <Sparkles className="h-5 w-5 md:h-6 md:w-6" />
                  </div>
                  <div>
                    <div className="font-bold text-xs md:text-sm text-gray-900">AI Tools</div>
                    <div className="text-[10px] md:text-sm text-gray-600">Get ideas</div>
                  </div>
                </a>

                <a
                  href="/code-challenge"
                  className="flex items-center gap-3 md:gap-4 rounded-lg border-2 border-gray-200 p-3 md:p-4 transition-all hover:border-indigo-600 hover:bg-indigo-50 hover:scale-105"
                >
                  <div className="flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600">
                    <Code2 className="h-5 w-5 md:h-6 md:w-6" />
                  </div>
                  <div>
                    <div className="font-bold text-xs md:text-sm text-gray-900">Code Challenge</div>
                    <div className="text-[10px] md:text-sm text-gray-600">Practice coding</div>
                  </div>
                </a>

                <a
                  href="/meeting-room"
                  className="flex items-center gap-3 md:gap-4 rounded-lg border-2 border-gray-200 p-3 md:p-4 transition-all hover:border-pink-600 hover:bg-pink-50 hover:scale-105"
                >
                  <div className="flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-lg bg-pink-100 text-pink-600">
                    <Video className="h-5 w-5 md:h-6 md:w-6" />
                  </div>
                  <div>
                    <div className="font-bold text-xs md:text-sm text-gray-900">Meeting Room</div>
                    <div className="text-[10px] md:text-sm text-gray-600">Join calls</div>
                  </div>
                </a>

                <a
                  href="/achievements"
                  className="flex items-center gap-3 md:gap-4 rounded-lg border-2 border-gray-200 p-3 md:p-4 transition-all hover:border-yellow-600 hover:bg-yellow-50 hover:scale-105"
                >
                  <div className="flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-lg bg-yellow-100 text-yellow-600">
                    <Trophy className="h-5 w-5 md:h-6 md:w-6" />
                  </div>
                  <div>
                    <div className="font-bold text-xs md:text-sm text-gray-900">Achievements</div>
                    <div className="text-[10px] md:text-sm text-gray-600">Track progress</div>
                  </div>
                </a>

                <a
                  href="/super-features"
                  className="flex items-center gap-3 md:gap-4 rounded-lg border-2 border-gray-200 p-3 md:p-4 transition-all hover:border-red-600 hover:bg-red-50 hover:scale-105"
                >
                  <div className="flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-lg bg-red-100 text-red-600">
                    <Rocket className="h-5 w-5 md:h-6 md:w-6" />
                  </div>
                  <div>
                    <div className="font-bold text-xs md:text-sm text-gray-900">Super Features</div>
                    <div className="text-[10px] md:text-sm text-gray-600">Explore all</div>
                  </div>
                </a>

                <a
                  href="/profile"
                  className="flex items-center gap-3 md:gap-4 rounded-lg border-2 border-gray-200 p-3 md:p-4 transition-all hover:border-orange-600 hover:bg-orange-50 hover:scale-105"
                >
                  <div className="flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-lg bg-orange-100 text-orange-600">
                    <Award className="h-5 w-5 md:h-6 md:w-6" />
                  </div>
                  <div>
                    <div className="font-bold text-xs md:text-sm text-gray-900">Profile</div>
                    <div className="text-[10px] md:text-sm text-gray-600">Update info</div>
                  </div>
                </a>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Activity Tab */}
        {activeTab === 'activity' && (
          <motion.div
            key="activity"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-blue-600" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { type: 'match', text: 'You matched with Priya Patel', time: '2 hours ago', icon: Users, color: 'blue' },
                    { type: 'resource', text: 'Saved "React Hooks Complete Guide"', time: '5 hours ago', icon: BookOpen, color: 'green' },
                    { type: 'achievement', text: 'Unlocked "Social Butterfly" achievement', time: '1 day ago', icon: Trophy, color: 'yellow' },
                    { type: 'skill', text: 'Added "TypeScript" to your skills', time: '2 days ago', icon: Code2, color: 'purple' },
                    { type: 'team', text: 'Joined team "AI Innovators"', time: '3 days ago', icon: Users, color: 'orange' },
                  ].map((activity, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start gap-4 p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer"
                      onClick={() => alert(`View details for: ${activity.text}`)}
                    >
                      <div className={`flex h-10 w-10 items-center justify-center rounded-lg bg-${activity.color}-100 flex-shrink-0`}>
                        <activity.icon className={`h-5 w-5 text-${activity.color}-600`} />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{activity.text}</p>
                        <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Activity Charts */}
            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <BarChart3 className="h-5 w-5 text-purple-600" />
                    Daily Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={analytics.weeklyActivity}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                      <XAxis dataKey="day" stroke="#6B7280" style={{ fontSize: '12px' }} />
                      <YAxis stroke="#6B7280" style={{ fontSize: '12px' }} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'white',
                          border: '1px solid #E5E7EB',
                          borderRadius: '8px',
                        }}
                      />
                      <Legend />
                      <Bar dataKey="matches" fill="#3B82F6" name="Matches" />
                      <Bar dataKey="resources" fill="#8B5CF6" name="Resources" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Clock className="h-5 w-5 text-orange-600" />
                    Time Spent
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { activity: 'Finding Teammates', hours: 5.2, percentage: 35 },
                      { activity: 'Learning Resources', hours: 4.8, percentage: 32 },
                      { activity: 'AI Tools', hours: 3.5, percentage: 23 },
                      { activity: 'Profile Updates', hours: 1.5, percentage: 10 },
                    ].map((item, index) => (
                      <div key={index}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-700">{item.activity}</span>
                          <span className="text-sm font-semibold text-gray-900">{item.hours}h</span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${item.percentage}%` }}
                            transition={{ duration: 1, delay: index * 0.1 }}
                            className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        )}

        {/* Insights Tab */}
        {activeTab === 'insights' && (
          <motion.div
            key="insights"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {/* Insights Cards */}
            <div className="grid gap-6 md:grid-cols-3">
              <Card className="border-2 border-green-200 bg-green-50">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="h-12 w-12 rounded-lg bg-green-100 flex items-center justify-center">
                      <TrendingUp className="h-6 w-6 text-green-600" />
                    </div>
                    <CheckCircle2 className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="font-bold text-lg text-gray-900 mb-2">Great Progress!</h3>
                  <p className="text-sm text-gray-600">
                    You're 35% more active this week compared to last week.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 border-blue-200 bg-blue-50">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center">
                      <Target className="h-6 w-6 text-blue-600" />
                    </div>
                    <AlertCircle className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="font-bold text-lg text-gray-900 mb-2">Skill Opportunity</h3>
                  <p className="text-sm text-gray-600">
                    Learning Docker can boost your profile ranking by 15%.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 border-purple-200 bg-purple-50">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="h-12 w-12 rounded-lg bg-purple-100 flex items-center justify-center">
                      <Users className="h-6 w-6 text-purple-600" />
                    </div>
                    <Star className="h-6 w-6 text-purple-600" />
                  </div>
                  <h3 className="font-bold text-lg text-gray-900 mb-2">Perfect Matches</h3>
                  <p className="text-sm text-gray-600">
                    5 new developers with 90%+ compatibility available now!
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Detailed Insights */}
            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5 text-purple-600" />
                    AI Recommendations
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    {
                      title: 'Connect with Full-Stack Developers',
                      description: 'Based on your skills, collaborating with full-stack developers can help you build complete projects.',
                      action: 'Find Matches',
                    },
                    {
                      title: 'Learn Next.js',
                      description: 'Next.js is trending in your network and complements your React skills perfectly.',
                      action: 'View Resources',
                    },
                    {
                      title: 'Join Upcoming Hackathons',
                      description: 'DevFest 2026 aligns with your skill set. Early registration recommended.',
                      action: 'Register Now',
                    },
                  ].map((rec, index) => (
                    <div key={index} className="p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                      <h4 className="font-semibold text-gray-900 mb-1">{rec.title}</h4>
                      <p className="text-sm text-gray-600 mb-3">{rec.description}</p>
                      <Button size="sm" variant="outline">{rec.action}</Button>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChartIcon className="h-5 w-5 text-blue-600" />
                    Skill Gap Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'Proficient', value: 60, fill: '#10B981' },
                          { name: 'Intermediate', value: 25, fill: '#F59E0B' },
                          { name: 'To Learn', value: 15, fill: '#EF4444' },
                        ]}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={100}
                        dataKey="value"
                      >
                        <Cell fill="#10B981" />
                        <Cell fill="#F59E0B" />
                        <Cell fill="#EF4444" />
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-green-500" />
                      <span className="text-sm text-gray-700">Proficient (6 skills)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-orange-500" />
                      <span className="text-sm text-gray-700">Intermediate (3 skills)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-red-500" />
                      <span className="text-sm text-gray-700">To Learn (2 skills)</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Performance Trends */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  Your Growth Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-4">
                  {[
                    { label: 'Profile Views', value: '234', change: '+18%', trend: 'up' },
                    { label: 'Match Rate', value: '87%', change: '+12%', trend: 'up' },
                    { label: 'Response Time', value: '2.3h', change: '-23%', trend: 'down' },
                    { label: 'Skills Added', value: '8', change: '+3', trend: 'up' },
                  ].map((stat, index) => (
                    <div key={index} className="p-4 rounded-lg border border-gray-200">
                      <div className="text-sm text-gray-600 mb-1">{stat.label}</div>
                      <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
                      <div className={`text-sm font-medium flex items-center gap-1 ${stat.trend === 'up' ? 'text-green-600' : 'text-blue-600'
                        }`}>
                        {stat.trend === 'up' ? (
                          <ArrowUp className="h-4 w-4" />
                        ) : (
                          <TrendingDown className="h-4 w-4" />
                        )}
                        {stat.change}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </motion.div>

      {/* Registration Modal */}
      <Dialog open={showRegistrationModal} onOpenChange={setShowRegistrationModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Rocket className="h-5 w-5 text-purple-600" />
              Register for {selectedHackathon?.name}
            </DialogTitle>
            <DialogDescription>
              Confirm your details to register for this event. We'll pre-fill your profile information.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmitRegistration} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="college">College/University</Label>
              <Input
                id="college"
                value={formData.college}
                onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="teamSize">Experience Level</Label>
                <select
                  id="experience"
                  className="w-full p-2 border rounded-md text-sm"
                  value={formData.experience}
                  onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="teamSize">Phone Number</Label>
                <Input
                  id="phone"
                  placeholder="+91..."
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                />
              </div>
            </div>
            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => setShowRegistrationModal(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-purple-600 hover:bg-purple-700">
                Confirm Registration
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}