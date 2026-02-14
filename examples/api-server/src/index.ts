/**
 * Example API server using ModelKit SDK with real in-memory storage.
 * Run: bun run dev (from examples/api-server or repo root with turbo)
 * Then point the studio or a client at http://localhost:3456
 */

import { Hono } from "hono";
import { cors } from "hono/cors";
import { createModelKit, createRedisAdapter } from "modelkit";

const modelKit = createModelKit(
  createRedisAdapter({
    url: process.env.REDIS_URL!,
  }),
  {
    cacheTTL: 60000,
  }
);

const app = new Hono();

app.use("*", cors({ origin: "*" }));

app.get("/api/features", async (c) => {
  const overrides = await modelKit.listOverrides();
  return c.json({
    features: overrides.map(({ featureId, override }) => ({
      id: featureId,
      modelId: override.modelId,
    })),
  });
});

app.get("/api/features/:id/config", async (c) => {
  const id = c.req.param("id");
  try {
    const configResult = await modelKit.getConfig(id);
    return c.json(configResult);
  } catch (err) {
    return c.json({ error: (err as Error).message }, 404);
  }
});

app.get("/api/features/:id/model", async (c) => {
  const id = c.req.param("id");
  try {
    const modelId = await modelKit.getModel(id, "anthropic/claude-opus-4.5");
    return c.json({ modelId });
  } catch (err) {
    return c.json({ error: (err as Error).message }, 404);
  }
});

app.post("/api/features/:id/override", async (c) => {
  const id = c.req.param("id");
  const body = await c.req.json<{
    modelId?: string;
    temperature?: number;
    maxTokens?: number;
  }>();
  try {
    await modelKit.setOverride(id, {
      modelId: "ai21/jamba-large-1.7",
    });
    return c.json({ ok: true });
  } catch (err) {
    return c.json({ error: (err as Error).message }, 400);
  }
});

app.delete("/api/features/:id/override", async (c) => {
  const id = c.req.param("id");
  try {
    await modelKit.clearOverride(id);
    return c.json({ ok: true });
  } catch (err) {
    return c.json({ error: (err as Error).message }, 400);
  }
});

app.get("/api/overrides", async (c) => {
  const overrides = await modelKit.listOverrides();
  return c.json(overrides);
});

app.get("/", (c) =>
  c.json({
    name: "ModelKit API (example)",
    docs: "GET /api/features, GET /api/features/:id/config, POST /api/features/:id/override, DELETE /api/features/:id/override, GET /api/overrides",
  })
);

const port = Number(process.env.PORT) || 3456;

Bun.serve({
  port,
  fetch: app.fetch,
});

console.log(`ModelKit API server at http://localhost:${port}`);
