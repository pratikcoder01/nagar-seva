-- ========================================
-- AI-POWERED FEATURES FOR NAGAR-SEVA
-- ========================================

-- 1. AI CATEGORIZATION FUNCTION
CREATE OR REPLACE FUNCTION ai_categorize_issue(
  title_input TEXT,
  description_input TEXT,
  image_url TEXT DEFAULT NULL
)
RETURNS TABLE(
  category TEXT,
  confidence DECIMAL,
  keywords TEXT[]
) AS $$
DECLARE
  category_keywords JSONB DEFAULT '{
    "ROAD_DAMAGE": ["pothole", "crack", "road", "street", "damage", "repair", "asphalt", "traffic"],
    "STREET_LIGHT": ["light", "street", "lamp", "dark", "broken", "flicker", "outage"],
    "GARBAGE": ["garbage", "trash", "dump", "waste", "overflow", "cleaning"],
    "WATER_SUPPLY": ["water", "leak", "pipe", "supply", "shortage", "pressure"],
    "ELECTRICITY": ["power", "electricity", "outage", "wire", "pole", "transformer"],
    "PUBLIC_TOILET": ["toilet", "restroom", "sanitation", "clean", "dirty", "broken"],
    "PARK_MAINTENANCE": ["park", "garden", "grass", "playground", "equipment", "bench"],
    "TRAFFIC_SIGNAL": ["signal", "traffic", "light", "intersection", "accident"]
  }';

  combined_text TEXT := title_input || ' ' || COALESCE(description_input, '');
  best_category TEXT := 'ROAD_DAMAGE';
  best_score INTEGER := 0;
  confidence_score DECIMAL := 0.5;

  -- Keyword matching
  FOR category_record IN SELECT * FROM jsonb_each_text(category_keywords)
  LOOP
    DECLARE
      category TEXT := category_record.key;
      keywords TEXT[] := category_record.value;
    END LOOP;
    
    DECLARE
      keyword_count INTEGER := 0;
    BEGIN
      FOR keyword IN SELECT unnest(keywords) AS keyword
      LOOP
        keyword_count := keyword_count + 
          CASE 
            WHEN POSITION(keyword IN combined_text) > 0 THEN 1
            ELSE 0
          END;
      END LOOP;
    END LOOP;

    -- Update best match
    IF keyword_count > best_score THEN
      best_category := category;
      best_score := keyword_count;
    END IF;
  END LOOP;

  -- Image analysis (simplified)
  IF image_url IS NOT NULL THEN
    FOR category_record IN SELECT * FROM jsonb_each_text(category_keywords)
    LOOP
      category TEXT := category_record.key;
      patterns TEXT[] := category_record.value;
      
      DECLARE
        pattern_count INTEGER := 0;
      BEGIN
        FOR pattern IN SELECT unnest(patterns) AS pattern
        LOOP
          IF image_url ILIKE '%' || pattern || '%' THEN
            pattern_count := pattern_count + 5; -- Weight image matches higher
          END IF;
        END LOOP;
      END LOOP;
      
      IF pattern_count > best_score THEN
        best_category := category;
        best_score := pattern_count;
        confidence_score := 0.8; -- Higher confidence for image matches
      END IF;
    END LOOP;
  END IF;

  -- Return result
  RETURN QUERY SELECT 
    best_category::TEXT AS category,
    LEAST(confidence_score, 0.95) AS confidence,
    (
      SELECT array_agg(keyword) 
      FROM jsonb_each_text(category_keywords) 
      WHERE key = best_category
      LIMIT 3
    ) AS keywords;

$$ LANGUAGE plpgsql IMMUTABLE;

-- 2. NEARBY ISSUES FUNCTION
CREATE OR REPLACE FUNCTION find_nearby_issues(
  lat DECIMAL,
  lng DECIMAL,
  radius_km DECIMAL DEFAULT 0.01,
  search_title TEXT DEFAULT NULL,
  search_description TEXT DEFAULT NULL
)
RETURNS TABLE(
  id UUID,
  similarity DECIMAL,
  distance DECIMAL
) AS $$
DECLARE
  results RECORD[];
  
  -- Find issues within radius
  FOR issue_record IN 
    SELECT 
      id, 
      title, 
      description,
      -- Simple text similarity calculation
      CASE 
        WHEN search_title IS NOT NULL THEN 
          GREATEST(
            similarity(issue.title, search_title),
            similarity(issue.description, search_description)
          )
        ELSE similarity(issue.description, search_description)
      END AS similarity
    FROM issues 
    WHERE 
      ST_DWithin(
        ST_MakePoint(lng, lat)::geography,
        ST_MakePoint(longitude, latitude)::geography,
        radius_km * 1000
      )
  LOOP
    -- Add to results if similarity > 0.3
    IF issue_record.similarity > 0.3 THEN
      results := array_append(results, issue_record);
    END IF;
  END LOOP;

  -- Return sorted results
  RETURN QUERY SELECT * FROM unnest(results) ORDER BY similarity DESC, distance ASC LIMIT 10;

$$ LANGUAGE plpgsql IMMUTABLE;

