import { ReactNode, useState, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { motion, AnimatePresence } from 'motion/react';
import { Bot, Menu, X } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router';

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Don't show AI button on AI Assistant page
  const isAIPage = location.pathname === '/ai-assistant';

  return (
    <div className="flex h-screen bg-white relative overflow-hidden font-sans">
      {/* Background Polish Layer */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Dot Grid */}
        <div className="absolute inset-0 dot-grid-bg opacity-[0.4]" />

        {/* Soft Ambient Glows */}
        <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-blue-500/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-purple-500/5 rounded-full blur-[120px]" />
        <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-indigo-500/5 rounded-full blur-[120px]" />
      </div>

      {/* Desktop Sidebar (hidden on mobile) */}
      <div className="hidden lg:flex">
        <Sidebar />
      </div>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] lg:hidden"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-[280px] z-[101] lg:hidden"
            >
              <div className="h-full w-full bg-white shadow-2xl relative">
                {/* Close Button Inside Sidebar for Mobile */}
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="absolute top-4 right-4 p-2 bg-gray-100 rounded-full text-gray-500 lg:hidden"
                >
                  <X className="h-5 w-5" />
                </button>
                {/* Reusing Sidebar content - we might need to modify Sidebar to accept isMobile prop or just wrap it */}
                <Sidebar forceExpanded={true} />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative z-10">
        {/* Mobile Header */}
        <header className="lg:hidden h-16 border-b border-gray-100 bg-white/80 backdrop-blur-md flex items-center justify-between px-6 z-20">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
              <span className="text-white font-black text-xs">C</span>
            </div>
            <span className="font-black text-gray-900 tracking-tight">CollabNest</span>
          </div>
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2 -mr-2 bg-gray-50 rounded-xl text-gray-600 hover:bg-gray-100"
          >
            <Menu className="h-6 w-6" />
          </button>
        </header>

        <main className="flex-1 overflow-y-auto relative flex flex-col">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10, scale: 0.995 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.995 }}
              transition={{
                duration: 0.3,
                ease: [0.23, 1, 0.32, 1]
              }}
              className="flex-1 mx-auto w-full max-w-7xl p-4 md:p-8"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Floating AI Assistant Button */}
      {!isAIPage && (
        <>
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate('/ai-assistant')}
            className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 shadow-2xl flex items-center justify-center z-50 hover:shadow-purple-500/50 transition-shadow"
          >
            <Bot className="h-7 w-7 text-white" />
            <motion.div
              className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-green-500 border-2 border-white"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </motion.button>

          {/* Tooltip (Hidden on small mobile) */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="fixed bottom-6 right-24 bg-gray-900 text-white text-sm px-4 py-2 rounded-lg shadow-lg z-40 pointer-events-none hidden sm:block"
          >
            Ask AI Assistant
            <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-full border-8 border-transparent border-l-gray-900" />
          </motion.div>
        </>
      )}
    </div>
  );
}