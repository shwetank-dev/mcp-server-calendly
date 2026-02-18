import { z } from "zod";

export const ListEventTypesSchema = z.object({
  count: z
    .number()
    .min(1)
    .max(100)
    .optional()
    .describe("Number of results (1-100)"),
  page_token: z.string().optional().describe("Pagination token for next page"),
});

export const ListScheduledEventsSchema = z.object({
  count: z
    .number()
    .min(1)
    .max(100)
    .optional()
    .describe("Number of results (1-100)"),
  page_token: z.string().optional().describe("Pagination token for next page"),
  status: z
    .enum(["active", "canceled"])
    .optional()
    .describe("Filter by event status"),
  min_start_time: z
    .string()
    .optional()
    .describe("Filter: events starting after this ISO 8601 time"),
  max_start_time: z
    .string()
    .optional()
    .describe("Filter: events starting before this ISO 8601 time"),
});

export const GetEventSchema = z.object({
  event_uuid: z.string().describe("UUID of the scheduled event"),
});

export const ListInviteesSchema = z.object({
  event_uuid: z.string().describe("UUID of the scheduled event"),
  count: z
    .number()
    .min(1)
    .max(100)
    .optional()
    .describe("Number of results (1-100)"),
  page_token: z.string().optional().describe("Pagination token for next page"),
});

export const CancelEventSchema = z.object({
  event_uuid: z.string().describe("UUID of the scheduled event to cancel"),
  reason: z.string().optional().describe("Reason for cancellation"),
});

export const CheckAvailabilitySchema = z.object({
  event_type_uri: z
    .string()
    .describe("URI of the event type to check availability for"),
  start_time: z.string().describe("Start of time range (ISO 8601)"),
  end_time: z.string().describe("End of time range (ISO 8601)"),
});
