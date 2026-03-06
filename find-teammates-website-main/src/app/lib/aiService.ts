// AI Service for skill gap analysis and project idea generation
import { SkillGapAnalysis, ProjectIdea } from './types';

const roleSkillMap: Record<string, string[]> = {
  'Frontend Developer': [
    'React', 'TypeScript', 'HTML', 'CSS', 'JavaScript', 'Tailwind CSS',
    'Next.js', 'State Management', 'Responsive Design', 'Web Performance'
  ],
  'Backend Developer': [
    'Node.js', 'Python', 'SQL', 'REST API', 'Express', 'PostgreSQL',
    'Authentication', 'Security', 'Microservices', 'Docker'
  ],
  'Full Stack Developer': [
    'React', 'Node.js', 'TypeScript', 'SQL', 'REST API', 'Git',
    'Docker', 'AWS', 'Testing', 'CI/CD'
  ],
  'AI/ML Engineer': [
    'Python', 'Machine Learning', 'TensorFlow', 'PyTorch', 'Deep Learning',
    'NLP', 'Computer Vision', 'Data Science', 'NumPy', 'Pandas'
  ],
  'Mobile Developer': [
    'React Native', 'Flutter', 'Swift', 'Kotlin', 'Mobile UI/UX',
    'Firebase', 'Push Notifications', 'App Store Deployment', 'APIs'
  ],
  'DevOps Engineer': [
    'Docker', 'Kubernetes', 'AWS', 'CI/CD', 'Jenkins', 'Linux',
    'Terraform', 'Monitoring', 'Security', 'Automation'
  ],
};

export function analyzeSkillGap(currentSkills: string[], targetRole: string): SkillGapAnalysis {
  const requiredSkills = roleSkillMap[targetRole] || [];
  const missingSkills = requiredSkills.filter(skill =>
    !currentSkills.some(cs => cs.toLowerCase() === skill.toLowerCase())
  );

  const progress = Math.round(
    ((requiredSkills.length - missingSkills.length) / requiredSkills.length) * 100
  );

  const recommendedPath = generateLearningPath(missingSkills, targetRole);

  return {
    role: targetRole,
    currentSkills,
    missingSkills,
    recommendedPath,
    progress,
  };
}

function generateLearningPath(missingSkills: string[], role: string): string[] {
  const path: string[] = [];

  // Prioritize foundational skills
  const foundational = ['JavaScript', 'Python', 'HTML', 'CSS', 'Git'];
  const foundationalMissing = missingSkills.filter(skill => foundational.includes(skill));

  if (foundationalMissing.length > 0) {
    path.push(`Start with fundamentals: ${foundationalMissing.slice(0, 2).join(', ')}`);
  }

  // Framework and tools
  const frameworks = missingSkills.filter(skill =>
    !foundational.includes(skill) &&
    (skill.includes('React') || skill.includes('Node') || skill.includes('TensorFlow'))
  );

  if (frameworks.length > 0) {
    path.push(`Learn key frameworks: ${frameworks.slice(0, 2).join(', ')}`);
  }

  // Advanced topics
  const advanced = missingSkills.filter(skill =>
    skill.includes('Advanced') || skill.includes('Architecture') || skill.includes('Security')
  );

  if (missingSkills.length > 0 && path.length < 3) {
    path.push(`Build projects using: ${missingSkills.slice(0, 3).join(', ')}`);
  }

  path.push(`Complete a capstone ${role.toLowerCase()} project`);

  return path;
}

export function generateProjectIdea(skills: string[], theme?: string): ProjectIdea {
  const projectTemplates = [
    {
      condition: (s: string[]) => s.some(skill => skill.toLowerCase().includes('ai') || skill.toLowerCase().includes('machine learning')),
      title: 'AI-Powered Study Companion',
      problemStatement: 'Students struggle to find personalized study materials and track their learning progress effectively.',
      features: [
        'AI-based content recommendation system',
        'Progress tracking with analytics',
        'Personalized quiz generation',
        'Study schedule optimizer',
        'Collaborative study rooms'
      ],
      techStack: ['React', 'Python', 'TensorFlow', 'PostgreSQL', 'FastAPI', 'OpenAI API'],
      mvpScope: 'Build a working AI recommendation engine with user profiles, basic quiz generation, and progress tracking dashboard.',
      difficulty: 'Hard' as const,
    },
    {
      condition: (s: string[]) => s.some(skill => skill.toLowerCase().includes('react') || skill.toLowerCase().includes('frontend')),
      title: 'Campus Event Discovery Platform',
      problemStatement: 'College students miss out on interesting events and networking opportunities happening on campus.',
      features: [
        'Real-time event feed',
        'Personalized event recommendations',
        'RSVP and ticketing system',
        'Social sharing features',
        'Event analytics for organizers'
      ],
      techStack: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Socket.io', 'Tailwind CSS'],
      mvpScope: 'Create event listing, RSVP system, and basic recommendation based on user interests.',
      difficulty: 'Medium' as const,
    },
    {
      condition: (s: string[]) => s.some(skill => skill.toLowerCase().includes('mobile') || skill.toLowerCase().includes('flutter')),
      title: 'Smart Campus Navigation App',
      problemStatement: 'New students and visitors struggle to navigate large campus areas and find facilities.',
      features: [
        'AR-based navigation',
        'Indoor mapping',
        'Facility locator',
        'Real-time crowd density',
        'Accessibility routes'
      ],
      techStack: ['Flutter', 'Firebase', 'Google Maps API', 'ARCore', 'Node.js'],
      mvpScope: 'Build basic campus map with location search, directions, and facility information.',
      difficulty: 'Medium' as const,
    },
    {
      condition: () => true,
      title: 'Collaborative Code Learning Platform',
      problemStatement: 'Beginners need a supportive environment to learn coding with real-time mentorship and peer collaboration.',
      features: [
        'Live code collaboration',
        'Peer review system',
        'Mentor matching',
        'Challenge-based learning',
        'Progress badges and certificates'
      ],
      techStack: ['React', 'Node.js', 'WebSocket', 'Monaco Editor', 'PostgreSQL', 'Docker'],
      mvpScope: 'Implement real-time code editor, basic challenge system, and user progress tracking.',
      difficulty: 'Medium' as const,
    },
  ];

  // Find matching template based on skills
  const template = projectTemplates.find(t => t.condition(skills)) || projectTemplates[projectTemplates.length - 1];

  // If theme is provided, customize the title
  if (theme) {
    return {
      ...template,
      title: `${template.title} - ${theme} Edition`,
      problemStatement: `${template.problemStatement} Tailored for ${theme}.`,
    };
  }

  return template;
}

