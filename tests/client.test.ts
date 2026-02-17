import { describe, it, expect } from 'vitest';
import { CalendlyApiError } from '../src/utils/calendlyClient.js';

describe('CalendlyApiError', () => {
  it('should create an error with status and message', () => {
    const err = new CalendlyApiError(401, 'Unauthorized', 'Invalid API key');
    expect(err.status).toBe(401);
    expect(err.statusText).toBe('Unauthorized');
    expect(err.message).toBe('Invalid API key');
    expect(err.name).toBe('CalendlyApiError');
  });
});
