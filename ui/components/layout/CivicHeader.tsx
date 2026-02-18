"use client";

import { motion, useScroll, useTransform } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Menu, X, Bell, User, Settings } from 'lucide-react';
import { useReducedMotion, getAnimationProps, stickyHeader } from '@/ui/animations/animations';

interface CivicHeaderProps {
  user?: {
    name: string;
    email: string;
    role: 'CITIZEN' | 'ADMIN';
    points?: number;
  };
  notifications?: number;
  onMenuToggle?: () => void;
  onNotificationClick?: () => void;
}

export default function CivicHeader({ 
  user, 
  notifications = 0,
  onMenuToggle,
  onNotificationClick 
}: CivicHeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const { scrollY } = useScroll();
  
  // Sticky header effect
  const headerY = useTransform(scrollY, [0, 100], [0, -100]);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const unsubscribe = scrollY.on('change', (latest) => {
      setIsScrolled(latest > 20);
    });
    return unsubscribe;
  }, [scrollY]);

  return (
    <motion.header
      {...getAnimationProps(stickyHeader)}
      style={{ y: headerY }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-neutral-200' 
          : 'bg-transparent'
      }`}
    >
      <div className="civic-container">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.div 
            className="flex items-center space-x-3"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <div className="w-8 h-8 bg-civic-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">NS</span>
            </div>
            <span className="text-xl font-semibold text-neutral-800 dark:text-white">
              Nagar Seva
            </span>
          </motion.div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <motion.a
              href="/dashboard"
              className="text-neutral-600 dark:text-neutral-300 hover:text-civic-primary-600 font-medium transition-colors"
              whileHover={{ y: -2 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              Dashboard
            </motion.a>
            
            <motion.a
              href="/report-issue"
              className="text-neutral-600 dark:text-neutral-300 hover:text-civic-primary-600 font-medium transition-colors"
              whileHover={{ y: -2 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              Report Issue
            </motion.a>
            
            {user?.role === 'ADMIN' && (
              <motion.a
                href="/admin"
                className="text-civic-secondary-600 hover:text-civic-secondary-700 font-medium transition-colors"
                whileHover={{ y: -2 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                Admin Panel
              </motion.a>
            )}
          </nav>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <motion.button
              onClick={onNotificationClick}
              className="relative p-2 text-neutral-600 dark:text-neutral-300 hover:text-civic-primary-600 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <Bell size={20} />
              {notifications > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center"
                >
                  {notifications > 99 ? '99+' : notifications}
                </motion.span>
              )}
            </motion.button>

            {/* User Menu */}
            {user ? (
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <p className="text-sm font-medium text-neutral-800 dark:text-white">
                    {user.name}
                  </p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    {user.role === 'ADMIN' ? 'Administrator' : 'Citizen'}
                    {user.points !== undefined && ` • ${user.points} points`}
                  </p>
                </div>
                
                <motion.div
                  className="w-10 h-10 bg-civic-primary-600 rounded-full flex items-center justify-center text-white font-semibold"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  {user.name.charAt(0).toUpperCase()}
                </motion.div>
              </div>
            ) : (
              <motion.div className="flex space-x-2">
                <motion.a
                  href="/login"
                  className="px-4 py-2 text-civic-primary-600 hover:bg-civic-primary-50 rounded-lg font-medium transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  Sign In
                </motion.a>
                
                <motion.a
                  href="/signup"
                  className="px-4 py-2 border border-civic-primary-600 text-civic-primary-600 hover:bg-civic-primary-50 rounded-lg font-medium transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  Sign Up
                </motion.a>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </motion.header>
  );
}
