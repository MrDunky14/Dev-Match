import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';
import './NotFound.css';

export default function NotFound() {
    return (
        <div className="page notfound-page">
            <div className="container">
                <div className="notfound-card glass-card slide-up">
                    <span className="notfound-code">404</span>
                    <h1>Page Not Found</h1>
                    <p>Looks like this route doesn't exist. Maybe the page was moved or you typed the URL wrong.</p>
                    <div className="notfound-actions">
                        <Link to="/" className="btn btn-primary">
                            <Home size={18} /> Go Home
                        </Link>
                        <button onClick={() => window.history.back()} className="btn btn-secondary">
                            <ArrowLeft size={18} /> Go Back
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
