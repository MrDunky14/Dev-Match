import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
    X,
    Sparkles,
    Users,
    ChevronRight,
    CheckCircle2,
    MessageSquare,
    Zap,
    Target,
    Loader2,
    ArrowRight
} from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

interface VirtualDemoProps {
    isOpen: boolean;
    onClose: () => void;
}

export function VirtualDemo({ isOpen, onClose }: VirtualDemoProps) {
    const [step, setStep] = useState(1);
    const [isScanning, setIsScanning] = useState(false);
    const [showChatMessage, setShowChatMessage] = useState(false);

    // Auto-advance chat simulation
    useEffect(() => {
        if (step === 2) {
            const timer = setTimeout(() => setShowChatMessage(true), 1500);
            return () => clearTimeout(timer);
        }
    }, [step]);

    const handleStartScan = () => {
        setIsScanning(true);
        setTimeout(() => {
            setIsScanning(false);
            setStep(2);
        }, 2500);
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 overflow-hidden"
            >
                <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-md" onClick={onClose} />

                <motion.div
                    initial={{ scale: 0.9, y: 20, opacity: 0 }}
                    animate={{ scale: 1, y: 0, opacity: 1 }}
                    exit={{ scale: 0.9, y: 20, opacity: 0 }}
                    className="relative w-full max-w-5xl h-[80vh] bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col md:flex-row border border-white/20"
                >
                    {/* Sidebar - Demo Progress */}
                    <div className="w-full md:w-64 bg-gray-50 border-r border-gray-100 p-8 flex flex-col">
                        <div className="flex items-center gap-2 mb-12">
                            <div className="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center">
                                <Zap className="h-5 w-5 text-white" />
                            </div>
                            <span className="font-black text-gray-900 tracking-tight">DEMO MODE</span>
                        </div>

                        <div className="space-y-8 flex-1">
                            {[
                                { id: 1, label: 'Smart Scoping', icon: Target },
                                { id: 2, label: 'Neural Matching', icon: Sparkles },
                                { id: 3, label: 'Instant Connect', icon: MessageSquare }
                            ].map((s) => (
                                <div key={s.id} className="flex items-center gap-4 group">
                                    <div className={`h-10 w-10 rounded-full flex items-center justify-center transition-all ${step >= s.id ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'bg-white text-gray-400 border border-gray-200'
                                        }`}>
                                        {step > s.id ? <CheckCircle2 className="h-5 w-5" /> : <s.icon className="h-5 w-5" />}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className={`text-xs font-black uppercase tracking-widest ${step >= s.id ? 'text-indigo-600' : 'text-gray-400'}`}>
                                            Step 0{s.id}
                                        </span>
                                        <span className={`text-sm font-bold ${step >= s.id ? 'text-gray-900' : 'text-gray-400'}`}>
                                            {s.label}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <Button variant="ghost" onClick={onClose} className="mt-auto text-gray-400 hover:text-red-600 font-bold text-xs uppercase tracking-widest">
                            Exit Experience
                        </Button>
                    </div>

                    {/* Main Workspace */}
                    <div className="flex-1 bg-white relative flex flex-col overflow-hidden">
                        <button
                            onClick={onClose}
                            className="absolute top-6 right-6 h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-all z-20"
                        >
                            <X className="h-5 w-5" />
                        </button>

                        <div className="flex-1 p-8 md:p-12 overflow-y-auto no-scrollbar">
                            <AnimatePresence mode="wait">
                                {step === 1 && (
                                    <motion.div
                                        key="step1"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        className="h-full flex flex-col items-center justify-center text-center max-w-lg mx-auto"
                                    >
                                        <div className="h-20 w-20 rounded-[2rem] bg-indigo-50 flex items-center justify-center mb-8 relative">
                                            <Target className="h-10 w-10 text-indigo-600" />
                                            <motion.div
                                                animate={{ scale: [1, 1.5, 1], opacity: [0, 0.5, 0] }}
                                                transition={{ duration: 2, repeat: Infinity }}
                                                className="absolute inset-0 rounded-[2rem] border-2 border-indigo-200"
                                            />
                                        </div>
                                        <h2 className="text-4xl font-black text-gray-900 mb-4 tracking-tighter italic">Define Your Project</h2>
                                        <p className="text-gray-500 font-medium mb-10 leading-relaxed">
                                            CollabNest's AI analyzes 20+ parameters to find the perfect technical and personality match for your vision.
                                        </p>

                                        <Card className="w-full border-2 border-indigo-100 bg-indigo-50/30 mb-10 overflow-hidden group hover:border-indigo-600 transition-all">
                                            <CardContent className="p-6">
                                                <div className="flex items-center gap-4 text-left">
                                                    <div className="h-12 w-12 rounded-xl bg-white shadow-sm flex items-center justify-center flex-shrink-0">
                                                        <Zap className="h-6 w-6 text-indigo-600" />
                                                    </div>
                                                    <div>
                                                        <div className="text-xs font-black text-indigo-600 uppercase tracking-widest mb-1">Project Intent</div>
                                                        <div className="text-lg font-bold text-gray-900 line-clamp-1">AI-Powered Supply Chain Tracker</div>
                                                    </div>
                                                    <ChevronRight className="ml-auto h-5 w-5 text-gray-300 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
                                                </div>
                                            </CardContent>
                                        </Card>

                                        <Button
                                            onClick={handleStartScan}
                                            disabled={isScanning}
                                            size="lg"
                                            className="h-14 px-10 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black tracking-widest shadow-xl shadow-indigo-100 min-w-[200px]"
                                        >
                                            {isScanning ? (
                                                <>
                                                    <Loader2 className="h-5 w-5 mr-3 animate-spin" />
                                                    NEURAL SCANNING...
                                                </>
                                            ) : (
                                                <>
                                                    START MATCHING
                                                    <ArrowRight className="ml-3 h-5 w-5" />
                                                </>
                                            )}
                                        </Button>
                                    </motion.div>
                                )}

                                {step === 2 && (
                                    <motion.div
                                        key="step2"
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 1.05 }}
                                        className="space-y-8"
                                    >
                                        <div>
                                            <h2 className="text-3xl font-black text-gray-900 tracking-tight">Top Recommended Matches</h2>
                                            <p className="text-gray-500 font-medium mt-1">Based on your project tech-stack and personality profile.</p>
                                        </div>

                                        <div className="grid gap-6">
                                            {[
                                                { name: 'Arjun Sharma', role: 'Fullstack Dev', match: 98, skills: ['React', 'Solidity', 'Python'], color: 'text-indigo-600 bg-indigo-50' },
                                                { name: 'Sarah Chen', role: 'AI Specialist', match: 95, skills: ['PyTorch', 'DataVis', 'FastAPI'], color: 'text-purple-600 bg-purple-50' }
                                            ].map((m, i) => (
                                                <motion.div
                                                    key={m.name}
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: i * 0.2 }}
                                                >
                                                    <Card className="border-none shadow-md hover:shadow-xl transition-all cursor-pointer group rounded-2xl overflow-hidden bg-white hover:-translate-y-1">
                                                        <CardContent className="p-6">
                                                            <div className="flex items-center gap-6">
                                                                <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-50 flex items-center justify-center font-black text-2xl text-gray-400 group-hover:scale-105 transition-transform">
                                                                    {m.name.charAt(0)}
                                                                </div>
                                                                <div className="flex-1">
                                                                    <div className="flex items-center justify-between mb-2">
                                                                        <div>
                                                                            <h3 className="text-xl font-bold text-gray-900">{m.name}</h3>
                                                                            <p className="text-xs font-black text-gray-400 uppercase tracking-widest">{m.role}</p>
                                                                        </div>
                                                                        <div className="text-right">
                                                                            <div className="text-2xl font-black text-green-600 tracking-tighter">{m.match}%</div>
                                                                            <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Match Score</div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="flex flex-wrap gap-2">
                                                                        {m.skills.map(s => (
                                                                            <Badge key={s} variant="outline" className="rounded-full px-3 py-0.5 text-[10px] font-black uppercase text-gray-500 border-gray-100">
                                                                                {s}
                                                                            </Badge>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                                <Button
                                                                    onClick={() => setStep(3)}
                                                                    className="h-12 w-12 p-0 rounded-2xl bg-indigo-50 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm"
                                                                >
                                                                    <ChevronRight className="h-6 w-6" />
                                                                </Button>
                                                            </div>
                                                        </CardContent>
                                                    </Card>
                                                </motion.div>
                                            ))}
                                        </div>

                                        <div className="bg-blue-50/50 p-4 rounded-2xl border border-blue-100 flex items-center gap-4">
                                            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 animate-pulse">
                                                <Users className="h-5 w-5 text-blue-600" />
                                            </div>
                                            <p className="text-xs font-bold text-blue-700 leading-tight">
                                                CollabNest Intelligence found 12 other potential matches that would fit your timeline perfectly.
                                            </p>
                                        </div>
                                    </motion.div>
                                )}

                                {step === 3 && (
                                    <motion.div
                                        key="step3"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="h-full flex flex-col"
                                    >
                                        <div className="flex items-center justify-between mb-8">
                                            <div>
                                                <h2 className="text-3xl font-black text-gray-900 tracking-tight">Collaboration Stream</h2>
                                                <p className="text-gray-500 font-medium">Instant encrypted connection with Arjun Sharma</p>
                                            </div>
                                            <Badge className="bg-green-50 text-green-700 border-green-100 px-4 py-1 font-black">ACTIVE SESSION</Badge>
                                        </div>

                                        <div className="flex-1 bg-gray-50 rounded-3xl p-6 mb-6 flex flex-col gap-4 relative overflow-hidden">
                                            <div className="absolute inset-0 bg-grid-slate-100/[0.03] bg-[bottom_left_-4px]" />

                                            <div className="bg-white p-4 rounded-2xl rounded-bl-none shadow-sm max-w-[80%] border border-gray-100 relative z-10">
                                                <p className="text-sm font-medium text-gray-800">Hey there! I just analyzed your project concept. The Web3 supply chain idea is brilliant. I have exactly the Solidity experience you need. When can we sync?</p>
                                                <span className="text-[10px] text-gray-400 font-bold mt-2 block uppercase tracking-widest">Arjun • 1:42 PM</span>
                                            </div>

                                            <AnimatePresence>
                                                {showChatMessage && (
                                                    <motion.div
                                                        initial={{ opacity: 0, scale: 0.9, x: 20 }}
                                                        animate={{ opacity: 1, scale: 1, x: 0 }}
                                                        className="bg-indigo-600 p-4 rounded-2xl rounded-br-none shadow-lg text-white max-w-[80%] ml-auto relative z-10"
                                                    >
                                                        <p className="text-sm font-medium">That's exactly what I'm looking for! The AI matched us for a reason. Let's build the MVP this weekend? 🚀</p>
                                                        <span className="text-[10px] text-indigo-100 font-bold mt-2 block uppercase tracking-widest">You • Just Now</span>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>

                                            {!showChatMessage && (
                                                <div className="mt-auto flex items-center gap-2 px-4 italic text-gray-400 text-xs">
                                                    <Loader2 className="h-3 w-3 animate-spin" />
                                                    Arjun is typing...
                                                </div>
                                            )}
                                        </div>

                                        <div className="text-center p-8 bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-700 rounded-3xl text-white shadow-2xl shadow-indigo-100">
                                            <h3 className="text-2xl font-black mb-2 tracking-tighter italic">Experience the Full Version</h3>
                                            <p className="text-indigo-100 mb-6 font-medium">Join 50,000+ developers building the future of collaboration.</p>
                                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                                <Button
                                                    onClick={() => window.location.href = '/signup'}
                                                    className="h-12 px-8 rounded-xl bg-white text-indigo-600 hover:bg-gray-50 font-black tracking-widest"
                                                >
                                                    GET STARTED NOW
                                                </Button>
                                                <Button
                                                    onClick={onClose}
                                                    variant="outline"
                                                    className="h-12 px-8 rounded-xl border-white/30 text-white hover:bg-white/10 font-bold"
                                                >
                                                    MAYBE LATER
                                                </Button>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
