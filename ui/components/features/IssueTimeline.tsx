"use client";

import { motion } from 'framer-motion';
import { CheckCircle, Clock, AlertCircle, User, MapPin } from 'lucide-react';
import { IssueStatus } from '@/lib/backend/types';

interface IssueTimelineProps {
  status: IssueStatus;
  createdAt: string;
  updatedAt?: string;
  assignedTo?: string;
  resolvedBy?: string;
}

const timelineSteps = [
  { status: 'REPORTED', label: 'Issue Reported', icon: AlertCircle },
  { status: 'ASSIGNED', label: 'Assigned to Team', icon: User },
  { status: 'IN_PROGRESS', label: 'Work in Progress', icon: Clock },
  { status: 'RESOLVED', label: 'Issue Resolved', icon: CheckCircle }
];

export default function IssueTimeline({ 
  status, 
  createdAt, 
  updatedAt, 
  assignedTo, 
  resolvedBy 
}: IssueTimelineProps) {
  const currentStepIndex = timelineSteps.findIndex(step => step.status === status);
  const isCompleted = (stepIndex: number) => stepIndex < currentStepIndex;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="relative">
      {/* Progress Line */}
      <div className="absolute left-6 top-8 bottom-0 w-0.5 bg-neutral-200 dark:bg-neutral-700">
        <motion.div
          className="h-full bg-civic-primary-600"
          initial={{ scaleY: 0 }}
          animate={{ scaleY: currentStepIndex / (timelineSteps.length - 1) }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          style={{ originY: 0 }}
        />
      </div>

      {/* Timeline Steps */}
      <div className="space-y-8">
        {timelineSteps.map((step, index) => {
          const Icon = step.icon;
          const isActive = index === currentStepIndex;
          const isPast = index < currentStepIndex;
          const stepDate = index === 0 ? createdAt : updatedAt;

          return (
            <motion.div
              key={step.status}
              className="flex items-start space-x-4"
              initial={{ opacity: 0, x: -20 }}
              animate={{ 
                opacity: isPast ? 1 : 0.3,
                x: 0 
              }}
              transition={{ 
                duration: 0.4,
                delay: index * 0.1,
                ease: "easeOut"
              }}
            >
              {/* Status Circle */}
              <motion.div
                className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  isActive 
                    ? 'bg-civic-primary-600 ring-4 ring-civic-primary-200' 
                    : isPast 
                      ? 'bg-civic-secondary-600' 
                      : 'bg-neutral-200 dark:bg-neutral-700'
                }`}
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.2 }}
              >
                <Icon 
                  size={20} 
                  className={isActive || isPast ? 'text-white' : 'text-neutral-500 dark:text-neutral-400'} 
                />
              </motion.div>

              {/* Step Content */}
              <div className="flex-1">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ 
                    opacity: isPast ? 1 : 0.5,
                    y: 0 
                  }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                >
                  <h4 className={`font-semibold mb-1 ${
                    isActive 
                      ? 'text-civic-primary-600' 
                      : isPast 
                        ? 'text-neutral-800 dark:text-white' 
                        : 'text-neutral-500 dark:text-neutral-400'
                  }`}>
                    {step.label}
                  </h4>
                  
                  {stepDate && (
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">
                      {formatDate(stepDate)}
                    </p>
                  )}

                  {/* Additional Details */}
                  {step.status === 'ASSIGNED' && assignedTo && (
                    <p className="text-sm text-neutral-600 dark:text-neutral-300 mt-2">
                      Assigned to: <span className="font-medium">{assignedTo}</span>
                    </p>
                  )}

                  {step.status === 'RESOLVED' && resolvedBy && (
                    <p className="text-sm text-neutral-600 dark:text-neutral-300 mt-2">
                      Resolved by: <span className="font-medium">{resolvedBy}</span>
                    </p>
                  )}
                </motion.div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
