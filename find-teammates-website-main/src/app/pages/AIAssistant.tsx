import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Bot,
  Send,
  Sparkles,
  Copy,
  ThumbsUp,
  ThumbsDown,
  RotateCcw,
  Lightbulb,
  Users,
  Code,
  TrendingUp,
  Zap,
  BookOpen,
  Loader2,
  Rocket,
  ArrowRight,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { DashboardLayout } from '../components/DashboardLayout';
import { copyToClipboard } from '../utils/clipboard';
import { useAuth } from '../contexts/AuthContext';
import { addActivity } from '../lib/userStats';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const quickPrompts = [
  { icon: Lightbulb, title: 'Hackathon Ideas', desc: 'Suggest a project idea for Web3...', color: 'text-indigo-600 bg-indigo-50', category: 'Creative' },
  { icon: Users, title: 'Find Teammates', desc: 'How to find perfect partners...', color: 'text-green-600 bg-green-50', category: 'Social' },
  { icon: Zap, title: 'Skill Growth', desc: 'Roadmap for AI engineers...', color: 'text-blue-600 bg-blue-50', category: 'Career' },
  { icon: TrendingUp, title: 'Profile Review', desc: 'Tips to improve ranking...', color: 'text-purple-600 bg-purple-50', category: 'Growth' },
  { icon: Code, title: 'Code Debugger', desc: 'Help me debug my React hook...', color: 'text-orange-600 bg-orange-50', category: 'Technical' },
  { icon: Sparkles, title: 'Pitch Deck', desc: 'Write a pitch for my project...', color: 'text-pink-600 bg-pink-50', category: 'Startup' },
];

const thinkingStages = [
  "Analyzing context...",
  "Searching developer database...",
  "Consulting industry best practices...",
  "Drafting personalized response...",
  "Finalizing insights..."
];

