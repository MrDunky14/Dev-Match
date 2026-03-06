import { motion } from 'motion/react';
import { 
  Bell, 
  Users, 
  BookOpen, 
  Trophy, 
  Calendar,
  Check,
  Trash2,
  Filter,
  Search
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { DashboardLayout } from '../components/DashboardLayout';
import { useState } from 'react';

export function Notifications() {
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const allNotifications = [
    {
      id: 1,
      type: 'match',
      message: 'You have 3 new potential teammates!',
      detail: 'Priya Patel, Rahul Verma, and Sneha Gupta match your profile with 90%+ compatibility.',
      time: '5 min ago',
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      unread: true
    },
    {
      id: 2,
      type: 'resource',
      message: 'New resource: "Advanced React Patterns"',
      detail: 'A comprehensive guide to advanced React patterns and best practices.',
      time: '1 hour ago',
      icon: BookOpen,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      unread: true
    },
    {
      id: 3,
      type: 'achievement',
      message: 'Achievement unlocked: Social Butterfly 🎉',
      detail: 'You\'ve successfully connected with 10+ developers. Keep growing your network!',
      time: '2 hours ago',
      icon: Trophy,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      unread: false
    },
    {
      id: 4,
      type: 'hackathon',
      message: 'DevFest 2026 registration closing in 3 days',
      detail: 'Don\'t miss out! Register now for DevFest 2026 with $50,000 prize pool.',
      time: '5 hours ago',
      icon: Calendar,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      unread: false
    },
    {
      id: 5,
      type: 'match',
      message: 'New message from Karthik Reddy',
      detail: 'Hey! I saw your React skills. Would love to collaborate on a project!',
      time: '1 day ago',
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      unread: false
    },
    {
      id: 6,
      type: 'resource',
      message: 'Recommended: "TypeScript Best Practices"',
      detail: 'Based on your learning path, this resource will help you master TypeScript.',
      time: '2 days ago',
      icon: BookOpen,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      unread: false
    },
    {
      id: 7,
      type: 'achievement',
      message: 'You completed your first week streak! 🔥',
      detail: 'Congratulations on logging in for 7 consecutive days. Keep it up!',
      time: '3 days ago',
      icon: Trophy,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      unread: false
    },
    {
      id: 8,
      type: 'hackathon',
      message: 'AI Innovation Challenge starts tomorrow',
      detail: 'Get ready for the biggest AI hackathon with $100,000 prize pool.',
      time: '4 days ago',
      icon: Calendar,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      unread: false
    },
  ];

  const filteredNotifications = filter === 'all' 
    ? allNotifications 
    : allNotifications.filter(n => n.unread);

  const unreadCount = allNotifications.filter(n => n.unread).length;

  return (
    <DashboardLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto"
      >
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Bell className="h-8 w-8 text-blue-600" />
              Notifications
            </h1>
            {unreadCount > 0 && (
              <Badge variant="destructive" className="text-sm px-3 py-1">
                {unreadCount} New
              </Badge>
            )}
          </div>
          <p className="text-gray-600">
            Stay updated with your latest activities and opportunities
          </p>
        </div>

        {/* Filters & Actions */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
              {/* Filter Tabs */}
              <div className="flex gap-2">
                <Button
                  variant={filter === 'all' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilter('all')}
                >
                  <Filter className="h-4 w-4 mr-2" />
                  All ({allNotifications.length})
                </Button>
                <Button
                  variant={filter === 'unread' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilter('unread')}
                >
                  <Bell className="h-4 w-4 mr-2" />
                  Unread ({unreadCount})
                </Button>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Check className="h-4 w-4 mr-2" />
                  Mark All as Read
                </Button>
                <Button variant="outline" size="sm">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear All
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notifications List */}
        <div className="space-y-4">
          {filteredNotifications.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No {filter === 'unread' ? 'unread' : ''} notifications
                </h3>
                <p className="text-gray-600">
                  You're all caught up! Check back later for updates.
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredNotifications.map((notification, index) => (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className={`hover:shadow-lg transition-all cursor-pointer ${
                  notification.unread ? 'border-2 border-blue-200' : ''
                }`}>
                  <CardContent className="p-6">
                    <div className="flex gap-4">
                      {/* Icon */}
                      <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${notification.bgColor} flex-shrink-0`}>
                        <notification.icon className={`h-6 w-6 ${notification.color}`} />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-semibold text-gray-900">
                            {notification.message}
                          </h3>
                          {notification.unread && (
                            <div className="h-3 w-3 rounded-full bg-blue-600 flex-shrink-0 ml-2" />
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mb-3">
                          {notification.detail}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">{notification.time}</span>
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm">
                              <Check className="h-4 w-4 mr-1" />
                              Mark as Read
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Trash2 className="h-4 w-4 mr-1" />
                              Delete
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          )}
        </div>

        {/* Load More */}
        {filteredNotifications.length > 0 && (
          <div className="mt-8 text-center">
            <Button variant="outline" size="lg">
              Load More Notifications
            </Button>
          </div>
        )}
      </motion.div>
    </DashboardLayout>
  );
}
