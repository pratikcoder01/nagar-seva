"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Camera, Upload, Brain, AlertCircle } from 'lucide-react';
import { IssueCategory } from '@/lib/backend/types';
import { AIService } from '@/lib/backend/ai-service';
import { buttonHover } from '@/ui/animations/animations';

interface SmartIssueFormProps {
  onSubmit: (issueData: any) => void;
  initialData?: {
    title?: string;
    description?: string;
    category?: IssueCategory;
    latitude?: number;
    longitude?: number;
  };
}

export default function SmartIssueForm({ onSubmit, initialData }: SmartIssueFormProps) {
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    category: initialData?.category || IssueCategory.ROAD_DAMAGE,
    latitude: initialData?.latitude || 19.0760,
    longitude: initialData?.longitude || 72.8777,
    imagePreview: null as string | null
  });

  const [aiSuggestion, setAiSuggestion] = useState<{
    category: IssueCategory;
    confidence: number;
    keywords: string[];
  } | null>(null);

  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Auto-categorize as user types
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (formData.title.length > 5 || formData.description.length > 10) {
        setIsAnalyzing(true);
        
        try {
          const suggestion = await AIService.categorizeIssue(
            formData.title,
            formData.description,
            formData.imagePreview || undefined
          );
          
          setAiSuggestion(suggestion);
          
          // Auto-apply suggestion if confidence > 0.8
          if (suggestion.confidence > 0.8) {
            setFormData(prev => ({
              ...prev,
              category: suggestion.category
            }));
          }
        } catch (error) {
          console.error('AI categorization failed:', error);
        } finally {
          setIsAnalyzing(false);
        }
      }
    }, 1000); // Wait 1 second after user stops typing

    return () => clearTimeout(timer);
  }, [formData.title, formData.description]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        if (result) {
          // Extract base64 without prefix
          const base64Data = result.split(',')[1];
          setFormData(prev => ({
            ...prev,
            imagePreview: `data:image/jpeg;base64,${base64Data}`
          }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const submissionData = {
      ...formData,
      category: aiSuggestion?.category || formData.category
    };

    onSubmit(submissionData);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="civic-card p-6"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* AI Suggestion Display */}
        {aiSuggestion && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className={`p-4 rounded-lg border-l-4 ${
              aiSuggestion.confidence > 0.8 
                ? 'border-civic-primary-500 bg-civic-primary-50' 
                : 'border-neutral-300 bg-neutral-50'
            }`}
          >
            <div className="flex items-center space-x-2 mb-3">
              <Brain className={`w-5 h-5 ${
                aiSuggestion.confidence > 0.8 ? 'text-civic-primary-600' : 'text-neutral-600'
              }`} />
              <div>
                <h4 className="font-semibold text-sm mb-1">AI Suggestion</h4>
                <p className="text-lg font-bold">{aiSuggestion.category.replace('_', ' ')}</p>
                <div className="flex items-center space-x-2">
                  <div className="text-xs text-neutral-500">
                    Confidence: {Math.round(aiSuggestion.confidence * 100)}%
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {aiSuggestion.keywords.slice(0, 3).map((keyword, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-civic-primary-100 text-civic-primary-700 rounded text-xs"
                      >
                        {keyword}
                      </span>
                    ))}
                    {aiSuggestion.keywords.length > 3 && (
                      <span className="text-xs text-neutral-500">
                        +{aiSuggestion.keywords.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Title Input */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              Issue Title
              {isAnalyzing && (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="inline-block w-4 h-4 border-2 border-civic-primary-600 border-t-transparent rounded-full"
                />
              )}
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-4 py-3 border border-neutral-300 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-civic-primary-500 focus:border-civic-primary-500"
              placeholder="e.g., Pothole on Main Street"
              required
            />
          </div>

          {/* Description Input */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-4 py-3 border border-neutral-300 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-civic-primary-500 focus:border-civic-primary-500"
              rows={4}
              placeholder="Detailed description of the issue..."
              required
            />
          </div>

          {/* Category Selection */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              Category
              {aiSuggestion && aiSuggestion.confidence > 0.8 && (
                <span className="text-xs text-civic-primary-600 ml-2">
                  AI-selected
                </span>
              )}
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value as IssueCategory }))}
              className="w-full px-4 py-3 border border-neutral-300 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-civic-primary-500 focus:border-civic-primary-500"
            >
              <option value={IssueCategory.ROAD_DAMAGE}>Road Damage</option>
              <option value={IssueCategory.STREET_LIGHT}>Street Light</option>
              <option value={IssueCategory.GARBAGE}>Garbage</option>
              <option value={IssueCategory.WATER_SUPPLY}>Water Supply</option>
              <option value={IssueCategory.ELECTRICITY}>Electricity</option>
              <option value={IssueCategory.PUBLIC_TOILET}>Public Toilet</option>
              <option value={IssueCategory.PARK_MAINTENANCE}>Park Maintenance</option>
              <option value={IssueCategory.TRAFFIC_SIGNAL}>Traffic Signal</option>
            </select>
          </div>

          {/* Location */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                <MapPin className="inline w-4 h-4 mr-2" />
                Latitude
              </label>
              <input
                type="number"
                step="0.000001"
                value={formData.latitude}
                onChange={(e) => setFormData(prev => ({ ...prev, latitude: parseFloat(e.target.value) }))}
                className="w-full px-4 py-3 border border-neutral-300 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-civic-primary-500 focus:border-civic-primary-500"
                placeholder="19.0760"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                <MapPin className="inline w-4 h-4 mr-2" />
                Longitude
              </label>
              <input
                type="number"
                step="0.000001"
                value={formData.longitude}
                onChange={(e) => setFormData(prev => ({ ...prev, longitude: parseFloat(e.target.value) }))}
                className="w-full px-4 py-3 border border-neutral-300 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-civic-primary-500 focus:border-civic-primary-500"
                placeholder="72.8777"
                required
              />
            </div>
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              <Camera className="inline w-4 h-4 mr-2" />
              Photo (Optional)
            </label>
            <div className="relative">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="w-full px-4 py-3 border border-neutral-300 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-civic-primary-500 focus:border-civic-primary-500"
              />
              {formData.imagePreview && (
                <motion.img
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4 }}
                  src={formData.imagePreview}
                  alt="Issue preview"
                  className="w-full h-32 object-cover rounded-lg mt-2"
                />
              )}
            </div>
          </div>

          {/* Submit Button */}
          <motion.button
            type="submit"
            className="w-full py-3 bg-civic-primary-600 hover:bg-civic-primary-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
            whileHover={buttonHover}
            whileTap={{ scale: 0.98 }}
            disabled={isAnalyzing}
          >
            {isAnalyzing ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                />
                <span>Analyzing...</span>
              </>
            ) : (
              <>
                <Upload className="w-5 h-5" />
                <span>Report Issue</span>
              </>
            )}
          </motion.button>
        </div>

        {/* Location Helper */}
        <div className="mt-4 p-4 bg-neutral-50 dark:bg-neutral-800 rounded-lg">
          <h4 className="font-semibold text-sm mb-2 flex items-center">
            <MapPin className="w-4 h-4 mr-2" />
            Location Tips
          </h4>
          <ul className="text-xs text-neutral-600 dark:text-neutral-400 space-y-1">
            <li>• Click on the map to set precise location</li>
            <li>• Enable GPS for automatic coordinates</li>
            <li>• Current location: {formData.latitude.toFixed(4)}, {formData.longitude.toFixed(4)}</li>
          </ul>
        </div>
      </form>
    </motion.div>
  );
}
