# ModelKit API Server Example

Hono server exposing ModelKit via REST API.

## Run

```bash
bun install
bun run dev
```

Server: `http://localhost:3456`

## API

```bash
GET    /api/overrides          # List all overrides
GET    /api/overrides/:id      # Get override
POST   /api/overrides/:id      # Set override
DELETE /api/overrides/:id      # Clear override
```

## Usage with Studio

The Studio UI should connect to this API (not directly to Redis):

```tsx
<ModelKitStudio apiUrl="http://localhost:3456/api" />
```

This keeps Redis credentials on the server side.
