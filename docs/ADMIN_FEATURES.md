# 👤 Admin Features Documentation - RPP Auto

## Overview

Comprehensive admin and analytics features for monitoring, managing, and optimizing the RPP Auto mobile application.

---

## Features

### 1. Admin Dashboard

**Location**: `src/screens/admin/AdminDashboardScreen.tsx`

**Capabilities**:
- System health monitoring
- Real-time metrics visualization
- Agent performance tracking
- Error monitoring
- Quick action shortcuts

**Key Metrics**:
- Total Requests
- Active Users
- Average Response Time
- Error Rate
- Agent Performance Stats

**Time Periods**:
- Last Hour
- Last Day
- Last Week

---

### 2. Analytics System

**Location**: `src/services/analyticsService.ts`

**Event Tracking**:
```typescript
// Screen views
analyticsService.trackScreenView('diagnostic_screen', userId);

// User actions
analyticsService.trackAction('scan_vehicle', { vehicleId }, userId);

// Errors
analyticsService.trackError('api_error', errorDetails, userId);

// Performance
analyticsService.trackPerformance('api_latency', 150, 'ms');

// Agent interactions
analyticsService.trackAgentInteraction(
  'diagnostic',
  'diagnosis',
  2500,
  true,
  userId
);
```

**Supported Event Types**:
- `user_action` - User-initiated actions
- `system_event` - System-generated events
- `error` - Error occurrences
- `performance` - Performance metrics

**Data Storage**:
- Events buffered in memory queue
- Auto-flush every 30 seconds
- Persisted to Supabase `analytics_events` table
- Firebase Analytics integration

---

### 3. Reporting System

**Location**: `src/services/reportingService.ts`

#### 3.1 Diagnostic Reports

```typescript
const report = await reportingService.generateDiagnosticReport(diagnosticId);
```

**Report Contents**:
- Vehicle information
- DTC codes and details
- Severity assessment
- Recommended actions
- Estimated repair costs

#### 3.2 Usage Reports

```typescript
const report = await reportingService.generateUsageReport(userId, 'month');
```

**Report Contents**:
- Total sessions
- Diagnostic scans performed
- Agent interactions
- Most used features
- Average session duration

#### 3.3 System Health Reports

```typescript
const report = await reportingService.generateSystemHealthReport('day');
```

**Report Contents**:
- Total API requests
- Average response time
- Error rate
- Active users count
- Top errors
- Agent performance breakdown

---

### 4. User Management

**Location**: `src/screens/admin/UserManagementScreen.tsx`

**Capabilities**:
- View all users
- Search by email or ID
- View detailed user statistics
- Delete user accounts
- Track user behavior

**User Statistics**:
- Total sessions (last month)
- Total diagnostics performed
- Agent interactions count
- Average session duration
- Top 5 features used

---

### 5. Analytics Visualization

**Location**: `src/screens/admin/AnalyticsScreen.tsx`

**Features**:
- Event type breakdown
- Visual percentage bars
- Time period filtering
- Total event counts
- Event type distribution

