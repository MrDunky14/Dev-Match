import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
    Search,
    SlidersHorizontal,
    MapPin,
    CheckCircle2,
    X,
    Heart,
    Star,
    Image as ImageIcon,
    User,
    Bot,
    Zap,
    ExternalLink,
    Briefcase,
    GraduationCap,
    ChevronDown,
    ArrowLeft,
    MessageSquare,
    Calendar,
    RotateCcw,
    Filter,
    Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router';
import { DashboardLayout } from '../components/DashboardLayout';
import { useAuth } from '../contexts/AuthContext';
import { mockUsers, mockCurrentUser } from '../lib/mockData';
import { generateMatches, simulateMutualLike } from '../lib/matchingAlgorithm';
import { Match as MatchType, User as UserType } from '../lib/types';
import { addActivity } from '../lib/userStats';

const ConfettiParticle = ({ delay, x, color }: { delay: number; x: number; color: string }) => (
    <motion.div
        className="absolute top-0 rounded-sm pointer-events-none"
        style={{ left: `${x}%`, backgroundColor: color, width: 8, height: 10 }}
        initial={{ y: -20, opacity: 1, rotate: 0 }}
        animate={{ y: 700, opacity: [1, 1, 0.5, 0], rotate: [0, 120, 270, 360] }}
        transition={{ duration: 2.8 + Math.random(), delay, ease: 'easeIn' }}
    />
);

const SparkBurst = () => (
    <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: [0, 1.5, 2], opacity: [0, 0.8, 0] }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="absolute inset-0 z-0 bg-gradient-radial from-yellow-400 via-purple-500/30 to-transparent rounded-full"
    />
);

const MatchCelebration = ({
    match,
    currentUser,
    onStartChat,
    onKeepSwiping,
}: {
    match: MatchType;
    currentUser: UserType;
    onStartChat: () => void;
    onKeepSwiping: () => void;
}) => {
    const colors = ['#7C3AED', '#A855F7', '#EC4899', '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#FFD700'];

    useEffect(() => {
        const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3');
        audio.volume = 0.4;
        audio.play().catch(e => console.log('Audio play failed:', e));
    }, []);

    const particles = Array.from({ length: 60 }, (_, i) => ({
        id: i,
        delay: Math.random() * 1.2,
        x: Math.random() * 100,
        color: colors[Math.floor(Math.random() * colors.length)],
    }));

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 backdrop-blur-md p-4"
        >
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {particles.map(p => (
                    <ConfettiParticle key={p.id} delay={p.delay} x={p.x} color={p.color} />
                ))}
            </div>

            <motion.div
                initial={{ scale: 0.4, opacity: 0, y: 100 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.85, opacity: 0, y: 20 }}
                transition={{ type: 'spring', damping: 15, stiffness: 200 }}
                className="relative max-w-sm w-full"
            >
                <SparkBurst />
                <div className="relative bg-white rounded-[3rem] shadow-2xl overflow-hidden border-8 border-white">
                    <div className="h-2 bg-gradient-to-r from-[#7C3AED] via-[#FFD700] to-[#EC4899] animate-gradient-x" />
                    <div className="p-10 text-center">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.4, type: 'spring' }}
                            className="inline-flex items-center gap-2 bg-yellow-400 text-gray-900 text-[10px] font-black tracking-widest uppercase px-5 py-2 rounded-full shadow-lg mb-6"
                        >
                            <Sparkles size={14} className="animate-spin-slow" />
                            Perfect Connection Found
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.7 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.5 }}
                            className="mb-8"
                        >
                            <h2 className="text-5xl font-black text-gray-900 tracking-tighter leading-none mb-1">
                                IT'S A <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500">MATCH!</span>
                            </h2>
                            <div className="flex justify-center gap-1">
                                {[...Array(3)].map((_, i) => (
                                    <motion.div
                                        key={i}
                                        animate={{ opacity: [0, 1, 0], scale: [0.5, 1, 0.5] }}
                                        transition={{ duration: 1, repeat: Infinity, delay: i * 0.3 }}
                                    >
                                        <Star size={12} className="text-yellow-400 fill-yellow-400" />
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 }}
                            className="flex justify-center items-center mb-10 relative"
                        >
                            <div className="w-24 h-24 rounded-full border-4 border-white shadow-2xl overflow-hidden z-10 -mr-4 bg-gray-100">
                                <img
                                    src={currentUser.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.name)}&background=7C3AED&color=fff&size=200`}
                                    alt="You"
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            <motion.div
                                className="w-14 h-14 bg-gradient-to-br from-pink-500 to-red-500 rounded-full flex items-center justify-center z-20 shadow-xl border-4 border-white"
                                animate={{ scale: [1, 1.3, 1], rotate: [0, 15, -15, 0] }}
                                transition={{ duration: 1.2, repeat: Infinity }}
                            >
                                <Heart size={24} fill="white" className="text-white" />
                            </motion.div>

                            <div className="w-24 h-24 rounded-full border-4 border-white shadow-2xl overflow-hidden z-10 -ml-4 bg-gray-100">
                                <img
                                    src={match.user.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(match.user.name)}&background=7C3AED&color=fff&size=200`}
                                    alt={match.user.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.7 }}
                            className="mb-8"
                        >
                            <p className="text-gray-900 font-bold text-xl leading-tight">
                                <span className="text-purple-600">{match.user.name.split(' ')[0]}</span> matched with you!
                            </p>
                            <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mt-2">
                                Shared Interests: {match.skillOverlap.slice(0, 2).join(' • ')}
                            </p>
                        </motion.div>

                        <div className="space-y-4">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={onStartChat}
                                className="w-full h-16 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-black rounded-[20px] flex items-center justify-center gap-3 shadow-[0_10px_30px_-5px_rgba(124,58,237,0.4)] text-lg"
                            >
                                <MessageSquare size={22} />
                                SEND MESSAGE
                                <Zap size={18} fill="currentColor" />
                            </motion.button>
                            <button
                                onClick={onKeepSwiping}
                                className="w-full h-14 text-gray-500 font-black tracking-widest text-[10px] hover:text-gray-900 transition-colors"
                            >
                                KEEP SEARCHING
                            </button>
                        </div>
                    </div>
                </div>
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.9 }}
                    className="text-[10px] font-bold text-gray-300 uppercase tracking-widest mt-8 text-center"
                >
                    © CollabNest Discovery · Matching students since 2024
                </motion.p>
            </motion.div>
        </motion.div>
    );
};

