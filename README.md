# mcp-calendly

MCP server for Calendly scheduling — event types, scheduled events, invitees, availability, and cancellations.

## Setup

```bash
npm install
npm run build
```

## Configuration

Get a Personal Access Token from [Calendly Integrations](https://calendly.com/integrations/api_webhooks).

```bash
export CALENDLY_API_KEY=your_token_here
```

## Usage

```bash
# Run directly
npm start

# Run via mpak
mpak config set @nimblebraininc/calendly api_key=your_key_here
mpak run @nimblebraininc/calendly
```

## Tools

| Tool | Description |
|------|-------------|
| `get_current_user` | Get authenticated user profile |
| `list_event_types` | List event types |
| `list_scheduled_events` | List scheduled events with filters |
| `get_event` | Get a specific event |
| `list_invitees` | List invitees for an event |
| `cancel_event` | Cancel a scheduled event |
| `check_availability` | Get available time slots |

## Development

```bash
npm run dev          # Run with tsx
npm run check        # All checks (format, lint, typecheck, test)
make bump VERSION=0.2.0  # Bump version
```
