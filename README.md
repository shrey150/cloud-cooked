# Cooked

## Getting Started

1. Install dependencies: `bun install`
1. Start Next.js dev server: `bun dev`
1. Start Convex dev server: `bunx convex dev`

## How it works

1. Enter in your flight number
1. We call fetch.ai's DELTA-V Chat API with the prompt in `cloud-cooked/convex/actions.ts`
1. Given agents that we've already set up on fetch.ai's [agentverse](https://agentverse.ai/), we ask DELTA-V to respond to our prompt, finding you alternative routings for your flight including buses, trains, public transit, etc. There is no coding needed on our end besides the prompt — DELTA-V automatically determines the best agents to complete the task, then queries the APIs it needs to come up with a plan.

   - Agent code is in `agents/` folder

1. The alternate plan is displayed to the user.
1. If the user likes the alternate plan, we have another prompt that is sent to DELTA-V which allows the user to book all the tickets.

## Stack

- fetch.ai to determine which agents to use
- Convex to keep track of fetch.ai DELTA-V chatbot sessions on a per-tab basis
- Next.js/Vercel for hosting

## Debugging

- If the call to fetch.ai fails, you probably need to get a new authentication token. Log out and log back into the fetch.ai [API docs](https://fetch.ai/docs/apis/ai-engine/chat), then copy the JWT and replace the `FETCH_AI_AUTH_TOKEN` [environment variable in Convex](https://dashboard.convex.dev/t/shrey150/cloud-cooked/posh-crane-176/settings/environment-variables) (in the `dev` environment)
