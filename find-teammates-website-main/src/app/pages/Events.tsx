import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Calendar,
  MapPin,
  Users,
  Trophy,
  Clock,
  ExternalLink,
  Bookmark,
  Share2,
  Filter,
  Search,
  TrendingUp,
  Sparkles,
  Award,
  Rocket,
  Code2,
  Target,
  X,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  UserPlus,
  Eye,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { DashboardLayout } from '../components/DashboardLayout';

interface Event {
  id: string;
  title: string;
  type: 'Hackathon' | 'Workshop' | 'Webinar' | 'Conference';
  date: string;
  endDate: string;
  location: string;
  mode: 'Online' | 'Offline' | 'Hybrid';
  prize: string;
  participants?: string;
  organizer: string;
  description: string;
  tags: string[];
  registered?: boolean;
  bookmarked?: boolean;
  status?: 'Upcoming' | 'Registration Open' | 'Ongoing' | 'Ended' | 'Draft' | 'Published' | 'Completed';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  teamSize?: number;
  teamMembers?: string[];
  registrations?: number;
  interested?: number;
  views?: number;
  maxParticipants?: number;
}

const mockEvents: Event[] = [
  {
    id: '1',
    title: 'DevFest 2026',
    type: 'Hackathon',
    date: '2026-03-15',
    endDate: '2026-03-17',
    location: 'Bangalore, India',
    mode: 'Hybrid',
    prize: '$50,000',
    participants: '2.5K+',
    organizer: 'Google Developers',
    description: 'Build innovative solutions using Google technologies. 48-hour hackathon with mentorship and prizes.',
    tags: ['Web Development', 'AI/ML', 'Cloud'],
    registered: false,
    bookmarked: true,
    status: 'Registration Open',
    difficulty: 'Intermediate',
  },
  {
    id: '2',
    title: 'AI Innovation Challenge',
    type: 'Hackathon',
    date: '2026-03-22',
    endDate: '2026-03-24',
    location: 'Online',
    mode: 'Online',
    prize: '$100,000',
    participants: '5K+',
    organizer: 'OpenAI',
    description: 'Create AI-powered applications that solve real-world problems. Focus on GPT-4 and DALL-E integration.',
    tags: ['AI/ML', 'NLP', 'Computer Vision'],
    registered: true,
    bookmarked: true,
    status: 'Registration Open',
    difficulty: 'Advanced',
  },
  {
    id: '3',
    title: 'Web3 Builders Hackathon',
    type: 'Hackathon',
    date: '2026-04-05',
    endDate: '2026-04-07',
    location: 'Delhi, India',
    mode: 'Offline',
    prize: '$75,000',
    participants: '3K+',
    organizer: 'Ethereum Foundation',
    description: 'Build decentralized applications on Ethereum. Learn from Web3 experts and win amazing prizes.',
    tags: ['Blockchain', 'Smart Contracts', 'DeFi'],
    registered: false,
    bookmarked: false,
    status: 'Upcoming',
    difficulty: 'Advanced',
  },
  {
    id: '4',
    title: 'React Advanced Workshop',
    type: 'Workshop',
    date: '2026-03-10',
    endDate: '2026-03-10',
    location: 'Online',
    mode: 'Online',
    prize: 'Free',
    participants: '500+',
    organizer: 'Meta',
    description: 'Deep dive into React 19 features, Server Components, and advanced patterns.',
    tags: ['React', 'JavaScript', 'Frontend'],
    registered: true,
    bookmarked: false,
    status: 'Registration Open',
    difficulty: 'Intermediate',
  },
  {
    id: '5',
    title: 'Mobile Dev Summit',
    type: 'Conference',
    date: '2026-04-15',
    endDate: '2026-04-16',
    location: 'Mumbai, India',
    mode: 'Hybrid',
    prize: 'Tickets: ₹2,999',
    participants: '1K+',
    organizer: 'Flutter Community',
    description: 'Annual conference for mobile developers. Talks on Flutter, React Native, and native development.',
    tags: ['Mobile', 'Flutter', 'React Native'],
    registered: false,
    bookmarked: true,
    status: 'Upcoming',
    difficulty: 'Beginner',
  },
  {
    id: '6',
    title: 'System Design Webinar',
    type: 'Webinar',
    date: '2026-03-08',
    endDate: '2026-03-08',
    location: 'Online',
    mode: 'Online',
    prize: 'Free',
    participants: '1.5K+',
    organizer: 'Google Engineering',
    description: 'Learn how to design scalable systems from Google engineers. Live Q&A included.',
    tags: ['System Design', 'Architecture', 'Backend'],
    registered: false,
    bookmarked: false,
    status: 'Registration Open',
    difficulty: 'Advanced',
  },
];