// ─────────────────────────────────────────────
// MAIN MATCH PAGE
// ─────────────────────────────────────────────
export function Match() {
    const { user } = useAuth();
    const navigate = useNavigate();

    // Use logged-in user or fallback to mock
    const currentUser: UserType = {
        id: user?.email || mockCurrentUser.id,
        name: user?.name || mockCurrentUser.name,
        email: user?.email || mockCurrentUser.email,
        college: user?.college || mockCurrentUser.college,
        skills: mockCurrentUser.skills,
        interests: mockCurrentUser.interests,
        experience: mockCurrentUser.experience,
        bio: mockCurrentUser.bio,
        availability: mockCurrentUser.availability,
        profileImage: mockCurrentUser.profileImage,
    };

    // State
    const [matchQueue, setMatchQueue] = useState<MatchType[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [direction, setDirection] = useState<'left' | 'right' | null>(null);
    const [celebrationMatch, setCelebrationMatch] = useState<MatchType | null>(null);
    const [savedMatches, setSavedMatches] = useState<MatchType[]>([]);
    const [showSaved, setShowSaved] = useState(false);
    const [selectedSkill, setSelectedSkill] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const scrollRef = useRef<HTMLDivElement>(null);

    // Generate and shuffle queue on mount
    useEffect(() => {
        const queue = generateMatches(currentUser, mockUsers);
        setMatchQueue(queue);

        // Load saved matches from localStorage
        const storedMatches = localStorage.getItem(`savedMatches_${currentUser.id}`);
        if (storedMatches) {
            setSavedMatches(JSON.parse(storedMatches));
        }
    }, [currentUser.id]);

    // Filtered queue based on search/skill
    const filteredQueue = useMemo(() => {
        return matchQueue.filter(m => {
            const nameMatch = m.user.name.toLowerCase().includes(searchQuery.toLowerCase());
            const collegeMatch = m.user.college.toLowerCase().includes(searchQuery.toLowerCase());
            const skillMatch = !selectedSkill || m.user.skills.includes(selectedSkill) || m.skillOverlap.includes(selectedSkill);
            return (nameMatch || collegeMatch) && skillMatch;
        });
    }, [matchQueue, searchQuery, selectedSkill]);

    const currentMatch = filteredQueue[currentIndex];

    // ── Swipe logic with mutual-like simulation ──
    const handleSwipe = (dir: 'left' | 'right') => {
        if (!currentMatch) return;
        const candidate = currentMatch;
        setDirection(dir);

        setTimeout(() => {
            if (dir === 'right') {
                // Simulate whether they like you back — NOT always a match!
                const isMutualMatch = simulateMutualLike(candidate.compatibilityScore);
                if (isMutualMatch) {
                    setCelebrationMatch(candidate);
                    setSavedMatches(prev => {
                        const exists = prev.find(m => m.id === candidate.id);
                        const updated = exists ? prev : [candidate, ...prev];

                        // Persist to localStorage
                        localStorage.setItem(`savedMatches_${currentUser.id}`, JSON.stringify(updated));

                        // Update user stats if new match
                        if (!exists) {
                            addActivity(currentUser.id, 'match', `Matched with ${candidate.user.name}! 🎉`, 50);
                        }

                        return updated;
                    });
                }
            }
            setCurrentIndex(prev => prev + 1);
            setDirection(null);
            if (scrollRef.current) scrollRef.current.scrollTop = 0;
        }, 350);
    };

    const handleRestart = () => {
        const reshuffled = generateMatches(currentUser, mockUsers);
        setMatchQueue(reshuffled);
        setCurrentIndex(0);
        setSearchQuery('');
        setSelectedSkill(null);
    };

    const handleStartChat = () => {
        if (celebrationMatch) {
            localStorage.setItem(
                'newChatPartner',
                JSON.stringify({
                    id: celebrationMatch.id,
                    name: celebrationMatch.user.name,
                    image: celebrationMatch.user.profileImage,
                    role: celebrationMatch.user.college,
                })
            );
        }
        setCelebrationMatch(null);
        navigate('/messages');
    };

    // Keyboard shortcuts
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (celebrationMatch) return;
            if (e.key === 'ArrowLeft') handleSwipe('left');
            if (e.key === 'ArrowRight') handleSwipe('right');
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [celebrationMatch, currentIndex, filteredQueue]);

    // Skill filters derived from current queue
    const availableSkills = useMemo(() => {
        const all = matchQueue.flatMap(m => m.user.skills);
        const freq: Record<string, number> = {};
        all.forEach(s => (freq[s] = (freq[s] || 0) + 1));
        return Object.entries(freq)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 8)
            .map(([s]) => s);
    }, [matchQueue]);

    const currentStats = currentMatch
        ? { compatibility: currentMatch.compatibilityScore, overlap: currentMatch.skillOverlap.length, complementary: currentMatch.complementarySkills.length }
        : null;

    return (
        <DashboardLayout>
            {/* Match Celebration Overlay */}
            <AnimatePresence>
                {celebrationMatch && (
                    <MatchCelebration
                        match={celebrationMatch}
                        currentUser={currentUser}
                        onStartChat={handleStartChat}
                        onKeepSwiping={() => setCelebrationMatch(null)}
                    />
                )}
            </AnimatePresence>

            <div className="relative bg-[#F8FAFC] -m-8 min-h-screen">
                {/* Dynamic Background */}
                <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
                    <AnimatePresence>
                        {currentMatch && (
                            <motion.div
                                key={currentMatch.user.profileImage}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 0.2 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 1.2 }}
                                className="absolute inset-0"
                            >
                                <img
                                    src={currentMatch.user.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentMatch.user.name)}&background=7C3AED&color=fff&size=512`}
                                    alt=""
                                    className="w-full h-full object-cover blur-[100px] scale-110"
                                />
                                <div className="absolute inset-0 bg-white/30" />
                            </motion.div>
                        )}
                    </AnimatePresence>
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/10 to-white/40" />
                </div>

                <main className="relative z-10 p-6 lg:p-12 overflow-x-hidden">

                    {/* ── Header ── */}
                    <header className="mb-10 flex items-start justify-between flex-wrap gap-4">
                        <div>
                            <motion.h2
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-2xl md:text-4xl lg:text-6xl font-black tracking-tighter leading-[0.9] text-gray-900"
                            >
                                FIND THE BEST<br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7C3AED] via-[#A855F7] to-[#EC4899] uppercase">
                                    TEAMMATES
                                </span>
                            </motion.h2>
                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="text-gray-500 mt-3 text-base max-w-lg font-medium"
                            >
                                AI-powered discovery · Swipe right to connect · Not every swipe is a match!
                            </motion.p>
                        </div>

                        {savedMatches.length > 0 && (
                            <motion.button
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                whileHover={{ scale: 1.05 }}
                                onClick={() => setShowSaved(!showSaved)}
                                className="flex items-center gap-2 bg-white border-2 border-purple-100 rounded-2xl px-4 py-3 shadow-sm hover:shadow-md transition-all"
                            >
                                <Heart size={18} className="text-[#EC4899] fill-[#EC4899]" />
                                <span className="font-black text-gray-900">{savedMatches.length}</span>
                                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Matches</span>
                            </motion.button>
                        )}
                    </header>

                    {/* ── Saved Matches Panel ── */}
                    <AnimatePresence>
                        {showSaved && savedMatches.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="mb-8 overflow-hidden"
                            >
                                <div className="bg-white rounded-3xl p-6 border border-purple-100 shadow-sm">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="font-black text-gray-900 uppercase tracking-tight flex items-center gap-2">
                                            <Heart size={16} className="text-[#EC4899] fill-[#EC4899]" />
                                            Your Matches ({savedMatches.length})
                                        </h3>
                                        <button onClick={() => setShowSaved(false)} className="text-gray-400 hover:text-gray-600">
                                            <X size={18} />
                                        </button>
                                    </div>
                                    <div className="flex gap-5 overflow-x-auto pb-2 no-scrollbar">
                                        {savedMatches.map(m => (
                                            <motion.div
                                                key={m.id}
                                                whileHover={{ scale: 1.05 }}
                                                onClick={() => {
                                                    localStorage.setItem('newChatPartner', JSON.stringify({ id: m.id, name: m.user.name, image: m.user.profileImage, role: m.user.college }));
                                                    navigate('/messages');
                                                }}
                                                className="flex-shrink-0 flex flex-col items-center gap-1.5 cursor-pointer"
                                            >
                                                <div className="relative">
                                                    <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-purple-300">
                                                        <img
                                                            src={m.user.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(m.user.name)}&background=7C3AED&color=fff`}
                                                            alt={m.user.name}
                                                            className="w-full h-full object-cover"
                                                            referrerPolicy="no-referrer"
                                                            onError={e => { (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(m.user.name)}&background=7C3AED&color=fff`; }}
                                                        />
                                                    </div>
                                                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-[#7C3AED] rounded-full flex items-center justify-center">
                                                        <MessageSquare size={9} className="text-white" />
                                                    </div>
                                                </div>
                                                <p className="text-[10px] font-black text-gray-700">{m.user.name.split(' ')[0]}</p>
                                                <p className="text-[9px] font-bold text-emerald-500">{m.compatibilityScore}%</p>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-start">

                        {/* ── Left: AI Stats Panel ── */}
                        <div className="hidden lg:block lg:col-span-4 space-y-6">

                            {/* Smart Matching Card */}
                            <motion.div
                                key={`smart-${currentMatch?.id || 'empty'}`}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="bg-gradient-to-br from-[#7C3AED] to-[#A855F7] p-8 rounded-[2.5rem] text-white shadow-2xl shadow-purple-500/25 relative overflow-hidden group"
                            >
                                <div className="absolute -top-10 -right-10 w-44 h-44 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-all duration-700" />
                                <div className="relative z-10">
                                    <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-4 backdrop-blur-md">
                                        <Bot size={24} className="text-white" />
                                    </div>
                                    <h3 className="text-xl font-extrabold italic uppercase tracking-tighter mb-2">Smart Matching</h3>
                                    <p className="text-white/70 text-sm font-medium leading-relaxed">
                                        {currentMatch
                                            ? <>Analyzing <span className="text-white font-bold">{currentMatch.user.name}</span> for you in real-time.</>
                                            : 'No more profiles in this session.'}
                                    </p>
                                    {currentMatch && (
                                        <div className="mt-4 bg-white/10 rounded-xl p-3 text-xs font-semibold text-white/80 leading-relaxed">
                                            "{currentMatch.explanation}"
                                        </div>
                                    )}
                                </div>
                            </motion.div>

                            {/* Compatibility Stats */}
                            {currentStats && (
                                <motion.div
                                    key={`stats-${currentMatch?.id}`}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="glass-card rounded-[2.5rem] p-7 space-y-5"
                                >
                                    {[
                                        { label: 'Compatibility', value: `${currentStats.compatibility}%`, icon: Zap, color: 'text-[#EC4899]', bg: 'bg-pink-500/10' },
                                        { label: 'Shared Skills', value: `${currentStats.overlap}`, icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-400/10' },
                                        { label: 'New Skills You\'d Gain', value: `${currentStats.complementary}`, icon: Star, color: 'text-yellow-500', bg: 'bg-yellow-400/10' },
                                    ].map(item => (
                                        <div key={item.label} className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-9 h-9 rounded-full ${item.bg} flex items-center justify-center ${item.color}`}>
                                                    <item.icon size={16} />
                                                </div>
                                                <span className="text-xs font-bold uppercase tracking-widest text-gray-400">{item.label}</span>
                                            </div>
                                            <span className="text-xl font-extrabold text-gray-900">{item.value}</span>
                                        </div>
                                    ))}

                                    {currentMatch && (
                                        <div className="pt-4 border-t border-gray-100 space-y-3">
                                            {currentMatch.skillOverlap.length > 0 && (
                                                <div>
                                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Shared Skills</p>
                                                    <div className="flex flex-wrap gap-1.5">
                                                        {currentMatch.skillOverlap.slice(0, 4).map(s => (
                                                            <span key={s} className="px-2 py-1 bg-blue-50 text-blue-600 text-[10px] font-bold rounded-lg border border-blue-100">{s}</span>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                            {currentMatch.complementarySkills.length > 0 && (
                                                <div>
                                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">You'd Learn</p>
                                                    <div className="flex flex-wrap gap-1.5">
                                                        {currentMatch.complementarySkills.slice(0, 3).map(s => (
                                                            <span key={s} className="px-2 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-bold rounded-lg border border-emerald-100">{s}</span>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </motion.div>
                            )}

                            {/* Keyboard hint + actions */}
                            <div className="text-center text-[10px] font-bold text-gray-300 uppercase tracking-widest">← Pass &nbsp;|&nbsp; Like →</div>

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => navigate('/dashboard')}
                                className="w-full bg-gray-900 text-white py-4 rounded-2xl font-bold uppercase tracking-widest text-sm flex items-center justify-center gap-2"
                            >
                                <ArrowLeft size={16} />
                                Back to Dashboard
                            </motion.button>
                        </div>

                        {/* ── Right: Discovery Card ── */}
                        <div className="lg:col-span-8 flex flex-col items-center gap-6 w-full">

                            {/* Search + Skill Filters */}
                            <div className="w-full max-w-[440px] space-y-3">
                                <div className="relative">
                                    <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Search by name or college..."
                                        value={searchQuery}
                                        onChange={e => { setSearchQuery(e.target.value); setCurrentIndex(0); }}
                                        className="w-full bg-white border border-gray-200 rounded-2xl py-3 pl-10 pr-4 text-sm font-medium focus:ring-2 focus:ring-purple-300 outline-none shadow-sm"
                                    />
                                </div>
                                <div className="flex gap-2 overflow-x-auto no-scrollbar">
                                    {availableSkills.map(skill => (
                                        <button
                                            key={skill}
                                            onClick={() => { setSelectedSkill(selectedSkill === skill ? null : skill); setCurrentIndex(0); }}
                                            className={`flex-shrink-0 px-3 py-1.5 rounded-full text-[10px] font-bold transition-all border ${selectedSkill === skill ? 'bg-[#7C3AED] border-[#7C3AED] text-white shadow-md' : 'bg-white border-gray-200 text-gray-500 hover:border-purple-300'}`}
                                        >
                                            {skill}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Card */}
                            <div className="w-full max-w-[440px] relative">
                                <AnimatePresence mode="popLayout">
                                    {!currentMatch ? (
                                        /* Empty State */
                                        <motion.div
                                            key="empty"
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            className="w-full h-[700px] bg-white rounded-[3.5rem] border-[12px] border-gray-100 flex flex-col items-center justify-center text-center p-8 shadow-xl"
                                        >
                                            <div className="w-24 h-24 relative mb-6">
                                                <div className="absolute inset-0 bg-purple-100 rounded-full animate-ping opacity-40" />
                                                <div className="relative bg-white rounded-full w-full h-full flex items-center justify-center shadow-xl border-2 border-purple-200">
                                                    <RotateCcw size={36} className="text-[#7C3AED]" />
                                                </div>
                                            </div>
                                            <h2 className="text-2xl font-black text-gray-900 mb-2">You've Seen Everyone!</h2>
                                            <p className="text-gray-400 text-sm max-w-[200px] mb-6 font-medium">Reshuffle to discover new teammates!</p>
                                            <button
                                                onClick={handleRestart}
                                                className="bg-gradient-to-r from-[#7C3AED] to-[#A855F7] text-white font-black px-8 py-3 rounded-2xl shadow-lg hover:scale-105 active:scale-95 transition-all"
                                            >
                                                Reshuffle Deck
                                            </button>
                                        </motion.div>
                                    ) : (
                                        /* Profile Card */
                                        <motion.div
                                            key={currentMatch.id + currentIndex}
                                            initial={{ scale: 0.88, opacity: 0, y: 20 }}
                                            animate={{
                                                scale: 1, opacity: 1, y: 0,
                                                x: direction === 'left' ? -520 : direction === 'right' ? 520 : 0,
                                                rotate: direction === 'left' ? -22 : direction === 'right' ? 22 : 0,
                                            }}
                                            exit={{
                                                x: direction === 'left' ? -520 : 520,
                                                opacity: 0,
                                                rotate: direction === 'left' ? -22 : 22,
                                            }}
                                            transition={{ type: 'spring', damping: 20, stiffness: 120 }}
                                            className="w-full bg-white rounded-[2.5rem] md:rounded-[3.5rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)] border-[8px] md:border-[12px] border-gray-100 relative overflow-hidden h-[550px] md:h-[700px] flex flex-col"
                                        >
                                            {/* Card Header */}
                                            <div className="flex items-center justify-between px-6 py-4 shrink-0 bg-white/90 backdrop-blur-md z-20">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#7C3AED] to-[#A855F7] flex items-center justify-center text-white font-black text-sm">
                                                        {currentUser.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <p className="text-[8px] font-bold uppercase text-gray-400 tracking-wider">For You</p>
                                                        <p className="text-sm font-black italic uppercase tracking-tighter text-gray-900">Discover</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400">
                                                    <span>{currentIndex + 1}/{filteredQueue.length}</span>
                                                </div>
                                            </div>

                                            {/* Skill Tags */}
                                            <div className="flex gap-2 overflow-x-auto py-2 px-6 no-scrollbar bg-white/90 z-10">
                                                {currentMatch.user.skills.slice(0, 5).map((tag, i) => (
                                                    <span key={tag} className={`px-3 py-1 text-[10px] font-bold rounded-full whitespace-nowrap flex-shrink-0 ${i === 0 ? 'bg-[#7C3AED] text-white' : 'bg-gray-50 text-gray-400'}`}>
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>

                                            {/* Scrollable Content */}
                                            <div ref={scrollRef} className="flex-1 overflow-y-auto no-scrollbar pb-36">

                                                {/* Main Image */}
                                                <div className="px-4 mt-2">
                                                    <div className="aspect-[3/3.8] rounded-[2.5rem] overflow-hidden relative shadow-2xl">
                                                        <img
                                                            src={currentMatch.user.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentMatch.user.name)}&background=7C3AED&color=fff&size=512`}
                                                            alt={currentMatch.user.name}
                                                            className="w-full h-full object-cover"
                                                            referrerPolicy="no-referrer"
                                                            onError={e => { (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(currentMatch.user.name)}&background=7C3AED&color=fff&size=512`; }}
                                                        />
                                                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-transparent" />

                                                        {/* Match % Badge */}
                                                        <div className="absolute top-5 right-5 px-3 py-1.5 bg-white/15 backdrop-blur-md rounded-full border border-white/25 flex items-center gap-2">
                                                            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                                                            <span className="text-white text-[10px] font-black uppercase tracking-wider">
                                                                {currentMatch.compatibilityScore}% Match
                                                            </span>
                                                        </div>

                                                        {/* LIKE / PASS visual */}
                                                        {direction === 'right' && (
                                                            <div className="absolute top-8 left-6 border-4 border-green-500 rounded-xl px-4 py-1 -rotate-12">
                                                                <span className="text-3xl font-black text-green-500">LIKE</span>
                                                            </div>
                                                        )}
                                                        {direction === 'left' && (
                                                            <div className="absolute top-8 right-6 border-4 border-red-500 rounded-xl px-4 py-1 rotate-12">
                                                                <span className="text-3xl font-black text-red-500">PASS</span>
                                                            </div>
                                                        )}

                                                        {/* Profile overlay info */}
                                                        <div className="absolute bottom-8 left-6 right-6 text-white">
                                                            <div className="flex items-center gap-2">
                                                                <h4 className="text-2xl font-black tracking-tight">{currentMatch.user.name}</h4>
                                                                <CheckCircle2 size={18} className="text-blue-400" />
                                                            </div>
                                                            <p className="text-sm font-semibold text-white/80">
                                                                {currentMatch.user.experience} · {currentMatch.user.availability}
                                                            </p>
                                                            <div className="flex items-center gap-1 text-white/60 mt-1">
                                                                <MapPin size={11} />
                                                                <span className="text-xs font-semibold">{currentMatch.user.college}</span>
                                                            </div>
                                                            <div className="flex flex-wrap gap-1.5 mt-3">
                                                                {currentMatch.user.skills.slice(0, 3).map(skill => (
                                                                    <span key={skill} className="px-2 py-0.5 bg-white/10 backdrop-blur-sm rounded-md text-[9px] font-bold border border-white/10 uppercase tracking-wider">
                                                                        {skill}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                            <div className="mt-4 flex justify-center animate-bounce">
                                                                <ChevronDown size={18} className="text-white/40" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Deep Dive */}
                                                <div className="px-7 mt-8 space-y-7">
                                                    <section>
                                                        <h5 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">About</h5>
                                                        <p className="text-sm text-gray-600 leading-relaxed font-medium">{currentMatch.user.bio}</p>
                                                    </section>

                                                    <section>
                                                        <h5 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">All Skills</h5>
                                                        <div className="flex flex-wrap gap-1.5">
                                                            {currentMatch.user.skills.map(s => (
                                                                <span
                                                                    key={s}
                                                                    className={`px-2.5 py-1 text-[10px] font-bold rounded-lg border ${currentMatch.skillOverlap.includes(s)
                                                                        ? 'bg-blue-50 text-blue-600 border-blue-100'
                                                                        : 'bg-gray-50 text-gray-500 border-gray-100'}`}
                                                                >
                                                                    {s}
                                                                    {currentMatch.skillOverlap.includes(s) && ' ✓'}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </section>

                                                    <section>
                                                        <h5 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Interests</h5>
                                                        <div className="flex flex-wrap gap-1.5">
                                                            {currentMatch.user.interests.map(i => (
                                                                <span key={i} className="px-2.5 py-1 text-[10px] font-bold rounded-lg bg-purple-50 text-purple-600 border border-purple-100">{i}</span>
                                                            ))}
                                                        </div>
                                                    </section>

                                                    <section className="pb-6">
                                                        <h5 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">AI Match Insight</h5>
                                                        <div className="p-4 bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl border border-purple-100/60">
                                                            <p className="text-xs text-gray-600 font-medium leading-relaxed">
                                                                🤖 {currentMatch.explanation}
                                                            </p>
                                                        </div>
                                                    </section>
                                                </div>
                                            </div>

                                            {/* Action Buttons */}
                                            <div className="absolute bottom-[68px] left-0 right-0 flex justify-center items-center gap-5 z-30">
                                                <motion.button
                                                    whileHover={{ scale: 1.12 }}
                                                    whileTap={{ scale: 0.88 }}
                                                    onClick={() => handleSwipe('left')}
                                                    className="w-14 h-14 bg-white rounded-full shadow-xl border border-gray-100 flex items-center justify-center text-gray-300 hover:text-red-500 transition-all"
                                                >
                                                    <X size={26} />
                                                </motion.button>
                                                <motion.button
                                                    whileHover={{ scale: 1.12 }}
                                                    whileTap={{ scale: 0.88 }}
                                                    onClick={() => handleSwipe('right')}
                                                    className="w-20 h-20 bg-gradient-to-br from-[#7C3AED] to-[#A855F7] rounded-full shadow-2xl shadow-purple-500/40 flex items-center justify-center text-white relative group"
                                                >
                                                    <Heart size={32} fill="currentColor" />
                                                    <div className="absolute inset-0 bg-[#7C3AED]/60 blur-2xl rounded-full opacity-0 group-hover:opacity-50 transition-opacity" />
                                                </motion.button>
                                                <motion.button
                                                    whileHover={{ scale: 1.12 }}
                                                    whileTap={{ scale: 0.88 }}
                                                    onClick={() => handleSwipe('right')}
                                                    title="Super Like — higher match chance!"
                                                    className="w-14 h-14 bg-white rounded-full shadow-xl border border-gray-100 flex items-center justify-center text-gray-300 hover:text-yellow-500 transition-all"
                                                >
                                                    <Star size={26} fill="currentColor" />
                                                </motion.button>
                                            </div>

                                            {/* Bottom Nav */}
                                            <div className="absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-50 flex justify-around items-center px-4 py-3 z-20">
                                                <button className="flex flex-col items-center gap-0.5 text-[#7C3AED]">
                                                    <ImageIcon size={20} />
                                                    <span className="text-[8px] font-black uppercase italic tracking-tighter">Play</span>
                                                </button>
                                                <button
                                                    className={`flex flex-col items-center gap-0.5 relative transition-colors ${savedMatches.length > 0 ? 'text-[#EC4899]' : 'text-gray-200 hover:text-gray-400'}`}
                                                    onClick={() => setShowSaved(!showSaved)}
                                                >
                                                    <Heart size={20} fill={savedMatches.length > 0 ? 'currentColor' : 'none'} />
                                                    {savedMatches.length > 0 && (
                                                        <span className="absolute -top-1 -right-2 w-4 h-4 bg-[#EC4899] rounded-full text-white text-[7px] flex items-center justify-center font-black">
                                                            {savedMatches.length}
                                                        </span>
                                                    )}
                                                    <span className="text-[8px] font-black uppercase italic tracking-tighter">Likes</span>
                                                </button>
                                                <button className="flex flex-col items-center gap-0.5 text-gray-200 hover:text-gray-400 transition-colors" onClick={() => navigate('/messages')}>
                                                    <MessageSquare size={20} />
                                                    <span className="text-[8px] font-black uppercase italic tracking-tighter">Chat</span>
                                                </button>
                                                <button className="flex flex-col items-center gap-0.5 text-gray-200 hover:text-gray-400 transition-colors" onClick={() => navigate('/profile')}>
                                                    <User size={20} />
                                                    <span className="text-[8px] font-black uppercase italic tracking-tighter">Me</span>
                                                </button>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </DashboardLayout>
    );
}
