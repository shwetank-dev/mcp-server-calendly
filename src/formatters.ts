import type {
  CalendlyUser,
  EventType,
  ScheduledEvent,
  Invitee,
  AvailableTime,
  PaginatedResponse,
} from "./types.js";

export function formatUser(user: CalendlyUser) {
  return {
    name: user.name,
    email: user.email,
    timezone: user.timezone,
    scheduling_url: user.scheduling_url,
    organization: user.current_organization,
  };
}

export function formatEventType(et: EventType) {
  return {
    name: et.name,
    slug: et.slug,
    uri: et.uri,
    duration: `${et.duration} minutes`,
    active: et.active,
    scheduling_url: et.scheduling_url,
    description: et.description_plain,
  };
}

export function formatScheduledEvent(event: ScheduledEvent) {
  return {
    name: event.name,
    status: event.status,
    start_time: event.start_time,
    end_time: event.end_time,
    uri: event.uri,
    location: event.location?.location ?? null,
    invitees: event.invitees_counter,
    members: event.event_memberships.map((m) => m.user_email),
  };
}

export function formatInvitee(inv: Invitee) {
  return {
    name: inv.name,
    email: inv.email,
    status: inv.status,
    timezone: inv.timezone,
    reschedule_url: inv.reschedule_url,
    cancel_url: inv.cancel_url,
  };
}

export function formatAvailableTime(slot: AvailableTime) {
  return {
    start_time: slot.start_time,
    status: slot.status,
    invitees_remaining: slot.invitees_remaining,
    scheduling_url: slot.scheduling_url,
  };
}

export function formatPaginated<T, R>(
  response: PaginatedResponse<T>,
  formatter: (item: T) => R,
) {
  return {
    items: response.collection.map(formatter),
    pagination: {
      count: response.pagination.count,
      next_page_token: response.pagination.next_page_token,
    },
  };
}
