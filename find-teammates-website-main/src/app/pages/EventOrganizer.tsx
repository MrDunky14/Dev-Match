import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Calendar,
  Plus,
  Edit,
  Trash2,
  Users,
  Eye,
  Bookmark,
  TrendingUp,
  CheckCircle,
  Clock,
  MapPin,
  Trophy,
  Sparkles,
  BarChart3,
  Settings,
  Share2,
  X,
  AlertCircle,
  UserPlus,
  Target,
  Mail,
  Phone,
  GraduationCap,
  Github,
  Copy,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { DashboardLayout } from '../components/DashboardLayout';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

interface OrganizerEvent {
  id: string;
  title: string;
  type: 'Hackathon' | 'Workshop' | 'Webinar' | 'Conference';
  date: string;
  endDate: string;
  location: string;
  mode: 'Online' | 'Offline' | 'Hybrid';
  prize: string;
  description: string;
  tags: string[];
  status: 'Draft' | 'Published' | 'Ongoing' | 'Completed';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  maxParticipants: number;
  registrations: number;
  interested: number;
  views: number;
  organizer: string;
  publishedDate?: string;
  teamSize: number;
  teamMembers: string[];
}

const mockOrganizerEvents: OrganizerEvent[] = [
  {
    id: 'org-1',
    title: 'DevFest 2026',
    type: 'Hackathon',
    date: '2026-03-15',
    endDate: '2026-03-17',
    location: 'Bangalore, India',
    mode: 'Hybrid',
    prize: '$50,000',
    description: 'Build innovative solutions using Google technologies. 48-hour hackathon with mentorship and prizes.',
    tags: ['Web Development', 'AI/ML', 'Cloud'],
    status: 'Published',
    difficulty: 'Intermediate',
    maxParticipants: 500,
    registrations: 342,
    interested: 1250,
    views: 4500,
    organizer: 'Google Developers',
    publishedDate: '2026-02-01',
    teamSize: 3,
    teamMembers: ['Alice', 'Bob', 'Charlie'],
  },
  {
    id: 'org-2',
    title: 'AI Innovation Challenge',
    type: 'Hackathon',
    date: '2026-03-22',
    endDate: '2026-03-24',
    location: 'Online',
    mode: 'Online',
    prize: '$100,000',
    description: 'Create AI-powered applications that solve real-world problems.',
    tags: ['AI/ML', 'NLP', 'Computer Vision'],
    status: 'Published',
    difficulty: 'Advanced',
    maxParticipants: 1000,
    registrations: 856,
    interested: 2100,
    views: 8900,
    organizer: 'OpenAI',
    publishedDate: '2026-02-10',
    teamSize: 5,
    teamMembers: ['David', 'Eve', 'Frank', 'Grace', 'Hannah'],
  },
  {
    id: 'org-3',
    title: 'React Workshop Series',
    type: 'Workshop',
    date: '2026-04-10',
    endDate: '2026-04-10',
    location: 'Online',
    mode: 'Online',
    prize: 'Free',
    description: 'Learn React 19 from scratch with hands-on projects.',
    tags: ['React', 'JavaScript', 'Frontend'],
    status: 'Draft',
    difficulty: 'Beginner',
    maxParticipants: 200,
    registrations: 0,
    interested: 0,
    views: 0,
    organizer: 'Meta',
    teamSize: 2,
    teamMembers: ['Ian', 'Judy'],
  },
];

