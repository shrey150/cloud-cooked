"use node";

import { SessionIdArg } from "convex-helpers/server/sessions";
import { action } from "./_generated/server";
import { v } from 'convex/values';
import { createFetchAiSession, createPrompt, startFetchAiSession } from '../helpers';
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
  args: { ...SessionIdArg, flightNumber: v.string(), simpleMode: v.optional(v.boolean()) },
  handler: async (ctx, { sessionId, flightNumber, simpleMode }) => {
    const fetchAiSessionIdRowOrNull = await ctx.runQuery(internal.functions.getFetchAiSessionId, {
      sessionId,
    });

    let fetchAiSessionId = fetchAiSessionIdRowOrNull
      ? fetchAiSessionIdRowOrNull.fetchAiSessionId
      : null;
    if (fetchAiSessionId === null) {
      fetchAiSessionId = await createAndRegisterFetchAiSession(ctx, sessionId);
    }

    // If session already started, don't start again
    if (fetchAiSessionIdRowOrNull?.fetchAiSessionStarted) {
      return;
    }

    await startFetchAiSession(fetchAiSessionId, createPrompt(flightNumber, simpleMode));

    await ctx.runMutation(internal.functions.setFetchAiSessionStarted, {
      fetchAiSessionId,
    });
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

    const response: any = await fetch(
      `https://agentverse.ai/v1beta1/engine/chat/sessions/${fetchAiSessionId}/messages?from_timestamp=2024-02-17T00:00:00.000000`, {
      method: 'GET',
      headers: {
        authorization: `Bearer ${process.env.FETCH_AI_AUTH_TOKEN}`,
      }
    });

    let json;
    try {
      json = await response.json();
      return json;
    } catch (e) {
      console.log(e);
      console.log(response);
      return {};
    }
  }
});

export const sendFetchAiMessage = action({
  args: { ...SessionIdArg, message: v.string() },
  handler: async (ctx, { sessionId, message }) => {
    const fetchAiSessionIdRowOrNull = await ctx.runQuery(
      internal.functions.getFetchAiSessionId, {
      sessionId,
    }
    );

    let fetchAiSessionId = fetchAiSessionIdRowOrNull
      ? fetchAiSessionIdRowOrNull.fetchAiSessionId
      : null;
    if (fetchAiSessionId === null || fetchAiSessionIdRowOrNull?.fetchAiSessionStarted === false) {
      throw new Error("You must start a fetch.ai session first!")
    }

    const response: any = await fetch(
      `https://agentverse.ai/v1beta1/engine/chat/sessions/${fetchAiSessionId}/submit`, {
      method: 'POST',
      headers: {
        "accept": "application/json",
        "accept-language": "en-US,en;q=0.9",
        "authorization": `Bearer ${process.env.FETCH_AI_AUTH_TOKEN}`,
        "content-type": "application/json",
      },
      referrer: "https://fetch.ai/",
      referrerPolicy: "strict-origin-when-cross-origin",
      body: JSON.stringify({
        payload: {
          type: 'user_message',
          user_message: message
        }
      }),
    });

    return await response.json();
  }
});

export const sendFetchAiJsonMessage = action({
  args: { ...SessionIdArg, selectedTaskIndex: v.number() },
  handler: async (ctx, { sessionId, selectedTaskIndex }) => {
    const fetchAiSessionIdRowOrNull = await ctx.runQuery(
      internal.functions.getFetchAiSessionId, {
      sessionId,
    }
    );

    let fetchAiSessionId = fetchAiSessionIdRowOrNull
      ? fetchAiSessionIdRowOrNull.fetchAiSessionId
      : null;
    if (fetchAiSessionId === null || fetchAiSessionIdRowOrNull?.fetchAiSessionStarted === false) {
      throw new Error("You must start a fetch.ai session first!")
    }

    const response: any = await fetch(
      `https://agentverse.ai/v1beta1/engine/chat/sessions/${fetchAiSessionId}/submit`, {
      method: 'POST',
      headers: {
        "accept": "application/json",
        "accept-language": "en-US,en;q=0.9",
        "authorization": `Bearer ${process.env.FETCH_AI_AUTH_TOKEN}`,
        "content-type": "application/json",
      },
      referrer: "https://fetch.ai/",
      referrerPolicy: "strict-origin-when-cross-origin",
      body: JSON.stringify({
        payload: {
          type: 'user_json',
          user_json: {
            type: 'task_list',
            selection: [selectedTaskIndex],
          },
        }
      }),
    });

    return await response.json();
  }
});