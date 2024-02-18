import { vSessionId } from "convex-helpers/server/sessions";
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  fetchAiSessionIds: defineTable({
    sessionId: vSessionId,
    fetchAiSessionId: v.string(),
  }).index("by_sessionId", ["sessionId"]),
});