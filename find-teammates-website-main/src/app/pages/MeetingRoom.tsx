import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  Monitor,
  MonitorOff,
  PhoneOff,
  Users,
  MessageCircle,
  Settings,
  Grid3x3,
  Maximize,
  MoreVertical,
  Hand,
  Presentation,
  Send,
  Plus,
  Calendar,
  Clock,
  User,
  Link2,
  Copy,
  CheckCircle,
  Trash2,
  LogIn,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { DashboardLayout } from '../components/DashboardLayout';
import { copyToClipboard } from '../utils/clipboard';

interface Meeting {
  id: string;
  title: string;
  meetingId: string;
  date: string;
  time: string;
  duration: string;
  host: string;
  participants: string[];
  status: 'Scheduled' | 'Active' | 'Ended';
  description: string;
}

interface Participant {
  id: string;
  name: string;
  avatar: string;
  isMuted: boolean;
  isVideoOff: boolean;
  isSpeaking: boolean;
}

const chatMessages = [
  { id: '1', user: 'Rahul Sharma', message: 'Hey everyone! Ready to start?', time: '10:30 AM' },
  { id: '2', user: 'Priya Singh', message: 'Yes, all set! 🚀', time: '10:31 AM' },
  { id: '3', user: 'Arjun Patel', message: 'Can you share the screen?', time: '10:32 AM' },
];

