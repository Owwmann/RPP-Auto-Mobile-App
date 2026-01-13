# 🧪 Testing Documentation - RPP Auto Mobile App

## Overview

Comprehensive testing strategy covering unit tests, integration tests, and end-to-end tests for the RPP Auto mobile application.

---

## Test Structure

```
__tests__/
├── integration/           # Integration tests
│   ├── agents/           # Agent integration tests
│   ├── services/         # Service integration tests
│   ├── screens/          # Screen integration tests
│   └── protocol/         # Protocol integration tests
│
├── e2e/                  # End-to-end tests
│   ├── complete-workflow.e2e.test.ts
│   └── config.json
│
└── utils/                # Test utilities
    └── testHelpers.ts
```

---

## Running Tests

### Unit & Integration Tests

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run specific test file
npm test -- agents/BaseAgent

# Run in watch mode
npm test -- --watch
```

### End-to-End Tests

```bash
# Build app for E2E testing
npm run build:e2e:ios
npm run build:e2e:android

# Run E2E tests
npm run test:e2e:ios
npm run test:e2e:android

# Run specific E2E test
detox test __tests__/e2e/complete-workflow.e2e.test.ts
```

---

## Test Categories

### 1. Agent Integration Tests

**Location**: `__tests__/integration/agents/`

**Coverage**:
- Agent lifecycle (initialize, shutdown)
- Message handling
- Agent orchestration
- Context persistence
- Error handling & recovery

**Example**:
```typescript
it('should handle messages through complete lifecycle', async () => {
  await customerAgent.initialize();
  
  const response = await customerAgent.handleMessage({
    id: 'test-msg-1',
    content: 'Hello, I need help',
    userId: 'test-user-1',
    conversationId: 'test-conv-1',
    timestamp: new Date(),
    metadata: {}
  });

  expect(response).toBeDefined();
  expect(response.content).toBeTruthy();
});
```

### 2. Service Integration Tests

**Location**: `__tests__/integration/services/`

**Coverage**:
- OBD2 service operations
- VIN decoding
- DTC code lookup
- Database interactions
- End-to-end service workflows

**Example**:
```typescript
it('should decode VIN and store vehicle data', async () => {
  const vehicleInfo = await vinService.decodeVIN(testVIN);
  expect(vehicleInfo).toBeDefined();
  
  const { data } = await supabase
    .from('vehicles')
    .insert(vehicleInfo)
    .select()
    .single();
    
  expect(data).toBeDefined();
});
```

### 3. Screen Integration Tests

**Location**: `__tests__/integration/screens/`

**Coverage**:
- Authentication flows
- Screen navigation
- Form validation
- User interactions
- State management

**Example**:
```typescript
it('should login successfully with valid credentials', async () => {
  const { getByPlaceholderText, getByText } = render(
    <LoginScreen />
  );

  fireEvent.changeText(getByPlaceholderText('Email'), 'test@example.com');
  fireEvent.changeText(getByPlaceholderText('Password'), 'password123');
  fireEvent.press(getByText('Login'));

  await waitFor(() => {
    expect(mockNavigation.navigate).toHaveBeenCalled();
  });
});
```

### 4. Protocol Integration Tests

**Location**: `__tests__/integration/protocol/`

**Coverage**:
- Message queue operations
- Request handling
- Response handling
- Event system
- End-to-end protocol flow

**Example**:
```typescript
it('should prioritize messages correctly', async () => {
  await messageQueue.enqueue(lowPriorityMessage);
  await messageQueue.enqueue(highPriorityMessage);

  const first = await messageQueue.dequeue();
  expect(first?.id).toBe('msg-high');
});
```

### 5. End-to-End Workflow Tests

**Location**: `__tests__/e2e/`

**Coverage**:
- Complete diagnostic workflow (VIN → scan → report)
- Service booking workflow
- Parts recommendation workflow
- Multi-agent conversation flow
- Analytics and reporting integration

**Example**:
```typescript
it('should complete full diagnostic workflow', async () => {
  // 1. Decode VIN
  const vehicleInfo = await vinService.decodeVIN(testVIN);
  
  // 2. Store vehicle
  const { data: vehicle } = await supabase
    .from('vehicles')
    .insert(vehicleInfo)
    .select()
    .single();
  
  // 3. Simulate scan
  const dtcCodes = ['P0420', 'P0171'];
  
  // 4. Lookup codes
  const codeDetails = await motorDaaS.lookupDTCCodesBatch(dtcCodes);
  
  // 5. Store diagnostic
  const { data: diagnostic } = await supabase
    .from('vehicle_diagnostics')
    .insert({
      vehicle_id: vehicle.id,
      dtc_codes: dtcCodes,
      metadata: { codeDetails }
    })
    .select()
    .single();
  
  // 6. Ask agent
  const response = await orchestrator.routeMessage(...);
  
  // 7. Generate report
  const report = await reportingService.generateDiagnosticReport(diagnostic.id);
  
  expect(report).toBeDefined();
  expect(report?.recommendations.length).toBeGreaterThan(0);
});
```

---

## Test Utilities

**Location**: `__tests__/utils/testHelpers.ts`

**Available Helpers**:

```typescript
// Generate unique test ID
const id = TestHelpers.generateTestId('user');

