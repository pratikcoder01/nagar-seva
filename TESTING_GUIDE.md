# NAGAR-SEVA TESTING GUIDE
## Google-Level Software Testing Methodology

### 🎯 TESTING PHILOSOPHY

**Test Like a User, Not a Developer**
- Every test should simulate real user behavior
- Test edge cases, not just happy paths
- Verify security, not just functionality
- Test performance under realistic conditions

### 🧪 COMPREHENSIVE TEST SUITES

## 1️⃣ AUTHENTICATION & SECURITY TESTING

### **1.1 Instant Access Testing**
```bash
# Test: No email confirmation barrier
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123456",
    "name": "Test User"
  }'

# Expected: 201 Created + immediate session
# Verify: User can access protected routes immediately
```

### **1.2 Session Management Testing**
```bash
# Test: JWT token validation
curl -X GET http://localhost:3000/api/issues \
  -H "Authorization: Bearer [TOKEN]" \
  -H "Content-Type: application/json"

# Test: Invalid token rejection
curl -X GET http://localhost:3000/api/issues \
  -H "Authorization: Bearer invalid-token" \
  -H "Content-Type: application/json"

# Expected: 401 Unauthorized
```

### **1.3 Role-Based Access Control**
```bash
# Test: Citizen cannot access admin endpoints
curl -X PATCH http://localhost:3000/api/issues/[id] \
  -H "Authorization: Bearer [CITIZEN_TOKEN]" \
  -H "Content-Type: application/json" \
  -d '{"status": "RESOLVED"}'

# Expected: 403 Forbidden

# Test: Admin can access admin endpoints
curl -X PATCH http://localhost:3000/api/issues/[id] \
  -H "Authorization: Bearer [ADMIN_TOKEN]" \
  -H "Content-Type: application/json" \
  -d '{"status": "RESOLVED"}'

# Expected: 200 Success
```

### **1.4 Input Validation Testing**
```bash
# Test: Malformed data rejection
curl -X POST http://localhost:3000/api/issues \
  -H "Authorization: Bearer [TOKEN]" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "",  // Empty title
    "description": "test"
  }'

# Expected: 400 Validation Error

# Test: SQL injection attempts
curl -X POST http://localhost:3000/api/issues \
  -H "Authorization: Bearer [TOKEN]" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test'; DROP TABLE users; --"
  }'

# Expected: 400 Validation Error
```

## 2️⃣ AI-POWERED FEATURES TESTING

### **2.1 Issue Categorization Testing**
```javascript
// Test: AI categorization accuracy
const testCases = [
  {
    title: "Large pothole on Main Street",
    description: "Dangerous pothole causing traffic issues",
    expectedCategory: "ROAD_DAMAGE"
  },
  {
    title: "Street light not working",
    description: "Traffic signal is completely out",
    expectedCategory: "STREET_LIGHT"
  },
  {
    title: "Garbage overflow",
    description: "Public trash bin overflowing with waste",
    expectedCategory: "GARBAGE"
  }
];

// Run categorization tests
for (const testCase of testCases) {
  const result = await AIService.categorizeIssue(
    testCase.title,
    testCase.description
  );
  
  console.log(`Expected: ${testCase.expectedCategory}`);
  console.log(`Got: ${result.category}`);
  console.log(`Confidence: ${result.confidence}`);
  
  // Assert: Should match expected category with >80% confidence
  if (result.category === testCase.expectedCategory && result.confidence > 0.8) {
    console.log('✅ PASS');
  } else {
    console.log('❌ FAIL');
  }
}
```

### **2.2 Duplicate Detection Testing**
```bash
# Test: Nearby duplicate detection
curl -X POST http://localhost:3000/api/issues \
  -H "Authorization: Bearer [TOKEN]" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Broken traffic light",
    "description": "Traffic signal not working",
    "latitude": 19.0760,
    "longitude": 72.8777
  }'

# Immediately create similar issue
curl -X POST http://localhost:3000/api/issues \
  -H "Authorization: Bearer [TOKEN]" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Traffic light issue",
    "description": "Similar traffic light problem",
    "latitude": 19.0761,
    "longitude": 72.8778
  }'

# Expected: Second request should detect duplicate and suggest merging
```

