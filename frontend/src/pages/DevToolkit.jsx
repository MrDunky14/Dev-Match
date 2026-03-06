import { useState } from 'react';
import { motion } from 'framer-motion';
import { Wrench } from 'lucide-react';
import './DevToolkit.css';

const TOOLKIT_CATEGORIES = [
    {
        id: 'practice',
        emoji: '🧠',
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
        emoji: '📚',
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
        emoji: '🛠️',
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
        emoji: '🎨',
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
        emoji: '🤖',
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
        id: 'career',
        emoji: '📝',
        title: 'Resume & Career',
        description: 'Get noticed and get hired',
        links: [
            { name: 'Overleaf', url: 'https://overleaf.com', desc: 'LaTeX resumes that stand out' },
            { name: 'LinkedIn', url: 'https://linkedin.com', desc: 'Build your professional network' },
            { name: 'Unstop', url: 'https://unstop.com', desc: 'Hackathons, competitions, and internships' },
            { name: 'AngelList', url: 'https://wellfound.com', desc: 'Startup jobs and remote opportunities' },
        ]
    },
    {
        id: 'community',
        emoji: '💬',
        title: 'Communities',
        description: 'Connect with developers worldwide',
        links: [
            { name: 'Dev.to', url: 'https://dev.to', desc: 'Write and read developer blogs' },
            { name: 'Reddit r/webdev', url: 'https://reddit.com/r/webdev', desc: 'Web dev discussions and advice' },
            { name: 'Stack Overflow', url: 'https://stackoverflow.com', desc: 'Get answers to any coding question' },
            { name: 'Discord (SLR Tech)', url: '#', desc: 'SLRTCE developers hangout (coming soon)' },
        ]
    }
];

export default function DevToolkit() {
    const [activeCategory, setActiveCategory] = useState(null);

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
                        Your curated launchpad to the best developer tools on the internet.
                        <br />No clones, no fluff — just direct links to what actually works.
                    </p>
                </motion.div>

                <div className="toolkit-filter">
                    <button
                        className={`filter-chip ${activeCategory === null ? 'active' : ''}`}
                        onClick={() => setActiveCategory(null)}
                    >All</button>
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
                                            <span className="link-arrow">↗</span>
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
