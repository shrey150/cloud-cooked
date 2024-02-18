import { SessionIdArg } from "convex-helpers/server/sessions";
import { internalQuery, internalMutation } from "./_generated/server";
import { v } from 'convex/values';

// Register a Fetch AI session ID
export const registerFetchAiSessionId = internalMutation({
  args: {
    ...SessionIdArg,
    fetchAiSessionId: v.string(),
  },
  handler: async (ctx, { sessionId, fetchAiSessionId }) => {
    await ctx.db.insert("fetchAiSessionIds", {
      sessionId,
      fetchAiSessionId
    });
    return fetchAiSessionId;
  },
});

export const getFetchAiSessionId = internalQuery({
  args: {
    ...SessionIdArg,
  },
  handler: async (ctx, { sessionId }) => {
    return ctx.db.query("fetchAiSessionIds")
      .filter(q => q.eq(q.field("sessionId"), sessionId))
      .first();
  },
});