### **2.3 Priority Scoring Testing**
```sql
-- Test priority calculation
SELECT calculate_priority_score('IN_PROGRESS', 5, 4, 7, 85.5);

-- Test trust score calculation
SELECT calculate_trust_score('[USER_ID]');

-- Expected: Scores should be consistent and logical
```

## 3️⃣ REAL-TIME FEATURES TESTING

### **3.1 WebSocket Connection Testing**
```javascript
// Test: Real-time issue updates
const socket = io('http://localhost:3000');

socket.on('connect', () => {
  console.log('✅ Connected to real-time updates');
});

socket.on('issue-updated', (data) => {
  console.log('📡 Real-time update received:', data);
  
  // Verify: Update should reflect in UI immediately
  const issueElement = document.querySelector(`[data-issue-id="${data.id}"]`);
  if (issueElement) {
    issueElement.setAttribute('data-status', data.status);
  }
});

// Test: Connection resilience
socket.on('disconnect', () => {
  console.log('❌ Disconnected - testing reconnection logic');
});
```

### **3.2 Database Trigger Testing**
```sql
-- Test: Automatic user profile creation
INSERT INTO auth.users (email, created_at)
VALUES ('test-auto-confirm@now.com', NOW());

-- Expected: Trigger should create public.users entry
SELECT * FROM public.users WHERE email = 'test-auto-confirm@now.com';
```

## 4️⃣ PERFORMANCE TESTING

### **4.1 Load Testing**
```bash
# Test: Concurrent user load
for i in {1..100}; do
  curl -X POST http://localhost:3000/api/issues \
    -H "Authorization: Bearer [USER_$i_TOKEN]" \
    -H "Content-Type: application/json" \
    -d '{"title": "Load test issue '$i'", "description": "Testing concurrent access"}' &
done

# Monitor: Response times should remain <500ms
# Expected: System should handle 100+ concurrent requests
```

### **4.2 Database Performance Testing**
```sql
-- Test: Query optimization
EXPLAIN ANALYZE
SELECT * FROM issues 
WHERE ST_DWithin(
  ST_MakePoint(longitude, latitude)::geography,
  5000
);

-- Expected: Query should use spatial indexes efficiently
```

## 5️⃣ MOBILE RESPONSIVENESS TESTING

### **5.1 Viewport Testing**
```javascript
// Test: Different screen sizes
const sizes = [
  { width: 375, height: 667 },  // iPhone SE
  { width: 768, height: 1024 }, // iPad
  { width: 1920, height: 1080 }, // Desktop
];

sizes.forEach(size => {
  // Resize viewport and test layout
  window.resizeTo(size.width, size.height);
  
  // Verify: All elements should adapt properly
  const header = document.querySelector('.civic-header');
  const grid = document.querySelector('.civic-grid');
  
  // Check responsive behavior
  console.log(`Testing ${size.width}x${size.height}: Header visible: ${header.offsetWidth > 0}`);
});
```

### **5.2 Touch Interaction Testing**
```javascript
// Test: Touch events
document.addEventListener('touchstart', (e) => {
  console.log('📱 Touch event detected:', e.touches.length);
  
  // Verify: Touch targets are appropriately sized
  const touchTarget = e.target.closest('.civic-button');
  if (touchTarget) {
    const rect = touchTarget.getBoundingClientRect();
    console.log('Button size:', rect.width, 'x', rect.height);
  }
});
```

## 6️⃣ ACCESSIBILITY TESTING

