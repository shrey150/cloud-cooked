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

/**
 * Creates the prompt to send to DELTA-V.
 */
export function createPrompt(flightNumber: string, simpleMode: boolean = false) {
  if (simpleMode) {
    return `
      I currently have a ticket on flight number ${flightNumber.toUpperCase()}. What is the status of the flight?
    `.trim();
  }

  return `
    I currently have a ticket on flight number ${flightNumber.toUpperCase()}. I am worried the flight may be delayed or cancelled. Please do the following tasks:

    1. First, can you determine the origin and destination airports corresponding to this flight number?
    2. Then, can you determine the current delay status of this flight (i.e. will it leave on time)?
    3. Then, can you determine the probability of a departure delay at the origin airport?
    4. Then, can you determine the probability of an arrival delay at the destination airport?
    5. Multiply (1 - probability of departure delay) * (1 - probability of arrival delay) to determine probability of no delay.
    6. Next, find the closest airports to the origin airport. These are the alternative origin airports.
    7. After that, find the closest airports to the destination airport. These are the alternative destination airports.
    8. For each alternative origin airport, find flights from the alternative origin to the original destination.
    9. For each alternative destination airport, find flights from the original origin to the alternative destination.
    10. Finally, return the alternative flights.
  `.trim();
}