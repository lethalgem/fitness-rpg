# Test Suite for Fitness RPG

## Overview

This test suite covers the core business logic for calculating stats and XP in the Fitness RPG application. These tests ensure that:
- Stats are calculated correctly from activities
- XP calculations respect intensity multipliers
- Sport-to-stat mappings are valid and consistent

## Running Tests

```bash
# Run all tests once
npm test

# Watch mode (re-runs on file changes)
npm run test:watch

# Open interactive UI
npm run test:ui

# Generate coverage report
npm run test:coverage
```

## Test Files

### `calculator.test.ts`
Tests for `src/stats/calculator.ts`

**What it tests:**
- `calculateUserStats()` - Aggregates all activities into user stats
- `calculateStatsBySport()` - Breaks down stats by sport type
- Edge cases: empty activities, single activity, multiple activities
- Stat aggregation across multiple sports
- Level calculations from XP

**Why it matters:**
These are the core calculations that power the entire app. If these are wrong, everyone's stats are wrong.

### `xp.test.ts`
Tests for `src/stats/xp.ts`

**What it tests:**
- `calculateActivityXP()` - Calculates XP with intensity multipliers
- Base XP calculation from time
- Intensity multipliers from heart rate, watts, and pace
- Priority order of intensity metrics (HR > watts > pace)
- Edge cases: no time, no intensity data

**Why it matters:**
XP calculations are complex with multiple intensity sources. These tests ensure users get fair XP regardless of what data their device records.

### `stats.test.ts` (config validation)
Tests for `src/config/stats.ts`

**What it tests:**
- All sport mappings sum to 1.0 (no missing or extra percentages)
- All percentages are between 0 and 1
- Default mapping is valid
- Common sports are covered (Run, Ride, etc.)
- Reasonable distribution of strength/endurance/agility focused sports

**Why it matters:**
This would have caught the bug when adding agility if percentages didn't sum to 1.0. These tests act as guardrails when adding new sports.

## Test Coverage

Current coverage: **34 tests covering core stat logic**

### What's Covered ✅
- Stat calculation algorithms
- XP calculation with intensity
- Sport mapping validation
- Edge cases and error handling

### What's NOT Covered (intentionally) ⏭️
- Database operations (integration tests, not unit tests)
- API endpoints (will be redesigned)
- Frontend UI (will be redesigned)
- Strava API integration (external dependency)

## Adding New Tests

### When to add tests:
1. **Before adding a new stat** - Update `stats.test.ts` to include the new stat
2. **When fixing a bug** - Add a test that reproduces the bug, then fix it
3. **When adding a new intensity metric** - Add tests to `xp.test.ts`

### Test template:
```typescript
it('should [expected behavior]', () => {
  // Arrange: Set up test data
  const activity = { /* ... */ };

  // Act: Run the function
  const result = calculateSomething(activity);

  // Assert: Check the result
  expect(result).toBe(expectedValue);
});
```

## Why These Tests Matter

### Real bugs these would catch:
1. ✅ Sport percentages not summing to 1.0 (caught by `stats.test.ts`)
2. ✅ Intensity multipliers being applied incorrectly
3. ✅ Level calculations being off
4. ✅ Stats not aggregating properly across activities
5. ✅ Edge cases like empty activity lists crashing

### Confidence for changes:
- Refactoring stat calculations? Tests ensure you don't break anything
- Adding a new sport? Tests validate your percentages
- Changing XP formula? Tests show you the impact

## CI/CD Integration (Future)

When you set up GitHub Actions, add:
```yaml
- name: Run tests
  run: npm test
```

This ensures all tests pass before merging PRs.
