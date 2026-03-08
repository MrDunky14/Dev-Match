import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useIdentity } from '../hooks/useIdentity';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';
import API from '../api';
import { motion } from 'framer-motion';

const GitHubCallback = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { currentUser, refreshUser } = useIdentity();

    const [status, setStatus] = useState('loading'); // loading, success, error
    const [errorMsg, setErrorMsg] = useState('');

    useEffect(() => {
        const code = searchParams.get('code');
        const token = localStorage.getItem('devmatch_token');

        if (!code) {
            setStatus('error');
            setErrorMsg('No authorization code found.');
            return;
        }

        if (!token) {
            setStatus('error');
            setErrorMsg('You must be logged in to link your GitHub account.');
            return;
        }

        const verifyGitHub = async () => {
            try {
                const response = await API.post(`/github/verify?code=${code}`, {});

                if (response.data.status === 'success') {
                    setStatus('success');
                    // Refresh the user context so the app knows we are verified now
                    await refreshUser();

                    // Redirect back to profile after a short delay
                    setTimeout(() => {
                        navigate('/profile');
                    }, 2000);
                }
            } catch (err) {
                setStatus('error');
                setErrorMsg(err.response?.data?.detail || 'Failed to verify GitHub account. Make sure you have a verified @slrtce.in email on GitHub.');
            }
        };

        verifyGitHub();
    }, [searchParams, navigate, refreshUser]);

    return (
        <div className="min-h-screen bg-black/95 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-md w-full bg-zinc-900 border border-zinc-800 rounded-xl p-8 text-center"
            >
                {status === 'loading' && (
                    <div className="flex flex-col items-center">
                        <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
                        <h2 className="text-xl font-bold text-white mb-2">Verifying GitHub Account...</h2>
                        <p className="text-zinc-400">Please wait while we securely link your account.</p>
                    </div>
                )}

                {status === 'success' && (
                    <div className="flex flex-col items-center">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 200, damping: 10 }}
                        >
                            <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
                        </motion.div>
                        <h2 className="text-2xl font-bold text-white mb-2">Verification Successful!</h2>
                        <p className="text-zinc-400">Your GitHub account has been linked and your student status is verified. Redirecting you back...</p>
                    </div>
                )}

                {status === 'error' && (
                    <div className="flex flex-col items-center">
                        <XCircle className="w-12 h-12 text-red-500 mb-4" />
                        <h2 className="text-xl font-bold text-white mb-2">Verification Failed</h2>
                        <p className="text-red-400 mb-6">{errorMsg}</p>
                        <button
                            onClick={() => navigate('/profile')}
                            className="px-6 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-colors"
                        >
                            Return to Profile
                        </button>
                    </div>
                )}
            </motion.div>
        </div>
    );
};

export default GitHubCallback;
