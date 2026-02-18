import type { z } from "zod";
import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import type { ListEventTypesSchema } from "../schemas.js";
import { CalendlyClient } from "../utils/calendlyClient.js";
import { errorResponse } from "../utils/errorResponse.js";
import { formatPaginated, formatEventType } from "../formatters.js";

export async function listEventTypes(
  client: CalendlyClient,
  userUri: string,
  args: z.infer<typeof ListEventTypesSchema>,
): Promise<CallToolResult> {
  try {
    const result = await client.listEventTypes(
      userUri,
      args.count,
      args.page_token,
    );
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(
            formatPaginated(result, formatEventType),
            null,
            2,
          ),
        },
      ],
    };
  } catch (e) {
    return errorResponse(e);
  }
}
