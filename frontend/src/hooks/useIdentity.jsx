import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getMe, getUser } from '../api';

const IdentityContext = createContext(null);

export function IdentityProvider({ children }) {
    const [currentUser, setCurrentUserState] = useState(null);
    const [loading, setLoading] = useState(true);

    // Load from JWT token on mount
    useEffect(() => {
        const token = localStorage.getItem('devmatch_token');
        const savedId = localStorage.getItem('devmatch_user_id');

        if (token) {
            // Try to verify token via /auth/me
            getMe()
                .then((r) => {
                    setCurrentUserState(r.data);
                    localStorage.setItem('devmatch_user_id', r.data.id);
                })
                .catch(() => {
                    // Token expired or invalid — try legacy ID fallback
                    if (savedId) {
                        getUser(parseInt(savedId))
                            .then((r) => setCurrentUserState(r.data))
                            .catch(() => {
                                localStorage.removeItem('devmatch_token');
                                localStorage.removeItem('devmatch_user_id');
                            });
                    } else {
                        localStorage.removeItem('devmatch_token');
                    }
                })
                .finally(() => setLoading(false));
        } else if (savedId) {
            // Legacy: no token but has user_id
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

    const setCurrentUser = useCallback((user, token) => {
        if (user) {
            localStorage.setItem('devmatch_user_id', user.id);
            setCurrentUserState(user);
        }
        if (token) {
            localStorage.setItem('devmatch_token', token);
        }
    }, []);

    const refreshUser = useCallback(async () => {
        const token = localStorage.getItem('devmatch_token');
        if (token) {
            try {
                const r = await getMe();
                setCurrentUserState(r.data);
                return r.data;
            } catch {
                // ignore
            }
        }
        return null;
    }, []);

    const logout = useCallback(() => {
        localStorage.removeItem('devmatch_user_id');
        localStorage.removeItem('devmatch_token');
        setCurrentUserState(null);
    }, []);

    return (
        <IdentityContext.Provider value={{ currentUser, setCurrentUser, refreshUser, logout, loading }}>
            {children}
        </IdentityContext.Provider>
    );
}

export function useIdentity() {
    const ctx = useContext(IdentityContext);
    if (!ctx) throw new Error('useIdentity must be used within IdentityProvider');
    return ctx;
}
