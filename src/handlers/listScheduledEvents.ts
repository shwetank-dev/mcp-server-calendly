import type { z } from 'zod';
import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import type { ListScheduledEventsSchema } from '../schemas.js';
import { CalendlyClient } from '../utils/calendlyClient.js';
import { errorResponse } from '../utils/errorResponse.js';
import { formatPaginated, formatScheduledEvent } from '../formatters.js';

export async function listScheduledEvents(
  client: CalendlyClient,
  userUri: string,
  args: z.infer<typeof ListScheduledEventsSchema>,
): Promise<CallToolResult> {
  try {
    const result = await client.listScheduledEvents(userUri, {
      count: args.count,
      pageToken: args.page_token,
      status: args.status,
      minStartTime: args.min_start_time,
      maxStartTime: args.max_start_time,
    });
    return { content: [{ type: 'text', text: JSON.stringify(formatPaginated(result, formatScheduledEvent), null, 2) }] };
  } catch (e) {
    return errorResponse(e);
  }
}
