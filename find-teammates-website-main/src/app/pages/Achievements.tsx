import { useState } from 'react';
import { motion } from 'motion/react';
import {
  Trophy,
  Award,
  Star,
  Flame,
  Target,
  Zap,
  Crown,
  Medal,
  Gift,
  TrendingUp,
  Calendar,
  Code2,
  Users,
  BookOpen,
  CheckCircle,
  Lock,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Progress } from '../components/ui/progress';
import { DashboardLayout } from '../components/DashboardLayout';

const achievements = [
  {
    id: '1',
    title: 'First Match',
    description: 'Found your first teammate',
    icon: Users,
    unlocked: true,
    unlockedAt: '2026-02-15',
    points: 50,
    rarity: 'common',
  },
  {
    id: '2',
    title: 'Code Warrior',
    description: 'Completed 10 coding sessions',
    icon: Code2,
    unlocked: true,
    unlockedAt: '2026-02-20',
    points: 100,
    rarity: 'rare',
  },
  {
    id: '3',
    title: 'Team Builder',
    description: 'Created a team with 5+ members',
    icon: Crown,
    unlocked: true,
    unlockedAt: '2026-02-25',
    points: 150,
    rarity: 'epic',
  },
  {
    id: '4',
    title: 'Learning Enthusiast',
    description: 'Completed 20 learning resources',
    icon: BookOpen,
    unlocked: false,
    progress: 15,
    total: 20,
    points: 200,
    rarity: 'epic',
  },
  {
    id: '5',
    title: 'Hackathon Winner',
    description: 'Win a hackathon event',
    icon: Trophy,
    unlocked: false,
    progress: 0,
    total: 1,
    points: 500,
    rarity: 'legendary',
  },
  {
    id: '6',
    title: 'Mentor Master',
    description: 'Help 10 teammates',
    icon: Target,
    unlocked: false,
    progress: 3,
    total: 10,
    points: 300,
    rarity: 'epic',
  },
  {
    id: '7',
    title: '30-Day Streak',
    description: 'Login for 30 consecutive days',
    icon: Flame,
    unlocked: false,
    progress: 12,
    total: 30,
    points: 250,
    rarity: 'rare',
  },
  {
    id: '8',
    title: 'Project Showcase',
    description: 'Upload 5 projects',
    icon: Star,
    unlocked: false,
    progress: 2,
    total: 5,
    points: 150,
    rarity: 'rare',
  },
];

const leaderboard = [
  { rank: 1, name: 'Rahul Sharma', points: 2500, avatar: 'RS', streak: 45, level: 15 },
  { rank: 2, name: 'Priya Singh', points: 2200, avatar: 'PS', streak: 38, level: 14 },
  { rank: 3, name: 'You', points: 1800, avatar: 'YO', streak: 12, level: 12 },
  { rank: 4, name: 'Arjun Patel', points: 1600, avatar: 'AP', streak: 25, level: 11 },
  { rank: 5, name: 'Neha Gupta', points: 1400, avatar: 'NG', streak: 18, level: 10 },
];

const dailyQuests = [
  { id: '1', title: 'Find 1 teammate', progress: 1, total: 1, reward: 50, completed: true },
  { id: '2', title: 'Complete 1 resource', progress: 0, total: 1, reward: 30, completed: false },
  { id: '3', title: 'Send 5 messages', progress: 3, total: 5, reward: 20, completed: false },
  { id: '4', title: 'Update your profile', progress: 0, total: 1, reward: 25, completed: false },
];

