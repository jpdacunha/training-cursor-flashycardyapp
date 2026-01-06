# Testing Implementation

## Overview

This project uses Vitest for automated testing with a comprehensive test suite covering all database operations.

## Test Suite

**File**: `src/db/database.test.ts`

The test suite includes:
- **10 automated unit tests** covering all database operations
- **Automatic cleanup** that empties all tables after each test run
- **Sequence reset** to ensure consistent test IDs

## Test Categories

### Decks Operations (4 tests)
- ✓ Create a new deck
- ✓ Get all decks
- ✓ Update a deck
- ✓ Delete a deck

### Cards Operations (6 tests)
- ✓ Create cards for a deck
- ✓ Get all cards for a deck
- ✓ Update a card
- ✓ Delete a card
- ✓ Cascade delete when deck is deleted
- ✓ Complete CRUD workflow

## Cleanup Mechanism

The `cleanupDatabase()` function runs:
- **Before each test** (`beforeEach`) - ensures test isolation
- **After all tests** (`afterAll`) - guarantees clean state for next run

Cleanup process:
1. Delete all cards (respects foreign key constraints)
2. Delete all decks
3. Reset auto-increment sequences to 1

## Running Tests

### First Time Setup
```bash
npm install
```

### Run Tests Once
```bash
npm test
```

### Watch Mode
Automatically re-run tests when files change:
```bash
npm run test:watch
```

## Configuration

**vitest.config.ts**
- Node environment configuration
- Path alias setup (@/ → project root)
- 30-second timeout for database operations

## Test Structure

Each test follows this pattern:
1. **Setup**: Create test data (in `beforeEach`)
2. **Execute**: Perform the operation being tested
3. **Assert**: Verify the expected results
4. **Cleanup**: Automatic cleanup after each test

## Database Requirements

Make sure you have:
1. A `.env` file with `DATABASE_URL` configured
2. Database migrations applied (`npx drizzle-kit push` or `npx drizzle-kit migrate`)
3. Network access to your database

## Test Results

```
✓ Test Files  1 passed (1)
✓ Tests      10 passed (10)
✓ All tables emptied successfully
```

## Benefits

1. **Automated Testing**: No manual verification needed
2. **Clean State**: Each test run starts with empty tables
3. **Test Isolation**: Tests don't interfere with each other
4. **Comprehensive Coverage**: All CRUD operations tested
5. **Easy to Extend**: Add new tests by following existing patterns
6. **Documentation**: Clear structure and comments

## Adding New Tests

To add more tests:
1. Open `src/db/database.test.ts`
2. Add new `it()` or `describe()` blocks
3. Follow the existing pattern
4. Run `npm test` to verify

The cleanup mechanism will automatically handle new tests!

