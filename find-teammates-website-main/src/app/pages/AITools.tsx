import { useState } from 'react';
import { motion } from 'motion/react';
import {
  Sparkles,
  Target,
  Lightbulb,
  TrendingUp,
  CheckCircle2,
  Circle,
  Rocket,
  Code,
  Layers
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { DashboardLayout } from '../components/DashboardLayout';
import { useAuth } from '../contexts/AuthContext';
import { analyzeSkillGap, generateProjectIdea } from '../lib/aiService';
import { SkillGapAnalysis, ProjectIdea } from '../lib/types';

const targetRoles = [
  'Frontend Developer',
  'Backend Developer',
  'Full Stack Developer',
  'AI/ML Engineer',
  'Mobile Developer',
  'DevOps Engineer',
];

export function AITools() {
  const { user } = useAuth();
  const [selectedTool, setSelectedTool] = useState<'skillGap' | 'projectIdea' | null>(null);

  // Skill Gap State
  const [selectedRole, setSelectedRole] = useState('Frontend Developer');
  const [skillGapResult, setSkillGapResult] = useState<SkillGapAnalysis | null>(null);

  // Project Idea State
  const [projectTheme, setProjectTheme] = useState('');
  const [projectIdea, setProjectIdea] = useState<ProjectIdea | null>(null);
  const [generating, setGenerating] = useState(false);

  const handleAnalyzeSkillGap = () => {
    if (!user) {
      alert('Please log in to use this feature');
      return;
    }
    console.log('Analyzing skills:', user.skills, 'for role:', selectedRole);
    setGenerating(true);
    // Simulate processing
    setTimeout(() => {
      const result = analyzeSkillGap(user.skills, selectedRole);
      console.log('Analysis result:', result);
      setSkillGapResult(result);
      setGenerating(false);
    }, 800);
  };

  const handleGenerateProject = async () => {
    if (!user) {
      alert('Please log in to use this feature');
      return;
    }
    console.log('Generating project with skills:', user.skills, 'theme:', projectTheme);
    setGenerating(true);

    // Simulate AI generation delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    const idea = generateProjectIdea(user.skills, projectTheme || undefined);
    console.log('Generated project idea:', idea);
    setProjectIdea(idea);
    setGenerating(false);
  };

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-2xl md:text-4xl font-black text-gray-900 tracking-tight">AI Tools</h1>
        <p className="mt-1 text-sm md:text-base text-gray-600 font-medium">
          Powered by AI to accelerate your development journey
        </p>
      </div>

      {!selectedTool ? (
        <div className="grid gap-6 md:grid-cols-2">
          {/* Skill Gap Analysis Tool */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="h-full hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                  <Target className="h-8 w-8" />
                </div>

                <h2 className="mb-3 text-2xl font-bold text-gray-900">
                  Skill Gap Analysis
                </h2>

                <p className="mb-6 text-gray-600">
                  Compare your current skills with your target role and get a personalized learning roadmap
                </p>

                <ul className="space-y-2 mb-6">
                  {[
                    'Identify missing skills for your dream role',
                    'Get personalized learning path',
                    'Track your progress over time',
                  ].map((feature, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm text-gray-700">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <Button className="w-full" onClick={(e) => {
                  e.stopPropagation();
                  setSelectedTool('skillGap');
                }}>
                  Start Analysis
                  <Sparkles className="h-4 w-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Project Idea Generator Tool */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="h-full hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 text-white">
                  <Lightbulb className="h-8 w-8" />
                </div>

                <h2 className="mb-3 text-2xl font-bold text-gray-900">
                  Project Idea Generator
                </h2>

                <p className="mb-6 text-gray-600">
                  Generate hackathon-ready project ideas tailored to your skills with complete tech stacks
                </p>

                <ul className="space-y-2 mb-6">
                  {[
                    'AI-powered project suggestions',
                    'Complete tech stack recommendations',
                    'MVP scope and feature breakdown',
                  ].map((feature, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm text-gray-700">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <Button className="w-full" onClick={(e) => {
                  e.stopPropagation();
                  setSelectedTool('projectIdea');
                }}>
                  Generate Ideas
                  <Rocket className="h-4 w-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      ) : selectedTool === 'skillGap' ? (
        /* Skill Gap Analysis Interface */
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Button
            variant="ghost"
            onClick={() => {
              setSelectedTool(null);
              setSkillGapResult(null);
            }}
            className="mb-6"
          >
            ← Back to Tools
          </Button>

          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-blue-600" />
                    Skill Gap Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Select Your Target Role
                      </label>
                      <select
                        value={selectedRole}
                        onChange={(e) => setSelectedRole(e.target.value)}
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {targetRoles.map(role => (
                          <option key={role} value={role}>{role}</option>
                        ))}
                      </select>
                    </div>

                    <Button onClick={handleAnalyzeSkillGap} className="w-full" disabled={generating}>
                      {generating ? (
                        <>
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent mr-2" />
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-4 w-4 mr-2" />
                          Analyze My Skills
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {skillGapResult && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle>Analysis Results</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Progress */}
                      <div>
                        <div className="mb-2 flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-700">
                            Progress towards {skillGapResult.role}
                          </span>
                          <span className="text-sm font-semibold text-blue-600">
                            {skillGapResult.progress}%
                          </span>
                        </div>
                        <div className="h-3 w-full rounded-full bg-gray-200">
                          <div
                            className="h-3 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 transition-all"
                            style={{ width: `${skillGapResult.progress}%` }}
                          />
                        </div>
                      </div>

                      {/* Current Skills */}
                      <div>
                        <h3 className="mb-3 flex items-center gap-2 font-semibold text-gray-900">
                          <CheckCircle2 className="h-5 w-5 text-green-600" />
                          Skills You Have
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {skillGapResult.currentSkills.map(skill => (
                            <Badge key={skill} variant="success">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Missing Skills */}
                      {skillGapResult.missingSkills.length > 0 && (
                        <div>
                          <h3 className="mb-3 flex items-center gap-2 font-semibold text-gray-900">
                            <Circle className="h-5 w-5 text-orange-600" />
                            Skills to Learn
                          </h3>
                          <div className="flex flex-wrap gap-2">
                            {skillGapResult.missingSkills.map(skill => (
                              <Badge key={skill} variant="warning">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Learning Path */}
                      <div>
                        <h3 className="mb-3 flex items-center gap-2 font-semibold text-gray-900">
                          <TrendingUp className="h-5 w-5 text-blue-600" />
                          Recommended Learning Path
                        </h3>
                        <div className="space-y-3">
                          {skillGapResult.recommendedPath.map((step, index) => (
                            <div key={index} className="flex gap-3">
                              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-600">
                                {index + 1}
                              </div>
                              <div className="flex-1 rounded-lg bg-gray-50 p-3 text-sm text-gray-700">
                                {step}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <Card className="sticky top-8">
                <CardContent className="p-6">
                  <h3 className="mb-4 font-semibold text-gray-900">Your Current Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {user?.skills.map(skill => (
                      <Badge key={skill} variant="default">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </motion.div>
      ) : (
        /* Project Idea Generator Interface */
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Button
            variant="ghost"
            onClick={() => {
              setSelectedTool(null);
              setProjectIdea(null);
            }}
            className="mb-6"
          >
            ← Back to Tools
          </Button>

          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="h-5 w-5 text-purple-600" />
                    Project Idea Generator
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Hackathon Theme (Optional)
                      </label>
                      <input
                        type="text"
                        value={projectTheme}
                        onChange={(e) => setProjectTheme(e.target.value)}
                        placeholder="e.g., Healthcare, Education, Climate"
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>

                    <Button
                      onClick={handleGenerateProject}
                      className="w-full bg-purple-600 hover:bg-purple-700"
                      disabled={generating}
                    >
                      {generating ? (
                        <>
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Rocket className="h-4 w-4" />
                          Generate Project Idea
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {projectIdea && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-6"
                >
                  {/* Project Title */}
                  <Card className="bg-gradient-to-r from-purple-600 to-blue-600">
                    <CardContent className="p-8 text-white">
                      <div className="mb-2 flex items-center gap-2">
                        <Badge className="bg-white/20 text-white border-white/30">
                          {projectIdea.difficulty}
                        </Badge>
                      </div>
                      <h2 className="text-3xl font-bold">{projectIdea.title}</h2>
                    </CardContent>
                  </Card>

                  {/* Problem Statement */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Target className="h-5 w-5 text-purple-600" />
                        Problem Statement
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700">{projectIdea.problemStatement}</p>
                    </CardContent>
                  </Card>

                  {/* Features */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Layers className="h-5 w-5 text-blue-600" />
                        Key Features
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {projectIdea.features.map((feature, index) => (
                          <li key={index} className="flex items-start gap-3">
                            <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                            <span className="text-gray-700">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  {/* Tech Stack */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Code className="h-5 w-5 text-orange-600" />
                        Recommended Tech Stack
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {projectIdea.techStack.map(tech => (
                          <Badge key={tech} variant="outline" className="text-base py-1 px-3">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* MVP Scope */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Rocket className="h-5 w-5 text-green-600" />
                        MVP Scope
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700">{projectIdea.mvpScope}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <Card className="sticky top-8">
                <CardContent className="p-6">
                  <h3 className="mb-4 font-semibold text-gray-900">Based on Your Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {user?.skills.map(skill => (
                      <Badge key={skill} variant="default">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </motion.div>
      )}
    </DashboardLayout>
  );
}