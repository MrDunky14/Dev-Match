import { createContext, useContext, useState, useEffect } from 'react';
import { getUser } from '../api';

const IdentityContext = createContext(null);

export function IdentityProvider({ children }) {
    const [currentUser, setCurrentUserState] = useState(null);
    const [loading, setLoading] = useState(true);

    // Load from localStorage on mount
    useEffect(() => {
        const savedId = localStorage.getItem('devmatch_user_id');
        if (savedId) {
            getUser(parseInt(savedId))
                .then((r) => setCurrentUserState(r.data))
                .catch(() => {
                    localStorage.removeItem('devmatch_user_id');
                })
                .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, []);

    const setCurrentUser = (user) => {
        if (user) {
            localStorage.setItem('devmatch_user_id', user.id);
            setCurrentUserState(user);
        }
    };

    const logout = () => {
        localStorage.removeItem('devmatch_user_id');
        setCurrentUserState(null);
    };

    return (
        <IdentityContext.Provider value={{ currentUser, setCurrentUser, logout, loading }}>
            {children}
        </IdentityContext.Provider>
    );
}

export function useIdentity() {
    const ctx = useContext(IdentityContext);
    if (!ctx) throw new Error('useIdentity must be used within IdentityProvider');
    return ctx;
}
