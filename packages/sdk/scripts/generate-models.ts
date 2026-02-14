#!/usr/bin/env bun
interface OpenRouterModel {
  id: string;
  name: string;
}

async function generateModelTypes() {
  console.log("Fetching models from OpenRouter...");

  const response = await fetch("https://openrouter.ai/api/v1/models");
  const data = (await response.json()) as { data: OpenRouterModel[] };

  const modelIds = data.data.map((m) => m.id).sort();

  console.log(`Found ${modelIds.length} models`);

  // Generate TypeScript union type
  const typeDefinition = `/**
 * OpenRouter model IDs - strictly typed
 * Auto-generated from https://openrouter.ai/api/v1/models
 * Last updated: ${new Date().toISOString()}
 *
 * This type is strictly typed to only accept valid OpenRouter model IDs.
 * Passing an invalid model ID will result in a TypeScript error.
 */
export type OpenRouterModelId =
${modelIds.map((id) => `  | "${id}"`).join("\n")};

/**
 * Model ID type - strictly typed OpenRouter models only
 * For custom/private models, use type assertion: "custom-model" as ModelId
 */
export type ModelId = OpenRouterModelId;
`;

  await Bun.write("src/models.ts", typeDefinition);

  console.log("✅ Generated src/models.ts");
  console.log(`   ${modelIds.length} model IDs`);
}

generateModelTypes().catch(console.error);