export function getAIResourceRecommendations(userSkills: string[], allResources: any[]): any[] {
  // Score resources based on skill match
  const scoredResources = allResources.map(resource => {
    const matchingTags = resource.tags.filter((tag: string) =>
      userSkills.some(skill => skill.toLowerCase().includes(tag.toLowerCase()) || tag.toLowerCase().includes(skill.toLowerCase()))
    );

    const score = matchingTags.length * 10 + resource.upvotes * 0.1;

    return { ...resource, aiScore: score };
  });

  return scoredResources
    .sort((a, b) => b.aiScore - a.aiScore)
    .slice(0, 6);
}
export function generateMessageReply(userInput: string, partnerName: string): string {
  const input = userInput.toLowerCase();

  const rules = [
    {
      keywords: ['hackathon', 'competition', 'event'],
      responses: [
        `That's a great idea! Which hackathon are you looking at? I've heard there's one coming up next month.`,
        `I'm definitely down for a hackathon. Do you have a specific project idea in mind for it?`,
        `Count me in! What's the registration deadline?`
      ]
    },
    {
      keywords: ['react', 'frontend', 'ui', 'ux', 'css', 'tailwind', 'next.js'],
      responses: [
        `I love working with React! Are we thinking of using Tailwind for the styling?`,
        `Next.js would be perfect for this! It handles SEO and routing so well.`,
        `I've been playing around with Framer Motion lately, we could add some cool animations to the UI.`
      ]
    },
    {
      keywords: ['node', 'backend', 'api', 'database', 'sql', 'python', 'django', 'express'],
      responses: [
        `I can help with the backend setup! Should we go with a REST API or GraphQL?`,
        `For the database, I think PostgreSQL would be a solid choice here.`,
        `Node.js with Express is usually my go-to for rapid prototyping. What do you think?`
      ]
    },
    {
      keywords: ['ai', 'ml', 'machine learning', 'tensor', 'nlp', 'vision', 'data'],
      responses: [
        `AI integration would be amazing! Should we use a pre-trained model or build something custom?`,
        `I've been wanting to work more on ML projects. This is a perfect match!`,
        `We could definitely use some NLP to make the user experience more interactive.`
      ]
    },
    {
      keywords: ['mobile', 'app', 'flutter', 'ios', 'android', 'native'],
      responses: [
        `Building a mobile version sounds like a solid next step. Flutter or React Native?`,
        `I have some experience with mobile dev! Let's talk about the main features for the app.`,
        `Making it cross-platform would be the best way to reach more users.`
      ]
    },
    {
      keywords: ['hi', 'hello', 'hey', 'sup', 'match'],
      responses: [
        `Hey there! Excited we matched. What kind of projects are you into right now?`,
        `Hello! I saw your profile and thought our skills would complement each other's perfectly.`,
        `Hi! Thanks for reaching out. What's on your mind?`
      ]
    },
    {
      keywords: ['thanks', 'thank', 'cool', 'great', 'awesome'],
      responses: [
        `You're welcome! Let's make this project a reality.`,
        `No problem at all! I'm really looking forward to collaborating.`,
        `Absolutely! It's going to be fun working together.`
      ]
    }
  ];

  for (const rule of rules) {
    if (rule.keywords.some(k => input.includes(k))) {
      return rule.responses[Math.floor(Math.random() * rule.responses.length)];
    }
  }

  // Generic fallback responses
  const fallbacks = [
    `That sounds interesting! Could you tell me more about it?`,
    `I'm on board with that! How should we divide the tasks?`,
    `I like that direction. When do you want to sync up and discuss further?`,
    `That's a solid point. I'm excited to see where we can take this!`,
    `Let me think about that for a bit, but I'm definitely interested in collaborating.`
  ];

  return fallbacks[Math.floor(Math.random() * fallbacks.length)];
}
