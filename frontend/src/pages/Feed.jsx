import React from 'react';
import { motion } from 'framer-motion';
import DevlogFeed from '../components/DevlogFeed';

export default function Feed() {
    return (
        <motion.div
            className="page"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
        >
            <div className="container" style={{ maxWidth: '800px', margin: '0 auto' }}>
                <div className="page-header text-center" style={{ marginBottom: '32px' }}>
                    <h1>Campus Developer Feed</h1>
                    <p>See what everyone is building, sharing, and reacting to in real-time.</p>
                </div>
                <DevlogFeed />
            </div>
        </motion.div>
    );
}
