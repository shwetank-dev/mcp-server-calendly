---
name: share-booking-link
description: >
  Finds a Calendly event type by name or duration and returns its scheduling URL
  so the user can share it. Use when the user wants to send a booking link,
  share their calendar, or let someone schedule a meeting.
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
    - booking
    - link
    - schedule
    - share
    - meeting
  version: "0.1.0"
  surfaces:
    - claude-code
  author:
    name: NimbleBrain Inc
  examples:
    - prompt: "Share my 30 minute meeting link"
    - prompt: "Give me my booking link for a quick call"
    - prompt: "What's the link for my strategy session event type?"
---

# Share Booking Link

Find a Calendly event type and return its scheduling URL.

## Workflow

1. **Find the event type**
   - Call `list_event_types` to retrieve all event types
   - Match the user's request by name or duration (e.g. "30 min", "quick call")
   - If there's only one event type, use it directly
   - If there are multiple matches, list them and ask the user to pick one

2. **Return the link**
   - Extract the `scheduling_url` from the matched event type
   - Present it clearly so the user can copy and share it

## Output Format

```
Here's your booking link for **{event_type_name}** ({duration} min):

🔗 {scheduling_url}
```

If multiple event types exist and no match was found:
```
You have {n} event types. Which one did you mean?
1. {name} ({duration} min)
2. {name} ({duration} min)
...
```

## Important Notes

- `scheduling_url` is the public Calendly link anyone can use to book time
- If the user wants to check open slots before sharing, use `check_availability` with the event type's `uri`
- Event type URIs look like `https://api.calendly.com/event_types/...` — use these for `check_availability`, not the scheduling URL
