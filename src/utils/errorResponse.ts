import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import { CalendlyApiError } from './calendlyClient.js';

export function errorResponse(e: unknown): CallToolResult {
  const msg = e instanceof CalendlyApiError ? e.message : String(e);
  return { content: [{ type: 'text', text: `Error: ${msg}` }], isError: true };
}
