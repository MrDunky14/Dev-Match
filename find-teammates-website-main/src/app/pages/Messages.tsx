import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import {
  Search,
  Send,
  MoreVertical,
  Phone,
  Video,
  Paperclip,
  Smile,
  CheckCheck,
  Circle,
  Star,
  ArrowLeft
} from 'lucide-react';
import { Card, CardContent } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { DashboardLayout } from '../components/DashboardLayout';
import { useAuth } from '../contexts/AuthContext';
import { generateMessageReply } from '../lib/aiService';

interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: Date;
  read: boolean;
}

interface Conversation {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  lastMessage: string;
  lastMessageTime: Date;
  unreadCount: number;
  online: boolean;
  messages: Message[];
}

const mockConversations: Conversation[] = [
  {
    id: '1',
    userId: 'user1',
    userName: 'Priya Patel',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Priya',
    lastMessage: 'That sounds great! When can we start?',
    lastMessageTime: new Date(Date.now() - 5 * 60 * 1000),
    unreadCount: 2,
    online: true,
    messages: [
      { id: 'm1', senderId: 'user1', text: 'Hey! I saw your profile, love your React projects!', timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), read: true },
      { id: 'm2', senderId: 'me', text: 'Thanks! Your AI/ML work is impressive too!', timestamp: new Date(Date.now() - 1.5 * 60 * 60 * 1000), read: true },
      { id: 'm3', senderId: 'user1', text: 'Want to collaborate on a hackathon project?', timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000), read: true },
      { id: 'm4', senderId: 'me', text: 'Absolutely! I was thinking of building an AI-powered study companion', timestamp: new Date(Date.now() - 30 * 60 * 1000), read: true },
      { id: 'm5', senderId: 'user1', text: 'That sounds great! When can we start?', timestamp: new Date(Date.now() - 5 * 60 * 1000), read: false },
    ],
  },
  {
    id: '2',
    userId: 'user2',
    userName: 'Rahul Verma',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rahul',
    lastMessage: 'Thanks for the resource recommendation!',
    lastMessageTime: new Date(Date.now() - 2 * 60 * 60 * 1000),
    unreadCount: 0,
    online: false,
    messages: [
      { id: 'm1', senderId: 'user2', text: 'Hey! Can you help me with TypeScript?', timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000), read: true },
      { id: 'm2', senderId: 'me', text: 'Sure! Check out the TypeScript handbook in resources', timestamp: new Date(Date.now() - 2.5 * 60 * 60 * 1000), read: true },
      { id: 'm3', senderId: 'user2', text: 'Thanks for the resource recommendation!', timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), read: true },
    ],
  },
  {
    id: '3',
    userId: 'user3',
    userName: 'Sneha Gupta',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sneha',
    lastMessage: 'See you at DevFest!',
    lastMessageTime: new Date(Date.now() - 24 * 60 * 60 * 1000),
    unreadCount: 0,
    online: true,
    messages: [
      { id: 'm1', senderId: 'user3', text: 'Are you going to DevFest 2026?', timestamp: new Date(Date.now() - 25 * 60 * 60 * 1000), read: true },
      { id: 'm2', senderId: 'me', text: 'Yes! Looking forward to it', timestamp: new Date(Date.now() - 24.5 * 60 * 60 * 1000), read: true },
      { id: 'm3', senderId: 'user3', text: 'See you at DevFest!', timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), read: true },
    ],
  },
];

