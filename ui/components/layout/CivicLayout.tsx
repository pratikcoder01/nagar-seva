"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import CivicHeader from './CivicHeader';
import { useReducedMotion, getAnimationProps, pageTransition } from '@/ui/animations/animations';

interface CivicLayoutProps {
  children: React.ReactNode;
  user?: {
    name: string;
    email: string;
    role: 'CITIZEN' | 'ADMIN';
    points?: number;
  };
  notifications?: number;
  showSidebar?: boolean;
  onSidebarToggle?: () => void;
}

export default function CivicLayout({ 
  children, 
  user, 
  notifications = 0,
  showSidebar = false,
  onSidebarToggle 
}: CivicLayoutProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900">
      {/* Page Transition Container */}
      <AnimatePresence mode="wait">
        <motion.div
          {...getAnimationProps(pageTransition)}
          className="relative"
        >
          <CivicHeader
            user={user}
            notifications={notifications}
            onMenuToggle={() => setIsMenuOpen(!isMenuOpen)}
          />

          {/* Mobile Menu Overlay */}
          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 bg-black/50 z-40 md:hidden"
                onClick={() => setIsMenuOpen(false)}
              >
                <motion.div
                  initial={{ x: '-100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '-100%' }}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  className="fixed left-0 top-16 h-full w-80 bg-white dark:bg-neutral-800 shadow-xl z-50"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-neutral-800 dark:text-white mb-4">
                      Navigation
                    </h3>
                    <nav className="space-y-4">
                      <a
                        href="/dashboard"
                        className="block px-4 py-3 text-neutral-600 dark:text-neutral-300 hover:bg-civic-primary-50 rounded-lg transition-colors"
                      >
                        Dashboard
                      </a>
                      <a
                        href="/report-issue"
                        className="block px-4 py-3 text-neutral-600 dark:text-neutral-300 hover:bg-civic-primary-50 rounded-lg transition-colors"
                      >
                        Report Issue
                      </a>
                      {user?.role === 'ADMIN' && (
                        <a
                          href="/admin"
                          className="block px-4 py-3 text-civic-secondary-600 hover:bg-civic-secondary-50 rounded-lg transition-colors"
                        >
                          Admin Panel
                        </a>
                      )}
                    </nav>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main Content */}
          <main className="pt-16">
            <div className="civic-container">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="py-6"
              >
                {children}
              </motion.div>
            </div>
          </main>

          {/* Desktop Sidebar */}
          {showSidebar && (
            <motion.aside
              initial={{ x: 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 25 }}
              className="hidden lg:block fixed top-16 right-0 w-80 h-[calc(100vh-4rem)] bg-white dark:bg-neutral-800 border-l border-neutral-200 dark:border-neutral-700 z-30"
            >
              <div className="p-6 h-full overflow-y-auto">
                <h3 className="text-lg font-semibold text-neutral-800 dark:text-white mb-6">
                  Quick Actions
                </h3>
                <div className="space-y-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full px-4 py-3 bg-civic-primary-600 hover:bg-civic-primary-700 text-white rounded-lg transition-colors"
                  >
                    Report New Issue
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full px-4 py-3 border border-civic-primary-600 text-civic-primary-600 hover:bg-civic-primary-50 rounded-lg transition-colors"
                  >
                    View My Reports
                  </motion.button>
                  
                  {user?.role === 'ADMIN' && (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full px-4 py-3 bg-civic-secondary-600 hover:bg-civic-secondary-700 text-white rounded-lg transition-colors"
                    >
                      Admin Dashboard
                    </motion.button>
                  )}
                </div>

                {/* User Stats */}
                {user && (
                  <div className="mt-8 p-4 bg-neutral-50 dark:bg-neutral-900 rounded-lg">
                    <h4 className="font-semibold text-neutral-800 dark:text-white mb-4">
                      Your Impact
                    </h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-neutral-600 dark:text-neutral-400">Issues Reported</span>
                        <span className="font-semibold text-civic-primary-600">12</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-neutral-600 dark:text-neutral-400">Issues Resolved</span>
                        <span className="font-semibold text-civic-secondary-600">8</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-neutral-600 dark:text-neutral-400">Civic Points</span>
                        <span className="font-semibold text-civic-primary-600">{user.points || 0}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.aside>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
