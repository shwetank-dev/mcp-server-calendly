import { describe, it, expect, vi, beforeAll, afterAll } from "vitest";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import type { CalendlyClient } from "../src/utils/calendlyClient.js";
import {
  ListEventTypesSchema,
  ListScheduledEventsSchema,
  GetEventSchema,
  ListInviteesSchema,
  CancelEventSchema,
  CheckAvailabilitySchema,
} from "../src/schemas.js";
import { getCurrentUser } from "../src/handlers/getCurrentUser.js";
import { listEventTypes } from "../src/handlers/listEventTypes.js";
import { listScheduledEvents } from "../src/handlers/listScheduledEvents.js";
import { getEvent } from "../src/handlers/getEvent.js";
import { listInvitees } from "../src/handlers/listInvitees.js";
import { cancelEvent } from "../src/handlers/cancelEvent.js";
import { checkAvailability } from "../src/handlers/checkAvailability.js";
import {
  mockUser,
  mockEventType,
  mockScheduledEvent,
  mockInvitee,
  mockAvailableTime,
  paginatedResponse,
} from "./fixtures.js";

const USER_URI = "https://api.calendly.com/users/USER123";

// Mock client — plain object with vi.fn() methods so tests can control return values
const mocks = {
  getCurrentUser: vi.fn(),
  listEventTypes: vi.fn(),
  listScheduledEvents: vi.fn(),
  getEvent: vi.fn(),
  listInvitees: vi.fn(),
  cancelEvent: vi.fn(),
  getAvailableTimes: vi.fn(),
};
const mockClient = mocks as unknown as CalendlyClient;

function createTestServer(): McpServer {
  const server = new McpServer({ name: "calendly-test", version: "0.0.0" });

  server.registerTool(
    "get_current_user",
    {
      description: "Get the authenticated Calendly user's profile",
      annotations: { readOnlyHint: true },
    },
    (): Promise<CallToolResult> => getCurrentUser(mockClient),
  );

  server.registerTool(
    "list_event_types",
    {
      description: "List the user's Calendly event types",
      inputSchema: ListEventTypesSchema.shape,
      annotations: { readOnlyHint: true },
    },
    (args): Promise<CallToolResult> =>
      listEventTypes(mockClient, USER_URI, args),
  );

  server.registerTool(
    "list_scheduled_events",
    {
      description: "List scheduled Calendly events with optional filters",
      inputSchema: ListScheduledEventsSchema.shape,
      annotations: { readOnlyHint: true },
    },
    (args): Promise<CallToolResult> =>
      listScheduledEvents(mockClient, USER_URI, args),
  );

  server.registerTool(
    "get_event",
    {
      description: "Get details of a specific scheduled event",
      inputSchema: GetEventSchema.shape,
      annotations: { readOnlyHint: true },
    },
    (args): Promise<CallToolResult> => getEvent(mockClient, args),
  );

  server.registerTool(
    "list_invitees",
    {
      description: "List invitees for a scheduled event",
      inputSchema: ListInviteesSchema.shape,
      annotations: { readOnlyHint: true },
    },
    (args): Promise<CallToolResult> => listInvitees(mockClient, args),
  );

  server.registerTool(
    "cancel_event",
    {
      description: "Cancel a scheduled Calendly event",
      inputSchema: CancelEventSchema.shape,
      annotations: { destructiveHint: true },
    },
    (args): Promise<CallToolResult> => cancelEvent(mockClient, args),
  );

  server.registerTool(
    "check_availability",
    {
      description: "Get available time slots for an event type",
      inputSchema: CheckAvailabilitySchema.shape,
      annotations: { readOnlyHint: true },
    },
    (args): Promise<CallToolResult> => checkAvailability(mockClient, args),
  );

  return server;
}

