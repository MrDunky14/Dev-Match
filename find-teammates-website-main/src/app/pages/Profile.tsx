import { useState } from 'react';
import { motion } from 'motion/react';
import { User as UserIcon, Mail, GraduationCap, Clock, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { DashboardLayout } from '../components/DashboardLayout';
import { useAuth } from '../contexts/AuthContext';
import { allSkills } from '../lib/mockData';

export function Profile() {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [college, setCollege] = useState(user?.college || '');
  const [skills, setSkills] = useState<string[]>(user?.skills || []);
  const [interests, setInterests] = useState<string[]>(user?.interests || []);
  const [experience, setExperience] = useState(user?.experience || 'Beginner');
  const [availability, setAvailability] = useState(user?.availability || 'Weekends');
  const [skillInput, setSkillInput] = useState('');
  const [interestInput, setInterestInput] = useState('');

  const handleSave = () => {
    updateProfile({
      name,
      bio,
      college,
      skills,
      interests,
      experience: experience as any,
      availability: availability as any,
    });
    setIsEditing(false);
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

  return (
    <DashboardLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-4xl font-black text-gray-900 tracking-tight">Profile</h1>
            <p className="mt-1 text-sm md:text-base text-gray-600 font-medium">Manage your personal information and preferences</p>
          </div>
          {!isEditing ? (
            <Button onClick={() => setIsEditing(true)} className="w-full sm:w-auto px-8">Edit Profile</Button>
          ) : (
            <div className="flex gap-2 w-full sm:w-auto">
              <Button variant="outline" onClick={() => setIsEditing(false)} className="flex-1 sm:flex-none">Cancel</Button>
              <Button onClick={handleSave} className="flex-1 sm:flex-none bg-blue-600 hover:bg-blue-700">Save Changes</Button>
            </div>
          )}
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Profile Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-1"
          >
            <Card className="premium-shadow border-none bg-white/80 backdrop-blur-sm sticky top-8">
              <CardContent className="p-8">
                <div className="text-center">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="mx-auto mb-6 flex h-32 w-32 items-center justify-center rounded-[2rem] bg-gradient-to-br from-blue-600 to-purple-600 text-4xl font-black text-white overflow-hidden shadow-2xl border-4 border-white"
                  >
                    {user?.profileImage ? (
                      <img src={user.profileImage} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                      user?.name.charAt(0).toUpperCase()
                    )}
                  </motion.div>
                  <h2 className="text-xl font-bold text-gray-900">{user?.name}</h2>
                  <p className="text-gray-600">{user?.college}</p>

                  <div className="mt-6 space-y-3">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Mail className="h-4 w-4" />
                      {user?.email}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <GraduationCap className="h-4 w-4" />
                      {user?.experience}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock className="h-4 w-4" />
                      {user?.availability}
                    </div>
                  </div>

                  <div className="mt-6 grid grid-cols-2 gap-4 rounded-lg bg-gray-50 p-4">
                    <div>
                      <div className="text-2xl font-bold text-gray-900">{skills.length}</div>
                      <div className="text-sm text-gray-600">Skills</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-gray-900">{interests.length}</div>
                      <div className="text-sm text-gray-600">Interests</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Profile Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="premium-shadow border-none bg-white/80 backdrop-blur-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl font-black tracking-tight">Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Name</label>
                    <Input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      disabled={!isEditing}
                      className="rounded-xl border-gray-100 py-6"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">College/University</label>
                    <Input
                      value={college}
                      onChange={(e) => setCollege(e.target.value)}
                      disabled={!isEditing}
                      className="rounded-xl border-gray-100 py-6"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Bio</label>
                    <textarea
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      disabled={!isEditing}
                      rows={4}
                      className="w-full rounded-xl border border-gray-100 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:bg-gray-50/50"
                      placeholder="Tell us about yourself..."
                    />
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Experience Level</label>
                      <select
                        value={experience}
                        onChange={(e) => setExperience(e.target.value as any)}
                        disabled={!isEditing}
                        className="w-full rounded-xl border border-gray-100 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:bg-gray-50/50 bg-white"
                      >
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Advanced">Advanced</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Availability</label>
                      <select
                        value={availability}
                        onChange={(e) => setAvailability(e.target.value as any)}
                        disabled={!isEditing}
                        className="w-full rounded-xl border border-gray-100 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:bg-gray-50/50 bg-white"
                      >
                        <option value="Full-time">Full-time</option>
                        <option value="Part-time">Part-time</option>
                        <option value="Weekends">Weekends</option>
                      </select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Skills */}
            <Card>
              <CardHeader>
                <CardTitle>Skills</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {isEditing && (
                    <div>
                      <Input
                        placeholder="Type to search skills..."
                        value={skillInput}
                        onChange={(e) => setSkillInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && skillInput) {
                            addSkill(skillInput);
                          }
                        }}
                      />
                      {skillInput && filteredSkills.length > 0 && (
                        <div className="mt-2 max-h-40 overflow-y-auto rounded-lg border border-gray-200 bg-white p-2">
                          {filteredSkills.slice(0, 8).map(skill => (
                            <button
                              key={skill}
                              onClick={() => addSkill(skill)}
                              className="w-full rounded px-3 py-2 text-left text-sm hover:bg-gray-100"
                            >
                              {skill}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  <div className="flex flex-wrap gap-2">
                    {skills.length === 0 ? (
                      <p className="text-sm text-gray-500">No skills added yet</p>
                    ) : (
                      skills.map(skill => (
                        <Badge key={skill} variant="default" className="gap-1">
                          {skill}
                          {isEditing && (
                            <button onClick={() => removeSkill(skill)} className="ml-1">
                              <X className="h-3 w-3" />
                            </button>
                          )}
                        </Badge>
                      ))
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Interests */}
            <Card>
              <CardHeader>
                <CardTitle>Interests</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {isEditing && (
                    <Input
                      placeholder="Add an interest..."
                      value={interestInput}
                      onChange={(e) => setInterestInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && interestInput) {
                          addInterest(interestInput);
                        }
                      }}
                    />
                  )}

                  <div className="flex flex-wrap gap-2">
                    {interests.length === 0 ? (
                      <p className="text-sm text-gray-500">No interests added yet</p>
                    ) : (
                      interests.map(interest => (
                        <Badge key={interest} variant="secondary" className="gap-1">
                          {interest}
                          {isEditing && (
                            <button onClick={() => removeInterest(interest)} className="ml-1">
                              <X className="h-3 w-3" />
                            </button>
                          )}
                        </Badge>
                      ))
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </motion.div>
    </DashboardLayout >
  );
}