-- 3. AREA DENSITY CALCULATION
CREATE OR REPLACE FUNCTION calculate_area_density(
  lat DECIMAL,
  lng DECIMAL,
  radius_km DECIMAL DEFAULT 0.5
)
RETURNS TABLE(
  density DECIMAL,
  nearby_issues INTEGER,
  area_type TEXT
) AS $$
DECLARE
  total_issues INTEGER;
  residential_areas DECIMAL := 0;
  commercial_areas DECIMAL := 0;
  industrial_areas DECIMAL := 0;

  -- Count issues in area
  SELECT COUNT(*) INTO total_issues 
  FROM issues 
  WHERE ST_DWithin(
    ST_MakePoint(lng, lat)::geography,
    ST_MakePoint(longitude, latitude)::geography,
    radius_km * 1000
  );

  -- Simplified area classification (in real implementation, use GIS data)
  SELECT 
    COUNT(*) INTO residential_areas,
    COUNT(*) INTO commercial_areas,
    COUNT(*) INTO industrial_areas
  FROM issues 
  WHERE ST_DWithin(
    ST_MakePoint(lng, lat)::geography,
    ST_MakePoint(longitude, latitude)::geography,
    radius_km * 1000
  )
  AND (
    (title ILIKE '%residential%' OR description ILIKE '%residential%') OR
    (title ILIKE '%commercial%' OR description ILIKE '%commercial%') OR
    (title ILIKE '%industrial%' OR description ILIKE '%industrial%')
  );

  RETURN QUERY SELECT 
    CASE 
      WHEN residential_areas > commercial_areas AND residential_areas > industrial_areas THEN 'residential'
      WHEN commercial_areas > residential_areas AND commercial_areas > industrial_areas THEN 'commercial'
      WHEN industrial_areas > residential_areas AND industrial_areas > commercial_areas THEN 'industrial'
      ELSE 'mixed'
    END AS area_type,
    LEAST(total_issues / 10.0, 1.0) AS density,
    total_issues AS nearby_issues;

$$ LANGUAGE plpgsql IMMUTABLE;

-- 4. PRIORITY SCORING FUNCTION
CREATE OR REPLACE FUNCTION calculate_priority_score(
  severity_input TEXT,
  reports_count INTEGER DEFAULT 1,
  area_importance INTEGER DEFAULT 3,
  days_unresolved INTEGER DEFAULT 1,
  user_trust_score DECIMAL DEFAULT 1.0
)
RETURNS DECIMAL AS $$
DECLARE
  severity_weight DECIMAL := 0.4;
  reports_weight DECIMAL := 0.2;
  area_weight DECIMAL := 0.2;
  time_weight DECIMAL := 0.15;
  trust_weight DECIMAL := 0.05;

  severity_score DECIMAL;
  reports_score DECIMAL;
  area_score DECIMAL;
  time_score DECIMAL;
  trust_score DECIMAL;

BEGIN
  -- Normalize severity (1-5 scale)
  severity_score := CASE severity_input
    WHEN 'REPORTED' THEN 1
    WHEN 'ASSIGNED' THEN 2
    WHEN 'IN_PROGRESS' THEN 3
    WHEN 'RESOLVED' THEN 4
    ELSE 1
  END;

  -- Calculate weighted components
  reports_score := LEAST(reports_count / 10.0, 1.0) * reports_weight;
  area_score := (area_importance / 5.0) * area_weight;
  time_score := LEAST(days_unresolved / 30.0, 1.0) * time_weight;
  trust_score := (user_trust_score / 100.0) * trust_weight;

  RETURN ROUND((severity_score + reports_score + area_score + time_score + trust_score) * 100);

$$ LANGUAGE plpgsql IMMUTABLE;

-- 5. CITIZEN TRUST SCORE CALCULATION
CREATE OR REPLACE FUNCTION calculate_trust_score(
  user_id UUID
)
RETURNS DECIMAL AS $$
DECLARE
  total_reports INTEGER;
  resolved_reports INTEGER;
  confirmation_rate DECIMAL;
  recency_score DECIMAL;
  base_score DECIMAL;

BEGIN
  -- Get user's reporting history
  SELECT COUNT(*) INTO total_reports, 
         COUNT(*) FILTER (WHERE status = 'RESOLVED') INTO resolved_reports
  FROM issues 
  WHERE user_id = calculate_trust_score.user_id;

  -- Calculate confirmation rate
  confirmation_rate := CASE 
    WHEN total_reports > 0 THEN resolved_reports::DECIMAL / total_reports::DECIMAL
    ELSE 0
  END;

  -- Calculate recency score (more recent = higher score)
  SELECT 
    EXTRACT(EPOCH FROM (MAX(created_at) - INTERVAL '30 days')) INTO recency_score
  FROM issues 
  WHERE user_id = calculate_trust_score.user_id;

  -- Base score from confirmation rate
  base_score := confirmation_rate * 0.6 + recency_score * 0.4;

  RETURN LEAST(base_score * 100, 100);

$$ LANGUAGE plpgsql IMMUTABLE;

-- 6. INDEXES FOR PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_issues_location ON issues USING GIST (
  ST_MakePoint(longitude, latitude)::geography
);

CREATE INDEX IF NOT EXISTS idx_issues_status_priority ON issues (
  status, 
  (calculate_priority_score(status, 1, 3, 1, calculate_trust_score(user_id)) DESC
);

CREATE INDEX IF NOT EXISTS idx_issues_user_status ON issues (
  user_id, 
  status, 
  created_at DESC
);

-- ========================================
-- USAGE EXAMPLES
-- ========================================

-- AI Categorization:
-- SELECT ai_categorize_issue('Pothole on Main Street', 'Large pothole causing traffic issues', 'https://example.com/image.jpg');

-- Duplicate Detection:
-- SELECT * FROM find_nearby_issues(19.0760, 72.8777, 0.01, 'Street Light Issue');

-- Priority Scoring:
-- SELECT calculate_priority_score('IN_PROGRESS', 5, 4, 7, 85.5);

-- Trust Score:
-- SELECT calculate_trust_score(user_id);

-- Area Density:
-- SELECT * FROM calculate_area_density(19.0760, 72.8777, 0.5);

-- ========================================
-- PERFORMANCE NOTES
-- ========================================
-- All functions are optimized for PostgreSQL
-- Use IMMUTABLE for better performance
-- Appropriate indexes for spatial queries
-- Consider materialized views for complex analytics
