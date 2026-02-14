/**
 * Express router for ModelKit
 * Provides ready-to-use REST API endpoints
 */

import { Router, type Request, type Response } from "express";
import type { ModelKit } from "../types.js";

/**
 * Create an Express router for ModelKit.
 * Mount this in your Express app to expose ModelKit via REST API.
 *
 * @example
 * ```ts
 * import express from "express";
 * import { createModelKit, createRedisAdapter, createModelKitExpressRouter } from "modelkit";
 *
 * const app = express();
 * app.use(express.json());
 *
 * const adapter = createRedisAdapter({ url: process.env.REDIS_URL });
 * const modelKit = createModelKit(adapter);
 *
 * app.use("/api/modelkit", createModelKitExpressRouter(modelKit));
 * ```
 */
export function createModelKitExpressRouter(modelKit: ModelKit): Router {
  const router = Router();

  // GET /overrides - List all overrides
  router.get("/overrides", async (_req: Request, res: Response) => {
    try {
      const overrides = await modelKit.listOverrides();
      res.json(overrides);
    } catch (error) {
      res.status(500).json({
        error: error instanceof Error ? error.message : "Failed to list overrides",
      });
    }
  });

  // GET /overrides/:featureId - Get specific override
  router.get("/overrides/:featureId", async (req: Request, res: Response) => {
    try {
      const featureId = String(req.params.featureId);
      const override = await modelKit.getConfig(featureId);

      if (!override) {
        return res.status(404).json({ error: "Override not found" });
      }

      res.json(override);
    } catch (error) {
      res.status(500).json({
        error: error instanceof Error ? error.message : "Failed to get override",
      });
    }
  });

  // POST /overrides/:featureId - Set override
  router.post("/overrides/:featureId", async (req: Request, res: Response) => {
    try {
      const featureId = String(req.params.featureId);
      const override = req.body;

      if (!override.modelId) {
        return res.status(400).json({ error: "modelId is required" });
      }

      await modelKit.setOverride(featureId, override);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({
        error: error instanceof Error ? error.message : "Failed to set override",
      });
    }
  });

  // DELETE /overrides/:featureId - Clear override
  router.delete("/overrides/:featureId", async (req: Request, res: Response) => {
    try {
      const featureId = String(req.params.featureId);
      await modelKit.clearOverride(featureId);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({
        error: error instanceof Error ? error.message : "Failed to clear override",
      });
    }
  });

  return router;
}
