# @nimblebraininc/calendly

MCP server for the [Calendly API](https://developer.calendly.com/api-docs). Browse event types, view and filter scheduled meetings, inspect invitee details, check availability windows, and cancel events.

## Tools

| Tool | Description |
|------|-------------|
| `get_current_user` | Get the authenticated user's profile |
| `list_event_types` | List the user's event types |
| `list_scheduled_events` | List scheduled events with optional filters |
| `get_event` | Get details of a specific scheduled event |
| `list_invitees` | List invitees for a scheduled event |
| `cancel_event` | Cancel a scheduled event with an optional reason |
| `check_availability` | Get available time slots for an event type |

## Setup

1. Get a Personal Access Token from [Calendly Integrations](https://calendly.com/integrations/api_webhooks)
2. Configure via mpak:
   ```bash
   mpak config set @nimblebraininc/calendly api_key your_token_here
   ```

## Development

```bash
npm install
npm run build
npm run check     # format, lint, typecheck, tests
```

## License

MIT
