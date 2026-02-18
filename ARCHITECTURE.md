# NAGAR-SEVA: COMPOSABLE CIVIC PLATFORM ARCHITECTURE

## 🏗️ ARCHITECTURE PHILOSOPHY

**"Make it work, then make it better"**
- Modular components with clear contracts
- Plugin-based extensibility without core bloat
- Microservices for independent scaling
- Configuration-driven feature management
- Zero-downtime deployments

## 🧱 COMPOSABLE SYSTEM DESIGN

### Core Principles
1. **Single Responsibility**: Each module has one clear purpose
2. **Loose Coupling**: Components communicate via well-defined interfaces
3. **High Cohesion**: Related functionality grouped together
4. **Open/Closed Principle**: Extensible without modification to core
5. **Dependency Inversion**: Depend on abstractions, not concretions

## 📁 MODULAR ARCHITECTURE

```
nagar-seva/
├── packages/                    # Reusable packages
│   ├── @nagar-seva/ui/         # UI component library
│   ├── @nagar-seva/auth/        # Authentication system
│   ├── @nagar-seva/issues/      # Issue management
│   ├── @nagar-seva/admin/       # Admin dashboard
│   └── @nagar-seva/analytics/   # Analytics engine
├── apps/                        # Application instances
│   ├── web/                   # Main web application
│   ├── mobile/                # React Native mobile app
│   ├── admin/                 # Admin dashboard
│   └── citizen/              # Citizen mobile app
├── services/                    # Backend services
│   ├── auth-service/          # Authentication microservice
│   ├── issue-service/         # Issue management microservice
│   ├── notification-service/  # Real-time notifications
│   └── analytics-service/      # Analytics processing
├── shared/                      # Shared utilities
│   ├── types/                # TypeScript definitions
│   ├── utils/                # Common utilities
│   └── config/               # Configuration management
├── infrastructure/              # DevOps and deployment
│   ├── docker/                # Container configurations
│   ├── kubernetes/           # K8s manifests
│   └── monitoring/           # Observability setup
└── docs/                       # Documentation
    ├── api/                   # API documentation
    ├── components/            # Component docs
    └── deployment/            # Deployment guides
```

## 🔌 PLUGIN SYSTEM

### Plugin Architecture
```typescript
// packages/plugin-system/src/types.ts
export interface Plugin {
  id: string;
  name: string;
  version: string;
  description: string;
  author: string;
  dependencies: string[];
  permissions: PluginPermission[];
  hooks: PluginHook[];
  config: PluginConfig;
}

export interface PluginHook {
  name: string;
  handler: (context: PluginContext) => Promise<any>;
}

export enum PluginPermission {
  READ_ISSUES = 'read_issues',
  WRITE_ISSUES = 'write_issues',
  READ_USERS = 'read_users',
  ADMIN_ACCESS = 'admin_access',
  ANALYTICS = 'analytics'
}

export interface PluginContext {
  user: any;
  config: any;
  services: any;
}
```

### Plugin Examples
```typescript
// packages/plugins/whatsapp-integration/plugin.ts
export const whatsappPlugin: Plugin = {
  id: 'whatsapp-integration',
  name: 'WhatsApp Integration',
  version: '1.0.0',
  description: 'Send issue updates via WhatsApp',
  author: 'Nagar Seva Team',
  dependencies: ['@nagar-seva/notifications'],
  permissions: [PluginPermission.READ_ISSUES, PluginPermission.NOTIFICATIONS],
  hooks: [
    {
      name: 'issue.created',
      handler: async (context) => {
        await context.services.notifications.sendWhatsApp(
          context.user.phone,
          `New issue: ${context.issue.title}`
        );
      }
    }
  ]
};

// packages/plugins/advanced-analytics/plugin.ts
export const analyticsPlugin: Plugin = {
  id: 'advanced-analytics',
  name: 'Advanced Analytics',
  version: '2.0.0',
  description: 'Advanced analytics with custom dashboards',
  author: 'Analytics Team',
  permissions: [PluginPermission.ANALYTICS],
  config: {
    customMetrics: ['engagement_rate', 'resolution_time'],
    dashboards: ['area_health', 'performance_metrics']
  }
};
```

## 🎨 COMPONENT LIBRARY

