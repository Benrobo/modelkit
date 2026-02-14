import { createModelKit, createRedisAdapter } from "modelkit";

const adapter = createRedisAdapter({
  url: process.env.REDIS_URL || "redis://localhost:6379"
});

const modelKit = createModelKit(adapter);

async function example() {
  // Get model with fallback
  const modelId = await modelKit.getModel("chatbot", "anthropic/claude-3.5-sonnet");
  console.log("Using model:", modelId);

  // Check current override
  const override = await modelKit.getConfig("chatbot");
  console.log("Current override:", override);

  // Set runtime override
  await modelKit.setOverride("chatbot", {
    modelId: "anthropic/claude-opus-4",
    temperature: 0.9,
    maxTokens: 4096
  });

  // List all overrides
  const overrides = await modelKit.listOverrides();
  console.log("Active overrides:", overrides);

  // Clear override
  await modelKit.clearOverride("chatbot");
}

example();
