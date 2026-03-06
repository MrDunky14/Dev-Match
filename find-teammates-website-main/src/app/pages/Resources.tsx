import { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Search, 
  Filter, 
  ThumbsUp, 
  ExternalLink,
  BookOpen,
  Youtube,
  Github,
  FileText,
  GraduationCap,
  Bookmark,
  Share2
} from 'lucide-react';
import { Card, CardContent } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { DashboardLayout } from '../components/DashboardLayout';
import { mockResources } from '../lib/mockData';
import { Resource } from '../lib/types';

const categoryIcons = {
  GitHub: Github,
  YouTube: Youtube,
  Docs: FileText,
  Course: GraduationCap,
  Blog: BookOpen,
};

const categories = ['All', 'GitHub', 'YouTube', 'Docs', 'Course', 'Blog'];

export function Resources() {
  const [resources, setResources] = useState(mockResources);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState<'recent' | 'popular'>('popular');
  const [upvotedResources, setUpvotedResources] = useState<Set<string>>(new Set());
  const [bookmarkedResources, setBookmarkedResources] = useState<Set<string>>(new Set());

  const handleUpvote = (resourceId: string) => {
    if (upvotedResources.has(resourceId)) {
      // Already upvoted, remove upvote
      setUpvotedResources(prev => {
        const newSet = new Set(prev);
        newSet.delete(resourceId);
        return newSet;
      });
      setResources(resources.map(r =>
        r.id === resourceId ? { ...r, upvotes: r.upvotes - 1 } : r
      ));
    } else {
      // Add upvote
      setUpvotedResources(prev => new Set(prev).add(resourceId));
      setResources(resources.map(r =>
        r.id === resourceId ? { ...r, upvotes: r.upvotes + 1 } : r
      ));
    }
  };

  const handleBookmark = (resourceId: string) => {
    if (bookmarkedResources.has(resourceId)) {
      setBookmarkedResources(prev => {
        const newSet = new Set(prev);
        newSet.delete(resourceId);
        return newSet;
      });
    } else {
      setBookmarkedResources(prev => new Set(prev).add(resourceId));
    }
  };

  const filteredResources = resources
    .filter(resource => {
      const matchesSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          resource.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCategory = selectedCategory === 'All' || resource.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortBy === 'popular') {
        return b.upvotes - a.upvotes;
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Resource Hub</h1>
        <p className="mt-2 text-gray-600">
          Curated learning resources recommended by the community
        </p>
      </div>

      {/* Search and Filters */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-col gap-4 md:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search resources by title or tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'recent' | 'popular')}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="popular">Most Popular</option>
              <option value="recent">Most Recent</option>
            </select>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2">
          {categories.map(category => (
            <Button
              key={category}
              onClick={() => setSelectedCategory(category)}
              variant={selectedCategory === category ? 'default' : 'outline'}
              size="sm"
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {/* Resource Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredResources.map((resource, index) => {
          const Icon = categoryIcons[resource.category];
          
          return (
            <motion.div
              key={resource.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="mb-4 flex items-start justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50 text-blue-600 flex-shrink-0">
                      <Icon className="h-6 w-6" />
                    </div>
                    <Badge variant="outline">{resource.category}</Badge>
                  </div>

                  <h3 className="mb-2 font-semibold text-gray-900 line-clamp-2">
                    {resource.title}
                  </h3>
                  
                  <p className="mb-4 text-sm text-gray-600 line-clamp-2">
                    {resource.description}
                  </p>

                  <div className="mb-4 flex flex-wrap gap-1">
                    {resource.tags.slice(0, 3).map(tag => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                    <button
                      onClick={() => handleUpvote(resource.id)}
                      className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 transition-colors"
                    >
                      <ThumbsUp className="h-4 w-4" />
                      <span className="font-medium">{resource.upvotes}</span>
                    </button>

                    <a
                      href={resource.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700"
                    >
                      View Resource
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </div>

                  <div className="mt-3 text-xs text-gray-500">
                    Added by {resource.createdBy}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {filteredResources.length === 0 && (
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="text-center">
            <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-semibold text-gray-900">No resources found</h3>
            <p className="mt-2 text-gray-600">
              Try adjusting your search or filters
            </p>
          </div>
        </div>
      )}

      {/* AI Recommendations Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-8"
      >
        <Card className="bg-gradient-to-r from-blue-600 to-purple-600">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="text-white">
                <h3 className="mb-2 text-xl font-bold">Want personalized recommendations?</h3>
                <p className="text-blue-100">
                  Our AI can suggest resources based on your skills and learning goals
                </p>
              </div>
              <Button variant="outline" className="bg-white text-blue-600 hover:bg-gray-50 border-0">
                Get AI Recommendations
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </DashboardLayout>
  );
}