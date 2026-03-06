import { useState } from 'react';
import { motion } from 'motion/react';
import {
  Users,
  Plus,
  Crown,
  Mail,
  Github,
  Linkedin,
  MoreVertical,
  UserPlus,
  Settings,
  Trash2,
  Award,
  Target,
  Code2,
  Calendar
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { DashboardLayout } from '../components/DashboardLayout';
import { useAuth } from '../contexts/AuthContext';
import { Input } from '../components/ui/input';

interface Project {
  id: string;
  title: string;
  status: 'In Progress' | 'Completed' | 'Idea';
  tech: string[];
}

interface TeamMember {
  id: string;
  name: string;
  role: 'Leader' | 'Member' | 'Pending';
  skills: string[];
  avatar: string;
  online: boolean;
}

interface Team {
  id: string;
  name: string;
  description: string;
  members: TeamMember[];
  projectList: Project[];
  projects: number; // Counter for stats
  createdAt: Date;
  tags: string[];
}

const mockTeams: Team[] = [
  {
    id: '1',
    name: 'AI Innovators',
    description: 'Building cutting-edge AI solutions for real-world problems',
    members: [
      { id: 'm1', name: 'You', role: 'Leader', skills: ['React', 'TypeScript', 'Node.js'], avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=256&h=256&auto=format&fit=crop', online: true },
      { id: 'm2', name: 'Priya Patel', role: 'Member', skills: ['Python', 'TensorFlow', 'AI/ML'], avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=256&h=256&auto=format&fit=crop', online: true },
      { id: 'm3', name: 'Rahul Verma', role: 'Member', skills: ['Backend', 'MongoDB', 'Express'], avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=256&h=256&auto=format&fit=crop', online: false },
    ],
    projectList: [
      { id: 'p1', title: 'BrainWave AI', status: 'In Progress', tech: ['React', 'Python'] },
      { id: 'p2', title: 'SmartRecruiter', status: 'Completed', tech: ['Node.js', 'PostgreSQL'] },
      { id: 'p3', title: 'VisionX', status: 'Idea', tech: ['TensorFlow', 'OpenCV'] }
    ],
    projects: 3,
    createdAt: new Date('2026-02-01'),
    tags: ['AI/ML', 'Full Stack', 'Hackathon'],
  },
  {
    id: '2',
    name: 'Web3 Builders',
    description: 'Exploring decentralized applications and blockchain technology',
    members: [
      { id: 'm1', name: 'You', role: 'Member', skills: ['React', 'TypeScript', 'Node.js'], avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=256&h=256&auto=format&fit=crop', online: true },
      { id: 'm4', name: 'Karthik Reddy', role: 'Leader', skills: ['Solidity', 'Ethereum', 'Web3'], avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=256&h=256&auto=format&fit=crop', online: true },
      { id: 'm5', name: 'Sneha Gupta', role: 'Member', skills: ['Smart Contracts', 'DeFi'], avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=256&h=256&auto=format&fit=crop', online: true },
    ],
    projectList: [
      { id: 'p4', title: 'DeFi Swap', status: 'Completed', tech: ['Solidity', 'React'] },
      { id: 'p5', title: 'NFT Marketplace', status: 'In Progress', tech: ['Web3.js', 'IPFS'] }
    ],
    projects: 2,
    createdAt: new Date('2026-01-15'),
    tags: ['Blockchain', 'Web3', 'DeFi'],
  },
];

export function Teams() {
  const { user } = useAuth();
  const [teams, setTeams] = useState(mockTeams);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showProjectsModal, setShowProjectsModal] = useState(false);
  const [showCreateProjectForm, setShowCreateProjectForm] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [inviteEmail, setInviteEmail] = useState('');
  const [newTeamName, setNewTeamName] = useState('');
  const [newTeamDescription, setNewTeamDescription] = useState('');
  const [newProjectTitle, setNewProjectTitle] = useState('');
  const [isInviting, setIsInviting] = useState(false);

  const handleCreateTeam = () => {
    if (!newTeamName.trim()) return;

    const newTeam: Team = {
      id: Date.now().toString(),
      name: newTeamName,
      description: newTeamDescription,
      members: [
        {
          id: 'me',
          name: user?.name || 'You',
          role: 'Leader',
          skills: user?.skills || [],
          avatar: user?.name.charAt(0) || 'Y',
          online: true,
        },
      ],
      projectList: [],
      projects: 0,
      createdAt: new Date(),
      tags: [],
    };

    setTeams([...teams, newTeam]);
    setShowCreateModal(false);
    setNewTeamName('');
    setNewTeamDescription('');
  };

  const handleCreateProject = () => {
    if (!newProjectTitle.trim() || !selectedTeam) return;

    const newProject: Project = {
      id: `p-${Date.now()}`,
      title: newProjectTitle,
      status: 'Idea',
      tech: ['React', 'Tailwind'], // Default stack
    };

    setTeams(prevTeams => prevTeams.map(t => {
      if (t.id === selectedTeam.id) {
        return {
          ...t,
          projectList: [newProject, ...t.projectList],
          projects: t.projects + 1
        };
      }
      return t;
    }));

    // Update selected team for immediate UI reflect
    setSelectedTeam(prev => prev ? {
      ...prev,
      projectList: [newProject, ...prev.projectList],
      projects: prev.projects + 1
    } : null);

    setNewProjectTitle('');
    setShowCreateProjectForm(false);
  };

  const handleDeleteTeam = (teamId: string) => {
    if (confirm('Are you sure you want to delete this team?')) {
      setTeams(teams.filter(team => team.id !== teamId));
    }
  };

  const handleInvite = () => {
    if (!inviteEmail.trim() || !selectedTeam) return;

    setIsInviting(true);

    // Simulate API call
    setTimeout(() => {
      setTeams(prevTeams => prevTeams.map(team => {
        if (team.id === selectedTeam.id) {
          const newMember: TeamMember = {
            id: `pending-${Date.now()}`,
            name: inviteEmail.split('@')[0],
            role: 'Pending',
            skills: ['Invited'],
            avatar: inviteEmail.charAt(0).toUpperCase(),
            online: false,
          };
          return {
            ...team,
            members: [...team.members, newMember]
          };
        }
        return team;
      }));

      setIsInviting(false);
      setShowInviteModal(false);
      setInviteEmail('');
      alert(`Invitation sent to ${inviteEmail}!`);
    }, 1200);
  };

  return (
    <DashboardLayout>
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Users className="h-6 w-6 md:h-8 md:w-8 text-blue-600" />
            <h1 className="text-2xl md:text-4xl font-black text-gray-900 tracking-tight">My Teams</h1>
          </div>
          <p className="text-sm md:text-base text-gray-600">
            Manage and collaborate with your teams
          </p>
        </div>
        <Button onClick={() => setShowCreateModal(true)} size="lg" className="w-full sm:w-auto">
          <Plus className="h-5 w-5 mr-2" />
          Create Team
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-3 md:gap-4 grid-cols-2 md:grid-cols-4 mb-8">
        {[
          { label: 'Total Teams', value: teams.length, delay: 0 },
          { label: 'Teams Leading', value: teams.filter(t => t.members.some(m => m.name === 'You' && m.role === 'Leader')).length, delay: 0.1, color: 'text-blue-600' },
          { label: 'Total Members', value: teams.reduce((acc, team) => acc + team.members.length, 0), delay: 0.2, color: 'text-purple-600' },
          { label: 'Active Projects', value: teams.reduce((acc, team) => acc + team.projects, 0), delay: 0.3, color: 'text-green-600' }
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: stat.delay }}
            whileHover={{ y: -5, scale: 1.02 }}
          >
            <Card className="premium-shadow border-none bg-white/80 backdrop-blur-sm">
              <CardContent className="p-4 md:p-6 text-center">
                <div className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">{stat.label}</div>
                <div className={`text-2xl md:text-4xl font-black ${stat.color || 'text-gray-900'} tracking-tight`}>{stat.value}</div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Create Team Modal */}
      {showCreateModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4"
          onClick={() => setShowCreateModal(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl p-8 max-w-md w-full"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Create New Team</h2>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Team Name
                </label>
                <Input
                  placeholder="e.g., AI Innovators"
                  value={newTeamName}
                  onChange={(e) => setNewTeamName(e.target.value)}
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Description
                </label>
                <textarea
                  placeholder="What is your team building?"
                  value={newTeamDescription}
                  onChange={(e) => setNewTeamDescription(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button onClick={handleCreateTeam} className="flex-1">
                  Create Team
                </Button>
                <Button variant="outline" onClick={() => setShowCreateModal(false)} className="flex-1">
                  Cancel
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Invite Member Modal */}
      {showInviteModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4"
          onClick={() => setShowInviteModal(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-[2.5rem] p-10 max-w-md w-full shadow-2xl relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-600 to-purple-600" />

            <div className="flex items-center gap-4 mb-8">
              <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
                <UserPlus size={28} />
              </div>
              <div>
                <h2 className="text-2xl font-black text-gray-900 tracking-tight">Invite Teammate</h2>
                <p className="text-sm text-gray-500 font-medium">Add amazing talent to your team</p>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">
                  Email or Username
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <Input
                    placeholder="teammate@example.com"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    className="pl-12 py-6 rounded-2xl border-gray-100 bg-gray-50/50 focus:bg-white transition-all font-medium"
                    onKeyPress={(e) => e.key === 'Enter' && handleInvite()}
                  />
                </div>
              </div>

              <div className="bg-blue-50/50 p-4 rounded-2xl border border-blue-100/50 mb-2">
                <p className="text-xs text-blue-700 font-medium leading-relaxed">
                  💡 Tip: Invitations are sent instantly. Once they accept, they'll show up in your active members list.
                </p>
              </div>

              <div className="flex gap-3 pt-2">
                <Button
                  onClick={handleInvite}
                  disabled={!inviteEmail.trim() || isInviting}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-6 rounded-2xl shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
                >
                  {isInviting ? (
                    'Submitting...'
                  ) : (
                    'Submit'
                  )}
                </Button>
                <Button variant="ghost" onClick={() => setShowInviteModal(false)} className="px-6 rounded-2xl font-bold text-gray-400 hover:text-gray-600">
                  Cancel
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Projects Modal */}
      {showProjectsModal && selectedTeam && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4"
          onClick={() => {
            setShowProjectsModal(false);
            setShowCreateProjectForm(false);
          }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-[2.5rem] p-10 max-w-2xl w-full shadow-2xl relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-green-500 to-blue-500" />

            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center text-green-600">
                  <Code2 size={28} />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-gray-900 tracking-tight">{selectedTeam.name}'s Projects</h2>
                  <p className="text-sm text-gray-500 font-medium">Tracking progress and milestones</p>
                </div>
              </div>
              <Button variant="ghost" onClick={() => setShowProjectsModal(false)} className="rounded-full h-10 w-10 p-0 text-gray-400 hover:text-gray-900 transition-colors">
                ✕
              </Button>
            </div>

            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 no-scrollbar">
              {showCreateProjectForm ? (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-gray-50 p-8 rounded-[2rem] border-2 border-green-100"
                >
                  <h3 className="text-lg font-black text-gray-900 mb-4">Launch New Project</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-[10px] font-black uppercase text-gray-400 block mb-2">Project Title</label>
                      <Input
                        placeholder="e.g., Solar Analytics Pro"
                        value={newProjectTitle}
                        onChange={(e) => setNewProjectTitle(e.target.value)}
                        className="rounded-xl border-gray-200 py-6"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={handleCreateProject}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white font-black rounded-xl py-6"
                      >
                        Create Project
                      </Button>
                      <Button
                        variant="ghost"
                        onClick={() => setShowCreateProjectForm(false)}
                        className="px-6 rounded-xl font-bold text-gray-400"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ) : selectedTeam.projectList.length > 0 ? (
                <>
                  <Button
                    onClick={() => setShowCreateProjectForm(true)}
                    className="w-full bg-green-50 text-green-600 hover:bg-green-100 border-2 border-dashed border-green-200 font-black py-4 rounded-2xl mb-4"
                  >
                    <Plus className="size-4 mr-2" />
                    Startup New Project
                  </Button>
                  {selectedTeam.projectList.map((project) => (
                    <div key={project.id} className="p-6 rounded-[2rem] border border-gray-100 bg-gray-50/50 hover:bg-white transition-all hover:shadow-lg group">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-lg font-black text-gray-800 tracking-tight">{project.title}</h4>
                        <Badge className={`rounded-xl px-3 py-1 text-[10px] font-black uppercase ${project.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' :
                          project.status === 'In Progress' ? 'bg-blue-100 text-blue-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                          {project.status}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {project.tech.map(t => (
                          <span key={t} className="text-[10px] font-bold text-gray-400 bg-white px-3 py-1 rounded-lg border border-gray-100">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </>
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-[2rem] border-dashed border-2 border-gray-200">
                  <p className="text-gray-400 font-bold mb-4">No projects started yet</p>
                  <Button
                    variant="ghost"
                    onClick={() => setShowCreateProjectForm(true)}
                    className="text-blue-600 font-black hover:bg-blue-50"
                  >
                    Startup New Project +
                  </Button>
                </div>
              )}
            </div>

            <div className="flex justify-end pt-8">
              <Button onClick={() => setShowProjectsModal(false)} className="bg-gray-900 text-white font-black px-10 py-6 rounded-2xl hover:bg-gray-800 transition-all">
                Close
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Teams Grid */}
      <div className="grid gap-4 md:gap-8 md:grid-cols-2">
        {teams.map((team, index) => {
          const isLeader = team.members.some(m => m.name === 'You' && m.role === 'Leader');

          return (
            <motion.div
              key={team.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -8 }}
              className="h-full"
            >
              <Card className="premium-shadow transition-all duration-300 h-full rounded-[2rem] md:rounded-[2.5rem] border-none bg-white/90 backdrop-blur-md overflow-hidden group">
                <CardHeader className="p-6 md:p-8 pb-3 md:pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-xl md:text-2xl font-black text-gray-900 tracking-tight mb-1 md:mb-2 flex items-center gap-2">
                        {team.name}
                        {isLeader && (
                          <div className="bg-yellow-50 p-1 rounded-lg">
                            <Crown className="h-4 w-4 md:h-5 md:w-5 text-yellow-600" />
                          </div>
                        )}
                      </CardTitle>
                      <p className="text-xs md:text-sm text-gray-500 font-medium leading-relaxed line-clamp-2 md:line-clamp-none">{team.description}</p>
                    </div>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm" className="rounded-xl hover:bg-gray-100 h-8 w-8 md:h-10 md:w-10 p-0">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6 md:p-8 pt-0">
                  {/* Team Stats */}
                  <div className="grid grid-cols-3 gap-2 md:gap-4 mb-6 md:mb-8">
                    <div className="p-3 md:p-4 bg-gray-50 rounded-2xl md:rounded-3xl border border-gray-100 text-center">
                      <div className="text-lg md:text-2xl font-black text-gray-900">{team.members.length}</div>
                      <div className="text-[8px] md:text-[10px] uppercase font-bold text-gray-400 tracking-widest mt-0.5 md:mt-1">Members</div>
                    </div>
                    <div className="p-3 md:p-4 bg-blue-50/50 rounded-2xl md:rounded-3xl border border-blue-100/50 text-center">
                      <div className="text-lg md:text-2xl font-black text-blue-600">{team.projects}</div>
                      <div className="text-[8px] md:text-[10px] uppercase font-bold text-gray-400 tracking-widest mt-0.5 md:mt-1">Projects</div>
                    </div>
                    <div className="p-3 md:p-4 bg-emerald-50/50 rounded-2xl md:rounded-3xl border border-emerald-100/50 text-center">
                      <div className="text-lg md:text-2xl font-black text-emerald-600">
                        {Math.floor((Date.now() - team.createdAt.getTime()) / (1000 * 60 * 60 * 24))}
                      </div>
                      <div className="text-[8px] md:text-[10px] uppercase font-bold text-emerald-400 tracking-widest mt-0.5 md:mt-1">Days Up</div>
                    </div>
                  </div>

                  {/* Members */}
                  <div className="mb-6 md:mb-8">
                    <div className="flex items-center justify-between mb-3 md:mb-4">
                      <h4 className="text-[9px] md:text-[11px] font-black uppercase tracking-[0.2em] text-gray-400">Team Roster</h4>
                      <Badge variant="outline" className="rounded-full px-2 py-0 md:px-3 md:py-0.5 border-gray-200 text-gray-500 font-bold text-[9px] md:text-xs">{team.members.length} Active</Badge>
                    </div>
                    <div className="space-y-2 md:space-y-3">
                      {team.members.map((member) => (
                        <div key={member.id} className="flex items-center gap-3 md:gap-4 p-2 md:p-3 rounded-xl md:rounded-2xl hover:bg-gray-50 transition-all border border-transparent hover:border-gray-100">
                          <div className="relative">
                            <div className={`h-10 w-10 md:h-12 md:w-12 rounded-xl md:rounded-2xl ${member.role === 'Pending' ? 'bg-gray-100' : 'bg-gradient-to-br from-blue-500 to-purple-600'} flex items-center justify-center text-white font-black text-base md:text-lg shadow-inner overflow-hidden border-2 border-white`}>
                              {member.avatar.startsWith('http') ? (
                                <img src={member.avatar} alt={member.name} className="w-full h-full object-cover" />
                              ) : (
                                member.avatar
                              )}
                            </div>
                            {member.online && (
                              <div className="absolute -bottom-0.5 -right-0.5 md:-bottom-1 md:-right-1 h-3 w-3 md:h-4 md:w-4 rounded-full bg-emerald-500 border-2 md:border-[3px] border-white shadow-sm" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5 md:gap-2">
                              <span className="font-bold text-sm md:text-base text-gray-900 tracking-tight truncate">{member.name}</span>
                              {member.role === 'Leader' && (
                                <span className="bg-yellow-50 text-yellow-700 text-[8px] md:text-[9px] font-black uppercase px-1.5 py-0.5 rounded-full border border-yellow-100 flex-shrink-0">
                                  Lead
                                </span>
                              )}
                            </div>
                            <div className="flex flex-wrap gap-1 md:gap-2 mt-0.5 md:mt-1">
                              {member.skills.slice(0, 2).map((skill) => (
                                <span key={skill} className="text-[8px] md:text-[10px] font-bold text-gray-400 bg-gray-100/50 px-1.5 py-0.5 rounded-md md:rounded-lg border border-gray-200/30">
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 md:gap-3 mt-auto">
                    <Button
                      onClick={() => {
                        setSelectedTeam(team);
                        setShowInviteModal(true);
                      }}
                      className="flex-1 bg-white border-2 border-gray-100 text-gray-900 font-black rounded-xl md:rounded-2xl py-4 md:py-6 hover:bg-gray-50 hover:border-blue-100 hover:text-blue-600 transition-all shadow-sm text-xs md:text-sm"
                    >
                      <UserPlus className="h-4 w-4 md:h-5 md:w-5 mr-1.5 md:mr-2" />
                      Invite
                    </Button>
                    <Button
                      onClick={() => {
                        setSelectedTeam(team);
                        setShowProjectsModal(true);
                      }}
                      variant="outline"
                      className="rounded-xl md:rounded-2xl px-3 md:px-6 border-2 border-gray-100 text-gray-500 hover:text-gray-900 hover:border-gray-200 font-bold text-xs md:text-sm h-auto py-2 md:py-3"
                    >
                      View Projects
                    </Button>
                    {isLeader && (
                      <Button
                        variant="outline"
                        onClick={() => handleDeleteTeam(team.id)}
                        className="rounded-xl md:rounded-2xl px-3 md:px-6 border-2 border-red-50 text-red-100 hover:text-red-600 hover:border-red-100 hover:bg-red-50/30 group h-auto py-2 md:py-3"
                      >
                        <Trash2 className="h-4 w-4 md:h-5 md:w-5 group-hover:scale-110 transition-transform" />
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {teams.length === 0 && (
        <Card className="p-16 text-center rounded-[3rem] border-dashed border-2 border-gray-200 bg-gray-50/50">
          <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl text-gray-400 border border-gray-100">
            <Users size={32} />
          </div>
          <h3 className="text-2xl font-black text-gray-900 mb-2">Build Your Dream Team</h3>
          <p className="text-gray-500 font-medium mb-8 max-w-sm mx-auto">Great things are never done by one person. Start by creating a team or joining one.</p>
          <Button onClick={() => setShowCreateModal(true)} className="bg-gradient-to-r from-blue-600 to-purple-600 font-black px-10 py-7 rounded-2xl shadow-xl shadow-blue-500/20 hover:scale-105 transition-all">
            <Plus className="h-5 w-5 mr-3" />
            Create Your First Team
          </Button>
        </Card>
      )}
    </DashboardLayout>
  );
}

