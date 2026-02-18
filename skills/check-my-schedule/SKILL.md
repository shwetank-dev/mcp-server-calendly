---
name: check-my-schedule
description: >
  Lists upcoming scheduled Calendly events for a given time range, with optional
  status filtering. Use when the user wants to see their calendar, check what's
  coming up, or review past meetings.
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
    - schedule
    - meetings
    - events
    - calendar
    - upcoming
  version: "0.1.0"
  surfaces:
    - claude-code
  author:
    name: NimbleBrain Inc
  examples:
    - prompt: "What meetings do I have this week?"
    - prompt: "Show me my upcoming Calendly events"
    - prompt: "What's on my calendar for the next 7 days?"
---

# Check My Schedule

List upcoming scheduled Calendly events for a time range.

## Workflow

1. **Get the time range**
   - If the user specifies a range (e.g. "this week", "next 7 days"), convert to ISO 8601
   - If no range is given, default to today through 7 days from now
   - Use today's date as `min_start_time` and the end date as `max_start_time`

2. **Fetch events**
   - Call `list_scheduled_events` with `min_start_time`, `max_start_time`, and `status: "active"`
   - Use `count: 20` unless the user asks for more

3. **Present the results**
   - Group events by day
   - For each event show: name, start time, duration, location/join URL if available
   - If no events found, say so clearly

## Output Format

```
📅 Your schedule (Feb 18 – Feb 25):

Monday, Feb 18
  • 10:00 AM — 30 Min Call (30 min) | Zoom: https://...

Wednesday, Feb 20
  • 2:00 PM — Strategy Session (60 min) | Google Meet: https://...

No events on other days.
```

## Important Notes

- All times should be shown in a human-readable format, not raw ISO 8601
- If the user asks for canceled events, use `status: "canceled"` instead
- For large ranges, remind the user they can paginate with `page_token`
