# RPP Auto - Architecture Documentation

## System Overview

RPP Auto implements a **hierarchical multi-agent orchestration architecture** that combines mobile app functionality with intelligent AI agents for vehicle diagnostics and service management.

## Architecture Layers

### 1. Presentation Layer (Mobile App)
- **Technology**: Android (Kotlin)
- **Responsibilities**:
  - User interface rendering
  - User input handling
  - OBD2 hardware communication
  - Local data caching
  - Offline functionality

### 2. Business Logic Layer (AI Agents)
- **Technology**: OpenRouter (Claude 3.5 Sonnet)
- **Components**:
  - Master Orchestrator Agent
  - Specialized Domain Agents
  - Natural Language Processing
  - Intent Recognition
  - Context Management

### 3. Data Layer (Supabase)
- **Technology**: PostgreSQL
- **Responsibilities**:
  - User data persistence
  - Vehicle records management
  - Service history tracking
  - Real-time data synchronization

### 4. Integration Layer
- **Third-Party Services**:
  - Motor DaaS (OBD2 database)
  - Auto.dev (VIN decoding)
  - Google Maps (Location services)
  - Stripe (Payment processing)
  - Resend (Email notifications)

## Multi-Agent Architecture

### Master Orchestrator Agent
**Priority**: Critical  
**Responsibilities**:
- Request routing to specialized agents
- Inter-agent communication coordination
- Context maintenance across conversations
- Fallback mechanism management
- Response aggregation

### Specialized Agents

#### 1. Customer Service Agent
**Priority**: High  
**Capabilities**:
- General inquiries handling
- Account management
- Support ticket creation
- FAQ responses
- Human escalation

#### 2. Diagnostic Agent
**Priority**: High  
**Capabilities**:
- OBD2 code interpretation
- Issue root cause analysis
- Repair recommendations
- Severity assessment
- Historical pattern analysis

#### 3. Booking Agent
**Priority**: High  
**Capabilities**:
- Appointment scheduling
- Service center matching
- Calendar management
- Reminder notifications
- Rescheduling logic

#### 4. Parts Agent
**Priority**: Medium  
**Capabilities**:
- Parts identification
- Compatibility checking
- Price comparison
- Supplier recommendation
- Inventory tracking

#### 5. Analytics Agent
**Priority**: Medium  
**Capabilities**:
- Usage pattern analysis
- Cost trend analysis
- Maintenance predictions
- Report generation
- Dashboard insights

## Data Flow

```
User Input → Mobile App → Master Orchestrator
                                ↓
                     Specialized Agent Selection
                                ↓
              [Customer Service | Diagnostic | Booking | Parts | Analytics]
                                ↓
                        External API Calls
                                ↓
                    Response Synthesis
                                ↓
                    Master Orchestrator
                                ↓
                        Mobile App
                                ↓
                        User Output
```

## Database Schema (High-Level)

### Core Tables
- **users** - User accounts and profiles
- **vehicles** - Vehicle registry
- **diagnostic_sessions** - OBD2 scan records
- **service_appointments** - Booking records
- **parts_orders** - Parts purchase history
- **agents_interactions** - AI conversation logs

### Relationship Structure
- Users → Vehicles (1:N)
- Vehicles → Diagnostic Sessions (1:N)
- Vehicles → Service Appointments (1:N)
- Service Appointments → Parts Orders (1:N)

## Communication Protocols

### Mobile ↔ Backend
- **Protocol**: REST API over HTTPS
- **Format**: JSON
- **Authentication**: JWT tokens
- **Real-time**: WebSocket (Supabase Realtime)

### App ↔ AI Agents
- **Protocol**: HTTP/HTTPS
- **Format**: JSON
- **Model**: Request/Response with streaming

### App ↔ OBD2 Hardware
- **Protocol**: Bluetooth (SPP)
- **Standard**: ELM327 AT commands
- **Format**: ASCII text

## Security Architecture

### Authentication
- **Method**: Supabase Auth (OAuth2, JWT)
- **Session Management**: Secure token refresh
- **MFA**: Optional 2FA support

### Data Protection
- **At Rest**: AES-256 encryption
- **In Transit**: TLS 1.3
- **API Keys**: Environment variable injection
- **PII**: Minimal collection, encrypted storage

### Authorization
- **Model**: Role-based access control (RBAC)
- **Roles**: User, Premium User, Admin, Service Provider

## Scalability Considerations

### Horizontal Scaling
- Stateless backend design
- Agent instance pooling
- Database read replicas
- CDN for static assets

### Performance Optimization
- Response caching (Redis)
- Lazy loading in UI
- Background job processing
- Database query optimization

## Monitoring & Observability

### Application Metrics
- Response time tracking
- Error rate monitoring
- Agent performance metrics
- API usage statistics

### Infrastructure Monitoring
- Database connection pools
- API rate limit tracking
- Storage utilization
- Network latency

### Logging Strategy
- Structured logging (JSON)
- Log aggregation (cloud service)
- Error tracking (Sentry/Firebase Crashlytics)
- Audit trail for sensitive operations

## Disaster Recovery

### Backup Strategy
- **Database**: Daily automated backups
- **Files**: S3-compatible storage with versioning
- **Configuration**: Git-based version control

### Recovery Procedures
- Point-in-time recovery (24-hour window)
- Automated health checks
- Failover mechanisms
- Incident response playbook

## Development Workflow

### Version Control
- **Branching Strategy**: GitFlow
- **Main Branches**: main, develop, feature/*, hotfix/*
- **CI/CD**: GitHub Actions

### Code Quality
- **Linting**: Android Lint + ktlint
- **Testing**: Unit tests, Integration tests, E2E tests
- **Coverage**: Target 80%+
- **Reviews**: Required before merge

---

**Last Updated**: January 13, 2026  
**Version**: 1.0 (Phase 1)