export function Events() {
  // Load and merge events from both mock data and Event Organizer
  const [events, setEvents] = useState<Event[]>(() => {
    const organizerEvents = localStorage.getItem('organizerEvents');
    const organizerEventsData = organizerEvents ? JSON.parse(organizerEvents) : [];

    // Convert organizer events to match Event interface
    const convertedOrganizerEvents = organizerEventsData
      .filter((e: any) => e.status === 'Published') // Only show published events
      .map((e: any) => ({
        id: e.id,
        title: e.title,
        type: e.type,
        date: e.date,
        endDate: e.endDate,
        location: e.location,
        mode: e.mode,
        prize: e.prize,
        participants: e.maxParticipants ? `${e.maxParticipants}+` : '100+',
        organizer: e.organizer,
        description: e.description,
        tags: e.tags,
        registered: false,
        bookmarked: false,
        status: 'Registration Open',
        difficulty: e.difficulty,
        teamSize: e.teamSize,
        teamMembers: e.teamMembers,
        registrations: e.registrations,
        interested: e.interested,
        views: e.views,
        maxParticipants: e.maxParticipants,
      }));

    // Merge with mock events and apply bookmarks
    const bookmarkedIds = JSON.parse(localStorage.getItem('bookmarkedEventIds') || '[]');
    return [...convertedOrganizerEvents, ...mockEvents].map(e => ({
      ...e,
      bookmarked: e.bookmarked || bookmarkedIds.includes(e.id)
    }));
  });

  // Listen for storage changes to update events in real-time
  useEffect(() => {
    const handleStorageChange = () => {
      const organizerEvents = localStorage.getItem('organizerEvents');
      const organizerEventsData = organizerEvents ? JSON.parse(organizerEvents) : [];

      const convertedOrganizerEvents = organizerEventsData
        .filter((e: any) => e.status === 'Published')
        .map((e: any) => ({
          id: e.id,
          title: e.title,
          type: e.type,
          date: e.date,
          endDate: e.endDate,
          location: e.location,
          mode: e.mode,
          prize: e.prize,
          participants: e.maxParticipants ? `${e.maxParticipants}+` : '100+',
          organizer: e.organizer,
          description: e.description,
          tags: e.tags,
          registered: false,
          bookmarked: false,
          status: 'Registration Open',
          difficulty: e.difficulty,
          teamSize: e.teamSize,
          teamMembers: e.teamMembers,
          registrations: e.registrations,
          interested: e.interested,
          views: e.views,
          maxParticipants: e.maxParticipants,
        }));

      const bookmarkedIds = JSON.parse(localStorage.getItem('bookmarkedEventIds') || '[]');
      setEvents([...convertedOrganizerEvents, ...mockEvents].map(e => ({
        ...e,
        bookmarked: e.bookmarked || bookmarkedIds.includes(e.id)
      })));
    };

    // Listen for custom events (same-tab updates)
    window.addEventListener('eventsUpdated', handleStorageChange);

    // Listen for storage events (cross-tab updates)
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('eventsUpdated', handleStorageChange);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('All');
  const [filterMode, setFilterMode] = useState<string>('All');
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [filterBookmarked, setFilterBookmarked] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const [expandedEventId, setExpandedEventId] = useState<string | null>(null);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');

  // Registration form state
  const [formData, setFormData] = useState({
    teamName: '',
    teamSize: '1',
    memberNames: '',
    email: '',
    phone: '',
    college: '',
    whyParticipate: '',
    experience: 'Beginner',
    github: '',
  });

  const handleBookmark = (eventId: string) => {
    const isNowBookmarked = !events.find(e => e.id === eventId)?.bookmarked;

    setEvents(events.map(event =>
      event.id === eventId ? { ...event, bookmarked: isNowBookmarked } : event
    ));

    // Persist to localStorage
    const bookmarkedIds = JSON.parse(localStorage.getItem('bookmarkedEventIds') || '[]');
    let updatedIds;
    if (isNowBookmarked) {
      updatedIds = [...new Set([...bookmarkedIds, eventId])];
    } else {
      updatedIds = bookmarkedIds.filter((id: string) => id !== eventId);
    }
    localStorage.setItem('bookmarkedEventIds', JSON.stringify(updatedIds));

    showNotificationMessage(isNowBookmarked ? 'Added to your bookmarks! 🔖' : 'Removed from bookmarks');
  };

  const handleRegisterClick = (event: Event) => {
    setSelectedEvent(event);
    setShowRegistrationModal(true);
  };

  const handleSubmitRegistration = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedEvent) return;

    // Create registration record
    const registrationData = {
      eventId: selectedEvent.id,
      eventTitle: selectedEvent.title,
      teamName: formData.teamName,
      teamSize: formData.teamSize,
      memberNames: formData.memberNames,
      email: formData.email,
      phone: formData.phone,
      college: formData.college,
      whyParticipate: formData.whyParticipate,
      experience: formData.experience,
      github: formData.github,
      registeredAt: new Date().toISOString(),
    };

    // Save registration to localStorage
    const existingRegistrations = localStorage.getItem('eventRegistrations');
    const registrations = existingRegistrations ? JSON.parse(existingRegistrations) : [];
    registrations.push(registrationData);
    localStorage.setItem('eventRegistrations', JSON.stringify(registrations));

    // Update event registration status in Events page
    setEvents(events.map(event =>
      event.id === selectedEvent.id ? { ...event, registered: true } : event
    ));

    // Update registration count in Event Organizer's localStorage
    const organizerEvents = localStorage.getItem('organizerEvents');
    if (organizerEvents) {
      const organizerEventsData = JSON.parse(organizerEvents);
      const updatedOrganizerEvents = organizerEventsData.map((event: any) => {
        if (event.id === selectedEvent.id) {
          return {
            ...event,
            registrations: (event.registrations || 0) + 1,
            interested: (event.interested || 0) + Math.floor(Math.random() * 3), // Simulate interest growth
            views: (event.views || 0) + Math.floor(Math.random() * 10 + 5), // Simulate view growth
          };
        }
        return event;
      });
      localStorage.setItem('organizerEvents', JSON.stringify(updatedOrganizerEvents));
      // Trigger custom event for real-time updates
      window.dispatchEvent(new Event('eventsUpdated'));
    }

    // Close modal and reset form
    setShowRegistrationModal(false);
    setFormData({
      teamName: '',
      teamSize: '1',
      memberNames: '',
      email: '',
      phone: '',
      college: '',
      whyParticipate: '',
      experience: 'Beginner',
      github: '',
    });

    // Show success notification
    showNotificationMessage(`Successfully registered for ${selectedEvent.title}! Check your email for confirmation.`);
  };

  const showNotificationMessage = (message: string) => {
    setNotificationMessage(message);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 4000);
  };

  const toggleEventDetails = (eventId: string) => {
    setExpandedEventId(expandedEventId === eventId ? null : eventId);
  };

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesType = filterType === 'All' || event.type === filterType;
    const matchesMode = filterMode === 'All' || event.mode === filterMode;
    const matchesStatus = filterStatus === 'All' || event.status === filterStatus;
    const matchesBookmark = !filterBookmarked || event.bookmarked;

    return matchesSearch && matchesType && matchesMode && matchesStatus && matchesBookmark;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Registration Open': return 'bg-green-100 text-green-700 border-green-300';
      case 'Upcoming': return 'bg-blue-100 text-blue-700 border-blue-300';
      case 'Ongoing': return 'bg-orange-100 text-orange-700 border-orange-300';
      case 'Ended': return 'bg-gray-100 text-gray-700 border-gray-300';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Hackathon': return Trophy;
      case 'Workshop': return Code2;
      case 'Webinar': return Sparkles;
      case 'Conference': return Award;
      default: return Calendar;
    }
  };

  const upcomingCount = events.filter(e => e.status === 'Registration Open' || e.status === 'Upcoming').length;
  const registeredCount = events.filter(e => e.registered).length;
  const bookmarkedCount = events.filter(e => e.bookmarked).length;

  return (
    <DashboardLayout>
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Calendar className="h-6 w-6 md:h-8 md:w-8 text-blue-600" />
          <h1 className="text-2xl md:text-4xl font-black text-gray-900 tracking-tight">Events & Hackathons</h1>
        </div>
        <p className="text-sm md:text-base text-gray-600">
          Discover and participate in exciting tech events
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-3 md:gap-4 grid-cols-2 md:grid-cols-3 mb-8">
        {[
          { label: 'Upcoming Events', value: upcomingCount, icon: Calendar, color: 'text-blue-600', bgColor: 'bg-blue-50/50' },
          { label: 'Registered', value: registeredCount, icon: Rocket, color: 'text-green-600', bgColor: 'bg-green-50/50' },
          { label: 'Bookmarked', value: bookmarkedCount, icon: Bookmark, color: 'text-purple-600', bgColor: 'bg-purple-50/50', active: filterBookmarked, onClick: () => setFilterBookmarked(!filterBookmarked) }
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            whileHover={{ y: -5, scale: 1.02 }}
            onClick={stat.onClick}
            className={`${stat.onClick ? 'cursor-pointer' : ''} ${i === 2 ? 'col-span-2 md:col-span-1' : ''}`}
          >
            <Card className={`premium-shadow border-none bg-white/80 backdrop-blur-sm transition-all h-full ${stat.active ? 'ring-2 ring-purple-500 bg-purple-50/80' : ''}`}>
              <CardContent className="p-4 md:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">{stat.label}</div>
                    <div className={`text-2xl md:text-3xl font-black ${stat.color}`}>{stat.value}</div>
                  </div>
                  <stat.icon className={`h-8 w-8 md:h-10 md:w-10 ${stat.color} opacity-20`} />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Search and Filters */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search events by name or tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-[200px]">
                <label className="text-sm font-medium text-gray-700 mb-2 block">Event Type</label>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option>All</option>
                  <option>Hackathon</option>
                  <option>Workshop</option>
                  <option>Webinar</option>
                  <option>Conference</option>
                </select>
              </div>

              <div className="flex-1 min-w-[200px]">
                <label className="text-sm font-medium text-gray-700 mb-2 block">Mode</label>
                <select
                  value={filterMode}
                  onChange={(e) => setFilterMode(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option>All</option>
                  <option>Online</option>
                  <option>Offline</option>
                  <option>Hybrid</option>
                </select>
              </div>

              <div className="flex-1 min-w-[200px]">
                <label className="text-sm font-medium text-gray-700 mb-2 block">Status</label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option>All</option>
                  <option>Registration Open</option>
                  <option>Upcoming</option>
                  <option>Ongoing</option>
                  <option>Ended</option>
                </select>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Events List */}
      <div className="space-y-4">
        {filteredEvents.map((event, index) => {
          const TypeIcon = getTypeIcon(event.type);
          return (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ x: 8 }}
            >
              <Card className="premium-shadow border-none bg-white/80 backdrop-blur-md overflow-hidden transition-all group">
                <CardContent className="p-6 md:p-8">
                  <div className="flex flex-col md:flex-row gap-4 md:gap-8">
                    {/* Event Icon */}
                    <div className="flex-shrink-0">
                      <motion.div
                        whileHover={{ rotate: 12, scale: 1.1 }}
                        className="h-16 w-16 md:h-20 md:w-20 rounded-2xl md:rounded-[2rem] bg-gradient-to-br from-blue-600 to-purple-700 flex items-center justify-center shadow-lg"
                      >
                        <TypeIcon className="h-8 w-8 md:h-10 md:w-10 text-white" />
                      </motion.div>
                    </div>

                    {/* Event Details */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-1">{event.title}</h3>
                          <div className="text-xs md:text-sm text-gray-600">by {event.organizer}</div>
                        </div>
                        <Badge className={`${getStatusColor(event.status || 'Upcoming')} border`}>
                          {event.status}
                        </Badge>
                      </div>

                      <p className="text-gray-700 mb-4">{event.description}</p>

                      {/* Event Info */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
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
                          <Users className="h-4 w-4 text-green-600" />
                          <span>{event.participants}</span>
                        </div>
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {event.tags.map(tag => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        <Badge variant="outline" className="text-xs">
                          {event.difficulty}
                        </Badge>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 flex-wrap">
                        <Button
                          onClick={() => event.registered ? null : handleRegisterClick(event)}
                          className={event.registered ? 'bg-green-600 hover:bg-green-700' : ''}
                          disabled={event.registered}
                        >
                          {event.registered ? 'Registered ✓' : 'Register Now'}
                        </Button>
                        <Button variant="outline" onClick={() => toggleEventDetails(event.id)}>
                          {expandedEventId === event.id ? <ChevronUp className="h-4 w-4 mr-2" /> : <ChevronDown className="h-4 w-4 mr-2" />}
                          {expandedEventId === event.id ? 'Hide Details' : 'Show Details'}
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => handleBookmark(event.id)}
                          className={event.bookmarked ? 'bg-purple-50 border-purple-300' : ''}
                        >
                          <Bookmark className={`h-4 w-4 ${event.bookmarked ? 'fill-purple-600 text-purple-600' : ''}`} />
                        </Button>
                        <Button variant="outline" onClick={() => showNotificationMessage(`Shared: ${event.title}`)}>
                          <Share2 className="h-4 w-4" />
                        </Button>
                      </div>

                      {/* Expandable Details Section */}
                      <AnimatePresence>
                        {expandedEventId === event.id && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="mt-6 border-t pt-6 space-y-4"
                          >
                            <div className="grid md:grid-cols-2 gap-6">
                              {/* Schedule */}
                              <div>
                                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                  <Clock className="h-5 w-5 text-blue-600" />
                                  Schedule
                                </h4>
                                <div className="space-y-2 text-sm text-gray-700">
                                  <div className="flex justify-between">
                                    <span className="font-medium">Start Date:</span>
                                    <span>{new Date(event.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="font-medium">End Date:</span>
                                    <span>{new Date(event.endDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="font-medium">Duration:</span>
                                    <span>{Math.ceil((new Date(event.endDate).getTime() - new Date(event.date).getTime()) / (1000 * 60 * 60 * 24)) + 1} days</span>
                                  </div>
                                </div>
                              </div>

                              {/* Location & Mode */}
                              <div>
                                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                  <MapPin className="h-5 w-5 text-red-600" />
                                  Location & Mode
                                </h4>
                                <div className="space-y-2 text-sm text-gray-700">
                                  <div className="flex justify-between">
                                    <span className="font-medium">Venue:</span>
                                    <span>{event.location}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="font-medium">Mode:</span>
                                    <Badge variant={event.mode === 'Online' ? 'default' : 'secondary'}>{event.mode}</Badge>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="font-medium">Organizer:</span>
                                    <span>{event.organizer}</span>
                                  </div>
                                </div>
                              </div>

                              {/* Prizes & Participants */}
                              <div>
                                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                  <Trophy className="h-5 w-5 text-yellow-600" />
                                  Prizes & Stats
                                </h4>
                                <div className="space-y-2 text-sm text-gray-700">
                                  <div className="flex justify-between">
                                    <span className="font-medium">Prize Pool:</span>
                                    <span className="font-semibold text-green-600">{event.prize}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="font-medium">Participants:</span>
                                    <span>{event.participants}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="font-medium">Difficulty:</span>
                                    <Badge variant="outline">{event.difficulty}</Badge>
                                  </div>
                                </div>
                              </div>

                              {/* Requirements */}
                              <div>
                                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                  <Target className="h-5 w-5 text-purple-600" />
                                  Requirements
                                </h4>
                                <ul className="space-y-1 text-sm text-gray-700">
                                  <li className="flex items-center gap-2">
                                    <CheckCircle className="h-4 w-4 text-green-600" />
                                    Valid college ID required
                                  </li>
                                  <li className="flex items-center gap-2">
                                    <CheckCircle className="h-4 w-4 text-green-600" />
                                    Team size: 1-{event.type === 'Hackathon' ? '5' : '4'} members
                                  </li>
                                  <li className="flex items-center gap-2">
                                    <CheckCircle className="h-4 w-4 text-green-600" />
                                    {event.difficulty} level experience
                                  </li>
                                </ul>
                              </div>
                            </div>

                            {/* What to Expect */}
                            <div>
                              <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                <Sparkles className="h-5 w-5 text-orange-600" />
                                What to Expect
                              </h4>
                              <div className="grid md:grid-cols-3 gap-3">
                                <div className="bg-blue-50 p-4 rounded-lg">
                                  <div className="font-medium text-blue-900 mb-1">Mentorship</div>
                                  <div className="text-sm text-blue-700">Expert guidance from industry leaders</div>
                                </div>
                                <div className="bg-green-50 p-4 rounded-lg">
                                  <div className="font-medium text-green-900 mb-1">Networking</div>
                                  <div className="text-sm text-green-700">Connect with fellow developers</div>
                                </div>
                                <div className="bg-purple-50 p-4 rounded-lg">
                                  <div className="font-medium text-purple-900 mb-1">Swag & Prizes</div>
                                  <div className="text-sm text-purple-700">Exciting rewards for winners</div>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {filteredEvents.length === 0 && (
        <Card className="p-12 text-center">
          <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No events found</h3>
          <p className="text-gray-600">Try adjusting your filters</p>
        </Card>
      )}

      {/* Registration Modal */}
      <AnimatePresence>
        {showRegistrationModal && selectedEvent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
            onClick={() => setShowRegistrationModal(false)}
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
                  <h2 className="text-xl font-bold text-gray-900">Register for {selectedEvent.title}</h2>
                  <p className="text-sm text-gray-600 mt-1">Fill in your details to complete registration</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowRegistrationModal(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <form onSubmit={handleSubmitRegistration} className="p-6">
                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">
                        Team Name <span className="text-red-500">*</span>
                      </label>
                      <Input
                        required
                        value={formData.teamName}
                        onChange={(e) => setFormData({ ...formData, teamName: e.target.value })}
                        placeholder="Enter your team name"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">
                        Team Size <span className="text-red-500">*</span>
                      </label>
                      <select
                        required
                        value={formData.teamSize}
                        onChange={(e) => setFormData({ ...formData, teamSize: e.target.value })}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {[1, 2, 3, 4, 5].map(size => (
                          <option key={size} value={size}>{size} {size === 1 ? 'Member' : 'Members'}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Team Member Names <span className="text-red-500">*</span>
                    </label>
                    <Input
                      required
                      value={formData.memberNames}
                      onChange={(e) => setFormData({ ...formData, memberNames: e.target.value })}
                      placeholder="e.g., John Doe, Jane Smith"
                    />
                    <p className="text-xs text-gray-500 mt-1">Separate multiple names with commas</p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">
                        Email <span className="text-red-500">*</span>
                      </label>
                      <Input
                        required
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="your.email@example.com"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">
                        Phone <span className="text-red-500">*</span>
                      </label>
                      <Input
                        required
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+91 98765 43210"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      College/University <span className="text-red-500">*</span>
                    </label>
                    <Input
                      required
                      value={formData.college}
                      onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                      placeholder="IIT Delhi, BITS Pilani, etc."
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Why do you want to participate? <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      required
                      value={formData.whyParticipate}
                      onChange={(e) => setFormData({ ...formData, whyParticipate: e.target.value })}
                      rows={3}
                      placeholder="Tell us about your motivation and goals..."
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">
                        Experience Level
                      </label>
                      <select
                        value={formData.experience}
                        onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="Beginner">Beginner (0-1 years)</option>
                        <option value="Intermediate">Intermediate (1-3 years)</option>
                        <option value="Advanced">Advanced (3+ years)</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">
                        GitHub Profile (Optional)
                      </label>
                      <Input
                        value={formData.github}
                        onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                        placeholder="https://github.com/username"
                      />
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex gap-3">
                      <Target className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-blue-900 mb-1">Event Details</h4>
                        <div className="text-sm text-blue-700 space-y-1">
                          <div>📅 {new Date(selectedEvent.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</div>
                          <div>📍 {selectedEvent.location} ({selectedEvent.mode})</div>
                          <div>🏆 Prize: {selectedEvent.prize}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowRegistrationModal(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="flex-1">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Complete Registration
                  </Button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
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