// Type definitions for CollabNest

export interface User {
  id: string;
  name: string;
  email: string;
  college: string;
  skills: string[];
  interests: string[];
  experience: 'Beginner' | 'Intermediate' | 'Advanced';
  bio: string;
  availability: 'Full-time' | 'Part-time' | 'Weekends';
  profileImage?: string;
}

export interface Resource {
  id: string;
  title: string;
  link: string;
  category: 'GitHub' | 'YouTube' | 'Docs' | 'Course' | 'Blog';
  tags: string[];
  upvotes: number;
  createdBy: string;
  createdAt: Date;
  description?: string;
}

export interface Match {
  id: string;
  user: User;
  compatibilityScore: number;
  explanation: string;
  skillOverlap: string[];
  complementarySkills: string[];
  isSuperLike?: boolean;
}

export interface SkillGapAnalysis {
  role: string;
  currentSkills: string[];
  missingSkills: string[];
  recommendedPath: string[];
  progress: number;
}

export interface ProjectIdea {
  title: string;
  problemStatement: string;
  features: string[];
  techStack: string[];
  mvpScope: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

export interface AnalyticsData {
  totalMatches: number;
  avgCompatibility: number;
  resourcesSaved: number;
  skillsLearned: number;
  weeklyActivity: { day: string; matches: number; resources: number }[];
  skillDistribution: { skill: string; count: number }[];
}