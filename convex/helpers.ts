/**
 * Creates a fetch.ai session and gets a session ID
 */
export async function createFetchAiSession(): Promise<string> {
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

  const json = await sessionResponse.json();
  if (json.detail === 'Could not validate credentials') {
    throw new Error("It's time to refresh the fetch.ai token.")
  }

  return json.session_id;

}

/**
 * Starts an existing fetch.ai session and sends an initial message (the `objective`)
 */
export async function startFetchAiSession(fetchAiSessionId: string, objective: string) {
  await fetch(`https://agentverse.ai/v1beta1/engine/chat/sessions/${fetchAiSessionId}/submit`, {
    "headers": {
      "accept": "application/json",
      "accept-language": "en-US,en;q=0.9",
      "authorization": `Bearer ${process.env.FETCH_AI_AUTH_TOKEN}`,
      "content-type": "application/json",
    },
    "referrer": "https://fetch.ai/",
    "referrerPolicy": "strict-origin-when-cross-origin",
    "body": JSON.stringify({
      payload: {
        type: 'start',
        objective,
        context: '',
      }
    }),
    "method": "POST",
  });

  return fetchAiSessionId;
}