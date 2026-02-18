# Calendly MCP Server Tools

## User Tools
- `get_current_user()` — Get the authenticated user's profile (uri, name, email, timezone, scheduling_url)

## Event Type Tools
- `list_event_types(count?, page_token?)` — List the user's event types (name, duration, scheduling_url, uri)

## Scheduled Event Tools
- `list_scheduled_events(count?, page_token?, status?, min_start_time?, max_start_time?)` — List scheduled events with optional filters. `status` is `"active"` or `"canceled"`. Times are ISO 8601.
- `get_event(event_uuid)` — Get details of a specific scheduled event
- `cancel_event(event_uuid, reason?)` — Cancel a scheduled event with an optional reason

## Invitee Tools
- `list_invitees(event_uuid, count?, page_token?)` — List invitees for a scheduled event

## Availability Tools
- `check_availability(event_type_uri, start_time, end_time)` — Get available time slots for an event type. Returns a list of bookable windows.
