import { Router, type Request, type Response } from "express";
import type { ModelKit } from "../types.js";
import { renderStudioHtml } from "../studio-bundle.js";

export interface CreateExpressRouterOptions {
  /**
   * Serve the ModelKit Studio UI at /__studio.
   * Default: true
   */
  studio?: boolean;
  /**
   * Override the path where the Studio UI is served.
   * Default: "/__studio"
   */
  studioPath?: string;
}

/**
 * Create an Express router for ModelKit.
 * Mounts REST API endpoints and (by default) serves the Studio UI.
 *
 * @example
 * ```ts
 * import express from "express";
 * import { createModelKit, createRedisAdapter } from "@benrobo/modelkit";
 * import { createModelKitExpressRouter } from "@benrobo/modelkit/express";
 *
 * const app = express();
 * app.use(express.json());
 * const modelKit = createModelKit(createRedisAdapter({ url: process.env.REDIS_URL }));
 *
 * app.use("/api/modelkit", createModelKitExpressRouter(modelKit));
 * // Studio UI → http://localhost:3000/__studio
 * ```
 */
export function createModelKitExpressRouter(
  modelKit: ModelKit,
  options: CreateExpressRouterOptions = {}
): Router {
  const router = Router();
  const serveStudio = options.studio !== false;
  const studioPath = (options.studioPath ?? "/__studio").replace(/\/$/, "");

  if (serveStudio) {
    router.get(studioPath, (req: Request, res: Response) => {
      const protocol = req.protocol;
      const host = req.get("host") ?? "localhost";
      const mountPath = (req.baseUrl ?? "").replace(/\/$/, "");
      const apiUrl = `${protocol}://${host}${mountPath}`;
      res.setHeader("Content-Type", "text/html; charset=utf-8");
      res.send(renderStudioHtml(apiUrl));
    });
  }

  router.get("/overrides", async (_req: Request, res: Response) => {
    try {
      res.json(await modelKit.listOverrides());
    } catch (error) {
      res
        .status(500)
        .json({
          error:
            error instanceof Error ? error.message : "Failed to list overrides",
        });
    }
  });

  router.get("/overrides/:featureId", async (req: Request, res: Response) => {
    try {
      const override = await modelKit.getConfig(String(req.params.featureId));
      if (!override)
        return res.status(404).json({ error: "Override not found" });
      res.json(override);
    } catch (error) {
      res
        .status(500)
        .json({
          error:
            error instanceof Error ? error.message : "Failed to get override",
        });
    }
  });

  router.post("/overrides/:featureId", async (req: Request, res: Response) => {
    try {
      const override = req.body;
      if (!override.modelId)
        return res.status(400).json({ error: "modelId is required" });
      await modelKit.setOverride(String(req.params.featureId), override);
      res.json({ success: true });
    } catch (error) {
      res
        .status(500)
        .json({
          error:
            error instanceof Error ? error.message : "Failed to set override",
        });
    }
  });

  router.delete(
    "/overrides/:featureId",
    async (req: Request, res: Response) => {
      try {
        await modelKit.clearOverride(String(req.params.featureId));
        res.json({ success: true });
      } catch (error) {
        res
          .status(500)
          .json({
            error:
              error instanceof Error
                ? error.message
                : "Failed to clear override",
          });
      }
    }
  );

  return router;
}
