/**
 * Basic ModelKit usage example
 */

import { createModelKit, createRedisAdapter } from "modelkit";

// Create a Redis storage adapter
const adapter = createRedisAdapter({
  url: process.env.REDIS_URL || "redis://localhost:6379",
  prefix: "myapp:models:" // Optional: custom key prefix
});

// Create ModelKit instance with in-memory caching
const modelKit = createModelKit(adapter, {
  cacheTTL: 60000 // Cache lookups for 60s (default)
});

// Example: Get model for a feature
async function getChatbotModel() {
  // Always provide a fallback model for reliability
  const modelId = await modelKit.getModel(
    "chatbot",
    "anthropic/claude-3.5-sonnet" // Fallback if no override exists
  );

  console.log("Using model:", modelId);
  return modelId;
}

// Example: Set a runtime override
async function updateChatbotModel() {
  await modelKit.setOverride("chatbot", {
    modelId: "anthropic/claude-opus-4",
    temperature: 0.9,
    maxTokens: 4096
  });

  console.log("Override set! Changes take effect immediately.");
}

// Example: Check current override
async function checkOverride() {
  const override = await modelKit.getConfig("chatbot");

  if (override) {
    console.log("Current override:", override);
  } else {
    console.log("No override set, using fallback");
  }
}

// Example: List all overrides
async function listAllOverrides() {
  const overrides = await modelKit.listOverrides();

  console.log("Active overrides:");
  for (const { featureId, override } of overrides) {
    console.log(`  ${featureId}: ${override.modelId}`);
  }
}

// Example: Clear an override
async function clearChatbotOverride() {
  await modelKit.clearOverride("chatbot");
  console.log("Override cleared!");
}

// Run examples
async function main() {
  try {
    await getChatbotModel();
    await checkOverride();
    await updateChatbotModel();
    await getChatbotModel(); // Now uses the override
    await listAllOverrides();
    await clearChatbotOverride();
    await getChatbotModel(); // Back to fallback
  } catch (error) {
    console.error("Error:", error);
  }
}

main();
