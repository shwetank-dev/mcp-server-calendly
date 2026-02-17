"use strict";
/**
 * Calendly API HTTP client.
 *
 * Wraps Calendly REST API v2 with typed methods. Uses native fetch (Node 22+).
 *
 * Testing strategy:
 * -----------------
 * The client uses global `fetch`, so tests mock fetch at the global level.
 * With vitest:
 *
 *   import { vi, describe, it, expect, beforeEach } from "vitest";
 *   import { CalendlyClient, CalendlyApiError } from "./client.js";
 *
 *   // Mock global fetch before each test
 *   const mockFetch = vi.fn();
 *   beforeEach(() => {
 *     vi.stubGlobal("fetch", mockFetch);
 *     mockFetch.mockReset();
 *   });
 *
 *   // Helper to create a mock Response
 *   function mockResponse(body: unknown, status = 200) {
 *     return {
 *       ok: status >= 200 && status < 300,
 *       status,
 *       statusText: status === 200 ? "OK" : "Error",
 *       json: async () => body,
 *       text: async () => JSON.stringify(body),
 *     };
 *   }
 *
 * What to test:
 * 1. Each method builds the correct URL and query params
 *    - Assert mockFetch was called with the expected URL and headers
 * 2. Each method unwraps the response correctly
 *    - e.g. getCurrentUser() returns data.resource, not the raw envelope
 * 3. Error handling: non-ok responses throw CalendlyApiError
 *    - mockFetch returns { ok: false, status: 401, ... }
 *    - Assert the error has the right status and message
 * 4. Auth header is always sent
 *    - Assert Authorization: Bearer <key> is present in every call
 * 5. Optional params are omitted when undefined
 *    - e.g. listEventTypes(uri) without count/pageToken doesn't add them to URL
 */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CalendlyClient = exports.CalendlyApiError = void 0;
var BASE_URL = "https://api.calendly.com";
/**
 * Error thrown when the Calendly API returns a non-2xx response.
 * Captures the HTTP status code and response body for debugging.
 */
var CalendlyApiError = /** @class */ (function (_super) {
    __extends(CalendlyApiError, _super);
    function CalendlyApiError(status, statusText, message) {
        var _this = _super.call(this, message) || this;
        _this.status = status;
        _this.statusText = statusText;
        _this.name = "CalendlyApiError";
        return _this;
    }
    return CalendlyApiError;
}(Error));
exports.CalendlyApiError = CalendlyApiError;
/**
 * Typed HTTP client for the Calendly REST API v2.
 *
 * All methods return parsed JSON typed to the expected Calendly response shape.
 * Auth is handled automatically via Bearer token in every request.
 */
