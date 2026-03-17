// This file provides type declarations for vitest globals

// Import the necessary types from vitest
import { expect as vitestExpect, test, describe, it, vi } from 'vitest';

// Declare the global variables that vitest injects when globals: true is set
declare global {
  // Export all the testing functions as globals
  export const expect: typeof vitestExpect;
  export const test: typeof test;
  export const describe: typeof describe;
  export const it: typeof it;
  export const vi: typeof vi;
  
  // Add any other globals that vitest provides
  export const beforeAll: (fn: () => void) => void;
  export const afterAll: (fn: () => void) => void;
  export const beforeEach: (fn: () => void) => void;
  export const afterEach: (fn: () => void) => void;
}