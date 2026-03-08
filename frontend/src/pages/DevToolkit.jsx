import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Wrench, TrendingUp, Lightbulb, BookOpen, ExternalLink } from 'lucide-react';
import { useIdentity } from '../hooks/useIdentity';
import { getSkillTrends } from '../api';
import './DevToolkit.css';

const SKILL_ROADMAPS = {
    'React': { path: 'Frontend', next: ['TypeScript', 'Next.js', 'Redux', 'Testing Library'], learn: 'https://react.dev/learn' },
    'Node.js': { path: 'Backend', next: ['Express', 'PostgreSQL', 'Docker', 'Redis'], learn: 'https://nodejs.org/en/learn' },
    'Python': { path: 'Backend / ML', next: ['FastAPI', 'Django', 'TensorFlow', 'Pandas'], learn: 'https://docs.python.org/3/tutorial/' },
    'Flutter': { path: 'Mobile', next: ['Dart', 'Firebase', 'Riverpod', 'GraphQL'], learn: 'https://flutter.dev/learn' },
    'TypeScript': { path: 'Full-Stack', next: ['React', 'Node.js', 'Prisma', 'tRPC'], learn: 'https://www.typescriptlang.org/docs/' },
    'MongoDB': { path: 'Database', next: ['Mongoose', 'Aggregation', 'Redis', 'PostgreSQL'], learn: 'https://university.mongodb.com/' },
    'PostgreSQL': { path: 'Database', next: ['SQLAlchemy', 'Prisma', 'Supabase', 'Redis'], learn: 'https://www.postgresqltutorial.com/' },
    'Docker': { path: 'DevOps', next: ['Kubernetes', 'CI/CD', 'AWS', 'Terraform'], learn: 'https://docs.docker.com/get-started/' },
    'TensorFlow': { path: 'ML/AI', next: ['PyTorch', 'Keras', 'NLP', 'Computer Vision'], learn: 'https://www.tensorflow.org/tutorials' },
    'Firebase': { path: 'Backend', next: ['Firestore', 'Cloud Functions', 'Authentication', 'Hosting'], learn: 'https://firebase.google.com/docs' },
    'CSS': { path: 'Frontend', next: ['Tailwind CSS', 'Sass', 'Animations', 'Responsive Design'], learn: 'https://web.dev/learn/css' },
    'Figma': { path: 'Design', next: ['Auto Layout', 'Components', 'Prototyping', 'Design Systems'], learn: 'https://www.figma.com/resources/learn-design/' },
    'AWS': { path: 'Cloud', next: ['EC2', 'S3', 'Lambda', 'CloudFormation'], learn: 'https://aws.amazon.com/training/digital/' },
    'Solidity': { path: 'Web3', next: ['Hardhat', 'Ethers.js', 'OpenZeppelin', 'IPFS'], learn: 'https://docs.soliditylang.org/' },
};

const PROJECT_IDEAS = [
    { title: 'AI Study Buddy', desc: 'Chat with your notes using RAG + LLM', skills: ['Python', 'TensorFlow', 'React'], difficulty: 'Hard' },
    { title: 'Campus Event Tracker', desc: 'Real-time event board for college clubs', skills: ['React', 'Node.js', 'MongoDB'], difficulty: 'Medium' },
    { title: 'Code Snippet Manager', desc: 'Save, tag, and search your code snippets', skills: ['React', 'Firebase', 'TypeScript'], difficulty: 'Easy' },
    { title: 'Budget Splitter', desc: 'Split expenses with hostel-mates', skills: ['Flutter', 'Firebase'], difficulty: 'Medium' },
    { title: 'Resume Builder', desc: 'Markdown-based resume with live preview', skills: ['React', 'CSS', 'Node.js'], difficulty: 'Easy' },
    { title: 'Placement Prep Dashboard', desc: 'DSA tracker with spaced repetition', skills: ['React', 'Python', 'PostgreSQL'], difficulty: 'Medium' },
    { title: 'Smart Attendance', desc: 'Face-recognition attendance system', skills: ['Python', 'TensorFlow', 'Flask'], difficulty: 'Hard' },
    { title: 'College Marketplace', desc: 'Buy/sell used books and gadgets', skills: ['React', 'Node.js', 'MongoDB'], difficulty: 'Medium' },
];

