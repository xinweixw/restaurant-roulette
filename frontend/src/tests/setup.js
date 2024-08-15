import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/vitest'; // Assuming you're using jest-dom with vitest
import { it, expect, describe, afterEach, afterAll, beforeAll } from 'vitest'; // Make sure vitest imports are correctly handled
import "whatwg-fetch"; 
import { server } from './mocks/server';

// Start server before all tests
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));

// Reset handlers after each test
afterEach(() => {
  server.resetHandlers();
});

// Close server after all tests
afterAll(() => server.close());

afterEach(() => {
  cleanup(); // Clean up React Testing Library
});
