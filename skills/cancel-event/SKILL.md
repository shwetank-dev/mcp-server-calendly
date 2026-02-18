---
name: cancel-event
description: >
  Finds a scheduled Calendly event by name, date, or invitee and cancels it
  with an optional reason. Use when the user wants to cancel a meeting,
  remove an event, or decline a scheduled call.
license: MIT
compatibility: "Requires @nimblebraininc/calendly MCP server"
allowed-tools: "Read"
metadata:
  tags:
    - calendly
    - scheduling
    - calendar
  category: operations
  keywords:
    - cancel
    - meeting
    - event
    - remove
    - decline
  version: "0.1.0"
  surfaces:
    - claude-code
  author:
    name: NimbleBrain Inc
  examples:
    - prompt: "Cancel my 3pm call today"
    - prompt: "Cancel the meeting with John tomorrow"
    - prompt: "Remove my strategy session on Friday"
---

# Cancel Event

Find and cancel a scheduled Calendly event.

## Workflow

1. **Identify the event**
   - If the user gives a UUID directly, use `get_event` to confirm it
   - Otherwise use `list_scheduled_events` with a narrow time range to find it
     - Filter by `status: "active"` so only cancellable events are shown
     - Match by name or look for the invitee using `list_invitees`
   - If multiple matches, present the options and ask the user to confirm which one

2. **Confirm before canceling**
   - Show the event name, date/time, and invitee(s)
   - Ask the user to confirm unless they've already been explicit
   - Ask if they'd like to provide a cancellation reason

3. **Cancel the event**
   - Call `cancel_event(event_uuid, reason?)` with the confirmed UUID
   - Pass the reason if the user provided one

## Output Format

```
✅ Event canceled:
- Event: {event_name}
- Date: {start_time}
- Invitee(s): {invitee names}
- Reason: {reason or "none provided"}
```

## Important Notes

- Only `active` events can be canceled — already-canceled events will error
- Cancellation is irreversible; always confirm before proceeding
- If the user says "cancel all meetings today", list them first and confirm each
