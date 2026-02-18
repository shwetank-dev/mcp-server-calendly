import {
  CalendlyUserSchema,
  EventTypeSchema,
  ScheduledEventSchema,
  InviteeSchema,
  AvailableTimeSchema,
  paginatedSchema,
} from "../types.js";
import type {
  AvailableTime,
  CalendlyUser,
  EventType,
  Invitee,
  PaginatedResponse,
  ScheduledEvent,
} from "../types.js";

const BASE_URL = "https://api.calendly.com";

export class CalendlyApiError extends Error {
  constructor(
    public status: number,
    public statusText: string,
    message: string,
  ) {
    super(message);
    this.name = "CalendlyApiError";
  }
}

export class CalendlyClient {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  private async request(path: string, options?: RequestInit): Promise<unknown> {
    const url = path.startsWith("http") ? path : `${BASE_URL}${path}`;
    const res = await fetch(url, {
      ...options,
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        "Content-Type": "application/json",
        ...options?.headers,
      },
    });

    if (!res.ok) {
      const body = await res.text();
      throw new CalendlyApiError(
        res.status,
        res.statusText,
        `Calendly API error ${res.status}: ${body}`,
      );
    }

    return res.json();
  }

  async getCurrentUser(): Promise<CalendlyUser> {
    const data = await this.request("/users/me");
    return CalendlyUserSchema.parse((data as { resource: unknown }).resource);
  }

  async listEventTypes(
    userUri: string,
    count?: number,
    pageToken?: string,
  ): Promise<PaginatedResponse<EventType>> {
    const params = new URLSearchParams({ user: userUri });
    if (count) params.set("count", String(count));
    if (pageToken) params.set("page_token", pageToken);
    const data = await this.request(`/event_types?${params}`);
    return paginatedSchema(EventTypeSchema).parse(data);
  }

  async listScheduledEvents(
    userUri: string,
    options?: {
      count?: number;
      pageToken?: string;
      status?: "active" | "canceled";
      minStartTime?: string;
      maxStartTime?: string;
    },
  ): Promise<PaginatedResponse<ScheduledEvent>> {
    const params = new URLSearchParams({ user: userUri });
    if (options?.count) params.set("count", String(options.count));
    if (options?.pageToken) params.set("page_token", options.pageToken);
    if (options?.status) params.set("status", options.status);
    if (options?.minStartTime)
      params.set("min_start_time", options.minStartTime);
    if (options?.maxStartTime)
      params.set("max_start_time", options.maxStartTime);
    const data = await this.request(`/scheduled_events?${params}`);
    return paginatedSchema(ScheduledEventSchema).parse(data);
  }

  async getEvent(eventUuid: string): Promise<ScheduledEvent> {
    const data = await this.request(`/scheduled_events/${eventUuid}`);
    return ScheduledEventSchema.parse((data as { resource: unknown }).resource);
  }

  async listInvitees(
    eventUuid: string,
    count?: number,
    pageToken?: string,
  ): Promise<PaginatedResponse<Invitee>> {
    const params = new URLSearchParams();
    if (count) params.set("count", String(count));
    if (pageToken) params.set("page_token", pageToken);
    const query = params.toString();
    const data = await this.request(
      `/scheduled_events/${eventUuid}/invitees${query ? `?${query}` : ""}`,
    );
    return paginatedSchema(InviteeSchema).parse(data);
  }

  async cancelEvent(eventUuid: string, reason?: string): Promise<void> {
    await this.request(`/scheduled_events/${eventUuid}/cancellation`, {
      method: "POST",
      body: JSON.stringify({ reason: reason ?? "" }),
    });
  }

  async getAvailableTimes(
    eventTypeUri: string,
    startTime: string,
    endTime: string,
  ): Promise<AvailableTime[]> {
    const params = new URLSearchParams({
      event_type: eventTypeUri,
      start_time: startTime,
      end_time: endTime,
    });
    const data = await this.request(`/event_type_available_times?${params}`);
    return AvailableTimeSchema.array().parse(
      (data as { collection: unknown }).collection,
    );
  }
}
