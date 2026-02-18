import { z } from "zod";

// === Zod Schemas (runtime validation) ===

export const CalendlyUserSchema = z.object({
  uri: z.string(),
  name: z.string(),
  slug: z.string(),
  email: z.string(),
  scheduling_url: z.string(),
  timezone: z.string(),
  avatar_url: z.string().nullable(),
  created_at: z.string(),
  updated_at: z.string(),
  current_organization: z.string(),
});

export const EventTypeSchema = z.object({
  uri: z.string(),
  name: z.string(),
  active: z.boolean(),
  slug: z.string(),
  scheduling_url: z.string(),
  duration: z.number(),
  kind: z.string(),
  type: z.string(),
  color: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
  description_plain: z.string().nullable(),
  description_html: z.string().nullable(),
});

export const EventLocationSchema = z.object({
  type: z.string(),
  location: z.string(),
});

export const CalendarEventSchema = z.object({
  kind: z.string(),
  external_id: z.string(),
});

export const ScheduledEventSchema = z.object({
  uri: z.string(),
  name: z.string(),
  status: z.enum(["active", "canceled"]),
  start_time: z.string(),
  end_time: z.string(),
  event_type: z.string(),
  location: EventLocationSchema.nullable(),
  invitees_counter: z.object({
    total: z.number(),
    active: z.number(),
    limit: z.number(),
  }),
  created_at: z.string(),
  updated_at: z.string(),
  event_memberships: z.array(
    z.object({ user: z.string(), user_email: z.string() }),
  ),
  calendar_event: CalendarEventSchema.nullable(),
});

export const InviteeSchema = z.object({
  uri: z.string(),
  email: z.string(),
  name: z.string(),
  status: z.enum(["active", "canceled"]),
  timezone: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
  reschedule_url: z.string(),
  cancel_url: z.string(),
});

export const AvailableTimeSchema = z.object({
  status: z.string(),
  invitees_remaining: z.number(),
  start_time: z.string(),
  scheduling_url: z.string(),
});

export const PaginationSchema = z.object({
  count: z.number(),
  next_page: z.string().nullable(),
  previous_page: z.string().nullable(),
  next_page_token: z.string().nullable(),
});

// Generic paginated response helper
export function paginatedSchema<T extends z.ZodTypeAny>(itemSchema: T) {
  return z.object({
    collection: z.array(itemSchema),
    pagination: PaginationSchema,
  });
}

// === Types (derived from schemas — single source of truth) ===

export type CalendlyUser = z.infer<typeof CalendlyUserSchema>;
export type EventType = z.infer<typeof EventTypeSchema>;
export type EventLocation = z.infer<typeof EventLocationSchema>;
export type CalendarEvent = z.infer<typeof CalendarEventSchema>;
export type ScheduledEvent = z.infer<typeof ScheduledEventSchema>;
export type Invitee = z.infer<typeof InviteeSchema>;
export type AvailableTime = z.infer<typeof AvailableTimeSchema>;
export type Pagination = z.infer<typeof PaginationSchema>;
export type PaginatedResponse<T> = {
  collection: T[];
  pagination: Pagination;
};
