"use client";

import { motion } from 'framer-motion';
import { MapPin, Calendar, User, Clock, CheckCircle, AlertCircle, ArrowRight } from 'lucide-react';
import { IssueStatus, IssueCategory } from '@/lib/backend/types';

interface IssueCardProps {
  issue: {
    id: string;
    title: string;
    description: string;
    category: IssueCategory;
    status: IssueStatus;
    latitude: number;
    longitude: number;
    image_before?: string;
    image_after?: string;
    created_at: string;
    user?: {
      name: string;
      email: string;
    };
  };
  onClick?: () => void;
  compact?: boolean;
}

const statusColors = {
  REPORTED: 'bg-status-reported',
  ASSIGNED: 'bg-status-assigned',
  IN_PROGRESS: 'bg-status-progress',
  RESOLVED: 'bg-status-resolved'
};

const statusIcons = {
  REPORTED: AlertCircle,
  ASSIGNED: Clock,
  IN_PROGRESS: Clock,
  RESOLVED: CheckCircle
};

const categoryColors = {
  ROAD_DAMAGE: 'text-orange-600 dark:text-orange-400',
  STREET_LIGHT: 'text-yellow-600 dark:text-yellow-400',
  GARBAGE: 'text-green-600 dark:text-green-400',
  WATER_SUPPLY: 'text-blue-600 dark:text-blue-400',
  ELECTRICITY: 'text-purple-600 dark:text-purple-400',
  PUBLIC_TOILET: 'text-pink-600 dark:text-pink-400',
  PARK_MAINTENANCE: 'text-emerald-600 dark:text-emerald-400',
  TRAFFIC_SIGNAL: 'text-red-600 dark:text-red-400'
};

const categoryLabels = {
  ROAD_DAMAGE: 'Road Damage',
  STREET_LIGHT: 'Street Light',
  GARBAGE: 'Garbage',
  WATER_SUPPLY: 'Water Supply',
  ELECTRICITY: 'Electricity',
  PUBLIC_TOILET: 'Public Toilet',
  PARK_MAINTENANCE: 'Park Maintenance',
  TRAFFIC_SIGNAL: 'Traffic Signal'
};

export default function IssueCard({ issue, onClick, compact = false }: IssueCardProps) {
  const StatusIcon = statusIcons[issue.status];
  const statusColor = statusColors[issue.status];
  const categoryColor = categoryColors[issue.category];
  const categoryLabel = categoryLabels[issue.category];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const truncateText = (text: string, maxLength: number) => {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  return (
    <motion.article
      className={`civic-card p-6 cursor-pointer ${
        compact ? 'hover:shadow-lg' : 'hover:shadow-xl'
      }`}
      onClick={onClick}
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ 
        type: "spring", 
        stiffness: 300, 
        damping: 20 
      }}
      layout
    >
      {/* Status Badge */}
      <motion.div
        className={`inline-flex items-center px-3 py-1 rounded-full text-white text-xs font-medium mb-4 ${statusColor}`}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <StatusIcon size={12} className="mr-1" />
        <span className="capitalize">{issue.status.replace('_', ' ')}</span>
      </motion.div>

      <div className={`${compact ? 'space-y-3' : 'space-y-4'}`}>
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-neutral-800 dark:text-white mb-2">
              {issue.title}
            </h3>
            
            <div className="flex items-center space-x-4 text-sm">
              <span className={`font-medium ${categoryColor}`}>
                {categoryLabel}
              </span>
              
              <div className="flex items-center text-neutral-500 dark:text-neutral-400">
                <MapPin size={14} className="mr-1" />
                <span className="text-xs">
                  {issue.latitude.toFixed(4)}, {issue.longitude.toFixed(4)}
                </span>
              </div>
            </div>
          </div>

          {!compact && (
            <div className="text-right">
              <motion.button
                className="text-civic-primary-600 hover:text-civic-primary-700 font-medium text-sm"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                View Details
                <ArrowRight size={16} className="ml-1" />
              </motion.button>
            </div>
          )}
        </div>

        {/* Description */}
        <p className="text-neutral-600 dark:text-neutral-300 text-sm leading-relaxed">
          {compact 
            ? truncateText(issue.description, 120)
            : issue.description
          }
        </p>

        {/* Image */}
        {issue.image_before && !compact && (
          <motion.div
            className="mt-4 rounded-lg overflow-hidden"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            whileHover={{ scale: 1.05 }}
          >
            <img
              src={issue.image_before}
              alt={issue.title}
              className="w-full h-48 object-cover"
              loading="lazy"
            />
          </motion.div>
        )}

        {/* After Image (for resolved issues) */}
        {issue.image_after && !compact && (
          <motion.div
            className="mt-4 rounded-lg overflow-hidden border-2 border-civic-secondary-200"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
          >
            <div className="relative">
              <img
                src={issue.image_after}
                alt={`${issue.title} - Resolved`}
                className="w-full h-48 object-cover"
                loading="lazy"
              />
              <div className="absolute top-2 right-2 bg-civic-secondary-600 text-white px-2 py-1 rounded text-xs font-medium">
                Resolved
              </div>
            </div>
          </motion.div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-neutral-200 dark:border-neutral-700">
          <div className="flex items-center space-x-2 text-sm text-neutral-500 dark:text-neutral-400">
            <User size={14} className="mr-1" />
            <span>{issue.user?.name}</span>
            <span className="text-neutral-400 dark:text-neutral-500">
              • {formatDate(issue.created_at)}
            </span>
          </div>

          {!compact && (
            <motion.div
              className="flex space-x-2"
              whileHover={{ scale: 1.05 }}
            >
              <motion.button
                className="px-3 py-1 text-civic-primary-600 hover:bg-civic-primary-50 rounded-lg text-sm font-medium"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                Track
              </motion.button>
              
              {issue.status === 'REPORTED' && (
                <motion.button
                  className="px-3 py-1 bg-civic-secondary-600 hover:bg-civic-secondary-700 text-white rounded-lg text-sm font-medium"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Assign
                </motion.button>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </motion.article>
  );
}