// AI Response Generator with realistic, context-aware responses
const generateAIResponse = (userMessage: string): { content: string; suggestions: string[] } => {
  const msg = userMessage.toLowerCase();

  // Project Ideas
  if (msg.includes('project') || msg.includes('hackathon') || msg.includes('idea')) {
    const projects = [
      {
        title: "🎯 AI-Powered Study Companion",
        description: "Build an intelligent study assistant that uses GPT-4 to create personalized learning plans, generates quizzes, and tracks progress.",
        tech: "React, TypeScript, OpenAI API, Firebase",
        difficulty: "Intermediate",
        impact: "High - Helps students learn efficiently"
      },
      {
        title: "🌍 EcoTrack - Carbon Footprint Tracker",
        description: "Mobile app that tracks daily carbon emissions and suggests eco-friendly alternatives using ML predictions.",
        tech: "React Native, TensorFlow.js, Node.js, MongoDB",
        difficulty: "Advanced",
        impact: "Very High - Environmental sustainability"
      },
      {
        title: "🤝 CollabMatch - Smart Team Builder",
        description: "Platform matching developers based on skills, timezone, and project interests using collaborative filtering.",
        tech: "Next.js, Python, scikit-learn, PostgreSQL",
        difficulty: "Intermediate",
        impact: "High - Improves team formation"
      }
    ];

    const project = projects[Math.floor(Math.random() * projects.length)];
    return {
      content: `🧠 *Consulting the innovation oracle...* \n\nFound a high-potential concept for you:\n\n${project.title}\n\n📝 **The Vision:**\n${project.description}\n\n🛠️ **Suggested Stack:**\n${project.tech}\n\n⚡ **Success Index:** ${project.difficulty === 'Advanced' ? 'High Risk, High Reward' : 'Solid MVP Potential'}\n💡 **Impact Quotient:** 98.4/100\n\n🚀 *Antigravity Insight:* This isn't just a project; it's a startup in the making. Focus on the ${project.tech.split(',')[0]} implementation first to win the "Best Tech" category!`,
      suggestions: ["How to start building this?", "Suggest a team structure", "More project ideas"]
    };
  }

  // Teammate matching advice
  if (msg.includes('teammate') || msg.includes('team') || msg.includes('match') || msg.includes('partner')) {
    return {
      content: `🤝 *Scanning the global developer network...* \n\nI've calculated your optimal collaboration matrix. Finding the right partner is 40% skills and 60% "vibe check".\n\n1. 🎯 **Look Beyond the Code**\n   • Check compatibility (aim for 85%+ for long-term projects).\n   • GitHub commit frequency shows consistency, not just skill.\n\n2. 💬 **The "3-Message" Rule**\n   • If they don't respond with high energy within 3 messages, their commitment might be low. Move on!\n\n3. 🔍 **Simulated Future Prediction**\n   • I predict your best match will likely be someone with complementary skills (e.g., if you are Backend, look for a UI wizard).\n\n🚀 *Calculated Advice:* Don't settle for "good enough". Your project deserves a co-founder, not just a helper.`,
      suggestions: ["Who is my best match?", "How to invite someone to a team?", "Improve my profile"]
    };
  }

  // Web3 skills
  if (msg.includes('web3') || msg.includes('blockchain') || msg.includes('crypto') || msg.includes('smart contract')) {
    return {
      content: `⛓️ Complete Web3 Developer Roadmap:\n\n📚 Phase 1: Foundations (2-3 months)\n✓ JavaScript/TypeScript mastery\n✓ React for dApp frontends\n✓ Node.js for backend\n✓ Git & version control\n\n🔐 Phase 2: Blockchain Basics (2 months)\n✓ Ethereum fundamentals\n✓ Cryptography basics\n✓ Wallet integration (MetaMask)\n✓ Web3.js / ethers.js\n\n⚡ Phase 3: Smart Contracts (3-4 months)\n✓ Solidity programming\n✓ Hardhat/Truffle framework\n✓ Testing smart contracts\n✓ Security best practices\n✓ Gas optimization\n\n🚀 Phase 4: Advanced (Ongoing)\n✓ DeFi protocols (Uniswap, Aave)\n✓ NFT standards (ERC-721, ERC-1155)\n✓ Layer 2 solutions (Polygon, Arbitrum)\n✓ IPFS for decentralized storage\n\n💡 Best Resources:\n1. CryptoZombies (Free Solidity course)\n2. Alchemy University\n3. Buildspace projects\n4. Patrick Collins YouTube\n\n🎯 First Project: Build a simple NFT minting dApp!\n\nNeed specific resource links or project ideas?`,
      suggestions: ["What is Solidity?", "Best Web3 projects for beginners?", "How to deploy a smart contract?"]
    };
  }

  // Profile ranking tips
  if (msg.includes('ranking') || msg.includes('profile') || msg.includes('improve') || msg.includes('better')) {
    return {
      content: `📈 Boost Your CollabNest Ranking:\n\n🏆 Point System Breakdown:\n• New match: +10 points\n• Project completion: +50 points\n• Resource contribution: +15 points\n• Daily streak: +5 points/day\n• Hackathon win: +100 points\n• Helping teammates: +20 points\n\n⚡ Quick Wins (This Week):\n1. Complete your profile 100% → +25 pts\n2. Add 3+ projects with GitHub links → +30 pts\n3. Upload profile picture → +10 pts\n4. Verify college email → +15 pts\n5. Connect LinkedIn/GitHub → +20 pts\n\n🎯 Long-term Strategy:\n• Maintain 7-day streak → +35 pts/week\n• Respond to messages within 24hrs → Better compatibility\n• Share quality resources → Community karma\n• Join/create teams → +40 pts per team\n• Attend events → +25 pts each\n\n💎 Pro Tips:\n• Be active during peak hours (6-9 PM)\n• Write detailed project descriptions\n• Use relevant skill tags\n• Engage with community posts\n\n🔥 Current Top Performers Average:\n• 15+ active matches\n• 8+ completed projects\n• 21-day streak\n• 2,500+ total points\n\nYou're currently at rank #15. With focused effort, you can reach top 10 in 2-3 weeks!\n\nWant a personalized action plan?`,
      suggestions: ["What's my current rank?", "How to get more points?", "Show me top profiles"]
    };
  }

  // AI/ML career roadmap
  if (msg.includes('career') || msg.includes('roadmap') || msg.includes('ai') || msg.includes('ml') || msg.includes('machine learning')) {
    return {
      content: `🤖 AI/ML Engineer Career Roadmap 2026:\n\n📊 Phase 1: Mathematics (3-4 months)\n✓ Linear Algebra (vectors, matrices)\n✓ Calculus (derivatives, gradients)\n✓ Probability & Statistics\n✓ Recommended: 3Blue1Brown, Khan Academy\n\n🐍 Phase 2: Programming (2-3 months)\n✓ Python mastery (pandas, numpy)\n✓ Data structures & algorithms\n✓ SQL for data querying\n✓ Git & collaboration\n\n🧠 Phase 3: ML Fundamentals (4-5 months)\n✓ Supervised learning (regression, classification)\n✓ Unsupervised learning (clustering, PCA)\n✓ scikit-learn library\n✓ Model evaluation metrics\n✓ Feature engineering\n\n🚀 Phase 4: Deep Learning (4-6 months)\n✓ Neural networks from scratch\n✓ TensorFlow / PyTorch\n✓ CNNs (computer vision)\n✓ RNNs/LSTMs (NLP)\n✓ Transformers & attention\n\n⚡ Phase 5: Specialization (Ongoing)\nChoose your path:\n• NLP: GPT, BERT, LLMs\n• Computer Vision: YOLO, ResNet\n• Reinforcement Learning: OpenAI Gym\n• MLOps: Docker, Kubernetes, AWS\n\n💼 Job-Ready Skills:\n✓ 3-5 end-to-end ML projects\n✓ Kaggle competitions (Bronze+)\n✓ Research paper implementations\n✓ Model deployment experience\n✓ Technical blog writing\n\n🎯 Salary Expectations (India):\n• Junior (0-2 yrs): ₹8-15 LPA\n• Mid-level (2-5 yrs): ₹15-30 LPA\n• Senior (5+ yrs): ₹30-60 LPA\n• Top companies: ₹50L - ₹2Cr\n\n📚 Best Free Resources:\n1. Andrew Ng's ML Course (Coursera)\n2. Fast.ai (Practical Deep Learning)\n3. Hugging Face tutorials\n4. Papers with Code\n\nReady to start? I can suggest your first project!`,
      suggestions: ["What's MLOps?", "Suggest an AI project for beginners", "How to prepare for ML interviews?"]
    };
  }

  // React learning resources
  if (msg.includes('react') || msg.includes('frontend') || msg.includes('javascript') || msg.includes('learn')) {
    return {
      content: `⚛️ Complete React Learning Path 2026:\n\n🌱 Beginner Level (4-6 weeks)\n1. JavaScript ES6+ fundamentals\n   • Arrow functions, destructuring\n   • Promises, async/await\n   • Array methods (map, filter, reduce)\n\n2. React Basics\n   ✓ Components & Props\n   ✓ State & Lifecycle\n   ✓ Event handling\n   ✓ Conditional rendering\n   ✓ Lists & Keys\n\n📚 Resources:\n• Official React docs (start here!)\n• freeCodeCamp React course\n• Scrimba Interactive tutorials\n• Traversy Media YouTube\n\n🚀 Intermediate (6-8 weeks)\n3. Advanced Concepts\n   ✓ Hooks (useState, useEffect, custom)\n   ✓ Context API for state management\n   ✓ React Router for navigation\n   ✓ Forms & validation\n   ✓ API integration (fetch, axios)\n\n4. Modern Tools\n   ✓ Vite for fast builds\n   ✓ TypeScript integration\n   ✓ Tailwind CSS styling\n   ✓ ESLint & Prettier\n\n📚 Resources:\n• React docs (Advanced Guides)\n• Kent C. Dodds courses\n• Josh Comeau blog\n• UI.dev\n\n⚡ Advanced (2-3 months)\n5. Production Skills\n   ✓ Next.js (SSR, SSG)\n   ✓ State management (Zustand, Redux)\n   ✓ Testing (Jest, React Testing Library)\n   ✓ Performance optimization\n   ✓ Accessibility (a11y)\n\n6. Ecosystem\n   ✓ Framer Motion animations\n   ✓ React Query (data fetching)\n   ✓ shadcn/ui components\n   ✓ Deployment (Vercel, Netlify)\n\n🎯 Project Ideas:\n1. Todo App (Beginner)\n2. Weather Dashboard (Intermediate)\n3. E-commerce Store (Advanced)\n4. Real-time Chat App (Expert)\n\n💡 Pro Tips:\n• Build projects, not just tutorials\n• Read other people's code on GitHub\n• Contribute to open source\n• Write technical blogs\n\n🔥 Trending in 2026:\n• React Server Components\n• Suspense for data fetching\n• React 19 features\n• AI-powered React tools\n\nWant specific resource links or code examples?`,
      suggestions: ["What are React Hooks?", "How to use Context API?", "Suggest a React project idea"]
    };
  }

  // Skill gap analysis
  if (msg.includes('skill') || msg.includes('gap') || msg.includes('missing') || msg.includes('should')) {
    return {
      content: `🎯 Personalized Skill Gap Analysis:\n\nBased on your profile, here's what you have vs. what top roles need:\n\n✅ Your Current Skills:\n• React, TypeScript, Node.js\n• UI/UX Design\n• Problem Solving\n\n📊 Skills Gap for Target Roles:\n\n1️⃣ Full Stack Developer:\n   Missing:\n   • ❌ Database (PostgreSQL/MongoDB)\n   • ❌ Docker & Kubernetes\n   • ❌ CI/CD pipelines\n   • ❌ System Design\n   Priority: HIGH\n   Time needed: 3-4 months\n\n2️⃣ Frontend Lead:\n   Missing:\n   • ⚠️ Testing (Jest, Cypress)\n   • ⚠️ State management (Redux)\n   • ⚠️ Performance optimization\n   Priority: MEDIUM\n   Time needed: 2 months\n\n3️⃣ AI/ML Engineer:\n   Missing:\n   • ❌ Python & ML libraries\n   • ❌ Statistics & Math\n   • ❌ Deep Learning\n   Priority: VERY HIGH\n   Time needed: 6-8 months\n\n💡 Recommended Learning Path:\nWeek 1-4: PostgreSQL + Express.js\nWeek 5-8: Docker basics + AWS\nWeek 9-12: System Design patterns\n\n🚀 Quick Wins (This Month):\n1. Complete testing course → +skill badge\n2. Build full-stack project → portfolio boost\n3. Contribute to open source → credibility\n\nWant personalized resource recommendations?`,
      suggestions: ["How to learn Docker?", "Suggest a full-stack project", "What is system design?"]
    };
  }

  // Pitch Deck
  if (msg.includes('pitch') || msg.includes('deck') || msg.includes('startup')) {
    return {
      content: `🚀 Crafting a Winning Pitch Deck:\n\n1. **The Hook**: Start with a compelling problem statement.\n2. **The Solution**: How does your project solve it uniquely?\n3. **The Demo**: Focus on 1-2 "Wow" features.\n4. **The Tech**: Briefly explain your choice of stack.\n5. **The Team**: Why are you the best people to build this?\n\nKeep it under 3 minutes and focus on IMPACT.`,
      suggestions: ["Write a 30s elevator pitch", "Review my project description", "Hackathon presentation tips"]
    };
  }

  // Default responses with variety
  return {
    content: `👋 *Neural handshake established.* \n\nI'm processing at peak efficiency. I can help you architect your next startup, find your technical soulmate, or just debug that one stubborn semicolon.\n\nWhat high-impact objective are we tackling today?`,
    suggestions: ["Suggest a hackathon idea", "How to improve my rank?", "Resources for React"]
  };
};

