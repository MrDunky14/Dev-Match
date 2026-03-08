import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Rocket, FileText } from 'lucide-react';
import { getProjects, getSkills } from '../api';
import ProjectCard from '../components/ProjectCard';
import './HelpWanted.css';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1 }
    }
};

export default function HelpWanted() {
    const [projects, setProjects] = useState([]);
    const [skills, setSkills] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({ search: '', skill: '', status: 'open' });

    const fetchProjects = useCallback(async () => {
        setLoading(true);
        try {
            const params = {};
            if (filters.search) params.search = filters.search;
            if (filters.skill) params.skill = filters.skill;
            if (filters.status) params.status = filters.status;
            const res = await getProjects(params);
            setProjects(res.data);
        } catch (err) {
            console.error('Failed to fetch projects:', err);
        } finally {
            setLoading(false);
        }
    }, [filters]);

    useEffect(() => {
        fetchProjects();
    }, [fetchProjects]);

    useEffect(() => {
        getSkills().then((r) => setSkills(r.data)).catch(() => { });
    }, []);

    return (
        <div className="page">
            <div className="container">
                <div className="page-header">
                    <h1>Help Wanted Board <Rocket size={28} className="title-icon offset-icon" /></h1>
                    <p>Find exciting projects that need your skills</p>
                </div>

                {/* Filter Bar */}
                <div className="hw-filters glass-card">
                    <input
                        type="text"
                        className="form-input"
                        placeholder="Search projects…"
                        value={filters.search}
                        onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                    />

                    <select
                        className="form-select"
                        value={filters.skill}
                        onChange={(e) => setFilters({ ...filters, skill: e.target.value })}
                    >
                        <option value="">All Skills</option>
                        {skills.map((s) => (
                            <option key={s} value={s}>{s}</option>
                        ))}
                    </select>

                    <select
                        className="form-select"
                        value={filters.status}
                        onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                    >
                        <option value="">All Status</option>
                        <option value="open">Open</option>
                        <option value="in_progress">In Progress</option>
                        <option value="showcase">Showcase</option>
                        <option value="closed">Closed</option>
                    </select>
                </div>

                {/* Results */}
                {loading ? (
                    <div className="card-grid">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="skeleton-card skeleton" style={{ height: 320 }} />
                        ))}
                    </div>
                ) : projects.length === 0 ? (
                    <div className="empty-state glass-card">
                        <FileText size={48} className="empty-icon" style={{ color: 'var(--text-muted)', marginBottom: 16 }} />
                        <h3>No projects found</h3>
                        <p>Be the first to post a project idea!</p>
                    </div>
                ) : (
                    <>
                        <div className="results-count" style={{ marginTop: 24, marginBottom: 16 }}>
                            <span>{projects.length} project{projects.length !== 1 ? 's' : ''} found</span>
                        </div>
                        <motion.div
                            className="card-grid"
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                        >
                            {projects.map((proj) => (
                                <ProjectCard key={proj.id} project={proj} />
                            ))}
                        </motion.div>
                    </>
                )}
            </div>
        </div>
    );
}
