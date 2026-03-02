import { useState, useEffect, useCallback } from 'react';
import { getUsers, getSkills } from '../api';
import ProfileCard from '../components/ProfileCard';
import FilterPanel from '../components/FilterPanel';
import './Discover.css';

export default function Discover() {
    const [users, setUsers] = useState([]);
    const [skills, setSkills] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        search: '',
        department: '',
        semester: '',
        skill: '',
    });

    const fetchUsers = useCallback(async () => {
        setLoading(true);
        try {
            const params = {};
            if (filters.search) params.search = filters.search;
            if (filters.department) params.department = filters.department;
            if (filters.semester) params.semester = filters.semester;
            if (filters.skill) params.skill = filters.skill;
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
                    <p>Browse campus talent and find your next teammate</p>
                </div>

                <div className="discover-layout">
                    <aside className="discover-sidebar">
                        <FilterPanel skills={skills} filters={filters} onChange={setFilters} />
                    </aside>

                    <main className="discover-main">
                        {loading ? (
                            <div className="card-grid">
                                {[1, 2, 3, 4, 5, 6].map((i) => (
                                    <div key={i} className="skeleton-card skeleton" style={{ height: 280 }} />
                                ))}
                            </div>
                        ) : users.length === 0 ? (
                            <div className="empty-state">
                                <span className="empty-icon">🔍</span>
                                <h3>No developers found</h3>
                                <p>Try adjusting your filters or search term</p>
                            </div>
                        ) : (
                            <>
                                <div className="results-count">
                                    <span>{users.length} developer{users.length !== 1 ? 's' : ''} found</span>
                                </div>
                                <div className="card-grid stagger-children">
                                    {users.map((user) => (
                                        <ProfileCard key={user.id} user={user} />
                                    ))}
                                </div>
                            </>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
}