// Create test user
const user = await TestHelpers.createTestUser();

// Create test vehicle
const vehicle = await TestHelpers.createTestVehicle(userId);

// Create test diagnostic
const diagnostic = await TestHelpers.createTestDiagnostic(vehicleId, ['P0420']);

// Cleanup test user and all related data
await TestHelpers.deleteTestUser(userId);

// Wait for async operation
await TestHelpers.wait(1000);

// Verify record exists
const exists = await TestHelpers.verifyRecordExists('users', userId);

// Get record count
const count = await TestHelpers.getRecordCount('vehicles', { user_id: userId });

// Clean all test data
await TestHelpers.cleanAllTestData();
```

---

## Test Configuration

### Jest Configuration

**File**: `jest.config.js`

```javascript
module.exports = {
  preset: 'react-native',
  setupFilesAfterEnv: ['./jest.setup.js'],
  testMatch: [
    '**/__tests__/**/*.test.[jt]s?(x)',
    '**/?(*.)+(spec|test).[jt]s?(x)'
  ],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/config/**'
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 75,
      lines: 80,
      statements: 80
    }
  }
};
```

### Detox E2E Configuration

**File**: `.detoxrc.js`

```javascript
module.exports = {
  testRunner: 'jest',
  configurations: {
    'ios.sim.debug': {
      device: 'simulator',
      app: 'ios.debug'
    },
    'android.emu.debug': {
      device: 'emulator',
      app: 'android.debug'
    }
  }
};
```

---

## Coverage Goals

| Category | Target | Current |
|----------|--------|--------|
| Unit Tests | 80% | TBD |
| Integration Tests | 75% | TBD |
| E2E Tests | 60% | TBD |
| Overall | 75% | TBD |

---

## Best Practices

### 1. Test Isolation
- Each test should be independent
- Clean up test data after each test
- Use unique IDs for test data

### 2. Test Data
- Use test helpers for consistent data creation
- Never hardcode test data
- Clean up all test data after tests complete

### 3. Async Testing
- Always use async/await
- Set appropriate timeouts
- Handle promises properly

### 4. Mocking
- Mock external dependencies
- Mock API calls when testing UI
- Use real services for integration tests

### 5. Assertions
- Be specific with assertions
- Test both success and failure cases
- Verify error handling

---

## Continuous Integration

### GitHub Actions Workflow

```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Setup Node
        uses: actions/setup-node@v2
        with:
          node-version: '18'
      - name: Install dependencies
        run: npm install
      - name: Run tests
        run: npm test -- --coverage
      - name: Upload coverage
        uses: codecov/codecov-action@v2
```

---

## Troubleshooting

### Common Issues

**Issue**: Tests timeout
- Increase timeout in test configuration
- Check for hanging promises
- Ensure proper cleanup

**Issue**: Database connection errors
- Verify Supabase credentials
- Check network connectivity
- Ensure test database is accessible

**Issue**: Mock not working
- Clear jest cache: `npm test -- --clearCache`
- Check mock path
- Verify mock implementation

---

## Additional Resources

- [Jest Documentation](https://jestjs.io/)
- [React Native Testing Library](https://callstack.github.io/react-native-testing-library/)
- [Detox Documentation](https://wix.github.io/Detox/)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

---

## Test Metrics

### Current Status

- ✅ **7 Integration Test Files**
- ✅ **1 E2E Workflow Test**
- ✅ **Test Utilities Implemented**
- ✅ **CI/CD Integration Ready**

### Test Coverage by Module

| Module | Test Files | Status |
|--------|------------|--------|
| Agents | 1 | ✅ Complete |
| Services | 1 | ✅ Complete |
| Screens | 1 | ✅ Complete |
| Protocol | 1 | ✅ Complete |
| E2E Workflows | 1 | ✅ Complete |

---

**Last Updated**: January 13, 2026
**Version**: 1.0.0
**Maintainer**: RPP Auto Development Team
