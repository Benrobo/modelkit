import { createModelKit, type StorageAdapter, type ModelOverride } from "@benrobo/modelkit";
import { readFileSync, writeFileSync } from "fs";

function createFileAdapter(filepath: string): StorageAdapter {
  let data: Record<string, ModelOverride> = {};

  try {
    data = JSON.parse(readFileSync(filepath, "utf-8"));
  } catch {}

  const save = () => writeFileSync(filepath, JSON.stringify(data, null, 2));

  return {
    async get(featureId) {
      return data[featureId] || null;
    },

    async set(featureId, override) {
      data[featureId] = { ...override, updatedAt: Date.now() };
      save();
    },

    async delete(featureId) {
      delete data[featureId];
      save();
    },

    async list() {
      return Object.entries(data).map(([featureId, override]) => ({
        featureId,
        override
      }));
    }
  };
}

const modelKit = createModelKit(createFileAdapter("./overrides.json"));

async function demo() {
  await modelKit.setOverride("chatbot", {
    modelId: "anthropic/claude-opus-4"
  });

  const modelId = await modelKit.getModel("chatbot", "anthropic/claude-3.5-sonnet");
  console.log("Using model:", modelId);
}

demo();
