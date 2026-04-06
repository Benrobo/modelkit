import { Hono } from "hono";
import { createModelKit, createRedisAdapter } from "@benrobo/modelkit";
import { createModelKitHonoRouter } from "@benrobo/modelkit/hono";

const modelKit = createModelKit(
  createRedisAdapter({ url: process.env.REDIS_URL || "redis://localhost:6379" })
);

const app = new Hono();

app.route(
  "/api/modelkit",
  createModelKitHonoRouter(modelKit, { studio: true })
);

const port = Number(process.env.PORT) || 3456;
Bun.serve({ port, fetch: app.fetch });

console.log(`\nModelKit running at http://localhost:${port}`);
console.log(`Studio  → http://localhost:${port}/api/modelkit/studio`);
console.log(`API     → http://localhost:${port}/api/modelkit/overrides\n`);
