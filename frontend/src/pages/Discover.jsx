import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { getUsers, getSkills } from '../api';
import { useIdentity } from '../hooks/useIdentity';
import ProfileCard from '../components/ProfileCard';
import FilterPanel from '../components/FilterPanel';
import './Discover.css';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1 }
    }
};

export default function Discover() {
    const { currentUser } = useIdentity();
    const [users, setUsers] = useState([]);
    const [skills, setSkills] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        search: '',
        department: '',
        semester: '',
        skill: '',
        availability: '',
    });

    const fetchUsers = useCallback(async () => {
        setLoading(true);
        try {
            const params = {};
            if (filters.search) params.search = filters.search;
            if (filters.department) params.department = filters.department;
            if (filters.semester) params.semester = filters.semester;
            if (filters.skill) params.skill = filters.skill;
            if (filters.availability) params.availability = filters.availability;
            const res = await getUsers(params);
            setUsers(res.data);
        } catch (err) {
            console.error('Failed to fetch users:', err);
        } finally {
            setLoading(false);
        }
    }, [filters]);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    useEffect(() => {
        getSkills().then((r) => setSkills(r.data)).catch(() => { });
    }, []);

    return (
        <div className="page">
            <div className="container">
                <div className="page-header">
                    <h1>Discover Developers</h1>
                    <p>Browse SLRTCE talent and find your next project partner</p>
                </div>

                <div className="discover-layout">
                    <aside className="discover-sidebar">
                        <FilterPanel skills={skills} filters={filters} onChange={setFilters} />
                    </aside>

                    <main className="discover-main">
                        {loading ? (
                            <div className="card-grid">
                                {[1, 2, 3, 4, 5, 6].map(i => (
                                    <div key={i} className="skeleton" style={{ height: 350, borderRadius: 16 }}></div>
                                ))}
                            </div>
                        ) : users.length === 0 ? (
                            <div className="empty-state glass-card">
                                <h3>No developers found</h3>
                                <p>Try adjusting your search or filters.</p>
                            </div>
                        ) : (
                            <>
                                <div className="results-count">
                                    <span>{users.length} developer{users.length !== 1 ? 's' : ''} found</span>
                                </div>
                                <motion.div
                                    className="card-grid stagger-children"
                                    variants={containerVariants}
                                    initial="hidden"
                                    animate="visible"
                                >
                                    {users.map((user) => (
                                        <ProfileCard key={user.id} user={user} currentUser={currentUser} />
                                    ))}
                                </motion.div>
                            </>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
}