export function EventOrganizer() {
  // Load events from localStorage on mount
  const [events, setEvents] = useState<OrganizerEvent[]>(() => {
    const savedEvents = localStorage.getItem('organizerEvents');
    return savedEvents ? JSON.parse(savedEvents) : mockOrganizerEvents;
  });
  
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<OrganizerEvent | null>(null);
  const [showAnalytics, setShowAnalytics] = useState<string | null>(null);
  const [showParticipants, setShowParticipants] = useState<string | null>(null);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<OrganizerEvent | null>(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [sharingEvent, setSharingEvent] = useState<OrganizerEvent | null>(null);

  // Save events to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('organizerEvents', JSON.stringify(events));
    // Dispatch custom event for same-tab updates
    window.dispatchEvent(new Event('eventsUpdated'));
  }, [events]);

  // Form state for creating/editing events
  const [formData, setFormData] = useState({
    title: '',
    type: 'Hackathon' as 'Hackathon' | 'Workshop' | 'Webinar' | 'Conference',
    date: '',
    endDate: '',
    location: '',
    mode: 'Online' as 'Online' | 'Offline' | 'Hybrid',
    prize: '',
    description: '',
    tags: '',
    difficulty: 'Beginner' as 'Beginner' | 'Intermediate' | 'Advanced',
    maxParticipants: 100,
    teamSize: 1,
    teamMembers: '',
  });

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();

    const newEvent: OrganizerEvent = {
      id: Date.now().toString(),
      ...formData,
      tags: formData.tags.split(',').map(tag => tag.trim()),
      status: 'Draft',
      registrations: 0,
      interested: 0,
      views: 0,
      organizer: 'Your Organization',
      teamMembers: formData.teamMembers.split(',').map(member => member.trim()),
    };

    setEvents([newEvent, ...events]);
    setShowCreateModal(false);
    resetForm();
    showNotificationMessage('Event created successfully! You can now publish it.');
  };

  const handlePublishEvent = (eventId: string) => {
    setEvents(events.map(event =>
      event.id === eventId
        ? { ...event, status: 'Published' as const, publishedDate: new Date().toISOString() }
        : event
    ));
    showNotificationMessage('Event published successfully!');
  };

  const handleDeleteEvent = (eventId: string) => {
    if (confirm('Are you sure you want to delete this event?')) {
      setEvents(events.filter(event => event.id !== eventId));
      showNotificationMessage('Event deleted successfully!');
    }
  };

  const handleEditEvent = (event: OrganizerEvent) => {
    setEditingEvent(event);
    setFormData({
      title: event.title,
      type: event.type,
      date: event.date,
      endDate: event.endDate,
      location: event.location,
      mode: event.mode,
      prize: event.prize,
      description: event.description,
      tags: event.tags.join(', '),
      difficulty: event.difficulty,
      maxParticipants: event.maxParticipants,
      teamSize: event.teamSize,
      teamMembers: event.teamMembers.join(', '),
    });
    setShowEditModal(true);
  };

  const handleUpdateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEvent) return;

    const updatedEvent: OrganizerEvent = {
      ...editingEvent,
      ...formData,
      tags: formData.tags.split(',').map(tag => tag.trim()),
      teamMembers: formData.teamMembers.split(',').map(member => member.trim()).filter(m => m),
    };

    setEvents(events.map(event =>
      event.id === editingEvent.id ? updatedEvent : event
    ));
    
    setShowEditModal(false);
    setEditingEvent(null);
    resetForm();
    showNotificationMessage('Event updated successfully!');
  };

  const handleShareEvent = (event: OrganizerEvent) => {
    setSharingEvent(event);
    setShowShareModal(true);
  };

  const copyToClipboard = async (text: string) => {
    try {
      // Modern Clipboard API
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        showNotificationMessage('Event link copied to clipboard! 📋');
        return true;
      }
      
      // Fallback for older browsers
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.left = '-999999px';
      textarea.style.top = '-999999px';
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      
      const successful = document.execCommand('copy');
      document.body.removeChild(textarea);
      
      if (successful) {
        showNotificationMessage('Event link copied to clipboard! 📋');
        return true;
      }
      return false;
    } catch (err) {
      console.error('Failed to copy:', err);
      showNotificationMessage('Failed to copy link. Please try again.');
      return false;
    }
  };

  const handleCopyLink = async () => {
    if (!sharingEvent) return;
    const eventUrl = `${window.location.origin}/events?id=${sharingEvent.id}`;
    await copyToClipboard(eventUrl);
    setShowShareModal(false);
    setSharingEvent(null);
  };

  const handleShareVia = (platform: string) => {
    if (!sharingEvent) return;
    
    const eventUrl = `${window.location.origin}/events?id=${sharingEvent.id}`;
    const title = encodeURIComponent(sharingEvent.title);
    const text = encodeURIComponent(`Check out this amazing event: ${sharingEvent.title}\n\nDate: ${new Date(sharingEvent.date).toLocaleDateString()}\nPrize: ${sharingEvent.prize}`);
    
    let shareUrl = '';
    
    switch (platform) {
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${text}%0A%0A${encodeURIComponent(eventUrl)}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(eventUrl)}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(eventUrl)}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(eventUrl)}`;
        break;
      case 'telegram':
        shareUrl = `https://t.me/share/url?url=${encodeURIComponent(eventUrl)}&text=${text}`;
        break;
      case 'email':
        shareUrl = `mailto:?subject=${title}&body=${text}%0A%0A${encodeURIComponent(eventUrl)}`;
        break;
    }
    
    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
      showNotificationMessage('Opening share dialog... 🚀');
      setShowShareModal(false);
      setSharingEvent(null);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      type: 'Hackathon',
      date: '',
      endDate: '',
      location: '',
      mode: 'Online',
      prize: '',
      description: '',
      tags: '',
      difficulty: 'Beginner',
      maxParticipants: 100,
      teamSize: 1,
      teamMembers: '',
    });
  };

  const showNotificationMessage = (message: string) => {
    setNotificationMessage(message);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 4000);
  };

  // Calculate statistics
  const totalEvents = events.length;
  const publishedEvents = events.filter(e => e.status === 'Published').length;
  const totalRegistrations = events.reduce((sum, e) => sum + e.registrations, 0);
  const totalInterested = events.reduce((sum, e) => sum + e.interested, 0);
  const totalViews = events.reduce((sum, e) => sum + e.views, 0);

  // Chart data
  const registrationData = events
    .filter(e => e.status === 'Published')
    .map(e => ({
      name: e.title.length > 20 ? e.title.substring(0, 20) + '...' : e.title,
      registrations: e.registrations,
      interested: e.interested,
    }));

  const statusData = [
    { name: 'Published', value: events.filter(e => e.status === 'Published').length, color: '#10b981' },
    { name: 'Draft', value: events.filter(e => e.status === 'Draft').length, color: '#f59e0b' },
    { name: 'Ongoing', value: events.filter(e => e.status === 'Ongoing').length, color: '#3b82f6' },
    { name: 'Completed', value: events.filter(e => e.status === 'Completed').length, color: '#6b7280' },
  ].filter(d => d.value > 0);

  return (
    <DashboardLayout>
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <Calendar className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Event Organizer</h1>
          </div>
          <Button onClick={() => setShowCreateModal(true)} className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Create Event
          </Button>
        </div>
        <p className="text-gray-600">
          Manage your events and track registrations
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-5 mb-6">
        <Card className="border-2 border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-600 mb-1">Total Events</div>
                <div className="text-3xl font-bold text-blue-600">{totalEvents}</div>
              </div>
              <Calendar className="h-10 w-10 text-blue-600 opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-green-200 bg-green-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-600 mb-1">Published</div>
                <div className="text-3xl font-bold text-green-600">{publishedEvents}</div>
              </div>
              <CheckCircle className="h-10 w-10 text-green-600 opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-purple-200 bg-purple-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-600 mb-1">Registrations</div>
                <div className="text-3xl font-bold text-purple-600">{totalRegistrations}</div>
              </div>
              <Users className="h-10 w-10 text-purple-600 opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-orange-200 bg-orange-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-600 mb-1">Interested</div>
                <div className="text-3xl font-bold text-orange-600">{totalInterested}</div>
              </div>
              <Bookmark className="h-10 w-10 text-orange-600 opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-pink-200 bg-pink-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-600 mb-1">Total Views</div>
                <div className="text-3xl font-bold text-pink-600">{totalViews}</div>
              </div>
              <Eye className="h-10 w-10 text-pink-600 opacity-20" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Charts */}
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-blue-600" />
              Registration Analytics
            </CardTitle>
          </CardHeader>
          <CardContent>
            {registrationData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={registrationData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" fontSize={12} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="registrations" fill="#8b5cf6" name="Registered" />
                  <Bar dataKey="interested" fill="#f59e0b" name="Interested" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center py-12 text-gray-500">
                No published events yet
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              Event Status Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Events List */}
      <Card>
        <CardHeader>
          <CardTitle>Your Events</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {events.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="border rounded-lg p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-gray-900">{event.title}</h3>
                      <Badge
                        className={
                          event.status === 'Published'
                            ? 'bg-green-100 text-green-700 border-green-300'
                            : event.status === 'Draft'
                            ? 'bg-yellow-100 text-yellow-700 border-yellow-300'
                            : event.status === 'Ongoing'
                            ? 'bg-blue-100 text-blue-700 border-blue-300'
                            : 'bg-gray-100 text-gray-700 border-gray-300'
                        }
                      >
                        {event.status}
                      </Badge>
                    </div>
                    <p className="text-gray-600 mb-3">{event.description}</p>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="h-4 w-4 text-blue-600" />
                        <span>{new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="h-4 w-4 text-red-600" />
                        <span>{event.mode}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Trophy className="h-4 w-4 text-yellow-600" />
                        <span>{event.prize}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Eye className="h-4 w-4 text-purple-600" />
                        <span>{event.views} views</span>
                      </div>
                    </div>

                    {/* Team Info */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">Team Configuration</span>
                        <Badge className="bg-blue-100 text-blue-700 border-blue-300">
                          <UserPlus className="h-3 w-3 mr-1" />
                          {event.teamSize} members
                        </Badge>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {event.teamMembers.map((member, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {member}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Event Stats */}
                    {event.status === 'Published' && (
                      <div className="grid grid-cols-3 gap-4 bg-gray-50 rounded-lg p-4">
                        <div>
                          <div className="text-sm text-gray-600 mb-1">Registrations</div>
                          <button
                            onClick={() => setShowParticipants(event.id)}
                            className="flex items-baseline gap-2 hover:opacity-80 transition-opacity cursor-pointer group"
                          >
                            <span className="text-2xl font-bold text-gray-900 group-hover:text-purple-600 transition-colors">{event.registrations}</span>
                            <span className="text-sm text-gray-500">/ {event.maxParticipants}</span>
                            <Users className="h-4 w-4 text-purple-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </button>
                          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                            <div
                              className="bg-purple-600 h-2 rounded-full"
                              style={{ width: `${(event.registrations / event.maxParticipants) * 100}%` }}
                            />
                          </div>
                          {event.registrations > 0 && (
                            <div className="text-xs text-purple-600 mt-1 cursor-pointer hover:underline" onClick={() => setShowParticipants(event.id)}>
                              Click to view participants
                            </div>
                          )}
                        </div>

                        <div>
                          <div className="text-sm text-gray-600 mb-1">Interested</div>
                          <div className="text-2xl font-bold text-orange-600">{event.interested}</div>
                          <div className="text-xs text-gray-500 mt-2">
                            {event.interested > 0 ? `${((event.registrations / event.interested) * 100).toFixed(1)}% conversion` : 'No interest yet'}
                          </div>
                        </div>

                        <div>
                          <div className="text-sm text-gray-600 mb-1">Engagement</div>
                          <div className="text-2xl font-bold text-blue-600">
                            {event.views > 0 ? `${((event.registrations / event.views) * 100).toFixed(1)}%` : '0%'}
                          </div>
                          <div className="text-xs text-gray-500 mt-2">Click-through rate</div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 flex-wrap">
                  {event.status === 'Draft' && (
                    <Button
                      onClick={() => handlePublishEvent(event.id)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Publish Event
                    </Button>
                  )}
                  {event.status === 'Published' && (
                    <Button variant="outline" onClick={() => setShowAnalytics(event.id)}>
                      <BarChart3 className="h-4 w-4 mr-2" />
                      View Analytics
                    </Button>
                  )}
                  <Button variant="outline" onClick={() => handleEditEvent(event)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Button variant="outline" onClick={() => handleShareEvent(event)}>
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleDeleteEvent(event.id)}
                    className="text-red-600 hover:text-red-700 hover:border-red-300"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>

          {events.length === 0 && (
            <div className="text-center py-12">
              <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No events yet</h3>
              <p className="text-gray-600 mb-4">Create your first event to get started</p>
              <Button onClick={() => setShowCreateModal(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Event
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create Event Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
            onClick={() => setShowCreateModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-lg shadow-xl"
            >
              <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between z-10">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Create New Event</h2>
                  <p className="text-sm text-gray-600 mt-1">Fill in the details to create your event</p>
                </div>
                <Button variant="outline" size="sm" onClick={() => setShowCreateModal(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <form onSubmit={handleCreateEvent} className="p-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Event Title <span className="text-red-500">*</span>
                    </label>
                    <Input
                      required
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="e.g., DevFest 2026"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">
                        Event Type <span className="text-red-500">*</span>
                      </label>
                      <select
                        required
                        value={formData.type}
                        onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="Hackathon">Hackathon</option>
                        <option value="Workshop">Workshop</option>
                        <option value="Webinar">Webinar</option>
                        <option value="Conference">Conference</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">
                        Mode <span className="text-red-500">*</span>
                      </label>
                      <select
                        required
                        value={formData.mode}
                        onChange={(e) => setFormData({ ...formData, mode: e.target.value as any })}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="Online">Online</option>
                        <option value="Offline">Offline</option>
                        <option value="Hybrid">Hybrid</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">
                        Start Date <span className="text-red-500">*</span>
                      </label>
                      <Input
                        required
                        type="date"
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">
                        End Date <span className="text-red-500">*</span>
                      </label>
                      <Input
                        required
                        type="date"
                        value={formData.endDate}
                        onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Location <span className="text-red-500">*</span>
                    </label>
                    <Input
                      required
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      placeholder="e.g., Bangalore, India or Online"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      required
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={3}
                      placeholder="Describe your event..."
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">
                        Prize/Fee <span className="text-red-500">*</span>
                      </label>
                      <Input
                        required
                        value={formData.prize}
                        onChange={(e) => setFormData({ ...formData, prize: e.target.value })}
                        placeholder="e.g., $50,000 or Free"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">
                        Max Participants <span className="text-red-500">*</span>
                      </label>
                      <Input
                        required
                        type="number"
                        min="1"
                        value={formData.maxParticipants}
                        onChange={(e) => setFormData({ ...formData, maxParticipants: parseInt(e.target.value) })}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Tags <span className="text-red-500">*</span>
                    </label>
                    <Input
                      required
                      value={formData.tags}
                      onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                      placeholder="e.g., Web Development, AI/ML, Cloud"
                    />
                    <p className="text-xs text-gray-500 mt-1">Separate tags with commas</p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Difficulty Level
                    </label>
                    <select
                      value={formData.difficulty}
                      onChange={(e) => setFormData({ ...formData, difficulty: e.target.value as any })}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">
                        Team Size <span className="text-red-500">*</span>
                      </label>
                      <Input
                        required
                        type="number"
                        min="1"
                        value={formData.teamSize}
                        onChange={(e) => setFormData({ ...formData, teamSize: parseInt(e.target.value) })}
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">
                        Team Members <span className="text-red-500">*</span>
                      </label>
                      <Input
                        required
                        value={formData.teamMembers}
                        onChange={(e) => setFormData({ ...formData, teamMembers: e.target.value })}
                        placeholder="e.g., Alice, Bob, Charlie"
                      />
                      <p className="text-xs text-gray-500 mt-1">Separate members with commas</p>
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex gap-3">
                      <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-blue-900 mb-1">Note</h4>
                        <p className="text-sm text-blue-700">
                          Events are created as drafts. You can publish them when ready. Once published, they will appear on the main Events page.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowCreateModal(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="flex-1">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Event
                  </Button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Event Modal */}
      <AnimatePresence>
        {showEditModal && editingEvent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
            onClick={() => {
              setShowEditModal(false);
              setEditingEvent(null);
              resetForm();
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-lg shadow-xl"
            >
              <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between z-10">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Edit Event</h2>
                  <p className="text-sm text-gray-600 mt-1">Update your event details</p>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingEvent(null);
                    resetForm();
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <form onSubmit={handleUpdateEvent} className="p-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Event Title <span className="text-red-500">*</span>
                    </label>
                    <Input
                      required
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="e.g., DevFest 2026"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">
                        Event Type <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={formData.type}
                        onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="Hackathon">Hackathon</option>
                        <option value="Workshop">Workshop</option>
                        <option value="Webinar">Webinar</option>
                        <option value="Conference">Conference</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">
                        Mode <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={formData.mode}
                        onChange={(e) => setFormData({ ...formData, mode: e.target.value as any })}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="Online">Online</option>
                        <option value="Offline">Offline</option>
                        <option value="Hybrid">Hybrid</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">
                        Start Date <span className="text-red-500">*</span>
                      </label>
                      <Input
                        required
                        type="date"
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">
                        End Date <span className="text-red-500">*</span>
                      </label>
                      <Input
                        required
                        type="date"
                        value={formData.endDate}
                        onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Location <span className="text-red-500">*</span>
                    </label>
                    <Input
                      required
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      placeholder="e.g., Bangalore, India or Online"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      required
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={3}
                      placeholder="Describe your event..."
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">
                        Prize/Fee <span className="text-red-500">*</span>
                      </label>
                      <Input
                        required
                        value={formData.prize}
                        onChange={(e) => setFormData({ ...formData, prize: e.target.value })}
                        placeholder="e.g., $50,000 or Free"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">
                        Max Participants <span className="text-red-500">*</span>
                      </label>
                      <Input
                        required
                        type="number"
                        min="1"
                        value={formData.maxParticipants}
                        onChange={(e) => setFormData({ ...formData, maxParticipants: parseInt(e.target.value) })}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Tags <span className="text-red-500">*</span>
                    </label>
                    <Input
                      required
                      value={formData.tags}
                      onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                      placeholder="e.g., Web Development, AI/ML, Cloud"
                    />
                    <p className="text-xs text-gray-500 mt-1">Separate tags with commas</p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Difficulty Level
                    </label>
                    <select
                      value={formData.difficulty}
                      onChange={(e) => setFormData({ ...formData, difficulty: e.target.value as any })}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">
                        Team Size <span className="text-red-500">*</span>
                      </label>
                      <Input
                        required
                        type="number"
                        min="1"
                        value={formData.teamSize}
                        onChange={(e) => setFormData({ ...formData, teamSize: parseInt(e.target.value) })}
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">
                        Team Members
                      </label>
                      <Input
                        value={formData.teamMembers}
                        onChange={(e) => setFormData({ ...formData, teamMembers: e.target.value })}
                        placeholder="e.g., Alice, Bob, Charlie"
                      />
                      <p className="text-xs text-gray-500 mt-1">Separate members with commas</p>
                    </div>
                  </div>

                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-green-900 mb-1">Editing Event</h4>
                        <p className="text-sm text-green-700">
                          Update your event details. The event status will remain unchanged.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowEditModal(false);
                      setEditingEvent(null);
                      resetForm();
                    }}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="flex-1">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Update Event
                  </Button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Share Event Modal */}
      <AnimatePresence>
        {showShareModal && sharingEvent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
            onClick={() => {
              setShowShareModal(false);
              setSharingEvent(null);
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md bg-white rounded-lg shadow-xl"
            >
              <div className="border-b px-6 py-4 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Share Event</h2>
                  <p className="text-sm text-gray-600 mt-1">{sharingEvent.title}</p>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => {
                    setShowShareModal(false);
                    setSharingEvent(null);
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="p-6 space-y-4">
                {/* Copy Link */}
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Event Link</span>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={handleCopyLink}
                      className="text-xs"
                    >
                      <Copy className="h-3 w-3 mr-1" />
                      Copy
                    </Button>
                  </div>
                  <p className="text-xs text-gray-600 break-all bg-white border border-gray-200 rounded p-2">
                    {window.location.origin}/events?id={sharingEvent.id}
                  </p>
                </div>

                {/* Share via Social Media */}
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Share via</h3>
                  <div className="grid grid-cols-3 gap-3">
                    {/* WhatsApp */}
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleShareVia('whatsapp')}
                      className="flex flex-col items-center gap-2 p-3 rounded-lg border-2 border-gray-200 hover:border-green-500 hover:bg-green-50 transition-all group"
                    >
                      <div className="h-10 w-10 rounded-full bg-green-500 flex items-center justify-center">
                        <svg className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                        </svg>
                      </div>
                      <span className="text-xs font-medium text-gray-700 group-hover:text-green-600">WhatsApp</span>
                    </motion.button>

                    {/* Twitter */}
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleShareVia('twitter')}
                      className="flex flex-col items-center gap-2 p-3 rounded-lg border-2 border-gray-200 hover:border-blue-400 hover:bg-blue-50 transition-all group"
                    >
                      <div className="h-10 w-10 rounded-full bg-blue-400 flex items-center justify-center">
                        <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                        </svg>
                      </div>
                      <span className="text-xs font-medium text-gray-700 group-hover:text-blue-600">Twitter</span>
                    </motion.button>

                    {/* LinkedIn */}
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleShareVia('linkedin')}
                      className="flex flex-col items-center gap-2 p-3 rounded-lg border-2 border-gray-200 hover:border-blue-700 hover:bg-blue-50 transition-all group"
                    >
                      <div className="h-10 w-10 rounded-full bg-blue-700 flex items-center justify-center">
                        <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                        </svg>
                      </div>
                      <span className="text-xs font-medium text-gray-700 group-hover:text-blue-700">LinkedIn</span>
                    </motion.button>

                    {/* Facebook */}
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleShareVia('facebook')}
                      className="flex flex-col items-center gap-2 p-3 rounded-lg border-2 border-gray-200 hover:border-blue-600 hover:bg-blue-50 transition-all group"
                    >
                      <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center">
                        <svg className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                        </svg>
                      </div>
                      <span className="text-xs font-medium text-gray-700 group-hover:text-blue-600">Facebook</span>
                    </motion.button>

                    {/* Telegram */}
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleShareVia('telegram')}
                      className="flex flex-col items-center gap-2 p-3 rounded-lg border-2 border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all group"
                    >
                      <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center">
                        <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                        </svg>
                      </div>
                      <span className="text-xs font-medium text-gray-700 group-hover:text-blue-500">Telegram</span>
                    </motion.button>

                    {/* Email */}
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleShareVia('email')}
                      className="flex flex-col items-center gap-2 p-3 rounded-lg border-2 border-gray-200 hover:border-red-500 hover:bg-red-50 transition-all group"
                    >
                      <div className="h-10 w-10 rounded-full bg-red-500 flex items-center justify-center">
                        <Mail className="h-5 w-5 text-white" />
                      </div>
                      <span className="text-xs font-medium text-gray-700 group-hover:text-red-600">Email</span>
                    </motion.button>
                  </div>
                </div>

                {/* Event Preview */}
                <div className="bg-gradient-to-br from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center flex-shrink-0">
                      <Calendar className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 mb-1">{sharingEvent.title}</h4>
                      <div className="space-y-1 text-xs text-gray-600">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {new Date(sharingEvent.date).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </div>
                        <div className="flex items-center gap-1">
                          <Trophy className="h-3 w-3" />
                          {sharingEvent.prize}
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {sharingEvent.location}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Analytics Modal */}
      <AnimatePresence>
        {showAnalytics && (() => {
          const event = events.find(e => e.id === showAnalytics);
          if (!event) return null;

          // Generate daily registration data for last 7 days
          const dailyData = Array.from({ length: 7 }, (_, i) => ({
            day: new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { weekday: 'short' }),
            registrations: Math.floor(event.registrations * Math.random() * 0.3),
            views: Math.floor(event.views * Math.random() * 0.3),
          }));

          // Source distribution
          const sourceData = [
            { name: 'Direct', value: Math.floor(event.registrations * 0.4), color: '#3B82F6' },
            { name: 'Social Media', value: Math.floor(event.registrations * 0.35), color: '#8B5CF6' },
            { name: 'Referrals', value: Math.floor(event.registrations * 0.15), color: '#10B981' },
            { name: 'Email', value: Math.floor(event.registrations * 0.1), color: '#F59E0B' },
          ];

          return (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
              onClick={() => setShowAnalytics(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-6xl max-h-[90vh] overflow-y-auto bg-white rounded-lg shadow-xl"
              >
                <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between z-10">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Analytics - {event.title}</h2>
                    <p className="text-sm text-gray-600 mt-1">Detailed performance insights</p>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => setShowAnalytics(null)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                <div className="p-6 space-y-6">
                  {/* Key Metrics */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Card className="border-2 border-purple-200 bg-purple-50">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <UserPlus className="h-8 w-8 text-purple-600" />
                          <TrendingUp className="h-5 w-5 text-green-600" />
                        </div>
                        <div className="text-3xl font-bold text-purple-600">{event.registrations}</div>
                        <div className="text-sm text-gray-600">Total Registrations</div>
                        <div className="text-xs text-green-600 mt-1">
                          {((event.registrations / event.maxParticipants) * 100).toFixed(1)}% capacity
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border-2 border-orange-200 bg-orange-50">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <Bookmark className="h-8 w-8 text-orange-600" />
                          <TrendingUp className="h-5 w-5 text-green-600" />
                        </div>
                        <div className="text-3xl font-bold text-orange-600">{event.interested}</div>
                        <div className="text-sm text-gray-600">Interested Users</div>
                        <div className="text-xs text-gray-500 mt-1">
                          {((event.registrations / event.interested) * 100).toFixed(1)}% conversion
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border-2 border-blue-200 bg-blue-50">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <Eye className="h-8 w-8 text-blue-600" />
                          <TrendingUp className="h-5 w-5 text-green-600" />
                        </div>
                        <div className="text-3xl font-bold text-blue-600">{event.views}</div>
                        <div className="text-sm text-gray-600">Total Views</div>
                        <div className="text-xs text-gray-500 mt-1">
                          {((event.registrations / event.views) * 100).toFixed(1)}% CTR
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border-2 border-green-200 bg-green-50">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <Target className="h-8 w-8 text-green-600" />
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        </div>
                        <div className="text-3xl font-bold text-green-600">{event.maxParticipants}</div>
                        <div className="text-sm text-gray-600">Max Capacity</div>
                        <div className="text-xs text-gray-500 mt-1">
                          {event.maxParticipants - event.registrations} spots left
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Charts */}
                  <div className="grid lg:grid-cols-2 gap-6">
                    {/* Registration Trend */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Registration Trend (Last 7 Days)</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ResponsiveContainer width="100%" height={250}>
                          <BarChart data={dailyData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="day" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="registrations" fill="#8B5CF6" name="Registrations" />
                            <Bar dataKey="views" fill="#3B82F6" name="Views" />
                          </BarChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>

                    {/* Traffic Sources */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Traffic Sources</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ResponsiveContainer width="100%" height={250}>
                          <PieChart>
                            <Pie
                              data={sourceData}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              label={({ name, value }) => `${name}: ${value}`}
                              outerRadius={80}
                              dataKey="value"
                            >
                              {sourceData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Pie>
                            <Tooltip />
                          </PieChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Engagement Metrics */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Engagement Breakdown</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium text-gray-700">Registration Rate</span>
                            <span className="text-sm font-bold text-purple-600">
                              {((event.registrations / event.views) * 100).toFixed(1)}%
                            </span>
                          </div>
                          <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-purple-500 to-purple-600 rounded-full"
                              style={{ width: `${(event.registrations / event.views) * 100}%` }}
                            />
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium text-gray-700">Interest to Registration</span>
                            <span className="text-sm font-bold text-orange-600">
                              {((event.registrations / event.interested) * 100).toFixed(1)}%
                            </span>
                          </div>
                          <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-orange-500 to-orange-600 rounded-full"
                              style={{ width: `${(event.registrations / event.interested) * 100}%` }}
                            />
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium text-gray-700">Capacity Filled</span>
                            <span className="text-sm font-bold text-green-600">
                              {((event.registrations / event.maxParticipants) * 100).toFixed(1)}%
                            </span>
                          </div>
                          <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-green-500 to-green-600 rounded-full"
                              style={{ width: `${(event.registrations / event.maxParticipants) * 100}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Recent Registrations */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Recent Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {Array.from({ length: 5 }, (_, i) => ({
                          name: ['Rahul Sharma', 'Priya Singh', 'Arjun Patel', 'Sneha Gupta', 'Karthik Reddy'][i],
                          college: ['IIT Delhi', 'BITS Pilani', 'NIT Trichy', 'VIT Vellore', 'IIIT Hyderabad'][i],
                          time: `${i + 1} hour${i === 0 ? '' : 's'} ago`,
                        })).map((reg, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                                {reg.name.split(' ').map(n => n[0]).join('')}
                              </div>
                              <div>
                                <div className="font-medium text-gray-900">{reg.name}</div>
                                <div className="text-sm text-gray-600">{reg.college}</div>
                              </div>
                            </div>
                            <div className="text-sm text-gray-500">{reg.time}</div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </motion.div>
            </motion.div>
          );
        })()}
      </AnimatePresence>

      {/* Participants Modal */}
      <AnimatePresence>
        {showParticipants && (() => {
          const event = events.find(e => e.id === showParticipants);
          if (!event) return null;

          // Load registrations from localStorage
          const allRegistrations = localStorage.getItem('eventRegistrations');
          const registrations = allRegistrations ? JSON.parse(allRegistrations) : [];
          
          // Filter registrations for this event
          const eventRegistrations = registrations.filter((reg: any) => reg.eventId === event.id);

          return (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
              onClick={() => setShowParticipants(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-5xl max-h-[90vh] overflow-y-auto bg-white rounded-lg shadow-xl"
              >
                <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between z-10">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Participants - {event.title}</h2>
                    <p className="text-sm text-gray-600 mt-1">
                      {eventRegistrations.length} {eventRegistrations.length === 1 ? 'registration' : 'registrations'} • {event.maxParticipants - eventRegistrations.length} spots remaining
                    </p>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => setShowParticipants(null)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                <div className="p-6">
                  {eventRegistrations.length === 0 ? (
                    <div className="text-center py-12">
                      <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">No Registrations Yet</h3>
                      <p className="text-gray-600">Participants will appear here once they register for this event.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {eventRegistrations.map((registration: any, index: number) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="border rounded-lg p-5 hover:shadow-md transition-shadow bg-gradient-to-r from-white to-gray-50"
                        >
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-start gap-4 flex-1">
                              {/* Avatar */}
                              <div className="h-14 w-14 rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
                                {registration.teamName ? registration.teamName.charAt(0).toUpperCase() : registration.email.charAt(0).toUpperCase()}
                              </div>

                              {/* Main Info */}
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                  <h3 className="text-lg font-bold text-gray-900">{registration.teamName || 'Individual'}</h3>
                                  <Badge className="bg-purple-100 text-purple-700 border-purple-300">
                                    Team of {registration.teamSize}
                                  </Badge>
                                  <Badge className={
                                    registration.experience === 'Beginner' ? 'bg-green-100 text-green-700 border-green-300' :
                                    registration.experience === 'Intermediate' ? 'bg-blue-100 text-blue-700 border-blue-300' :
                                    'bg-orange-100 text-orange-700 border-orange-300'
                                  }>
                                    {registration.experience}
                                  </Badge>
                                </div>

                                {/* Contact Info */}
                                <div className="grid md:grid-cols-2 gap-3 mb-3">
                                  <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <Mail className="h-4 w-4 text-blue-600" />
                                    <span className="truncate">{registration.email}</span>
                                  </div>
                                  <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <Phone className="h-4 w-4 text-green-600" />
                                    <span>{registration.phone}</span>
                                  </div>
                                  <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <GraduationCap className="h-4 w-4 text-purple-600" />
                                    <span>{registration.college}</span>
                                  </div>
                                  {registration.github && (
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                      <Github className="h-4 w-4 text-gray-800" />
                                      <a 
                                        href={`https://github.com/${registration.github}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:underline truncate"
                                      >
                                        {registration.github}
                                      </a>
                                    </div>
                                  )}
                                </div>

                                {/* Team Members */}
                                {registration.memberNames && (
                                  <div className="mb-3">
                                    <div className="text-sm font-medium text-gray-700 mb-2">Team Members:</div>
                                    <div className="flex flex-wrap gap-2">
                                      {registration.memberNames.split(',').map((member: string, idx: number) => (
                                        <Badge key={idx} variant="outline" className="text-xs">
                                          <Users className="h-3 w-3 mr-1" />
                                          {member.trim()}
                                        </Badge>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {/* Why Participate */}
                                {registration.whyParticipate && (
                                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                                    <div className="text-sm font-medium text-gray-700 mb-1">Why they want to participate:</div>
                                    <p className="text-sm text-gray-600 italic">"{registration.whyParticipate}"</p>
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Registration Time */}
                            <div className="text-right flex-shrink-0 ml-4">
                              <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                                <Clock className="h-3 w-3" />
                                <span>
                                  {new Date(registration.registeredAt).toLocaleDateString('en-US', { 
                                    month: 'short', 
                                    day: 'numeric',
                                    year: 'numeric'
                                  })}
                                </span>
                              </div>
                              <div className="text-xs text-gray-400">
                                {new Date(registration.registeredAt).toLocaleTimeString('en-US', { 
                                  hour: '2-digit', 
                                  minute: '2-digit'
                                })}
                              </div>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex gap-2 pt-3 border-t">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => window.location.href = `mailto:${registration.email}`}
                            >
                              <Mail className="h-3 w-3 mr-1" />
                              Email
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => window.open(`tel:${registration.phone}`)}
                            >
                              <Phone className="h-3 w-3 mr-1" />
                              Call
                            </Button>
                            {registration.github && (
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => window.open(`https://github.com/${registration.github}`, '_blank')}
                              >
                                <Github className="h-3 w-3 mr-1" />
                                GitHub
                              </Button>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}

                  {/* Export Options */}
                  {eventRegistrations.length > 0 && (
                    <div className="mt-6 pt-6 border-t">
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-600">
                          Total: <span className="font-bold text-gray-900">{eventRegistrations.length}</span> participants
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              const csvContent = [
                                ['Team Name', 'Team Size', 'Members', 'Email', 'Phone', 'College', 'Experience', 'GitHub', 'Registered At'].join(','),
                                ...eventRegistrations.map((reg: any) => [
                                  reg.teamName || '',
                                  reg.teamSize,
                                  reg.memberNames || '',
                                  reg.email,
                                  reg.phone,
                                  reg.college,
                                  reg.experience,
                                  reg.github || '',
                                  new Date(reg.registeredAt).toLocaleString()
                                ].join(','))
                              ].join('\n');
                              
                              const blob = new Blob([csvContent], { type: 'text/csv' });
                              const url = window.URL.createObjectURL(blob);
                              const a = document.createElement('a');
                              a.href = url;
                              a.download = `${event.title.replace(/\s+/g, '_')}_participants.csv`;
                              a.click();
                              showNotificationMessage('Participant list exported successfully!');
                            }}
                          >
                            <BarChart3 className="h-4 w-4 mr-2" />
                            Export CSV
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          );
        })()}
      </AnimatePresence>

      {/* Notification */}
      <AnimatePresence>
        {showNotification && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-4 right-4 z-50"
          >
            <Card className="bg-green-600 border-green-700 text-white shadow-lg">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="bg-white rounded-full p-1">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </div>
                  <p className="font-medium">{notificationMessage}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
}