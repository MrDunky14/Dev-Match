import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getUserByEmail } from '../api';
import { useIdentity } from '../hooks/useIdentity';
import './Login.css';

export default function Login() {
    const navigate = useNavigate();
    const { setCurrentUser } = useIdentity();
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        if (!email.trim()) return;
        setError('');
        setLoading(true);
        try {
            const res = await getUserByEmail(email.trim().toLowerCase());
            setCurrentUser(res.data);
            navigate('/');
        } catch (err) {
            if (err.response?.status === 404) {
                setError('No account found with this email. Create a profile first!');
            } else {
                setError('Something went wrong. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            <div className="login-container">
                <div className="login-card glass-card slide-up">
                    <div className="login-header">
                        <span className="login-icon">⚡</span>
                        <h1>Welcome Back</h1>
                        <p>Log in to your Dev<span className="brand-accent">Match</span> account</p>
                    </div>

                    <form onSubmit={handleLogin} className="login-form">
                        <div className="form-group">
                            <label htmlFor="email">College Email</label>
                            <input
                                id="email"
                                type="email"
                                placeholder="your.name@slrtce.in"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="form-input"
                                autoFocus
                                required
                            />
                        </div>

                        {error && (
                            <div className="login-error">
                                <span>⚠️</span> {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            className="btn btn-primary btn-lg login-btn"
                            disabled={loading || !email.trim()}
                        >
                            {loading ? 'Logging in...' : 'Log In →'}
                        </button>
                    </form>

                    <div className="login-divider">
                        <span>New to DevMatch?</span>
                    </div>

                    <Link to="/create-profile" className="btn btn-secondary btn-lg login-btn">
                        Create Profile ✨
                    </Link>
                </div>
            </div>
        </div>
    );
}
