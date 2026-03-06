// User Statistics Management System
export interface UserStats {
  userId: string;
  name: string;
  college: string;
  points: number;
  matches: number;
  projects: number;
  streak: number;
  lastActiveDate: string;
  badges: string[];
  weeklyPoints: number;
  monthlyPoints: number;
  activities: Activity[];
}

export interface Activity {
  type: 'match' | 'project' | 'resource' | 'event' | 'achievement';
  timestamp: string;
  points: number;
  description: string;
}

export interface LeaderboardEntry extends UserStats {
  rank: number;
  avatar: string;
}

const STORAGE_KEY = 'userStats';
const LEADERBOARD_KEY = 'leaderboardData';

// Initialize or get user stats
export function getUserStats(userId: string, userName: string, userCollege: string): UserStats {
  const allStats = getAllUserStats();
  
  if (allStats[userId]) {
    return updateStreak(allStats[userId]);
  }

  // Create new user stats
  const newStats: UserStats = {
    userId,
    name: userName,
    college: userCollege,
    points: 0,
    matches: 0,
    projects: 0,
    streak: 0,
    lastActiveDate: new Date().toISOString(),
    badges: [],
    weeklyPoints: 0,
    monthlyPoints: 0,
    activities: [],
  };

  allStats[userId] = newStats;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(allStats));
  return newStats;
}

// Update streak based on last active date
function updateStreak(stats: UserStats): UserStats {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const lastActive = new Date(stats.lastActiveDate);
  lastActive.setHours(0, 0, 0, 0);
  
  const diffDays = Math.floor((today.getTime() - lastActive.getTime()) / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) {
    // Same day, keep streak
    return stats;
  } else if (diffDays === 1) {
    // Consecutive day, increment streak
    stats.streak += 1;
    stats.lastActiveDate = new Date().toISOString();
  } else if (diffDays > 1) {
    // Streak broken, reset to 1
    stats.streak = 1;
    stats.lastActiveDate = new Date().toISOString();
  }
  
  saveUserStats(stats);
  return stats;
}

// Get all user stats
function getAllUserStats(): Record<string, UserStats> {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : {};
}

// Save user stats
export function saveUserStats(stats: UserStats) {
  const allStats = getAllUserStats();
  allStats[stats.userId] = stats;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(allStats));
  
  // Dispatch event for real-time updates
  window.dispatchEvent(new CustomEvent('statsUpdated', { detail: stats }));
}

// Add activity and update stats
export function addActivity(
  userId: string,
  type: Activity['type'],
  description: string,
  points: number
) {
  const allStats = getAllUserStats();
  const stats = allStats[userId];
  
  if (!stats) return;

  const activity: Activity = {
    type,
    timestamp: new Date().toISOString(),
    points,
    description,
  };

  stats.activities.unshift(activity);
  stats.activities = stats.activities.slice(0, 50); // Keep last 50 activities
  stats.points += points;
  stats.weeklyPoints += points;
  stats.monthlyPoints += points;

  // Update specific counters
  if (type === 'match') stats.matches += 1;
  if (type === 'project') stats.projects += 1;

  // Check for new badges
  updateBadges(stats);

  saveUserStats(stats);
}

// Update badges based on achievements
function updateBadges(stats: UserStats) {
  const badges: string[] = [...stats.badges];

  if (stats.streak >= 30 && !badges.includes('30 Day Streak')) {
    badges.push('30 Day Streak');
  }
  if (stats.streak >= 7 && !badges.includes('Week Warrior')) {
    badges.push('Week Warrior');
  }
  if (stats.matches >= 50 && !badges.includes('Super Connector')) {
    badges.push('Super Connector');
  }
  if (stats.projects >= 10 && !badges.includes('Project Master')) {
    badges.push('Project Master');
  }
  if (stats.points >= 3000 && !badges.includes('Elite Member')) {
    badges.push('Elite Member');
  }
  if (stats.points >= 1000 && !badges.includes('Rising Star')) {
    badges.push('Rising Star');
  }

  stats.badges = badges;
}