export function Messages() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [conversations, setConversations] = useState(mockConversations);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(conversations[0]);
  const [messageText, setMessageText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileView, setMobileView] = useState<'list' | 'chat'>('list');

  // Switch to chat view on mobile when a conversation is selected
  useEffect(() => {
    if (selectedConversation) {
      setMobileView('chat');
    }
  }, [selectedConversation]);

  // Check for newly matched partner from localStorage
  useEffect(() => {
    const newPartnerData = localStorage.getItem('newChatPartner');
    if (newPartnerData) {
      try {
        const partner = JSON.parse(newPartnerData);

        // Check if conversation already exists
        const existingConv = conversations.find(c => c.userId === partner.id);

        if (existingConv) {
          setSelectedConversation(existingConv);
        } else {
          // Create a new conversation object
          const newConv: Conversation = {
            id: `conv_${Date.now()}`,
            userId: partner.id,
            userName: partner.name,
            userAvatar: partner.image || partner.name.charAt(0), // Fallback to initial
            lastMessage: 'You matched! Say hello.',
            lastMessageTime: new Date(),
            unreadCount: 0,
            online: true,
            messages: []
          };

          setConversations(prev => [newConv, ...prev]);
          setSelectedConversation(newConv);
        }

        // Clean up
        localStorage.removeItem('newChatPartner');
      } catch (e) {
        console.error('Error parsing newChatPartner:', e);
      }
    }
  }, []);

  const handleSendMessage = () => {
    if (!messageText.trim() || !selectedConversation) return;

    const currentConvId = selectedConversation.id;
    const currentConvUserId = selectedConversation.userId;

    const newMessage: Message = {
      id: `m${Date.now()}`,
      senderId: 'me',
      text: messageText,
      timestamp: new Date(),
      read: true,
    };

    setConversations(conversations.map(conv => {
      if (conv.id === currentConvId) {
        return {
          ...conv,
          messages: [...conv.messages, newMessage],
          lastMessage: messageText,
          lastMessageTime: new Date(),
        };
      }
      return conv;
    }));

    setSelectedConversation({
      ...selectedConversation,
      messages: [...selectedConversation.messages, newMessage],
      lastMessage: messageText,
      lastMessageTime: new Date(),
    });

    const userQuery = messageText;
    setMessageText('');

    // --- Simulated Auto-Reply ---
    setTimeout(() => {
      const contextualReply = generateMessageReply(userQuery, selectedConversation.userName);

      const replyMessage: Message = {
        id: `reply_${Date.now()}`,
        senderId: currentConvUserId, // Other person's ID
        text: contextualReply,
        timestamp: new Date(),
        read: false,
      };

      setConversations(prev => prev.map(conv => {
        if (conv.id === currentConvId) {
          return {
            ...conv,
            messages: [...conv.messages, replyMessage],
            lastMessage: contextualReply,
            lastMessageTime: new Date(),
          };
        }
        return conv;
      }));

      setSelectedConversation(prev => {
        if (prev && prev.id === currentConvId) {
          return {
            ...prev,
            messages: [...prev.messages, replyMessage],
            lastMessage: contextualReply,
            lastMessageTime: new Date(),
          };
        }
        return prev;
      });
    }, 2500); // 2.5 second delay
  };

  const filteredConversations = conversations.filter(conv =>
    conv.userName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <DashboardLayout>
      <div className="mb-6 flex items-center gap-4">
        <Button
          variant="outline"
          size="icon"
          onClick={() => navigate('/dashboard')}
          className="rounded-full hover:bg-gray-100 border-gray-200"
        >
          <ArrowLeft className="h-5 w-5 text-gray-600" />
        </Button>
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">Messages</h1>
          <p className="hidden md:block mt-1 text-sm text-gray-600">Chat with your teammates</p>
        </div>
      </div>

      <Card className="h-[calc(100vh-180px)] md:h-[calc(100vh-200px)] overflow-hidden border-none md:border shadow-xl">
        <CardContent className="p-0 h-full flex relative">
          {/* Conversations List */}
          <div className={`${mobileView === 'chat' ? 'hidden' : 'flex'} md:flex w-full md:w-80 border-r border-gray-200 flex-col bg-white shadow-sm z-10`}>
            {/* Search */}
            <div className="p-4 border-b border-gray-200">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search conversations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Conversation Items */}
            <div className="flex-1 overflow-y-auto">
              {filteredConversations.map((conv) => (
                <motion.div
                  key={conv.id}
                  whileHover={{ backgroundColor: '#F9FAFB' }}
                  onClick={() => setSelectedConversation(conv)}
                  className={`p-4 cursor-pointer border-b border-gray-100 ${selectedConversation?.id === conv.id ? 'bg-blue-50' : ''
                    }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="relative">
                      {conv.userAvatar && (conv.userAvatar.startsWith('http') || conv.userAvatar.startsWith('/') || conv.userAvatar.includes('data:image')) ? (
                        <img
                          src={conv.userAvatar}
                          alt={conv.userName}
                          className="h-12 w-12 rounded-full object-cover border border-gray-100"
                          referrerPolicy="no-referrer"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(conv.userName)}&background=7C3AED&color=fff`;
                          }}
                        />
                      ) : (
                        <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold flex-shrink-0">
                          {conv.userAvatar}
                        </div>
                      )}
                      {conv.online && (
                        <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-gray-900 truncate">
                          {conv.userName}
                        </span>
                        <span className="text-xs text-gray-500">
                          {formatTime(conv.lastMessageTime)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-600 truncate">
                          {conv.lastMessage}
                        </p>
                        {conv.unreadCount > 0 && (
                          <div className="h-5 w-5 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center font-semibold flex-shrink-0 ml-2">
                            {conv.unreadCount}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Chat Area */}
          {selectedConversation ? (
            <div className={`${mobileView === 'list' ? 'hidden' : 'flex'} md:flex flex-1 flex flex-col bg-white absolute inset-0 md:relative`}>
              {/* Chat Header */}
              <div className="p-3 md:p-4 border-b border-gray-200 flex items-center justify-between bg-white/80 backdrop-blur-sm z-20">
                <div className="flex items-center gap-2 md:gap-3">
                  {/* Back button for mobile */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="md:hidden"
                    onClick={() => setMobileView('list')}
                  >
                    <ArrowLeft className="h-5 w-5" />
                  </Button>

                  <div className="relative">
                    {selectedConversation.userAvatar && (selectedConversation.userAvatar.startsWith('http') || selectedConversation.userAvatar.startsWith('/') || selectedConversation.userAvatar.includes('data:image')) ? (
                      <img
                        src={selectedConversation.userAvatar}
                        alt={selectedConversation.userName}
                        className="h-10 w-10 rounded-full object-cover border border-gray-100"
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedConversation.userName)}&background=7C3AED&color=fff`;
                        }}
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                        {selectedConversation.userAvatar}
                      </div>
                    )}
                    {selectedConversation.online && (
                      <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white" />
                    )}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">
                      {selectedConversation.userName}
                    </div>
                    <div className="text-sm text-gray-500">
                      {selectedConversation.online ? 'Online' : 'Offline'}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm">
                    <Phone className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Video className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                {selectedConversation.messages.map((message) => {
                  const isMe = message.senderId === 'me';
                  return (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-md ${isMe ? 'order-2' : 'order-1'}`}>
                        <div
                          className={`rounded-2xl px-4 py-2 ${isMe
                            ? 'bg-blue-600 text-white'
                            : 'bg-white text-gray-900 border border-gray-200'
                            }`}
                        >
                          <p className="text-sm">{message.text}</p>
                        </div>
                        <div className={`mt-1 text-xs text-gray-500 flex items-center gap-1 ${isMe ? 'justify-end' : 'justify-start'}`}>
                          <span>{formatTime(message.timestamp)}</span>
                          {isMe && (
                            <CheckCheck className={`h-3 w-3 ${message.read ? 'text-blue-500' : 'text-gray-400'}`} />
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Message Input */}
              <div className="p-4 border-t border-gray-200 bg-white">
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm">
                    <Paperclip className="h-5 w-5 text-gray-400" />
                  </Button>
                  <Input
                    placeholder="Type a message..."
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    className="flex-1"
                  />
                  <Button variant="ghost" size="sm">
                    <Smile className="h-5 w-5 text-gray-400" />
                  </Button>
                  <Button onClick={handleSendMessage} disabled={!messageText.trim()}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              Select a conversation to start messaging
            </div>
          )}
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
