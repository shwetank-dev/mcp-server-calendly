# Calendly MCP Server

MCP server providing Calendly scheduling functionality via Calendly's REST API v2.

## Architecture

```
src/
├── index.ts        # MCP server + stdio entrypoint
├── client.ts       # HTTP client for Calendly API
└── types.ts        # TypeScript types for API responses
```

## Critical

- Package name: `@nimblebraininc/calendly` (npm-style, matches GitHub org)
- Manifest uses Node.js: `node dist/index.js`
- Server uses `@modelcontextprotocol/sdk` with stdio transport

## user_config

API key configured via manifest `user_config`, not hardcoded:
```json
{
  "user_config": {
    "api_key": {
      "type": "string",
      "sensitive": true,
      "required": true
    }
  },
  "server": {
    "mcp_config": {
      "env": { "CALENDLY_API_KEY": "${user_config.api_key}" }
    }
  }
}
```

## Available Tools

| Category | Tools |
|----------|-------|
| User | `get_current_user` |
| Event Types | `list_event_types` |
| Events | `list_scheduled_events`, `get_event`, `cancel_event` |
| Invitees | `list_invitees` |
| Availability | `check_availability` |

## Calendly API Reference

- Base URL: `https://api.calendly.com`
- Auth: Bearer token
- Docs: https://developer.calendly.com/api-docs

## Commands

```bash
npm run build        # Compile TypeScript
npm run dev          # Run with tsx (dev)
npm run test         # Test
npm run lint         # Lint
npm run format       # Format
npm run typecheck    # Type check
make check           # All checks
```

## Local Testing with mpak

```bash
mpak config set @nimblebraininc/calendly api_key=your_key_here
mpak run @nimblebraininc/calendly
```
