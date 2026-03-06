import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { Zap, Mail, Lock } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card } from '../components/ui/card';
import { useAuth } from '../contexts/AuthContext';

import Hyperspeed from '../components/Hyperspeed/Hyperspeed';

export function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(email, password);
      navigate('/match');
    } catch (error) {
      console.error('Login failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-white">
      {/* Left Side - Form */}
      <div className="flex w-full items-center justify-center px-6 py-12 lg:py-0 lg:w-1/2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          <div className="mb-8">
            <Link to="/" className="flex items-center gap-2 mb-8 group">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform">
                <Zap className="h-7 w-7 text-white" />
              </div>
              <span className="font-black text-slate-900 text-2xl tracking-tighter">CollabNest</span>
            </Link>

            <h1 className="text-4xl font-black text-gray-900 tracking-tight">Welcome back</h1>
            <p className="mt-2 text-gray-600 font-medium italic">
              Ready to find your next tech partner?
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="email" className="block text-xs font-black uppercase tracking-widest text-gray-400 px-1">
                Email address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@college.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-12 h-14 rounded-2xl bg-gray-50 border-gray-100 focus:bg-white transition-all text-lg font-semibold"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="block text-xs font-black uppercase tracking-widest text-gray-400 px-1">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-12 h-14 rounded-2xl bg-gray-50 border-gray-100 focus:bg-white transition-all text-lg font-semibold"
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-between px-1">
              <label className="flex items-center gap-2 group cursor-pointer">
                <input type="checkbox" className="h-5 w-5 rounded-lg border-gray-200 text-blue-600 focus:ring-blue-500 cursor-pointer" />
                <span className="text-sm font-semibold text-gray-500 group-hover:text-gray-700 transition-colors">Remember me</span>
              </label>
              <a href="#" className="text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors uppercase tracking-widest text-xs">
                Forgot password?
              </a>
            </div>

            <Button type="submit" className="w-full h-14 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 hover:scale-[1.02] active:scale-[0.98] transition-all text-white font-black text-xl shadow-xl shadow-blue-500/20" disabled={loading}>
              {loading ? 'Entering Hyperdrive...' : 'Sign in 🚀'}
            </Button>
          </form>

          <p className="mt-8 text-center text-sm text-gray-400 font-bold">
            Don't have an account?{' '}
            <Link to="/signup" className="text-blue-600 hover:text-blue-700 transition-colors uppercase tracking-widest text-xs">
              Join the crew for free
            </Link>
          </p>
        </motion.div>
      </div>

      {/* Right Side - Hyperspeed Animation */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-black items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Hyperspeed />
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative z-10 text-center text-white px-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-md mb-8">
            <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-300">Live Pilot Network</span>
          </div>

          <h2 className="text-6xl font-black mb-6 tracking-tighter leading-none italic">
            YOUR FUTURE <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">IS AT LIGHTSPEED</span>
          </h2>
          <p className="text-xl text-blue-100/70 font-medium mb-12 tracking-tight max-w-md mx-auto">
            Find the developers who match your frequency and build something legendary.
          </p>

          <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
            {[
              { value: '10K+', label: 'Pilots' },
              { value: '50K+', label: 'Matches' },
              { value: '2.5K+', label: 'Systems' },
              { value: '85%', label: 'Efficiency' },
            ].map((stat) => (
              <Card key={stat.label} className="bg-white/5 backdrop-blur-xl border-white/10 p-4 rounded-2xl">
                <div className="text-2xl font-black text-white italic">{stat.value}</div>
                <div className="text-[10px] font-black uppercase tracking-widest text-blue-300/50">{stat.label}</div>
              </Card>
            ))}
          </div>
        </motion.div>
      </div>
    </div>

  );
}