### Atomic Design System
```typescript
// packages/ui/src/components/Button/Button.tsx
export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Button = ({ 
  variant = 'primary', 
  size = 'md', 
  loading = false, 
  icon, 
  fullWidth = false,
  children,
  ...props 
}: ButtonProps) => {
  const baseClasses = 'civic-button';
  const variantClasses = {
    primary: 'bg-civic-primary-600 hover:bg-civic-primary-700',
    secondary: 'bg-civic-secondary-600 hover:bg-civic-secondary-700',
    outline: 'border border-neutral-300'
  };

  return (
    <motion.button
      className={`${baseClasses} ${variantClasses[variant]} ${
        size === 'sm' ? 'px-3 py-2 text-sm' :
        size === 'lg' ? 'px-6 py-4 text-lg' :
        'px-4 py-3 text-base'
      } ${fullWidth ? 'w-full' : ''}`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
      {...props}
    >
      {loading ? (
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-civic-primary-600 border-t-transparent" />
        </div>
      ) : (
        <>
          {icon && <span className="mr-2">{icon}</span>}
          {children}
        </>
      )}
    </motion.button>
  );
};
```

### Theme System
```typescript
// packages/ui/src/theme/index.ts
export interface Theme {
  colors: {
    primary: string;
    secondary: string;
    neutral: string;
    success: string;
    warning: string;
    error: string;
  };
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
  };
  typography: {
    fontFamily: string;
    fontSize: Record<string, string>;
  };
  borderRadius: {
    sm: string;
    md: string;
    lg: string;
  };
}

export const civicTheme: Theme = {
  colors: {
    primary: '#2563eb',
    secondary: '#16a34a',
    neutral: '#6b7280',
    success: '#22c55e',
    warning: '#f59e0b',
    error: '#ef4444'
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem'
  },
  typography: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      md: '1rem',
      lg: '1.125rem'
    }
  },
  borderRadius: {
    sm: '0.375rem',
    md: '0.5rem',
    lg: '0.75rem'
  }
};
```

## ⚙️ CONFIGURATION MANAGEMENT

### Environment-Based Configuration
```typescript
// shared/config/index.ts
export interface AppConfig {
  app: {
    name: string;
    version: string;
    environment: 'development' | 'staging' | 'production';
  };
  database: {
    url: string;
    pool: {
      min: number;
      max: number;
    };
  };
  features: {
    plugins: {
      enabled: string[];
      config: Record<string, any>;
    };
    ai: {
      enabled: boolean;
      models: {
        categorization: string;
        priority: string;
      analytics: string;
      };
    };
  };
  integrations: {
    whatsapp: {
      enabled: boolean;
      apiKey?: string;
      webhookUrl?: string;
    };
    sms: {
      enabled: boolean;
      provider: string;
      apiKey?: string;
    };
  };
  };
}

// Dynamic configuration loader
export const loadConfig = (): AppConfig => {
  const env = process.env.NODE_ENV || 'development';
  
  const baseConfig: AppConfig = {
    app: {
      name: 'Nagar Seva',
      version: '2.0.0',
      environment: env
    },
    database: {
      url: process.env.DATABASE_URL!,
      pool: {
        min: env === 'production' ? 10 : 2,
        max: env === 'production' ? 50 : 10
      }
    },
    features: {
      plugins: {
        enabled: (process.env.ENABLED_PLUGINS || '').split(','),
        config: JSON.parse(process.env.PLUGIN_CONFIG || '{}')
      },
      ai: {
        enabled: process.env.AI_ENABLED === 'true',
        models: {
          categorization: process.env.AI_CATEGORIZATION_MODEL || 'gpt-4',
          priority: process.env.AI_PRIORITY_MODEL || 'custom',
          analytics: process.env.AI_ANALYTICS_MODEL || 'mixpanel'
        }
      },
      integrations: {
        whatsapp: {
          enabled: process.env.WHATSAPP_ENABLED === 'true',
          apiKey: process.env.WHATSAPP_API_KEY,
          webhookUrl: process.env.WHATSAPP_WEBHOOK_URL
        },
        sms: {
          enabled: process.env.SMS_ENABLED === 'true',
          provider: process.env.SMS_PROVIDER || 'twilio'
        }
      }
    }
  };

  // Environment-specific overrides
  if (env === 'development') {
    baseConfig.features.debug = true;
    baseConfig.database.ssl = false;
  }

  return baseConfig;
};
```

## 🚀 MICROSERVICES ARCHITECTURE