var CalendlyClient = /** @class */ (function () {
    function CalendlyClient(apiKey) {
        this.apiKey = apiKey;
    }
    /**
     * Core HTTP method. All public methods delegate here.
     *
     * - Prepends BASE_URL unless the path is already a full URL
     * - Injects Authorization header on every request
     * - Throws CalendlyApiError on non-2xx responses
     *
     * Generic param T is the expected JSON response shape (caller provides it).
     * Note: no runtime validation — T is a compile-time assertion only.
     */
    CalendlyClient.prototype.request = function (path, options) {
        return __awaiter(this, void 0, void 0, function () {
            var url, res, body;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        url = path.startsWith("http") ? path : "".concat(BASE_URL).concat(path);
                        return [4 /*yield*/, fetch(url, __assign(__assign({}, options), { headers: __assign({ Authorization: "Bearer ".concat(this.apiKey), "Content-Type": "application/json" }, options === null || options === void 0 ? void 0 : options.headers) }))];
                    case 1:
                        res = _a.sent();
                        if (!!res.ok) return [3 /*break*/, 3];
                        return [4 /*yield*/, res.text()];
                    case 2:
                        body = _a.sent();
                        throw new CalendlyApiError(res.status, res.statusText, "Calendly API error ".concat(res.status, ": ").concat(body));
                    case 3: return [2 /*return*/, res.json()];
                }
            });
        });
    };
    /** GET /users/me — returns the authenticated user's profile. */
    CalendlyClient.prototype.getCurrentUser = function () {
        return __awaiter(this, void 0, void 0, function () {
            var data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.request("/users/me")];
                    case 1:
                        data = _a.sent();
                        return [2 /*return*/, data.resource];
                }
            });
        });
    };
    /**
     * GET /event_types — list event types for a user.
     * Requires the user's Calendly URI (from getCurrentUser().uri).
     */
    CalendlyClient.prototype.listEventTypes = function (userUri, count, pageToken) {
        return __awaiter(this, void 0, void 0, function () {
            var params;
            return __generator(this, function (_a) {
                params = new URLSearchParams({ user: userUri });
                if (count)
                    params.set("count", String(count));
                if (pageToken)
                    params.set("page_token", pageToken);
                return [2 /*return*/, this.request("/event_types?".concat(params))];
            });
        });
    };
    /**
     * GET /scheduled_events — list events with optional filters.
     * All filter params are optional; only non-undefined values are sent.
     */
    CalendlyClient.prototype.listScheduledEvents = function (userUri, options) {
        return __awaiter(this, void 0, void 0, function () {
            var params;
            return __generator(this, function (_a) {
                params = new URLSearchParams({ user: userUri });
                if (options === null || options === void 0 ? void 0 : options.count)
                    params.set("count", String(options.count));
                if (options === null || options === void 0 ? void 0 : options.pageToken)
                    params.set("page_token", options.pageToken);
                if (options === null || options === void 0 ? void 0 : options.status)
                    params.set("status", options.status);
                if (options === null || options === void 0 ? void 0 : options.minStartTime)
                    params.set("min_start_time", options.minStartTime);
                if (options === null || options === void 0 ? void 0 : options.maxStartTime)
                    params.set("max_start_time", options.maxStartTime);
                return [2 /*return*/, this.request("/scheduled_events?".concat(params))];
            });
        });
    };
    /** GET /scheduled_events/:uuid — get a single event by UUID. */
    CalendlyClient.prototype.getEvent = function (eventUuid) {
        return __awaiter(this, void 0, void 0, function () {
            var data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.request("/scheduled_events/".concat(eventUuid))];
                    case 1:
                        data = _a.sent();
                        return [2 /*return*/, data.resource];
                }
            });
        });
    };
    /** GET /scheduled_events/:uuid/invitees — list who's invited to an event. */
    CalendlyClient.prototype.listInvitees = function (eventUuid, count, pageToken) {
        return __awaiter(this, void 0, void 0, function () {
            var params, query;
            return __generator(this, function (_a) {
                params = new URLSearchParams();
                if (count)
                    params.set("count", String(count));
                if (pageToken)
                    params.set("page_token", pageToken);
                query = params.toString();
                return [2 /*return*/, this.request("/scheduled_events/".concat(eventUuid, "/invitees").concat(query ? "?".concat(query) : ""))];
            });
        });
    };
    /**
     * POST /scheduled_events/:uuid/cancellation — cancel an event.
     * This is the only mutating method. Sends an optional cancellation reason.
     */
    CalendlyClient.prototype.cancelEvent = function (eventUuid, reason) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.request("/scheduled_events/".concat(eventUuid, "/cancellation"), {
                            method: "POST",
                            body: JSON.stringify({ reason: reason !== null && reason !== void 0 ? reason : "" }),
                        })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * GET /event_type_available_times — get bookable time slots.
     * Requires the event type URI and a time range (ISO 8601 strings).
     */
    CalendlyClient.prototype.getAvailableTimes = function (eventTypeUri, startTime, endTime) {
        return __awaiter(this, void 0, void 0, function () {
            var params, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        params = new URLSearchParams({
                            event_type: eventTypeUri,
                            start_time: startTime,
                            end_time: endTime,
                        });
                        return [4 /*yield*/, this.request("/event_type_available_times?".concat(params))];
                    case 1:
                        data = _a.sent();
                        return [2 /*return*/, data.collection];
                }
            });
        });
    };
    return CalendlyClient;
}());
exports.CalendlyClient = CalendlyClient;
