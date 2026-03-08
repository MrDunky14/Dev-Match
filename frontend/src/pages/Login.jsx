import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser } from '../api';
import { useIdentity } from '../hooks/useIdentity';
import { useToast } from '../components/Toast';
import { Eye, EyeOff } from 'lucide-react';
import './Login.css';

export default function Login() {
    const navigate = useNavigate();
    const { setCurrentUser } = useIdentity();
    const toast = useToast();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        if (!email.trim() || !password) return;
        setError('');
        setLoading(true);
        try {
            const res = await loginUser({ email: email.trim().toLowerCase(), password });
            setCurrentUser(res.data.user, res.data.access_token);
            toast.success(`Welcome back, ${res.data.user.name.split(' ')[0]}!`);
            navigate('/');
        } catch (err) {
            if (err.response?.status === 401) {
                setError('Invalid email or password.');
            } else if (err.response?.status === 404) {
                setError('No account found with this email. Create a profile first!');
            } else {
                setError(err.response?.data?.detail || 'Something went wrong. Please try again.');
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

                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <div className="password-input-wrapper">
                                <input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="form-input"
                                    required
                                    minLength={6}
                                />
                                <button
                                    type="button"
                                    className="password-toggle"
                                    onClick={() => setShowPassword(!showPassword)}
                                    tabIndex={-1}
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        {error && (
                            <div className="login-error">
                                <span>⚠️</span> {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            className="btn btn-primary btn-lg login-btn"
                            disabled={loading || !email.trim() || !password}
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
