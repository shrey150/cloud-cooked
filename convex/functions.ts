import { action } from "./_generated/server";
import { v } from 'convex/values';

export const queryFetchAi = action({
  args: { flightNumber: v.string() },
  handler: async (ctx, { flightNumber }) => {
    const sessionResponse = await fetch("https://agentverse.ai/v1beta1/engine/chat/sessions");
    console.log(sessionResponse)
  }
})