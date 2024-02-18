import { action } from "./_generated/server";
import { v } from 'convex/values';

async function createFetchAiSession() {
  const sessionResponse = await fetch("https://agentverse.ai/v1beta1/engine/chat/sessions", {
    "headers": {
      "accept": "application/json",
      "accept-language": "en-US,en;q=0.9",
      "authorization": `Bearer ${process.env.FETCH_AI_AUTH_TOKEN}`,
      "content-type": "application/json",
    },
    "referrer": "https://fetch.ai/",
    "body": "{\"email\":\"your_email_address\",\"requestedModel\":\"talkative-01\"}",
    "method": "POST"
  });

  const { session_id } = await sessionResponse.json();

  return session_id;
}

export const queryFetchAi = action({
  args: { flightNumber: v.string() },
  handler: async (ctx, { flightNumber }) => {

    const sessionId = await createFetchAiSession();
    console.log(sessionId);


  }
})