### Service Boundaries
```typescript
// services/auth-service/src/index.ts
export class AuthService {
  async authenticate(token: string): Promise<User>;
  async authorize(permission: string, context: AuthContext): Promise<boolean>;
  async generateToken(user: User): Promise<string>;
}

// services/issue-service/src/index.ts
export class IssueService {
  async createIssue(data: CreateIssueData): Promise<Issue>;
  async updateIssue(id: string, data: UpdateIssueData): Promise<Issue>;
  async getIssues(filters: IssueFilters): Promise<PaginatedResult<Issue>>;
  async assignIssue(id: string, assignee: string): Promise<void>;
}

// services/notification-service/src/index.ts
export class NotificationService {
  async sendNotification(userId: string, notification: Notification): Promise<void>;
  async sendBulkNotifications(userIds: string[], notification: Notification): Promise<void>;
  async getNotifications(userId: string): Promise<Notification[]>;
}
```

### API Gateway Pattern
```typescript
// shared/api-gateway/src/index.ts
export class APIGateway {
  private services: Map<string, ServiceInterface>;
  
  constructor() {
    this.services = new Map();
    this.loadServices();
  }

  private async loadServices(): Promise<void> {
    const serviceConfigs = await this.discoverServices();
    
    for (const config of serviceConfigs) {
      const service = await this.createService(config);
      this.services.set(config.name, service);
    }
  }

  async routeRequest(path: string, request: any): Promise<any> {
    const [serviceName, ...pathParts] = path.split('.');
    const service = this.services.get(serviceName);
    
    if (!service) {
      throw new Error(`Service ${serviceName} not found`);
    }

    return service.handleRequest(pathParts.join('.'), request);
  }
}
```

## 🔧 DEPLOYMENT INFRASTRUCTURE

### Docker Compose
```yaml
# docker-compose.yml
version: '3.8'

services:
  # API Gateway
  api-gateway:
    build: ./apps/web
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=${DATABASE_URL}
    depends_on:
      - redis
      - postgres

  # Authentication Service
  auth-service:
    build: ./services/auth-service
    environment:
      - NODE_ENV=production
      - JWT_SECRET=${JWT_SECRET}
    depends_on:
      - postgres

  # Issue Service
  issue-service:
    build: ./services/issue-service
    environment:
      - NODE_ENV=production
      - DATABASE_URL=${DATABASE_URL}
    depends_on:
      - postgres

  # Notification Service
  notification-service:
    build: ./services/notification-service
    environment:
      - NODE_ENV=production
      - REDIS_URL=${REDIS_URL}
    depends_on:
      - redis

  # Database
  postgres:
    image: postgres:15
    environment:
      - POSTGRES_DB=${POSTGRES_DB}
      - POSTGRES_USER=${POSTGRES_USER}
      - POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  # Cache
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

  # Monitoring
  prometheus:
    image: prom/prometheus
    ports:
      - "9090:9090"
    volumes:
      - ./infrastructure/monitoring/prometheus.yml:/etc/prometheus

  grafana:
    image: grafana/grafana
    ports:
      - "3001:3000"
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=${GRAFANA_PASSWORD}
    volumes:
      - grafana_data:/var/lib/grafana
```

### Kubernetes Deployment
```yaml
# infrastructure/k8s/namespace.yaml
apiVersion: v1
kind: Namespace
metadata:
  name: nagar-seva
---
# infrastructure/k8s/deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nagar-seva-web
spec:
  replicas: 3
  selector:
    matchLabels:
      app: nagar-seva-web
  template:
    metadata:
      labels:
        app: nagar-seva-web
    spec:
      containers:
      - name: web
        image: nagar-seva/web:latest
        ports:
          - containerPort: 3000
        env:
          - NODE_ENV: production
          - DATABASE_URL: ${DATABASE_URL}
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
```

## 📊 MONITORING & OBSERVABILITY

### Health Checks
```typescript
// shared/monitoring/health-checks.ts
export class HealthChecker {
  async checkServiceHealth(serviceName: string): Promise<ServiceHealth> {
    const startTime = Date.now();
    
    try {
      const response = await fetch(`${process.env.SERVICE_URL}/${serviceName}/health`);
      const data = await response.json();
      
      return {
        status: response.ok ? 'healthy' : 'unhealthy',
        responseTime: Date.now() - startTime,
        timestamp: new Date().toISOString(),
        details: data
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        responseTime: Date.now() - startTime,
        timestamp: new Date().toISOString(),
        error: error.message
      };
    }
  }
}
```

### Metrics Collection
```typescript
// shared/monitoring/metrics.ts
export class MetricsCollector {
  private metrics: Map<string, number> = new Map();
  
  recordMetric(name: string, value: number, tags?: Record<string, string>): void {
    this.metrics.set(name, value);
    
    // Send to monitoring service
    this.sendToMonitoring({
      metric: name,
      value,
      timestamp: new Date().toISOString(),
      tags
    });
  }

  getMetrics(): Record<string, number> {
    return Object.fromEntries(this.metrics);
  }
}
```