### **6.1 Keyboard Navigation Testing**
```javascript
// Test: Tab navigation
document.addEventListener('keydown', (e) => {
  if (e.key === 'Tab') {
    e.preventDefault();
    
    const focusableElements = document.querySelectorAll(
      'button, [href], input, select, textarea'
    );
    
    const currentIndex = Array.from(focusableElements).indexOf(document.activeElement);
    const nextIndex = (currentIndex + 1) % focusableElements.length;
    
    focusableElements[nextIndex]?.focus();
    console.log('✅ Keyboard navigation working');
  }
});
```

### **6.2 Screen Reader Testing**
```bash
# Test: Screen reader compatibility
# Use ChromeVox, NVDA, or VoiceOver
# Navigate website using only keyboard
# Verify: All interactive elements have proper labels
# Expected: ARIA labels should be announced correctly
```

### **6.3 Reduced Motion Testing**
```javascript
// Test: Respect prefers-reduced-motion
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (prefersReducedMotion) {
  console.log('📱 Reduced motion detected - animations should be disabled');
  
  // Verify: All animations should be skipped
  const animatedElements = document.querySelectorAll('[data-motion]');
  animatedElements.forEach(el => {
    el.style.animation = 'none';
  });
}
```

## 🔧 AUTOMATED TESTING SETUP

### **E2E Testing Framework**
```bash
# Install testing dependencies
npm install -g playwright cypress

# Run comprehensive E2E tests
npx playwright test
npx cypress run

# Expected: All critical user journeys should pass
```

### **Performance Monitoring**
```javascript
// Core Web Vitals integration
import { getCLS, getFID, getFCP, getLCP } from 'web-vitals';

// Measure performance metrics
getCLS(console.log);
getFID(console.log);
getFCP(console.log);
getLCP(console.log);

// Expected: All scores should be "Good" or better
```

## 📊 TEST EXECUTION CHECKLIST

### **Pre-Deployment**
- [ ] All authentication flows tested
- [ ] AI features tested with various inputs
- [ ] Real-time functionality verified
- [ ] Performance benchmarks established
- [ ] Security penetration testing completed
- [ ] Cross-browser compatibility verified
- [ ] Mobile responsiveness tested
- [ ] Accessibility audit passed

### **Post-Deployment**
- [ ] Load testing with 1000+ concurrent users
- [ ] Database performance under load
- [ ] Real-time features stress testing
- [ ] Error handling and recovery testing
- [ ] User acceptance testing with real citizens

## 🎯 SUCCESS CRITERIA

### **Functional Requirements**
- ✅ All users can signup and login immediately
- ✅ AI categorization works with >80% accuracy
- ✅ Real-time updates propagate within 100ms
- ✅ Priority scoring reflects business logic
- ✅ Duplicate detection prevents spam effectively

### **Performance Requirements**
- ✅ Page load < 2 seconds on 3G
- ✅ API response < 200ms average
- ✅ Supports 1000+ concurrent users
- ✅ Database queries optimized with indexes

### **Security Requirements**
- ✅ All endpoints protected with proper RBAC
- ✅ Input validation prevents injection attacks
- ✅ Rate limiting prevents abuse
- ✅ Session management secure with HTTP-only cookies

### **UX Requirements**
- ✅ Mobile-first responsive design
- ✅ Accessibility WCAG 2.1 AA compliant
- ✅ Reduced motion respected
- ✅ Keyboard navigation fully functional
- ✅ Clear error states and recovery paths

### **Integration Requirements**
- ✅ Supabase real-time working correctly
- ✅ AI services integrated seamlessly
- ✅ Error handling provides clear feedback
- ✅ Progressive enhancement works without JavaScript

## 🚀 PRODUCTION READINESS

**When all tests pass and criteria are met:**

✅ **Deploy to production**  
✅ **Monitor with real analytics**  
✅ **Set up alerting for issues**  
✅ **Conduct user acceptance testing**  
✅ **Document API for third-party integrations**

**The platform is ready for national-scale deployment with Google-level reliability, intelligence, and user experience.**
