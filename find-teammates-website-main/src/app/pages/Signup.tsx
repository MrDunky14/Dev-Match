import { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import Hyperspeed from '../components/Hyperspeed/Hyperspeed';
import {
  Zap,
  Mail,
  Lock,
  User as UserIcon,
  GraduationCap,
  ArrowRight,
  ArrowLeft,
  Check,
  Code2,
  Brain,
  Clock,
  Briefcase,
  Search,
  X,
  Plus,
  Camera,
  Upload,
  Sparkles
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { useAuth } from '../contexts/AuthContext';
import { allSkills } from '../lib/mockData';

export function Signup() {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form State
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Stage 1: Account
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Stage 2: Identity & Image
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [college, setCollege] = useState('');
  const [bio, setBio] = useState('');

  // Stage 3: Expertise
  const [experience, setExperience] = useState('Beginner');
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState('');

  // Stage 4: Interests & Availability
  const [interests, setInterests] = useState<string[]>([]);
  const [interestInput, setInterestInput] = useState('');
  const [availability, setAvailability] = useState('Weekends');

  const totalSteps = 4;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const nextStep = () => {
    // Auto-add leftover input values to arrays if users forget to press Enter
    if (step === 3 && skillInput.trim()) {
      addSkill(skillInput.trim());
    }
    if (step === 4 && interestInput.trim()) {
      addInterest(interestInput.trim());
    }
    if (step < totalSteps) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const addSkill = (skill: string) => {
    if (skill && !skills.includes(skill)) {
      setSkills([...skills, skill]);
      setSkillInput('');
    }
  };

  const removeSkill = (skill: string) => {
    setSkills(skills.filter(s => s !== skill));
  };

  const addInterest = (interest: string) => {
    if (interest && !interests.includes(interest)) {
      setInterests([...interests, interest]);
      setInterestInput('');
    }
  };

  const removeInterest = (interest: string) => {
    setInterests(interests.filter(i => i !== interest));
  };

  const filteredSkills = allSkills.filter(skill =>
    skill.toLowerCase().includes(skillInput.toLowerCase()) && !skills.includes(skill)
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // If not on last step, just move forward
    if (step < totalSteps) {
      nextStep();
      return;
    }

    // Final Step Submission
    // Final check for leftover interest input
    let finalInterests = [...interests];
    if (interestInput.trim() && !interests.includes(interestInput.trim())) {
      finalInterests.push(interestInput.trim());
    }

    if (finalInterests.length === 0) {
      alert("Please add at least one interest (press Enter to add)");
      return;
    }

    setLoading(true);
    try {
      await signup(name, email, password, college, {
        bio,
        experience: experience as any,
        skills,
        interests: finalInterests,
        availability: availability as any,
        profileImage: profileImage || undefined
      });

      // Force immediate navigation to match
      window.location.href = '/match';
    } catch (error) {
      console.error('Signup failed:', error);
      alert("Signup failed. Please check your details.");
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-5"
          >
            <div className="mb-8">
              <h1 className="text-3xl font-black text-gray-900 tracking-tight">Stage 1: Account</h1>
              <p className="mt-2 text-gray-600 font-medium">Let's start with your basics</p>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Full Name</label>
                <div className="relative">
                  <UserIcon className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-12 h-14 rounded-2xl bg-gray-50 border-gray-100 focus:bg-white transition-all text-lg font-semibold"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                  <Input
                    type="email"
                    placeholder="you@college.edu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-12 h-14 rounded-2xl bg-gray-50 border-gray-100 focus:bg-white transition-all text-lg font-semibold"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                  <Input
                    type="password"
                    placeholder="Min. 8 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-12 h-14 rounded-2xl bg-gray-50 border-gray-100 focus:bg-white transition-all text-lg font-semibold"
                    required
                    minLength={8}
                  />
                </div>
              </div>
            </div>
            <Button
              type="submit"
              className="w-full h-14 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 hover:scale-[1.02] active:scale-[0.98] transition-all text-white font-black text-lg shadow-xl shadow-blue-500/20 mt-4"
              disabled={!name || !email || password.length < 8}
            >
              Next: Identity <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>
        );
      case 2:
        return (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="mb-6">
              <h1 className="text-3xl font-black text-gray-900 tracking-tight">Stage 2: Identity</h1>
              <p className="mt-2 text-gray-600 font-medium">Show us who you are</p>
            </div>

            <div className="flex flex-col items-center gap-6 p-6 bg-gray-50 rounded-[2.5rem] border border-gray-100">
              <div className="relative group">
                <div
                  className="h-32 w-32 rounded-full bg-white shadow-xl flex items-center justify-center overflow-hidden border-4 border-white cursor-pointer group-hover:border-blue-100 transition-all"
                  onClick={() => fileInputRef.current?.click()}
                >
                  {profileImage ? (
                    <img src={profileImage} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex flex-col items-center text-gray-400">
                      <Camera size={32} />
                      <span className="text-[10px] font-black uppercase tracking-tighter mt-1">Add Photo</span>
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-1 right-1 h-10 w-10 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-lg transform group-hover:scale-110 transition-transform"
                >
                  <Upload size={18} />
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  accept="image/*"
                  className="hidden"
                />
              </div>
              <div className="text-center">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Upload Profile Image</p>
                <p className="text-[10px] text-gray-500 italic">Recommended: Square image, max 2MB</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">College / University</label>
                <div className="relative">
                  <GraduationCap className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="e.g. IIT Kharagpur"
                    value={college}
                    onChange={(e) => setCollege(e.target.value)}
                    className="pl-12 h-14 rounded-2xl bg-gray-50 border-gray-100 focus:bg-white transition-all text-lg font-semibold"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Your Bio</label>
                <textarea
                  placeholder="Wanna share your journey?"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full rounded-2xl border border-gray-100 bg-gray-50 px-4 py-4 text-sm font-medium focus:bg-white focus:border-blue-500 transition-all min-h-[100px]"
                  required
                />
              </div>
            </div>

            <div className="flex gap-4 pt-2">
              <Button type="button" variant="ghost" onClick={prevStep} className="flex-1 h-14 rounded-2xl font-bold text-gray-500">
                <ArrowLeft className="mr-2 h-5 w-5" /> Back
              </Button>
              <Button
                type="submit"
                className="flex-[2] h-14 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-black text-lg shadow-xl shadow-blue-500/20"
                disabled={!college || !bio}
              >
                Continue <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </motion.div>
        );
      case 3:
        return (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="mb-8">
              <h1 className="text-3xl font-black text-gray-900 tracking-tight">Stage 3: Expertise</h1>
              <p className="mt-2 text-gray-600 font-medium">What's in your arsenal?</p>
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-4">Experience Level</label>
              <div className="grid grid-cols-3 gap-3">
                {['Beginner', 'Intermediate', 'Advanced'].map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setExperience(level)}
                    className={`p-4 rounded-2xl border-2 text-xs font-black uppercase tracking-widest transition-all ${experience === level
                      ? 'bg-blue-600 text-white border-blue-600 shadow-lg scale-105'
                      : 'bg-white text-gray-500 border-gray-100 hover:border-blue-200'
                      }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-4">Core Skills</label>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search skills (e.g. React, Docker)"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      if (skillInput.trim()) addSkill(skillInput.trim());
                    }
                  }}
                  className="pl-12 h-14 rounded-2xl bg-gray-50 border-gray-100 focus:bg-white text-lg font-semibold"
                />
                <AnimatePresence>
                  {skillInput && filteredSkills.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute z-50 mt-2 w-full max-h-48 overflow-y-auto rounded-2xl border border-gray-100 bg-white/90 backdrop-blur-xl p-2 shadow-2xl no-scrollbar"
                    >
                      {filteredSkills.slice(0, 10).map(skill => (
                        <button
                          key={skill}
                          type="button"
                          onClick={() => addSkill(skill)}
                          className="w-full rounded-xl px-4 py-3 text-left text-sm font-bold text-gray-700 hover:bg-blue-50 flex items-center justify-between group"
                        >
                          {skill}
                          <Plus className="h-4 w-4 text-transparent group-hover:text-blue-500" />
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="flex flex-wrap gap-2 mt-5">
                {skills.length === 0 && (
                  <p className="text-[11px] font-bold text-gray-400 italic px-2">Press Enter to add custom skills</p>
                )}
                {skills.map(skill => (
                  <Badge key={skill} className="px-4 py-2 rounded-xl bg-blue-50 text-blue-700 border-blue-100/50 hover:bg-blue-100 transition-colors text-xs font-bold ring-0">
                    {skill}
                    <button type="button" onClick={() => removeSkill(skill)} className="ml-2 hover:text-red-500 transition-colors">
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>

            <div className="flex gap-4 pt-6">
              <Button type="button" variant="ghost" onClick={prevStep} className="flex-1 h-14 rounded-2xl font-bold text-gray-500">
                <ArrowLeft className="mr-2 h-5 w-5" /> Back
              </Button>
              <Button
                type="submit"
                className="flex-[2] h-14 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-black text-lg shadow-xl shadow-blue-500/20"
                disabled={skills.length === 0 && !skillInput.trim()}
              >
                Almost There <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </motion.div>
        );
      case 4:
        return (
          <motion.div
            key="step4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="mb-8">
              <h1 className="text-3xl font-black text-gray-900 tracking-tight">Stage 4: Launch</h1>
              <p className="mt-2 text-gray-600 font-medium">Finalizing your hub access</p>
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-4">Your Availability</label>
              <div className="grid grid-cols-3 gap-3">
                {['Full-time', 'Part-time', 'Weekends'].map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setAvailability(opt)}
                    className={`p-4 rounded-2xl border-2 text-xs font-black uppercase tracking-widest transition-all ${availability === opt
                      ? 'bg-purple-600 text-white border-purple-600 shadow-lg scale-105'
                      : 'bg-white text-gray-500 border-gray-100 hover:border-purple-200'
                      }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-4">Top Interests</label>
              <div className="relative">
                <Brain className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="e.g. Web3, AI, FinTech"
                  value={interestInput}
                  onChange={(e) => setInterestInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      if (interestInput.trim()) addInterest(interestInput.trim());
                    }
                  }}
                  className="pl-12 h-14 rounded-2xl bg-gray-50 border-gray-100 focus:bg-white text-lg font-semibold"
                />
              </div>
              <div className="flex flex-wrap gap-2 mt-4">
                {interests.length === 0 && (
                  <p className="text-[11px] font-bold text-gray-400 italic px-2">Press Enter to add interests</p>
                )}
                {interests.map(interest => (
                  <Badge key={interest} className="px-4 py-2 rounded-xl bg-purple-50 text-purple-700 border-purple-100 hover:bg-purple-100 transition-colors text-xs font-bold">
                    {interest}
                    <button type="button" onClick={() => removeInterest(interest)} className="ml-2 hover:text-red-500 transition-colors">
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>

            <div className="pt-6">
              <div className="flex items-center gap-3 p-4 bg-blue-50/50 rounded-2xl border border-blue-100/50 mb-8">
                <input
                  type="checkbox"
                  className="h-5 w-5 rounded-lg border-blue-200 text-blue-600 focus:ring-blue-500 cursor-pointer"
                  required
                  defaultChecked
                />
                <span className="text-xs font-semibold text-blue-800">
                  I agree to the <a href="#" className="underline">Terms</a> & <a href="#" className="underline">Privacy Guidelines</a>
                </span>
              </div>

              <div className="flex gap-4">
                <Button type="button" variant="ghost" onClick={prevStep} className="flex-1 h-14 rounded-2xl font-bold text-gray-500">
                  <ArrowLeft className="mr-2 h-5 w-5" /> Back
                </Button>
                <Button
                  type="submit"
                  className="flex-[2] h-14 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-800 hover:scale-[1.02] active:scale-[0.98] transition-all text-white font-black text-xl shadow-2xl shadow-blue-500/30"
                  disabled={loading || (interests.length === 0 && !interestInput.trim())}
                >
                  <Sparkles className="mr-2 h-5 w-5" />
                  {loading ? 'Launching...' : 'Final Launch 🚀'}
                </Button>
              </div>
            </div>
          </motion.div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen bg-white">
      {/* Visual Side with Hyperspeed */}
      <div className="hidden lg:flex lg:w-[40%] relative bg-black items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Hyperspeed />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-white px-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-md mb-8">
            <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-300">Join 15,000+ Innovators</span>
          </div>

          <h2 className="text-5xl font-black mb-8 tracking-tighter leading-none italic">
            YOUR <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">NEXT BIG</span><br />
            STARTUP<br />
            STARTS HERE
          </h2>

          <p className="text-lg text-slate-300 font-medium mb-12 max-w-sm tracking-tight opacity-80">
            Stop coding alone. Find your ideal tech partner and build the future together.
          </p>

          <div className="space-y-4">
            {[
              { icon: Zap, text: 'Ultra-fast Matchmaking' },
              { icon: Brain, text: 'AI-Powered Compatibility' },
              { icon: Sparkles, text: 'Premium Network Access' },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + i * 0.1 }}
                className="flex items-center gap-4 text-slate-300"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
                  <item.icon className="h-5 w-5 text-blue-400" />
                </div>
                <span className="font-bold text-sm tracking-tight">{item.text}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Form Side */}
      <div className="flex w-full items-center justify-center px-6 lg:w-[60%] py-12 lg:py-16 bg-slate-50/30">
        <div className="w-full max-w-xl">
          <div className="mb-12">
            <div className="flex items-center gap-6 mb-10">
              <Link to="/" className="flex items-center gap-2 group">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform">
                  <Zap className="h-7 w-7 text-white" />
                </div>
              </Link>
              <div className="flex-1 flex gap-3 h-1.5 pt-1">
                {[1, 2, 3, 4].map(s => (
                  <div
                    key={s}
                    className={`h-full flex-1 rounded-full transition-all duration-700 ${s <= step ? 'bg-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.4)]' : 'bg-gray-200'
                      }`}
                  />
                ))}
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <AnimatePresence mode="wait">
              {renderStep()}
            </AnimatePresence>
          </form>

          <p className="mt-12 text-center text-sm text-gray-400 font-bold">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 hover:text-blue-700 transition-colors uppercase tracking-widest text-xs">
              Go to Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}


