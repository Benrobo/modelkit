# ModelKit API Server

Hono server that exposes ModelKit via REST API and serves the Studio UI directly — no separate frontend install needed.

## Run

```bash
REDIS_URL=redis://localhost:6379 bun run dev
```

| URL | Description |
|-----|-------------|
| `http://localhost:3456/__studio` | Studio UI |
| `http://localhost:3456/api/modelkit` | REST API |

## API

```
GET    /api/modelkit/overrides        List all overrides
GET    /api/modelkit/overrides/:id    Get override
POST   /api/modelkit/overrides/:id    Set override
DELETE /api/modelkit/overrides/:id    Clear override
```

## Embedding the Studio in your own app

If you want the React component instead:

```tsx
import { ModelKitStudio } from "@benrobo/modelkit-studio";
import "@benrobo/modelkit-studio/styles";

<ModelKitStudio apiUrl="http://localhost:3456/api/modelkit" />
```