// Generate leaderboard
export function generateLeaderboard(
  timeRange: 'week' | 'month' | 'alltime' = 'alltime',
  category: 'all' | 'matches' | 'projects' | 'streak' = 'all'
): LeaderboardEntry[] {
  const allStats = getAllUserStats();
  const users = Object.values(allStats);

  // Filter based on time range
  let scoredUsers = users.map(user => {
    let score = 0;
    
    if (timeRange === 'week') {
      score = user.weeklyPoints;
    } else if (timeRange === 'month') {
      score = user.monthlyPoints;
    } else {
      score = user.points;
    }

    // Sort by category
    if (category === 'matches') score = user.matches;
    if (category === 'projects') score = user.projects;
    if (category === 'streak') score = user.streak;

    return { ...user, score };
  });

  // Sort by score
  scoredUsers.sort((a, b) => b.score - a.score);

  // Add rank and avatar
  return scoredUsers.map((user, index) => ({
    ...user,
    rank: index + 1,
    avatar: user.name.charAt(0).toUpperCase(),
  }));
}

// Reset weekly/monthly points (should be called by a cron job, but we'll simulate it)
export function resetPeriodPoints() {
  const allStats = getAllUserStats();
  const now = new Date();
  
  Object.values(allStats).forEach(stats => {
    const lastReset = new Date(stats.lastActiveDate);
    
    // Reset weekly points (every Monday)
    if (now.getDay() === 1 && lastReset.getDay() !== 1) {
      stats.weeklyPoints = 0;
    }
    
    // Reset monthly points (1st of month)
    if (now.getDate() === 1 && lastReset.getDate() !== 1) {
      stats.monthlyPoints = 0;
    }
  });
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(allStats));
}

// Initialize mock data for demo
export function initializeMockLeaderboard() {
  const existing = localStorage.getItem(STORAGE_KEY);
  if (existing) return; // Don't overwrite existing data

  const mockUsers: Partial<UserStats>[] = [
    {
      userId: 'user1',
      name: 'Aditya Sharma',
      college: 'IIT Delhi',
      points: 2850,
      matches: 45,
      projects: 12,
      streak: 21,
      badges: ['Top Contributor', 'Team Leader', 'Hackathon Winner'],
      weeklyPoints: 450,
      monthlyPoints: 1200,
    },
    {
      userId: 'user2',
      name: 'Priya Patel',
      college: 'BITS Pilani',
      points: 2720,
      matches: 42,
      projects: 10,
      streak: 18,
      badges: ['AI Expert', 'Mentor', 'Rising Star'],
      weeklyPoints: 420,
      monthlyPoints: 1100,
    },
    {
      userId: 'user3',
      name: 'Rahul Verma',
      college: 'IIT Bombay',
      points: 2650,
      matches: 38,
      projects: 11,
      streak: 15,
      badges: ['Full Stack Pro', 'Community Hero'],
      weeklyPoints: 390,
      monthlyPoints: 1050,
    },
    {
      userId: 'user4',
      name: 'Sneha Gupta',
      college: 'NIT Trichy',
      points: 2480,
      matches: 35,
      projects: 9,
      streak: 14,
      badges: ['ML Enthusiast', 'Fast Learner'],
      weeklyPoints: 360,
      monthlyPoints: 980,
    },
    {
      userId: 'user5',
      name: 'Karthik Reddy',
      college: 'VIT Vellore',
      points: 2350,
      matches: 32,
      projects: 8,
      streak: 12,
      badges: ['Web3 Pioneer'],
      weeklyPoints: 340,
      monthlyPoints: 920,
    },
  ];

  const allStats: Record<string, UserStats> = {};
  mockUsers.forEach(user => {
    allStats[user.userId!] = {
      userId: user.userId!,
      name: user.name!,
      college: user.college!,
      points: user.points || 0,
      matches: user.matches || 0,
      projects: user.projects || 0,
      streak: user.streak || 0,
      lastActiveDate: new Date().toISOString(),
      badges: user.badges || [],
      weeklyPoints: user.weeklyPoints || 0,
      monthlyPoints: user.monthlyPoints || 0,
      activities: [],
    };
  });

  localStorage.setItem(STORAGE_KEY, JSON.stringify(allStats));
}
