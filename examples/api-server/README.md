# ModelKit API server (example)

Hono server that uses the ModelKit SDK with **real in-memory storage** (no mock data). Use this to test the studio or any client against a real API.

## Run the server

From repo root:

```bash
bun install
bun run --filter modelkit-api-server dev
```

Or from this folder:

```bash
cd examples/api-server
bun install
bun run dev
```

Server runs at **http://localhost:3456** (or `PORT` env).

## Use with Studio Preview

1. Start this server: `bun run --filter modelkit-api-server dev`
2. Start the studio preview with the API URL: `VITE_API_URL=http://localhost:3456 bun run --filter @modelkit/studio-preview dev`
3. Open http://localhost:3480 — the studio will show "Preview (API)" and use real data from the server.

## API

- `GET /api/features` — list features
- `GET /api/features/:id/config` — get config (with override if any)
- `GET /api/features/:id/model` — get effective model id
- `POST /api/features/:id/override` — set override (body: `{ modelId?, temperature?, maxTokens? }`)
- `DELETE /api/features/:id/override` — clear override
- `GET /api/overrides` — list all overrides
