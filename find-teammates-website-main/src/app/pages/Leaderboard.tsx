import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Trophy, 
  Medal, 
  Award,
  TrendingUp,
  Users,
  Code2,
  Target,
  Flame,
  Star,
  Crown,
  Sparkles,
  ChevronUp,
  ChevronDown
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { DashboardLayout } from '../components/DashboardLayout';
import { useAuth } from '../contexts/AuthContext';
import { generateLeaderboard, getUserStats, initializeMockLeaderboard, type LeaderboardEntry } from '../lib/userStats';

export function Leaderboard() {
  const { user } = useAuth();
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'alltime'>('alltime');
  const [category, setCategory] = useState<'all' | 'matches' | 'projects' | 'streak'>('all');
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);
  const [currentUserRank, setCurrentUserRank] = useState<number | null>(null);

  // Initialize and load leaderboard
  useEffect(() => {
    initializeMockLeaderboard();
    loadLeaderboard();
  }, [timeRange, category]);

  useEffect(() => {
    const handleStatsUpdate = () => {
      loadLeaderboard();
    };

    window.addEventListener('statsUpdated', handleStatsUpdate);
    window.addEventListener('storage', handleStatsUpdate);

    return () => {
      window.removeEventListener('statsUpdated', handleStatsUpdate);
      window.removeEventListener('storage', handleStatsUpdate);
    };
  }, [timeRange, category]);

  const loadLeaderboard = () => {
    const data = generateLeaderboard(timeRange, category);
    setLeaderboardData(data);

    // Find current user's rank
    const userRank = data.findIndex(entry => entry.userId === user?.email);
    setCurrentUserRank(userRank >= 0 ? userRank + 1 : null);
  };

  const getRankColor = (rank: number) => {
    if (rank === 1) return 'from-yellow-400 to-yellow-600';
    if (rank === 2) return 'from-gray-300 to-gray-500';
    if (rank === 3) return 'from-orange-400 to-orange-600';
    return 'from-blue-400 to-blue-600';
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="h-5 w-5 text-yellow-500" />;
    if (rank === 2) return <Medal className="h-5 w-5 text-gray-400" />;
    if (rank === 3) return <Medal className="h-5 w-5 text-orange-500" />;
    return <span className="text-sm font-bold text-gray-600">#{rank}</span>;
  };

  const getCategoryValue = (entry: LeaderboardEntry) => {
    if (category === 'matches') return entry.matches;
    if (category === 'projects') return entry.projects;
    if (category === 'streak') return entry.streak;
    return entry.points;
  };

  const getCategoryLabel = () => {
    if (category === 'matches') return 'Matches';
    if (category === 'projects') return 'Projects';
    if (category === 'streak') return 'Day Streak';
    return 'Points';
  };

  return (
    <DashboardLayout>
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Trophy className="h-8 w-8 text-yellow-600" />
          <h1 className="text-3xl font-bold text-gray-900">Leaderboard</h1>
        </div>
        <p className="text-gray-600">
          Top performers in the CollabNest community
        </p>
      </div>

      {/* Current User Stats Banner */}
      {currentUserRank && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <Card className="bg-gradient-to-r from-purple-600 to-blue-600 border-0 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-100 mb-1">Your Current Rank</p>
                  <div className="flex items-center gap-4">
                    <div className="text-4xl font-bold">#{currentUserRank}</div>
                    <div>
                      <p className="text-lg font-semibold">{user?.name}</p>
                      <p className="text-sm text-blue-100">{user?.college}</p>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-blue-100 mb-1">{getCategoryLabel()}</p>
                  <p className="text-3xl font-bold">{getCategoryValue(leaderboardData[currentUserRank - 1])}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Filters */}
      <div className="mb-6 flex flex-wrap gap-4">
        <div className="flex gap-2">
          <Button
            variant={timeRange === 'week' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTimeRange('week')}
          >
            This Week
          </Button>
          <Button
            variant={timeRange === 'month' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTimeRange('month')}
          >
            This Month
          </Button>
          <Button
            variant={timeRange === 'alltime' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTimeRange('alltime')}
          >
            All Time
          </Button>
        </div>

        <div className="flex gap-2">
          <Button
            variant={category === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setCategory('all')}
          >
            <Trophy className="h-4 w-4 mr-1" />
            Overall
          </Button>
          <Button
            variant={category === 'matches' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setCategory('matches')}
          >
            <Users className="h-4 w-4 mr-1" />
            Matches
          </Button>
          <Button
            variant={category === 'projects' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setCategory('projects')}
          >
            <Code2 className="h-4 w-4 mr-1" />
            Projects
          </Button>
          <Button
            variant={category === 'streak' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setCategory('streak')}
          >
            <Flame className="h-4 w-4 mr-1" />
            Streak
          </Button>
        </div>
      </div>

      {/* Top 3 Podium */}
      {leaderboardData.length >= 3 && (
        <div className="mb-6">
          <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-2">
            <CardContent className="p-8">
              <div className="flex items-end justify-center gap-8">
                {/* 2nd Place */}
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-center"
                >
                  <div className="mb-4">
                    <div className={`h-20 w-20 rounded-full bg-gradient-to-br ${getRankColor(2)} flex items-center justify-center text-white text-2xl font-bold mx-auto shadow-lg`}>
                      {leaderboardData[1].avatar}
                    </div>
                    <div className="mt-2 flex justify-center">
                      <Medal className="h-8 w-8 text-gray-400" />
                    </div>
                  </div>
                  <div className="font-bold text-gray-900">{leaderboardData[1].name}</div>
                  <div className="text-sm text-gray-600 truncate max-w-[120px]">{leaderboardData[1].college}</div>
                  <div className="mt-2 text-2xl font-bold text-blue-600">{getCategoryValue(leaderboardData[1])}</div>
                  <div className="text-xs text-gray-500">{getCategoryLabel().toLowerCase()}</div>
                  <div className="mt-3 bg-gray-200 h-24 rounded-t-lg flex items-end justify-center pb-3">
                    <span className="text-3xl font-bold text-gray-600">2</span>
                  </div>
                </motion.div>

                {/* 1st Place */}
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center"
                >
                  <div className="mb-4">
                    <div className={`h-24 w-24 rounded-full bg-gradient-to-br ${getRankColor(1)} flex items-center justify-center text-white text-3xl font-bold mx-auto shadow-2xl border-4 border-yellow-300`}>
                      {leaderboardData[0].avatar}
                    </div>
                    <div className="mt-2 flex justify-center">
                      <Crown className="h-10 w-10 text-yellow-500" />
                    </div>
                  </div>
                  <div className="font-bold text-gray-900 text-lg">{leaderboardData[0].name}</div>
                  <div className="text-sm text-gray-600 truncate max-w-[140px]">{leaderboardData[0].college}</div>
                  <div className="mt-2 text-3xl font-bold text-yellow-600">{getCategoryValue(leaderboardData[0])}</div>
                  <div className="text-xs text-gray-500">{getCategoryLabel().toLowerCase()}</div>
                  <div className="mt-3 bg-yellow-400 h-32 rounded-t-lg flex items-end justify-center pb-3">
                    <span className="text-4xl font-bold text-yellow-800">1</span>
                  </div>
                </motion.div>

                {/* 3rd Place */}
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-center"
                >
                  <div className="mb-4">
                    <div className={`h-20 w-20 rounded-full bg-gradient-to-br ${getRankColor(3)} flex items-center justify-center text-white text-2xl font-bold mx-auto shadow-lg`}>
                      {leaderboardData[2].avatar}
                    </div>
                    <div className="mt-2 flex justify-center">
                      <Medal className="h-8 w-8 text-orange-500" />
                    </div>
                  </div>
                  <div className="font-bold text-gray-900">{leaderboardData[2].name}</div>
                  <div className="text-sm text-gray-600 truncate max-w-[120px]">{leaderboardData[2].college}</div>
                  <div className="mt-2 text-2xl font-bold text-orange-600">{getCategoryValue(leaderboardData[2])}</div>
                  <div className="text-xs text-gray-500">{getCategoryLabel().toLowerCase()}</div>
                  <div className="mt-3 bg-orange-200 h-20 rounded-t-lg flex items-end justify-center pb-3">
                    <span className="text-3xl font-bold text-orange-600">3</span>
                  </div>
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Stats Overview */}
      <div className="grid gap-6 md:grid-cols-4 mb-6">
        <Card className="border-2 border-blue-200 bg-blue-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <Users className="h-8 w-8 text-blue-600" />
              <TrendingUp className="h-5 w-5 text-green-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{leaderboardData.length}</div>
            <div className="text-sm text-gray-600">Active Users</div>
          </CardContent>
        </Card>

        <Card className="border-2 border-purple-200 bg-purple-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <Trophy className="h-8 w-8 text-purple-600" />
              <Sparkles className="h-5 w-5 text-yellow-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {leaderboardData.length > 0 ? Math.max(...leaderboardData.map(e => e.points)) : 0}
            </div>
            <div className="text-sm text-gray-600">Highest Points</div>
          </CardContent>
        </Card>

        <Card className="border-2 border-green-200 bg-green-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <Code2 className="h-8 w-8 text-green-600" />
              <Star className="h-5 w-5 text-yellow-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {leaderboardData.reduce((sum, e) => sum + e.projects, 0)}
            </div>
            <div className="text-sm text-gray-600">Total Projects</div>
          </CardContent>
        </Card>

        <Card className="border-2 border-orange-200 bg-orange-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <Flame className="h-8 w-8 text-orange-600" />
              <Award className="h-5 w-5 text-red-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {leaderboardData.length > 0 ? Math.max(...leaderboardData.map(e => e.streak)) : 0}
            </div>
            <div className="text-sm text-gray-600">Longest Streak</div>
          </CardContent>
        </Card>
      </div>

      {/* Full Leaderboard List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-blue-600" />
            {timeRange === 'week' && 'This Week\'s '}
            {timeRange === 'month' && 'This Month\'s '}
            {timeRange === 'alltime' && 'All-Time '}
            Rankings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {leaderboardData.map((entry, index) => {
              const isCurrentUser = entry.userId === user?.email;
              
              return (
                <motion.div
                  key={entry.userId}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`flex items-center gap-4 p-4 rounded-lg border-2 transition-all hover:shadow-md ${
                    isCurrentUser
                      ? 'bg-gradient-to-r from-blue-50 to-purple-50 border-blue-300'
                      : entry.rank <= 3
                      ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200'
                      : 'bg-white border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {/* Rank */}
                  <div className="flex items-center justify-center w-12 h-12 flex-shrink-0">
                    {getRankIcon(entry.rank)}
                  </div>

                  {/* Avatar */}
                  <div className={`h-14 w-14 rounded-full bg-gradient-to-br ${getRankColor(entry.rank)} flex items-center justify-center text-white text-xl font-bold flex-shrink-0`}>
                    {entry.avatar}
                  </div>

                  {/* User Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-gray-900 truncate">{entry.name}</h3>
                      {isCurrentUser && (
                        <Badge className="bg-blue-600 text-white">You</Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 truncate">{entry.college}</p>
                    
                    {/* Badges */}
                    <div className="flex flex-wrap gap-1 mt-2">
                      {entry.badges.slice(0, 2).map((badge, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {badge}
                        </Badge>
                      ))}
                      {entry.badges.length > 2 && (
                        <Badge variant="secondary" className="text-xs">
                          +{entry.badges.length - 2}
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex flex-col md:flex-row gap-4 md:gap-8">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">{getCategoryValue(entry)}</div>
                      <div className="text-xs text-gray-500">{getCategoryLabel()}</div>
                    </div>

                    {category === 'all' && (
                      <>
                        <div className="text-center">
                          <div className="flex items-center gap-1 text-sm font-semibold text-blue-600">
                            <Users className="h-4 w-4" />
                            {entry.matches}
                          </div>
                          <div className="text-xs text-gray-500">Matches</div>
                        </div>

                        <div className="text-center">
                          <div className="flex items-center gap-1 text-sm font-semibold text-green-600">
                            <Code2 className="h-4 w-4" />
                            {entry.projects}
                          </div>
                          <div className="text-xs text-gray-500">Projects</div>
                        </div>

                        <div className="text-center">
                          <div className="flex items-center gap-1 text-sm font-semibold text-orange-600">
                            <Flame className="h-4 w-4" />
                            {entry.streak}
                          </div>
                          <div className="text-xs text-gray-500">Streak</div>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Rank Change Indicator */}
                  <div className="flex-shrink-0">
                    {entry.rank <= 3 ? (
                      <div className="flex items-center gap-1 text-sm font-semibold text-green-600">
                        <ChevronUp className="h-4 w-4" />
                        +{Math.floor(Math.random() * 5 + 1)}
                      </div>
                    ) : (
                      <div className="w-8" />
                    )}
                  </div>
                </motion.div>
              );
            })}

            {leaderboardData.length === 0 && (
              <div className="text-center py-12">
                <Trophy className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Rankings Yet</h3>
                <p className="text-gray-600">Start participating to see rankings!</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Tips Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-6"
      >
        <Card className="bg-gradient-to-r from-purple-600 to-pink-600 border-0 text-white">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <Sparkles className="h-8 w-8 flex-shrink-0" />
              <div>
                <h3 className="font-bold text-lg mb-2">🚀 Pro Tips to Climb the Leaderboard</h3>
                <ul className="space-y-1 text-sm text-purple-100">
                  <li>✓ Find teammates to earn match points</li>
                  <li>✓ Complete projects to boost your ranking</li>
                  <li>✓ Maintain daily streak for bonus points</li>
                  <li>✓ Save resources and participate in events</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </DashboardLayout>
  );
}
