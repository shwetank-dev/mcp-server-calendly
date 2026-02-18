import type { z } from "zod";
import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import type { CheckAvailabilitySchema } from "../schemas.js";
import { CalendlyClient } from "../utils/calendlyClient.js";
import { errorResponse } from "../utils/errorResponse.js";
import { formatAvailableTime } from "../formatters.js";

export async function checkAvailability(
  client: CalendlyClient,
  args: z.infer<typeof CheckAvailabilitySchema>,
): Promise<CallToolResult> {
  try {
    const slots = await client.getAvailableTimes(
      args.event_type_uri,
      args.start_time,
      args.end_time,
    );
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(slots.map(formatAvailableTime), null, 2),
        },
      ],
    };
  } catch (e) {
    return errorResponse(e);
  }
}
