import { Hono } from "hono";
import { cors } from "hono/cors";
import type { ModelKit } from "../types.js";
import { renderStudioHtml } from "../studio-bundle.js";

export interface CreateRouterOptions {
  /**
   * Enable CORS. Set to true for default CORS or provide custom config.
   * Default: true
   */
  cors?:
    | boolean
    | {
        origin: string | string[];
        credentials?: boolean;
      };
  /**
   * Serve the ModelKit Studio UI at /studio (relative to mount path).
   * Default: true
   */
  studio?: boolean;
  /**
   * Override the sub-path where the Studio UI is served, relative to mount point.
   * Default: "/studio"
   * @example "/__studio" → mounted at /api/modelkit, served at /api/modelkit/__studio
   */
  studioPath?: string;
}

/**
 * Create a Hono router for ModelKit.
 * Mounts REST API endpoints and (by default) serves the Studio UI.
 *
 * @example
 * ```ts
 * import { Hono } from "hono";
 * import { createModelKit, createRedisAdapter } from "@benrobo/modelkit";
 * import { createModelKitHonoRouter } from "@benrobo/modelkit/hono";
 *
 * const app = new Hono();
 * const modelKit = createModelKit(createRedisAdapter({ url: process.env.REDIS_URL }));
 *
 * app.route("/api/modelkit", createModelKitHonoRouter(modelKit));
 * // Studio UI → http://localhost:3000/__studio
 * ```
 */
export function createModelKitHonoRouter(
  modelKit: ModelKit,
  options: CreateRouterOptions = {}
): Hono {
  const app = new Hono();
  const serveStudio = options.studio !== false;
  const studioPath =
    (options.studioPath ?? "/studio").replace(/\/$/, "") || "/studio";

  if (options.cors !== false) {
    const corsOptions =
      options.cors === true || options.cors === undefined
        ? undefined
        : options.cors;
    app.use("/*", corsOptions ? cors(corsOptions) : cors());
  }

  if (serveStudio) {
    app.get(studioPath, (c) => {
      const url = new URL(c.req.url);
      const proto =
        c.req.header("x-forwarded-proto")?.split(",")[0].trim() ?? url.protocol.replace(":", "");
      const apiUrl =
        `${proto}://${url.host}` +
        url.pathname.replace(studioPath, "").replace(/\/$/, "");
      return c.html(renderStudioHtml(apiUrl));
    });
  }

  app.get("/overrides", async (c) => {
    try {
      return c.json(await modelKit.listOverrides());
    } catch (error) {
      return c.json(
        {
          error:
            error instanceof Error ? error.message : "Failed to list overrides",
        },
        500
      );
    }
  });

  app.get("/overrides/:featureId", async (c) => {
    try {
      const override = await modelKit.getConfig(c.req.param("featureId"));
      if (!override) return c.json({ error: "Override not found" }, 404);
      return c.json(override);
    } catch (error) {
      return c.json(
        {
          error:
            error instanceof Error ? error.message : "Failed to get override",
        },
        500
      );
    }
  });

  app.post("/overrides/:featureId", async (c) => {
    try {
      const override = await c.req.json();
      if (!override.modelId)
        return c.json({ error: "modelId is required" }, 400);
      await modelKit.setOverride(c.req.param("featureId"), override);
      return c.json({ success: true });
    } catch (error) {
      return c.json(
        {
          error:
            error instanceof Error ? error.message : "Failed to set override",
        },
        500
      );
    }
  });

  app.delete("/overrides/:featureId", async (c) => {
    try {
      await modelKit.clearOverride(c.req.param("featureId"));
      return c.json({ success: true });
    } catch (error) {
      return c.json(
        {
          error:
            error instanceof Error ? error.message : "Failed to clear override",
        },
        500
      );
    }
  });

  return app;
}