## 🔄 CI/CD PIPELINE

### Automated Testing
```yaml
# .github/workflows/test.yml
name: Test Suite
on: [push, pull_request]

jobs:
  unit-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      - name: Install dependencies
        run: npm ci
      - name: Run tests
        run: npm test
      - name: Upload coverage
        uses: codecov/codecov-action@v3

  integration-tests:
    runs-on: ubuntu-latest
    needs: unit-tests
    steps:
      - name: Deploy to staging
        run: npm run deploy:staging
      - name: Run integration tests
        run: npm run test:integration
```

### Blue-Green Deployments
```bash
#!/bin/bash
# deploy.sh
set -e

# Deploy to staging
echo "🟡 Deploying to staging..."
npm run deploy:staging

# Run health checks
npm run health-check:staging

# Deploy to production if healthy
if [ $? -eq 0 ]; then
    echo "🟢 Deploying to production..."
    npm run deploy:production
    
    # Run production health checks
    npm run health-check:production
else
    echo "❌ Staging deployment failed"
    exit 1
fi
```

## 🎯 FEATURE FLAGS SYSTEM

### Dynamic Feature Management
```typescript
// shared/feature-flags/src/index.ts
export class FeatureFlagService {
  private flags: Map<string, boolean> = new Map();
  
  async loadFlags(): Promise<void> {
    const response = await fetch('/api/feature-flags');
    const flags = await response.json();
    
    this.flags = new Map(Object.entries(flags));
  }

  isEnabled(flag: string, userId?: string): boolean {
    // Check user-specific flags
    if (userId && this.flags.has(`${flag}:${userId}`)) {
      return this.flags.get(`${flag}:${userId}`);
    }
    
    // Check global flag
    return this.flags.get(flag) || false;
  }

  setFlag(flag: string, value: boolean): void {
    this.flags.set(flag, value);
    // Persist to database
    this.persistFlag(flag, value);
  }
}
```

## 📚 DOCUMENTATION SYSTEM

### Auto-Generated API Docs
```typescript
// scripts/generate-docs.ts
export class DocumentationGenerator {
  async generateAPIDocumentation(): Promise<void> {
    const services = await this.discoverServices();
    
    for (const service of services) {
      await this.generateServiceDocs(service);
    }
  }
  
  private async generateServiceDocs(service: ServiceConfig): Promise<void> {
    const docs = this.extractAPIDefinitions(service);
    await this.generateMarkdownDocs(docs);
    await this.generateOpenAPISpec(docs);
  }
}
```

## 🚀 ZERO-DOWNTIME DEPLOYMENT

### Rolling Updates
```bash
#!/bin/bash
# rolling-update.sh
set -e

echo "🔄 Starting rolling update..."

# Update one service at a time
for service in auth-service issue-service notification-service; do
    echo "Updating $service..."
    docker-compose up -d --no-deps $service
    docker-compose up -d --no-deps api-gateway
    sleep 30
    
    # Health check
    if npm run health-check:$service; then
        echo "✅ $service updated successfully"
    else
        echo "❌ $service update failed - rolling back"
        docker-compose rollback $service
        exit 1
    fi
done

echo "✅ Rolling update completed"
```

## 🎯 COMPOSABILITY BENEFITS

### For Developers
- **Modular Development**: Work on individual packages
- **Independent Testing**: Test services in isolation
- **Selective Updates**: Update only what changes
- **Plugin Ecosystem**: Extend functionality without core changes

### For Operations
- **Scalable Deployments**: Scale individual services
- **Fault Isolation**: Issues in one service don't affect others
- **Resource Optimization**: Right-size each service
- **Monitoring**: Granular visibility into each component

### For Municipalities
- **Custom Plugins**: Add city-specific features
- **Multi-Tenant**: Serve multiple cities from one platform
- **Integration APIs**: Connect with existing government systems
- **Analytics**: Per-city and aggregated insights

## 🏆 IMPLEMENTATION ROADMAP

This architecture enables NAGAR-SEVA to evolve from a monolithic application to a **composable civic ecosystem** that can:
- Scale horizontally across services
- Add new features via plugins
- Deploy updates without downtime
- Support multiple municipalities from single platform
- Adapt to different regional requirements
- Provide enterprise-grade reliability and performance

**The platform becomes infinitely more valuable as each new plugin and municipality joins the ecosystem.**