describe("calendly MCP server", () => {
  let client: Client;
  let server: McpServer;

  beforeAll(async () => {
    server = createTestServer();
    client = new Client({ name: "test-client", version: "0.0.0" });

    const [clientTransport, serverTransport] =
      InMemoryTransport.createLinkedPair();
    await Promise.all([
      client.connect(clientTransport),
      server.connect(serverTransport),
    ]);
  });

  afterAll(async () => {
    await client.close();
    await server.close();
  });

  function getText(result: Awaited<ReturnType<typeof client.callTool>>) {
    return (result.content as Array<{ type: string; text: string }>)[0].text;
  }

  // ----- Tool registration -----

  it("lists all 7 tools with correct names", async () => {
    const { tools } = await client.listTools();

    expect(tools).toHaveLength(7);

    const names = tools.map((t) => t.name).sort();
    expect(names).toEqual([
      "cancel_event",
      "check_availability",
      "get_current_user",
      "get_event",
      "list_event_types",
      "list_invitees",
      "list_scheduled_events",
    ]);

    for (const tool of tools) {
      expect(tool.description).toBeTruthy();
    }
  });

  // ----- get_current_user -----

  it("get_current_user returns formatted user profile", async () => {
    mocks.getCurrentUser.mockResolvedValueOnce(mockUser);

    const result = await client.callTool({
      name: "get_current_user",
      arguments: {},
    });
    const parsed = JSON.parse(getText(result));

    expect(parsed.name).toBe("Jane Doe");
    expect(parsed.email).toBe("jane@example.com");
    expect(parsed.timezone).toBe("America/New_York");
    expect(parsed.scheduling_url).toBe("https://calendly.com/jane-doe");
  });

  // ----- list_event_types -----

  it("list_event_types returns paginated event types", async () => {
    mocks.listEventTypes.mockResolvedValueOnce(
      paginatedResponse([mockEventType]),
    );

    const result = await client.callTool({
      name: "list_event_types",
      arguments: {},
    });
    const parsed = JSON.parse(getText(result));

    expect(parsed.items).toHaveLength(1);
    expect(parsed.items[0].name).toBe("30 Minute Meeting");
    expect(parsed.items[0].duration).toBe("30 minutes");
    expect(parsed.items[0].active).toBe(true);
    expect(parsed.pagination.next_page_token).toBeNull();
  });

  // ----- list_scheduled_events -----

  it("list_scheduled_events returns paginated events", async () => {
    mocks.listScheduledEvents.mockResolvedValueOnce(
      paginatedResponse([mockScheduledEvent]),
    );

    const result = await client.callTool({
      name: "list_scheduled_events",
      arguments: {},
    });
    const parsed = JSON.parse(getText(result));

    expect(parsed.items).toHaveLength(1);
    expect(parsed.items[0].name).toBe("30 Minute Meeting");
    expect(parsed.items[0].status).toBe("active");
    expect(parsed.items[0].location).toBe("https://zoom.us/j/123");
  });

  it("list_scheduled_events forwards status filter to client", async () => {
    mocks.listScheduledEvents.mockResolvedValueOnce(paginatedResponse([]));

    await client.callTool({
      name: "list_scheduled_events",
      arguments: { status: "canceled" },
    });

    expect(mocks.listScheduledEvents).toHaveBeenCalledWith(
      USER_URI,
      expect.objectContaining({ status: "canceled" }),
    );
  });

  // ----- get_event -----

  it("get_event returns formatted event details", async () => {
    mocks.getEvent.mockResolvedValueOnce(mockScheduledEvent);

    const result = await client.callTool({
      name: "get_event",
      arguments: { event_uuid: "EV123" },
    });
    const parsed = JSON.parse(getText(result));

    expect(parsed.name).toBe("30 Minute Meeting");
    expect(parsed.status).toBe("active");
    expect(parsed.members).toContain("jane@example.com");
    expect(parsed.invitees.total).toBe(1);
  });

  // ----- list_invitees -----

  it("list_invitees returns paginated invitees", async () => {
    mocks.listInvitees.mockResolvedValueOnce(paginatedResponse([mockInvitee]));

    const result = await client.callTool({
      name: "list_invitees",
      arguments: { event_uuid: "EV123" },
    });
    const parsed = JSON.parse(getText(result));

    expect(parsed.items).toHaveLength(1);
    expect(parsed.items[0].name).toBe("Bob Guest");
    expect(parsed.items[0].email).toBe("guest@example.com");
    expect(parsed.items[0].status).toBe("active");
  });

  // ----- cancel_event -----

  it("cancel_event returns success message containing the event uuid", async () => {
    mocks.cancelEvent.mockResolvedValueOnce(undefined);

    const result = await client.callTool({
      name: "cancel_event",
      arguments: { event_uuid: "EV123" },
    });

    expect(result.isError).toBeFalsy();
    expect(getText(result)).toContain("EV123");
    expect(getText(result)).toContain("cancelled");
  });

  it("cancel_event forwards optional reason to client", async () => {
    mocks.cancelEvent.mockResolvedValueOnce(undefined);

    await client.callTool({
      name: "cancel_event",
      arguments: { event_uuid: "EV123", reason: "Schedule conflict" },
    });

    expect(mocks.cancelEvent).toHaveBeenCalledWith(
      "EV123",
      "Schedule conflict",
    );
  });

  // ----- check_availability -----

  it("check_availability returns available time slots", async () => {
    mocks.getAvailableTimes.mockResolvedValueOnce([mockAvailableTime]);

    const result = await client.callTool({
      name: "check_availability",
      arguments: {
        event_type_uri: "https://api.calendly.com/event_types/ET123",
        start_time: "2026-03-01T00:00:00Z",
        end_time: "2026-03-02T00:00:00Z",
      },
    });
    const parsed = JSON.parse(getText(result));

    expect(parsed).toHaveLength(1);
    expect(parsed[0].status).toBe("available");
    expect(parsed[0].start_time).toBe("2026-03-01T10:00:00Z");
    expect(parsed[0].invitees_remaining).toBe(1);
  });

  // ----- Error cases -----

  it("propagates CalendlyApiError from get_current_user", async () => {
    const { CalendlyApiError } = await import("../src/utils/calendlyClient.js");
    mocks.getCurrentUser.mockRejectedValueOnce(
      new CalendlyApiError(
        401,
        "Unauthorized",
        "Calendly API error 401: Invalid token",
      ),
    );

    const result = await client.callTool({
      name: "get_current_user",
      arguments: {},
    });

    expect(result.isError).toBe(true);
    expect(getText(result)).toContain("401");
  });

  it("returns error when get_event is called without event_uuid", async () => {
    const result = await client.callTool({ name: "get_event", arguments: {} });
    expect(result.isError).toBe(true);
  });

  it("returns error when check_availability is missing required fields", async () => {
    const result = await client.callTool({
      name: "check_availability",
      arguments: {
        event_type_uri: "https://api.calendly.com/event_types/ET123",
      },
    });
    expect(result.isError).toBe(true);
  });

  it("returns error when list_invitees is called without event_uuid", async () => {
    const result = await client.callTool({
      name: "list_invitees",
      arguments: {},
    });
    expect(result.isError).toBe(true);
  });
});
