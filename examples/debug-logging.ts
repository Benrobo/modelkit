import { createModelKit, createRedisAdapter } from "@benrobo/modelkit";

const adapter = createRedisAdapter({
  url: process.env.REDIS_URL || "redis://localhost:6379",
});

const modelKit = createModelKit(adapter, {
  debug: true,
  cacheTTL: 60000,
});

async function example() {
  console.log("--- Example: Debug Logging ---\n");

  await modelKit.getModel("chatbot", "anthropic/claude-3.5-sonnet");

  await modelKit.setOverride("chatbot", {
    modelId: "anthropic/claude-opus-4",
    temperature: 0.9,
    maxTokens: 4096,
  });

  await modelKit.getModel("chatbot", "anthropic/claude-3.5-sonnet");

  await modelKit.getModel("chatbot", "anthropic/claude-3.5-sonnet");

  await modelKit.clearOverride("chatbot");
}

example();
