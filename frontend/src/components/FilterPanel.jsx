import { useState } from 'react';
import './FilterPanel.css';

const DEPARTMENTS = [
    'All Departments',
    'Computer Science',
    'Information Technology',
    'Data Science',
    'Design',
    'Electronics',
    'Mechanical',
];

const SEMESTERS = [1, 2, 3, 4, 5, 6, 7, 8];

export default function FilterPanel({ skills, filters, onChange }) {
    const [showAllSkills, setShowAllSkills] = useState(false);

    const visibleSkills = showAllSkills ? skills : skills.slice(0, 10);

    const handleChange = (key, value) => {
        onChange({ ...filters, [key]: value });
    };

    return (
        <div className="filter-panel glass-card">
            <h3 className="filter-title">
                <span>🎯</span> Filters
            </h3>

            {/* Search */}
            <div className="filter-section">
                <label className="filter-label">Search</label>
                <input
                    type="text"
                    placeholder="Search by name…"
                    className="form-input filter-search"
                    value={filters.search || ''}
                    onChange={(e) => handleChange('search', e.target.value)}
                />
            </div>

            {/* Department */}
            <div className="filter-section">
                <label className="filter-label">Department</label>
                <select
                    className="form-select"
                    value={filters.department || ''}
                    onChange={(e) => handleChange('department', e.target.value)}
                >
                    {DEPARTMENTS.map((dept) => (
                        <option key={dept} value={dept === 'All Departments' ? '' : dept}>
                            {dept}
                        </option>
                    ))}
                </select>
            </div>

            {/* Semester */}
            <div className="filter-section">
                <label className="filter-label">Semester</label>
                <div className="semester-chips">
                    <button
                        className={`semester-chip ${!filters.semester ? 'active' : ''}`}
                        onClick={() => handleChange('semester', '')}
                    >
                        All
                    </button>
                    {SEMESTERS.map((sem) => (
                        <button
                            key={sem}
                            className={`semester-chip ${filters.semester === sem ? 'active' : ''}`}
                            onClick={() => handleChange('semester', sem)}
                        >
                            {sem}
                        </button>
                    ))}
                </div>
            </div>

            {/* Skills */}
            {skills.length > 0 && (
                <div className="filter-section">
                    <label className="filter-label">Skill</label>
                    <div className="skill-chips">
                        <button
                            className={`skill-chip ${!filters.skill ? 'active' : ''}`}
                            onClick={() => handleChange('skill', '')}
                        >
                            All Skills
                        </button>
                        {visibleSkills.map((skill) => (
                            <button
                                key={skill}
                                className={`skill-chip ${filters.skill === skill ? 'active' : ''}`}
                                onClick={() => handleChange('skill', skill)}
                            >
                                {skill}
                            </button>
                        ))}
                    </div>
                    {skills.length > 10 && (
                        <button
                            className="show-more-btn"
                            onClick={() => setShowAllSkills(!showAllSkills)}
                        >
                            {showAllSkills ? 'Show less ▲' : `Show all ${skills.length} skills ▼`}
                        </button>
                    )}
                </div>
            )}

            {/* Reset */}
            <button
                className="btn btn-ghost filter-reset"
                onClick={() => onChange({ search: '', department: '', semester: '', skill: '' })}
            >
                ✕ Reset Filters
            </button>
        </div>
    );
}