export function MeetingRoom() {
  const [meetings, setMeetings] = useState<Meeting[]>(() => {
    const saved = localStorage.getItem('meetings');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [activeMeeting, setActiveMeeting] = useState<Meeting | null>(null);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  
  // Meeting controls state
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showParticipants, setShowParticipants] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [messages, setMessages] = useState(chatMessages);
  const [viewMode, setViewMode] = useState<'grid' | 'speaker'>('grid');

  const [participants, setParticipants] = useState<Participant[]>([
    { id: '1', name: 'You', avatar: 'YO', isMuted: false, isVideoOff: false, isSpeaking: true },
  ]);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    time: '',
    duration: '30',
    description: '',
    participants: '',
  });

  useEffect(() => {
    localStorage.setItem('meetings', JSON.stringify(meetings));
  }, [meetings]);

  const handleCreateMeeting = (e: React.FormEvent) => {
    e.preventDefault();

    const newMeeting: Meeting = {
      id: Date.now().toString(),
      title: formData.title,
      meetingId: Math.random().toString(36).substring(2, 11).toUpperCase(),
      date: formData.date,
      time: formData.time,
      duration: formData.duration + ' min',
      host: 'You',
      participants: formData.participants.split(',').map(p => p.trim()).filter(p => p),
      status: 'Scheduled',
      description: formData.description,
    };

    setMeetings([newMeeting, ...meetings]);
    setShowCreateModal(false);
    resetForm();
    showNotificationMessage('Meeting created successfully!');
  };

  const handleJoinMeeting = (meeting: Meeting) => {
    setActiveMeeting(meeting);
    
    // Update meeting status to Active
    setMeetings(meetings.map(m => 
      m.id === meeting.id ? { ...m, status: 'Active' } : m
    ));

    // Add meeting participants to video call
    const meetingParticipants: Participant[] = [
      { id: '1', name: 'You', avatar: 'YO', isMuted: false, isVideoOff: false, isSpeaking: true },
      ...meeting.participants.map((name, index) => ({
        id: (index + 2).toString(),
        name,
        avatar: name.split(' ').map(n => n[0]).join('').toUpperCase(),
        isMuted: Math.random() > 0.5,
        isVideoOff: Math.random() > 0.6,
        isSpeaking: false,
      })),
    ];
    
    setParticipants(meetingParticipants);
    showNotificationMessage(`Joined meeting: ${meeting.title}`);
  };

  const handleEndMeeting = () => {
    if (activeMeeting) {
      setMeetings(meetings.map(m => 
        m.id === activeMeeting.id ? { ...m, status: 'Ended' } : m
      ));
      showNotificationMessage('Meeting ended');
    }
    setActiveMeeting(null);
    setParticipants([{ id: '1', name: 'You', avatar: 'YO', isMuted: false, isVideoOff: false, isSpeaking: true }]);
  };

  const handleDeleteMeeting = (meetingId: string) => {
    if (confirm('Are you sure you want to delete this meeting?')) {
      setMeetings(meetings.filter(m => m.id !== meetingId));
      showNotificationMessage('Meeting deleted');
    }
  };

  const handleCopyLink = async (meetingId: string) => {
    const link = `${window.location.origin}/meeting/${meetingId}`;
    const success = await copyToClipboard(link);
    if (success) {
      showNotificationMessage('Meeting link copied to clipboard!');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      date: '',
      time: '',
      duration: '30',
      description: '',
      participants: '',
    });
  };

  const showNotificationMessage = (message: string) => {
    setNotificationMessage(message);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  const handleSendMessage = () => {
    if (!chatMessage.trim()) return;
    
    const newMessage = {
      id: Date.now().toString(),
      user: 'You',
      message: chatMessage,
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    };
    
    setMessages([...messages, newMessage]);
    setChatMessage('');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Scheduled': return 'bg-blue-100 text-blue-700 border-blue-300';
      case 'Active': return 'bg-green-100 text-green-700 border-green-300';
      case 'Ended': return 'bg-gray-100 text-gray-700 border-gray-300';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  // If in active meeting, show video interface
  if (activeMeeting) {
    return (
      <DashboardLayout>
        <div className="h-[calc(100vh-8rem)] flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{activeMeeting.title}</h1>
              <p className="text-sm text-gray-600">Meeting ID: {activeMeeting.meetingId}</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-red-100 text-red-700 border-red-300">
                <span className="animate-pulse mr-1">●</span> Live
              </Badge>
              <Badge className="bg-green-100 text-green-700 border-green-300">
                <Users className="h-3 w-3 mr-1" />
                {participants.length} Participants
              </Badge>
            </div>
          </div>

          {/* Main Video Area */}
          <div className="flex-1 flex gap-4">
            {/* Video Grid */}
            <div className="flex-1 bg-gray-900 rounded-lg p-4 overflow-hidden relative">
              <div className={`grid gap-4 h-full ${viewMode === 'grid' ? 'grid-cols-3 grid-rows-2' : 'grid-cols-1'}`}>
                {(viewMode === 'grid' ? participants : participants.slice(0, 1)).map((participant, index) => (
                  <motion.div
                    key={participant.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className={`relative rounded-lg overflow-hidden ${
                      participant.isSpeaking ? 'ring-4 ring-green-500' : ''
                    } ${viewMode === 'speaker' ? 'h-full' : ''}`}
                  >
                    {participant.isVideoOff ? (
                      <div className="h-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                        <div className="text-center">
                          <div className="h-24 w-24 rounded-full bg-white/20 flex items-center justify-center text-white text-3xl font-bold mb-3 mx-auto">
                            {participant.avatar}
                          </div>
                          <p className="text-white font-medium">{participant.name}</p>
                          <VideoOff className="h-6 w-6 text-white/60 mx-auto mt-2" />
                        </div>
                      </div>
                    ) : (
                      <div className="h-full relative overflow-hidden">
                        {/* Simulated Camera Feed Background */}
                        <div className="absolute inset-0 bg-gradient-to-br from-gray-800 via-gray-900 to-black"></div>
                        
                        {/* Animated Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/10 via-purple-500/10 to-pink-500/10 animate-pulse"></div>
                        
                        {/* Participant Avatar/Video Placeholder */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-center">
                            <div className="h-32 w-32 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-4xl font-bold mb-3 mx-auto shadow-2xl">
                              {participant.avatar}
                            </div>
                            <p className="text-white font-semibold text-lg drop-shadow-lg">{participant.name}</p>
                          </div>
                        </div>
                        
                        {/* Camera Active Indicator */}
                        <div className="absolute top-3 left-3">
                          <div className="flex items-center gap-2 bg-green-500/80 backdrop-blur-sm px-2 py-1 rounded-full">
                            <div className="h-2 w-2 rounded-full bg-white animate-pulse"></div>
                            <span className="text-xs text-white font-medium">Live</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Participant Info Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-white text-sm font-medium">{participant.name}</span>
                          {participant.isMuted && (
                            <MicOff className="h-4 w-4 text-red-400" />
                          )}
                        </div>
                        {participant.isSpeaking && (
                          <div className="flex gap-0.5">
                            {[1, 2, 3].map((bar) => (
                              <div
                                key={bar}
                                className="w-1 bg-green-500 rounded-full animate-pulse"
                                style={{
                                  height: `${Math.random() * 12 + 8}px`,
                                  animationDelay: `${bar * 0.1}s`,
                                }}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <button className="absolute top-3 right-3 bg-black/50 hover:bg-black/70 p-2 rounded-lg transition-colors">
                      <MoreVertical className="h-4 w-4 text-white" />
                    </button>
                  </motion.div>
                ))}
              </div>

              {/* View Mode Toggle */}
              <div className="absolute top-4 right-4 flex gap-2">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="bg-black/50 border-white/20"
                >
                  <Grid3x3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'speaker' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('speaker')}
                  className="bg-black/50 border-white/20"
                >
                  <Maximize className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Chat Panel */}
            <AnimatePresence>
              {showChat && (
                <motion.div
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: 320, opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  className="bg-white rounded-lg border overflow-hidden flex flex-col"
                >
                  <div className="bg-blue-600 text-white p-4 flex items-center justify-between">
                    <h3 className="font-semibold">Meeting Chat</h3>
                    <button onClick={() => setShowChat(false)}>✕</button>
                  </div>

                  <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {messages.map((msg) => (
                      <div key={msg.id} className="bg-gray-50 rounded-lg p-3">
                        <div className="flex justify-between items-start mb-1">
                          <span className="text-sm font-semibold text-gray-900">{msg.user}</span>
                          <span className="text-xs text-gray-500">{msg.time}</span>
                        </div>
                        <p className="text-sm text-gray-700">{msg.message}</p>
                      </div>
                    ))}
                  </div>

                  <div className="p-4 border-t">
                    <div className="flex gap-2">
                      <Input
                        placeholder="Type a message..."
                        value={chatMessage}
                        onChange={(e) => setChatMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      />
                      <Button onClick={handleSendMessage}>
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Participants Panel */}
            <AnimatePresence>
              {showParticipants && (
                <motion.div
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: 280, opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  className="bg-white rounded-lg border overflow-hidden flex flex-col"
                >
                  <div className="bg-purple-600 text-white p-4 flex items-center justify-between">
                    <h3 className="font-semibold">Participants ({participants.length})</h3>
                    <button onClick={() => setShowParticipants(false)}>✕</button>
                  </div>

                  <div className="flex-1 overflow-y-auto p-4 space-y-2">
                    {participants.map((participant) => (
                      <div key={participant.id} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs font-semibold">
                            {participant.avatar}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{participant.name}</p>
                            {participant.isSpeaking && (
                              <p className="text-xs text-green-600">Speaking...</p>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-1">
                          {participant.isMuted ? (
                            <MicOff className="h-4 w-4 text-red-500" />
                          ) : (
                            <Mic className="h-4 w-4 text-green-500" />
                          )}
                          {participant.isVideoOff ? (
                            <VideoOff className="h-4 w-4 text-red-500" />
                          ) : (
                            <Video className="h-4 w-4 text-green-500" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Control Bar */}
          <div className="mt-4 bg-white rounded-lg border p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Duration: 15:32</span>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant={isMuted ? 'destructive' : 'outline'}
                  size="sm"
                  onClick={() => setIsMuted(!isMuted)}
                >
                  {isMuted ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                </Button>

                <Button
                  variant={isVideoOff ? 'destructive' : 'outline'}
                  size="sm"
                  onClick={() => setIsVideoOff(!isVideoOff)}
                >
                  {isVideoOff ? <VideoOff className="h-4 w-4" /> : <Video className="h-4 w-4" />}
                </Button>

                <Button
                  variant={isScreenSharing ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setIsScreenSharing(!isScreenSharing)}
                >
                  {isScreenSharing ? <MonitorOff className="h-4 w-4" /> : <Monitor className="h-4 w-4" />}
                </Button>

                <Button variant="outline" size="sm">
                  <Hand className="h-4 w-4" />
                </Button>

                <Button variant="outline" size="sm">
                  <Presentation className="h-4 w-4" />
                </Button>

                <Button
                  variant={showChat ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setShowChat(!showChat)}
                >
                  <MessageCircle className="h-4 w-4" />
                </Button>

                <Button
                  variant={showParticipants ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setShowParticipants(!showParticipants)}
                >
                  <Users className="h-4 w-4" />
                </Button>

                <Button variant="outline" size="sm">
                  <Settings className="h-4 w-4" />
                </Button>

                <Button variant="destructive" className="bg-red-600 hover:bg-red-700" onClick={handleEndMeeting}>
                  <PhoneOff className="h-4 w-4 mr-2" />
                  End Call
                </Button>
              </div>

              <div className="text-sm text-gray-600">
                {participants.length} participant{participants.length !== 1 ? 's' : ''}
              </div>
            </div>
          </div>
        </div>

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
                    <CheckCircle className="h-5 w-5" />
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

  // Default view - Meeting list and create
  return (
    <DashboardLayout>
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <Video className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Meeting Room</h1>
          </div>
          <Button onClick={() => setShowCreateModal(true)} className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Create Meeting
          </Button>
        </div>
        <p className="text-gray-600">Create and manage your virtual meetings</p>
      </div>

      {/* Meetings List */}
      {meetings.length === 0 ? (
        <Card className="p-12 text-center">
          <Video className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No meetings yet</h3>
          <p className="text-gray-600 mb-6">Create your first meeting to get started</p>
          <Button onClick={() => setShowCreateModal(true)}>
            <Plus className="h-5 w-5 mr-2" />
            Create Meeting
          </Button>
        </Card>
      ) : (
        <div className="grid gap-4">
          {meetings.map((meeting, index) => (
            <motion.div
              key={meeting.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-gray-900">{meeting.title}</h3>
                        <Badge className={`${getStatusColor(meeting.status)} border`}>
                          {meeting.status}
                        </Badge>
                      </div>
                      
                      {meeting.description && (
                        <p className="text-gray-600 mb-4">{meeting.description}</p>
                      )}

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="h-4 w-4 text-blue-600" />
                          <span>{new Date(meeting.date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Clock className="h-4 w-4 text-green-600" />
                          <span>{meeting.time}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <User className="h-4 w-4 text-purple-600" />
                          <span>{meeting.host}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Users className="h-4 w-4 text-orange-600" />
                          <span>{meeting.participants.length + 1} participants</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 mb-4">
                        <span className="text-sm font-medium text-gray-700">Meeting ID:</span>
                        <code className="bg-gray-100 px-3 py-1 rounded text-sm font-mono">{meeting.meetingId}</code>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleCopyLink(meeting.meetingId)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="flex gap-2">
                        {meeting.status === 'Scheduled' && (
                          <Button onClick={() => handleJoinMeeting(meeting)}>
                            <LogIn className="h-4 w-4 mr-2" />
                            Join Meeting
                          </Button>
                        )}
                        {meeting.status === 'Active' && (
                          <Button onClick={() => handleJoinMeeting(meeting)} className="bg-green-600 hover:bg-green-700">
                            <Video className="h-4 w-4 mr-2" />
                            Rejoin Meeting
                          </Button>
                        )}
                        <Button 
                          variant="outline" 
                          onClick={() => handleCopyLink(meeting.meetingId)}
                        >
                          <Link2 className="h-4 w-4 mr-2" />
                          Copy Link
                        </Button>
                        {meeting.status !== 'Active' && (
                          <Button 
                            variant="outline" 
                            onClick={() => handleDeleteMeeting(meeting.id)}
                            className="text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Create Meeting Modal */}
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
              className="w-full max-w-2xl bg-white rounded-lg shadow-xl"
            >
              <div className="bg-blue-600 text-white px-6 py-4 rounded-t-lg">
                <h2 className="text-xl font-bold">Create New Meeting</h2>
                <p className="text-sm text-blue-100 mt-1">Schedule a meeting with your team</p>
              </div>

              <form onSubmit={handleCreateMeeting} className="p-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Meeting Title <span className="text-red-500">*</span>
                    </label>
                    <Input
                      required
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="Project Discussion, Team Sync, etc."
                    />
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">
                        Date <span className="text-red-500">*</span>
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
                        Time <span className="text-red-500">*</span>
                      </label>
                      <Input
                        required
                        type="time"
                        value={formData.time}
                        onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">
                        Duration
                      </label>
                      <select
                        value={formData.duration}
                        onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="15">15 minutes</option>
                        <option value="30">30 minutes</option>
                        <option value="45">45 minutes</option>
                        <option value="60">1 hour</option>
                        <option value="90">1.5 hours</option>
                        <option value="120">2 hours</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Description
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={3}
                      placeholder="Brief agenda or meeting description..."
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Participants
                    </label>
                    <Input
                      value={formData.participants}
                      onChange={(e) => setFormData({ ...formData, participants: e.target.value })}
                      placeholder="Rahul Sharma, Priya Singh, Arjun Patel"
                    />
                    <p className="text-xs text-gray-500 mt-1">Separate multiple names with commas</p>
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
                    Create Meeting
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
                  <CheckCircle className="h-5 w-5" />
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
