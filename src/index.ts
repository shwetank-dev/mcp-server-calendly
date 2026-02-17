#!/usr/bin/env node

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { loadConfig } from './config.js';
import { VERSION, SERVER_NAME } from './constants.js';
import { CalendlyClient } from './utils/calendlyClient.js';
import {
  ListEventTypesSchema,
  ListScheduledEventsSchema,
  GetEventSchema,
  ListInviteesSchema,
  CancelEventSchema,
  CheckAvailabilitySchema,
} from './schemas.js';
import { getCurrentUser } from './handlers/getCurrentUser.js';
import { listEventTypes } from './handlers/listEventTypes.js';
import { listScheduledEvents } from './handlers/listScheduledEvents.js';
import { getEvent } from './handlers/getEvent.js';
import { listInvitees } from './handlers/listInvitees.js';
import { cancelEvent } from './handlers/cancelEvent.js';
import { checkAvailability } from './handlers/checkAvailability.js';

const config = loadConfig();
const client = new CalendlyClient(config.apiKey);

const server = new McpServer({
  name: SERVER_NAME,
  version: VERSION,
});

// Cache user URI to avoid repeated /users/me calls
let cachedUserUri: string | null = null;
async function getUserUri(): Promise<string> {
  if (!cachedUserUri) {
    const user = await client.getCurrentUser();
    cachedUserUri = user.uri;
  }
  return cachedUserUri;
}

// === Tools ===

server.registerTool('get_current_user', {
  description: "Get the authenticated Calendly user's profile",
  annotations: { readOnlyHint: true },
}, () => getCurrentUser(client));

server.registerTool('list_event_types', {
  description: "List the user's Calendly event types",
  inputSchema: ListEventTypesSchema.shape,
  annotations: { readOnlyHint: true },
}, async (args) => {
  const userUri = await getUserUri();
  return listEventTypes(client, userUri, args);
});

server.registerTool('list_scheduled_events', {
  description: 'List scheduled Calendly events with optional filters',
  inputSchema: ListScheduledEventsSchema.shape,
  annotations: { readOnlyHint: true },
}, async (args) => {
  const userUri = await getUserUri();
  return listScheduledEvents(client, userUri, args);
});

server.registerTool('get_event', {
  description: 'Get details of a specific scheduled event',
  inputSchema: GetEventSchema.shape,
  annotations: { readOnlyHint: true },
}, (args) => getEvent(client, args));

server.registerTool('list_invitees', {
  description: 'List invitees for a scheduled event',
  inputSchema: ListInviteesSchema.shape,
  annotations: { readOnlyHint: true },
}, (args) => listInvitees(client, args));

server.registerTool('cancel_event', {
  description: 'Cancel a scheduled Calendly event',
  inputSchema: CancelEventSchema.shape,
  annotations: { destructiveHint: true },
}, (args) => cancelEvent(client, args));

server.registerTool('check_availability', {
  description: 'Get available time slots for an event type',
  inputSchema: CheckAvailabilitySchema.shape,
  annotations: { readOnlyHint: true },
}, (args) => checkAvailability(client, args));

// === Start ===

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error(`Calendly MCP server v${VERSION} running on stdio`);
}

main().catch((e) => {
  console.error('Fatal error:', e);
  process.exit(1);
});
