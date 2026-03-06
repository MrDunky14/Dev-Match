import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getStats, getUsers } from '../api';
import ProfileCard from '../components/ProfileCard';
import DevlogFeed from '../components/DevlogFeed';
import './Home.css';

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
                    <div className="hero-content slide-up">
                        <span className="hero-badge">⚡ SLRTCE Team Finder</span>
                        <h1 className="hero-title">
                            Find Your Perfect
                            <span className="hero-highlight"> Dev Partner</span>
                        </h1>
                        <p className="hero-subtitle">
                            No great project should die because you couldn't find a teammate.
                            Discover developers by skill, semester, and department — all within SLRTCE.
                        </p>
                        <div className="hero-actions">
                            <Link to="/discover" className="btn btn-primary btn-lg">
                                Browse Developers 🔍
                            </Link>
                            <Link to="/projects" className="btn btn-secondary btn-lg">
                                View Projects 🚀
                            </Link>
                        </div>
                    </div>

                    <div className="hero-visual">
                        <div className="hero-glow"></div>
                        <div className="hero-orb hero-orb-1"></div>
                        <div className="hero-orb hero-orb-2"></div>
                        <div className="hero-orb hero-orb-3"></div>
                        <div className="hero-code-card glass-card">
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

// 🎯 3 matches found!`}
                            </pre>
                        </div>
                    </div>
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
                        <div className="stats-sidebar glass-card">
                            <h3 className="sidebar-title">Platform Stats 🚀</h3>
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
                        </div>

                        {/* Featured Devs */}
                        {featured.length > 0 && (
                            <div className="featured-sidebar">
                                <div className="featured-header">
                                    <h3 className="sidebar-title">Featured ✨</h3>
                                    <Link to="/discover" className="btn btn-ghost btn-sm">View all</Link>
                                </div>
                                <div className="featured-list">
                                    {featured.map((user) => (
                                        <ProfileCard key={user.id} user={user} />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* How it works */}
            <section className="how-section">
                <div className="container">
                    <h2 className="section-title">How It Works</h2>
                    <div className="steps-grid stagger-children">
                        <div className="step-card glass-card">
                            <span className="step-icon">📝</span>
                            <h3>Create Your Profile</h3>
                            <p>List your tech stack, semester, and interests so others can find you.</p>
                        </div>
                        <div className="step-card glass-card">
                            <span className="step-icon">🔍</span>
                            <h3>Discover Teammates</h3>
                            <p>Browse and filter developers by skills, department, or semester.</p>
                        </div>
                        <div className="step-card glass-card">
                            <span className="step-icon">🚀</span>
                            <h3>Build Together</h3>
                            <p>Post your project idea or join one that excites you.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="cta-section">
                <div className="container">
                    <div className="cta-card glass-card">
                        <h2>Ready to find your next teammate?</h2>
                        <p>Join Dev-Match today and never let a great idea go to waste.</p>
                        <div className="cta-actions">
                            <Link to="/create-profile" className="btn btn-primary btn-lg">
                                Create Profile ✨
                            </Link>
                            <Link to="/post-project" className="btn btn-secondary btn-lg">
                                Post a Project 📋
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
