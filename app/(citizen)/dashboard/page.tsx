"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Clock, CheckCircle, Plus, TrendingUp } from 'lucide-react';
import CivicLayout from '@/ui/components/layout/CivicLayout';
import IssueCard from '@/ui/components/features/IssueCard';
import { IssueStatus } from '@/lib/backend/types';

export default function CitizenDashboard() {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch user's issues
    const fetchIssues = async () => {
      try {
        const response = await fetch('/api/issues', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
          }
        });
        const data = await response.json();
        setIssues(data.data || []);
      } catch (error) {
        console.error('Failed to fetch issues:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchIssues();
  }, []);

  const stats = {
    total: issues.length,
    resolved: issues.filter((i: any) => i.status === 'RESOLVED').length,
    inProgress: issues.filter((i: any) => i.status === 'IN_PROGRESS').length,
    pending: issues.filter((i: any) => i.status === 'REPORTED').length
  };

  return (
    <CivicLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-8"
      >
        {/* Header */}
        <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 shadow-lg">
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-white mb-2">
            My Civic Dashboard
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400">
            Track and manage your reported civic issues
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-neutral-800 rounded-xl p-6 shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">Total Issues</p>
                <p className="text-2xl font-bold text-neutral-900 dark:text-white">{stats.total}</p>
              </div>
              <div className="w-12 h-12 bg-civic-primary-100 rounded-lg flex items-center justify-center">
                <Plus className="w-6 h-6 text-civic-primary-600" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-neutral-800 rounded-xl p-6 shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">Pending</p>
                <p className="text-2xl font-bold text-status-reported">{stats.pending}</p>
              </div>
              <div className="w-12 h-12 bg-status-reported/20 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-status-reported" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-neutral-800 rounded-xl p-6 shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">In Progress</p>
                <p className="text-2xl font-bold text-status-progress">{stats.inProgress}</p>
              </div>
              <div className="w-12 h-12 bg-status-progress/20 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-status-progress" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-white dark:bg-neutral-800 rounded-xl p-6 shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">Resolved</p>
                <p className="text-2xl font-bold text-status-resolved">{stats.resolved}</p>
              </div>
              <div className="w-12 h-12 bg-status-resolved/20 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-status-resolved" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Issues List */}
        <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-neutral-900 dark:text-white">My Issues</h2>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 bg-civic-primary-600 hover:bg-civic-primary-700 text-white rounded-lg font-medium"
              onClick={() => window.location.href = '/report-issue'}
            >
              Report New Issue
            </motion.button>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-civic-primary-600 border-t-transparent"></div>
            </div>
          ) : issues.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-neutral-100 dark:bg-neutral-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-neutral-400" />
              </div>
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2">
                No Issues Reported Yet
              </h3>
              <p className="text-neutral-600 dark:text-neutral-400 mb-6">
                Start by reporting your first civic issue to help improve your community.
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 bg-civic-primary-600 hover:bg-civic-primary-700 text-white rounded-lg font-medium"
                onClick={() => window.location.href = '/report-issue'}
              >
                Report Your First Issue
              </motion.button>
            </div>
          ) : (
            <div className="space-y-4">
              {issues.map((issue: any, index) => (
                <motion.div
                  key={issue.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <IssueCard issue={issue} compact={true} />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </CivicLayout>
  );
}
