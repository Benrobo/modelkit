/**
 * Hono router for ModelKit
 * Provides ready-to-use REST API endpoints
 */

import { Hono } from "hono";
import { cors } from "hono/cors";
import type { ModelKit } from "../types.js";

export interface CreateRouterOptions {
  /**
   * Enable CORS. Set to true for default CORS or provide custom config.
   * Default: true
   */
  cors?: boolean | {
    origin: string | string[];
    credentials?: boolean;
  };
}

/**
 * Create a Hono router for ModelKit.
 * Mount this in your Hono app to expose ModelKit via REST API.
 *
 * @example
 * ```ts
 * import { Hono } from "hono";
 * import { createModelKit, createRedisAdapter, createModelKitRouter } from "modelkit";
 *
 * const app = new Hono();
 * const adapter = createRedisAdapter({ url: process.env.REDIS_URL });
 * const modelKit = createModelKit(adapter);
 *
 * app.route("/api/modelkit", createModelKitRouter(modelKit));
 * ```
 */
export function createModelKitRouter(
  modelKit: ModelKit,
  options: CreateRouterOptions = {}
): Hono {
  const app = new Hono();

  if (options.cors !== false) {
    if (options.cors === true || options.cors === undefined) {
      app.use("/*", cors());
    } else {
      app.use("/*", cors(options.cors));
    }
  }

  // GET /overrides - List all overrides
  app.get("/overrides", async (c) => {
    try {
      const overrides = await modelKit.listOverrides();
      return c.json(overrides);
    } catch (error) {
      return c.json(
        { error: error instanceof Error ? error.message : "Failed to list overrides" },
        500
      );
    }
  });

  // GET /overrides/:featureId - Get specific override
  app.get("/overrides/:featureId", async (c) => {
    try {
      const featureId = c.req.param("featureId");
      const override = await modelKit.getConfig(featureId);

      if (!override) {
        return c.json({ error: "Override not found" }, 404);
      }

      return c.json(override);
    } catch (error) {
      return c.json(
        { error: error instanceof Error ? error.message : "Failed to get override" },
        500
      );
    }
  });

  // POST /overrides/:featureId - Set override
  app.post("/overrides/:featureId", async (c) => {
    try {
      const featureId = c.req.param("featureId");
      const override = await c.req.json();

      if (!override.modelId) {
        return c.json({ error: "modelId is required" }, 400);
      }

      await modelKit.setOverride(featureId, override);
      return c.json({ success: true });
    } catch (error) {
      return c.json(
        { error: error instanceof Error ? error.message : "Failed to set override" },
        500
      );
    }
  });

  // DELETE /overrides/:featureId - Clear override
  app.delete("/overrides/:featureId", async (c) => {
    try {
      const featureId = c.req.param("featureId");
      await modelKit.clearOverride(featureId);
      return c.json({ success: true });
    } catch (error) {
      return c.json(
        { error: error instanceof Error ? error.message : "Failed to clear override" },
        500
      );
    }
  });

  return app;
}
