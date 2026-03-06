import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Rocket, Code2, Users, FileEdit, Sparkles } from 'lucide-react';
import { getStats, getUsers } from '../api';
import ProfileCard from '../components/ProfileCard';
import DevlogFeed from '../components/DevlogFeed';
import './Home.css';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15,
            delayChildren: 0.1
        }
    }
};

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: { type: "spring", stiffness: 300, damping: 24 }
    }
};

export default function Home() {
    const [stats, setStats] = useState({ total_developers: 0, total_projects: 0, total_skills: 0, open_projects: 0 });
    const [featured, setFeatured] = useState([]);

    useEffect(() => {
        getStats().then((r) => setStats(r.data)).catch(() => { });
        getUsers().then((r) => setFeatured(r.data.slice(0, 3))).catch(() => { });
    }, []);

    return (
        <div className="home-page">
            {/* Hero */}
            <section className="hero">
                <div className="container hero-inner">
                    <motion.div
                        className="hero-content"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        <motion.span variants={itemVariants} className="hero-badge">
                            <Sparkles size={16} className="badge-icon" /> SLRTCE Team Finder
                        </motion.span>
                        <motion.h1 variants={itemVariants} className="hero-title">
                            Find Your Perfect
                            <span className="hero-highlight"> Dev Partner</span>
                        </motion.h1>
                        <motion.p variants={itemVariants} className="hero-subtitle">
                            No great project should die because you couldn't find a teammate.
                            Discover developers by skill, semester, and department — all within SLRTCE.
                        </motion.p>
                        <motion.div variants={itemVariants} className="hero-actions">
                            <Link to="/discover" className="btn btn-primary btn-lg">
                                <Search size={20} /> Browse Developers
                            </Link>
                            <Link to="/projects" className="btn btn-secondary btn-lg">
                                <Rocket size={20} /> View Projects
                            </Link>
                        </motion.div>
                    </motion.div>

                    <motion.div
                        className="hero-visual"
                        initial={{ opacity: 0, scale: 0.9, rotateY: 15 }}
                        animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                        transition={{ duration: 0.8, type: "spring", bounce: 0.2 }}
                    >
                        <div className="hero-glow"></div>
                        <motion.div
                            className="hero-orb hero-orb-1"
                            animate={{ y: [0, -20, 0], x: [0, 10, 0] }}
                            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                        />
                        <motion.div
                            className="hero-orb hero-orb-2"
                            animate={{ y: [0, 20, 0], x: [0, -15, 0] }}
                            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                        />
                        <motion.div className="hero-code-card glass-card" whileHover={{ y: -5, scale: 1.02 }}>
                            <div className="code-dots">
                                <span></span><span></span><span></span>
                            </div>
                            <pre className="code-content">
                                {`const team = await DevMatch
  .find({
    skills: ["React", "Node.js"],
    semester: 6,
    department: "CS"
  });

// `}<span style={{ color: "#06d6a0" }}>✔</span>{` 3 matches found!`}
                            </pre>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Main Content Layout */}
            <section className="main-content-section">
                <div className="container home-grid">

                    {/* Left Column: Live Feed */}
                    <div className="feed-column">
                        <DevlogFeed />
                    </div>

                    {/* Right Column: Stats & Featured */}
                    <div className="sidebar-column">

                        {/* Stats */}
                        <motion.div
                            className="stats-sidebar glass-card"
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                        >
                            <h3 className="sidebar-title"><Sparkles size={18} className="title-icon" /> Platform Stats</h3>
                            <div className="stat-row">
                                <span className="stat-row-label">Developers</span>
                                <span className="stat-row-value">{stats.total_developers}</span>
                            </div>
                            <div className="stat-row">
                                <span className="stat-row-label">Projects</span>
                                <span className="stat-row-value">{stats.total_projects}</span>
                            </div>
                            <div className="stat-row">
                                <span className="stat-row-label">Skills</span>
                                <span className="stat-row-value">{stats.total_skills}</span>
                            </div>
                        </motion.div>

                        {/* Featured Devs */}
                        {featured.length > 0 && (
                            <motion.div
                                className="featured-sidebar"
                                initial={{ opacity: 0, x: 20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true, margin: "-100px" }}
                            >
                                <div className="featured-header">
                                    <h3 className="sidebar-title"><Users size={18} className="title-icon" /> Featured</h3>
                                    <Link to="/discover" className="btn btn-ghost btn-sm">View all</Link>
                                </div>
                                <div className="featured-list">
                                    {featured.map((user) => (
                                        <ProfileCard key={user.id} user={user} />
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </div>
                </div>
            </section>

            {/* How it works */}
            <section className="how-section">
                <div className="container">
                    <motion.h2
                        className="section-title"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        How It Works
                    </motion.h2>
                    <motion.div
                        className="steps-grid"
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                    >
                        <motion.div variants={itemVariants} className="step-card glass-card" whileHover={{ y: -5 }}>
                            <span className="step-icon"><FileEdit size={32} /></span>
                            <h3>Create Your Profile</h3>
                            <p>List your tech stack, semester, and interests so others can find you.</p>
                        </motion.div>
                        <motion.div variants={itemVariants} className="step-card glass-card" whileHover={{ y: -5 }}>
                            <span className="step-icon"><Search size={32} /></span>
                            <h3>Discover Teammates</h3>
                            <p>Browse and filter developers by skills, department, or semester.</p>
                        </motion.div>
                        <motion.div variants={itemVariants} className="step-card glass-card" whileHover={{ y: -5 }}>
                            <span className="step-icon"><Code2 size={32} /></span>
                            <h3>Build Together</h3>
                            <p>Post your project idea or join one that excites you.</p>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* CTA */}
            <section className="cta-section">
                <div className="container">
                    <motion.div
                        className="cta-card glass-card"
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        viewport={{ once: true }}
                    >
                        <h2>Ready to find your next teammate?</h2>
                        <p>Join Dev-Match today and never let a great idea go to waste.</p>
                        <div className="cta-actions">
                            <Link to="/create-profile" className="btn btn-primary btn-lg">
                                <Sparkles size={20} /> Create Profile
                            </Link>
                            <Link to="/post-project" className="btn btn-secondary btn-lg">
                                <FileEdit size={20} /> Post a Project
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}
