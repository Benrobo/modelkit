import { Hono } from "hono";
import {
  createModelKit,
  createRedisAdapter,
  createModelKitRouter,
} from "modelkit";

const adapter = createRedisAdapter({
  url: process.env.REDIS_URL || "redis://192.168.215.2:6379",
});

const modelKit = createModelKit(adapter);

const app = new Hono();

app.route("/api/modelkit", createModelKitRouter(modelKit));

app.get("/", (c) =>
  c.json({
    name: "ModelKit API Server",
    endpoints: {
      overrides: "GET /api/modelkit/overrides",
      getOverride: "GET /api/modelkit/overrides/:id",
      setOverride: "POST /api/modelkit/overrides/:id",
      clearOverride: "DELETE /api/modelkit/overrides/:id",
    },
  })
);

const port = Number(process.env.PORT) || 3456;

Bun.serve({
  port,
  fetch: app.fetch,
});

console.log(`ModelKit API server at http://localhost:${port}`);
console.log(`Studio URL: http://localhost:${port}/api/modelkit`);