export function Achievements() {
  const [selectedRarity, setSelectedRarity] = useState<string>('all');

  const currentLevel = 12;
  const currentXP = 1800;
  const nextLevelXP = 2000;
  const xpProgress = (currentXP / nextLevelXP) * 100;

  const totalAchievements = achievements.length;
  const unlockedAchievements = achievements.filter((a) => a.unlocked).length;
  const totalPoints = achievements
    .filter((a) => a.unlocked)
    .reduce((sum, a) => sum + a.points, 0);

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common':
        return 'bg-gray-100 text-gray-700 border-gray-300';
      case 'rare':
        return 'bg-blue-100 text-blue-700 border-blue-300';
      case 'epic':
        return 'bg-purple-100 text-purple-700 border-purple-300';
      case 'legendary':
        return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const filteredAchievements =
    selectedRarity === 'all'
      ? achievements
      : achievements.filter((a) => a.rarity === selectedRarity);

  return (
    <DashboardLayout>
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Trophy className="h-8 w-8 text-yellow-600" />
          <h1 className="text-3xl font-bold text-gray-900">Achievements & Rewards</h1>
        </div>
        <p className="text-gray-600">Track your progress and earn rewards</p>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-4 mb-6">
        <Card className="border-2 border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-600 mb-1">Level</div>
                <div className="text-3xl font-bold text-blue-600">{currentLevel}</div>
              </div>
              <Zap className="h-12 w-12 text-blue-600 opacity-20" />
            </div>
            <Progress value={xpProgress} className="mt-3 h-2" />
            <p className="text-xs text-gray-600 mt-1">
              {currentXP} / {nextLevelXP} XP
            </p>
          </CardContent>
        </Card>

        <Card className="border-2 border-purple-200 bg-purple-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-600 mb-1">Points</div>
                <div className="text-3xl font-bold text-purple-600">{totalPoints}</div>
              </div>
              <Star className="h-12 w-12 text-purple-600 opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-orange-200 bg-orange-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-600 mb-1">Streak</div>
                <div className="text-3xl font-bold text-orange-600">12 🔥</div>
              </div>
              <Flame className="h-12 w-12 text-orange-600 opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-green-200 bg-green-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-600 mb-1">Unlocked</div>
                <div className="text-3xl font-bold text-green-600">
                  {unlockedAchievements}/{totalAchievements}
                </div>
              </div>
              <Award className="h-12 w-12 text-green-600 opacity-20" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Achievements */}
        <div className="lg:col-span-2 space-y-6">
          {/* Daily Quests */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-blue-600" />
                Daily Quests
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {dailyQuests.map((quest) => (
                <div
                  key={quest.id}
                  className={`p-4 border rounded-lg ${
                    quest.completed ? 'bg-green-50 border-green-300' : 'bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      {quest.completed ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : (
                        <div className="h-5 w-5 border-2 border-gray-300 rounded-full" />
                      )}
                      <span className="font-medium text-gray-900">{quest.title}</span>
                    </div>
                    <Badge className="bg-yellow-100 text-yellow-700 border-yellow-300">
                      +{quest.reward} XP
                    </Badge>
                  </div>
                  <Progress value={(quest.progress / quest.total) * 100} className="h-2" />
                  <p className="text-xs text-gray-600 mt-1">
                    {quest.progress} / {quest.total} completed
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Achievement Gallery */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-purple-600" />
                  Achievement Gallery
                </CardTitle>
                <div className="flex gap-2">
                  {['all', 'common', 'rare', 'epic', 'legendary'].map((rarity) => (
                    <Button
                      key={rarity}
                      variant={selectedRarity === rarity ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedRarity(rarity)}
                      className="capitalize"
                    >
                      {rarity}
                    </Button>
                  ))}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {filteredAchievements.map((achievement, index) => {
                  const Icon = achievement.icon;
                  return (
                    <motion.div
                      key={achievement.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.05 }}
                      className={`p-4 border-2 rounded-lg ${
                        achievement.unlocked
                          ? 'bg-gradient-to-br from-blue-50 to-purple-50 border-blue-300'
                          : 'bg-gray-50 border-gray-300 opacity-70'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`h-12 w-12 rounded-lg flex items-center justify-center ${
                            achievement.unlocked
                              ? 'bg-gradient-to-br from-blue-600 to-purple-600'
                              : 'bg-gray-400'
                          }`}
                        >
                          {achievement.unlocked ? (
                            <Icon className="h-6 w-6 text-white" />
                          ) : (
                            <Lock className="h-6 w-6 text-white" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-1">
                            <h3 className="font-semibold text-gray-900">{achievement.title}</h3>
                            <Badge className={getRarityColor(achievement.rarity)}>
                              {achievement.rarity}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{achievement.description}</p>
                          {achievement.unlocked ? (
                            <div className="flex items-center gap-2">
                              <Badge className="bg-yellow-100 text-yellow-700">
                                +{achievement.points} points
                              </Badge>
                              <span className="text-xs text-gray-500">
                                Unlocked {new Date(achievement.unlockedAt!).toLocaleDateString()}
                              </span>
                            </div>
                          ) : (
                            <>
                              <Progress
                                value={((achievement.progress || 0) / (achievement.total || 1)) * 100}
                                className="h-2 mb-1"
                              />
                              <p className="text-xs text-gray-600">
                                {achievement.progress} / {achievement.total} progress
                              </p>
                            </>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Leaderboard */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-yellow-600" />
                Top Achievers
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {leaderboard.map((user) => (
                <div
                  key={user.rank}
                  className={`flex items-center gap-3 p-3 rounded-lg ${
                    user.name === 'You' ? 'bg-blue-50 border-2 border-blue-300' : 'bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-3 flex-1">
                    <div
                      className={`h-8 w-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                        user.rank === 1
                          ? 'bg-yellow-500'
                          : user.rank === 2
                          ? 'bg-gray-400'
                          : user.rank === 3
                          ? 'bg-orange-500'
                          : 'bg-blue-500'
                      }`}
                    >
                      {user.rank <= 3 ? (
                        <Medal className="h-5 w-5" />
                      ) : (
                        user.rank
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900">{user.name}</div>
                      <div className="text-xs text-gray-600">Level {user.level}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-purple-600">{user.points}</div>
                    <div className="text-xs text-orange-600">{user.streak}🔥</div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Rewards Shop */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gift className="h-5 w-5 text-pink-600" />
                Rewards Shop
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { name: 'Profile Badge', cost: 500, icon: '🏆' },
                { name: 'Custom Theme', cost: 1000, icon: '🎨' },
                { name: 'Priority Support', cost: 1500, icon: '⚡' },
                { name: 'Exclusive Avatar', cost: 2000, icon: '👑' },
              ].map((reward, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">{reward.icon}</div>
                    <div>
                      <div className="font-medium text-gray-900">{reward.name}</div>
                      <div className="text-sm text-purple-600 font-semibold">{reward.cost} points</div>
                    </div>
                  </div>
                  <Button size="sm" disabled={totalPoints < reward.cost}>
                    Redeem
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