const TOOLKIT_CATEGORIES = [
    {
        id: 'practice',
        emoji: '\u{1F9E0}',
        title: 'Practice & DSA',
        description: 'Master data structures and algorithms',
        links: [
            { name: 'LeetCode', url: 'https://leetcode.com', desc: 'The gold standard for coding interviews' },
            { name: 'NeetCode', url: 'https://neetcode.io', desc: 'Curated roadmap to crack any interview' },
            { name: 'Codeforces', url: 'https://codeforces.com', desc: 'Competitive programming contests' },
            { name: 'HackerRank', url: 'https://hackerrank.com', desc: 'Practice by domain — SQL, Regex, and more' },
        ]
    },
    {
        id: 'learning',
        emoji: '\u{1F4DA}',
        title: 'Learning',
        description: 'Level up your skills for free',
        links: [
            { name: 'freeCodeCamp', url: 'https://freecodecamp.org', desc: '10,000+ hours of free coding curriculum' },
            { name: 'CS50 (Harvard)', url: 'https://cs50.harvard.edu', desc: 'The best intro to CS course, period' },
            { name: 'The Odin Project', url: 'https://theodinproject.com', desc: 'Full-stack web dev, project-based' },
            { name: 'Roadmap.sh', url: 'https://roadmap.sh', desc: 'Role-based developer roadmaps' },
        ]
    },
    {
        id: 'devtools',
        emoji: '\u{1F6E0}\u{FE0F}',
        title: 'Dev Tools & Hosting',
        description: 'Ship your projects to the world',
        links: [
            { name: 'GitHub Student Pack', url: 'https://education.github.com/pack', desc: 'Free tools worth $200K+ for students' },
            { name: 'Vercel', url: 'https://vercel.com', desc: 'Deploy frontend in seconds' },
            { name: 'Render', url: 'https://render.com', desc: 'Free backend & database hosting' },
            { name: 'Railway', url: 'https://railway.app', desc: 'Ship code without worrying about infra' },
        ]
    },
    {
        id: 'design',
        emoji: '\u{1F3A8}',
        title: 'Design & UI',
        description: 'Make your projects look professional',
        links: [
            { name: 'Figma', url: 'https://figma.com', desc: 'The industry-standard design tool (free!)' },
            { name: 'Dribbble', url: 'https://dribbble.com', desc: 'UI inspiration from top designers' },
            { name: 'Coolors', url: 'https://coolors.co', desc: 'Generate perfect color palettes instantly' },
            { name: 'Google Fonts', url: 'https://fonts.google.com', desc: 'Free professional fonts for any project' },
        ]
    },
    {
        id: 'ai',
        emoji: '\u{1F916}',
        title: 'AI Tools',
        description: 'Supercharge your productivity',
        links: [
            { name: 'ChatGPT', url: 'https://chat.openai.com', desc: 'The AI everyone knows — debug, brainstorm, write' },
            { name: 'Claude', url: 'https://claude.ai', desc: 'Best for long code analysis and reasoning' },
            { name: 'GitHub Copilot', url: 'https://github.com/features/copilot', desc: 'AI pair programmer — free for students' },
            { name: 'v0.dev', url: 'https://v0.dev', desc: 'Generate UI components with a prompt' },
        ]
    },
    {
        id: 'hackathons',
        emoji: '\u{1F3C6}',
        title: 'Hackathons & Competitions',
        description: 'Compete, build, and win prizes',
        links: [
            { name: 'Devfolio', url: 'https://devfolio.co', desc: 'India\'s biggest hackathon platform' },
            { name: 'MLH', url: 'https://mlh.io', desc: 'Major League Hacking — global student hackathons' },
            { name: 'Unstop', url: 'https://unstop.com', desc: 'Competitions, hackathons, and internships' },
            { name: 'Devpost', url: 'https://devpost.com', desc: 'Global hackathon listings with prizes' },
        ]
    },
    {
        id: 'career',
        emoji: '\u{1F4DD}',
        title: 'Resume & Career',
        description: 'Get noticed and get hired',
        links: [
            { name: 'Overleaf', url: 'https://overleaf.com', desc: 'LaTeX resumes that stand out' },
            { name: 'LinkedIn', url: 'https://linkedin.com', desc: 'Build your professional network' },
            { name: 'AngelList', url: 'https://wellfound.com', desc: 'Startup jobs and remote opportunities' },
            { name: 'Internshala', url: 'https://internshala.com', desc: 'Internships across India' },
        ]
    },
    {
        id: 'community',
        emoji: '\u{1F4AC}',
        title: 'Communities',
        description: 'Connect with developers worldwide',
        links: [
            { name: 'Dev.to', url: 'https://dev.to', desc: 'Write and read developer blogs' },
            { name: 'Reddit r/webdev', url: 'https://reddit.com/r/webdev', desc: 'Web dev discussions and advice' },
            { name: 'Stack Overflow', url: 'https://stackoverflow.com', desc: 'Get answers to any coding question' },
            { name: 'Discord (SLR Tech)', url: '#', desc: 'SLRTCE developers hangout (coming soon)' },
        ]
    },
    {
        id: 'opensource',
        emoji: '\u{1F30D}',
        title: 'Open Source',
        description: 'Contribute and build your portfolio',
        links: [
            { name: 'Good First Issues', url: 'https://goodfirstissues.com', desc: 'Find beginner-friendly open source issues' },
            { name: 'Up For Grabs', url: 'https://up-for-grabs.net', desc: 'Curated list of projects for new contributors' },
            { name: 'First Timers Only', url: 'https://www.firsttimersonly.com', desc: 'Resources to make your first open source PR' },
            { name: 'GSoC', url: 'https://summerofcode.withgoogle.com', desc: 'Google Summer of Code — paid open source experience' },
        ]
    },
];

