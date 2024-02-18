import { action } from "./_generated/server";
import { v } from 'convex/values';

export const queryFetchAi = action({
  args: { flightNumber: v.string() },
  handler: async (ctx, { flightNumber }) => {

  }
})