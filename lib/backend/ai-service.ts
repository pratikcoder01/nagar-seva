import { createClient } from '../supabase/server';
import { IssueCategory } from './types';

interface CategoryPrediction {
  category: IssueCategory;
  confidence: number;
  keywords: string[];
}

interface LocationAnalysis {
  density: number;
  nearbyIssues: number;
  areaType: 'residential' | 'commercial' | 'industrial' | 'mixed';
}

export class AIService {
  private static async getSupabase() {
    return await createClient();
  }

  // AI-ASSISTED ISSUE CATEGORIZATION
  static async categorizeIssue(
    title: string, 
    description: string, 
    imageBase64?: string
  ): Promise<CategoryPrediction> {
    try {
      // Keyword-based categorization
      const categoryKeywords = {
        [IssueCategory.ROAD_DAMAGE]: ['pothole', 'crack', 'road', 'street', 'damage', 'repair', 'asphalt', 'traffic'],
        [IssueCategory.STREET_LIGHT]: ['light', 'street', 'lamp', 'dark', 'broken', 'flicker', 'outage'],
        [IssueCategory.GARBAGE]: ['garbage', 'trash', 'dump', 'waste', 'overflow', 'cleaning'],
        [IssueCategory.WATER_SUPPLY]: ['water', 'leak', 'pipe', 'supply', 'shortage', 'pressure'],
        [IssueCategory.ELECTRICITY]: ['power', 'electricity', 'outage', 'wire', 'pole', 'transformer'],
        [IssueCategory.PUBLIC_TOILET]: ['toilet', 'restroom', 'sanitation', 'clean', 'dirty', 'broken'],
        [IssueCategory.PARK_MAINTENANCE]: ['park', 'garden', 'grass', 'playground', 'equipment', 'bench'],
        [IssueCategory.TRAFFIC_SIGNAL]: ['signal', 'traffic', 'light', 'intersection', 'accident']
      };

      const combinedText = `${title} ${description}`.toLowerCase();
      const scores: Record<IssueCategory, number> = {} as Record<IssueCategory, number>;

      // Calculate keyword scores
      Object.entries(categoryKeywords).forEach(([category, keywords]) => {
        scores[category as IssueCategory] = keywords.reduce((score, keyword) => {
          return score + (combinedText.split(keyword).length - 1) * 2;
        }, 0);
      });

      // Image analysis (if provided)
      if (imageBase64) {
        // Simple image classification based on common patterns
        const imagePatterns = {
          [IssueCategory.ROAD_DAMAGE]: ['crack', 'pothole', 'debris'],
          [IssueCategory.GARBAGE]: ['bags', 'overflow', 'container'],
          [IssueCategory.WATER_SUPPLY]: ['puddle', 'leak', 'flood'],
          [IssueCategory.ELECTRICITY]: ['sparks', 'downed wires', 'broken pole']
        };

        Object.entries(imagePatterns).forEach(([category, patterns]) => {
          if (imageBase64.toLowerCase().includes('image')) {
            scores[category as IssueCategory] = (scores[category as IssueCategory] || 0) + 10;
          }
        });
      }

      // Find best match
      const bestCategory = Object.entries(scores).reduce((best, [category, score]) => 
        score > best[1] ? [category, score] : best
      ) as [IssueCategory, number];

      const confidence = Math.min(scores[bestCategory[0]] / 20, 0.95);

      return {
        category: bestCategory[0],
        confidence,
        keywords: categoryKeywords[bestCategory[0]]?.slice(0, 3) || []
      };

    } catch (error) {
      console.error('AI categorization error:', error);
      return {
        category: IssueCategory.ROAD_DAMAGE,
        confidence: 0.5,
        keywords: []
      };
    }
  }

  // DUPLICATE ISSUE DETECTION
  static async findDuplicates(
    latitude: number,
    longitude: number,
    title: string,
    description: string,
    radius: number = 0.01 // ~1km radius
  ): Promise<{
    exactMatches: Array<{ id: string; similarity: number }>;
    nearbyIssues: Array<{ id: string; distance: number; similarity: number }>;
  }> {
    try {
      const supabase = await this.getSupabase();
      
      // Find nearby issues
      const { data: nearbyIssues, error } = await supabase
        .rpc('find_nearby_issues', {
          lat: latitude,
          lng: longitude,
          radius_km: radius,
          search_title: title,
          search_description: description
        });

      if (error) {
        return { exactMatches: [], nearbyIssues: [] };
      }

      return {
        exactMatches: nearbyIssues?.exact || [],
        nearbyIssues: nearbyIssues?.nearby || []
      };

    } catch (error) {
      console.error('Duplicate detection error:', error);
      return { exactMatches: [], nearbyIssues: [] };
    }
  }

  // PRIORITY SCORING ENGINE
  static calculatePriorityScore(
    severity: number,
    reports: number,
    areaImportance: number,
    timeUnresolved: number,
    userTrustScore: number = 1.0
  ): number {
    // Base score components
    const severityWeight = 0.4;
    const reportsWeight = 0.2;
    const areaWeight = 0.2;
    const timeWeight = 0.15;
    const trustWeight = 0.05;

    // Calculate weighted score
    const severityScore = (severity / 5) * severityWeight;
    const reportsScore = Math.min(reports / 10, 1) * reportsWeight;
    const areaScore = (areaImportance / 5) * areaWeight;
    const timeScore = Math.min(timeUnresolved / 30, 1) * timeWeight;
    const trustScore = (userTrustScore / 100) * trustWeight;

    return Math.round((severityScore + reportsScore + areaScore + timeScore + trustScore) * 100);
  }

  // LOCATION ANALYSIS
  static async analyzeLocation(
    latitude: number,
    longitude: number
  ): Promise<LocationAnalysis> {
    try {
      const supabase = await this.getSupabase();
      
      // Get nearby issues density
      const { data: densityData, error } = await supabase
        .rpc('calculate_area_density', {
          lat: latitude,
          lng: longitude,
          radius_km: 0.5
        });

      if (error) {
        return {
          density: 0,
          nearbyIssues: 0,
          areaType: 'mixed'
        };
      }

      return {
        density: densityData?.density || 0,
        nearbyIssues: densityData?.nearby_issues || 0,
        areaType: densityData?.area_type || 'mixed'
      };

    } catch (error) {
      console.error('Location analysis error:', error);
      return {
        density: 0,
        nearbyIssues: 0,
        areaType: 'mixed'
      };
    }
  }

  // CITIZEN TRUST SCORE CALCULATION
  static async calculateTrustScore(userId: string): Promise<number> {
    try {
      const supabase = await this.getSupabase();
      
      // Get user's issue history
      const { data: issues, error } = await supabase
        .from('issues')
        .select('status, created_at')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error || !issues) {
        return 1.0; // Default trust score
      }

      // Calculate trust factors
      const totalReports = issues.length;
      const resolvedReports = issues.filter(i => i.status === 'RESOLVED').length;
      const confirmationRate = totalReports > 0 ? resolvedReports / totalReports : 0;
      
      // Time-based trust (more recent activity = higher trust)
      const lastReportDate = issues[0]?.created_at;
      const daysSinceLastReport = lastReportDate ? 
        (Date.now() - new Date(lastReportDate).getTime()) / (1000 * 60 * 60 * 24) 
        : 365;

      const recencyScore = Math.max(0, (365 - daysSinceLastReport) / 365);

      // Calculate final score
      const baseScore = confirmationRate * 0.6 + recencyScore * 0.4;
      
      return Math.min(baseScore * 100, 100);

    } catch (error) {
      console.error('Trust score calculation error:', error);
      return 1.0;
    }
  }
}
