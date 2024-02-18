# Cooked

## Getting Started

1. Install dependencies: `bun install`
1. Start Next.js dev server: `bun dev`
1. Start Convex dev server: `bunx convex dev`

## Debugging

- If the call to fetch.ai fails, you probably need to get a new authentication token. Log out and log back into the fetch.ai [API docs](https://fetch.ai/docs/apis/ai-engine/chat), then copy the JWT and replace the `FETCH_AI_AUTH_TOKEN` environment variable in Convex (in the `dev` environment)
