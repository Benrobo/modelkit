/**
 * Custom storage adapter example
 * Shows how to implement your own storage backend
 */

import { createModelKit, type StorageAdapter, type ModelOverride } from "modelkit";

// Example: Simple file-based storage adapter
function createFileAdapter(filepath: string): StorageAdapter {
  let data: Record<string, ModelOverride> = {};

  // Load data from file on init
  try {
    const content = require("fs").readFileSync(filepath, "utf-8");
    data = JSON.parse(content);
  } catch {
    // File doesn't exist yet
  }

  function save() {
    require("fs").writeFileSync(filepath, JSON.stringify(data, null, 2));
  }

  return {
    async get(featureId: string): Promise<ModelOverride | null> {
      return data[featureId] || null;
    },

    async set(featureId: string, override: ModelOverride): Promise<void> {
      data[featureId] = {
        ...override,
        updatedAt: Date.now()
      };
      save();
    },

    async delete(featureId: string): Promise<void> {
      delete data[featureId];
      save();
    },

    async list(): Promise<Array<{ featureId: string; override: ModelOverride }>> {
      return Object.entries(data).map(([featureId, override]) => ({
        featureId,
        override
      }));
    }
  };
}

// Example: PostgreSQL storage adapter
function createPostgresAdapter(connectionString: string): StorageAdapter {
  // Pseudo-code - implement with your DB library
  return {
    async get(featureId: string): Promise<ModelOverride | null> {
      // SELECT * FROM model_overrides WHERE feature_id = $1
      return null;
    },

    async set(featureId: string, override: ModelOverride): Promise<void> {
      // INSERT INTO model_overrides ... ON CONFLICT UPDATE
    },

    async delete(featureId: string): Promise<void> {
      // DELETE FROM model_overrides WHERE feature_id = $1
    },

    async list(): Promise<Array<{ featureId: string; override: ModelOverride }>> {
      // SELECT * FROM model_overrides
      return [];
    }
  };
}

// Use your custom adapter
const modelKit = createModelKit(
  createFileAdapter("./model-overrides.json")
);

async function demo() {
  await modelKit.setOverride("chatbot", {
    modelId: "anthropic/claude-opus-4"
  });

  const modelId = await modelKit.getModel("chatbot", "anthropic/claude-3.5-sonnet");
  console.log("Using model:", modelId);
}

demo();
