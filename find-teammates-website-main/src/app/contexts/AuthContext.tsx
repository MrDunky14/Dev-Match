// Authentication context for managing user state
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../lib/types';
import { mockCurrentUser } from '../lib/mockData';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string, college: string, initialData?: Partial<User>) => Promise<void>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check for existing session
    const storedUser = localStorage.getItem('collabNestUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      // Auto-login with mock user for demo purposes
      setUser(mockCurrentUser);
      localStorage.setItem('collabNestUser', JSON.stringify(mockCurrentUser));
    }
  }, []);

  const login = async (email: string, password: string) => {
    // Mock login - in production, this would call your backend API
    await new Promise(resolve => setTimeout(resolve, 500));

    // For demo, accept any credentials
    const loggedInUser = { ...mockCurrentUser, email };
    setUser(loggedInUser);
    localStorage.setItem('collabNestUser', JSON.stringify(loggedInUser));
  };

  const signup = async (name: string, email: string, password: string, college: string, initialData?: Partial<User>) => {
    // Mock signup
    await new Promise(resolve => setTimeout(resolve, 500));

    const newUser: User = {
      id: Date.now().toString(),
      name,
      email,
      college,
      skills: initialData?.skills || [],
      interests: initialData?.interests || [],
      experience: initialData?.experience || 'Beginner',
      bio: initialData?.bio || '',
      availability: initialData?.availability || 'Weekends',
      profileImage: initialData?.profileImage,
    };

    setUser(newUser);
    localStorage.setItem('collabNestUser', JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('collabNestUser');
  };

  const updateProfile = (updates: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      localStorage.setItem('collabNestUser', JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        signup,
        logout,
        updateProfile,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}