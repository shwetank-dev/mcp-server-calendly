import type {
  CalendlyUser,
  EventType,
  ScheduledEvent,
  Invitee,
  AvailableTime,
  PaginatedResponse,
} from "../src/types.js";

export const mockUser: CalendlyUser = {
  uri: "https://api.calendly.com/users/USER123",
  name: "Jane Doe",
  slug: "jane-doe",
  email: "jane@example.com",
  scheduling_url: "https://calendly.com/jane-doe",
  timezone: "America/New_York",
  avatar_url: null,
  created_at: "2024-01-01T00:00:00Z",
  updated_at: "2024-01-01T00:00:00Z",
  current_organization: "https://api.calendly.com/organizations/ORG123",
};

export const mockEventType: EventType = {
  uri: "https://api.calendly.com/event_types/ET123",
  name: "30 Minute Meeting",
  active: true,
  slug: "30min",
  scheduling_url: "https://calendly.com/jane-doe/30min",
  duration: 30,
  kind: "solo",
  type: "StandardEventType",
  color: "#4d5cf6",
  created_at: "2024-01-01T00:00:00Z",
  updated_at: "2024-01-01T00:00:00Z",
  description_plain: "A quick 30 minute chat.",
  description_html: "<p>A quick 30 minute chat.</p>",
};

export const mockScheduledEvent: ScheduledEvent = {
  uri: "https://api.calendly.com/scheduled_events/EV123",
  name: "30 Minute Meeting",
  status: "active",
  start_time: "2026-03-01T10:00:00Z",
  end_time: "2026-03-01T10:30:00Z",
  event_type: "https://api.calendly.com/event_types/ET123",
  location: { type: "zoom", location: "https://zoom.us/j/123" },
  invitees_counter: { total: 1, active: 1, limit: 1 },
  created_at: "2026-02-15T08:00:00Z",
  updated_at: "2026-02-15T08:00:00Z",
  event_memberships: [
    {
      user: "https://api.calendly.com/users/USER123",
      user_email: "jane@example.com",
    },
  ],
  calendar_event: null,
};

export const mockInvitee: Invitee = {
  uri: "https://api.calendly.com/scheduled_events/EV123/invitees/INV123",
  email: "guest@example.com",
  name: "Bob Guest",
  status: "active",
  timezone: "America/Chicago",
  created_at: "2026-02-15T09:00:00Z",
  updated_at: "2026-02-15T09:00:00Z",
  reschedule_url: "https://calendly.com/reschedulings/RTOKEN",
  cancel_url: "https://calendly.com/cancellations/CTOKEN",
};

export const mockAvailableTime: AvailableTime = {
  status: "available",
  invitees_remaining: 1,
  start_time: "2026-03-01T10:00:00Z",
  scheduling_url: "https://calendly.com/jane-doe/30min/2026-03-01T10:00:00Z",
};

export function paginatedResponse<T>(items: T[]): PaginatedResponse<T> {
  return {
    collection: items,
    pagination: {
      count: items.length,
      next_page: null,
      previous_page: null,
      next_page_token: null,
    },
  };
}