export default function DevToolkit() {
    const { currentUser } = useIdentity();
    const [activeCategory, setActiveCategory] = useState(null);
    const [trendingSkills, setTrendingSkills] = useState([]);

    useEffect(() => {
        getSkillTrends().then(r => setTrendingSkills(r.data.top_skills?.slice(0, 5) || [])).catch(() => {});
    }, []);

    const userSkills = currentUser?.skills?.map(s => typeof s === 'string' ? s : s.skill_name) || [];
    const recommendations = userSkills
        .filter(s => SKILL_ROADMAPS[s])
        .map(s => ({ skill: s, ...SKILL_ROADMAPS[s] }))
        .slice(0, 3);

    const relevantProjects = PROJECT_IDEAS
        .filter(p => p.skills.some(s => userSkills.includes(s)))
        .slice(0, 4);
    const fallbackProjects = relevantProjects.length > 0 ? relevantProjects : PROJECT_IDEAS.slice(0, 4);

    return (
        <motion.div
            className="toolkit-page"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
        >
            <div className="container">
                <motion.div
                    className="toolkit-header"
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                    <h1 className="toolkit-title" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
                        <Wrench size={36} color="var(--accent-cyan)" /> Dev Toolkit
                    </h1>
                    <p className="toolkit-subtitle">
                        Your curated launchpad — tools, learning paths, project ideas, and hackathon resources.
                    </p>
                </motion.div>

                {/* Personalized Learning Path */}
                {recommendations.length > 0 && (
                    <motion.div
                        className="toolkit-section"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        <div className="section-header">
                            <h2><TrendingUp size={22} className="title-icon" /> Your Learning Path</h2>
                            <p>Based on your skills — here's what to learn next</p>
                        </div>
                        <div className="roadmap-grid">
                            {recommendations.map(rec => (
                                <div key={rec.skill} className="roadmap-card glass-card">
                                    <div className="roadmap-top">
                                        <span className="roadmap-skill">{rec.skill}</span>
                                        <span className="roadmap-path">{rec.path}</span>
                                    </div>
                                    <p className="roadmap-label">Learn next:</p>
                                    <div className="roadmap-next">
                                        {rec.next.map(n => (
                                            <span key={n} className="roadmap-tag">{n}</span>
                                        ))}
                                    </div>
                                    <a href={rec.learn} target="_blank" rel="noopener noreferrer" className="roadmap-link">
                                        <BookOpen size={14} /> Official Docs <ExternalLink size={12} />
                                    </a>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* Trending skills across campus */}
                {trendingSkills.length > 0 && (
                    <motion.div
                        className="toolkit-section"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.15 }}
                    >
                        <div className="section-header">
                            <h2><TrendingUp size={22} className="title-icon" /> Trending at SLRTCE</h2>
                            <p>Most popular skills across campus right now</p>
                        </div>
                        <div className="trending-chips">
                            {trendingSkills.map((s, i) => (
                                <span key={s.skill} className="trending-chip">
                                    <span className="trending-rank">#{i + 1}</span> {s.skill}
                                    <span className="trending-count">{s.count} devs</span>
                                </span>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* Project Ideas */}
                <motion.div
                    className="toolkit-section"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <div className="section-header">
                        <h2><Lightbulb size={22} className="title-icon" /> Project Ideas {currentUser ? 'For You' : ''}</h2>
                        <p>{currentUser ? 'Matched to your skills' : 'Build something awesome this semester'}</p>
                    </div>
                    <div className="ideas-grid">
                        {fallbackProjects.map(idea => (
                            <div key={idea.title} className="idea-card glass-card">
                                <div className="idea-top">
                                    <h3>{idea.title}</h3>
                                    <span className={`idea-difficulty ${idea.difficulty.toLowerCase()}`}>{idea.difficulty}</span>
                                </div>
                                <p className="idea-desc">{idea.desc}</p>
                                <div className="idea-skills">
                                    {idea.skills.map(s => (
                                        <span key={s} className={`idea-skill ${userSkills.includes(s) ? 'matched' : ''}`}>{s}</span>
                                    ))}
                                </div>
                                <Link to="/post-project" className="idea-action">Use as project idea →</Link>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Resource Directory */}
                <div className="toolkit-filter">
                    <button
                        className={`filter-chip ${activeCategory === null ? 'active' : ''}`}
                        onClick={() => setActiveCategory(null)}
                    >All Resources</button>
                    {TOOLKIT_CATEGORIES.map(cat => (
                        <button
                            key={cat.id}
                            className={`filter-chip ${activeCategory === cat.id ? 'active' : ''}`}
                            onClick={() => setActiveCategory(activeCategory === cat.id ? null : cat.id)}
                        >{cat.emoji} {cat.title}</button>
                    ))}
                </div>

                <div className="toolkit-grid stagger-children">
                    {TOOLKIT_CATEGORIES
                        .filter(cat => activeCategory === null || activeCategory === cat.id)
                        .map(category => (
                            <div key={category.id} className="toolkit-category">
                                <div className="category-header">
                                    <span className="category-emoji">{category.emoji}</span>
                                    <div>
                                        <h2 className="category-title">{category.title}</h2>
                                        <p className="category-desc">{category.description}</p>
                                    </div>
                                </div>
                                <div className="links-grid">
                                    {category.links.map(link => (
                                        <a
                                            key={link.name}
                                            href={link.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="link-card glass-card"
                                        >
                                            <div className="link-name">{link.name}</div>
                                            <div className="link-desc">{link.desc}</div>
                                            <span className="link-arrow">\u2197</span>
                                        </a>
                                    ))}
                                </div>
                            </div>
                        ))}
                </div>
            </div>
        </motion.div>
    );
}
