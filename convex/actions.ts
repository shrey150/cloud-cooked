"use node";

import { SessionIdArg } from "convex-helpers/server/sessions";
import { action } from "./_generated/server";
import { v } from 'convex/values';
import { createFetchAiSession, startFetchAiSession } from './helpers';
import { internal } from "./_generated/api";

async function createAndRegisterFetchAiSession(ctx: any, sessionId: string) {
  const fetchAiSessionId = await createFetchAiSession();
  await ctx.runMutation(internal.functions.registerFetchAiSessionId, {
    sessionId,
    fetchAiSessionId,
  });
  return fetchAiSessionId;
}

export const initializeFetchAiSession = action({
  args: { ...SessionIdArg, flightNumber: v.string() },
  handler: async (ctx, { sessionId, flightNumber }) => {
    const fetchAiSessionIdRowOrNull = await ctx.runQuery(internal.functions.getFetchAiSessionId, {
      sessionId,
    });

    let fetchAiSessionId = fetchAiSessionIdRowOrNull
      ? fetchAiSessionIdRowOrNull.fetchAiSessionId
      : null;
    if (fetchAiSessionId === null) {
      fetchAiSessionId = await createAndRegisterFetchAiSession(ctx, sessionId);
    }

    const prompt = `
      I am currently on flight ${flightNumber}.
      What is the status of the flight?
    `;
    await startFetchAiSession(fetchAiSessionId, prompt);
  }
});

export const getFetchAiResponse = action({
  args: { ...SessionIdArg },
  handler: async (ctx, { sessionId }) => {
    const fetchAiSessionIdRowOrNull = await ctx.runQuery(
      internal.functions.getFetchAiSessionId, {
      sessionId,
    }
    );

    let fetchAiSessionId = fetchAiSessionIdRowOrNull
      ? fetchAiSessionIdRowOrNull.fetchAiSessionId
      : null;
    if (fetchAiSessionId === null) {
      fetchAiSessionId = await createAndRegisterFetchAiSession(ctx, sessionId);
    }

    const response = await fetch(
      `https://agentverse.ai/v1beta1/engine/chat/sessions/${fetchAiSessionId}/messages?from_timestamp=2024-02-17T00:00:00.000000`, {
      method: 'GET',
      headers: {
        authorization: `Bearer ${process.env.FETCH_AI_AUTH_TOKEN}`,
      }
    });

    console.log(fetchAiSessionId)

    return await response.json();

  }
});