export function AIAssistant() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [thinkingStage, setThinkingStage] = useState(thinkingStages[0]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [aiStats, setAiStats] = useState({ latency: 0.4, wisdom: 99, context: 128 });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Dynamic AI Stats Simulation
  useEffect(() => {
    if (isTyping) {
      const interval = setInterval(() => {
        setAiStats({
          latency: Number((0.3 + Math.random() * 0.4).toFixed(2)),
          wisdom: 95 + Math.floor(Math.random() * 5),
          context: 128 + Math.floor(Math.random() * 4)
        });
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setAiStats({ latency: 0.32, wisdom: 99, context: 128 });
    }
  }, [isTyping]);

  useEffect(() => {
    const hour = new Date().getHours();
    const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

    setMessages([
      {
        id: '1',
        role: 'assistant',
        content: `👋 ${greeting}, ${user?.name || 'there'}! *Neural Core v2 system check: 100% OK.*\n\nI'm your personalized silicon-based consultant. Whether you need a billion-dollar hackathon idea or a teammate who won't ghost you, I've got the data. \n\nWhat's on the roadmap today?`,
        timestamp: new Date(),
      },
    ]);
  }, [user?.name]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async (customInput?: string) => {
    const textToSend = customInput || input;
    if (!textToSend.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: textToSend,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev.filter(m => m.id !== 'suggestions'), userMessage]);
    setInput('');
    setIsTyping(true);
    setSuggestions([]);

    // Simulate real AI thinking stages
    for (let i = 0; i < thinkingStages.length - 1; i++) {
      setThinkingStage(thinkingStages[i]);
      await new Promise(resolve => setTimeout(resolve, 600 + Math.random() * 400));
    }

    // Generate AI response
    const responseData = generateAIResponse(textToSend);
    const aiResponse: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: responseData.content,
      timestamp: new Date(),
    };

    setIsTyping(false);
    setMessages(prev => [...prev, aiResponse]);

    // Add suggestions after a small delay to feel more active
    setTimeout(() => {
      setSuggestions(responseData.suggestions);
    }, 500);
  };

  const handleQuickPrompt = (prompt: string) => {
    handleSend(prompt);
  };

  const handleCopy = (content: string) => {
    copyToClipboard(content);
  };

  const handleReset = () => {
    if (confirm('Clear all chat history?')) {
      const hour = new Date().getHours();
      const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
      setMessages([
        {
          id: '1',
          role: 'assistant',
          content: `👋 ${greeting}! I've cleared our chat history. How can I help you start fresh?`,
          timestamp: new Date(),
        },
      ]);
      setSuggestions([]);
    }
  };

  return (
    <DashboardLayout>
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4 relative">
          <motion.div
            animate={{
              boxShadow: ["0 0 0px rgba(79, 70, 229, 0)", "0 0 20px rgba(79, 70, 229, 0.4)", "0 0 0px rgba(79, 70, 229, 0)"]
            }}
            transition={{ duration: 3, repeat: Infinity }}
            className="h-14 w-14 rounded-2xl bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-600 flex items-center justify-center shadow-lg flex-shrink-0"
          >
            <Bot className="h-8 w-8 text-white" />
          </motion.div>
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-2">
              CollabNest <span className="text-indigo-600">AI</span>
            </h1>
            <p className="text-gray-500 flex items-center gap-2 font-medium">
              <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
              Neural Engine Optimized
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-100 font-bold px-3 py-1">v2.4 Pro</Badge>
          <Button
            variant="outline"
            onClick={handleReset}
            className="rounded-xl border-gray-200 hover:bg-gray-50 font-semibold transition-all hover:shadow-md h-10"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Clear
          </Button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 items-start">
        {/* Left Column - AI Recommended & Tips */}
        <div className="w-full lg:w-72 space-y-6 flex-shrink-0">
          {/* AI Recommended Resources */}
          <Card className="border-none premium-shadow transition-all hover:shadow-xl rounded-2xl overflow-hidden bg-white group">
            <CardHeader className="pb-3 px-5 pt-5 flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
                <Sparkles className="h-3 w-3 text-yellow-500" />
                Featured for you
              </CardTitle>
              <div className="h-1.5 w-1.5 rounded-full bg-indigo-500 animate-pulse"></div>
            </CardHeader>
            <CardContent className="space-y-4 px-5 pb-5">
              {[
                {
                  title: 'Advanced React Hooks',
                  type: 'Course • High Match',
                  icon: BookOpen,
                  color: 'text-blue-600 bg-blue-50',
                  link: '/resources',
                },
                {
                  title: 'Fullstack Roadmap',
                  type: 'Resource • Trending',
                  icon: Lightbulb,
                  color: 'text-purple-600 bg-purple-50',
                  link: '/resources',
                },
                {
                  title: 'Smart Matching',
                  type: 'Algorithm • 98% Match',
                  icon: Users,
                  color: 'text-green-600 bg-green-50',
                  link: '/match',
                },
              ].map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => window.location.href = item.link}
                  className="w-full text-left flex items-center gap-3 group/item p-1 hover:bg-gray-50 rounded-xl transition-all"
                >
                  <div className={`${item.color} h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform group-hover/item:scale-110 shadow-sm font-bold`}>
                    <item.icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-bold text-gray-900 truncate group-hover/item:text-indigo-600 transition-colors">
                      {item.title}
                    </div>
                    <div className="text-[11px] font-medium text-gray-500">{item.type}</div>
                  </div>
                </button>
              ))}
            </CardContent>
          </Card>

          {/* Tips Card */}
          <Card className="border-none premium-shadow rounded-2xl overflow-hidden bg-white">
            <CardHeader className="pb-3 px-5 pt-5">
              <CardTitle className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
                <Zap className="h-3 w-3 text-orange-500" />
                Quick Insights
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xs font-medium text-gray-600 space-y-4 px-5 pb-5">
              <div className="flex gap-3 bg-orange-50/50 p-3 rounded-xl border border-orange-100/50">
                <span className="text-orange-500 font-bold">•</span>
                <span>Ask for specific tech stacks for better project ideas.</span>
              </div>
              <div className="flex gap-3 bg-blue-50/50 p-3 rounded-xl border border-blue-100/50">
                <span className="text-blue-500 font-bold">•</span>
                <span>Paste your code to get an AI peer review.</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Center Column - Stats Banner & Chat Area */}
        <div className="flex-1 w-full space-y-6 min-w-0">
          {/* Stats Bar - Horizontal Layout */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="bg-gradient-to-r from-indigo-700 via-purple-700 to-indigo-800 text-white border-none shadow-xl rounded-[2.5rem] overflow-hidden relative group">
              <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <CardContent className="p-6 md:p-8">
                <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                  <div className="flex items-center gap-5">
                    <div className="h-14 w-14 rounded-2xl bg-white/10 backdrop-blur-xl flex items-center justify-center border border-white/20 shadow-inner">
                      <Sparkles className="h-7 w-7 text-indigo-200" />
                    </div>
                    <div>
                      <div className="font-black text-2xl tracking-tighter uppercase italic">Neural Core v2</div>
                      <div className="text-sm text-indigo-100/80 font-semibold">Active reasoning enabled</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-12 md:gap-16">
                    <div className="text-center">
                      <div className="text-[10px] uppercase tracking-widest text-indigo-200/60 font-black mb-1">Latency</div>
                      <motion.div
                        animate={{ opacity: [1, 0.7, 1] }}
                        className="text-3xl font-black tracking-tighter"
                      >
                        {aiStats.latency}<span className="text-indigo-300 text-lg">s</span>
                      </motion.div>
                    </div>
                    <div className="text-center">
                      <div className="text-[10px] uppercase tracking-widest text-indigo-200/60 font-black mb-1">Wisdom</div>
                      <div className="text-3xl font-black tracking-tighter">{aiStats.wisdom}<span className="text-indigo-300 text-lg">%</span></div>
                    </div>
                    <div className="text-center">
                      <div className="text-[10px] uppercase tracking-widest text-indigo-200/60 font-black mb-1">Context</div>
                      <div className="text-3xl font-black tracking-tighter">{aiStats.context}<span className="text-indigo-300 text-lg">k</span></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Chat Container */}
          <Card className="h-[calc(100vh-380px)] min-h-[600px] flex flex-col border-none premium-shadow rounded-[3rem] overflow-hidden bg-white/80 backdrop-blur-xl border border-white/50">
            <div className="flex-1 overflow-y-auto p-5 md:p-10 space-y-8 no-scrollbar">
              <AnimatePresence mode="popLayout">
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    layout
                    initial={{ opacity: 0, y: 20, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    className={`flex gap-5 ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                  >
                    {message.role === 'assistant' ? (
                      <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-indigo-50 to-white flex items-center justify-center flex-shrink-0 shadow-sm border border-indigo-100">
                        <Bot className="h-7 w-7 text-indigo-600" />
                      </div>
                    ) : (
                      <div className="h-12 w-12 rounded-2xl bg-indigo-600 flex items-center justify-center flex-shrink-0 text-white shadow-lg shadow-indigo-100">
                        <Users className="h-7 w-7" />
                      </div>
                    )}

                    <div className={`max-w-[85%] md:max-w-[70%] flex flex-col ${message.role === 'user' ? 'items-end' : 'items-start'}`}>
                      <div
                        className={`rounded-[2rem] px-8 py-5 shadow-sm relative group ${message.role === 'user'
                          ? 'bg-indigo-600 text-white rounded-tr-none'
                          : 'bg-white text-gray-800 border border-gray-100 rounded-tl-none shadow-md shadow-gray-100/50'
                          }`}
                      >
                        <p className="text-[15px] md:text-[16px] font-medium whitespace-pre-wrap leading-relaxed">
                          {message.content}
                        </p>

                        {message.role === 'assistant' && (
                          <div className="flex items-center gap-5 mt-6 pt-5 border-t border-gray-100">
                            <button
                              onClick={() => handleCopy(message.content)}
                              className="text-[10px] font-black text-gray-400 hover:text-indigo-600 flex items-center gap-2 transition-colors uppercase tracking-widest"
                            >
                              <Copy className="h-4 w-4" />
                              Copy Logic
                            </button>
                            <div className="flex items-center gap-3">
                              <button className="text-gray-400 hover:text-green-600 transition-colors p-1 hover:bg-green-50 rounded-lg">
                                <ThumbsUp className="h-4 w-4" />
                              </button>
                              <button className="text-gray-400 hover:text-red-600 transition-colors p-1 hover:bg-red-50 rounded-lg">
                                <ThumbsDown className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-5"
                >
                  <div className="h-12 w-12 rounded-2xl bg-gray-50 flex items-center justify-center border border-gray-100">
                    <Bot className="h-7 w-7 text-indigo-600 animate-pulse" />
                  </div>
                  <div className="bg-white border border-gray-100 rounded-[2rem] px-8 py-5 shadow-sm">
                    <div className="flex flex-col gap-2">
                      <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest flex items-center gap-2">
                        <Loader2 className="h-3 w-3 animate-spin" />
                        {thinkingStage}
                      </span>
                      <div className="flex gap-2">
                        {[0, 0.2, 0.4].map((delay, i) => (
                          <motion.div
                            key={i}
                            className="h-2 w-2 rounded-full bg-indigo-300"
                            animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }}
                            transition={{ duration: 1, repeat: Infinity, delay }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Suggestions */}
              {suggestions.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-wrap gap-2 pt-2 pl-16"
                >
                  {suggestions.map((suggestion, i) => (
                    <button
                      key={i}
                      onClick={() => handleSend(suggestion)}
                      className="px-4 py-2 rounded-full bg-indigo-50 text-indigo-600 text-xs font-bold border border-indigo-100 hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
                    >
                      {suggestion}
                    </button>
                  ))}
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Premium Input Container */}
            <div className="p-6 md:p-10 bg-white/50 border-t border-gray-100">
              <div className="relative flex items-center">
                <Input
                  placeholder="Ask me to debug, brainstorm or roadmap..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
                  className="h-16 pl-8 pr-20 bg-white border-2 border-gray-100 rounded-[1.5rem] focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all text-base font-semibold shadow-inner"
                  disabled={isTyping}
                />
                <Button
                  onClick={() => handleSend()}
                  disabled={!input.trim() || isTyping}
                  className="absolute right-2.5 h-11 w-11 p-0 rounded-2xl bg-indigo-600 hover:bg-indigo-700 shadow-xl shadow-indigo-100 z-10 hover:scale-105 transition-transform"
                >
                  {isTyping ? (
                    <Loader2 className="h-6 w-6 animate-spin" />
                  ) : (
                    <Send className="h-6 w-6" />
                  )}
                </Button>
              </div>
              <div className="mt-5 flex items-center justify-center gap-3 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                <Zap className="h-3.5 w-3.5 text-yellow-500" />
                Context-Aware Intelligence Active
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column - Quick Prompts */}
        <div className="w-full lg:w-80 space-y-6 flex-shrink-0">
          <Card className="border-none premium-shadow rounded-2xl overflow-hidden h-full min-h-[550px] flex flex-col bg-white/90 backdrop-blur-md">
            <CardHeader className="pb-4 px-6 pt-8">
              <div className="flex items-center justify-between">
                <CardTitle className="text-[11px] font-black uppercase tracking-widest text-indigo-600 flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  Shortcuts
                </CardTitle>
                <div className="px-2 py-0.5 rounded-full bg-indigo-100 text-[9px] font-black text-indigo-600">NEW</div>
              </div>
            </CardHeader>
            <CardContent className="px-5 pb-6 flex-1 space-y-4 overflow-y-auto max-h-[500px] no-scrollbar">
              {quickPrompts.map((prompt, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickPrompt(prompt.desc)}
                  className="w-full text-left p-5 rounded-2xl border border-gray-50 bg-gray-50/30 hover:bg-white hover:border-indigo-100 transition-all group shadow-sm hover:shadow-lg hover:-translate-y-1"
                >
                  <div className="flex items-start gap-4">
                    <div className={`${prompt.color} h-12 w-12 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm group-hover:rotate-6 transition-transform`}>
                      <prompt.icon className="h-6 w-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{prompt.category}</span>
                      </div>
                      <div className="text-sm font-black text-gray-900 truncate tracking-tighter">{prompt.title}</div>
                      <div className="text-[11px] font-semibold text-gray-500/80 line-clamp-1 mt-1 group-hover:text-indigo-600 transition-colors">{prompt.desc}</div>
                    </div>
                  </div>
                </button>
              ))}
            </CardContent>
            <div className="p-6 pt-0 mt-auto">
              <Button
                variant="ghost"
                className="w-full rounded-2xl bg-indigo-50/50 hover:bg-indigo-600 hover:text-white text-indigo-600 text-[10px] font-black uppercase tracking-[0.2em] h-12 border border-indigo-100/50 transition-all"
              >
                View Academy
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}