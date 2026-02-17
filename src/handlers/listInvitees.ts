import type { z } from 'zod';
import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import type { ListInviteesSchema } from '../schemas.js';
import { CalendlyClient } from '../utils/calendlyClient.js';
import { errorResponse } from '../utils/errorResponse.js';
import { formatPaginated, formatInvitee } from '../formatters.js';

export async function listInvitees(
  client: CalendlyClient,
  args: z.infer<typeof ListInviteesSchema>,
): Promise<CallToolResult> {
  try {
    const result = await client.listInvitees(args.event_uuid, args.count, args.page_token);
    return { content: [{ type: 'text', text: JSON.stringify(formatPaginated(result, formatInvitee), null, 2) }] };
  } catch (e) {
    return errorResponse(e);
  }
}
