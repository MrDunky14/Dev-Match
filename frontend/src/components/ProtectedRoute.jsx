import { Navigate } from 'react-router-dom';
import { useIdentity } from '../hooks/useIdentity';

export default function ProtectedRoute({ children }) {
    const { currentUser, loading } = useIdentity();

    if (loading) {
        return (
            <div className="page" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
                <div className="skeleton" style={{ width: 200, height: 40, borderRadius: 12 }} />
            </div>
        );
    }

    if (!currentUser) {
        return <Navigate to="/login" replace />;
    }

    return children;
}