**Visualizations**:
- Total events counter
- Event type cards with percentages
- Color-coded by event type:
  - User Actions: Blue (#2196F3)
  - System Events: Green (#4CAF50)
  - Errors: Red (#F44336)
  - Performance: Orange (#FF9800)

---

## Database Schema

### Analytics Events Table

```sql
CREATE TABLE analytics_events (
  id UUID PRIMARY KEY,
  event_name TEXT NOT NULL,
  event_type TEXT NOT NULL, -- 'user_action', 'system_event', 'error', 'performance'
  user_id UUID REFERENCES users(id),
  session_id TEXT NOT NULL,
  properties JSONB,
  timestamp TIMESTAMPTZ NOT NULL,
  platform TEXT NOT NULL, -- 'ios', 'android', 'web'
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_analytics_user ON analytics_events(user_id);
CREATE INDEX idx_analytics_timestamp ON analytics_events(timestamp);
CREATE INDEX idx_analytics_type ON analytics_events(event_type);
```

---

## API Integration

### Firebase Analytics

**Configured Events**:
- Screen views
- User properties
- Custom events

**Setup**:
```typescript
import analytics from '@react-native-firebase/analytics';

// Log event
await analytics().logEvent('diagnostic_scan', {
  vehicle_id: 'abc123',
  dtc_count: 3
});

// Set user properties
await analytics().setUserProperties({
  user_type: 'premium',
  vehicle_count: 2
});
```

---

## Usage Examples

### Track Complete User Journey

```typescript
// 1. User opens app
await analyticsService.trackScreenView('home', userId);

// 2. User adds vehicle
await analyticsService.trackAction('add_vehicle', {
  vin: vehicleVIN,
  make: 'Honda',
  model: 'Accord'
}, userId);

// 3. User scans vehicle
const scanStart = Date.now();
const dtcCodes = await obd2Service.scanVehicle();
const scanDuration = Date.now() - scanStart;

await analyticsService.trackDiagnosticScan(
  vehicleId,
  dtcCodes.length,
  scanDuration,
  userId
);

// 4. User interacts with diagnostic agent
const interactionStart = Date.now();
const response = await diagnosticAgent.handleMessage(message);
const interactionDuration = Date.now() - interactionStart;

await analyticsService.trackAgentInteraction(
  'diagnostic',
  'code_explanation',
  interactionDuration,
  true,
  userId
);

// 5. Generate diagnostic report
const report = await reportingService.generateDiagnosticReport(diagnosticId);
```

### Monitor System Health

```typescript
// Real-time monitoring
const health = await reportingService.generateSystemHealthReport('hour');

console.log(`
  Total Requests: ${health.totalRequests}
  Avg Response Time: ${health.averageResponseTime}ms
  Error Rate: ${health.errorRate}%
  Active Users: ${health.activeUsers}
`);

// Check agent performance
Object.entries(health.agentPerformance).forEach(([agent, perf]) => {
  console.log(`
    ${agent}:
    - Interactions: ${perf.totalInteractions}
    - Success Rate: ${perf.successRate}%
    - Avg Duration: ${perf.averageDuration}ms
  `);
});

// Alert on high error rate
if (health.errorRate > 5) {
  console.error('⚠️ High error rate detected!');
  // Send alert to admin
}
```

### Generate User Report

```typescript
const report = await reportingService.generateUsageReport(userId, 'month');

console.log(`
User Report:
- Sessions: ${report.totalSessions}
- Diagnostics: ${report.totalDiagnostics}
- Agent Interactions: ${report.totalAgentInteractions}
- Avg Session: ${(report.averageSessionDuration / 1000 / 60).toFixed(1)} min

Top Features:
${report.mostUsedFeatures.map((f, i) => 
  `${i + 1}. ${f.feature}: ${f.count} times`
).join('\n')}
`);
```

---

## Performance Considerations

### Event Buffering
- Events buffered in memory before flush
- Flush interval: 30 seconds
- Max buffer size: 1000 events
- Auto-retry on flush failure

### Query Optimization
- Indexed by user_id, timestamp, event_type
- Date range queries for reporting
- Aggregation done at database level

### Caching
- Response caching for repeated requests
- TTL: 5 minutes
- Cache invalidation on new data

---

## Security

### Access Control
- Admin screens require admin role
- Row-level security on analytics table
- User can only see own analytics
- Admins can see aggregated data

### Data Privacy
- PII excluded from analytics events
- User IDs hashed in some contexts
- Configurable data retention
- GDPR-compliant data deletion

---

## Monitoring & Alerts

### Automated Alerts

**Error Rate Alert**:
```typescript
if (systemHealth.errorRate > 5) {
  sendAdminAlert({
    type: 'error_rate_high',
    value: systemHealth.errorRate,
    threshold: 5
  });
}
```

**Response Time Alert**:
```typescript
if (systemHealth.averageResponseTime > 2000) {
  sendAdminAlert({
    type: 'slow_response',
    value: systemHealth.averageResponseTime,
    threshold: 2000
  });
}
```

**Agent Failure Alert**:
```typescript
if (agentPerf.successRate < 90) {
  sendAdminAlert({
    type: 'agent_failure_rate_high',
    agent: agentType,
    successRate: agentPerf.successRate
  });
}
```

---

## Future Enhancements

### Planned Features
- [ ] Real-time dashboard with WebSocket updates
- [ ] PDF report export
- [ ] Email reports to admins
- [ ] Advanced filtering and segmentation
- [ ] Custom metric definitions
- [ ] A/B testing framework
- [ ] Funnel analysis
- [ ] Cohort analysis
- [ ] Predictive analytics

---

## Testing

See [TESTING.md](./TESTING.md) for:
- Analytics integration tests
- Reporting integration tests
- Admin screen tests

---

**Last Updated**: January 13, 2026
**Version**: 1.0.0
**Maintainer**: RPP Auto Development Team
