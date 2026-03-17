// This file contains global type definitions for the project

// Import vitest types
import 'vitest';
import type { TestingLibraryMatchers } from '@testing-library/jest-dom/matchers';

// Extend expect matchers
declare global {
  namespace Vi {
    interface JestAssertion<T = any> extends jest.Matchers<void, T>, TestingLibraryMatchers<T, void> {}
  }
}

// Declare global variables
declare global {
  // Add any global variables here
  interface Window {
    // Add any window properties here
  }
}

// Export empty object to make this a module
export {};